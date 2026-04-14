import { AlertTriangle, Wifi, Brain, Wallet, Zap } from 'lucide-react';
import type { Alert } from '@/data/mockData';

const alertIcons: Record<string, any> = {
  overconsumption: AlertTriangle,
  device_offline: Wifi,
  anomaly: Brain,
  budget_exceeded: Wallet,
};

const severityStyles: Record<string, {bg: string, border: string, text: string, badge: string}> = {
  low: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300'
  },
  medium: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300'
  },
  high: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/50',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300'
  },
  critical: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/60',
    text: 'text-red-300',
    badge: 'bg-red-500/30 text-red-200 animate-pulse'
  },
};

interface AlertBannerProps {
  alert: Alert;
}

const AlertBanner = ({ alert }: AlertBannerProps) => {
  const Icon = alertIcons[alert.type] || AlertTriangle;
  const style = severityStyles[alert.severity];

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${style.bg} ${style.border} backdrop-blur-sm transition-all hover:${style.bg} hover:${style.border} group`}>
      <div className={`p-2 rounded-lg flex-shrink-0 ${style.bg} ${style.border} border`}>
        <Icon className={`w-4 h-4 ${style.text}`} />
      </div>
      <p className={`text-sm ${style.text} flex-1 font-medium`}>{alert.message}</p>
      <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${style.badge} flex-shrink-0`}>
        {alert.severity}
      </span>
    </div>
  );
};

export default AlertBanner;
