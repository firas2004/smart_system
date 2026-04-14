-- Migration 1: Initial schema
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'viewer');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  phone TEXT,
  preferences JSONB DEFAULT '{"language": "fr", "theme": "dark", "notifications": {"email": true, "push": true, "sms": false}}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Buildings table
CREATE TABLE public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'TN',
  type TEXT NOT NULL DEFAULT 'residential' CHECK (type IN ('residential', 'commercial', 'industrial')),
  surface NUMERIC,
  occupants INTEGER,
  electricity_rate NUMERIC DEFAULT 0.3,
  currency TEXT DEFAULT 'TND',
  monthly_budget_kwh NUMERIC DEFAULT 500,
  peak_hours_start TIME DEFAULT '18:00',
  peak_hours_end TIME DEFAULT '22:00',
  timezone TEXT DEFAULT 'Africa/Tunis',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can do everything on their buildings" ON public.buildings FOR ALL USING (auth.uid() = owner_id);

-- Devices table
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('air_conditioner', 'water_heater', 'refrigerator', 'washing_machine', 'lighting', 'other')),
  brand TEXT,
  model TEXT,
  location TEXT,
  nominal_power NUMERIC,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error')),
  is_on BOOLEAN DEFAULT false,
  current_power NUMERIC DEFAULT 0,
  today_consumption NUMERIC DEFAULT 0,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage devices in their buildings" ON public.devices FOR ALL
  USING (EXISTS (SELECT 1 FROM public.buildings WHERE buildings.id = devices.building_id AND buildings.owner_id = auth.uid()));

-- Energy readings (time series)
CREATE TABLE public.energy_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  voltage NUMERIC,
  current_amp NUMERIC,
  power NUMERIC,
  power_factor NUMERIC,
  energy_kwh NUMERIC,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.energy_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view readings for their devices" ON public.energy_readings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.devices d
    JOIN public.buildings b ON b.id = d.building_id
    WHERE d.id = energy_readings.device_id AND b.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert readings for their devices" ON public.energy_readings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.devices d
    JOIN public.buildings b ON b.id = d.building_id
    WHERE d.id = energy_readings.device_id AND b.owner_id = auth.uid()
  ));

-- Index for time series queries
CREATE INDEX idx_energy_readings_device_time ON public.energy_readings (device_id, recorded_at DESC);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('overconsumption', 'device_offline', 'anomaly', 'budget_exceeded')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts for their buildings" ON public.alerts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.buildings WHERE buildings.id = alerts.building_id AND buildings.owner_id = auth.uid()));

-- Recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_saving_kwh NUMERIC,
  estimated_saving_tnd NUMERIC,
  is_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recommendations for their buildings" ON public.recommendations FOR ALL
  USING (EXISTS (SELECT 1 FROM public.buildings WHERE buildings.id = recommendations.building_id AND buildings.owner_id = auth.uid()));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Migration 2: Updates
-- Add building_id to profiles for client-building association
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL;

-- Create building_members table for explicit membership
CREATE TABLE IF NOT EXISTS public.building_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(building_id, user_id)
);
ALTER TABLE public.building_members ENABLE ROW LEVEL SECURITY;

-- Security definer: check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- Security definer: get user's building_id
CREATE OR REPLACE FUNCTION public.get_user_building(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT building_id FROM public.profiles WHERE user_id = _user_id LIMIT 1),
    (SELECT building_id FROM public.building_members WHERE user_id = _user_id LIMIT 1)
  )
$$;

-- Drop old policies
DROP POLICY IF EXISTS "Owners can do everything on their buildings" ON public.buildings;
DROP POLICY IF EXISTS "Users can manage devices in their buildings" ON public.devices;
DROP POLICY IF EXISTS "Users can view readings for their devices" ON public.energy_readings;
DROP POLICY IF EXISTS "Users can insert readings for their devices" ON public.energy_readings;
DROP POLICY IF EXISTS "Users can view alerts for their buildings" ON public.alerts;
DROP POLICY IF EXISTS "Users can view recommendations for their buildings" ON public.recommendations;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- BUILDINGS policies: admins see all, clients see only their building
CREATE POLICY "Admins manage all buildings" ON public.buildings
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients view own building" ON public.buildings
  FOR SELECT USING (id = public.get_user_building(auth.uid()));

-- DEVICES policies: admins see all, clients see devices in their building
CREATE POLICY "Admins manage all devices" ON public.devices
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients view devices in their building" ON public.devices
  FOR SELECT USING (building_id = public.get_user_building(auth.uid()));

CREATE POLICY "Clients can add devices to their building" ON public.devices
  FOR INSERT WITH CHECK (building_id = public.get_user_building(auth.uid()));

CREATE POLICY "Clients can update their building devices" ON public.devices
  FOR UPDATE USING (building_id = public.get_user_building(auth.uid()));

-- ENERGY_READINGS policies
CREATE POLICY "Admins view all readings" ON public.energy_readings
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients view readings for their devices" ON public.energy_readings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.devices d
      WHERE d.id = energy_readings.device_id
      AND d.building_id = public.get_user_building(auth.uid())
    )
  );

-- ALERTS policies
CREATE POLICY "Admins manage all alerts" ON public.alerts
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients view alerts for their building" ON public.alerts
  FOR SELECT USING (building_id = public.get_user_building(auth.uid()));

-- RECOMMENDATIONS policies
CREATE POLICY "Admins manage all recommendations" ON public.recommendations
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Clients view recommendations for their building" ON public.recommendations
  FOR SELECT USING (building_id = public.get_user_building(auth.uid()));

-- USER_ROLES policies
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- BUILDING_MEMBERS policies
CREATE POLICY "Admins manage members" ON public.building_members
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Members view own membership" ON public.building_members
  FOR SELECT USING (auth.uid() = user_id);

-- Update the new user trigger: new users get 'viewer' role (clients), not admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  
  -- New users are clients by default (viewer role)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;