import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { energyHistory } from '@/data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="modal-glass p-4 text-xs border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/30">
      <p className="text-cyan-400/70 mb-2 font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-green-400 font-black font-mono text-sm">{payload[0]?.value} W</p>
      {payload[1] && <p className="text-cyan-400 font-mono text-xs mt-1">{payload[1]?.value} W (prédit)</p>}
    </div>
  );
};

const PowerChart = () => {
  return (
    <div className="glass-card p-6 group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-cyan-300 flex items-center gap-2">Consommation Temps Réel <span className="text-xs bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 font-bold">Live</span></h2>
          <p className="text-cyan-400/60 text-xs mt-1">Analyse en continu de votre consommation</p>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 font-bold">Réelle</span>
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-cyan-400 font-bold">Prédite</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={energyHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: 'rgba(0, 240, 255, 0.5)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(0, 240, 255, 0.5)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} unit=" W" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }} />
          <Area type="monotone" dataKey="power" stroke="#22c55e" fill="url(#greenGrad)" strokeWidth={3} dot={false} filter="url(#glow)" />
          <Area type="monotone" dataKey="predicted" stroke="#06b6d4" fill="url(#cyanGrad)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PowerChart;
