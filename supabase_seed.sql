-- SMART ENERGY AIoT — SUPABASE SQL SEED (Auto-generated)
-- Copy this into Supabase SQL Editor and run it.

-- ==========================================
-- BUILDINGS
-- ==========================================
INSERT INTO public.buildings (id, owner_id, name, type, address, surface, occupants, monthly_budget_kwh, electricity_rate, currency, timezone, is_active, created_at)
VALUES
('b2d00111-2000-4000-8000-000000000001', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Villa Ennasr', 'residential', 'Ennasr, Tunis', 280, 6, 800, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '109 days'),
('b2d00111-2000-4000-8000-000000000002', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Bureau Lac 2', 'commercial', 'Lac 2, Tunis', 450, 20, 2000, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '134 days'),
('b2d00111-2000-4000-8000-000000000003', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Entrepôt Mégrine', 'industrial', 'Mégrine, Ben Arous', 1200, 8, 5000, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '200 days'),
('b2d00111-2000-4000-8000-000000000004', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Appartement Sfax', 'residential', 'Centre Sfax', 120, 4, 400, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '214 days'),
('b2d00111-2000-4000-8000-000000000005', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Agence Sfax Centre', 'commercial', 'Av. Bourguiba, Sfax', 200, 12, 900, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '220 days'),
('b2d00111-2000-4000-8000-000000000006', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Résidence Kantaoui', 'residential', 'Port Kantaoui, Sousse', 180, 5, 600, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '79 days'),
('b2d00111-2000-4000-8000-000000000007', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Hôtel Sousse Beach', 'commercial', 'Corniche Sousse', 3500, 120, 15000, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '271 days'),
('b2d00111-2000-4000-8000-000000000008', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Villa Monastir', 'residential', 'Monastir Centre', 160, 3, 500, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '64 days'),
('b2d00111-2000-4000-8000-000000000009', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Siège Social Tunis', 'commercial', 'Centre Urbain Nord', 800, 35, 3500, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '135 days'),
('b2d00111-2000-4000-8000-000000000010', (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'Datacenter Ariana', 'industrial', 'Ariana, Tunis', 600, 4, 12000, 0.300, 'TND', 'Africa/Tunis', true, now() - interval '87 days')
ON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id;

-- ==========================================
-- DEVICES
-- ==========================================
INSERT INTO public.devices (id, building_id, name, type, location, nominal_power, brand, model, status, is_on, created_at)
VALUES
('d3e00111-2000-4000-8000-000000000001', 'b2d00111-2000-4000-8000-000000000001', 'Clim Salon', 'air_conditioner', 'Salon', 1200, 'Schneider', '2092X', 'online', false, now() - interval '191 days'),
('d3e00111-2000-4000-8000-000000000002', 'b2d00111-2000-4000-8000-000000000001', 'Clim Chambre 1', 'air_conditioner', 'Chambre 1', 900, 'Siemens', '9581X', 'online', true, now() - interval '10 days'),
('d3e00111-2000-4000-8000-000000000003', 'b2d00111-2000-4000-8000-000000000001', 'Chauffe-eau', 'water_heater', 'Salle de bain', 2000, 'Siemens', '6132X', 'online', false, now() - interval '117 days'),
('d3e00111-2000-4000-8000-000000000004', 'b2d00111-2000-4000-8000-000000000001', 'Réfrigérateur', 'refrigerator', 'Cuisine', 150, 'LG', '2141X', 'online', false, now() - interval '195 days'),
('d3e00111-2000-4000-8000-000000000005', 'b2d00111-2000-4000-8000-000000000001', 'Éclairage Général', 'lighting', 'Général', 300, 'ABB', '9742X', 'online', true, now() - interval '108 days'),
('d3e00111-2000-4000-8000-000000000006', 'b2d00111-2000-4000-8000-000000000002', 'HVAC Bureau', 'other', 'Général', 8000, 'LG', '7580X', 'online', false, now() - interval '185 days'),
('d3e00111-2000-4000-8000-000000000007', 'b2d00111-2000-4000-8000-000000000002', 'Serveurs IT', 'other', 'Salle serveur', 3500, 'LG', '6860X', 'online', true, now() - interval '192 days'),
('d3e00111-2000-4000-8000-000000000008', 'b2d00111-2000-4000-8000-000000000002', 'Ascenseur', 'other', 'Hall', 5000, 'Legrand', '9878X', 'online', true, now() - interval '47 days'),
('d3e00111-2000-4000-8000-000000000009', 'b2d00111-2000-4000-8000-000000000002', 'Éclairage Open Space', 'lighting', 'Open Space', 500, 'Schneider', '1829X', 'online', false, now() - interval '104 days'),
('d3e00111-2000-4000-8000-000000000010', 'b2d00111-2000-4000-8000-000000000003', 'Compresseur 1', 'other', 'Zone A', 6000, 'Siemens', '1191X', 'online', true, now() - interval '134 days'),
('d3e00111-2000-4000-8000-000000000011', 'b2d00111-2000-4000-8000-000000000003', 'Compresseur 2', 'other', 'Zone B', 6000, 'Legrand', '7015X', 'online', true, now() - interval '137 days'),
('d3e00111-2000-4000-8000-000000000012', 'b2d00111-2000-4000-8000-000000000003', 'Pompe Hydraulique', 'other', 'Zone C', 4000, 'Siemens', '5723X', 'online', false, now() - interval '17 days'),
('d3e00111-2000-4000-8000-000000000013', 'b2d00111-2000-4000-8000-000000000004', 'Clim Salon', 'air_conditioner', 'Salon', 900, 'LG', '1384X', 'online', true, now() - interval '15 days'),
('d3e00111-2000-4000-8000-000000000014', 'b2d00111-2000-4000-8000-000000000004', 'Chauffe-eau', 'water_heater', 'SDB', 1500, 'ABB', '9821X', 'online', true, now() - interval '27 days'),
('d3e00111-2000-4000-8000-000000000015', 'b2d00111-2000-4000-8000-000000000004', 'Machine à laver', 'washing_machine', 'Buanderie', 2200, 'LG', '4266X', 'online', true, now() - interval '137 days'),
('d3e00111-2000-4000-8000-000000000016', 'b2d00111-2000-4000-8000-000000000005', 'Clim Agence', 'air_conditioner', 'Espace client', 2400, 'ABB', '5985X', 'online', true, now() - interval '44 days'),
('d3e00111-2000-4000-8000-000000000017', 'b2d00111-2000-4000-8000-000000000005', 'Éclairage Agence', 'lighting', 'Général', 400, 'Samsung', '3945X', 'online', false, now() - interval '38 days'),
('d3e00111-2000-4000-8000-000000000018', 'b2d00111-2000-4000-8000-000000000006', 'Piscine Pompe', 'other', 'Jardin', 1500, 'Schneider', '4720X', 'online', false, now() - interval '113 days'),
('d3e00111-2000-4000-8000-000000000019', 'b2d00111-2000-4000-8000-000000000006', 'Clim Master', 'air_conditioner', 'Chambre master', 1200, 'Schneider', '1776X', 'online', false, now() - interval '94 days'),
('d3e00111-2000-4000-8000-000000000020', 'b2d00111-2000-4000-8000-000000000007', 'HVAC Principal', 'other', 'Général', 15000, 'Schneider', '9218X', 'online', false, now() - interval '25 days'),
('d3e00111-2000-4000-8000-000000000021', 'b2d00111-2000-4000-8000-000000000007', 'Ascenseur 1', 'other', 'Aile A', 5000, 'LG', '8857X', 'online', false, now() - interval '89 days'),
('d3e00111-2000-4000-8000-000000000022', 'b2d00111-2000-4000-8000-000000000007', 'Ascenseur 2', 'other', 'Aile B', 5000, 'Samsung', '8130X', 'online', true, now() - interval '159 days'),
('d3e00111-2000-4000-8000-000000000023', 'b2d00111-2000-4000-8000-000000000007', 'Cuisine Industrielle', 'other', 'Cuisine', 8000, 'Siemens', '8383X', 'online', true, now() - interval '151 days'),
('d3e00111-2000-4000-8000-000000000024', 'b2d00111-2000-4000-8000-000000000008', 'Clim Villa', 'air_conditioner', 'Salon', 1000, 'LG', '2202X', 'online', true, now() - interval '82 days'),
('d3e00111-2000-4000-8000-000000000025', 'b2d00111-2000-4000-8000-000000000008', 'Chauffe-eau Solar', 'water_heater', 'Toit', 1800, 'Schneider', '9324X', 'online', true, now() - interval '18 days'),
('d3e00111-2000-4000-8000-000000000026', 'b2d00111-2000-4000-8000-000000000009', 'HVAC Siège', 'other', 'Général', 12000, 'LG', '1553X', 'offline', true, now() - interval '127 days'),
('d3e00111-2000-4000-8000-000000000027', 'b2d00111-2000-4000-8000-000000000009', 'Salle Serveurs', 'other', 'Datacenter', 7000, 'Legrand', '7536X', 'online', true, now() - interval '160 days'),
('d3e00111-2000-4000-8000-000000000028', 'b2d00111-2000-4000-8000-000000000009', 'Éclairage LED', 'lighting', 'Bureaux', 800, 'LG', '5251X', 'online', true, now() - interval '65 days'),
('d3e00111-2000-4000-8000-000000000029', 'b2d00111-2000-4000-8000-000000000010', 'Rack Serveur A', 'other', 'Salle A', 10000, 'Samsung', '9701X', 'online', false, now() - interval '188 days'),
('d3e00111-2000-4000-8000-000000000030', 'b2d00111-2000-4000-8000-000000000010', 'Rack Serveur B', 'other', 'Salle B', 10000, 'Samsung', '3766X', 'online', true, now() - interval '46 days'),
('d3e00111-2000-4000-8000-000000000031', 'b2d00111-2000-4000-8000-000000000010', 'Système Refroid.', 'other', 'Général', 8000, 'Legrand', '8795X', 'online', true, now() - interval '140 days')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- ALERTS
-- ==========================================
INSERT INTO public.alerts (id, building_id, device_id, type, severity, message, status, created_at)
VALUES
('a1e00111-2000-4000-8000-000000000001', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'overconsumption', 'critical', 'Surconsommation détectée sur Machine à laver', 'resolved', now() - interval '71 days'),
('a1e00111-2000-4000-8000-000000000002', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000017', 'device_offline', 'high', 'Éclairage Agence hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '20 days'),
('a1e00111-2000-4000-8000-000000000003', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000013', 'anomaly', 'critical', 'Comportement anormal détecté sur Clim Salon', 'resolved', now() - interval '84 days'),
('a1e00111-2000-4000-8000-000000000004', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'anomaly', 'low', 'Comportement anormal détecté sur Pompe Hydraulique', 'active', now() - interval '4 days'),
('a1e00111-2000-4000-8000-000000000005', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000023', 'anomaly', 'critical', 'Comportement anormal détecté sur Cuisine Industrielle', 'active', now() - interval '4 days'),
('a1e00111-2000-4000-8000-000000000006', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'device_offline', 'high', 'HVAC Principal hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '78 days'),
('a1e00111-2000-4000-8000-000000000007', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000006', 'budget_exceeded', 'low', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '9 days'),
('a1e00111-2000-4000-8000-000000000008', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000023', 'device_offline', 'high', 'Cuisine Industrielle hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '0 days'),
('a1e00111-2000-4000-8000-000000000009', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000009', 'anomaly', 'critical', 'Comportement anormal détecté sur Éclairage Open Space', 'active', now() - interval '40 days'),
('a1e00111-2000-4000-8000-000000000010', 'b2d00111-2000-4000-8000-000000000008', 'd3e00111-2000-4000-8000-000000000024', 'overconsumption', 'high', 'Surconsommation détectée sur Clim Villa', 'active', now() - interval '49 days'),
('a1e00111-2000-4000-8000-000000000011', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000005', 'overconsumption', 'high', 'Surconsommation détectée sur Éclairage Général', 'resolved', now() - interval '44 days'),
('a1e00111-2000-4000-8000-000000000012', 'b2d00111-2000-4000-8000-000000000009', 'd3e00111-2000-4000-8000-000000000026', 'anomaly', 'low', 'Comportement anormal détecté sur HVAC Siège', 'active', now() - interval '85 days'),
('a1e00111-2000-4000-8000-000000000013', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'budget_exceeded', 'low', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '86 days'),
('a1e00111-2000-4000-8000-000000000014', 'b2d00111-2000-4000-8000-000000000009', 'd3e00111-2000-4000-8000-000000000028', 'budget_exceeded', 'high', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '4 days'),
('a1e00111-2000-4000-8000-000000000015', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000014', 'overconsumption', 'low', 'Surconsommation détectée sur Chauffe-eau', 'resolved', now() - interval '11 days'),
('a1e00111-2000-4000-8000-000000000016', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000031', 'overconsumption', 'medium', 'Surconsommation détectée sur Système Refroid.', 'resolved', now() - interval '47 days'),
('a1e00111-2000-4000-8000-000000000017', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000021', 'anomaly', 'low', 'Comportement anormal détecté sur Ascenseur 1', 'resolved', now() - interval '18 days'),
('a1e00111-2000-4000-8000-000000000018', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000029', 'overconsumption', 'high', 'Surconsommation détectée sur Rack Serveur A', 'resolved', now() - interval '43 days'),
('a1e00111-2000-4000-8000-000000000019', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000029', 'budget_exceeded', 'medium', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '28 days'),
('a1e00111-2000-4000-8000-000000000020', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000001', 'device_offline', 'medium', 'Clim Salon hors ligne depuis plus de 10 minutes', 'active', now() - interval '68 days'),
('a1e00111-2000-4000-8000-000000000021', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'overconsumption', 'critical', 'Surconsommation détectée sur Machine à laver', 'active', now() - interval '79 days'),
('a1e00111-2000-4000-8000-000000000022', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000004', 'overconsumption', 'high', 'Surconsommation détectée sur Réfrigérateur', 'active', now() - interval '11 days'),
('a1e00111-2000-4000-8000-000000000023', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000004', 'anomaly', 'low', 'Comportement anormal détecté sur Réfrigérateur', 'active', now() - interval '65 days'),
('a1e00111-2000-4000-8000-000000000024', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000014', 'device_offline', 'low', 'Chauffe-eau hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '17 days'),
('a1e00111-2000-4000-8000-000000000025', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000006', 'device_offline', 'critical', 'HVAC Bureau hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '16 days'),
('a1e00111-2000-4000-8000-000000000026', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'budget_exceeded', 'low', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '81 days'),
('a1e00111-2000-4000-8000-000000000027', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000008', 'overconsumption', 'low', 'Surconsommation détectée sur Ascenseur', 'resolved', now() - interval '43 days'),
('a1e00111-2000-4000-8000-000000000028', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000022', 'budget_exceeded', 'low', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '48 days'),
('a1e00111-2000-4000-8000-000000000029', 'b2d00111-2000-4000-8000-000000000009', 'd3e00111-2000-4000-8000-000000000026', 'budget_exceeded', 'low', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '60 days'),
('a1e00111-2000-4000-8000-000000000030', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'budget_exceeded', 'high', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '21 days'),
('a1e00111-2000-4000-8000-000000000031', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000004', 'device_offline', 'low', 'Réfrigérateur hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '47 days'),
('a1e00111-2000-4000-8000-000000000032', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'device_offline', 'low', 'HVAC Principal hors ligne depuis plus de 10 minutes', 'active', now() - interval '84 days'),
('a1e00111-2000-4000-8000-000000000033', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '27 days'),
('a1e00111-2000-4000-8000-000000000034', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000016', 'overconsumption', 'critical', 'Surconsommation détectée sur Clim Agence', 'resolved', now() - interval '50 days'),
('a1e00111-2000-4000-8000-000000000035', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'budget_exceeded', 'low', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '78 days'),
('a1e00111-2000-4000-8000-000000000036', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000029', 'overconsumption', 'critical', 'Surconsommation détectée sur Rack Serveur A', 'active', now() - interval '57 days'),
('a1e00111-2000-4000-8000-000000000037', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000017', 'overconsumption', 'critical', 'Surconsommation détectée sur Éclairage Agence', 'resolved', now() - interval '0 days'),
('a1e00111-2000-4000-8000-000000000038', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'device_offline', 'medium', 'Serveurs IT hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '83 days'),
('a1e00111-2000-4000-8000-000000000039', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'overconsumption', 'low', 'Surconsommation détectée sur Clim Chambre 1', 'active', now() - interval '51 days'),
('a1e00111-2000-4000-8000-000000000040', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000031', 'device_offline', 'critical', 'Système Refroid. hors ligne depuis plus de 10 minutes', 'active', now() - interval '80 days'),
('a1e00111-2000-4000-8000-000000000041', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'device_offline', 'critical', 'Clim Chambre 1 hors ligne depuis plus de 10 minutes', 'active', now() - interval '34 days'),
('a1e00111-2000-4000-8000-000000000042', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'device_offline', 'low', 'Pompe Hydraulique hors ligne depuis plus de 10 minutes', 'active', now() - interval '35 days'),
('a1e00111-2000-4000-8000-000000000043', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000005', 'device_offline', 'medium', 'Éclairage Général hors ligne depuis plus de 10 minutes', 'active', now() - interval '28 days'),
('a1e00111-2000-4000-8000-000000000044', 'b2d00111-2000-4000-8000-000000000008', 'd3e00111-2000-4000-8000-000000000025', 'device_offline', 'low', 'Chauffe-eau Solar hors ligne depuis plus de 10 minutes', 'active', now() - interval '27 days'),
('a1e00111-2000-4000-8000-000000000045', 'b2d00111-2000-4000-8000-000000000008', 'd3e00111-2000-4000-8000-000000000024', 'budget_exceeded', 'high', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '60 days'),
('a1e00111-2000-4000-8000-000000000046', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000022', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '77 days'),
('a1e00111-2000-4000-8000-000000000047', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000031', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '68 days'),
('a1e00111-2000-4000-8000-000000000048', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000029', 'overconsumption', 'medium', 'Surconsommation détectée sur Rack Serveur A', 'resolved', now() - interval '27 days'),
('a1e00111-2000-4000-8000-000000000049', 'b2d00111-2000-4000-8000-000000000006', 'd3e00111-2000-4000-8000-000000000018', 'device_offline', 'low', 'Piscine Pompe hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '12 days'),
('a1e00111-2000-4000-8000-000000000050', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000003', 'budget_exceeded', 'medium', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '33 days'),
('a1e00111-2000-4000-8000-000000000051', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000016', 'anomaly', 'critical', 'Comportement anormal détecté sur Clim Agence', 'active', now() - interval '58 days'),
('a1e00111-2000-4000-8000-000000000052', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000008', 'device_offline', 'medium', 'Ascenseur hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '87 days'),
('a1e00111-2000-4000-8000-000000000053', 'b2d00111-2000-4000-8000-000000000008', 'd3e00111-2000-4000-8000-000000000024', 'device_offline', 'low', 'Clim Villa hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '31 days'),
('a1e00111-2000-4000-8000-000000000054', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'anomaly', 'low', 'Comportement anormal détecté sur Serveurs IT', 'resolved', now() - interval '36 days'),
('a1e00111-2000-4000-8000-000000000055', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'budget_exceeded', 'medium', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '87 days'),
('a1e00111-2000-4000-8000-000000000056', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000030', 'overconsumption', 'low', 'Surconsommation détectée sur Rack Serveur B', 'resolved', now() - interval '81 days'),
('a1e00111-2000-4000-8000-000000000057', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000030', 'overconsumption', 'critical', 'Surconsommation détectée sur Rack Serveur B', 'active', now() - interval '58 days'),
('a1e00111-2000-4000-8000-000000000058', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000013', 'anomaly', 'high', 'Comportement anormal détecté sur Clim Salon', 'active', now() - interval '40 days'),
('a1e00111-2000-4000-8000-000000000059', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000017', 'device_offline', 'high', 'Éclairage Agence hors ligne depuis plus de 10 minutes', 'active', now() - interval '32 days'),
('a1e00111-2000-4000-8000-000000000060', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000016', 'overconsumption', 'medium', 'Surconsommation détectée sur Clim Agence', 'resolved', now() - interval '10 days'),
('a1e00111-2000-4000-8000-000000000061', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'anomaly', 'low', 'Comportement anormal détecté sur Machine à laver', 'resolved', now() - interval '60 days'),
('a1e00111-2000-4000-8000-000000000062', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000006', 'budget_exceeded', 'high', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '48 days'),
('a1e00111-2000-4000-8000-000000000063', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000005', 'anomaly', 'critical', 'Comportement anormal détecté sur Éclairage Général', 'resolved', now() - interval '35 days'),
('a1e00111-2000-4000-8000-000000000064', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000016', 'device_offline', 'critical', 'Clim Agence hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '58 days'),
('a1e00111-2000-4000-8000-000000000065', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'device_offline', 'medium', 'Machine à laver hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '13 days'),
('a1e00111-2000-4000-8000-000000000066', 'b2d00111-2000-4000-8000-000000000006', 'd3e00111-2000-4000-8000-000000000019', 'anomaly', 'critical', 'Comportement anormal détecté sur Clim Master', 'active', now() - interval '79 days'),
('a1e00111-2000-4000-8000-000000000067', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'device_offline', 'low', 'Pompe Hydraulique hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '10 days'),
('a1e00111-2000-4000-8000-000000000068', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000004', 'device_offline', 'critical', 'Réfrigérateur hors ligne depuis plus de 10 minutes', 'active', now() - interval '71 days'),
('a1e00111-2000-4000-8000-000000000069', 'b2d00111-2000-4000-8000-000000000008', 'd3e00111-2000-4000-8000-000000000024', 'device_offline', 'critical', 'Clim Villa hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '75 days'),
('a1e00111-2000-4000-8000-000000000070', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000021', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '83 days'),
('a1e00111-2000-4000-8000-000000000071', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000011', 'overconsumption', 'critical', 'Surconsommation détectée sur Compresseur 2', 'resolved', now() - interval '48 days'),
('a1e00111-2000-4000-8000-000000000072', 'b2d00111-2000-4000-8000-000000000006', 'd3e00111-2000-4000-8000-000000000019', 'anomaly', 'critical', 'Comportement anormal détecté sur Clim Master', 'active', now() - interval '44 days'),
('a1e00111-2000-4000-8000-000000000073', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000022', 'overconsumption', 'high', 'Surconsommation détectée sur Ascenseur 2', 'resolved', now() - interval '44 days'),
('a1e00111-2000-4000-8000-000000000074', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000021', 'budget_exceeded', 'medium', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '15 days'),
('a1e00111-2000-4000-8000-000000000075', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000009', 'anomaly', 'low', 'Comportement anormal détecté sur Éclairage Open Space', 'resolved', now() - interval '44 days'),
('a1e00111-2000-4000-8000-000000000076', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '72 days'),
('a1e00111-2000-4000-8000-000000000077', 'b2d00111-2000-4000-8000-000000000009', 'd3e00111-2000-4000-8000-000000000026', 'budget_exceeded', 'high', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '54 days'),
('a1e00111-2000-4000-8000-000000000078', 'b2d00111-2000-4000-8000-000000000006', 'd3e00111-2000-4000-8000-000000000018', 'budget_exceeded', 'medium', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '23 days'),
('a1e00111-2000-4000-8000-000000000079', 'b2d00111-2000-4000-8000-000000000009', 'd3e00111-2000-4000-8000-000000000027', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '23 days'),
('a1e00111-2000-4000-8000-000000000080', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'anomaly', 'low', 'Comportement anormal détecté sur Pompe Hydraulique', 'resolved', now() - interval '89 days'),
('a1e00111-2000-4000-8000-000000000081', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'budget_exceeded', 'medium', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '85 days'),
('a1e00111-2000-4000-8000-000000000082', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'overconsumption', 'medium', 'Surconsommation détectée sur HVAC Principal', 'resolved', now() - interval '56 days'),
('a1e00111-2000-4000-8000-000000000083', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'device_offline', 'low', 'Machine à laver hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '40 days'),
('a1e00111-2000-4000-8000-000000000084', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000005', 'overconsumption', 'high', 'Surconsommation détectée sur Éclairage Général', 'resolved', now() - interval '72 days'),
('a1e00111-2000-4000-8000-000000000085', 'b2d00111-2000-4000-8000-000000000008', 'd3e00111-2000-4000-8000-000000000025', 'overconsumption', 'medium', 'Surconsommation détectée sur Chauffe-eau Solar', 'resolved', now() - interval '72 days'),
('a1e00111-2000-4000-8000-000000000086', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'anomaly', 'low', 'Comportement anormal détecté sur Serveurs IT', 'active', now() - interval '52 days'),
('a1e00111-2000-4000-8000-000000000087', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000016', 'anomaly', 'low', 'Comportement anormal détecté sur Clim Agence', 'resolved', now() - interval '36 days'),
('a1e00111-2000-4000-8000-000000000088', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'anomaly', 'high', 'Comportement anormal détecté sur Serveurs IT', 'active', now() - interval '65 days'),
('a1e00111-2000-4000-8000-000000000089', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000003', 'device_offline', 'low', 'Chauffe-eau hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '9 days'),
('a1e00111-2000-4000-8000-000000000090', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000003', 'device_offline', 'low', 'Chauffe-eau hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '67 days'),
('a1e00111-2000-4000-8000-000000000091', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000006', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '28 days'),
('a1e00111-2000-4000-8000-000000000092', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'budget_exceeded', 'high', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '22 days'),
('a1e00111-2000-4000-8000-000000000093', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000006', 'overconsumption', 'critical', 'Surconsommation détectée sur HVAC Bureau', 'resolved', now() - interval '37 days'),
('a1e00111-2000-4000-8000-000000000094', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'anomaly', 'critical', 'Comportement anormal détecté sur Pompe Hydraulique', 'resolved', now() - interval '88 days'),
('a1e00111-2000-4000-8000-000000000095', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'device_offline', 'medium', 'HVAC Principal hors ligne depuis plus de 10 minutes', 'active', now() - interval '60 days'),
('a1e00111-2000-4000-8000-000000000096', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000011', 'device_offline', 'medium', 'Compresseur 2 hors ligne depuis plus de 10 minutes', 'active', now() - interval '17 days'),
('a1e00111-2000-4000-8000-000000000097', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000021', 'overconsumption', 'medium', 'Surconsommation détectée sur Ascenseur 1', 'active', now() - interval '3 days'),
('a1e00111-2000-4000-8000-000000000098', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000013', 'overconsumption', 'high', 'Surconsommation détectée sur Clim Salon', 'active', now() - interval '77 days'),
('a1e00111-2000-4000-8000-000000000099', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000016', 'overconsumption', 'low', 'Surconsommation détectée sur Clim Agence', 'resolved', now() - interval '68 days'),
('a1e00111-2000-4000-8000-000000000100', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000013', 'device_offline', 'critical', 'Clim Salon hors ligne depuis plus de 10 minutes', 'active', now() - interval '25 days'),
('a1e00111-2000-4000-8000-000000000101', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000030', 'overconsumption', 'critical', 'Surconsommation détectée sur Rack Serveur B', 'resolved', now() - interval '42 days'),
('a1e00111-2000-4000-8000-000000000102', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000031', 'anomaly', 'medium', 'Comportement anormal détecté sur Système Refroid.', 'active', now() - interval '41 days'),
('a1e00111-2000-4000-8000-000000000103', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000021', 'anomaly', 'medium', 'Comportement anormal détecté sur Ascenseur 1', 'resolved', now() - interval '25 days'),
('a1e00111-2000-4000-8000-000000000104', 'b2d00111-2000-4000-8000-000000000005', 'd3e00111-2000-4000-8000-000000000016', 'anomaly', 'critical', 'Comportement anormal détecté sur Clim Agence', 'resolved', now() - interval '8 days'),
('a1e00111-2000-4000-8000-000000000105', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000021', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '57 days'),
('a1e00111-2000-4000-8000-000000000106', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000023', 'overconsumption', 'medium', 'Surconsommation détectée sur Cuisine Industrielle', 'resolved', now() - interval '5 days'),
('a1e00111-2000-4000-8000-000000000107', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000001', 'overconsumption', 'medium', 'Surconsommation détectée sur Clim Salon', 'active', now() - interval '65 days'),
('a1e00111-2000-4000-8000-000000000108', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000031', 'device_offline', 'medium', 'Système Refroid. hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '10 days'),
('a1e00111-2000-4000-8000-000000000109', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'anomaly', 'high', 'Comportement anormal détecté sur Clim Chambre 1', 'active', now() - interval '45 days'),
('a1e00111-2000-4000-8000-000000000110', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000008', 'device_offline', 'critical', 'Ascenseur hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '50 days'),
('a1e00111-2000-4000-8000-000000000111', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000006', 'anomaly', 'critical', 'Comportement anormal détecté sur HVAC Bureau', 'active', now() - interval '65 days'),
('a1e00111-2000-4000-8000-000000000112', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000030', 'overconsumption', 'critical', 'Surconsommation détectée sur Rack Serveur B', 'active', now() - interval '2 days'),
('a1e00111-2000-4000-8000-000000000113', 'b2d00111-2000-4000-8000-000000000008', 'd3e00111-2000-4000-8000-000000000025', 'overconsumption', 'critical', 'Surconsommation détectée sur Chauffe-eau Solar', 'active', now() - interval '51 days'),
('a1e00111-2000-4000-8000-000000000114', 'b2d00111-2000-4000-8000-000000000006', 'd3e00111-2000-4000-8000-000000000018', 'device_offline', 'low', 'Piscine Pompe hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '79 days'),
('a1e00111-2000-4000-8000-000000000115', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000011', 'overconsumption', 'critical', 'Surconsommation détectée sur Compresseur 2', 'resolved', now() - interval '58 days'),
('a1e00111-2000-4000-8000-000000000116', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '37 days'),
('a1e00111-2000-4000-8000-000000000117', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000003', 'overconsumption', 'medium', 'Surconsommation détectée sur Chauffe-eau', 'resolved', now() - interval '51 days'),
('a1e00111-2000-4000-8000-000000000118', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'overconsumption', 'medium', 'Surconsommation détectée sur Machine à laver', 'resolved', now() - interval '63 days'),
('a1e00111-2000-4000-8000-000000000119', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000013', 'device_offline', 'low', 'Clim Salon hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '9 days'),
('a1e00111-2000-4000-8000-000000000120', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'device_offline', 'low', 'Clim Chambre 1 hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '57 days'),
('a1e00111-2000-4000-8000-000000000121', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000030', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '4 days'),
('a1e00111-2000-4000-8000-000000000122', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000003', 'anomaly', 'medium', 'Comportement anormal détecté sur Chauffe-eau', 'resolved', now() - interval '85 days'),
('a1e00111-2000-4000-8000-000000000123', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000001', 'overconsumption', 'high', 'Surconsommation détectée sur Clim Salon', 'resolved', now() - interval '47 days'),
('a1e00111-2000-4000-8000-000000000124', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000030', 'overconsumption', 'medium', 'Surconsommation détectée sur Rack Serveur B', 'active', now() - interval '16 days'),
('a1e00111-2000-4000-8000-000000000125', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'anomaly', 'low', 'Comportement anormal détecté sur Serveurs IT', 'active', now() - interval '49 days'),
('a1e00111-2000-4000-8000-000000000126', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000008', 'anomaly', 'low', 'Comportement anormal détecté sur Ascenseur', 'resolved', now() - interval '11 days'),
('a1e00111-2000-4000-8000-000000000127', 'b2d00111-2000-4000-8000-000000000009', 'd3e00111-2000-4000-8000-000000000028', 'device_offline', 'critical', 'Éclairage LED hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '17 days'),
('a1e00111-2000-4000-8000-000000000128', 'b2d00111-2000-4000-8000-000000000003', 'd3e00111-2000-4000-8000-000000000012', 'device_offline', 'critical', 'Pompe Hydraulique hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '37 days'),
('a1e00111-2000-4000-8000-000000000129', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000015', 'overconsumption', 'low', 'Surconsommation détectée sur Machine à laver', 'resolved', now() - interval '62 days'),
('a1e00111-2000-4000-8000-000000000130', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000013', 'overconsumption', 'high', 'Surconsommation détectée sur Clim Salon', 'resolved', now() - interval '57 days'),
('a1e00111-2000-4000-8000-000000000131', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000029', 'budget_exceeded', 'high', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '60 days'),
('a1e00111-2000-4000-8000-000000000132', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'budget_exceeded', 'medium', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '67 days'),
('a1e00111-2000-4000-8000-000000000133', 'b2d00111-2000-4000-8000-000000000009', 'd3e00111-2000-4000-8000-000000000026', 'anomaly', 'low', 'Comportement anormal détecté sur HVAC Siège', 'resolved', now() - interval '7 days'),
('a1e00111-2000-4000-8000-000000000134', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000030', 'device_offline', 'critical', 'Rack Serveur B hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '59 days'),
('a1e00111-2000-4000-8000-000000000135', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000008', 'anomaly', 'high', 'Comportement anormal détecté sur Ascenseur', 'active', now() - interval '62 days'),
('a1e00111-2000-4000-8000-000000000136', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000014', 'device_offline', 'critical', 'Chauffe-eau hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '69 days'),
('a1e00111-2000-4000-8000-000000000137', 'b2d00111-2000-4000-8000-000000000006', 'd3e00111-2000-4000-8000-000000000019', 'overconsumption', 'critical', 'Surconsommation détectée sur Clim Master', 'resolved', now() - interval '35 days'),
('a1e00111-2000-4000-8000-000000000138', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000029', 'device_offline', 'low', 'Rack Serveur A hors ligne depuis plus de 10 minutes', 'active', now() - interval '75 days'),
('a1e00111-2000-4000-8000-000000000139', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000006', 'overconsumption', 'critical', 'Surconsommation détectée sur HVAC Bureau', 'resolved', now() - interval '55 days'),
('a1e00111-2000-4000-8000-000000000140', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'anomaly', 'high', 'Comportement anormal détecté sur Serveurs IT', 'active', now() - interval '52 days'),
('a1e00111-2000-4000-8000-000000000141', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '26 days'),
('a1e00111-2000-4000-8000-000000000142', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000013', 'device_offline', 'medium', 'Clim Salon hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '40 days'),
('a1e00111-2000-4000-8000-000000000143', 'b2d00111-2000-4000-8000-000000000010', 'd3e00111-2000-4000-8000-000000000029', 'overconsumption', 'critical', 'Surconsommation détectée sur Rack Serveur A', 'resolved', now() - interval '47 days'),
('a1e00111-2000-4000-8000-000000000144', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000001', 'anomaly', 'critical', 'Comportement anormal détecté sur Clim Salon', 'resolved', now() - interval '75 days'),
('a1e00111-2000-4000-8000-000000000145', 'b2d00111-2000-4000-8000-000000000002', 'd3e00111-2000-4000-8000-000000000007', 'anomaly', 'high', 'Comportement anormal détecté sur Serveurs IT', 'active', now() - interval '50 days'),
('a1e00111-2000-4000-8000-000000000146', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000020', 'budget_exceeded', 'low', 'Budget mensuel dépassé à 90% pour le bâtiment', 'resolved', now() - interval '7 days'),
('a1e00111-2000-4000-8000-000000000147', 'b2d00111-2000-4000-8000-000000000001', 'd3e00111-2000-4000-8000-000000000002', 'anomaly', 'medium', 'Comportement anormal détecté sur Clim Chambre 1', 'resolved', now() - interval '72 days'),
('a1e00111-2000-4000-8000-000000000148', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000014', 'device_offline', 'medium', 'Chauffe-eau hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '62 days'),
('a1e00111-2000-4000-8000-000000000149', 'b2d00111-2000-4000-8000-000000000007', 'd3e00111-2000-4000-8000-000000000021', 'device_offline', 'medium', 'Ascenseur 1 hors ligne depuis plus de 10 minutes', 'resolved', now() - interval '81 days'),
('a1e00111-2000-4000-8000-000000000150', 'b2d00111-2000-4000-8000-000000000004', 'd3e00111-2000-4000-8000-000000000014', 'budget_exceeded', 'critical', 'Budget mensuel dépassé à 90% pour le bâtiment', 'active', now() - interval '82 days')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- RECOMMENDATIONS
-- ==========================================
INSERT INTO public.recommendations (id, building_id, title, description, category, priority, estimated_saving_kwh, estimated_saving_tnd, is_applied, created_at)
VALUES
('f3c00111-2000-4000-8000-000000000001', 'b2d00111-2000-4000-8000-000000000001', 'Optimiser le chauffe-eau', 'Programmer entre 22h-6h, économie estimée: 30%', 'scheduling', 'high', 45, 13.5, false, now() - interval '5 days'),
('f3c00111-2000-4000-8000-000000000002', 'b2d00111-2000-4000-8000-000000000002', 'HVAC heures creuses', 'Réduire consigne de 2°C en dehors des heures bureau', 'behavior', 'high', 200, 60, false, now() - interval '2 days'),
('f3c00111-2000-4000-8000-000000000003', 'b2d00111-2000-4000-8000-000000000003', 'Décaler les compresseurs', 'Alterner Compresseur 1 et 2 pour éviter pic simultané', 'scheduling', 'medium', 300, 90, false, now() - interval '7 days'),
('f3c00111-2000-4000-8000-000000000004', 'b2d00111-2000-4000-8000-000000000007', 'Audit HVAC hôtel', 'Consommation 18% au-dessus de la moyenne du secteur', 'replacement', 'high', 1200, 360, false, now() - interval '6 days'),
('f3c00111-2000-4000-8000-000000000005', 'b2d00111-2000-4000-8000-000000000009', 'Éclairage LED détecteur mouvement', 'Installer détecteurs dans couloirs et salles de réunion', 'replacement', 'medium', 80, 24, false, now() - interval '5 days'),
('f3c00111-2000-4000-8000-000000000006', 'b2d00111-2000-4000-8000-000000000010', 'Refroidissement datacenter optimisé', 'Température cible 22°C → 24°C économise 15% énergie refroid.', 'behavior', 'high', 500, 150, false, now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- GRANT ADMIN ROLE TO TARGET USER
-- ==========================================
INSERT INTO public.user_roles (user_id, role) SELECT (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1), 'admin' WHERE (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1) IS NOT NULL ON CONFLICT (user_id, role) DO NOTHING;
UPDATE public.user_roles SET role = 'admin' WHERE user_id = (SELECT id FROM auth.users WHERE email = 'adelfiras78@gmail.com' LIMIT 1);

-- ==========================================
-- DISABLE RLS FOR THE DEMO DASHBOARD
-- ==========================================
ALTER TABLE public.buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

