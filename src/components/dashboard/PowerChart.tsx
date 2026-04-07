import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { energyHistory } from '@/data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs border border-border">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="text-energy-green font-bold font-mono">{payload[0]?.value} W</p>
      {payload[1] && <p className="text-energy-blue font-mono">{payload[1]?.value} W (prédit)</p>}
    </div>
  );
};

const PowerChart = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-foreground">Consommation en Temps Réel</h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-energy-green" /> Réelle</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-energy-blue" /> Prédite</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={energyHistory}>
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="time" tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} unit=" W" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="power" stroke="hsl(160, 84%, 39%)" fill="url(#greenGrad)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="predicted" stroke="hsl(210, 100%, 56%)" fill="url(#blueGrad)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PowerChart;
