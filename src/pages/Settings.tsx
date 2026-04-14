import { useState, useEffect } from 'react';
import { Building2, Bell, Zap, Save, Loader2, ArrowLeft } from 'lucide-react';
import { useProfile, useBuildings } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const { data: profile } = useProfile();
  const { data: buildings } = useBuildings();
  const building = buildings?.[0];
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    buildingName: '', address: '', surface: 120, occupants: 4,
    electricityRate: 0.3, monthlyBudget: 500, peakStart: '18:00', peakEnd: '22:00',
    emailNotifs: true, pushNotifs: true, smsNotifs: false,
  });

  useEffect(() => {
    if (building) {
      setSettings(s => ({
        ...s,
        buildingName: building.name || '',
        address: building.address || '',
        surface: Number(building.surface) || 120,
        occupants: building.occupants || 4,
        electricityRate: Number(building.electricity_rate) || 0.3,
        monthlyBudget: Number(building.monthly_budget_kwh) || 500,
        peakStart: building.peak_hours_start || '18:00',
        peakEnd: building.peak_hours_end || '22:00',
      }));
    }
    if (profile?.preferences) {
      const prefs = profile.preferences as any;
      setSettings(s => ({
        ...s,
        emailNotifs: prefs?.notifications?.email ?? true,
        pushNotifs: prefs?.notifications?.push ?? true,
        smsNotifs: prefs?.notifications?.sms ?? false,
      }));
    }
  }, [building, profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (building) {
        const { error } = await supabase.from('buildings').update({
          name: settings.buildingName, address: settings.address,
          surface: settings.surface, occupants: settings.occupants,
          electricity_rate: settings.electricityRate, monthly_budget_kwh: settings.monthlyBudget,
          peak_hours_start: settings.peakStart, peak_hours_end: settings.peakEnd,
        }).eq('id', building.id);
        if (error) throw error;
      }

      if (profile) {
        const { error } = await supabase.from('profiles').update({
          preferences: {
            language: 'fr', theme: 'dark',
            notifications: { email: settings.emailNotifs, push: settings.pushNotifs, sms: settings.smsNotifs },
          },
        }).eq('id', profile.id);
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Paramètres sauvegardés !' });
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard"
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center hover:border-cyan-500/60 transition-all hover:shadow-cyan-500/30 hover:shadow-lg group">
            <ArrowLeft className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          </Link>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Configuration Système</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black neon-text">Paramètres</h1>
            <p className="text-cyan-300/70 text-lg">Configuration avancée du bâtiment et des préférences</p>
          </div>
        </div>
      </div>

      {/* Building Section */}
      <div className="table-neon p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border border-cyan-500/50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-xl font-black text-cyan-300">Bâtiment</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nom', key: 'buildingName' },
            { label: 'Adresse', key: 'address' },
            { label: 'Surface (m²)', key: 'surface', type: 'number' },
            { label: 'Occupants', key: 'occupants', type: 'number' },
          ].map(f => (
            <div key={f.key} className="space-y-2">
              <label className="text-xs text-cyan-400 font-black uppercase tracking-widest block">{f.label}</label>
              <input type={f.type || 'text'} value={(settings as any)[f.key]}
                onChange={e => setSettings(s => ({ ...s, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                className="input-glow w-full px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-200 placeholder:text-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Energy Section */}
      <div className="table-neon p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/40 to-orange-500/40 border border-amber-500/50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black text-amber-300">Paramètres Énergétiques</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-amber-400 font-black uppercase tracking-widest block">Tarif (TND/kWh)</label>
            <input type="number" step="0.01" value={settings.electricityRate}
              onChange={e => setSettings(s => ({ ...s, electricityRate: parseFloat(e.target.value) }))}
              className="input-glow w-full px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200 placeholder:text-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-amber-400 font-black uppercase tracking-widest block">Budget Mensuel (kWh)</label>
            <input type="number" value={settings.monthlyBudget}
              onChange={e => setSettings(s => ({ ...s, monthlyBudget: parseInt(e.target.value) }))}
              className="input-glow w-full px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200 placeholder:text-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-amber-400 font-black uppercase tracking-widest block">Heures Pointe — Début</label>
            <input type="time" value={settings.peakStart}
              onChange={e => setSettings(s => ({ ...s, peakStart: e.target.value }))}
              className="input-glow w-full px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200 placeholder:text-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-amber-400 font-black uppercase tracking-widest block">Heures Pointe — Fin</label>
            <input type="time" value={settings.peakEnd}
              onChange={e => setSettings(s => ({ ...s, peakEnd: e.target.value }))}
              className="input-glow w-full px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200 placeholder:text-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400" />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="table-neon p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/40 to-cyan-500/40 border border-blue-500/50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-black text-blue-300">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Notifications Email', key: 'emailNotifs', desc: 'Recevez les alertes par email' },
            { label: 'Notifications Push', key: 'pushNotifs', desc: 'Recevez les alertes en temps réel' },
            { label: 'Notifications SMS', key: 'smsNotifs', desc: 'Recevez les alertes critiques par SMS' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
              <div className="space-y-1">
                <p className="text-sm font-black text-blue-200">{n.label}</p>
                <p className="text-xs text-blue-400/70">{n.desc}</p>
              </div>
              <button onClick={() => setSettings(s => ({ ...s, [n.key]: !(s as any)[n.key] }))}
                className={`relative w-14 h-8 rounded-full transition-all ${(settings as any)[n.key] ? 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-cyan-500/50 shadow-lg' : 'bg-cyan-500/20 border border-cyan-500/30'}`}>
                <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 ${(settings as any)[n.key] ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="table-neon p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/40 to-pink-500/40 border border-red-500/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-red-400" />
          </div>
          <h2 className="text-xl font-black text-red-300">Sécurité</h2>
        </div>
        <div className="max-w-sm space-y-2">
          <label className="text-xs text-red-400 font-black uppercase tracking-widest block">Nouveau Mot de Passe</label>
          <div className="flex gap-3">
            <input type="password" placeholder="••••••••"
              className="input-glow flex-1 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-200 placeholder:text-red-400/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-400" />
            <button className="px-4 py-3 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 text-xs font-black hover:border-red-500/60 hover:shadow-red-500/30 hover:shadow-lg transition-all uppercase tracking-wider">
              Mettre à jour
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} disabled={saving}
        className="btn-neon-primary w-full py-4 flex items-center justify-center gap-3 font-black uppercase tracking-wider text-lg disabled:opacity-50">
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sauvegarde en cours...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Sauvegarder les Paramètres
          </>
        )}
      </button>
    </div>
  );
};

export default SettingsPage;
