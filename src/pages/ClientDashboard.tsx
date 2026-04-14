import { useState } from 'react';
import { Zap, DollarSign, TrendingUp, Plug, Plus, Building2, Sparkles } from 'lucide-react';
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
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 flex items-center justify-center">
          <Building2 className="w-10 h-10 text-cyan-400" />
        </div>
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Bienvenue</h1>
          <p className="text-cyan-300/70 leading-relaxed text-lg">
            Votre compte n'est pas encore associé à un bâtiment. Veuillez contacter votre administrateur pour qu'il vous assigne à votre résidence ou espace commercial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Système Actif</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black neon-text">Mon Dashboard</h1>
            <p className="text-cyan-300/70 text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {building?.name || 'Mon bâtiment'}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <button onClick={() => setShowAddDevice(true)}
              className="btn-neon-primary flex items-center gap-2">
              <Plus className="w-5 h-5" /> Ajouter Appareil
            </button>
            <div className="text-right p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <p className="text-xs text-cyan-400/70 font-bold uppercase tracking-wider">Puissance Totale</p>
              <p className="text-4xl font-black text-cyan-300 mt-1 font-mono">{totalPower}<span className="text-lg">W</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Alertes Actives</p>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 3).map(a => (
              <AlertBanner key={a.id} alert={{ id: a.id, type: a.type as any, severity: a.severity as any, message: a.message, status: (a.status || 'active') as any, createdAt: a.created_at }} />
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Consommation Aujourd'hui" value={`${totalConsumption.toFixed(1)} kWh`} icon={Zap} glowClass="stat-glow-green" />
        <StatCard title="Coût Estimé" value={`${(totalConsumption * electricityRate).toFixed(2)} TND`} icon={DollarSign} glowClass="stat-glow-amber" />
        <StatCard title="Puissance Actuelle" value={`${totalPower} W`} icon={TrendingUp} glowClass="stat-glow-red" />
        <StatCard title="Mes Appareils" value={`${activeDevices.length} / ${devices.length}`} icon={Plug} glowClass="stat-glow-blue" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><PowerChart /></div>
        <DeviceDonut />
      </div>

      {/* Devices Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-cyan-300">Mes Appareils</h2>
          <span className="text-xs bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 font-bold">{devices.length} appareils</span>
        </div>
        {devices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.map((d, idx) => (
              <div key={d.id} className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <DeviceCard device={{
                  id: d.id, buildingId: d.building_id, name: d.name, type: d.type as any,
                  status: (d.status || 'offline') as any, isOn: d.is_on ?? false,
                  currentPower: Number(d.current_power) || 0, todayConsumption: Number(d.today_consumption) || 0,
                  lastSeen: d.last_seen || '', location: d.location || '',
                }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <Plug className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-cyan-300/70 font-medium">Aucun appareil. Ajoutez votre premier appareil !</p>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="mt-8">
        <TaskList />
      </div>

      {showAddDevice && buildingId && (
        <AddDeviceForm onClose={() => setShowAddDevice(false)} buildingId={buildingId} />
      )}
    </div>
  );
};

export default ClientDashboard;
