import { useState } from 'react';
import { Building2, Users, Cpu, AlertTriangle, Plus, Eye, UserPlus, Trash2 } from 'lucide-react';
import { useBuildings, useAllProfiles, useDevices, useAlerts } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TaskList from '@/components/dashboard/TaskList';
import { AIModelPanel } from '@/components/LSTMPredictionChart';

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
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Système Admin</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black neon-text">Panel Administrateur</h1>
            <p className="text-cyan-300/70 text-lg">Gestion intégrée des bâtiments, clients et appareils</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-3">
              <button onClick={() => setShowAddAdmin(true)}
                className="btn-neon-secondary flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Ajouter Admin
              </button>
              <button onClick={() => setShowAddBuilding(true)}
                className="btn-neon-primary flex items-center gap-2">
                <Plus className="w-5 h-5" /> Nouveau Bâtiment
              </button>
            </div>
            <div className="text-right p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <p className="text-xs text-cyan-400/70 font-bold uppercase tracking-wider">Systèmes Supervisés</p>
              <p className="text-2xl font-black text-cyan-300 font-mono">{buildings?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-glow border-green-500/30 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-green-400/70 uppercase tracking-widest font-bold">Bâtiments</p>
              <p className="text-3xl font-black text-green-300 font-mono">{buildings?.length || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/30 to-cyan-500/30 flex items-center justify-center border border-green-500/50">
              <Building2 className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="stat-card-glow border-cyan-500/30 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-cyan-400/70 uppercase tracking-widest font-bold">Clients</p>
              <p className="text-3xl font-black text-cyan-300 font-mono">{clients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-cyan-500/50">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>
        <div className="stat-card-glow border-purple-500/30 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-purple-400/70 uppercase tracking-widest font-bold">Appareils</p>
              <p className="text-3xl font-black text-purple-300 font-mono">{allDevices?.length || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-500/50">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="stat-card-glow border-red-500/30 p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-red-400/70 uppercase tracking-widest font-bold">Alertes Actives</p>
              <p className="text-3xl font-black text-red-300 font-mono">{activeAlerts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/30 to-orange-500/30 flex items-center justify-center border border-red-500/50">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Models Panel */}
      {buildings && buildings.length > 0 && (
        <AIModelPanel buildingId={buildings[0].id} />
      )}

      {/* Buildings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-black text-cyan-300">Bâtiments Supervisés</h2>
          <span className="text-xs bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 font-bold ml-auto">{buildings?.length || 0} bâtiments</span>
        </div>
        {loadingBuildings ? (
          <div className="glass-card p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 mx-auto animate-spin" />
            <p className="text-cyan-300/70 mt-4">Chargement des bâtiments...</p>
          </div>
        ) : buildings && buildings.length > 0 ? (
          <div className="table-neon overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                    <th className="text-left text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Bâtiment</th>
                    <th className="text-left text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Localisation</th>
                    <th className="text-left text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Type</th>
                    <th className="text-center text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Appareils</th>
                    <th className="text-center text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Clients</th>
                    <th className="text-center text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buildings.map(b => {
                    const devCount = allDevices?.filter(d => d.building_id === b.id).length || 0;
                    const clientCount = clients.filter(c => c.building_id === b.id).length;
                    return (
                      <tr key={b.id} className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-black text-cyan-200 group-hover:text-cyan-100">{b.name}</p>
                            <p className="text-xs text-cyan-400/50 font-mono">{b.address || '—'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-cyan-300 font-medium">{b.city || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xs font-bold text-purple-300 uppercase tracking-wider capitalize">
                            {b.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 font-black text-cyan-300">
                            {devCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 font-black text-purple-300">
                            {clientCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/admin/building/${b.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 text-xs font-black hover:shadow-cyan-500/30 hover:shadow-lg transition-all uppercase tracking-wider">
                            <Eye className="w-4 h-4" /> Voir
                          </Link>
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
              <Building2 className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-cyan-300/70 font-medium">Aucun bâtiment. Créez votre premier bâtiment.</p>
          </div>
        )}
      </div>

      {/* Clients Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-black text-cyan-300">Clients Enregistrés</h2>
          <span className="text-xs bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 font-bold ml-auto">{clients.length} clients</span>
        </div>
        <div className="table-neon overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                  <th className="text-left text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Client</th>
                  <th className="text-left text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Bâtiment Assigné</th>
                  <th className="text-left text-xs font-black text-cyan-400 uppercase tracking-widest px-6 py-4">Date d'inscription</th>
                </tr>
              </thead>
              <tbody>
              {clients.length > 0 ? clients.map(client => {
                const building = buildings?.find(b => b.id === client.building_id);
                return (
                  <tr key={client.id} className="border-b border-cyan-500/20 hover:bg-cyan-500/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-cyan-200 group-hover:text-cyan-100">{client.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      {building ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xs font-bold text-purple-300">
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                          {building.name}
                        </span>
                      ) : (
                        <span className="text-xs text-cyan-400/50 italic font-mono">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-cyan-300/70 font-mono">
                      {new Date(client.created_at).toLocaleDateString('fr-FR', { 
                        year: 'numeric', month: '2-digit', day: '2-digit' 
                      })}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <p className="text-cyan-300/70 font-medium">Aucun client enregistré.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Task List */}
      <div className="mt-8">
        <TaskList />
      </div>

      {/* Add Building Modal */}
      {showAddBuilding && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="modal-glass p-8 w-full max-w-xl border border-cyan-500/50 rounded-2xl space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Nouveau Bâtiment</h2>
              <p className="text-cyan-300/70 text-sm">Créez et supervisez un nouveau bâtiment intelligent</p>
            </div>
            <form onSubmit={handleAddBuilding} className="space-y-5">
              <div>
                <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block mb-2">Nom du bâtiment *</label>
                <input type="text" required value={newBuilding.name} onChange={e => setNewBuilding(s => ({ ...s, name: e.target.value }))}
                  placeholder="Ex: Résidence Essourour"
                  className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block mb-2">Adresse</label>
                  <input type="text" value={newBuilding.address} onChange={e => setNewBuilding(s => ({ ...s, address: e.target.value }))}
                    className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                </div>
                <div>
                  <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block mb-2">Ville</label>
                  <input type="text" value={newBuilding.city} onChange={e => setNewBuilding(s => ({ ...s, city: e.target.value }))}
                    className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block mb-2">Type</label>
                <select value={newBuilding.type} onChange={e => setNewBuilding(s => ({ ...s, type: e.target.value }))}
                  className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                  <option value="residential" className="bg-slate-900 text-cyan-200">Résidentiel</option>
                  <option value="commercial" className="bg-slate-900 text-cyan-200">Commercial</option>
                  <option value="industrial" className="bg-slate-900 text-cyan-200">Industriel</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block mb-2">Surface (m²)</label>
                  <input type="number" value={newBuilding.surface || ''} onChange={e => setNewBuilding(s => ({ ...s, surface: parseInt(e.target.value) || 0 }))}
                    className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                </div>
                <div>
                  <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block mb-2">Occupants</label>
                  <input type="number" value={newBuilding.occupants || ''} onChange={e => setNewBuilding(s => ({ ...s, occupants: parseInt(e.target.value) || 0 }))}
                    className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl p-4 border border-cyan-500/20">
                <button type="button" onClick={() => setShowAddBuilding(false)}
                  className="flex-1 py-3 rounded-lg border border-cyan-500/30 text-cyan-300 text-sm font-black hover:bg-cyan-500/10 transition-all uppercase tracking-wider">Annuler</button>
                <button type="submit"
                  className="flex-1 py-3 rounded-lg btn-neon-primary text-sm font-black uppercase tracking-wider">Créer Bâtiment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="modal-glass p-8 w-full max-w-lg border border-cyan-500/50 rounded-2xl space-y-6 animate-slide-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Ajouter un Administrateur</h2>
              <p className="text-cyan-300/70 text-sm">L'utilisateur doit d'abord avoir créé un compte</p>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-5">
              <div>
                <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block mb-2">Nom de l'utilisateur *</label>
                <input type="text" required value={adminName} onChange={e => setAdminName(e.target.value)}
                  placeholder="Ex: John Doe"
                  className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
              <div className="flex gap-3 pt-4 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl p-4 border border-cyan-500/20">
                <button type="button" onClick={() => setShowAddAdmin(false)}
                  className="flex-1 py-3 rounded-lg border border-cyan-500/30 text-cyan-300 text-sm font-black hover:bg-cyan-500/10 transition-all uppercase tracking-wider">Annuler</button>
                <button type="submit"
                  className="flex-1 py-3 rounded-lg btn-neon-primary text-sm font-black uppercase tracking-wider">Ajouter Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
