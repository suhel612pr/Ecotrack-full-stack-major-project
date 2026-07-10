import React, { useState } from 'react';
import { Leaf, User, Bell, Globe, Moon, Sun, Search, ShieldCheck, ChevronDown, Sparkles, LogOut, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  onRoleChange: (role: UserProfile['role']) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  onOpenFAQ: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

export default function Navbar({
  user,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
  notificationsCount,
  onOpenNotifications,
  onOpenFAQ,
  currentPage,
  setCurrentPage,
  onOpenAuth,
  onLogout,
  isLoggedIn
}: NavbarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const rolesList: { id: UserProfile['role']; name: string; desc: string; icon: string; badge: string }[] = [
    { id: 'citizen', name: 'Citizen Portal', desc: 'Scan recyclables & earn credits', icon: '👤', badge: 'PUBLIC' },
    { id: 'worker', name: 'Sanitation Crew', desc: 'Optimal routing & collection', icon: '👷', badge: 'FIELD' },
    { id: 'supervisor', name: 'Supervisor Hub', desc: 'Real-time incident dispatching', icon: '📊', badge: 'DEPT' },
    { id: 'admin', name: 'Municipal Admin', desc: 'Full system stats & settings', icon: '🏛️', badge: 'GOV' }
  ];

  const languages = [
    { code: 'en', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'zh', name: '中文' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/40 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Brand Section */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="h-7 w-7 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
            <Leaf className="h-4 w-4 text-white dark:text-zinc-950" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
              EcoTrack <span className="text-zinc-500">AI</span>
            </span>
            <span className="text-[9px] font-medium font-mono text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
              SmartCity OS
            </span>
          </div>
        </div>

        {/* Navigation Middle Selectors (Linear/Vercel Style Segmented) */}
        <nav className="hidden md:flex items-center space-x-1 bg-zinc-100/60 dark:bg-zinc-900/60 p-1 rounded-lg border border-zinc-200/20 dark:border-zinc-800/30">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
              currentPage === 'home' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
              currentPage === 'dashboard' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Launch Hub
          </button>
          <button 
            onClick={() => setCurrentPage('smartcity')}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
              currentPage === 'smartcity' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Digital Twin
          </button>
          <button 
            onClick={onOpenFAQ}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
              currentPage === 'faq' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Support
          </button>
        </nav>

        {/* Utilities Stage */}
        <div className="flex items-center space-x-2">
          
          {/* Global Search shortcut label */}
          <button 
            onClick={() => {
              const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' });
              window.dispatchEvent(event);
            }}
            className="hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/30 dark:border-zinc-800/50 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 text-[10px] font-mono transition-all"
          >
            <Search className="h-3 w-3" />
            <span>Search...</span>
            <kbd className="bg-zinc-200/50 dark:bg-zinc-800/80 px-1 py-0.2 rounded border border-zinc-300/40 dark:border-zinc-700/50">⌘K</kbd>
          </button>

          {/* Dark Mode toggle */}
          <button 
            onClick={onToggleDarkMode}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {/* Language selection dropdown */}
          <div className="relative">
            <button 
              onClick={() => { setShowLangMenu(!showLangMenu); setShowRoleMenu(false); }}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition flex items-center space-x-1"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="text-[9px] font-mono font-medium uppercase">{language}</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xl p-1 z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { onLanguageChange(lang.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg font-medium transition ${
                      language === lang.code 
                        ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications bell */}
          <button 
            onClick={onOpenNotifications}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition relative"
            title="System radar alerts"
          >
            <Bell className="h-3.5 w-3.5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-zinc-900 dark:bg-zinc-100 rounded-full"></span>
            )}
          </button>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          {/* Premium Vercel-style Dropdown for Persona Switcher */}
          <div className="relative">
            <button 
              onClick={() => { setShowRoleMenu(!showRoleMenu); setShowLangMenu(false); }}
              className="flex items-center space-x-2 pl-1.5 pr-2 py-1 bg-zinc-100/50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/40 rounded-lg transition-all"
            >
              <div className="h-5 w-5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[9px] font-mono shadow-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-full w-full rounded-md object-cover" />
                ) : (
                  user.name[0]
                )}
              </div>
              <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 leading-none truncate max-w-[80px] capitalize hidden sm:inline-block">
                {user.role}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-900 mb-1.5 flex justify-between items-center">
                  <div>
                    <span className="block text-[9px] font-medium text-zinc-400 font-mono uppercase tracking-wider">ACTIVE PERSPECTIVE</span>
                    <span className="block text-[11px] text-zinc-900 dark:text-zinc-100 font-semibold">{user.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
                    {user.points} PTS
                  </span>
                </div>
                
                <div className="space-y-0.5">
                  {rolesList.map(role => (
                    <button
                      key={role.id}
                      onClick={() => { 
                        onRoleChange(role.id); 
                        setShowRoleMenu(false); 
                        setCurrentPage('dashboard');
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all duration-150 flex items-start space-x-2.5 ${
                        user.role === role.id 
                          ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50' 
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30'
                      }`}
                    >
                      <span className="text-sm mt-0.5">{role.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-semibold leading-none">{role.name}</span>
                          <span className="text-[8px] font-mono font-bold text-zinc-400 px-1 rounded border border-zinc-200/40 dark:border-zinc-800">
                            {role.badge}
                          </span>
                        </div>
                        <span className="block text-[10px] text-zinc-400 truncate mt-0.5">{role.desc}</span>
                      </div>
                      {user.role === role.id && (
                        <Check className="h-3 w-3 text-zinc-850 dark:text-zinc-100 shrink-0 self-center" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-900 mt-2 pt-2">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        setShowRoleMenu(false);
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
                        setShowRoleMenu(false);
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
