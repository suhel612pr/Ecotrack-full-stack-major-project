import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, TrendingUp, Users, Leaf, ArrowUpRight, ArrowDownRight, Trash2, 
  Zap, AlertTriangle, Clock, Activity, ShieldAlert, CheckCircle2, RefreshCw, 
  Navigation, Battery, MapPin, Sparkles, ClipboardList, Send, FileText, Globe, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid 
} from 'recharts';
import { SmartBin, CivicReport, WorkerTask } from '../types';

interface EnterpriseOverviewProps {
  bins: SmartBin[];
  reports: CivicReport[];
  tasks: WorkerTask[];
  onDispatchReport: (reportId: string, workerId: string, priority: 'low' | 'medium' | 'high') => void;
  onDismissReport: (reportId: string) => void;
  onTabChange: (tab: any) => void;
}

export default function EnterpriseOverview({ 
  bins, reports, tasks, onDispatchReport, onDismissReport, onTabChange 
}: EnterpriseOverviewProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeAlertFilter, setActiveAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [selectedMapNode, setSelectedMapNode] = useState<any | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'info' | 'warn' }>>([]);

  // Mock Toast trigger
  const triggerToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Simulate loading state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      triggerToast('Enterprise Analytics Platform loaded successfully', 'success');
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleSyncData = () => {
    setIsSyncing(true);
    triggerToast('Synchronizing telemetry with municipal IoT gates...', 'info');
    setTimeout(() => {
      setIsSyncing(false);
      triggerToast('All 12 edge nodes synchronized with 100% data integrity', 'success');
    }, 1200);
  };

  // Helper calculations based on live arrays
  const totalBinsCount = bins.length;
  const activeBinsCount = bins.filter(b => b.sensorHealth === 'healthy').length;
  const overflowBinsCount = bins.filter(b => b.fillLevel >= 80).length;
  const nearCapacityBinsCount = bins.filter(b => b.fillLevel >= 50 && b.fillLevel < 80).length;
  const healthyBinsCount = bins.filter(b => b.fillLevel < 50 && b.sensorHealth === 'healthy').length;
  const offlineBinsCount = bins.filter(b => b.signalStrength === 'Degraded' || b.sensorHealth === 'degraded').length;

  const totalReportsSubmitted = reports.length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;
  const resolvedReportsCount = reports.filter(r => r.status === 'completed').length;
  const activeVehiclesCount = 3; // live simulated fleet count

  // Carbon Saved: base savings of 120kg + 15kg per resolved report + 5kg per bin level
  const baseCarbonSaved = 4620 + resolvedReportsCount * 15 + bins.reduce((acc, curr) => acc + (curr.fillLevel > 50 ? 8 : 2), 0);
  const carbonSavedTons = (baseCarbonSaved / 1000).toFixed(2);
  const recyclingRatePercent = 76.4; // standard audited target index
  const aiScansTodayCount = 842 + reports.length * 4;

  // Sparkline mini series
  const sparklineData1 = [
    { v: 12 }, { v: 19 }, { v: 15 }, { v: 17 }, { v: 22 }, { v: totalBinsCount }
  ];
  const sparklineData2 = [
    { v: 10 }, { v: 15 }, { v: 14 }, { v: 16 }, { v: 15 }, { v: activeBinsCount }
  ];
  const sparklineData3 = [
    { v: 2 }, { v: 5 }, { v: 3 }, { v: 4 }, { v: 6 }, { v: overflowBinsCount }
  ];
  const sparklineData4 = [
    { v: 150 }, { v: 180 }, { v: 210 }, { v: 190 }, { v: 230 }, { v: totalReportsSubmitted }
  ];

  // Dynamic charts data
  const wasteCategoriesData = [
    { name: 'Compost/Organic', value: bins.filter(b => b.category === 'organic').length || 2, color: '#10b981' },
    { name: 'Recyclables', value: bins.filter(b => b.category === 'recyclable').length || 3, color: '#06b6d4' },
    { name: 'General Landfill', value: bins.filter(b => b.category === 'landfill').length || 2, color: '#64748b' },
    { name: 'Hazardous Waste', value: bins.filter(b => b.category === 'hazardous').length || 1, color: '#f43f5e' }
  ];

  const dailyCollectionsData = [
    { day: 'Mon', 'Compost': 2.4, 'Recyclables': 3.1, 'Landfill': 4.5 },
    { day: 'Tue', 'Compost': 2.8, 'Recyclables': 3.9, 'Landfill': 4.0 },
    { day: 'Wed', 'Compost': 3.2, 'Recyclables': 4.2, 'Landfill': 3.8 },
    { day: 'Thu', 'Compost': 3.5, 'Recyclables': 4.8, 'Landfill': 4.9 },
    { day: 'Fri', 'Compost': 4.1, 'Recyclables': 5.2, 'Landfill': 4.2 },
    { day: 'Sat', 'Compost': 2.2, 'Recyclables': 3.0, 'Landfill': 2.5 },
    { day: 'Sun', 'Compost': 1.8, 'Recyclables': 2.1, 'Landfill': 1.9 }
  ];

  const weeklyCarbonData = [
    { week: 'Wk 1', CO2_Saved: 850, Trees_Saved: 4.1 },
    { week: 'Wk 2', CO2_Saved: 1020, Trees_Saved: 5.2 },
    { week: 'Wk 3', CO2_Saved: 1180, Trees_Saved: 5.9 },
    { week: 'Wk 4', CO2_Saved: 1250, Trees_Saved: 6.3 },
    { week: 'Wk 5', CO2_Saved: 1420, Trees_Saved: 7.1 },
    { week: 'Wk 6', CO2_Saved: baseCarbonSaved, Trees_Saved: (baseCarbonSaved / 200) }
  ];

  const productivityData = [
    { name: 'M. Vance', Collections: 42, SLA: 98 },
    { name: 'S. Jenkins', Collections: 38, SLA: 95 },
    { name: 'D. Miller', Collections: 31, SLA: 90 },
    { name: 'A. Patel', Collections: 29, SLA: 92 }
  ];

  // Dynamic Recent Activity Feed
  const getRecentActivity = () => {
    const activity: any[] = [];
    
    reports.forEach((rep, i) => {
      activity.push({
        id: `act-rep-${rep.id}`,
        type: 'citizen_report',
        title: rep.title,
        desc: `Citizen filed cleanliness ticket in ${rep.location}`,
        time: rep.createdAt || `${i + 2} hrs ago`,
        user: rep.citizenName,
        badge: rep.category.toUpperCase(),
        badgeColor: rep.category === 'hazardous' ? 'bg-rose-500/10 text-rose-500' : 'bg-cyan-500/10 text-cyan-500'
      });
    });

    bins.forEach((bin) => {
      if (bin.fillLevel >= 80) {
        activity.push({
          id: `act-bin-${bin.id}`,
          type: 'bin_alert',
          title: `Capacity Warning: ${bin.name}`,
          desc: `Sensor reports critical overflow volume at ${bin.fillLevel}%`,
          time: '35 mins ago',
          user: 'Edge Sensor IoT',
          badge: 'OVERFLOW',
          badgeColor: 'bg-rose-600/10 text-rose-500'
        });
      }
    });

    tasks.forEach((task) => {
      if (task.status === 'completed') {
        activity.push({
          id: `act-task-${task.id}`,
          type: 'worker_task',
          title: 'Route Completed',
          desc: `Crew finalized task: "${task.title}"`,
          time: '1 hr ago',
          user: 'Crew Unit 2',
          badge: 'COMPLETE',
          badgeColor: 'bg-emerald-500/10 text-emerald-500'
        });
      }
    });

    // Default static fallback to enrich the feed
    if (activity.length < 5) {
      activity.push(
        { id: 'def-1', type: 'ai_scan', title: 'AI Classification Success', desc: 'PET 1 Plastic Container scanned & processed successfully', time: 'Just now', user: 'App Node Client', badge: 'AI MODEL', badgeColor: 'bg-violet-500/10 text-violet-500' },
        { id: 'def-2', type: 'telemetry_check', title: 'Battery Warning', desc: 'SB-103 optical transceiver battery level dropped below 15%', time: '12 mins ago', user: 'Sensor Gateway', badge: 'BATTERY', badgeColor: 'bg-amber-500/10 text-amber-500' },
        { id: 'def-3', type: 'fleet_sync', title: 'Fleet Route Dispatched', desc: 'EV-TRUCK-14 scheduled for shortest route optimization (Hamiltonian cycle)', time: '2 hrs ago', user: 'Command Center', badge: 'FLEET', badgeColor: 'bg-teal-500/10 text-teal-500' }
      );
    }

    return activity;
  };

  const activityFeed = getRecentActivity();

  // Dynamic Real-time Alerts
  const getDynamicAlerts = () => {
    const alerts: any[] = [];

    bins.forEach((bin) => {
      if (bin.fireAlert) {
        alerts.push({
          id: `alert-fire-${bin.id}`,
          type: 'Fire Outbreak Alert',
          desc: `CRITICAL: Extreme heat signature triggered internal CO₂ discharge system on node ${bin.name}.`,
          location: bin.address,
          time: 'Just now',
          severity: 'critical'
        });
      }
      if (bin.fillLevel >= 85) {
        alerts.push({
          id: `alert-overflow-${bin.id}`,
          type: 'Container Overflow Alert',
          desc: `Warning: Lid optical sensor on ${bin.name} registers critical fill density at ${bin.fillLevel}%.`,
          location: bin.address,
          time: '15 mins ago',
          severity: 'warning'
        });
      }
      if (bin.batteryLevel <= 15) {
        alerts.push({
          id: `alert-battery-${bin.id}`,
          type: 'Battery Replacement Required',
          desc: `Device battery is critically low (${bin.batteryLevel}%). Maintenance dispatch ticket scheduled.`,
          location: bin.address,
          time: '2 hrs ago',
          severity: 'info'
        });
      }
    });

    // Default fallbacks if no alerts
    if (alerts.length === 0) {
      alerts.push(
        { id: 'da-1', type: 'Container Overflow Alert', desc: 'Warning: Lid optical sensor on Smart Bin SB-104 registers critical fill density at 92%.', location: '820 Mission St (Central Park)', time: '15 mins ago', severity: 'warning' },
        { id: 'da-2', type: 'Smoke Outbreak Detected', desc: 'CRITICAL: Extreme heat signature registered in Smart Bin SB-102. Thermal breaker activated.', location: '450 Market St (Transit Hub)', time: 'Just now', severity: 'critical' },
        { id: 'da-3', type: 'Battery Replacement Required', desc: 'Device optical transceiver battery level dropped below 15%. Scheduled for crew rotation.', location: 'Union Square East', time: '2 hrs ago', severity: 'info' }
      );
    }

    return activeAlertFilter === 'all' 
      ? alerts 
      : alerts.filter(a => a.severity === activeAlertFilter);
  };

  const activeAlertsList = getDynamicAlerts();

  // AI-Generated Insights
  const aiInsights = [
    { title: 'SB-102 High-Risk Overflow', value: 'Predictive analytics estimates SB-102 to reach max volume capacity in 2.1 hours.', confidence: 98, severity: 'critical', rec: 'Queue dispatch for Truck EV-14.' },
    { title: 'Sutter Corridor Hotspot', value: 'High concentration of citizen reports filed near Golden Gate Ave Corridor over the last 48 hours.', confidence: 92, severity: 'warning', rec: 'Add temporary compost bin and increase sanitation sweep cycle.' },
    { title: 'Carbon Target Accomplished', value: 'Carbon reduction offset of 4.6 tons meets 96% of the Q3 municipal environmental guidelines.', confidence: 99, severity: 'success', rec: 'Audited carbon certificates ready for export.' }
  ];

  return (
    <div className="space-y-6 text-left relative animate-fade-in">
      
      {/* Dynamic Toast System */}
      <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-3.5 rounded-2xl border text-xs shadow-xl flex items-center space-x-2.5 max-w-sm pointer-events-auto ${
                t.type === 'success' 
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/30' 
                  : t.type === 'warn'
                  ? 'bg-rose-950/90 text-rose-100 border-rose-500/30'
                  : 'bg-slate-900/90 text-slate-100 border-slate-700/50'
              }`}
            >
              <div className="h-2 w-2 rounded-full bg-current animate-ping shrink-0" />
              <span className="font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Block with Glassmorphism */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/40 dark:border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-mono font-extrabold tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full uppercase">
              Corporate Intelligence Hub
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-zinc-400">Node Cluster: US-WEST-2</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight flex items-center">
            <Globe className="h-5 w-5 mr-2 text-indigo-500 animate-pulse" /> Municipal Operational Overview
          </h2>
          <p className="text-xs text-slate-500">Real-time ESG KPIs, IoT sensor monitoring, and automated ML routing algorithms.</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-black/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing Nodes...' : 'Consolidated Sync'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        // Skeleton Loader
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-80 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
            <div className="lg:col-span-4 h-80 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================
              1. KPI Cards (Grid layout with Trend Lines / Sparklines)
              ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: Total Smart Bins */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">IoT Sensor Nodes</span>
                  <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight block mt-0.5">{totalBinsCount} Smart Bins</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <BarChart3 className="h-4.5 w-4.5 text-cyan-500" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-emerald-500 font-bold font-mono flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> +14.2% MoM
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">2 deployed this week</span>
                </div>
                {/* Micro Sparkline */}
                <div className="w-16 h-8 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData1}>
                      <Line type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* KPI 2: Active / Healthy Bins */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Edge Node Integrity</span>
                  <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight block mt-0.5">{activeBinsCount} Operational</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <Activity className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-emerald-500 font-bold font-mono flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 98.4% uptime
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{offlineBinsCount} nodes with warnings</span>
                </div>
                {/* Micro Sparkline */}
                <div className="w-16 h-8 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData2}>
                      <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* KPI 3: Overflowing Smart Bins */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Critical Overflows</span>
                  <span className={`text-xl font-black tracking-tight block mt-0.5 ${overflowBinsCount > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-slate-100'}`}>
                    {overflowBinsCount} Over Limit
                  </span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  {overflowBinsCount > 0 ? (
                    <span className="text-[10px] text-rose-500 font-bold font-mono flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> Action dispatch required
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-500 font-bold font-mono flex items-center">
                      All clean & safe
                    </span>
                  )}
                  <span className="text-[9px] text-slate-400 block mt-0.5">{nearCapacityBinsCount} bins near capacity (50%+)</span>
                </div>
                {/* Micro Sparkline */}
                <div className="w-16 h-8 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData3}>
                      <Line type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* KPI 4: Citizen Cleanliness Reports */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Citizen Triage tickets</span>
                  <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight block mt-0.5">{totalReportsSubmitted} Incidents</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <ClipboardList className="h-4.5 w-4.5 text-indigo-500" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-emerald-500 font-bold font-mono flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-0.5" /> -4.5% unresolved
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{pendingReportsCount} pending supervisor dispatch</span>
                </div>
                {/* Micro Sparkline */}
                <div className="w-16 h-8 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData4}>
                      <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* New row of secondary KPI metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 5: Active Vehicles */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-3xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/10 rounded-2xl">
                <Navigation className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Active Fleet Vehicles</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">{activeVehiclesCount} on Duty</span>
                <span className="text-[9px] text-emerald-500 font-bold mt-0.5 block flex items-center">
                  100% Electric EV trucks
                </span>
              </div>
            </div>

            {/* KPI 6: Carbon saved */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-3xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 rounded-2xl">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Carbon reduction Saved</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">{carbonSavedTons} Tons CO₂</span>
                <span className="text-[9px] text-emerald-500 font-bold mt-0.5 block flex items-center">
                  +12.4% vs previous half
                </span>
              </div>
            </div>

            {/* KPI 7: Recycling rate */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-3xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-teal-500/10 text-teal-500 border border-teal-500/10 rounded-2xl">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Recycling Efficiency</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">{recyclingRatePercent}% Index</span>
                <span className="text-[9px] text-cyan-400 font-bold mt-0.5 block flex items-center">
                  Goal Target: 80% by Q4
                </span>
              </div>
            </div>

            {/* KPI 8: AI Scans Today */}
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-3xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-violet-500/10 text-violet-500 border border-violet-500/10 rounded-2xl">
                <Sparkles className="h-5 w-5 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">AI Material Scans Today</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">{aiScansTodayCount} Scans</span>
                <span className="text-[9px] text-violet-400 font-bold mt-0.5 block flex items-center">
                  98.2% Gemini accuracy
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================
              2. Interactive Charts & Live Smart City Map (Second Row)
              ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Environmental Diversion & Collection Trends */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
                  <BarChart3 className="h-4.5 w-4.5 text-emerald-600 mr-2" /> Live Daily Waste Tonnage & Collection Loops
                </h3>
                <p className="text-xs text-slate-400 mt-1">Metric aggregates general waste, recyclable paper and plastics, and compost tonnage processed daily.</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyCollectionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCompost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRecyclables" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLandfill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', color: '#f8fafc' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="Compost" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompost)" />
                    <Area type="monotone" dataKey="Recyclables" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecyclables)" />
                    <Area type="monotone" dataKey="Landfill" stroke="#64748b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLandfill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>UPDATED JUST NOW</span>
                <span className="text-emerald-500 font-bold flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> 74.2 Tons diverted this month
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Futuristic Mission Control City Map */}
            <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl border border-slate-900 shadow-xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 z-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Live IoT GIS Telemetry Map</h3>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">GRID BASE: Civic Center [37.7749° N]</span>
                </div>
                <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded uppercase font-bold animate-pulse shrink-0">
                  GPS LINK: STABLE
                </span>
              </div>

              {/* Vector SVG Interactive Map */}
              <div className="relative h-64 my-4 border border-white/5 rounded-2xl bg-slate-950/80 overflow-hidden select-none flex items-center justify-center">
                
                {/* HUD Overlay Lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none p-4 flex flex-col justify-between">
                  <div className="border-t border-slate-500 w-full" />
                  <div className="border-t border-slate-500 w-full" />
                  <div className="border-t border-slate-500 w-full" />
                  <div className="absolute top-0 bottom-0 left-1/3 border-l border-slate-500" />
                  <div className="absolute top-0 bottom-0 left-2/3 border-l border-slate-500" />
                </div>

                <div className="absolute inset-0 pointer-events-none p-4 text-[8px] font-mono text-slate-600 flex justify-between items-end">
                  <span className="transform rotate-90 origin-left">MARKET CORRIDOR</span>
                  <span>UNION SQUARE S-GRID</span>
                </div>

                {/* Draw Vector Roads */}
                <svg className="absolute inset-0 w-full h-full opacity-20 stroke-slate-500 stroke-2 fill-none pointer-events-none" viewBox="0 0 100 100">
                  <path d="M 10 20 L 90 20" />
                  <path d="M 10 50 L 90 50" />
                  <path d="M 10 80 L 90 80" />
                  <path d="M 30 10 L 30 90" />
                  <path d="M 70 10 L 70 90" />
                  <path d="M 10 10 L 90 90" />
                </svg>

                {/* Node Markers */}
                <div className="absolute inset-0">
                  {bins.map((bin, idx) => {
                    // map coordinates safely into 0-100% bounds
                    const xPercent = 15 + (idx * 11.5);
                    const yPercent = 25 + ((idx % 3) * 22);
                    const isOverflow = bin.fillLevel >= 80;
                    
                    return (
                      <div
                        key={bin.id}
                        onClick={() => {
                          setSelectedMapNode({ ...bin, x: xPercent, y: yPercent });
                          triggerToast(`Inspecting IoT telemetry on node ${bin.id}`, 'info');
                        }}
                        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group z-20`}
                        style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                      >
                        <div className={`absolute -inset-2.5 rounded-full opacity-40 animate-ping ${
                          bin.fireAlert ? 'bg-red-500' : isOverflow ? 'bg-rose-500' : bin.batteryLevel < 15 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div className={`h-3 w-3 rounded-full border border-white flex items-center justify-center text-[7px] font-bold shadow-lg ${
                          bin.fireAlert ? 'bg-red-600 text-white' : isOverflow ? 'bg-rose-600 text-white' : bin.batteryLevel < 15 ? 'bg-amber-500 text-slate-900' : 'bg-emerald-500 text-white'
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 w-28 hidden group-hover:block bg-slate-900 border border-slate-700 p-1.5 rounded-xl text-[9px] font-mono shadow-xl z-30">
                          <span className="block font-bold truncate">{bin.name}</span>
                          <span className="block text-slate-400">Fill: {bin.fillLevel}%</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Active Vehicles Markers */}
                  <div className="absolute left-[38%] top-[45%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                       onClick={() => {
                         setSelectedMapNode({ id: 'EV-14', name: 'EV-TRUCK-14', fillLevel: 45, address: 'Moving towards Sector 4', status: 'Active Collection' });
                         triggerToast('Inspecting GPS tracking on fleet EV-TRUCK-14', 'info');
                       }}>
                    <div className="absolute -inset-2.5 rounded-full bg-cyan-500 opacity-40 animate-pulse" />
                    <div className="h-4.5 w-4.5 rounded-xl bg-indigo-600 border border-indigo-400 text-white flex items-center justify-center text-[8px] shadow-lg">
                      🚛
                    </div>
                  </div>
                </div>

                {/* Inspect Card Overlay */}
                <AnimatePresence>
                  {selectedMapNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-800 p-3 rounded-2xl shadow-xl z-40 text-left font-mono text-[10px] space-y-1.5"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="font-extrabold text-cyan-400">{selectedMapNode.name}</span>
                        <button 
                          onClick={() => setSelectedMapNode(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <div>
                          <span className="text-slate-500">Address:</span> <span className="block text-white truncate">{selectedMapNode.address || 'Active Segment'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Status:</span> <span className={`block font-bold ${selectedMapNode.fillLevel >= 80 ? 'text-rose-500' : 'text-emerald-500'}`}>{selectedMapNode.fillLevel >= 80 ? 'Critical' : 'Healthy'} ({selectedMapNode.fillLevel}%)</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Signal:</span> <span className="text-white block">{selectedMapNode.signalStrength || 'Optimal'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Node ID:</span> <span className="text-white block">{selectedMapNode.id}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>CLICK MARKER TO ACCESS CORES</span>
                <span className="text-cyan-400">Total active grid coverage: 100%</span>
              </div>
            </div>

          </div>

          {/* ========================================================
              3. AI Insights & Active Alerts Panel (Third Row)
              ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* AI Insights Panel */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
                  <Sparkles className="h-4 w-4 text-violet-500 mr-1.5 animate-pulse" /> AI Operations Forecasting Panel
                </h3>
                <span className="text-[9px] font-mono text-violet-500 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                  ML-Powered Insights
                </span>
              </div>

              <div className="space-y-3">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850/60 flex flex-col justify-between space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{insight.title}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                        insight.severity === 'critical' 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                          : insight.severity === 'warning'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        Confidence: {insight.confidence}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{insight.value}</p>
                    <div className="text-[10px] font-mono text-indigo-500 font-bold flex items-center pt-1 border-t border-slate-200/20 dark:border-slate-800/50">
                      <span>Recommendation: {insight.rec}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Alerts Panel */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500 mr-1.5" /> Core Command Incident Alerts Center
                </h3>

                {/* Filter buttons */}
                <div className="flex space-x-1">
                  {(['all', 'critical', 'warning', 'info'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveAlertFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition border ${
                        activeAlertFilter === f
                          ? 'bg-slate-900 dark:bg-slate-800 border-transparent text-white'
                          : 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 text-slate-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-[310px] overflow-y-auto">
                {activeAlertsList.map(alert => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-2xl border flex items-start gap-3 text-xs ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500/5 border-rose-500/15 text-rose-900 dark:text-rose-400'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500/5 border-amber-500/15 text-amber-900 dark:text-amber-400'
                        : 'bg-cyan-500/5 border-cyan-500/15 text-cyan-900 dark:text-cyan-400'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      alert.severity === 'critical' ? 'bg-rose-500/10' : alert.severity === 'warning' ? 'bg-amber-500/10' : 'bg-cyan-500/10'
                    }`}>
                      {alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                    </div>
                    <div className="flex-grow space-y-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{alert.type}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{alert.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">{alert.desc}</p>
                      <span className="text-[9px] font-mono text-slate-400 block pt-0.5">Location: {alert.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ========================================================
              4. Fleet Status & Smart Bin Overview (Fourth Row)
              ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Fleet Status */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">EV Sanitation Fleet Status</h3>
                <p className="text-xs text-slate-400">Battery levels and active collection statuses for current duty vehicles.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'EV-TRUCK-14', model: 'MACK LR Electric', type: 'EV-Truck', batteryLevel: 92, status: 'Collecting', distance: '14.2 miles saved' },
                  { name: 'EV-TRUCK-11', model: 'BYD 8R Heavy Duty', type: 'Heavy-Duty', batteryLevel: 78, status: 'On-Route', distance: '11.8 miles saved' },
                  { name: 'EV-TRUCK-09', model: 'Tesla Semi Modified', type: 'Compost-Carrier', batteryLevel: 14, status: 'Charging', distance: 'Maintenance' },
                  { name: 'EV-COMPACT-01', model: 'Autonomous Sorter', type: 'Sub-Compact', batteryLevel: 85, status: 'Available', distance: 'Standby' }
                ].map((veh, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{veh.name}</span>
                        <span className="text-[10px] text-slate-400 block">{veh.model}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        veh.status === 'Charging' 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : veh.status === 'Collecting'
                          ? 'bg-cyan-500/10 text-cyan-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {veh.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Charge Capacity</span>
                        <span className={`${veh.batteryLevel < 20 ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>{veh.batteryLevel}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            veh.batteryLevel < 20 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${veh.batteryLevel}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200/40 dark:border-slate-800/50 text-[9px] font-mono text-slate-400 flex justify-between">
                      <span>Type: {veh.type}</span>
                      <span>{veh.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Bin Overview */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Smart IoT Bin Capacity Summary</h3>
                <p className="text-xs text-slate-400">Total active bins catalogued by immediate fill limits and hardware state ratings.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Healthy Bins', count: healthyBinsCount, desc: 'Volume level below 50%', color: 'border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' },
                  { label: 'Near-Capacity Bins', count: nearCapacityBinsCount, desc: 'Volume between 50%-80%', color: 'border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-400' },
                  { label: 'Critical Overflows', count: overflowBinsCount, desc: 'Volume exceeding 80%', color: 'border-rose-500/25 bg-rose-500/5 text-rose-600 dark:text-rose-400 animate-pulse' },
                  { label: 'Degraded Nodes', count: offlineBinsCount, desc: 'Offline or low battery sensors', color: 'border-slate-500/25 bg-slate-500/5 text-slate-600 dark:text-slate-400' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-4 border rounded-2xl flex flex-col justify-between ${stat.color}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider block">{stat.label}</span>
                      <span className="text-2xl font-black font-mono leading-none block">{stat.count}</span>
                    </div>
                    <span className="text-[9px] block opacity-80 mt-2">{stat.desc}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                <span className="text-[10px] font-bold text-slate-500 block uppercase font-mono tracking-wider mb-2">Sensor Battery Maintenance Log</span>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700 dark:text-slate-300">SB-103 Transceiver Node</span>
                  <span className="text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 text-[9px]">12% Critical</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================
              5. Recent Activity Feed & Sustainability Metrics (Bottom Row)
              ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Recent Activity Feed */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Real-time Municipal Activity Stream</h3>
                <span className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded font-bold uppercase animate-pulse shrink-0">
                  Realtime Active
                </span>
              </div>

              <div className="space-y-3.5 max-h-[310px] overflow-y-auto">
                {activityFeed.map(act => (
                  <div key={act.id} className="flex items-start space-x-3 text-xs border-b border-slate-50 dark:border-slate-850 pb-3 last:border-0 last:pb-0">
                    <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      {act.type === 'citizen_report' ? '👤' : act.type === 'bin_alert' ? '🚨' : act.type === 'worker_task' ? '👷' : '⚙️'}
                    </div>
                    <div className="flex-grow space-y-0.5 text-left">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{act.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{act.desc}</p>
                      <div className="flex items-center space-x-1.5 pt-0.5">
                        <span className="text-[9px] font-mono text-slate-400">By {act.user}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${act.badgeColor}`}>
                          {act.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sustainability Metrics / ESG Scorecard */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Sustainability & ESG Core Indicators</h3>
                <p className="text-xs text-slate-400">Municipal performance matched against target guidelines of the UN Climate Compact.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">CO₂ REDUCTION OFFSET</span>
                    <span className="text-emerald-500 font-bold">96% of target</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">LANDFILL DIVERSION</span>
                    <span className="text-emerald-500 font-bold">74.2% completed</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '74.2%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">FLEET DECARBONIZATION</span>
                    <span className="text-cyan-400 font-bold">100% EV target</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">COMMUNITY SCORECARD</span>
                    <span className="text-emerald-500 font-bold">A+ Rating</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

              </div>

              {/* Graphical representation of Monthly Recycling Trends */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-2">Weekly Carbon preservation progression (kg)</span>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyCarbonData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                      <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip />
                      <Area type="monotone" dataKey="CO2_Saved" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
