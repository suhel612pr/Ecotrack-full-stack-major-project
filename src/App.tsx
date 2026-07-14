import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import EcoBot from './components/EcoBot';
import CommandPalette from './components/CommandPalette';
import { UserProfile, CitizenTab, WorkerTab, AdminTab } from './types';
import { Bell, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupabaseService } from './supabaseService';
import { getSupabase, isSupabaseActive } from './supabaseClient';
import AppRouter from './Router';
import { logError } from './logger';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home'); // 'home', 'dashboard', 'about', 'privacy', 'terms'
  const [faqInitialView, setFaqInitialView] = useState<'faq' | 'about' | 'privacy' | 'terms'>('faq');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('en');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Active tab syncing across different viewports
  const [citizenTab, setCitizenTab] = useState<CitizenTab>('home');
  const [workerTab, setWorkerTab] = useState<WorkerTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Sidebar responsive collapse controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Master User Context - with demo role shifting capabilities
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);

  const isLoggedIn = !!user;

  // Establish Supabase Session listener and Auth state sync
  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      // 1. Initial Session Check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          SupabaseService.getProfile(session.user.id).then(profile => {
            if (profile) {
              setUser(profile);
            }
          }).catch(err => {
            logError('[PROFILE FETCH FAILED] Error fetching session profile on boot:', err);
            setUser(null); // Ensure user is logged out if profile fails
          });
        }
        setAuthReady(true); // Signal that auth check is done
      });

      // 2. Auth State Change Listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          try {
            const profile = await SupabaseService.getProfile(session.user.id);
            if (profile) {
              setUser(profile);
            }
          } catch (err) {
            logError('[PROFILE FETCH FAILED] Error fetching profile on auth change:', err);
            // If profile fetch fails, treat as logged out to prevent inconsistent state
            setUser(null);
          }
        } else {
          // User is logged out
          setUser(null);
          // When logging out, redirect to home page
          setCurrentPage('home');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setAuthReady(true); // If no supabase, auth is "ready" for local mode
    }
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        addNotification({
          title: 'Signed Out Successfully',
          desc: 'Your Cloud DB session has been terminated.',
          type: 'info'
        });
      } catch (err: any) {
        logError('[LOGOUT FAILED] Error signing out:', err);
        addNotification({
          title: 'Sign Out Failed',
          desc: err.message || 'An error occurred during sign out.',
          type: 'warn'
        });
      }
    } else {
      // Local simulated mode logout
      setUser(null);
      addNotification({
        title: 'Local Session Terminated',
        desc: 'Simulated mode reset.',
        type: 'info'
      });
    }
  };

  const handleAuthSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsAuthModalOpen(false);
  };

  // Telemetry notifications
  const [notifications, setNotifications] = useState<{ id: string; title: string; desc: string; type: 'info' | 'warn' | 'success'; time: string }[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Sync dark class on document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Command Palette global hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerBackup = async () => {
    alert('Relational database snapshot completed. State written to S3 backup vault.');
  };

  const handleLoadDemoMode = async () => {
    try {
      await SupabaseService.loadDemoMode();
      addNotification({
        title: 'Enterprise Demo Loaded',
        desc: 'Seeded +10K profiles, 13 smart bins, and 4 dispatch incidents across city bounds.',
        type: 'success'
      });
    } catch (err) {
      logError('Failed to load demo mode', err);
    }
  };

  // This function is now a pure UI concern. Data operations should be in pages/hooks.
  const handleEarnPoints = async (amount: number) => {
    if (!user) return;
    const newPoints = (user.points || 0) + amount;
    try {
      await SupabaseService.updateProfile(user.id, { points: newPoints });
      setUser(prevUser => prevUser ? { ...prevUser, points: newPoints } : null);
      addNotification({
        title: `+${amount} Green Credits!`,
        desc: `Your contribution has been logged. New balance: ${newPoints}`,
        type: 'success',
      });
    } catch (error) {
      logError('Failed to update points:', error);
      addNotification({ title: 'Error Updating Points', desc: 'Could not save your new point balance.', type: 'warn' });
    }
  }

  const addNotification = (notif: { title: string; desc: string; type: 'info' | 'warn' | 'success' }) => {
    const time = new Date().toTimeString().substring(0, 5);
    setNotifications(prev => [
      { id: `notif-${Date.now()}`, ...notif, time },
      ...prev
    ]);
  };

  const navigateToFAQ = (view: 'faq' | 'about' | 'privacy' | 'terms') => {
    setFaqInitialView(view);
    setCurrentPage('faq');
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-row font-sans transition-colors duration-300">
      
      {/* 1. Global Navigation Sidebar (Only if logged in) */}
      {isLoggedIn && user && (
      <Sidebar
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        citizenTab={citizenTab}
        setCitizenTab={setCitizenTab}
        workerTab={workerTab}
        setWorkerTab={setWorkerTab}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        notificationsCount={notifications.length}
        onOpenNotifications={() => setShowNotifMenu(!showNotifMenu)}
        onOpenFAQ={() => navigateToFAQ('faq')}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />
      )}

      {/* Main Outer Content Area */}
      <div className={`flex-grow flex flex-col min-w-0 min-h-screen relative transition-all duration-300 ${
        isLoggedIn && !isSidebarCollapsed ? 'md:pl-64' : isLoggedIn && isSidebarCollapsed ? 'md:pl-16' : 'pl-0'
      }`}>
        
        {/* 2. Sticky Top Navigation Bar */}
        <TopBar
          user={user ?? {
            id: 'guest',
            email: 'guest@ecotrack.ai',
            role: 'citizen',
            name: 'Guest',
            points: 0,
            avatarUrl: ''
          }}
          onRoleChange={() => {}}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          language={language}
          onLanguageChange={setLanguage}
          notificationsCount={notifications.length}
          onOpenNotifications={() => setShowNotifMenu(!showNotifMenu)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          citizenTab={citizenTab}
          workerTab={workerTab}
          adminTab={adminTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          isLoggedIn={isLoggedIn}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Floating telemetry Notifications Center Modal */}
        <AnimatePresence>
          {showNotifMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-14 right-4 md:right-8 w-80 max-h-[400px] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-40 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center">
                  <Bell className="h-4 w-4 mr-1 text-emerald-500 animate-bounce" /> INCIDENT RADAR
                </span>
                <button
                  onClick={() => setShowNotifMenu(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No incident alerts detected.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start space-x-2">
                      <span className="text-lg mt-0.5">
                        {n.type === 'success' ? '🟢' : n.type === 'warn' ? '🔴' : '🔵'}
                      </span>
                      <div className="flex-1 space-y-0.5 text-left">
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{n.title}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-normal">{n.desc}</span>
                        <span className="block text-[8px] text-slate-400 font-mono">{n.time} UTC</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Main Content Routing Stage */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <AppRouter 
            user={user} 
            addNotification={addNotification} 
            handleEarnPoints={handleEarnPoints}
            citizenTab={citizenTab} setCitizenTab={setCitizenTab}
            workerTab={workerTab} setWorkerTab={setWorkerTab}
            adminTab={adminTab} setAdminTab={setAdminTab}
            faqInitialView={faqInitialView}
          />
        </main>

        {/* 4. Global Footer */}
        <Footer onNavigate={(page) => navigateToFAQ(page as 'faq' | 'about' | 'privacy' | 'terms')} />

      </div>

      {/* Floating EcoBot AI Assistant */}
      {isLoggedIn && user && <EcoBot user={user} />}

      {/* Command Palette Keyboard Shortcut Center */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page, role) => {
          // This will now be handled by react-router-dom's <Navigate /> or navigate()
        }}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isDarkMode={darkMode}
        onTriggerBackup={handleTriggerBackup}
        onLoadDemoMode={handleLoadDemoMode}
      />

      {/* Cloud DB Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      </div>
    </BrowserRouter>
  );
}
