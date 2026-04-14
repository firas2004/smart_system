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
              <div className={`w-3 h-3 rounded-full ${alerts.filter(a => a.status === 'active').length > 0 ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`} />
              <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Système de Surveillance</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black neon-text">Centre des Alertes</h1>
            <p className="text-cyan-300/70 text-lg">
              <span className="inline-block bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/30 font-mono">
                {alerts.filter(a => a.status === 'active').length} alertes actives
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'active', 'resolved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-500/60 text-cyan-200 shadow-cyan-500/20 shadow-lg'
                : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400/70 hover:border-cyan-500/40'
            }`}>
            {f === 'all' ? 'Toutes les Alertes' : f === 'active' ? 'Actives' : 'Résolues'}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filtered.map((alert, idx) => {
          const Icon = alertIcons[alert.type] || AlertTriangle;
          const severityConfig: Record<string, { bg: string; border: string; badge: string; text: string; icon: string }> = {
            low: {
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/30',
              badge: 'bg-blue-500/20 text-blue-300',
              text: 'text-blue-300',
              icon: 'text-blue-400',
            },
            medium: {
              bg: 'bg-amber-500/10',
              border: 'border-amber-500/30',
              badge: 'bg-amber-500/20 text-amber-300',
              text: 'text-amber-300',
              icon: 'text-amber-400',
            },
            high: {
              bg: 'bg-orange-500/10',
              border: 'border-orange-500/30',
              badge: 'bg-orange-500/20 text-orange-300',
              text: 'text-orange-300',
              icon: 'text-orange-400',
            },
            critical: {
              bg: 'bg-red-500/15',
              border: 'border-red-500/50',
              badge: 'bg-red-500/25 text-red-300',
              text: 'text-red-300',
              icon: 'text-red-400',
            },
          };
          const config = severityConfig[alert.severity];
          return (
            <div key={alert.id} className={`glass-card p-6 border ${config.border} ${config.bg} hover:shadow-xl transition-all animate-slide-up group`} style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                  alert.severity === 'critical' ? 'from-red-500/40 to-orange-500/40' :
                  alert.severity === 'high' ? 'from-orange-500/40 to-amber-500/40' :
                  alert.severity === 'medium' ? 'from-amber-500/40 to-yellow-500/40' :
                  'from-blue-500/40 to-cyan-500/40'
                } border ${config.border}`}>
                  <Icon className={`w-6 h-6 ${config.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${config.badge}`}>
                      {alert.severity === 'critical' ? '🔴 ' : alert.severity === 'high' ? '🟠 ' : alert.severity === 'medium' ? '🟡 ' : '🔵 '}
                      {alert.severity}
                    </span>
                    <span className="text-xs text-cyan-400/70 font-mono uppercase">{alert.type.replace('_', ' ')}</span>
                  </div>
                  <p className={`text-base font-bold ${config.text} group-hover:text-white transition-colors`}>{alert.message}</p>
                  {'deviceName' in alert && alert.deviceName && (
                    <p className="text-xs text-cyan-400/70 mt-2 font-mono">📱 Appareil: {alert.deviceName}</p>
                  )}
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <span className="text-xs text-cyan-400/70 flex items-center gap-2 font-mono">
                      <Clock className="w-4 h-4" />
                      {new Date(alert.createdAt).toLocaleString('fr-FR', { 
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                    {alert.status === 'resolved' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-xs font-black text-green-300 uppercase tracking-wider">
                        <Check className="w-4 h-4" /> Résolu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="text-cyan-300/70 font-medium text-lg">
                {filter === 'all' ? 'Aucune alerte' : filter === 'active' ? 'Aucune alerte active' : 'Aucune alerte résolue'}
              </p>
              <p className="text-cyan-400/50 text-sm">Tout va bien ! Votre système fonctionne normalement.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
