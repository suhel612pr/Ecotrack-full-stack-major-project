import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkerTask, SmartBin } from '../types';
import WorkerDashboard from '../components/WorkerDashboard';
import WorkerTasks from '../components/WorkerTasks';
import WorkerQRScanner from '../components/WorkerQRScanner';
import { 
  Truck, MapPin, CheckCircle2, ShieldAlert, Navigation, 
  Zap, Compass, AlertTriangle, Play, Check, QrCode, 
  Activity, ClipboardList, Home 
} from 'lucide-react';

interface WorkerPortalProps {
  tasks: WorkerTask[];
  onCompleteTask: (taskId: string) => void;
  bins: SmartBin[];
  activeTab?: 'dashboard' | 'tasks' | 'qr-scan' | 'route';
  onTabChange?: (tab: 'dashboard' | 'tasks' | 'qr-scan' | 'route') => void;
}

export default function WorkerPortal({ 
  tasks, onCompleteTask, bins,
  activeTab: propActiveTab, onTabChange: propOnTabChange
}: WorkerPortalProps) {
  const [internalTab, setInternalTab] = useState<'dashboard' | 'tasks' | 'qr-scan' | 'route'>('dashboard');
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = (tab: any) => {
    if (propOnTabChange) {
      propOnTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const handleCompleteBinCollection = (binId: string) => {
    // Find the task matching this bin if exists
    const matchingTask = tasks.find(t => t.binId === binId && t.status !== 'completed');
    if (matchingTask) {
      onCompleteTask(matchingTask.id);
    } else {
      // If no task, we can empty it directly on backend/compatibility level
      alert(`Smart Bin ${binId} successfully cleared and logged.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Subnavigation Headers */}
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/60 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-6 min-w-[500px] sm:min-w-0 pb-px">
          {[
            { id: 'dashboard', label: 'Crew Dashboard', icon: <Home className="h-3.5 w-3.5" /> },
            { id: 'tasks', label: 'Task Stop Sheet', icon: <ClipboardList className="h-3.5 w-3.5" /> },
            { id: 'qr-scan', label: 'QR Tag Scanner', icon: <QrCode className="h-3.5 w-3.5" /> },
            { id: 'route', label: 'Live GPS HUD', icon: <Navigation className="h-3.5 w-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-3 text-[11px] font-medium tracking-tight border-b-2 transition-all duration-200 focus:outline-none ${
                activeTab === tab.id
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-950 dark:text-zinc-50 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dynamic Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && (
            <WorkerDashboard 
              tasks={tasks} 
              onNavigateTab={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === 'tasks' && (
            <WorkerTasks 
              tasks={tasks} 
              onCompleteTask={onCompleteTask} 
            />
          )}

          {activeTab === 'qr-scan' && (
            <WorkerQRScanner 
              bins={bins} 
              onCompleteBinCollection={handleCompleteBinCollection} 
            />
          )}

          {activeTab === 'route' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
              
              {/* Route instructions (7 cols) */}
              <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Active Hamiltonian GPS Path</h3>
                    <p className="text-xs text-slate-400">Optimal segment sequence mapping all critical sensors with minimum carbon burn.</p>
                  </div>
                  <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/15 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                    GPS TRACKING ACTIVE
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Instructions timeline */}
                  <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800 ml-3 space-y-5 py-2">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-4.5 w-4.5 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-[9px]">
                        1
                      </div>
                      <div className="text-xs">
                        <h5 className="font-bold text-slate-800 dark:text-slate-200">Start Sector segment - Depot Block A</h5>
                        <p className="text-slate-500 text-[11px]">Deploy EV-Truck-14, zero battery cell fault detected.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-4.5 w-4.5 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-[9px]">
                        2
                      </div>
                      <div className="text-xs">
                        <h5 className="font-bold text-slate-800 dark:text-slate-200">Turn left onto Civic Center Trail (SB-104)</h5>
                        <p className="text-slate-500 text-[11px]">Smart Bin SB-104 has filled to 92% capacity. Empty sensor.</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-4.5 w-4.5 rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 flex items-center justify-center font-bold text-[9px]">
                        3
                      </div>
                      <div className="text-xs">
                        <h5 className="font-bold text-slate-400">Continue down Golden Gate Ave & Hyde St</h5>
                        <p className="text-slate-500 text-[11px]">Clear citizen debris dump reported by supervisor dispatch.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tesla GPS style panel (5 cols) */}
              <div className="md:col-span-5 bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-wider font-bold">ROUTE GPS CO-PILOT</span>
                    <Compass className="h-5 w-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-4">
                    <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-full shrink-0">
                      <Navigation className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-mono uppercase">CURRENT GPS HEADING</span>
                      <h5 className="font-bold text-sm text-slate-200">Approach Civic Park South</h5>
                      <span className="text-cyan-400 font-mono text-[10px]">0.3 miles to next target</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                    <div className="flex justify-between">
                      <span>Total segment length:</span>
                      <span className="text-slate-200">4.2 mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hamiltonian optimization:</span>
                      <span className="text-green-400">-1.8 mi (-30%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900 mt-6 text-center text-[10px] text-slate-500 font-mono">
                  REALTIME GPS TELEMETRY LINKED TO GIS PORTALS
                </div>
              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
