import { Zap, DollarSign, TrendingUp, Plug } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PowerChart from '@/components/dashboard/PowerChart';
import DeviceDonut from '@/components/dashboard/DeviceDonut';
import DeviceCard from '@/components/dashboard/DeviceCard';
import AlertBanner from '@/components/dashboard/AlertBanner';
import { useDevices, useAlerts, useBuildings } from '@/hooks/useSupabaseData';
import { devices as mockDevices, alerts as mockAlerts } from '@/data/mockData';

const Dashboard = () => {
  const { data: buildings } = useBuildings();
  const buildingId = buildings?.[0]?.id;
  const { data: dbDevices } = useDevices(buildingId);
  const { data: dbAlerts } = useAlerts(buildingId);

  const devices = dbDevices && dbDevices.length > 0
    ? dbDevices.map(d => ({
        id: d.id,
        buildingId: d.building_id,
        name: d.name,
        type: d.type as any,
        status: d.status as any,
        isOn: d.is_on ?? false,
        currentPower: Number(d.current_power) || 0,
        todayConsumption: Number(d.today_consumption) || 0,
        lastSeen: d.last_seen || '',
        location: d.location || '',
      }))
    : mockDevices;

  const alerts = dbAlerts && dbAlerts.length > 0
    ? dbAlerts.map(a => ({
        id: a.id,
        type: a.type as any,
        severity: a.severity as any,
        message: a.message,
        status: (a.status || 'active') as any,
        createdAt: a.created_at,
      }))
    : mockAlerts;

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const activeDevices = devices.filter(d => d.isOn);
  const totalPower = activeDevices.reduce((s, d) => s + d.currentPower, 0);
  const totalConsumption = devices.reduce((s, d) => s + d.todayConsumption, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Énergétique</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-energy-green animate-pulse-glow" />
            Temps réel connecté — {buildings?.[0]?.name || 'Résidence Ben Ali'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Puissance totale</p>
          <p className="text-3xl font-bold font-mono text-primary">{totalPower} W</p>
        </div>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.slice(0, 2).map(alert => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Consommation Aujourd'hui" value={`${totalConsumption.toFixed(1)} kWh`} icon={Zap} trend={-5.3} glowClass="stat-glow-green" />
        <StatCard title="Coût Estimé" value={`${(totalConsumption * 0.3).toFixed(2)} TND`} icon={DollarSign} glowClass="stat-glow-amber" />
        <StatCard title="Puissance de Pointe" value={`${totalPower} W`} icon={TrendingUp} glowClass="stat-glow-red" />
        <StatCard title="Appareils Actifs" value={`${activeDevices.length} / ${devices.length}`} icon={Plug} glowClass="stat-glow-blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PowerChart />
        </div>
        <DeviceDonut />
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Contrôle des Appareils</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
