import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { weeklyHistory, monthlyData, deviceShares, energyHistory } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="modal-glass p-3 text-xs border border-cyan-500/50 rounded-lg space-y-1">
      <p className="text-cyan-400/80 font-bold">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-mono font-black">
          {p.value} {p.name === 'kwh' || p.name === 'kWh' ? 'kWh' : p.name === 'cost' ? 'TND' : p.name === 'power' ? 'W' : ''}
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
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
              <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Intelligence Analytique</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black neon-text">Analytiques Énergétiques</h1>
            <p className="text-cyan-300/70 text-lg">Analyse détaillée et prédictions IA de votre consommation</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ce Mois', value: '450.2 kWh', sub: '135.06 TND', color: 'cyan' },
          { label: 'Moyenne/Jour', value: '15.0 kWh', sub: '4.50 TND', color: 'purple' },
          { label: 'Pic Maximum', value: '4 200 W', sub: '05 Avr à 19h30', color: 'green' },
          { label: 'Économie IA', value: '-18%', sub: 'vs sans optimisation', color: 'blue' },
        ].map(c => (
          <div key={c.label} className={`stat-card-glow border-${c === 'cyan' ? 'cyan' : c === 'purple' ? 'purple' : c === 'green' ? 'green' : 'blue'}-500/30 p-6 space-y-3`}>
            <p className={`text-xs font-black uppercase tracking-widest text-${c.color}-400`}>{c.label}</p>
            <p className={`text-3xl font-black font-mono text-${c.color}-300`}>{c.value}</p>
            <p className={`text-xs text-${c.color}-400/60 font-medium`}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div className="table-neon p-6 rounded-xl space-y-4">
        <h2 className="text-2xl font-black text-cyan-300">Consommation Mensuelle (2026)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <defs>
              <linearGradient id="monthlyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
                <stop offset="100%" stopColor="hsl(270, 90%, 45%)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="kwh" name="kWh" fill="url(#monthlyGrad)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="table-neon p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-black text-cyan-300">Cette Semaine</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyHistory}>
              <defs>
                <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
                  <stop offset="100%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="kwh" name="kWh" fill="url(#weeklyGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Trend */}
        <div className="table-neon p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-black text-purple-300">Évolution des Coûts (TND)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(270, 90%, 50%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(270, 90%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(123, 45, 255, 0.1)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(123, 45, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(123, 45, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="cost" stroke="hsl(270, 90%, 50%)" fill="url(#costGrad)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Profile */}
      <div className="table-neon p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-cyan-300">Profil Journalier — Heures Pleines vs Creuses</h2>
          <div className="flex gap-4 text-xs font-bold">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-green-300">Heures Creuses: 22h - 06h</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-red-300">Heures de Pointe: 18h - 22h</span>
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={energyHistory}>
            <defs>
              <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="offpeakGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
            <XAxis dataKey="time" tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(0, 240, 255, 0.6)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" W" />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="power" stroke="hsl(180, 100%, 50%)" fill="url(#offpeakGrad)" strokeWidth={3} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPage;
