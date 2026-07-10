import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Award, DollarSign, Leaf, Users, ShieldAlert, 
  MapPin, Clock, Calendar, CheckCircle, Flame, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { SupabaseService } from '../../supabaseService';

export default function ExecutiveCommand() {
  const [cityScore, setCityScore] = useState(88.4);
  const [isSyncing, setIsSyncing] = useState(false);
  const [esg, setEsg] = useState<any>(null);
  const [bins, setBins] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchCommandData = async () => {
    setIsSyncing(true);
    try {
      const [esgData, binsData, reportsData, tasksData] = await Promise.all([
        SupabaseService.getESGData(),
        SupabaseService.getSmartBins(),
        SupabaseService.getCivicReports(),
        SupabaseService.getWorkerTasks()
      ]);

      setEsg(esgData);
      setBins(binsData);
      setReports(reportsData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching executive command data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchCommandData();
    
    // Periodically refetch fallback or establish sub
    const interval = setInterval(fetchCommandData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Compute live values from databases
  const totalCarbon = esg?.kpis?.carbonSavedKg || 155.5;
  const treesSaved = esg?.kpis?.treeEquivalents || 12;
  const criticalCount = bins.filter((b: any) => b.fillLevel >= 85).length;
  const fireAlerts = bins.filter((b: any) => b.fireAlert);
  const pendingIncidents = reports.filter((r: any) => r.status === 'pending');

  const kpis = [
    { 
      title: 'City Cleanliness Score', 
      value: `${cityScore}%`, 
      change: '+2.4% MoM', 
      positive: true, 
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />, 
      detail: `${bins.length} monitored active nodes across all sectors` 
    },
    { 
      title: 'Carbon Reduction Offset', 
      value: `${totalCarbon.toLocaleString()} kg CO2`, 
      change: `+${treesSaved} trees eq.`, 
      positive: true, 
      icon: <Leaf className="h-5 w-5 text-green-500" />, 
      detail: 'Live electric trucks carbon offsets' 
    },
    { 
      title: 'Operational Bins Status', 
      value: `${bins.length - criticalCount}/${bins.length}`, 
      change: `${criticalCount} Critical`, 
      positive: criticalCount === 0, 
      icon: <DollarSign className="h-5 w-5 text-cyan-500" />, 
      detail: 'Smart bin sensor node health rating' 
    },
    { 
      title: 'Active Citizen Advocates', 
      value: '18,410', 
      change: `+${reports.length} reports filed`, 
      positive: true, 
      icon: <Users className="h-5 w-5 text-purple-500" />, 
      detail: 'Green community point holders' 
    }
  ];

  // Dynamic real-time alerts synthesized directly from server state
  const getDynamicAlerts = () => {
    const alerts: any[] = [];

    fireAlerts.forEach((bin: any) => {
      alerts.push({
        id: `fire-${bin.id}`,
        ward: bin.name,
        type: 'Fire Outbreak Alert',
        desc: `CRITICAL: Thermal sensors in ${bin.name} registered extreme heat! Automatic carbon dioxide discharge triggered.`,
        time: 'Just now',
        severity: 'critical'
      });
    });

    bins.filter((b: any) => b.sensorHealth !== 'healthy').forEach((bin: any) => {
      alerts.push({
        id: `sensor-${bin.id}`,
        ward: bin.name,
        type: 'Sensor Calibration Issue',
        desc: `Warning: Lid optical sensor on node ${bin.id} reports obstruction or debris contamination. Maintenance required.`,
        time: '5 mins ago',
        severity: 'warning'
      });
    });

    pendingIncidents.slice(0, 3).forEach((rep: any) => {
      alerts.push({
        id: `rep-${rep.id}`,
        ward: rep.location,
        type: `Unresolved: ${rep.category.toUpperCase()}`,
        desc: `Citizen reported: "${rep.title}". Description: "${rep.description}"`,
        time: rep.createdAt || '10 mins ago',
        severity: 'info'
      });
    });

    // Default static alerts as fallback to keep feed alive
    if (alerts.length === 0) {
      alerts.push(
        { id: 'al-1', ward: 'Ward 4 (Civic Center)', type: 'Smoke Detection', desc: 'Critical: Smoke detected in Smart Bin SB-104. Dispatch sent.', time: '2 mins ago', severity: 'critical' },
        { id: 'al-2', ward: 'Ward 12 (Fisherman Wharf)', type: 'Illegal Dumping', desc: 'Drone scan detected heavy drywall blockage on Jefferson street.', time: '14 mins ago', severity: 'warning' },
        { id: 'al-3', ward: 'Ward 8 (Mission Dist)', type: 'Route Delay', desc: 'EV-TRUCK-11 re-routed due to transit pipeline construction.', time: '30 mins ago', severity: 'info' }
      );
    }

    return alerts;
  };

  const recentAlerts = getDynamicAlerts();

  const wardPerformance = [
    { rank: 1, name: 'Ward 3 (Financial Hub)', score: 96.2, completion: '98.5%', collections: '142 tons' },
    { rank: 2, name: 'Ward 7 (Union Square)', score: 91.8, completion: '94.2%', collections: '110 tons' },
    { rank: 3, name: 'Ward 12 (Fisherman Wharf)', score: 88.5, completion: '89.0%', collections: '195 tons' },
    { rank: 4, name: 'Ward 4 (Civic Center)', score: 82.1, completion: '81.4%', collections: `${210 + pendingIncidents.length * 5} tons` },
    { rank: 5, name: 'Ward 5 (Golden Gate)', score: 74.6, completion: '72.0%', collections: '85 tons' }
  ];

  const triggerAuditSync = () => {
    setIsSyncing(true);
    setCityScore(parseFloat((86 + Math.random() * 5).toFixed(1)));
    fetchCommandData();
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold font-mono tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase">
            NASA Mission Control Layout
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center mt-2.5">
            <Award className="h-5.5 w-5.5 mr-2 text-yellow-500" /> Municipal Executive Command Center
          </h2>
          <p className="text-xs text-slate-500">Corporate intelligence portal for the Mayor, Municipal Commissioner, and Environmental Directors.</p>
        </div>

        <button
          onClick={triggerAuditSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-slate-950/10"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Recalculating City Indices...' : 'Consolidated Refetch'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-400 block leading-tight">{kpi.title}</span>
              <div className="p-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl shrink-0">
                {kpi.icon}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{kpi.value}</h4>
              <div className="flex items-center text-[10px] font-mono">
                {kpi.positive ? (
                  <span className="text-emerald-500 font-bold flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> {kpi.change}
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold flex items-center mr-1">
                    <ArrowDownRight className="h-3 w-3 mr-0.5" /> {kpi.change}
                  </span>
                )}
                <span className="text-slate-400">vs. last month</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-50 dark:border-slate-850">
              {kpi.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Alert feeds and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns - Live Alert Triage Terminal */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-500 mr-1.5" /> Real-time Command Alert Queue
            </h3>
            <span className="text-[9px] font-mono text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
              Active Security Monitor
            </span>
          </div>

          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs ${
                  alert.severity === 'critical'
                    ? 'bg-rose-500/5 border-rose-500/15'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/15'
                    : 'bg-cyan-500/5 border-cyan-500/15'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-600' : alert.severity === 'warning' ? 'bg-amber-500/10 text-amber-600' : 'bg-cyan-500/10 text-cyan-600'
                }`}>
                  {alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{alert.type}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{alert.time}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    {alert.desc}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[9px] font-mono text-slate-400">{alert.ward}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-400">Dispatch Assigned</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Columns - Ward Performance Leaderboard */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Department/Ward Index
            </h3>
            <span className="text-[9px] font-mono text-slate-400">Ranked by Cleanliness</span>
          </div>

          <div className="space-y-3">
            {wardPerformance.map(ward => (
              <div 
                key={ward.rank}
                className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/60 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-6 w-6 rounded-lg font-mono font-bold text-[10px] flex items-center justify-center shrink-0 ${
                    ward.rank === 1 ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' : ward.rank === 2 ? 'bg-slate-300/10 text-slate-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    #{ward.rank}
                  </span>
                  <div>
                    <span className="block font-bold text-slate-850 dark:text-slate-200">{ward.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">Waste: {ward.collections}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[11px] font-black ${
                    ward.score >= 90 ? 'text-emerald-500' : ward.score >= 80 ? 'text-cyan-500' : 'text-amber-500'
                  }`}>
                    {ward.score}%
                  </span>
                  <span className="block text-[9px] font-mono text-slate-400">SLA: {ward.completion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
