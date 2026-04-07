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
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-1">Configuration du bâtiment et des préférences</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Bâtiment</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nom', key: 'buildingName' },
            { label: 'Adresse', key: 'address' },
            { label: 'Surface (m²)', key: 'surface', type: 'number' },
            { label: 'Occupants', key: 'occupants', type: 'number' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground block mb-1.5">{f.label}</label>
              <input type={f.type || 'text'} value={(settings as any)[f.key]}
                onChange={e => setSettings(s => ({ ...s, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Zap className="w-5 h-5 text-energy-amber" />
          <h2 className="text-base font-semibold text-foreground">Énergie</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Tarif (TND/kWh)</label>
            <input type="number" step="0.01" value={settings.electricityRate}
              onChange={e => setSettings(s => ({ ...s, electricityRate: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Budget (kWh/mois)</label>
            <input type="number" value={settings.monthlyBudget}
              onChange={e => setSettings(s => ({ ...s, monthlyBudget: parseInt(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Heures pointe — Début</label>
            <input type="time" value={settings.peakStart}
              onChange={e => setSettings(s => ({ ...s, peakStart: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Heures pointe — Fin</label>
            <input type="time" value={settings.peakEnd}
              onChange={e => setSettings(s => ({ ...s, peakEnd: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-5 h-5 text-energy-blue" />
          <h2 className="text-base font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Email', key: 'emailNotifs' },
            { label: 'Push', key: 'pushNotifs' },
            { label: 'SMS', key: 'smsNotifs' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{n.label}</span>
              <button onClick={() => setSettings(s => ({ ...s, [n.key]: !(s as any)[n.key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${(settings as any)[n.key] ? 'bg-primary' : 'bg-secondary'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${(settings as any)[n.key] ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Sécurité</h2>
        </div>
        <div className="max-w-sm">
          <label className="text-xs text-muted-foreground block mb-1.5">Nouveau mot de passe</label>
          <div className="flex gap-3">
            <input type="password" placeholder="••••••••"
              className="flex-1 px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button className="px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-medium hover:bg-secondary/80 transition-colors">
              Mettre à jour
            </button>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl energy-gradient text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Sauvegarder
      </button>
    </div>
  );
};

export default SettingsPage;
