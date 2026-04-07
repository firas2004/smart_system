import { useState } from 'react';
import { Building2, Users, Cpu, AlertTriangle, Plus, Eye, UserPlus, Trash2 } from 'lucide-react';
import { useBuildings, useAllProfiles, useDevices, useAlerts } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TaskList from '@/components/dashboard/TaskList';

const AdminDashboard = () => {
  const { data: buildings, isLoading: loadingBuildings } = useBuildings();
  const { data: profiles } = useAllProfiles();
  const { data: allDevices } = useDevices();
  const { data: allAlerts } = useAlerts();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ name: '', address: '', city: '', type: 'residential', surface: 0, occupants: 0 });
  const [adminName, setAdminName] = useState('');

  const { user } = useAuth();

  const clients = profiles?.filter(p => p.user_id !== user?.id) || [];

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localStorage.getItem('mockAdmin') === 'true') {
      const newB = {
        id: 'b' + Date.now(),
        name: newBuilding.name,
        address: newBuilding.address,
        city: newBuilding.city,
        type: newBuilding.type,
        surface: newBuilding.surface || null,
        occupants: newBuilding.occupants || null,
      };
      // In a real mock we would update MOCK_BUILDINGS, but since it's a constant we just show a success toast
      // For a fully working mock we would need a state or local storage. Here we just simulate success.
      toast({ title: 'Bâtiment créé ! (Mode Démo)' });
      setShowAddBuilding(false);
      setNewBuilding({ name: '', address: '', city: '', type: 'residential', surface: 0, occupants: 0 });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('buildings').insert({
      name: newBuilding.name,
      address: newBuilding.address,
      city: newBuilding.city,
      type: newBuilding.type,
      surface: newBuilding.surface || null,
      occupants: newBuilding.occupants || null,
      owner_id: user.id,
    });

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Bâtiment créé !' });
      setShowAddBuilding(false);
      setNewBuilding({ name: '', address: '', city: '', type: 'residential', surface: 0, occupants: 0 });
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localStorage.getItem('mockAdmin') === 'true') {
      toast({ title: 'Admin ajouté ! (Mode Démo)' });
      setShowAddAdmin(false);
      setAdminName('');
      return;
    }

    // Find user by name in profiles
    const profile = profiles?.find(p => {
      // We need to match by name
      return p.name === adminName || p.name?.toLowerCase() === adminName.toLowerCase();
    });

    if (!profile) {
      toast({ title: 'Erreur', description: 'Utilisateur non trouvé. Il doit d\'abord créer un compte.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('user_roles').insert({
      user_id: profile.user_id,
      role: 'admin' as any,
    });

    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Info', description: 'Cet utilisateur est déjà admin.' });
      } else {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Admin ajouté !' });
      setShowAddAdmin(false);
      setAdminName('');
    }
  };

  const activeAlerts = allAlerts?.filter(a => a.status === 'active') || [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel Administrateur</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion des bâtiments, clients et appareils</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddAdmin(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">
            <UserPlus className="w-4 h-4" /> Ajouter Admin
          </button>
          <button onClick={() => setShowAddBuilding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl energy-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Nouveau Bâtiment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 stat-glow-green">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Bâtiments</p>
              <p className="text-2xl font-bold font-mono text-foreground">{buildings?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 stat-glow-blue">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-energy-blue/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-energy-blue" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Clients</p>
              <p className="text-2xl font-bold font-mono text-foreground">{clients.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 stat-glow-amber">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-energy-amber/15 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-energy-amber" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Appareils</p>
              <p className="text-2xl font-bold font-mono text-foreground">{allDevices?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 stat-glow-red">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-energy-red/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-energy-red" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Alertes Actives</p>
              <p className="text-2xl font-bold font-mono text-foreground">{activeAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buildings list */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h2 className="text-base font-semibold text-foreground">Bâtiments</h2>
        </div>
        {loadingBuildings ? (
          <div className="p-8 text-center text-muted-foreground">Chargement...</div>
        ) : buildings && buildings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Nom</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Ville</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Appareils</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Clients</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map(b => {
                  const devCount = allDevices?.filter(d => d.building_id === b.id).length || 0;
                  const clientCount = clients.filter(c => c.building_id === b.id).length;
                  return (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-foreground">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.address}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{b.city || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary capitalize">{b.type}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-mono text-foreground">{devCount}</td>
                      <td className="px-5 py-4 text-sm font-mono text-foreground">{clientCount}</td>
                      <td className="px-5 py-4 text-center">
                        <Link to={`/admin/building/${b.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> Voir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun bâtiment. Créez votre premier bâtiment.</p>
          </div>
        )}
      </div>

      {/* Clients list */}
      <div className="glass-card overflow-hidden mt-6">
        <div className="p-5 border-b border-border/50">
          <h2 className="text-base font-semibold text-foreground">Clients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Nom</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Bâtiment</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? clients.map(client => {
                const building = buildings?.find(b => b.id === client.building_id);
                return (
                  <tr key={client.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{client.name}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {building ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                          {building.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Non assigné</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(client.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-6">
        <TaskList />
      </div>

      {/* Add Building Modal */}
      {showAddBuilding && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Nouveau Bâtiment</h2>
            <form onSubmit={handleAddBuilding} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Nom du bâtiment *</label>
                <input type="text" required value={newBuilding.name} onChange={e => setNewBuilding(s => ({ ...s, name: e.target.value }))}
                  placeholder="Ex: Résidence Essourour"
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Adresse</label>
                  <input type="text" value={newBuilding.address} onChange={e => setNewBuilding(s => ({ ...s, address: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Ville</label>
                  <input type="text" value={newBuilding.city} onChange={e => setNewBuilding(s => ({ ...s, city: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Type</label>
                <select value={newBuilding.type} onChange={e => setNewBuilding(s => ({ ...s, type: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="residential">Résidentiel</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industriel</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Surface (m²)</label>
                  <input type="number" value={newBuilding.surface || ''} onChange={e => setNewBuilding(s => ({ ...s, surface: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Occupants</label>
                  <input type="number" value={newBuilding.occupants || ''} onChange={e => setNewBuilding(s => ({ ...s, occupants: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddBuilding(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">Annuler</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl energy-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Ajouter un Admin</h2>
            <p className="text-xs text-muted-foreground mb-4">L'utilisateur doit d'abord avoir créé un compte. Entrez son nom.</p>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Nom de l'utilisateur</label>
                <input type="text" required value={adminName} onChange={e => setAdminName(e.target.value)}
                  placeholder="Ex: John Doe"
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddAdmin(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium">Annuler</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl energy-gradient text-primary-foreground text-sm font-medium">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
