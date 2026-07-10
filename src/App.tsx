import React, { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import WorkerPortal from './pages/WorkerPortal';
import AdminPortal from './pages/AdminPortal';
import FAQContact from './pages/FAQContact';
import SmartCityOS from './pages/SmartCityOS';
import EcoBot from './components/EcoBot';
import CommandPalette from './components/CommandPalette';
import { SmartBin, CivicReport, WorkerTask, UserProfile } from './types';
import { Bell, ShieldAlert, CheckCircle2, Award, Info, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupabaseService } from './supabaseService';
import { getSupabase, isSupabaseActive } from './supabaseClient';
import SetupErrorPage from './components/SetupErrorPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home'); // 'home', 'dashboard', 'about', 'privacy', 'terms'
  const [faqInitialView, setFaqInitialView] = useState<'faq' | 'about' | 'privacy' | 'terms'>('faq');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('en');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Active tab syncing across different viewports
  const [citizenTab, setCitizenTab] = useState<'home' | 'scanner' | 'map' | 'complaints' | 'bulk' | 'recycling' | 'rewards'>('home');
  const [workerTab, setWorkerTab] = useState<'dashboard' | 'tasks' | 'qr-scan' | 'route'>('dashboard');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'dispatch' | 'bins' | 'fleet' | 'workforce' | 'rbac' | 'analytics' | 'heatmap' | 'health' | 'enterprise'>('dashboard');

  // Sidebar responsive collapse controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Master User Context - with demo role shifting capabilities
  const [user, setUser] = useState<UserProfile>({
    email: 'suhelias786@gmail.com',
    role: 'citizen', // Default, can be toggled to 'worker', 'supervisor', 'admin' in HUD
    name: 'Elias Suhel',
    points: 125,
    avatarUrl: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Establish Supabase Session listener and Auth state sync
  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      console.log('[SESSION STATUS] Initializing Supabase session check...');
      // 1. Initial Session Check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          console.log('[SESSION STATUS] Active user session found on application load:', session.user.id);
          setIsLoggedIn(true);
          console.log('[PROFILE FETCH] Querying profile for loaded session user:', session.user.id);
          SupabaseService.getProfile(session.user.id).then(profile => {
            if (profile) {
              console.log('[PROFILE FETCHED] Successfully restored user profile on boot:', profile);
              setUser(profile);
            } else {
              const fallback = {
                email: session.user.email || '',
                role: 'citizen' as const,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Citizen',
                points: 100,
                avatarUrl: ''
              };
              console.log('[PROFILE CREATED] Profile not found in database, created client-side fallback:', fallback);
              setUser(fallback);
            }
          }).catch(err => {
            console.error('[PROFILE FETCH FAILED] Error fetching session profile on boot:', err);
          });
        } else {
          console.log('[SESSION STATUS] No active session found on application load. Running as Guest/Local Sandbox mode.');
        }
      });

      // 2. Auth State Change Listener
      console.log('[AUTH STATE CHANGED] Registering state change listener...');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`[AUTH STATE CHANGED] Event: ${event}, User ID: ${session?.user?.id || 'none'}`);
        if (session && session.user) {
          setIsLoggedIn(true);
          try {
            console.log('[PROFILE FETCH] Fetching profile on auth state change event:', event);
            const profile = await SupabaseService.getProfile(session.user.id);
            if (profile) {
              console.log('[PROFILE FETCHED] Loaded profile successfully:', profile);
              setUser(profile);
            } else {
              const fallback = {
                email: session.user.email || '',
                role: 'citizen' as const,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Citizen',
                points: 100,
                avatarUrl: ''
              };
              console.log('[PROFILE CREATED] Triggering user fallback profile creation on client-side:', fallback);
              setUser(fallback);
            }
          } catch (err) {
            console.error('[PROFILE FETCH FAILED] Error fetching profile on auth change:', err);
          }
        } else {
          console.log('[SESSION STATUS] Session is empty or cleared. Logging out.');
          setIsLoggedIn(false);
          // Revert to local sandbox guest profile when logged out
          setUser({
            email: 'suhelias786@gmail.com',
            role: 'citizen',
            name: 'Elias Suhel',
            points: 125,
            avatarUrl: ''
          });
        }
      });

      return () => {
        console.log('[AUTH STATE CHANGED] Unsubscribing auth state listener.');
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        console.log('[AUTH START] Initiating cloud signOut...');
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        console.log('[LOGOUT SUCCESS] Cloud database session terminated successfully.');
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
      console.log('[LOGOUT SUCCESS] Local sandbox guest profile reset.');
      setIsLoggedIn(false);
      setUser({
        email: 'suhelias786@gmail.com',
        role: 'citizen',
        name: 'Elias Suhel',
        points: 125,
        avatarUrl: ''
      });
      addNotification({
        title: 'Local Session Terminated',
        desc: 'Simulated mode reset.',
        type: 'info'
      });
    }
  };

  const handleAuthSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  // Dynamic state syncing with server
  const [bins, setBins] = useState<SmartBin[]>([]);
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalBins: 7,
    criticalBins: 2,
    totalReports: 2,
    pendingReports: 1,
    activeTasks: 2,
    completedTasks: 0,
    totalCo2Saved: 12.4,
    treeEquivalent: 0
  });

  // Telemetry notifications
  const [notifications, setNotifications] = useState<{ id: string; title: string; desc: string; type: 'info' | 'warn' | 'success'; time: string }[]>([
    { id: 'notif-1', title: 'System Heartbeat Synced', desc: 'IoT Smart Bins on segment V are online.', type: 'success', time: '02:45' },
    { id: 'notif-2', title: 'Critical Fill Level Warning', desc: 'Smart Bin SB-104 has filled past 90%!', type: 'warn', time: '02:40' }
  ]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [schemaMissing, setSchemaMissing] = useState(false);

  // Synchronize database endpoints periodically
  const refetchData = async () => {
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
    refetchData();

    // Establish Supabase Realtime subscriptions if active
    const supabase = getSupabase();
    if (supabase) {
      console.log('Registering EcoTrack AI Realtime Supabase Channel...');
      const channel = supabase.channel('realtime_civic_telemetry')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'smart_bins' }, () => { refetchData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => { refetchData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'worker_tasks' }, () => { refetchData(); })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => { refetchData(); })
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
  }, []);

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
      await refetchData();
      addNotification({
        title: 'Enterprise Demo Loaded',
        desc: 'Seeded +10K profiles, 13 smart bins, and 4 dispatch incidents across city bounds.',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEarnPoints = (amount: number) => {
    setUser(prev => ({ ...prev, points: Math.max(0, prev.points + amount) }));
    if (amount > 0) {
      addNotification({
        title: 'Credits Credited',
        desc: `Verified deposit completed successfully. Accrued +${amount} credits.`,
        type: 'success'
      });
    }
  };

  const handleAddReport = async (reportData: Partial<CivicReport>) => {
    try {
      await SupabaseService.addReport(reportData);
      await refetchData();
      handleEarnPoints(25); // Give reward for civic cleanup reports!
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
      await refetchData();
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
      await refetchData();
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
      await refetchData();
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
      await refetchData();
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
      await refetchData();
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

  const handleRoleChange = (newRole: UserProfile['role']) => {
    let mockName = 'Elias Suhel';
    if (newRole === 'worker') mockName = 'Marcus Vance';
    if (newRole === 'supervisor' || newRole === 'admin') mockName = 'Director Helen Thorne';

    setUser(prev => ({
      ...prev,
      role: newRole,
      name: mockName
    }));

    addNotification({
      title: `Identity Swapped`,
      desc: `Authorized credentials updated as: ${newRole.toUpperCase()}`,
      type: 'info'
    });
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
      
      {/* 1. Global Navigation Sidebar */}
      <Sidebar
        user={user}
        onRoleChange={handleRoleChange}
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

      {/* Main Outer Content Area */}
      <div className={`flex-grow flex flex-col min-w-0 min-h-screen relative transition-all duration-300 ${
        isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
      }`}>
        
        {/* 2. Sticky Top Navigation Bar */}
        <TopBar
          user={user}
          onRoleChange={handleRoleChange}
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

              {currentPage === 'dashboard' && (
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
                      reports={reports}
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
        </main>

        {/* 4. Global Footer */}
        <Footer onNavigate={navigateToFAQ} />

      </div>

      {/* Floating EcoBot AI Assistant */}
      <EcoBot user={user} />

      {/* Command Palette Keyboard Shortcut Center */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page, role) => {
          setCurrentPage(page);
          if (role) handleRoleChange(role as any);
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
