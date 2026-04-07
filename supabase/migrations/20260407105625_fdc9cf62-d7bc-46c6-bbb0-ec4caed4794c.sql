
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
  SELECT building_id FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1
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
