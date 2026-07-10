import React, { useState } from 'react';
import { 
  LayoutDashboard, Sparkles, Trash2, Map, ClipboardList, 
  Navigation, BarChart3, Gift, Trophy, Bell, User, 
  Settings, ChevronLeft, ChevronRight, Menu, X, ShieldAlert,
  HelpCircle, Leaf, ArrowRight, ShieldCheck
} from 'lucide-react';
import { UserProfile, CitizenTab, WorkerTab, AdminTab } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  user: UserProfile;
  onRoleChange: (role: UserProfile['role']) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  citizenTab: CitizenTab;
  setCitizenTab: (tab: CitizenTab) => void;
  workerTab: WorkerTab;
  setWorkerTab: (tab: WorkerTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  onOpenFAQ: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  user,
  onRoleChange,
  currentPage,
  setCurrentPage,
  citizenTab,
  setCitizenTab,
  workerTab,
  setWorkerTab,
  adminTab,
  setAdminTab,
  notificationsCount,
  onOpenNotifications,
  onOpenFAQ,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const roles = [
    { id: 'citizen' as const, name: 'Citizen Portal', icon: '👤', badge: 'PUBLIC', color: 'text-emerald-500' },
    { id: 'worker' as const, name: 'Sanitation Crew', icon: '👷', badge: 'FIELD', color: 'text-amber-500' },
    { id: 'supervisor' as const, name: 'Supervisor Hub', icon: '📊', badge: 'DEPT', color: 'text-sky-500' },
    { id: 'admin' as const, name: 'Municipal Admin', icon: '🏛️', badge: 'GOV', color: 'text-rose-500' }
  ];

  // Map sidebar items to dynamic page and subtab actions
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: currentPage === 'dashboard' && (
        (user.role === 'citizen' && citizenTab === 'home') ||
        (user.role === 'worker' && workerTab === 'dashboard') ||
        ((user.role === 'supervisor' || user.role === 'admin') && adminTab === 'dashboard')
      ),
      action: () => {
        setCurrentPage('dashboard');
        if (user.role === 'citizen') setCitizenTab('home');
        if (user.role === 'worker') setWorkerTab('dashboard');
        if (user.role === 'supervisor' || user.role === 'admin') setAdminTab('dashboard');
      }
    },
    {
      id: 'scanner',
      label: 'AI Scanner',
      icon: Sparkles,
      active: currentPage === 'dashboard' && (
        (user.role === 'citizen' && citizenTab === 'scanner') ||
        (user.role === 'worker' && workerTab === 'qr-scan')
      ),
      action: () => {
        setCurrentPage('dashboard');
        if (user.role === 'worker') {
          setWorkerTab('qr-scan');
        } else {
          // Default to citizen view for scanning recyclables
          if (user.role !== 'citizen') onRoleChange('citizen');
          setCitizenTab('scanner');
        }
      }
    },
    {
      id: 'bins',
      label: 'Smart Bins',
      icon: Map,
      active: currentPage === 'dashboard' && (
        (user.role === 'citizen' && citizenTab === 'map') ||
        (user.role === 'worker' && workerTab === 'tasks') ||
        ((user.role === 'supervisor' || user.role === 'admin') && adminTab === 'bins')
      ),
      action: () => {
        setCurrentPage('dashboard');
        if (user.role === 'citizen') setCitizenTab('map');
        if (user.role === 'worker') setWorkerTab('tasks');
        if (user.role === 'supervisor' || user.role === 'admin') setAdminTab('bins');
      }
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: ClipboardList,
      active: currentPage === 'dashboard' && (
        (user.role === 'citizen' && citizenTab === 'complaints') ||
        ((user.role === 'supervisor' || user.role === 'admin') && adminTab === 'dispatch')
      ),
      action: () => {
        setCurrentPage('dashboard');
        if (user.role === 'citizen') {
          setCitizenTab('complaints');
        } else {
          setAdminTab('dispatch');
        }
      }
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: Navigation,
      active: currentPage === 'dashboard' && (
        (user.role === 'worker' && workerTab === 'route') ||
        ((user.role === 'supervisor' || user.role === 'admin') && adminTab === 'fleet')
      ),
      action: () => {
        setCurrentPage('dashboard');
        if (user.role === 'worker') {
          setWorkerTab('route');
        } else {
          if (user.role === 'citizen') onRoleChange('supervisor');
          setAdminTab('fleet');
        }
      }
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      active: currentPage === 'dashboard' && (
        (user.role === 'citizen' && citizenTab === 'recycling') ||
        ((user.role === 'supervisor' || user.role === 'admin') && adminTab === 'analytics')
      ),
      action: () => {
        setCurrentPage('dashboard');
        if (user.role === 'citizen') {
          setCitizenTab('recycling');
        } else {
          setAdminTab('analytics');
        }
      }
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: Gift,
      active: currentPage === 'dashboard' && user.role === 'citizen' && citizenTab === 'rewards',
      action: () => {
        setCurrentPage('dashboard');
        if (user.role !== 'citizen') onRoleChange('citizen');
        setCitizenTab('rewards');
      }
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      active: currentPage === 'dashboard' && user.role === 'citizen' && citizenTab === 'home', // Leadboard is on home
      action: () => {
        setCurrentPage('dashboard');
        if (user.role !== 'citizen') onRoleChange('citizen');
        setCitizenTab('home');
        // Smooth scroll to leaderboard element after render
        setTimeout(() => {
          const el = document.getElementById('leaderboard-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    },
    {
      id: 'digital-twin',
      label: 'Digital Twin',
      icon: Leaf,
      active: currentPage === 'smartcity',
      action: () => {
        setCurrentPage('smartcity');
      }
    },
    {
      id: 'notifications',
      label: `Alerts (${notificationsCount})`,
      icon: Bell,
      active: false,
      action: onOpenNotifications
    },
    {
      id: 'support',
      label: 'Support & FAQ',
      icon: HelpCircle,
      active: currentPage === 'faq',
      action: onOpenFAQ
    }
  ];

  // Conditional Admin dashboard links
  const isAdminOrSupervisor = user.role === 'admin' || user.role === 'supervisor';

  const handleItemClick = (itemAction: () => void) => {
    itemAction();
    setIsMobileOpen(false); // Close drawer on mobile click
  };

  const currentRoleConfig = roles.find(r => r.id === user.role);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 border-r border-zinc-900 font-sans">
      
      {/* Brand logo header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-900 h-14 shrink-0">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleItemClick(() => setCurrentPage('home'))}>
          <div className="h-8 w-8 rounded-xl bg-emerald-500 text-zinc-950 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-emerald-500/20">
            <Leaf className="h-4.5 w-4.5 font-bold" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-tight text-white leading-none">
                EcoTrack <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-0.5 tracking-wider uppercase">
                SmartCity OS
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Arrow */}
        {!isMobileOpen && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}

        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Navigation links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.action)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 relative group text-left ${
                item.active 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                  : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-50 border border-transparent'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${item.active ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
              {(!isCollapsed || isMobileOpen) && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {/* Collapsed Tooltip fallback */}
              {isCollapsed && !isMobileOpen && (
                <div className="absolute left-14 scale-0 group-hover:scale-100 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-zinc-800 shadow-xl transition-all duration-150 origin-left z-50 pointer-events-none uppercase tracking-wider">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}

        {/* Extra Divider & Special Admin indicators */}
        {isAdminOrSupervisor && (!isCollapsed || isMobileOpen) && (
          <div className="pt-4 mt-4 border-t border-zinc-900">
            <span className="px-3 text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mb-2">
              ADMIN CONTROL PANEL
            </span>
            <button
              onClick={() => handleItemClick(() => { setCurrentPage('dashboard'); setAdminTab('enterprise'); })}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-semibold transition ${
                currentPage === 'dashboard' && adminTab === 'enterprise'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white border border-transparent'
              }`}
            >
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
              <span>Enterprise Hub</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile / Dynamic Persona Switcher bottom area */}
      <div className="p-3 border-t border-zinc-900 bg-zinc-950 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className={`w-full p-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850/80 rounded-2xl transition flex items-center gap-2.5 text-left ${
              showRoleSelector ? 'ring-1 ring-emerald-500/40 border-emerald-500/30' : ''
            }`}
          >
            <div className="h-8 w-8 rounded-xl bg-zinc-800 text-white font-mono font-bold flex items-center justify-center text-xs shadow-md border border-zinc-700/50 shrink-0 uppercase">
              {user.name[0]}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-zinc-200 truncate leading-none">
                  {user.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 font-mono mt-1 uppercase">
                  <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-rose-500' : user.role === 'supervisor' ? 'bg-sky-500' : user.role === 'worker' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  {user.role}
                </span>
              </div>
            )}
            {(!isCollapsed || isMobileOpen) && (
              <ChevronRight className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${showRoleSelector ? 'rotate-90' : ''}`} />
            )}
          </button>

          {/* Collapsed view role shortcut click */}
          {isCollapsed && !isMobileOpen && (
            <div className="absolute bottom-12 left-1 scale-0 group-hover:scale-100 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded-md border border-zinc-800 z-50 pointer-events-none">
              Change Active Perspective
            </div>
          )}

          {/* Floating list of perspectives / identity manager */}
          <AnimatePresence>
            {showRoleSelector && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-14 left-0 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-zinc-100"
              >
                <div className="px-2 py-1.5 border-b border-zinc-900 mb-1 flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono tracking-wider text-zinc-500 uppercase">SWAP PERSPECTIVE</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">{user.points} XP</span>
                </div>

                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onRoleChange(r.id);
                      setShowRoleSelector(false);
                      setCurrentPage('dashboard');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition ${
                      user.role === r.id 
                        ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' 
                        : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{r.icon}</span>
                      <span>{r.name}</span>
                    </div>
                    <span className="text-[8px] font-mono font-black text-zinc-500 px-1 border border-zinc-800 rounded">
                      {r.badge}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className={`hidden md:block h-screen fixed top-0 left-0 transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-in Sidebar overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-72 h-full z-10 flex flex-col"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
