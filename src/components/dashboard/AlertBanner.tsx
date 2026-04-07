import { AlertTriangle, Wifi, Brain, Wallet } from 'lucide-react';
import type { Alert } from '@/data/mockData';

const alertIcons: Record<string, any> = {
  overconsumption: AlertTriangle,
  device_offline: Wifi,
  anomaly: Brain,
  budget_exceeded: Wallet,
};

const severityColors: Record<string, string> = {
  low: 'border-energy-blue/30 bg-energy-blue/5',
  medium: 'border-energy-amber/30 bg-energy-amber/5',
  high: 'border-energy-red/30 bg-energy-red/5',
  critical: 'border-energy-red/50 bg-energy-red/10',
};

const severityTextColors: Record<string, string> = {
  low: 'text-energy-blue',
  medium: 'text-energy-amber',
  high: 'text-energy-red',
  critical: 'text-energy-red',
};

interface AlertBannerProps {
  alert: Alert;
}

const AlertBanner = ({ alert }: AlertBannerProps) => {
  const Icon = alertIcons[alert.type] || AlertTriangle;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${severityColors[alert.severity]}`}>
      <Icon className={`w-4 h-4 flex-shrink-0 ${severityTextColors[alert.severity]}`} />
      <p className="text-sm text-foreground flex-1">{alert.message}</p>
      <span className={`text-[10px] font-medium uppercase tracking-wider ${severityTextColors[alert.severity]}`}>
        {alert.severity}
      </span>
    </div>
  );
};

export default AlertBanner;
