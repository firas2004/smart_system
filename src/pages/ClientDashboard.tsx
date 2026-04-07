import { useState } from 'react';
import { Zap, DollarSign, TrendingUp, Plug, Plus } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PowerChart from '@/components/dashboard/PowerChart';
import DeviceDonut from '@/components/dashboard/DeviceDonut';
import DeviceCard from '@/components/dashboard/DeviceCard';
import AlertBanner from '@/components/dashboard/AlertBanner';
import AddDeviceForm from '@/components/devices/AddDeviceForm';
import TaskList from '@/components/dashboard/TaskList';
import { useDevices, useAlerts, useProfile, useBuildings } from '@/hooks/useSupabaseData';
import { useUserRole } from '@/hooks/useSupabaseData';

const ClientDashboard = () => {
  const { data: profile } = useProfile();
  const { data: roleData } = useUserRole();
  const buildingId = profile?.building_id;
  const { data: buildings } = useBuildings();
  const { data: dbDevices } = useDevices(buildingId || undefined);
  const { data: dbAlerts } = useAlerts(buildingId || undefined);
  const [showAddDevice, setShowAddDevice] = useState(false);

  const building = buildings?.find(b => b.id === buildingId);
  const devices = dbDevices || [];
  const alerts = dbAlerts?.filter(a => a.status === 'active') || [];

  const activeDevices = devices.filter(d => d.is_on);
  const totalPower = activeDevices.reduce((s, d) => s + (Number(d.current_power) || 0), 0);
  const totalConsumption = devices.reduce((s, d) => s + (Number(d.today_consumption) || 0), 0);
  const electricityRate = building?.electricity_rate ? Number(building.electricity_rate) : 0.3;

  if (!buildingId) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Bienvenue sur Smart Energy</h1>
        <p className="text-muted-foreground max-w-md">
          Votre compte n'est pas encore associé à un bâtiment. Veuillez contacter votre administrateur pour qu'il vous assigne à votre résidence ou espace commercial.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-energy-green animate-pulse-glow" />
            {building?.name || 'Mon bâtiment'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddDevice(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl energy-gradient text-primary-foreground text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> Ajouter Appareil
          </button>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Puissance totale</p>
            <p className="text-3xl font-bold font-mono text-primary">{totalPower} W</p>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 2).map(a => (
            <AlertBanner key={a.id} alert={{ id: a.id, type: a.type as any, severity: a.severity as any, message: a.message, status: (a.status || 'active') as any, createdAt: a.created_at }} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Consommation Aujourd'hui" value={`${totalConsumption.toFixed(1)} kWh`} icon={Zap} glowClass="stat-glow-green" />
        <StatCard title="Coût Estimé" value={`${(totalConsumption * electricityRate).toFixed(2)} TND`} icon={DollarSign} glowClass="stat-glow-amber" />
        <StatCard title="Puissance Actuelle" value={`${totalPower} W`} icon={TrendingUp} glowClass="stat-glow-red" />
        <StatCard title="Mes Appareils" value={`${activeDevices.length} / ${devices.length}`} icon={Plug} glowClass="stat-glow-blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><PowerChart /></div>
        <DeviceDonut />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Mes Appareils</h2>
        </div>
        {devices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.map(d => (
              <DeviceCard key={d.id} device={{
                id: d.id, buildingId: d.building_id, name: d.name, type: d.type as any,
                status: (d.status || 'offline') as any, isOn: d.is_on ?? false,
                currentPower: Number(d.current_power) || 0, todayConsumption: Number(d.today_consumption) || 0,
                lastSeen: d.last_seen || '', location: d.location || '',
              }} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <Plug className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">Aucun appareil. Ajoutez votre premier appareil !</p>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="mt-6">
        <TaskList />
      </div>

      {showAddDevice && buildingId && (
        <AddDeviceForm onClose={() => setShowAddDevice(false)} buildingId={buildingId} />
      )}
    </div>
  );
};

export default ClientDashboard;
