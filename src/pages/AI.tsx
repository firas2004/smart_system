import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowDownRight, Lightbulb, Clock, Zap, CheckCircle2, ArrowLeft } from 'lucide-react';
import { recommendations, energyHistory } from '@/data/mockData';
import { Link } from 'react-router-dom';

const predictionData = Array.from({ length: 24 }, (_, i) => {
  const base = 300 + Math.sin(i / 3) * 250 + (i > 6 && i < 22 ? 500 : 0);
  return {
    hour: `${i.toString().padStart(2, '0')}:00`,
    predicted: Math.round(base + Math.random() * 80),
    lower: Math.round(base - 100),
    upper: Math.round(base + 200),
  };
});

const priorityColors: Record<string, string> = {
  high: 'border-energy-red/30 bg-energy-red/5',
  medium: 'border-energy-amber/30 bg-energy-amber/5',
  low: 'border-energy-blue/30 bg-energy-blue/5',
};

const priorityText: Record<string, string> = {
  high: 'text-energy-red',
  medium: 'text-energy-amber',
  low: 'text-energy-blue',
};

const AIPage = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">IA & Prédictions</h1>
          <p className="text-sm text-muted-foreground mt-1">Modèle LSTM v2 — Confiance : 87%</p>
        </div>
      </div>

      {/* Prediction chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-foreground">Prédiction 24h — Consommation</h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-energy-purple" /> Prédiction</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-energy-purple/20" /> Intervalle confiance</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={predictionData}>
            <defs>
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="hour" tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} unit=" W" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="glass-card p-2.5 text-xs border border-border">
                    <p className="text-muted-foreground">{label}</p>
                    <p className="text-energy-purple font-mono font-bold">{payload[0]?.value} W</p>
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confGrad)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(220, 20%, 6%)" />
            <Line type="monotone" dataKey="predicted" stroke="hsl(270, 70%, 60%)" strokeWidth={2.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Total Prédit (24h)</p>
            <p className="text-lg font-bold font-mono text-foreground mt-1">18.5 kWh</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Borne Basse</p>
            <p className="text-lg font-bold font-mono text-energy-green mt-1">15.0 kWh</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Borne Haute</p>
            <p className="text-lg font-bold font-mono text-energy-red mt-1">22.0 kWh</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Recommandations d'Optimisation</h2>
        <div className="space-y-3">
          {recommendations.map(rec => (
            <div key={rec.id} className={`glass-card p-5 border ${priorityColors[rec.priority]}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Lightbulb className={`w-5 h-5 ${priorityText[rec.priority]}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${priorityText[rec.priority]}`}>{rec.priority}</span>
                    <span className="text-[10px] text-muted-foreground">• {rec.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{rec.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-energy-green flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> -{rec.savingKwh} kWh/mois
                    </span>
                    <span className="text-xs text-energy-amber flex items-center gap-1">
                      <Zap className="w-3 h-3" /> -{rec.savingTND} TND/mois
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors">
                  Appliquer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPage;
