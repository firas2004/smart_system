import { useState } from 'react';
import { Plus, Wind, Flame, Refrigerator, WashingMachine, Lightbulb, Plug, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const iconMap: Record<string, any> = {
  air_conditioner: Wind, water_heater: Flame, refrigerator: Refrigerator,
  washing_machine: WashingMachine, lighting: Lightbulb, other: Plug,
};

interface AddDeviceFormProps {
  onClose: () => void;
  buildingId: string;
}

const AddDeviceForm = ({ onClose, buildingId }: AddDeviceFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState({
    name: '', type: 'air_conditioner', brand: '', model: '', location: '', nominal_power: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!buildingId) {
      toast({ title: 'Erreur', description: 'Aucun bâtiment sélectionné.', variant: 'destructive' });
      setSaving(false);
      return;
    }

    try {
      const payload = {
        building_id: buildingId,
        name: device.name.trim(),
        type: device.type,
        brand: device.brand.trim() || null,
        model: device.model.trim() || null,
        location: device.location.trim() || null,
        nominal_power: device.nominal_power > 0 ? device.nominal_power : null,
        status: 'offline',
        is_on: false,
        current_power: 0,
        today_consumption: 0,
      };

      const { error } = await supabase.from('devices').insert(payload);

      if (error) {
        console.error('Device insert error:', error);
        toast({
          title: 'Erreur',
          description: error.message || 'Impossible d’ajouter l’appareil. Vérifiez vos permissions.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Appareil ajouté !' });
        queryClient.invalidateQueries({ queryKey: ['devices', buildingId] });
        onClose();
      }
    } catch (err: any) {
      console.error('Unexpected device insert error:', err);
      toast({
        title: 'Erreur inattendue',
        description: err?.message || 'Une erreur est survenue lors de l’ajout de l’appareil.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 w-full max-w-lg border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Ajouter un Appareil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Nom de l'appareil *</label>
            <input type="text" required value={device.name} onChange={e => setDevice(s => ({ ...s, name: e.target.value }))}
              placeholder="Ex: Climatiseur Salon"
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(iconMap).map(([type, Icon]) => (
                <button key={type} type="button" onClick={() => setDevice(s => ({ ...s, type }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    device.type === type ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-border'
                  }`}>
                  <Icon className="w-4 h-4" />
                  {type === 'air_conditioner' ? 'Clim' : type === 'water_heater' ? 'Chauffe-eau' : 
                   type === 'refrigerator' ? 'Frigo' : type === 'washing_machine' ? 'Lave-linge' : 
                   type === 'lighting' ? 'Éclairage' : 'Autre'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Marque</label>
              <input type="text" value={device.brand} onChange={e => setDevice(s => ({ ...s, brand: e.target.value }))}
                placeholder="Samsung, LG..."
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Modèle</label>
              <input type="text" value={device.model} onChange={e => setDevice(s => ({ ...s, model: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Emplacement *</label>
              <input type="text" required value={device.location} onChange={e => setDevice(s => ({ ...s, location: e.target.value }))}
                placeholder="Salon, Cuisine..."
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Puissance nominale (W)</label>
              <input type="number" value={device.nominal_power || ''} onChange={e => setDevice(s => ({ ...s, nominal_power: parseInt(e.target.value) || 0 }))}
                placeholder="1500"
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium">Annuler</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl energy-gradient text-primary-foreground text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceForm;
