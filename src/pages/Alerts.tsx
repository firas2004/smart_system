import { useState } from 'react';
import { AlertTriangle, Wifi, Brain, Wallet, Check, Clock, ArrowLeft } from 'lucide-react';
import { useAlerts, useBuildings } from '@/hooks/useSupabaseData';
import { alerts as mockAlerts } from '@/data/mockData';
import { Link } from 'react-router-dom';

const alertIcons: Record<string, any> = {
  overconsumption: AlertTriangle, device_offline: Wifi, anomaly: Brain, budget_exceeded: Wallet,
};
const severityBg: Record<string, string> = {
  low: 'bg-energy-blue/10 border-energy-blue/20', medium: 'bg-energy-amber/10 border-energy-amber/20',
  high: 'bg-energy-red/10 border-energy-red/20', critical: 'bg-energy-red/15 border-energy-red/30',
};
const severityText: Record<string, string> = {
  low: 'text-energy-blue', medium: 'text-energy-amber', high: 'text-energy-red', critical: 'text-energy-red',
};

const AlertsPage = () => {
  const { data: buildings } = useBuildings();
  const { data: dbAlerts } = useAlerts(buildings?.[0]?.id);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const alerts = dbAlerts && dbAlerts.length > 0
    ? dbAlerts.map(a => ({
        id: a.id, type: a.type as any, severity: a.severity as any,
        message: a.message, status: (a.status || 'active') as any,
        deviceName: undefined as string | undefined, createdAt: a.created_at,
      }))
    : mockAlerts;

  const filtered = alerts.filter(a => {
    if (filter === 'active') return a.status === 'active';
    if (filter === 'resolved') return a.status === 'resolved';
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertes</h1>
          <p className="text-sm text-muted-foreground mt-1">{alerts.filter(a => a.status === 'active').length} alertes actives</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'active', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-border'}`}>
            {f === 'all' ? 'Toutes' : f === 'active' ? 'Actives' : 'Résolues'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(alert => {
          const Icon = alertIcons[alert.type] || AlertTriangle;
          return (
            <div key={alert.id} className={`glass-card p-5 border ${severityBg[alert.severity]}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${severityBg[alert.severity]}`}>
                  <Icon className={`w-5 h-5 ${severityText[alert.severity]}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${severityText[alert.severity]}`}>{alert.severity}</span>
                    <span className="text-[10px] text-muted-foreground">• {alert.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-foreground">{alert.message}</p>
                  {'deviceName' in alert && alert.deviceName && <p className="text-xs text-muted-foreground mt-1">Appareil : {alert.deviceName}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.createdAt).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {alert.status === 'resolved' && (
                      <span className="text-xs text-energy-green flex items-center gap-1"><Check className="w-3 h-3" /> Résolu</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPage;
