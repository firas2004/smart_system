import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { weeklyHistory, monthlyData, deviceShares, energyHistory } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-2.5 text-xs border border-border">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-mono font-bold">{p.value} {p.name === 'kwh' || p.name === 'kWh' ? 'kWh' : p.name === 'cost' ? 'TND' : 'W'}</p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytiques</h1>
          <p className="text-sm text-muted-foreground mt-1">Analyse détaillée de la consommation énergétique</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ce Mois', value: '450.2 kWh', sub: '135.06 TND' },
          { label: 'Moyenne/Jour', value: '15.0 kWh', sub: '4.50 TND' },
          { label: 'Pic Maximum', value: '4 200 W', sub: '05 Avr à 19h30' },
          { label: 'Économie IA', value: '-18%', sub: 'vs sans optimisation' },
        ].map(c => (
          <div key={c.label} className="glass-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
            <p className="text-xl font-bold font-mono text-foreground mt-2">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-6">Consommation Mensuelle (2026)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="kwh" name="kWh" fill="hsl(160, 84%, 39%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-6">Cette Semaine</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="kwh" name="kWh" fill="hsl(210, 100%, 56%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost trend */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-6">Évolution des Coûts (TND)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="cost" stroke="hsl(38, 92%, 50%)" fill="url(#costGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparaison heures pleines/creuses */}
      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-foreground mb-6">Profil Journalier — Heures Pleines vs Creuses</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={energyHistory}>
            <defs>
              <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }} axisLine={false} tickLine={false} unit=" W" />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="power" stroke="hsl(160, 84%, 39%)" fill="url(#greenGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
          <span>🕐 Heures creuses : 22h - 06h (tarif réduit)</span>
          <span>🔴 Heures de pointe : 18h - 22h (tarif élevé)</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
