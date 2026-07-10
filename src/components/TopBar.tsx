import React, { useState } from 'react';
import { 
  Search, Sun, Moon, Globe, Bell, ChevronDown, Check, 
  Sparkles, Menu, ShieldAlert, LogOut, ChevronRight, Home, Command
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  user: UserProfile;
  onRoleChange: (role: UserProfile['role']) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  citizenTab: string;
  workerTab: string;
  adminTab: string;
  onOpenMobileMenu: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

export default function TopBar({
  user,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
  notificationsCount,
  onOpenNotifications,
  currentPage,
  setCurrentPage,
  citizenTab,
  workerTab,
  adminTab,
  onOpenMobileMenu,
  onOpenAuth,
  onLogout,
  isLoggedIn
}: TopBarProps) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'zh', name: '中文' }
  ];

  // Helper to generate dynamic, user-friendly page titles and breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'SmartCity OS', action: () => setCurrentPage('home') }];

    if (currentPage === 'home') {
      crumbs.push({ label: 'Landing Gateway', action: () => {} });
    } else if (currentPage === 'smartcity') {
      crumbs.push({ label: 'Digital Twin Simulation', action: () => {} });
    } else if (currentPage === 'faq') {
      crumbs.push({ label: 'FAQ & Support Hub', action: () => {} });
    } else if (currentPage === 'dashboard') {
      if (user.role === 'citizen') {
        crumbs.push({ label: 'Citizen Workspace', action: () => {} });
        if (citizenTab !== 'home') {
          crumbs.push({ label: citizenTab.toUpperCase(), action: () => {} });
        }
      } else if (user.role === 'worker') {
        crumbs.push({ label: 'Crew stop Sheet', action: () => {} });
        if (workerTab !== 'dashboard') {
          crumbs.push({ label: workerTab.toUpperCase(), action: () => {} });
        }
      } else {
        crumbs.push({ label: 'Municipal Command Hub', action: () => {} });
        if (adminTab !== 'dispatch') {
          crumbs.push({ label: adminTab.toUpperCase(), action: () => {} });
        }
      }
    }

    return crumbs;
  };

  const getPageTitle = () => {
    if (currentPage === 'home') return 'Welcome Gateway';
    if (currentPage === 'smartcity') return 'Digital Twin 3D Node';
    if (currentPage === 'faq') return 'Knowledge Base & FAQ';
    if (currentPage === 'dashboard') {
      if (user.role === 'citizen') {
        if (citizenTab === 'home') return 'Citizen Dashboard';
        if (citizenTab === 'scanner') return 'AI Recyclables Analyzer';
        if (citizenTab === 'map') return 'Municipal Smart Grid';
        if (citizenTab === 'complaints') return 'Incident Reporting Center';
        if (citizenTab === 'bulk') return 'Bulk Solid Waste Logistics';
        if (citizenTab === 'recycling') return 'Secondary Materials Hubs';
        if (citizenTab === 'rewards') return 'Green Credits Vault';
      } else if (user.role === 'worker') {
        if (workerTab === 'dashboard') return 'Active Route Control';
        if (workerTab === 'tasks') return 'Dispatch stop Sheets';
        if (workerTab === 'qr-scan') return 'IoT QR Tag Calibration';
        if (workerTab === 'route') return 'Optimal GPS Navigation';
      } else {
        if (adminTab === 'dispatch') return 'Real-time Emergency Dispatch';
        if (adminTab === 'bins') return 'Smart IoT Grid Configurator';
        if (adminTab === 'fleet') return 'EV Fleet Routing Optimizer';
        if (adminTab === 'rbac') return 'Credential Profile Manager';
        if (adminTab === 'analytics') return 'Carbon Analytics Engine';
        if (adminTab === 'heatmap') return 'Spatiotemporal Fill Heatmaps';
        if (adminTab === 'health') return 'Docker Container Heartbeat';
        if (adminTab === 'enterprise') return 'Enterprise Security Suite';
      }
    }
    return 'EcoTrack System Node';
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-zinc-200/40 dark:border-zinc-800/60 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-all duration-150 h-14 shrink-0 font-sans">
      <div className="w-full px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* Breadcrumbs / Mobile trigger */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <button 
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition shrink-0"
            title="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* breadcrumb path display */}
          <nav className="hidden sm:flex items-center space-x-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 font-mono tracking-tight shrink-0">
            <Home className="h-3 w-3 text-zinc-400" />
            <ChevronRight className="h-3 w-3" />
            {crumbs.map((c, idx) => (
              <React.Fragment key={idx}>
                <button 
                  onClick={c.action}
                  className={`hover:text-zinc-900 dark:hover:text-white transition uppercase text-[10px] ${
                    idx === crumbs.length - 1 ? 'text-zinc-700 dark:text-zinc-300 font-black' : ''
                  }`}
                >
                  {c.label}
                </button>
                {idx < crumbs.length - 1 && <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-800" />}
              </React.Fragment>
            ))}
          </nav>

          <span className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight sm:hidden truncate max-w-[150px]">
            {getPageTitle()}
          </span>
        </div>

        {/* Action controllers */}
        <div className="flex items-center space-x-2.5 shrink-0">
          
          {/* Universal Command Palette click */}
          <button 
            onClick={() => {
              const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' });
              window.dispatchEvent(event);
            }}
            className="hidden md:flex items-center space-x-2 px-3 py-1 bg-zinc-100/50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/50 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 text-[10px] font-mono transition-all duration-150"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search console...</span>
            <span className="flex items-center bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-350/20 px-1 py-0.2 rounded text-[9px] font-bold">
              <Command className="h-2.5 w-2.5 mr-0.5" />K
            </span>
          </button>

          {/* Theme Switcher */}
          <button 
            onClick={onToggleDarkMode}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-150 shrink-0"
            title="Toggle color theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Lang Selector */}
          <div className="relative shrink-0">
            <button 
              onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); }}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-150 flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span className="text-[9px] font-mono font-black uppercase">{language}</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-2xl p-1 z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { onLanguageChange(lang.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg font-medium transition ${
                      language === lang.code 
                        ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Incident radar notification alerts */}
          <button 
            onClick={onOpenNotifications}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-150 relative shrink-0"
            title="System alerts radar"
          >
            <Bell className="h-4 w-4" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
            )}
          </button>

          <div className="h-4 w-[1.5px] bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          {/* User profile details quick-dropdown */}
          <div className="relative shrink-0">
            <button 
              onClick={() => { setShowUserMenu(!showUserMenu); setShowLangMenu(false); }}
              className="flex items-center space-x-1.5 pl-1.5 pr-2 py-1 bg-zinc-100/50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/40 rounded-xl transition-all duration-150"
            >
              <div className="h-6 w-6 rounded-lg bg-emerald-500 text-zinc-950 font-black flex items-center justify-center font-mono text-[10px] shadow-sm">
                {user.name[0]}
              </div>
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 leading-none truncate max-w-[90px] capitalize hidden md:inline-block">
                {user.role}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-left">
                <div className="px-3 py-2 border-b border-zinc-150 dark:border-zinc-900 mb-1">
                  <span className="block text-[9px] font-bold text-zinc-400 font-mono uppercase tracking-wider">MUNICIPAL DEPOSIT ID</span>
                  <span className="block text-xs text-zinc-900 dark:text-zinc-100 font-bold truncate mt-0.5">{user.name}</span>
                  <span className="block text-[9.5px] text-zinc-400 truncate mt-0.5">{user.email}</span>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-900 rounded-xl p-2.5 flex items-center justify-between">
                  <div>
                    <span className="block text-[8px] font-bold text-zinc-400 uppercase font-mono">GREEN CREDIT CREDENTIALS</span>
                    <span className="block text-xs font-black text-emerald-500 dark:text-emerald-400 mt-0.5">{user.points} XP (Points)</span>
                  </div>
                  <span className="text-sm">🌟</span>
                </div>

                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all flex items-center space-x-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Launch Workspace</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentPage('faq');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all flex items-center space-x-2"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Help & Privacy Center</span>
                </button>

                <div className="border-t border-zinc-150 dark:border-zinc-900 mt-1 pt-1">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition flex items-center space-x-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out of Cloud DB</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (onOpenAuth) onOpenAuth();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition flex items-center space-x-2"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Sign In to Cloud DB</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
