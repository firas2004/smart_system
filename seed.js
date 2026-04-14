/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║     SMART ENERGY AIoT — COMPLETE DATA SEEDER                ║
 * ║     Supabase (PostgreSQL) + InfluxDB (Time Series)          ║
 * ║     90 jours de données réalistes pour dashboard port 3000  ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { createClient } from '@supabase/supabase-js';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import dotenv from 'dotenv';
dotenv.config();

// ─── CONFIG ───────────────────────────────────────────────────────
const SUPABASE_URL      = process.env.VITE_SUPABASE_URL      || 'https://YOURPROJECT.supabase.co';
const SUPABASE_KEY      = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'YOUR_SERVICE_ROLE_KEY';
const INFLUX_URL        = process.env.INFLUX_URL        || 'http://localhost:8086';
const INFLUX_TOKEN      = process.env.INFLUX_TOKEN      || 'YOUR_INFLUXDB_TOKEN';
const INFLUX_ORG        = process.env.INFLUX_ORG        || 'smartenergy';
const INFLUX_BUCKET     = process.env.INFLUX_BUCKET     || 'energy_data';

const SEED_DAYS         = 90;   // 90 jours d'historique
const INTERVAL_SECONDS  = 300;  // 1 point toutes les 5 minutes

// ─── CLIENTS ──────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const influx   = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
const writeApi = influx.getWriteApi(INFLUX_ORG, INFLUX_BUCKET, 's');

// ═══════════════════════════════════════════════════════════════════
// 1. DONNÉES DE RÉFÉRENCE
// ═══════════════════════════════════════════════════════════════════

const CLIENTS = [
  { id: 'client-001', name: 'Ahmed Ben Ali',     email: 'ahmed@smartenergy.tn',   phone: '+21625001001', role: 'admin',   city: 'Tunis' },
  { id: 'client-002', name: 'Fatma Trabelsi',    email: 'fatma@smartenergy.tn',   phone: '+21625001002', role: 'manager', city: 'Sfax' },
  { id: 'client-003', name: 'Mohamed Jebali',    email: 'mohamed@smartenergy.tn', phone: '+21625001003', role: 'admin',   city: 'Sousse' },
  { id: 'client-004', name: 'Leila Mansouri',    email: 'leila@smartenergy.tn',   phone: '+21625001004', role: 'viewer',  city: 'Monastir' },
  { id: 'client-005', name: 'Karim Chaouch',     email: 'karim@smartenergy.tn',   phone: '+21625001005', role: 'admin',   city: 'Tunis' },
];

const BUILDINGS = [
  // Client 001 — Ahmed (3 bâtiments)
  { id: 'bld-001', client_id: 'client-001', name: 'Villa Ennasr',         type: 'residential', address: 'Ennasr, Tunis',      surface: 280, occupants: 6,  monthly_budget_kwh: 800  },
  { id: 'bld-002', client_id: 'client-001', name: 'Bureau Lac 2',         type: 'commercial',  address: 'Lac 2, Tunis',        surface: 450, occupants: 20, monthly_budget_kwh: 2000 },
  { id: 'bld-003', client_id: 'client-001', name: 'Entrepôt Mégrine',     type: 'industrial',  address: 'Mégrine, Ben Arous',  surface: 1200,occupants: 8,  monthly_budget_kwh: 5000 },
  // Client 002 — Fatma (2 bâtiments)
  { id: 'bld-004', client_id: 'client-002', name: 'Appartement Sfax',     type: 'residential', address: 'Centre Sfax',         surface: 120, occupants: 4,  monthly_budget_kwh: 400  },
  { id: 'bld-005', client_id: 'client-002', name: 'Agence Sfax Centre',   type: 'commercial',  address: 'Av. Bourguiba, Sfax', surface: 200, occupants: 12, monthly_budget_kwh: 900  },
  // Client 003 — Mohamed (2 bâtiments)
  { id: 'bld-006', client_id: 'client-003', name: 'Résidence Kantaoui',   type: 'residential', address: 'Port Kantaoui, Sousse', surface: 180, occupants: 5, monthly_budget_kwh: 600 },
  { id: 'bld-007', client_id: 'client-003', name: 'Hôtel Sousse Beach',   type: 'commercial',  address: 'Corniche Sousse',     surface: 3500,occupants: 120,monthly_budget_kwh: 15000},
  // Client 004 — Leila
  { id: 'bld-008', client_id: 'client-004', name: 'Villa Monastir',       type: 'residential', address: 'Monastir Centre',     surface: 160, occupants: 3,  monthly_budget_kwh: 500  },
  // Client 005 — Karim
  { id: 'bld-009', client_id: 'client-005', name: 'Siège Social Tunis',   type: 'commercial',  address: 'Centre Urbain Nord',  surface: 800, occupants: 35, monthly_budget_kwh: 3500 },
  { id: 'bld-010', client_id: 'client-005', name: 'Datacenter Ariana',    type: 'industrial',  address: 'Ariana, Tunis',       surface: 600, occupants: 4,  monthly_budget_kwh: 12000},
];

const DEVICE_TYPES = {
  air_conditioner: { icon: '❄️',  base_power: 1200, stddev: 200, usage_profile: 'daytime_summer' },
  water_heater:    { icon: '🚿',  base_power: 2000, stddev: 100, usage_profile: 'morning_evening' },
  refrigerator:    { icon: '🧊',  base_power: 150,  stddev: 30,  usage_profile: 'always_on' },
  washing_machine: { icon: '👕',  base_power: 2200, stddev: 300, usage_profile: 'sporadic' },
  lighting:        { icon: '💡',  base_power: 200,  stddev: 50,  usage_profile: 'evening' },
  server_rack:     { icon: '🖥️',  base_power: 3500, stddev: 500, usage_profile: 'always_on' },
  elevator:        { icon: '🛗',  base_power: 5000, stddev: 800, usage_profile: 'business_hours' },
  hvac_central:    { icon: '🌡️',  base_power: 8000, stddev: 1000,usage_profile: 'business_hours' },
  pump:            { icon: '⚙️',  base_power: 4000, stddev: 400, usage_profile: 'sporadic' },
  compressor:      { icon: '🔧',  base_power: 6000, stddev: 600, usage_profile: 'industrial' },
};

// Devices par bâtiment
const DEVICES = [
  // BLD-001 Villa Ennasr (résidentiel)
  { id: 'dev-001', building_id: 'bld-001', client_id: 'client-001', name: 'Clim Salon',        type: 'air_conditioner', location: 'Salon',       nominal_power: 1200 },
  { id: 'dev-002', building_id: 'bld-001', client_id: 'client-001', name: 'Clim Chambre 1',    type: 'air_conditioner', location: 'Chambre 1',   nominal_power: 900  },
  { id: 'dev-003', building_id: 'bld-001', client_id: 'client-001', name: 'Chauffe-eau',        type: 'water_heater',    location: 'Salle de bain',nominal_power: 2000 },
  { id: 'dev-004', building_id: 'bld-001', client_id: 'client-001', name: 'Réfrigérateur',      type: 'refrigerator',    location: 'Cuisine',     nominal_power: 150  },
  { id: 'dev-005', building_id: 'bld-001', client_id: 'client-001', name: 'Éclairage Général',  type: 'lighting',        location: 'Général',     nominal_power: 300  },

  // BLD-002 Bureau Lac 2 (commercial)
  { id: 'dev-006', building_id: 'bld-002', client_id: 'client-001', name: 'HVAC Bureau',        type: 'hvac_central',    location: 'Général',     nominal_power: 8000 },
  { id: 'dev-007', building_id: 'bld-002', client_id: 'client-001', name: 'Serveurs IT',        type: 'server_rack',     location: 'Salle serveur',nominal_power: 3500 },
  { id: 'dev-008', building_id: 'bld-002', client_id: 'client-001', name: 'Ascenseur',          type: 'elevator',        location: 'Hall',        nominal_power: 5000 },
  { id: 'dev-009', building_id: 'bld-002', client_id: 'client-001', name: 'Éclairage Open Space',type: 'lighting',       location: 'Open Space',  nominal_power: 500  },

  // BLD-003 Entrepôt Mégrine (industriel)
  { id: 'dev-010', building_id: 'bld-003', client_id: 'client-001', name: 'Compresseur 1',      type: 'compressor',      location: 'Zone A',      nominal_power: 6000 },
  { id: 'dev-011', building_id: 'bld-003', client_id: 'client-001', name: 'Compresseur 2',      type: 'compressor',      location: 'Zone B',      nominal_power: 6000 },
  { id: 'dev-012', building_id: 'bld-003', client_id: 'client-001', name: 'Pompe Hydraulique',  type: 'pump',            location: 'Zone C',      nominal_power: 4000 },

  // BLD-004 Appartement Sfax
  { id: 'dev-013', building_id: 'bld-004', client_id: 'client-002', name: 'Clim Salon',         type: 'air_conditioner', location: 'Salon',       nominal_power: 900  },
  { id: 'dev-014', building_id: 'bld-004', client_id: 'client-002', name: 'Chauffe-eau',         type: 'water_heater',    location: 'SDB',         nominal_power: 1500 },
  { id: 'dev-015', building_id: 'bld-004', client_id: 'client-002', name: 'Machine à laver',    type: 'washing_machine', location: 'Buanderie',   nominal_power: 2200 },

  // BLD-005 Agence Sfax
  { id: 'dev-016', building_id: 'bld-005', client_id: 'client-002', name: 'Clim Agence',        type: 'air_conditioner', location: 'Espace client',nominal_power: 2400 },
  { id: 'dev-017', building_id: 'bld-005', client_id: 'client-002', name: 'Éclairage Agence',   type: 'lighting',        location: 'Général',     nominal_power: 400  },

  // BLD-006 Résidence Kantaoui
  { id: 'dev-018', building_id: 'bld-006', client_id: 'client-003', name: 'Piscine Pompe',      type: 'pump',            location: 'Jardin',      nominal_power: 1500 },
  { id: 'dev-019', building_id: 'bld-006', client_id: 'client-003', name: 'Clim Master',        type: 'air_conditioner', location: 'Chambre master',nominal_power: 1200},

  // BLD-007 Hôtel Sousse (gros consommateur)
  { id: 'dev-020', building_id: 'bld-007', client_id: 'client-003', name: 'HVAC Principal',     type: 'hvac_central',    location: 'Général',     nominal_power: 15000},
  { id: 'dev-021', building_id: 'bld-007', client_id: 'client-003', name: 'Ascenseur 1',        type: 'elevator',        location: 'Aile A',      nominal_power: 5000 },
  { id: 'dev-022', building_id: 'bld-007', client_id: 'client-003', name: 'Ascenseur 2',        type: 'elevator',        location: 'Aile B',      nominal_power: 5000 },
  { id: 'dev-023', building_id: 'bld-007', client_id: 'client-003', name: 'Cuisine Industrielle',type: 'compressor',     location: 'Cuisine',     nominal_power: 8000 },

  // BLD-008 Villa Monastir
  { id: 'dev-024', building_id: 'bld-008', client_id: 'client-004', name: 'Clim Villa',         type: 'air_conditioner', location: 'Salon',       nominal_power: 1000 },
  { id: 'dev-025', building_id: 'bld-008', client_id: 'client-004', name: 'Chauffe-eau Solar',  type: 'water_heater',    location: 'Toit',        nominal_power: 1800 },

  // BLD-009 Siège Social
  { id: 'dev-026', building_id: 'bld-009', client_id: 'client-005', name: 'HVAC Siège',         type: 'hvac_central',    location: 'Général',     nominal_power: 12000},
  { id: 'dev-027', building_id: 'bld-009', client_id: 'client-005', name: 'Salle Serveurs',     type: 'server_rack',     location: 'Datacenter',  nominal_power: 7000 },
  { id: 'dev-028', building_id: 'bld-009', client_id: 'client-005', name: 'Éclairage LED',      type: 'lighting',        location: 'Bureaux',     nominal_power: 800  },

  // BLD-010 Datacenter Ariana (très gros)
  { id: 'dev-029', building_id: 'bld-010', client_id: 'client-005', name: 'Rack Serveur A',     type: 'server_rack',     location: 'Salle A',     nominal_power: 10000},
  { id: 'dev-030', building_id: 'bld-010', client_id: 'client-005', name: 'Rack Serveur B',     type: 'server_rack',     location: 'Salle B',     nominal_power: 10000},
  { id: 'dev-031', building_id: 'bld-010', client_id: 'client-005', name: 'Système Refroid.',   type: 'hvac_central',    location: 'Général',     nominal_power: 8000 },
];

// ═══════════════════════════════════════════════════════════════════
// 2. UTILITAIRES
// ═══════════════════════════════════════════════════════════════════

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)]; }
function gauss(mean, std) {
  const u = 1 - Math.random();
  const v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Calcule la puissance réaliste selon le profil de l'appareil,
 * l'heure, le jour, la saison, et ajoute du bruit.
 */
function getPower(device, date) {
  const h = date.getHours();
  const dow = date.getDay(); // 0=dimanche
  const month = date.getMonth(); // 0=janvier
  const isWeekend = dow === 0 || dow === 6;
  const isSummer = month >= 5 && month <= 8;
  const isWinter = month <= 1 || month === 11;
  const nominal = device.nominal_power;
  const type = device.type;

  // Profils de consommation par type
  let load = 0; // 0 à 1

  switch (type) {
    case 'refrigerator':
    case 'server_rack':
      // Toujours allumé avec cycles courts
      load = 0.6 + 0.4 * (Math.sin(date.getTime() / 300000) > 0 ? 1 : 0);
      break;

    case 'air_conditioner':
    case 'hvac_central':
      if (isSummer) {
        // Été: forte consommation 10h-22h
        if (h >= 10 && h <= 22) load = rand(0.7, 1.0);
        else load = rand(0.1, 0.3);
      } else if (isWinter) {
        // Hiver: chauffage matin/soir
        if ((h >= 6 && h <= 9) || (h >= 17 && h <= 22)) load = rand(0.5, 0.9);
        else load = rand(0.1, 0.2);
      } else {
        load = h >= 12 && h <= 18 ? rand(0.3, 0.6) : rand(0.0, 0.2);
      }
      if (isWeekend) load *= 1.2;
      break;

    case 'water_heater':
      // Pic matin 6h-9h et soir 18h-20h
      if (h >= 6 && h <= 9) load = rand(0.8, 1.0);
      else if (h >= 18 && h <= 20) load = rand(0.5, 0.8);
      else load = rand(0.0, 0.05); // Maintien température
      break;

    case 'washing_machine':
      // Sporadique: 2-3 cycles/semaine aléatoires
      const dayOfYear = Math.floor(date.getTime() / 86400000);
      const washDay = (dayOfYear + parseInt(device.id.slice(-3))) % 3 === 0;
      if (washDay && h >= 9 && h <= 18) load = rand(0.6, 1.0);
      else load = 0;
      break;

    case 'lighting':
      // Matin et soir, plus fort en hiver
      if (h >= 7 && h <= 9) load = rand(0.5, 0.9);
      else if (h >= 17 && h <= 23) load = rand(0.6, 1.0);
      else if (h >= 0 && h <= 6) load = rand(0.0, 0.1);
      else load = rand(0.2, 0.5);
      if (isWinter) load *= 1.3;
      break;

    case 'elevator':
      // Heures de bureau uniquement
      if (!isWeekend && h >= 8 && h <= 18) load = rand(0.1, 0.8);
      else load = rand(0.0, 0.05);
      break;

    case 'pump':
      // Cycles réguliers
      const cycleMinute = date.getMinutes();
      load = cycleMinute < 30 ? rand(0.7, 1.0) : rand(0.1, 0.2);
      break;

    case 'compressor':
      // Industriel: heures de travail + cycles
      if (!isWeekend && h >= 7 && h <= 19) {
        load = rand(0.5, 1.0);
      } else {
        load = rand(0.0, 0.15);
      }
      break;

    default:
      load = rand(0.3, 0.8);
  }

  // Ajouter bruit gaussien ±10%
  let power = nominal * load;
  power = Math.max(0, gauss(power, nominal * 0.05));

  // Injection d'anomalies (2% du temps)
  if (Math.random() < 0.02) {
    power *= rand(1.5, 3.0); // Surconsommation
  }

  const voltage = gauss(228, 3);
  const current = power / voltage;
  const powerFactor = rand(0.88, 0.99);

  return {
    power: Math.round(power * 10) / 10,
    voltage: Math.round(voltage * 10) / 10,
    current: Math.round(current * 100) / 100,
    power_factor: Math.round(powerFactor * 1000) / 1000,
    energy_kwh: Math.round((power * (INTERVAL_SECONDS / 3600)) / 1000 * 10000) / 10000,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 3. SEEDER SUPABASE
// ═══════════════════════════════════════════════════════════════════

import fs from 'fs';

async function seedSupabase() {
  // Subselect to dynamically fetch whatever the UUID is in the target database
  const ADMIN_ID_SQL = "(SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1)";
  let sql = `-- SMART ENERGY AIoT — SUPABASE SQL SEED (Auto-generated)\n`;
  sql += `-- Copy this into Supabase SQL Editor and run it.\n\n`;

  sql += `-- ==========================================\n`;
  sql += `-- BUILDINGS\n`;
  sql += `-- ==========================================\n`;
  sql += `INSERT INTO public.buildings (id, owner_id, name, type, address, surface, occupants, monthly_budget_kwh, electricity_rate, currency, timezone, is_active, created_at)\nVALUES\n`;
  
  const bldVals = BUILDINGS.map(b => {
    const bId = "b2d00111-2000-4000-8000-" + b.id.replace('bld-','000000000');
    return `('${bId}', ${ADMIN_ID_SQL}, '${b.name.replace(/'/g, "''")}', '${b.type}', '${b.address.replace(/'/g, "''")}', ${b.surface}, ${b.occupants}, ${b.monthly_budget_kwh}, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '${randInt(20, 300)} days')`;
  });
  sql += bldVals.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id;\n\n`;

  sql += `-- ==========================================\n`;
  sql += `-- DEVICES\n`;
  sql += `-- ==========================================\n`;
  sql += `INSERT INTO public.devices (id, building_id, name, type, location, nominal_power, brand, model, status, is_on, created_at)\nVALUES\n`;
  
  const devVals = DEVICES.map(d => {
    const dId = "d3e00111-2000-4000-8000-" + d.id.replace('dev-','000000000');
    const bId = "b2d00111-2000-4000-8000-" + d.building_id.replace('bld-','000000000');
    const type = (d.type === 'server_rack' || d.type === 'elevator' || d.type === 'hvac_central' || d.type === 'pump' || d.type === 'compressor') ? 'other' : d.type;
    const brand = randChoice(['Samsung', 'LG', 'Siemens', 'Schneider', 'ABB', 'Legrand']);
    const model = `${randInt(1000, 9999)}X`;
    const status = Math.random() > 0.05 ? 'online' : 'offline';
    const is_on = Math.random() > 0.3;
    return `('${dId}', '${bId}', '${d.name.replace(/'/g, "''")}', '${type}', '${d.location.replace(/'/g, "''")}', ${d.nominal_power}, '${brand}', '${model}', '${status}', ${is_on}, now() - interval '${randInt(10, 200)} days')`;
  });
  sql += devVals.join(',\n') + `\nON CONFLICT (id) DO NOTHING;\n\n`;

  sql += `-- ==========================================\n`;
  sql += `-- ALERTS\n`;
  sql += `-- ==========================================\n`;
  sql += `INSERT INTO public.alerts (id, building_id, device_id, type, severity, message, status, created_at)\nVALUES\n`;

  const alertTypes = ['overconsumption', 'device_offline', 'anomaly', 'budget_exceeded'];
  const severities  = ['low', 'medium', 'high', 'critical'];
  const alertVals = [];
  for (let i = 0; i < 150; i++) {
    const dev = randChoice(DEVICES);
    const type = randChoice(alertTypes);
    const sev  = randChoice(severities);
    const daysAgo = rand(0, SEED_DAYS);
    const status = Math.random() > 0.4 ? 'resolved' : 'active';
    const aId = "a1e00111-2000-4000-8000-" + String(i+1).padStart(12,'0');
    const bId = "b2d00111-2000-4000-8000-" + dev.building_id.replace('bld-','000000000');
    const dId = "d3e00111-2000-4000-8000-" + dev.id.replace('dev-','000000000');
    const msg = getMessage(type, dev.name).replace(/'/g, "''");
    alertVals.push(`('${aId}', '${bId}', '${dId}', '${type}', '${sev}', '${msg}', '${status}', now() - interval '${Math.floor(daysAgo)} days')`);
  }
  sql += alertVals.join(',\n') + `\nON CONFLICT (id) DO NOTHING;\n\n`;

  sql += `-- ==========================================\n`;
  sql += `-- RECOMMENDATIONS\n`;
  sql += `-- ==========================================\n`;
  sql += `INSERT INTO public.recommendations (id, building_id, title, description, category, priority, estimated_saving_kwh, estimated_saving_tnd, is_applied, created_at)\nVALUES\n`;

  const recs = [
    { building_id: 'bld-001', title: 'Optimiser le chauffe-eau', description: 'Programmer entre 22h-6h, économie estimée: 30%', category: 'scheduling', priority: 'high', saving_kwh: 45, saving_tnd: 13.5 },
    { building_id: 'bld-002', title: 'HVAC heures creuses', description: 'Réduire consigne de 2°C en dehors des heures bureau', category: 'behavior', priority: 'high', saving_kwh: 200, saving_tnd: 60 },
    { building_id: 'bld-003', title: 'Décaler les compresseurs', description: 'Alterner Compresseur 1 et 2 pour éviter pic simultané', category: 'scheduling', priority: 'medium', saving_kwh: 300, saving_tnd: 90 },
    { building_id: 'bld-007', title: 'Audit HVAC hôtel', description: 'Consommation 18% au-dessus de la moyenne du secteur', category: 'replacement', priority: 'high', saving_kwh: 1200, saving_tnd: 360 },
    { building_id: 'bld-009', title: 'Éclairage LED détecteur mouvement', description: 'Installer détecteurs dans couloirs et salles de réunion', category: 'replacement', priority: 'medium', saving_kwh: 80, saving_tnd: 24 },
    { building_id: 'bld-010', title: 'Refroidissement datacenter optimisé', description: 'Température cible 22°C → 24°C économise 15% énergie refroid.', category: 'behavior', priority: 'high', saving_kwh: 500, saving_tnd: 150 },
  ];
  const recVals = recs.map((r, i) => {
    const rId = "f3c00111-2000-4000-8000-" + String(i+1).padStart(12,'0');
    const bId = "b2d00111-2000-4000-8000-" + r.building_id.replace('bld-','000000000');
    return `('${rId}', '${bId}', '${r.title.replace(/'/g, "''")}', '${r.description.replace(/'/g, "''")}', '${r.category}', '${r.priority}', ${r.saving_kwh}, ${r.saving_tnd}, false, now() - interval '${randInt(1, 7)} days')`;
  });
  sql += recVals.join(',\n') + `\nON CONFLICT (id) DO NOTHING;\n\n`;

  sql += `-- ==========================================\n`;
  sql += `-- GRANT ADMIN ROLE TO TARGET USER\n`;
  sql += `-- ==========================================\n`;
  sql += `INSERT INTO public.user_roles (user_id, role) SELECT ${ADMIN_ID_SQL}, 'admin' WHERE ${ADMIN_ID_SQL} IS NOT NULL ON CONFLICT (user_id, role) DO NOTHING;\n`;
  sql += `UPDATE public.user_roles SET role = 'admin' WHERE user_id = ${ADMIN_ID_SQL};\n\n`;

  sql += `-- ==========================================\n`;
  sql += `-- DISABLE RLS FOR THE DEMO DASHBOARD\n`;
  sql += `-- ==========================================\n`;
  sql += `ALTER TABLE public.buildings DISABLE ROW LEVEL SECURITY;\n`;
  sql += `ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;\n`;
  sql += `ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;\n`;
  sql += `ALTER TABLE public.alerts DISABLE ROW LEVEL SECURITY;\n`;
  sql += `ALTER TABLE public.recommendations DISABLE ROW LEVEL SECURITY;\n`;
  sql += `ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;\n\n`;

  fs.writeFileSync('supabase_seed.sql', sql, 'utf8');

  console.log('   ✅ Le fichier supabase_seed.sql a été généré avec succès !');
  console.log('\n✅ Supabase : copie le contenu de supabase_seed.sql dans SQL Editor pour le seeding\n');
}

function getMessage(type, deviceName) {
  const msgs = {
    overconsumption: `Surconsommation détectée sur ${deviceName}`,
    device_offline:  `${deviceName} hors ligne depuis plus de 10 minutes`,
    anomaly:         `Comportement anormal détecté sur ${deviceName}`,
    budget_exceeded: `Budget mensuel dépassé à 90% pour le bâtiment`,
  };
  return msgs[type] || `Alerte sur ${deviceName}`;
}

// ═══════════════════════════════════════════════════════════════════
// 4. SEEDER INFLUXDB — SÉRIES TEMPORELLES
// ═══════════════════════════════════════════════════════════════════

async function seedInfluxDB() {
  console.log('\n📈 INFLUXDB — Génération des séries temporelles...\n');
  console.log(`   📅 Période : ${SEED_DAYS} jours × ${DEVICES.length} appareils`);

  const now = Date.now();
  const startTime = now - SEED_DAYS * 24 * 3600 * 1000;
  const totalPoints = Math.floor((SEED_DAYS * 24 * 3600) / INTERVAL_SECONDS);

  console.log(`   📊 Total points à générer : ~${(totalPoints * DEVICES.length).toLocaleString()}`);
  console.log('   ⏳ Génération en cours (batch par jour)...\n');

  let totalWritten = 0;
  const BATCH_SIZE = 5000;
  const points = [];

  for (let dayOffset = 0; dayOffset < SEED_DAYS; dayOffset++) {
    const dayStart = startTime + dayOffset * 24 * 3600 * 1000;

    for (const device of DEVICES) {
      const building = BUILDINGS.find(b => b.id === device.building_id);
      const pointsPerDay = Math.floor(24 * 3600 / INTERVAL_SECONDS);

      for (let t = 0; t < pointsPerDay; t++) {
        const timestamp = new Date(dayStart + t * INTERVAL_SECONDS * 1000);
        const { power, voltage, current, power_factor, energy_kwh } = getPower(device, timestamp);

        const point = new Point('energy_readings')
          .tag('building_id', device.building_id)
          .tag('device_id', device.id)
          .tag('client_id', device.client_id)
          .tag('device_type', device.type)
          .tag('building_type', building.type)
          .tag('location', device.location)
          .floatField('power', power)
          .floatField('voltage', voltage)
          .floatField('current', current)
          .floatField('power_factor', power_factor)
          .floatField('energy_kwh', energy_kwh)
          .intField('is_on', power > 10 ? 1 : 0)
          .timestamp(timestamp);

        points.push(point);

        if (points.length >= BATCH_SIZE) {
          writeApi.writePoints(points);
          await writeApi.flush();
          totalWritten += points.length;
          points.length = 0;
          process.stdout.write(`\r   ✍️  Points écrits : ${totalWritten.toLocaleString()}`);
        }
      }
    }

    // Flush à la fin de chaque jour
    if (points.length > 0) {
      writeApi.writePoints(points);
      await writeApi.flush();
      totalWritten += points.length;
      points.length = 0;
    }

    const pct = Math.round((dayOffset + 1) / SEED_DAYS * 100);
    const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
    process.stdout.write(`\r   [${bar}] ${pct}% — Jour ${dayOffset+1}/${SEED_DAYS} — ${totalWritten.toLocaleString()} pts`);
  }

  console.log(`\n\n✅ InfluxDB : ${totalWritten.toLocaleString()} points écrits avec succès\n`);
}

// ═══════════════════════════════════════════════════════════════════
// 5. VÉRIFICATION FINALE
// ═══════════════════════════════════════════════════════════════════

async function verify() {
  console.log('🔍 VÉRIFICATION...\n');

  // Vérif Supabase
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: bldCount }  = await supabase.from('buildings').select('*', { count: 'exact', head: true });
  const { count: devCount }  = await supabase.from('devices').select('*', { count: 'exact', head: true });
  const { count: altCount }  = await supabase.from('alerts').select('*', { count: 'exact', head: true });

  console.log('📦 Supabase:');
  console.log(`   👤 Users      : ${userCount}`);
  console.log(`   🏢 Buildings  : ${bldCount}`);
  console.log(`   🔌 Devices    : ${devCount}`);
  console.log(`   🚨 Alerts     : ${altCount}`);

  // Vérif InfluxDB
  const queryApi = influx.getQueryApi(INFLUX_ORG);
  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: -${SEED_DAYS}d)
      |> filter(fn: (r) => r._measurement == "energy_readings" and r._field == "power")
      |> count()
      |> sum()
  `;
  try {
    let influxCount = 0;
    await queryApi.collectRows(query).then(rows => {
      rows.forEach(r => { influxCount += Number(r._value) || 0; });
    });
    console.log(`\n📈 InfluxDB:`);
    console.log(`   ⚡ Points énergie : ${influxCount.toLocaleString()}`);
  } catch(e) {
    console.log(`\n📈 InfluxDB: vérification manuelle sur http://localhost:8086`);
  }

  console.log('\n🚀 Dashboard disponible sur http://localhost:3000\n');
  console.log('📊 Grafana disponible sur http://localhost:3001 (si configuré)\n');
}

// ═══════════════════════════════════════════════════════════════════
// 6. MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║      SMART ENERGY AIoT — DATA SEEDER v1.0           ║
║      Supabase + InfluxDB  |  ${SEED_DAYS} jours de data     ║
╚══════════════════════════════════════════════════════╝
  `);

  const args = process.argv.slice(2);
  const skipSupabase = args.includes('--influx-only');
  const skipInflux   = args.includes('--supabase-only');

  try {
    if (!skipSupabase) await seedSupabase();
    if (!skipInflux)   await seedInfluxDB();
    await verify();

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ SEEDING COMPLET — Ton dashboard est prêt ! 🎉');
    console.log('═══════════════════════════════════════════════════\n');
  } catch (err) {
    console.error('\n❌ ERREUR FATALE:', err);
    process.exit(1);
  } finally {
    await writeApi.close();
    process.exit(0);
  }
}

main();
