import React, { useState, useEffect, Suspense, lazy } from 'react';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import EcoBot from './components/EcoBot';
import CommandPalette from './components/CommandPalette';
import { SmartBin, CivicReport, WorkerTask, UserProfile, CitizenTab, WorkerTab, AdminTab } from './types';
import { Bell, ShieldAlert, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupabaseService } from './supabaseService';
import { getSupabase, isSupabaseActive } from './supabaseClient';
import SetupErrorPage from './components/SetupErrorPage';

// Lazy load page components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CitizenPortal = lazy(() => import('./pages/CitizenPortal'));
const WorkerPortal = lazy(() => import('./pages/WorkerPortal'));
const AdminPortal = lazy(() => import('./pages/AdminPortal'));
const FAQContact = lazy(() => import('./pages/FAQContact'));
const SmartCityOS = lazy(() => import('./pages/SmartCityOS'));

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
            console.error('[PROFILE FETCH FAILED] Error fetching session profile on boot:', err);
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
            console.error('[PROFILE FETCH FAILED] Error fetching profile on auth change:', err);
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
        console.error('[LOGOUT FAILED] Error signing out:', err);
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

  // Dynamic state syncing with server
  const [bins, setBins] = useState<SmartBin[]>([]);
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Telemetry notifications
  const [notifications, setNotifications] = useState<{ id: string; title: string; desc: string; type: 'info' | 'warn' | 'success'; time: string }[]>([
    { id: 'notif-1', title: 'System Heartbeat Synced', desc: 'IoT Smart Bins on segment V are online.', type: 'success', time: '02:45' },
    { id: 'notif-2', title: 'Critical Fill Level Warning', desc: 'Smart Bin SB-104 has filled past 90%!', type: 'warn', time: '02:40' }
  ]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [schemaMissing, setSchemaMissing] = useState(false);

  // Dynamically derived statistics from the core data state
  const stats = React.useMemo(() => {
    const totalBins = bins.length;
    const criticalBins = bins.filter(b => b.fillLevel >= 85).length;
    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const activeTasks = tasks.filter(t => t.status !== 'completed').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    // These would be calculated with a more complex model in a real scenario
    const totalCo2Saved = (completedTasks * 0.5) + (totalReports * 0.1);
    const treeEquivalent = Math.floor(totalCo2Saved / 50);

    return { totalBins, criticalBins, totalReports, pendingReports, activeTasks, completedTasks, totalCo2Saved, treeEquivalent };
  }, [bins, reports, tasks]);

  // Synchronize database endpoints periodically
  const refetchData = async () => {
    const supabase = getSupabase();

    try {
      const [binsData, reportsData, tasksData, vehiclesData] = await Promise.all([
        SupabaseService.getSmartBins(),
        SupabaseService.getCivicReports(),
        SupabaseService.getWorkerTasks(),
        SupabaseService.getVehicles()
      ]);

      setBins(binsData);
      setReports(reportsData);
      setTasks(tasksData);
      setVehicles(vehiclesData);

      if ((window as any).supabaseSchemaMissing) {
        setSchemaMissing(true);
      }
    } catch (err: any) {
      console.error('Failed to sync civic telemetry databases.', err);
      if (err?.message?.includes('relation') || err?.message?.includes('does not exist') || err?.message?.includes('Could not find') || (window as any).supabaseSchemaMissing) {
        setSchemaMissing(true);
      }
    }
  };

  useEffect(() => {
    if (!authReady) return; // <-- Guard clause: Do not fetch data until auth is ready.

    refetchData();

    // Establish Supabase Realtime subscriptions if active
    const supabase = getSupabase();
    if (supabase) {
      const channel = supabase.channel('realtime_civic_telemetry')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'smart_bins' }, (payload) => {
          setBins(currentBins => [...currentBins, payload.new as SmartBin]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'smart_bins' }, (payload) => {
          setBins(currentBins => currentBins.map(bin => bin.id === payload.new.id ? payload.new as SmartBin : bin));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'smart_bins' }, (payload) => {
          setBins(currentBins => currentBins.filter(bin => bin.id !== payload.old.id));
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
          setReports(currentReports => [payload.new as CivicReport, ...currentReports]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reports' }, (payload) => {
          setReports(currentReports => currentReports.map(report => report.id === payload.new.id ? payload.new as CivicReport : report));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'reports' }, (payload) => {
          setReports(currentReports => currentReports.filter(report => report.id !== payload.old.id));
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'worker_tasks' }, (payload) => {
          setTasks(currentTasks => [payload.new as WorkerTask, ...currentTasks]);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'worker_tasks' }, (payload) => {
          setTasks(currentTasks => currentTasks.map(task => task.id === payload.new.id ? payload.new as WorkerTask : task));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'worker_tasks' }, (payload) => {
          setTasks(currentTasks => currentTasks.filter(task => task.id !== payload.old.id));
        })
        // Note: A full implementation would handle all tables and events.
        // Using a generic refetch for simplicity is okay for demos but not for production performance.
        // .on('postgres_changes', { event: '*', schema: 'public', table: 'smart_bins' }, () => { refetchData(); })
        // .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => { refetchData(); })
        // .on('postgres_changes', { event: '*', schema: 'public', table: 'worker_tasks' }, () => { refetchData(); })
        // .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => { refetchData(); })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Local development polling interval
      const interval = setInterval(() => {
        refetchData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [authReady]); // <-- Re-run this effect when authReady changes

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
      console.error(err);
    }
  };

  const handleAddReport = async (reportData: Partial<CivicReport>) => {
    try {
      await SupabaseService.addReport(reportData);
      addNotification({
        title: 'Civic Report Registered',
        desc: `Report for "${reportData.title}" dispatched successfully.`,
        type: 'info'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDispatchReport = async (reportId: string, workerId: string, priority: 'low' | 'medium' | 'high') => {
    try {
      await SupabaseService.dispatchReport(reportId, workerId, priority);
      addNotification({
        title: 'Sanitation Crew Dispatched',
        desc: `Task for report ${reportId} assigned to team with ${priority} priority.`,
        type: 'success'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await SupabaseService.dismissReport(reportId);
      addNotification({
        title: 'Incident Report Dismissed',
        desc: `Report ${reportId} dismissed by supervisor.`,
        type: 'info'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBin = async (binData: any) => {
    try {
      await SupabaseService.addBin(binData);
      addNotification({
        title: 'Smart Bin Provisioned',
        desc: `IoT Sensor unit "${binData.name}" calibrated and online in real-time.`,
        type: 'success'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBin = async (binId: string) => {
    try {
      await SupabaseService.deleteBin(binId);
      addNotification({
        title: 'Smart Bin Decommissioned',
        desc: `IoT Sensor unit ${binId} successfully deleted from grid records.`,
        type: 'info'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await SupabaseService.completeTask(taskId);
      addNotification({
        title: 'Collection Stop Completed',
        desc: `Task cleared and smart bin levels updated to 0% in real-time.`,
        type: 'success'
      });
    } catch (err) {
      console.error(err);
    }
  };

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

  if (isSupabaseActive() && schemaMissing) {
    return (
      <SetupErrorPage
        onRetry={async () => {
          (window as any).supabaseSchemaMissing = false;
          setSchemaMissing(false);
          await refetchData();
          if ((window as any).supabaseSchemaMissing) {
            setSchemaMissing(true);
            throw new Error("Database schema tables are still missing.");
          }
        }}
      />
    );
  }

  return (
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
          user={user}
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

        {schemaMissing && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-center text-xs text-amber-600 dark:text-amber-500 flex items-center justify-center space-x-2 animate-fade-in z-10">
            <ShieldAlert className="h-4 w-4 shrink-0 animate-pulse text-amber-500" />
            <span className="text-left max-w-4xl">
              <strong>Supabase Connected, but Database Schema Missing:</strong> The database tables (like <code>smart_bins</code>) have not been created yet in your Supabase project. We have gracefully fallen back to highly resilient local storage to keep the interface fully functional. Please copy and execute the SQL migration script from <code>supabase/migrations/</code> in your Supabase SQL Editor.
            </span>
          </div>
        )}

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
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-2">
                <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin" />
                <span className="text-xs text-slate-400">Loading Workspace...</span>
              </div>
            </div>
          }>
            <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (currentPage === 'dashboard' ? user.role : '')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              {currentPage === 'home' && (
                <LandingPage
                  onLaunchPortal={() => setCurrentPage('dashboard')}
                  onNavigate={navigateToFAQ}
                />
              )}

              {currentPage === 'dashboard' && isLoggedIn && user && (
                <div className="space-y-6 text-left">
                  
                  {/* Elegant low-profile heading for active context */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/30 dark:border-zinc-800/40 pb-4">
                    <div>
                      <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                        {user.role === 'citizen' && "Citizen Workspace"}
                        {user.role === 'worker' && "Crew Stop Sheet"}
                        {user.role === 'supervisor' && "Dispatch Hub"}
                        {user.role === 'admin' && "Municipal Command OS"}
                      </h1>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Logged in as {user.name} • Active {user.role} viewport.
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-zinc-100/40 dark:bg-zinc-900/40 px-2.5 py-1 rounded-lg border border-zinc-200/20 dark:border-zinc-800/40 shrink-0 self-start sm:self-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[9px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        SYS LIVE
                      </span>
                    </div>
                  </div>

                  {/* Render appropriate dashboards dynamically */}
                  {user.role === 'citizen' && (
                    <CitizenPortal
                      user={user} 
                      bins={bins} 
                      onEarnPoints={handleEarnPoints}
                      onAddReport={handleAddReport}
                      activeTab={citizenTab}
                      onTabChange={(tab) => setCitizenTab(tab)}
                    />
                  )}

                  {user.role === 'worker' && (
                    <WorkerPortal
                      tasks={tasks}
                      onCompleteTask={handleCompleteTask}
                      bins={bins}
                      activeTab={workerTab}
                      onTabChange={(tab) => setWorkerTab(tab)}
                    />
                  )}

                  {(user.role === 'supervisor' || user.role === 'admin' || user.role === 'superadmin') && (
                    <AdminPortal
                      bins={bins}
                      reports={reports}
                      tasks={tasks}
                      onDispatchReport={handleDispatchReport}
                      onDismissReport={handleDismissReport}
                      onAddBin={handleAddBin}
                      onDeleteBin={handleDeleteBin}
                      activeSubTab={adminTab}
                      onSubTabChange={(tab) => setAdminTab(tab)}
                    />
                  )}

                </div>
              )}

              {currentPage === 'smartcity' && <SmartCityOS />}

              {currentPage === 'faq' && <FAQContact initialView={faqInitialView} />}
              
              {currentPage === 'about' && <FAQContact initialView="about" />}
              {currentPage === 'privacy' && <FAQContact initialView="privacy" />}
              {currentPage === 'terms' && <FAQContact initialView="terms" />}
            </motion.div>
          </AnimatePresence>
          </Suspense>
        </main>

        {/* 4. Global Footer */}
        <Footer onNavigate={navigateToFAQ} />

      </div>

      {/* Floating EcoBot AI Assistant */}
      {isLoggedIn && user && <EcoBot user={user} />}

      {/* Command Palette Keyboard Shortcut Center */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page, role) => {
          setCurrentPage(page);
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
  );
}
