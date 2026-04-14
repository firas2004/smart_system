import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import {
  BrainCircuit, Loader2, Sparkles, AlertTriangle,
  CheckCircle2, Zap, TrendingDown, Activity, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AI_API = 'http://localhost:8001';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface PredictionPoint { hour: number; predicted_kwh: number; lower_bound: number; upper_bound: number; confidence?: number; }
interface LSTMResponse { building_id: string; predictions: PredictionPoint[]; daily_total: number; }
interface Anomaly { device_id: string; timestamp: string; score: number; severity: string; }
interface AnomalyResponse { building_id: string; anomalies: Anomaly[]; total: number; }
interface Recommendation { title: string; description: string; category: string; priority: string; estimated_saving_kwh?: number; estimated_saving_tnd?: number; }
interface RecommendationResponse { building_id: string; recommendations: Recommendation[]; }

// ─── SHARED LOADER ───────────────────────────────────────────────────────────
const ModelLoader = ({ label }: { label: string }) => (
  <div className="h-[200px] flex flex-col items-center justify-center text-cyan-500/50">
    <BrainCircuit className="w-10 h-10 mb-3 animate-pulse text-purple-500" />
    <div className="flex items-center gap-2 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{label}</span>
    </div>
  </div>
);

// ─── SHARED ERROR ────────────────────────────────────────────────────────────
const ModelError = ({ msg }: { msg: string }) => (
  <div className="h-[120px] flex flex-col items-center justify-center text-red-400/70 text-sm text-center px-4">
    <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
    <p>{msg}</p>
  </div>
);

// ─── SEVERITY COLORS ─────────────────────────────────────────────────────────
const severityColor: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#facc15', low: '#4ade80'
};

// ═════════════════════════════════════════════════════════════════════════════
// 1. LSTM PREDICTION CHART
// ═════════════════════════════════════════════════════════════════════════════
const LSTMCard = ({ buildingId }: { buildingId: string }) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery<LSTMResponse>({
    queryKey: ['lstm', buildingId],
    queryFn: async () => {
      const res = await fetch(`${AI_API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building_id: buildingId, horizon: '24h' }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'API Error');
      return res.json();
    },
    retry: 1,
    refetchInterval: 300_000,
  });

  const chartData = data?.predictions?.map((p) => ({
    time: `${String(p.hour).padStart(2, '0')}:00`,
    Prévu: +(p.predicted_kwh).toFixed(2),
    Haut: +(p.upper_bound).toFixed(2),
    Bas: +(p.lower_bound).toFixed(2),
  })) ?? [];

  return (
    <Card className="modal-glass border-purple-500/30 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-cyan-900/10 z-0" />
      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2 text-purple-300 font-bold">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            Prédiction LSTM — 24h
          </CardTitle>
          <CardDescription className="text-cyan-300/50 text-xs">Deep Learning · Réseau de neurones récurrent</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <div className="text-right">
              <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {Math.round(data.daily_total)} kWh
              </div>
              <div className="text-[10px] text-cyan-300/40 uppercase tracking-widest flex items-center gap-1 justify-end">
                <Sparkles className="w-2.5 h-2.5 text-yellow-400" />Total journalier
              </div>
            </div>
          )}
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-cyan-400/60 hover:text-cyan-300 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        {isLoading ? <ModelLoader label="Réseau de neurones LSTM en cours de prédiction..." /> :
         error ? <ModelError msg="Service IA injoignable. Démarrez uvicorn sur le port 8001." /> :
         chartData.length === 0 ? <ModelError msg="Aucune donnée renvoyée par le modèle." /> : (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="time" stroke="#06b6d430" fontSize={10} tickMargin={8} minTickGap={18} />
                <YAxis stroke="#06b6d430" fontSize={10} tickFormatter={v => `${v}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', borderColor: '#a855f740', borderRadius: 10 }}
                  itemStyle={{ color: '#e2e8f0', fontSize: 12 }}
                  labelStyle={{ color: '#06b6d4', fontWeight: 700, marginBottom: 4 }}
                />
                <Area type="monotone" dataKey="Haut" stroke="none" fill="url(#gCyan)" activeDot={false} />
                <Area type="monotone" dataKey="Bas"  stroke="none" fill="url(#gCyan)" activeDot={false} />
                <Area type="monotone" dataKey="Prévu" stroke="#a855f7" strokeWidth={2.5} fill="url(#gPurple)"
                  activeDot={{ r: 5, fill: '#06b6d4', stroke: '#1e293b', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// 2. ANOMALY DETECTION (Isolation Forest)
// ═════════════════════════════════════════════════════════════════════════════
const AnomalyCard = ({ buildingId }: { buildingId: string }) => {
  const { data, isLoading, error } = useQuery<AnomalyResponse>({
    queryKey: ['anomalies', buildingId],
    queryFn: async () => {
      const res = await fetch(`${AI_API}/anomalies/${buildingId}?hours=48`);
      if (!res.ok) throw new Error((await res.json()).detail || 'API Error');
      return res.json();
    },
    retry: 1,
    refetchInterval: 300_000,
  });

  const anomalies = data?.anomalies ?? [];
  const barData = anomalies.slice(0, 10).map((a, i) => ({
    name: a.device_id?.slice(-6) || `D${i}`,
    score: Math.abs(a.score ?? 0),
    severity: a.severity || 'low',
  }));

  return (
    <Card className="modal-glass border-orange-500/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-red-900/5 z-0" />
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-orange-300 font-bold">
          <Activity className="w-5 h-5 text-red-400" />
          Détection d'Anomalies
          {data && (
            <Badge className={`ml-auto text-xs font-bold ${data.total > 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
              {data.total > 0 ? `${data.total} anomalie(s)` : '✓ Normal'}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-orange-300/40 text-xs">Isolation Forest · 48h glissantes</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        {isLoading ? <ModelLoader label="Isolation Forest en cours d'analyse..." /> :
         error ? <ModelError msg="Impossible de joindre le modèle d'anomalies." /> :
         anomalies.length === 0 ? (
          <div className="h-[120px] flex flex-col items-center justify-center text-green-400/70 text-sm">
            <CheckCircle2 className="w-8 h-8 mb-2" />
            <p>Aucune anomalie détectée</p>
          </div>
        ) : (
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="name" stroke="#f9731630" fontSize={9} />
                <YAxis stroke="#f9731630" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', borderColor: '#f9731640', borderRadius: 10 }}
                  itemStyle={{ color: '#e2e8f0', fontSize: 11 }}
                  labelStyle={{ color: '#f97316', fontWeight: 700 }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={severityColor[entry.severity] || '#4ade80'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// 3. AI RECOMMENDATIONS
// ═════════════════════════════════════════════════════════════════════════════
const priorityStyle: Record<string, string> = {
  high:   'text-red-300 bg-red-500/10 border-red-500/30',
  medium: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30',
  low:    'text-green-300 bg-green-500/10 border-green-500/30',
};

const RecommendationsCard = ({ buildingId }: { buildingId: string }) => {
  const { data, isLoading, error } = useQuery<RecommendationResponse>({
    queryKey: ['recommendations', buildingId],
    queryFn: async () => {
      const res = await fetch(`${AI_API}/recommendations/${buildingId}`);
      if (!res.ok) throw new Error((await res.json()).detail || 'API Error');
      return res.json();
    },
    retry: 1,
    refetchInterval: 600_000,
  });

  const recs = data?.recommendations ?? [];

  return (
    <Card className="modal-glass border-green-500/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-cyan-900/5 z-0" />
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-green-300 font-bold">
          <TrendingDown className="w-5 h-5 text-green-400" />
          Recommandations IA
          {recs.length > 0 && (
            <Badge className="ml-auto text-xs bg-green-500/20 text-green-300 border-green-500/30">
              {recs.length} conseil(s)
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-green-300/40 text-xs">Moteur d'optimisation énergétique</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        {isLoading ? <ModelLoader label="Génération des recommandations IA..." /> :
         error ? <ModelError msg="Impossible de charger les recommandations." /> :
         recs.length === 0 ? (
          <div className="h-[120px] flex items-center justify-center text-green-400/50 text-sm">
            Aucune recommandation disponible.
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {recs.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-green-500/10 hover:border-green-500/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-green-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    {rec.title}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${priorityStyle[rec.priority] ?? priorityStyle.low}`}>
                    {rec.priority?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-green-300/60">{rec.description}</p>
                {rec.estimated_saving_kwh && (
                  <p className="text-[10px] text-cyan-400/60 mt-1">
                    ↓ {rec.estimated_saving_kwh} kWh · {rec.estimated_saving_tnd} TND économisés
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — full AI panel
// ═════════════════════════════════════════════════════════════════════════════
export const AIModelPanel = ({ buildingId }: { buildingId: string }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-black text-purple-300">Modèles IA en temps réel</h2>
        <span className="text-xs bg-purple-500/20 px-3 py-1 rounded-full text-purple-400 font-bold ml-auto border border-purple-500/30">
          API · localhost:8001
        </span>
      </div>
      {/* LSTM takes full width */}
      <LSTMCard buildingId={buildingId} />
      {/* Anomaly + Recommendations side by side on wide screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AnomalyCard buildingId={buildingId} />
        <RecommendationsCard buildingId={buildingId} />
      </div>
    </div>
  );
};

// Keep named exports for backward compat
export { LSTMCard as LSTMPredictionChart };
