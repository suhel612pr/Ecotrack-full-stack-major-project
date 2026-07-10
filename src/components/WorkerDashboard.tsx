import React from 'react';
import { motion } from 'motion/react';
import { WorkerTask } from '../types';
import { 
  Truck, Zap, Navigation, Clock, Bell, AlertOctagon, 
  Battery, Activity, ShieldCheck, ClipboardList, CheckCircle 
} from 'lucide-react';

interface WorkerDashboardProps {
  tasks: WorkerTask[];
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'qr-scan' | 'route') => void;
}

export default function WorkerDashboard({ tasks, onNavigateTab }: WorkerDashboardProps) {
  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;

  // Mock Emergency Alerts
  const emergencyAlerts = [
    { id: 'ea-1', severity: 'Critical', message: 'Chemical spill reported near Depot Block C. Deploy HazMat suits before clearing.', date: '10 mins ago' },
    { id: 'ea-2', severity: 'Traffic', message: 'Main St bridge closed for electric grid repairs. Route navigation recalculated.', date: '1 hour ago' }
  ];

  // Mock Crew notifications
  const crewNotifications = [
    { id: 'n-1', sender: 'Supervisor Reynolds', message: 'Priority upgrade on Stop #2. Please complete before noon.', time: '09:45 AM' },
    { id: 'n-2', sender: 'Fleet Telemetry', message: 'Battery warning. Charging recommended after route stop #3.', time: '08:30 AM' }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Grid: Stats HUD and Active Vehicle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Vehicle & Shift Details (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-400">
                <Truck className="h-5 w-5 animate-pulse" />
                <span className="text-xs font-bold font-mono tracking-widest uppercase">CREW VEHICLE & SHIFT HUD</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold">
                ON-DUTY (SHIFT ACTIVE)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[9px] text-slate-400 font-mono">ASSIGNED TRUCK</span>
                <span className="block text-sm font-extrabold text-slate-100">EV-TRUCK-14</span>
                <span className="block text-[10px] text-slate-500">MACK LR Electric (8.5 Tons)</span>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[9px] text-slate-400 font-mono font-bold flex items-center gap-1">
                  <Battery className="h-3.5 w-3.5 text-emerald-400" /> BATTERY TELEMETRY
                </span>
                <span className="block text-sm font-extrabold text-slate-100 font-mono">92% Charged</span>
                <span className="block text-[10px] text-emerald-400">Est. range: 180 mi (Optimal)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 text-[10px] font-mono text-slate-400">
            <div>
              <span className="block text-slate-500">SHIFT SCHEDULE</span>
              <span className="text-slate-200 font-bold">07:00 AM - 03:00 PM (8 hrs)</span>
            </div>
            <div className="text-right">
              <span className="block text-slate-500">COMMUNICATION segment</span>
              <span className="text-slate-200 font-bold">CHANNEL 4-B SANITATION</span>
            </div>
          </div>
        </div>

        {/* Collection stats cards (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">ROUTE SEGMENT</span>
            <div>
              <span className="block text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">{completedCount}/{totalCount}</span>
              <span className="block text-[10px] text-slate-500 font-mono mt-1">Stops Cleared</span>
            </div>
            <button 
              onClick={() => onNavigateTab('tasks')}
              className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:underline mt-2 text-left"
            >
              Go to Stops →
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">EMERGENCY ASSISTS</span>
            <div>
              <span className="block text-3xl font-black text-rose-500 font-mono">{emergencyAlerts.length}</span>
              <span className="block text-[10px] text-slate-500 font-mono mt-1">Hazardous incidents</span>
            </div>
            <span className="text-[9px] text-rose-500 font-mono mt-2 block font-semibold">HELMET REQUIRED</span>
          </div>
        </div>

      </div>

      {/* Grid: Emergency Alerts & Crew Notification Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Emergency Alert HUD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-2">
            <AlertOctagon className="h-5 w-5 text-rose-500 animate-bounce" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Dispatch Warnings</h4>
              <p className="text-[10px] text-slate-400">Realtime municipal road and chemical safety warnings</p>
            </div>
          </div>

          <div className="space-y-3">
            {emergencyAlerts.map(alert => (
              <div key={alert.id} className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-rose-600">
                  <span>● {alert.severity} WARNING</span>
                  <span className="text-[10px] text-slate-400 font-normal">{alert.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Crew Dispatch Channel Notifications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-2">
            <Bell className="h-5 w-5 text-emerald-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Supervisor Dispatch Channel</h4>
              <p className="text-[10px] text-slate-400">Direct directives issued from municipal operations HQ</p>
            </div>
          </div>

          <div className="space-y-3">
            {crewNotifications.map(notif => (
              <div key={notif.id} className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                  <span>{notif.sender}</span>
                  <span className="text-[10px] font-mono text-slate-400">{notif.time}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
