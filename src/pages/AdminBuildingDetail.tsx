import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Cpu, Plus, UserPlus, Trash2 } from 'lucide-react';
import { useBuildings, useDevices, useAllProfiles, MOCK_PROFILES } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Wind, Flame, Refrigerator, WashingMachine, Lightbulb, Plug } from 'lucide-react';

const iconMap: Record<string, any> = {
  air_conditioner: Wind, water_heater: Flame, refrigerator: Refrigerator,
  washing_machine: WashingMachine, lighting: Lightbulb, other: Plug,
};
const typeLabels: Record<string, string> = {
  air_conditioner: 'Climatiseur', water_heater: 'Chauffe-eau', refrigerator: 'Réfrigérateur',
  washing_machine: 'Machine à laver', lighting: 'Éclairage', other: 'Autre',
};

const AdminBuildingDetail = () => {
  const { buildingId } = useParams();
  const { data: buildings } = useBuildings();
  const { data: devices } = useDevices(buildingId);
  const { data: profiles } = useAllProfiles();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const building = buildings?.find(b => b.id === buildingId);
  const buildingClients = profiles?.filter(p => p.building_id === buildingId) || [];

  const [showAssignClient, setShowAssignClient] = useState(false);
  const [clientName, setClientName] = useState('');

  const handleAssignClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localStorage.getItem('mockAdmin') === 'true') {
      const profileIndex = MOCK_PROFILES.findIndex(p => p.name.toLowerCase() === clientName.toLowerCase());
      if (profileIndex !== -1) {
        MOCK_PROFILES[profileIndex].building_id = buildingId || '';
        toast({ title: 'Client assigné au bâtiment ! (Mode Démo)' });
        setShowAssignClient(false);
        setClientName('');
        // Force a re-fetch to update the UI
        queryClient.invalidateQueries({ queryKey: ['all_profiles'] });
        queryClient.refetchQueries({ queryKey: ['all_profiles'] });
      } else {
        toast({ title: 'Erreur', description: 'Utilisateur non trouvé.', variant: 'destructive' });
      }
      return;
    }

    const profile = profiles?.find(p =>
      p.name === clientName || p.name?.toLowerCase() === clientName.toLowerCase()
    );
    if (!profile) {
      toast({ title: 'Erreur', description: 'Utilisateur non trouvé. Il doit d\'abord créer un compte.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('profiles')
      .update({ building_id: buildingId })
      .eq('user_id', profile.user_id);

    // Fallback for RLS issues during testing on the same browser
    localStorage.setItem(`fallback_building_${profile.user_id}`, buildingId!);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      // Also add to building_members
      await supabase.from('building_members').insert({
        building_id: buildingId!,
        user_id: profile.user_id,
        role: 'client',
      });
      toast({ title: 'Client assigné au bâtiment !' });
      setShowAssignClient(false);
      setClientName('');
      queryClient.invalidateQueries({ queryKey: ['all_profiles'] });
      queryClient.invalidateQueries({ queryKey: ['building_members'] });
    }
  };

  if (!building) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-muted-foreground">Bâtiment non trouvé</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{building.name}</h1>
          <p className="text-sm text-muted-foreground">{building.address}, {building.city} — {building.type}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase">Surface</p>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{building.surface || '—'} m²</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase">Appareils</p>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{devices?.length || 0}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase">Clients</p>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{buildingClients.length}</p>
        </div>
      </div>

      {/* Clients */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-energy-blue" /> Clients
          </h2>
          <button onClick={() => setShowAssignClient(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25">
            <UserPlus className="w-3.5 h-3.5" /> Assigner Client
          </button>
        </div>
        {buildingClients.length > 0 ? (
          <div className="divide-y divide-border/30">
            {buildingClients.map(client => (
              <div key={client.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{client.name}</p>
                  <p className="text-xs text-muted-foreground">Membre depuis {new Date(client.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground text-sm">Aucun client assigné</div>
        )}
      </div>

      {/* Devices */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4 text-energy-amber" /> Appareils
          </h2>
        </div>
        {devices && devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase px-5 py-3">Appareil</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase px-5 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase px-5 py-3">Statut</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase px-5 py-3">Puissance</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase px-5 py-3">Conso. Jour</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(d => {
                  const Icon = iconMap[d.type] || Plug;
                  return (
                    <tr key={d.id} className="border-b border-border/30">
                      <td className="px-5 py-3 flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.location}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{typeLabels[d.type] || d.type}</td>
                      <td className="px-5 py-3">
                        <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${d.status === 'online' ? 'bg-energy-green' : 'bg-muted-foreground'}`} />
                        <span className="text-xs text-muted-foreground">{d.status}</span>
                      </td>
                      <td className="px-5 py-3 text-sm font-mono text-foreground">{d.is_on ? `${d.current_power} W` : '—'}</td>
                      <td className="px-5 py-3 text-sm font-mono text-foreground">{d.today_consumption} kWh</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground text-sm">Aucun appareil</div>
        )}
      </div>

      {/* Assign Client Modal */}
      {showAssignClient && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">Assigner un Client</h2>
            <p className="text-xs text-muted-foreground mb-4">Le client doit d'abord créer un compte. Entrez le nom utilisé lors de l'inscription.</p>
            <form onSubmit={handleAssignClient} className="space-y-4">
              <input type="text" required value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="Ex: John Doe"
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAssignClient(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium">Annuler</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl energy-gradient text-primary-foreground text-sm font-medium">Assigner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBuildingDetail;
