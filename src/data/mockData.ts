export interface Device {
  id: string;
  buildingId: string;
  name: string;
  type: 'air_conditioner' | 'water_heater' | 'refrigerator' | 'washing_machine' | 'lighting' | 'other';
  status: 'online' | 'offline' | 'error';
  isOn: boolean;
  currentPower: number;
  todayConsumption: number;
  lastSeen: string;
  location: string;
}

export interface Alert {
  id: string;
  type: 'overconsumption' | 'device_offline' | 'anomaly' | 'budget_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  deviceName?: string;
  status: 'active' | 'resolved';
  createdAt: string;
}

export interface EnergyHistory {
  time: string;
  power: number;
  predicted?: number;
}

export interface DeviceShare {
  name: string;
  kwh: number;
  percentage: number;
  color: string;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  savingKwh: number;
  savingTND: number;
}

export const devices: Device[] = [
  { id: 'dev_001', buildingId: 'bld_001', name: 'Climatiseur Salon', type: 'air_conditioner', status: 'online', isOn: true, currentPower: 1200, todayConsumption: 4.8, lastSeen: '2026-04-07T09:55:00Z', location: 'Salon' },
  { id: 'dev_002', buildingId: 'bld_001', name: 'Chauffe-eau', type: 'water_heater', status: 'online', isOn: false, currentPower: 0, todayConsumption: 2.1, lastSeen: '2026-04-07T09:50:00Z', location: 'Salle de bain' },
  { id: 'dev_003', buildingId: 'bld_001', name: 'Réfrigérateur', type: 'refrigerator', status: 'online', isOn: true, currentPower: 150, todayConsumption: 1.8, lastSeen: '2026-04-07T09:58:00Z', location: 'Cuisine' },
  { id: 'dev_004', buildingId: 'bld_001', name: 'Machine à laver', type: 'washing_machine', status: 'offline', isOn: false, currentPower: 0, todayConsumption: 0.9, lastSeen: '2026-04-07T07:30:00Z', location: 'Buanderie' },
  { id: 'dev_005', buildingId: 'bld_001', name: 'Éclairage Salon', type: 'lighting', status: 'online', isOn: true, currentPower: 60, todayConsumption: 0.5, lastSeen: '2026-04-07T09:59:00Z', location: 'Salon' },
  { id: 'dev_006', buildingId: 'bld_001', name: 'Climatiseur Chambre', type: 'air_conditioner', status: 'online', isOn: false, currentPower: 0, todayConsumption: 1.2, lastSeen: '2026-04-07T09:40:00Z', location: 'Chambre' },
  { id: 'dev_007', buildingId: 'bld_001', name: 'Éclairage Cuisine', type: 'lighting', status: 'online', isOn: true, currentPower: 40, todayConsumption: 0.3, lastSeen: '2026-04-07T09:59:00Z', location: 'Cuisine' },
  { id: 'dev_008', buildingId: 'bld_001', name: 'Four Électrique', type: 'other', status: 'online', isOn: false, currentPower: 0, todayConsumption: 1.5, lastSeen: '2026-04-07T08:20:00Z', location: 'Cuisine' },
];

export const alerts: Alert[] = [
  { id: 'alt_001', type: 'overconsumption', severity: 'high', message: 'Climatiseur Salon consomme 3x plus que la normale', deviceName: 'Climatiseur Salon', status: 'active', createdAt: '2026-04-07T09:30:00Z' },
  { id: 'alt_002', type: 'device_offline', severity: 'medium', message: 'Machine à laver déconnectée depuis 2h', deviceName: 'Machine à laver', status: 'active', createdAt: '2026-04-07T07:30:00Z' },
  { id: 'alt_003', type: 'budget_exceeded', severity: 'high', message: 'Budget mensuel dépassé de 15%', status: 'active', createdAt: '2026-04-06T18:00:00Z' },
  { id: 'alt_004', type: 'anomaly', severity: 'low', message: 'Pic de consommation inhabituel détecté', deviceName: 'Réfrigérateur', status: 'resolved', createdAt: '2026-04-05T14:20:00Z' },
  { id: 'alt_005', type: 'overconsumption', severity: 'critical', message: 'Puissance totale dépasse 4000W — risque de disjonction', status: 'resolved', createdAt: '2026-04-04T19:45:00Z' },
];

export const energyHistory: EnergyHistory[] = Array.from({ length: 24 }, (_, i) => {
  const base = 400 + Math.sin(i / 3) * 300 + (i > 6 && i < 22 ? 600 : 0);
  return {
    time: `${i.toString().padStart(2, '0')}:00`,
    power: Math.round(base + Math.random() * 200),
    predicted: Math.round(base + Math.random() * 100 - 50),
  };
});

export const weeklyHistory = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => ({
  day,
  kwh: Math.round(12 + Math.random() * 10),
  cost: parseFloat((3.6 + Math.random() * 3).toFixed(1)),
}));

export const deviceShares: DeviceShare[] = [
  { name: 'Climatiseurs', kwh: 180.5, percentage: 40.1, color: 'hsl(210, 100%, 56%)' },
  { name: 'Chauffe-eau', kwh: 90.2, percentage: 20.0, color: 'hsl(0, 72%, 51%)' },
  { name: 'Réfrigérateur', kwh: 54.1, percentage: 12.0, color: 'hsl(185, 80%, 48%)' },
  { name: 'Éclairage', kwh: 36.0, percentage: 8.0, color: 'hsl(38, 92%, 50%)' },
  { name: 'Machine à laver', kwh: 45.2, percentage: 10.0, color: 'hsl(270, 70%, 60%)' },
  { name: 'Autres', kwh: 44.2, percentage: 9.9, color: 'hsl(220, 14%, 40%)' },
];

export const recommendations: Recommendation[] = [
  { id: 'rec_001', priority: 'high', category: 'Planification', title: 'Optimiser le chauffe-eau', description: 'Programmer le chauffe-eau entre 22h-6h (heures creuses) pour réduire les coûts de 30%.', savingKwh: 25, savingTND: 7.5 },
  { id: 'rec_002', priority: 'high', category: 'Température', title: 'Ajuster le climatiseur', description: 'Augmenter la consigne de 2°C. Économie estimée: 15% sur la climatisation.', savingKwh: 18, savingTND: 5.4 },
  { id: 'rec_003', priority: 'medium', category: 'Éclairage', title: 'Passer aux LED', description: 'Remplacer les ampoules restantes par des LED pour réduire la consommation d\'éclairage de 60%.', savingKwh: 10, savingTND: 3.0 },
  { id: 'rec_004', priority: 'low', category: 'Standby', title: 'Éliminer le standby', description: 'Les appareils en veille consomment ~8% de l\'énergie totale. Utilisez des multiprises à interrupteur.', savingKwh: 8, savingTND: 2.4 },
];

export const monthlyData = [
  { month: 'Jan', kwh: 420, cost: 126 },
  { month: 'Fév', kwh: 380, cost: 114 },
  { month: 'Mar', kwh: 450, cost: 135 },
  { month: 'Avr', kwh: 390, cost: 117 },
  { month: 'Mai', kwh: 520, cost: 156 },
  { month: 'Jun', kwh: 610, cost: 183 },
  { month: 'Jul', kwh: 680, cost: 204 },
  { month: 'Aoû', kwh: 650, cost: 195 },
  { month: 'Sep', kwh: 540, cost: 162 },
  { month: 'Oct', kwh: 430, cost: 129 },
  { month: 'Nov', kwh: 400, cost: 120 },
  { month: 'Déc', kwh: 440, cost: 132 },
];
