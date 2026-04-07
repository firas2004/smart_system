import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, ArrowLeft } from 'lucide-react';
import { useBuildings } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SelectBuilding = () => {
  const { data: buildings, isLoading } = useBuildings();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selected || !user) return;
    setSubmitting(true);

    const { error } = await supabase.from('profiles')
      .update({ building_id: selected })
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      // Also add to building_members
      await supabase.from('building_members').insert({
        building_id: selected,
        user_id: user.id,
        role: 'client',
      });
      toast({ title: 'Bâtiment sélectionné !' });
      navigate('/');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <button onClick={signOut} className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>
      
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sélectionnez votre bâtiment</h1>
          <p className="text-sm text-muted-foreground mt-2">Identifiez le bâtiment auquel vous appartenez pour accéder à votre tableau de bord.</p>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Chargement des bâtiments...</div>
          ) : buildings && buildings.length > 0 ? (
            buildings.map(b => (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected === b.id
                    ? 'border-primary bg-primary/10 glow-border'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.address}, {b.city}</p>
                    <p className="text-xs text-muted-foreground capitalize">{b.type}</p>
                  </div>
                  {selected === b.id && (
                    <div className="w-8 h-8 rounded-full energy-gradient flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Aucun bâtiment disponible.</p>
              <p className="text-xs mt-1">Contactez votre administrateur.</p>
            </div>
          )}
        </div>

        {selected && (
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full py-3 rounded-xl energy-gradient text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Confirmation...' : 'Confirmer'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectBuilding;
