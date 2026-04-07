import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Cpu, BarChart3, Bell, Settings, Zap, ChevronLeft, ChevronRight, Brain, LogOut, Shield } from 'lucide-react';
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
    <aside className={`sidebar-gradient border-r border-border/50 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center gap-3 p-5 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl energy-gradient flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-foreground tracking-tight">Smart Energy</h1>
            <p className="text-xs text-muted-foreground">AIoT Dashboard</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 pt-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
            isAdmin ? 'bg-energy-amber/15 text-energy-amber' : 'bg-primary/15 text-primary'
          }`}>
            {isAdmin ? '⚡ Admin' : '👤 Client'}
          </span>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/dashboard' && location.pathname.startsWith('/admin'));
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive ? 'bg-primary/15 text-primary glow-border' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && currentBuilding && (
        <div className="p-4 m-3 rounded-xl bg-secondary/50 border border-border/50">
          <p className="text-xs text-muted-foreground">{isAdmin ? 'Gestion globale' : 'Mon bâtiment'}</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{currentBuilding.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{currentBuilding.city}</p>
        </div>
      )}

      <div className="p-3 border-t border-border/50">
        {!collapsed && (
          <p className="text-xs text-muted-foreground truncate px-3 mb-2">{user?.email}</p>
        )}
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-energy-red hover:bg-energy-red/10 transition-colors w-full">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>

      <button onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-border/50 text-muted-foreground hover:text-foreground transition-colors">
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
