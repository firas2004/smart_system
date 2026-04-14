import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Cpu, BarChart3, Bell, Settings, Zap, ChevronLeft, ChevronRight, Brain, LogOut, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBuildings, useUserRole, useProfile } from '@/hooks/useSupabaseData';

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { data: buildings } = useBuildings();
  const { data: roleData } = useUserRole();
  const { data: profile } = useProfile();

  const isAdmin = roleData?.isAdmin;

  const navItems = isAdmin
    ? [
        { path: '/dashboard', label: 'Admin Panel', icon: Shield },
        { path: '/devices', label: 'Appareils', icon: Cpu },
        { path: '/analytics', label: 'Analytiques', icon: BarChart3 },
        { path: '/ai', label: 'IA & Prédictions', icon: Brain },
        { path: '/alerts', label: 'Alertes', icon: Bell },
        { path: '/settings', label: 'Paramètres', icon: Settings },
      ]
    : [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/devices', label: 'Mes Appareils', icon: Cpu },
        { path: '/analytics', label: 'Analytiques', icon: BarChart3 },
        { path: '/alerts', label: 'Alertes', icon: Bell },
        { path: '/settings', label: 'Paramètres', icon: Settings },
      ];

  const currentBuilding = isAdmin
    ? buildings?.[0]
    : buildings?.find(b => b.id === profile?.building_id);

  return (
    <aside className={`sidebar-glass flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} relative overflow-hidden`}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-3xl -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-cyan-500/20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-black neon-text tracking-tight">SMART</h1>
            <p className="text-xs text-cyan-400/60">Energy AIoT</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 pt-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isAdmin 
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30' 
              : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
          }`}>
            <Sparkles className="w-3 h-3" />
            {isAdmin ? 'Admin' : 'Client'}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/dashboard' && location.pathname.startsWith('/admin'));
          return (
            <Link key={item.path} to={item.path}
              className={`nav-item-glow flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-l-2 border-cyan-500' 
                  : 'text-cyan-200/70 hover:text-cyan-300'
              }`}>
              <div className={`p-2 rounded-lg transition-all ${isActive ? 'bg-cyan-500/20' : 'group-hover:bg-cyan-500/10'}`}>
                <item.icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-cyan-400/70 group-hover:text-cyan-400'}`} />
              </div>
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      {/* Current Building Card */}
      {!collapsed && currentBuilding && (
        <div className="p-4 m-3 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm">
          <p className="text-xs text-cyan-400/70 font-semibold uppercase tracking-wider">{isAdmin ? 'Gestion globale' : 'Bâtiment actif'}</p>
          <p className="text-sm font-bold text-cyan-300 mt-1">{currentBuilding.name}</p>
          <p className="text-xs text-cyan-400/60 mt-0.5">{currentBuilding.city}</p>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-cyan-500/20 space-y-2">
        {!collapsed && user?.email && (
          <p className="text-xs text-cyan-400/60 truncate px-3 font-mono">{user.email}</p>
        )}
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all w-full group">
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>

      {/* Collapse Button */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-cyan-500/20 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
