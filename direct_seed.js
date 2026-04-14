import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BUILDINGS = [
  { id: 'bld-001', name: 'Villa Ennasr', type: 'residential', address: 'Ennasr, Tunis', city: 'Tunis', surface: 280, occupants: 6, monthly_budget_kwh: 800 },
  { id: 'bld-002', name: 'Bureau Lac 2', type: 'commercial', address: 'Lac 2, Tunis', city: 'Tunis', surface: 450, occupants: 20, monthly_budget_kwh: 2000 },
  { id: 'bld-003', name: 'Entrepôt Mégrine', type: 'industrial', address: 'Mégrine', city: 'Ben Arous', surface: 1200, occupants: 8, monthly_budget_kwh: 5000 },
  { id: 'bld-004', name: 'Appartement Sfax', type: 'residential', address: 'Centre Sfax', city: 'Sfax', surface: 120, occupants: 4, monthly_budget_kwh: 400 },
  { id: 'bld-005', name: 'Agence Sfax Centre', type: 'commercial', address: 'Av. Bourguiba', city: 'Sfax', surface: 200, occupants: 12, monthly_budget_kwh: 900 }
];

const DEVICES = [
  { id: 'dev-001', building_id: 'bld-001', name: 'Clim Salon', type: 'air_conditioner', location: 'Salon', nominal_power: 1200, is_on: true, status: 'online' },
  { id: 'dev-002', building_id: 'bld-001', name: 'Chauffe-eau', type: 'water_heater', location: 'SDB', nominal_power: 2000, is_on: false, status: 'online' },
  { id: 'dev-003', building_id: 'bld-002', name: 'HVAC Bureau', type: 'hvac_central', location: 'Général', nominal_power: 8000, is_on: true, status: 'online' },
  { id: 'dev-004', building_id: 'bld-002', name: 'Serveurs', type: 'server_rack', location: 'Salle', nominal_power: 3500, is_on: true, status: 'online' },
  { id: 'dev-005', building_id: 'bld-003', name: 'Compresseur', type: 'other', location: 'Zone A', nominal_power: 6000, is_on: true, status: 'online' }
];

async function seed() {
  console.log('Logging in...');
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'adelfiras78@gmail.com',
    password: 'adelfiras78'
  });
  
  if (authErr) {
    console.error('Auth crash:', authErr.message);
    return;
  }
  const UID = auth.user.id;
  console.log('Logged in! True UUID:', UID);

  // Disable RLS if possible using RPC? No RPC exists. We assume they disabled it or we are inserting with correct UID anyway.
  console.log('Inserting Buildings...');
  for (let b of BUILDINGS) {
    const dbBld = {
      id: "b2d00111-2000-4000-8000-" + b.id.replace('bld-','000000000'),
      owner_id: UID,
      name: b.name,
      type: b.type,
      address: b.address,
      city: b.city,
      country: 'TN',
      surface: b.surface,
      occupants: b.occupants,
      monthly_budget_kwh: b.monthly_budget_kwh,
      electricity_rate: 0.3,
      currency: 'TND',
      timezone: 'Africa/Tunis',
      is_active: true
    };
    const { error: e1 } = await supabase.from('buildings').upsert(dbBld);
    if (e1) console.error('Building Error on', b.name, ':', e1.message);
  }

  console.log('Inserting Devices...');
  for (let d of DEVICES) {
    const dbDev = {
      id: "d3e00111-2000-4000-8000-" + d.id.replace('dev-','000000000'),
      building_id: "b2d00111-2000-4000-8000-" + d.building_id.replace('bld-','000000000'),
      name: d.name,
      type: d.type === 'server_rack' || d.type === 'hvac_central' ? 'other' : d.type,
      location: d.location,
      nominal_power: d.nominal_power,
      status: d.status,
      is_on: d.is_on
    };
    const { error: e2 } = await supabase.from('devices').upsert(dbDev);
    if (e2) console.error('Device Error on', d.name, ':', e2.message);
  }

  // Double check
  const { data: check } = await supabase.from('buildings').select('*');
  console.log('FINAL SEED CHECK: Found', check?.length || 0, 'buildings directly inside Supabase!');
}
seed();
