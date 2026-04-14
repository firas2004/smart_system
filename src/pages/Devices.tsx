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
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="relative flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center hover:border-cyan-500/60 transition-all hover:shadow-cyan-500/30 hover:shadow-lg group">
            <ArrowLeft className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          </Link>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Gestion Appareils</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black neon-text">{isAdmin ? 'Tous les Appareils' : 'Mes Appareils'}</h1>
            <p className="text-cyan-300/70 text-lg">
              <span className="inline-block bg-cyan-500/20 px-3 py-1 rounded-lg border border-cyan-500/30 font-mono">
                {devices.length} appareils — {devices.filter(d => d.status === 'online').length} en ligne
              </span>
            </p>
          </div>
        </div>
        {buildingId && (
          <button onClick={() => setShowAddDevice(true)}
            className="btn-neon-primary flex items-center gap-2 h-fit">
            <Plus className="w-5 h-5" /> Ajouter Appareil
          </button>
        )}
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
            <input type="text" placeholder="Rechercher un appareil..." value={search} onChange={e => setSearch(e.target.value)}
              className="input-glow w-full pl-12 pr-4 py-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'air_conditioner', 'water_heater', 'refrigerator', 'lighting'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                filter === t
                  ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-500/60 text-cyan-200 shadow-cyan-500/20 shadow-lg'
                  : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400/70 hover:border-cyan-500/40'
              }`}>
              {t === 'all' ? 'Tous' : typeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Devices Table */}
      {filtered.length > 0 ? (
        <div className="table-neon overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                  {['Appareil', 'Type', 'Statut', 'Puissance', "Aujourd'hui", 'Contrôle'].map(h => (
                    <th key={h} className={`text-left text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4 ${h === 'Contrôle' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((device, idx) => {
                  const Icon = iconMap[device.type] || Plug;
                  return (
                    <tr key={device.id} className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-colors group animate-slide-up" style={{ animationDelay: `${idx * 30}ms` }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                            device.is_on
                              ? 'bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border-cyan-500/60 text-cyan-300'
                              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400/50'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-cyan-200 group-hover:text-cyan-100">{device.name}</p>
                            <p className="text-xs text-cyan-400/50 font-mono">{device.location || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300 uppercase tracking-wider">
                          {typeLabels[device.type] || device.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${device.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-cyan-400/30'}`} />
                          <span className={`text-xs font-black uppercase tracking-wider ${device.status === 'online' ? 'text-green-400' : 'text-cyan-400/60'}`}>
                            {device.status === 'online' ? 'En Ligne' : 'Hors Ligne'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-black font-mono ${device.is_on ? 'text-cyan-300' : 'text-cyan-400/50'}`}>
                          {device.is_on ? `${device.current_power} W` : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black font-mono text-purple-300">{device.today_consumption} kWh</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleToggle(device.id, device.is_on ?? false)}
                          disabled={device.status === 'offline'}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all border font-black ${
                            device.is_on
                              ? 'bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border-cyan-500/60 text-cyan-300 hover:shadow-cyan-500/30 hover:shadow-lg'
                              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400/50 hover:border-cyan-500/40'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}>
                          <Power className="w-5 h-5" />
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
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Plug className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-cyan-300/70 font-medium text-lg">
            {search || filter !== 'all' ? 'Aucun appareil ne correspond à votre recherche.' : 'Aucun appareil trouvé.'}
          </p>
        </div>
      )}

      {showAddDevice && buildingId && (
        <AddDeviceForm onClose={() => setShowAddDevice(false)} buildingId={buildingId} />
      )}
    </div>
  );
};

export default DevicesPage;
