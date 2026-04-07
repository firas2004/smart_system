import { useState } from 'react';
import { Search, Power, Plus, ArrowLeft } from 'lucide-react';
import { Wind, Flame, Refrigerator, WashingMachine, Lightbulb, Plug } from 'lucide-react';
import { useDevices, useProfile, useUserRole } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AddDeviceForm from '@/components/devices/AddDeviceForm';

const iconMap: Record<string, any> = {
  air_conditioner: Wind, water_heater: Flame, refrigerator: Refrigerator,
  washing_machine: WashingMachine, lighting: Lightbulb, other: Plug,
};
const typeLabels: Record<string, string> = {
  air_conditioner: 'Climatiseur', water_heater: 'Chauffe-eau', refrigerator: 'Réfrigérateur',
  washing_machine: 'Machine à laver', lighting: 'Éclairage', other: 'Autre',
};

const DevicesPage = () => {
  const { data: profile } = useProfile();
  const { data: roleData } = useUserRole();
  const isAdmin = roleData?.isAdmin;
  const buildingId = profile?.building_id;
  const { data: dbDevices } = useDevices(isAdmin ? undefined : (buildingId || undefined));
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddDevice, setShowAddDevice] = useState(false);

  const devices = dbDevices || [];

  const filtered = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || (d.location || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.type === filter;
    return matchSearch && matchFilter;
  });

  const handleToggle = async (id: string, currentState: boolean) => {
    await supabase.from('devices').update({ is_on: !currentState }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['devices'] });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isAdmin ? 'Tous les Appareils' : 'Mes Appareils'}</h1>
            <p className="text-sm text-muted-foreground mt-1">{devices.length} appareils — {devices.filter(d => d.status === 'online').length} en ligne</p>
          </div>
          {buildingId && (
            <button onClick={() => setShowAddDevice(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl energy-gradient text-primary-foreground text-sm font-medium hover:opacity-90">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'air_conditioner', 'water_heater', 'refrigerator', 'lighting'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === t ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-border'}`}>
              {t === 'all' ? 'Tous' : typeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {['Appareil', 'Type', 'Statut', 'Puissance', "Aujourd'hui", 'Contrôle'].map(h => (
                    <th key={h} className={`text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3 ${h === 'Contrôle' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(device => {
                  const Icon = iconMap[device.type] || Plug;
                  return (
                    <tr key={device.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${device.is_on ? 'bg-primary/15' : 'bg-secondary'}`}>
                            <Icon className={`w-4 h-4 ${device.is_on ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{device.name}</p>
                            <p className="text-xs text-muted-foreground">{device.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{typeLabels[device.type] || device.type}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-energy-green' : 'bg-muted-foreground'}`} />
                          <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-mono text-foreground">{device.is_on ? `${device.current_power} W` : '—'}</td>
                      <td className="px-5 py-4 text-sm font-mono text-foreground">{device.today_consumption} kWh</td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => handleToggle(device.id, device.is_on ?? false)}
                          disabled={device.status === 'offline'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-colors ${device.is_on ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'} disabled:opacity-40`}>
                          <Power className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <Plug className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">Aucun appareil trouvé.</p>
        </div>
      )}

      {showAddDevice && buildingId && (
        <AddDeviceForm onClose={() => setShowAddDevice(false)} buildingId={buildingId} />
      )}
    </div>
  );
};

export default DevicesPage;
