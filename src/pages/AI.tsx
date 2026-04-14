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
    <div className="p-6 lg:p-8 space-y-8">
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
              <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Intelligence Artificielle</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black neon-text">IA & Prédictions Énergétiques</h1>
            <p className="text-cyan-300/70 text-lg">
              <span className="inline-block bg-cyan-500/20 px-3 py-1 rounded-lg border border-cyan-500/30 font-mono">
                Modèle LSTM v2 — Confiance: 87%
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="table-neon p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-cyan-300">Prédiction 24h — Profil de Consommation</h2>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-purple-300">Prédiction IA</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400/30" />
              <span className="text-purple-300/70">Intervalle Confiance</span>
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={predictionData}>
            <defs>
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270, 90%, 50%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(270, 90%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
            <XAxis dataKey="hour" tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" W" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="modal-glass p-3 text-xs border border-cyan-500/50 rounded-lg space-y-1">
                    <p className="text-cyan-400/80 font-bold">{label}</p>
                    <p className="font-mono font-black text-purple-300">{payload[0]?.value} W</p>
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confGrad)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(220, 20%, 6%)" />
            <Line type="monotone" dataKey="predicted" stroke="hsl(270, 90%, 50%)" strokeWidth={3} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="stat-card-glow border-purple-500/30 text-center p-5 space-y-2">
            <p className="text-xs text-purple-400 font-black uppercase tracking-widest">Total Prédit (24h)</p>
            <p className="text-3xl font-black font-mono text-purple-300">18.5 kWh</p>
          </div>
          <div className="stat-card-glow border-green-500/30 text-center p-5 space-y-2">
            <p className="text-xs text-green-400 font-black uppercase tracking-widest">Borne Basse</p>
            <p className="text-3xl font-black font-mono text-green-300">15.0 kWh</p>
          </div>
          <div className="stat-card-glow border-red-500/30 text-center p-5 space-y-2">
            <p className="text-xs text-red-400 font-black uppercase tracking-widest">Borne Haute</p>
            <p className="text-3xl font-black font-mono text-red-300">22.0 kWh</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-black text-cyan-300">Recommandations d'Optimisation</h2>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => {
            const priorityConfig: Record<string, { badge: string; icon: string; bg: string; border: string }> = {
              high: {
                badge: 'bg-red-500/20 text-red-300',
                icon: 'text-red-400',
                bg: 'bg-red-500/10',
                border: 'border-red-500/30',
              },
              medium: {
                badge: 'bg-amber-500/20 text-amber-300',
                icon: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/30',
              },
              low: {
                badge: 'bg-blue-500/20 text-blue-300',
                icon: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/30',
              },
            };
            const config = priorityConfig[rec.priority];
            return (
              <div key={rec.id} className={`glass-card p-6 border ${config.border} ${config.bg} hover:shadow-xl transition-all group animate-slide-up`} style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border}`}>
                    <Lightbulb className={`w-6 h-6 ${config.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${config.badge}`}>
                        {rec.priority === 'high' ? '🔴 ' : rec.priority === 'medium' ? '🟡 ' : '🔵 '}
                        {rec.priority}
                      </span>
                      <span className="text-xs text-cyan-400/70 font-mono">{rec.category}</span>
                    </div>
                    <h3 className="text-base font-black text-cyan-200 group-hover:text-white transition-colors">{rec.title}</h3>
                    <p className="text-sm text-cyan-400/70 mt-2">{rec.description}</p>
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-xs font-black text-green-300">
                        <ArrowDownRight className="w-4 h-4" /> -{rec.savingKwh} kWh/mois
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs font-black text-purple-300">
                        <Zap className="w-4 h-4" /> -{rec.savingTND} TND/mois
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black hover:border-cyan-500/60 hover:shadow-cyan-500/30 hover:shadow-lg transition-all uppercase tracking-wider flex-shrink-0">
                    Appliquer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIPage;
