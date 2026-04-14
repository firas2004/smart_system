import { LucideIcon, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  glowClass?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, glowClass = 'stat-glow-green' }: StatCardProps) => {
  return (
    <div className={`stat-card-glow group relative overflow-hidden p-6 transition-all duration-300 cursor-pointer hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/40 ${glowClass} transform perspective`}>
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-black text-cyan-400/70 uppercase tracking-widest flex items-center gap-2">
            {title}
            <Sparkles className="w-3 h-3 text-cyan-400/50" />
          </p>
          <p className="text-4xl font-black text-cyan-300 mt-3 font-mono tracking-tighter drop-shadow-lg">{value}</p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
          <Icon className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className={`flex items-center gap-1.5 mt-4 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit ${
          trend < 0 
            ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
            : 'bg-red-500/20 text-red-400 border border-red-500/40'
        }`}>
          {trend < 0 ? (
            <>
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-{Math.abs(trend).toFixed(1)}%</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{trend.toFixed(1)}%</span>
            </>
          )}
          <span className="text-[0.65rem] opacity-75">vs dernier</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
