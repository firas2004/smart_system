import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  glowClass?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, glowClass = 'stat-glow-green' }: StatCardProps) => {
  return (
    <div className={`glass-card p-5 ${glowClass} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2 font-mono">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend < 0 ? 'text-energy-green' : 'text-energy-red'}`}>
          {trend < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
          <span>{Math.abs(trend).toFixed(1)}% vs mois dernier</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
