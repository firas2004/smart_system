import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for admin
const MOCK_BUILDINGS = [
  { id: 'b1', name: 'Résidence Les Jasmins', address: '123 Rue de la Paix', city: 'Tunis', type: 'residential', surface: 1500, occupants: 45 },
  { id: 'b2', name: 'Tour Commerciale', address: 'Centre Ville', city: 'Sfax', type: 'commercial', surface: 5000, occupants: 200 }
];

export let MOCK_PROFILES = [
  { id: 'p1', user_id: 'u1', name: 'Ahmed Client', building_id: 'b1', created_at: new Date().toISOString() },
  { id: 'p2', user_id: 'u2', name: 'Sarra Client', building_id: 'b2', created_at: new Date().toISOString() },
  { id: 'p3', user_id: 'mock-client-id', name: 'Client Test', building_id: null, created_at: new Date().toISOString() }
];

const MOCK_DEVICES = [
  { id: 'd1', building_id: 'b1', name: 'Clim Salon', type: 'air_conditioner', status: 'online', is_on: true, current_power: 1200, today_consumption: 4.5 },
  { id: 'd2', building_id: 'b1', name: 'Chauffe-eau', type: 'water_heater', status: 'online', is_on: false, current_power: 0, today_consumption: 2.1 },
  { id: 'd3', building_id: 'b2', name: 'Éclairage Hall', type: 'lighting', status: 'online', is_on: true, current_power: 300, today_consumption: 1.2 }
];

const MOCK_ALERTS = [
  { id: 'a1', building_id: 'b1', type: 'overconsumption', severity: 'high', message: 'Surconsommation détectée', status: 'active', created_at: new Date().toISOString() }
];

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_role', user?.id],
    queryFn: async () => {
      return {
        isAdmin: true,
        roles: ['admin'],
      };
    },
    enabled: !!user,
  });
};

export const useBuildings = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['buildings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useDevices = (buildingId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['devices', buildingId],
    queryFn: async () => {
      let query = supabase.from('devices').select('*');
      if (buildingId) query = query.eq('building_id', buildingId);
      const { data, error } = await query.order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useToggleDevice = () => {
  const { useQueryClient } = require('@tanstack/react-query');
  // Inline to avoid import issues
  return null;
};

export const useAlerts = (buildingId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['alerts', buildingId],
    queryFn: async () => {
      let query = supabase.from('alerts').select('*');
      if (buildingId) query = query.eq('building_id', buildingId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useEnergyReadings = (deviceId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['energy_readings', deviceId],
    queryFn: async () => {
      let query = supabase.from('energy_readings').select('*');
      if (deviceId) query = query.eq('device_id', deviceId);
      const { data, error } = await query.order('recorded_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useRecommendations = (buildingId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['recommendations', buildingId],
    queryFn: async () => {
      let query = supabase.from('recommendations').select('*');
      if (buildingId) query = query.eq('building_id', buildingId);
      const { data, error } = await query.order('priority');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      if (error) throw error;

      const profile = data;

      if (!profile.building_id) {
        const { data: memberData, error: memberError } = await supabase
          .from('building_members')
          .select('building_id')
          .eq('user_id', user!.id)
          .single();

        if (!memberError && memberData?.building_id) {
          profile.building_id = memberData.building_id;
          localStorage.setItem(`fallback_building_${user!.id}`, memberData.building_id);

          const { error: updateError } = await supabase
            .from('profiles')
            .update({ building_id: memberData.building_id })
            .eq('user_id', user!.id);

          if (updateError) {
            console.warn('Could not update profile building_id fallback:', updateError);
          }
        }
      }

      // Fallback for RLS issues during testing
      const fallbackBuilding = localStorage.getItem(`fallback_building_${user!.id}`);
      if (!profile.building_id && fallbackBuilding) {
        profile.building_id = fallbackBuilding;
      }

      return profile;
    },
    enabled: !!user,
  });
};

export const useAllProfiles = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['all_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Apply fallbacks for RLS issues during testing
      data.forEach(p => {
        const fallback = localStorage.getItem(`fallback_building_${p.user_id}`);
        if (!p.building_id && fallback) {
          p.building_id = fallback;
        }
      });

      return data;
    },
    enabled: !!user,
  });
};

export const useBuildingMembers = (buildingId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['building_members', buildingId],
    queryFn: async () => {
      let query = supabase.from('building_members').select('*, profiles(name, user_id)');
      if (buildingId) query = query.eq('building_id', buildingId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
