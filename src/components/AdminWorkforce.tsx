import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkerTask } from '../types';
import { 
  Users, UserCheck, Shield, Clock, TrendingUp, ChevronRight, 
  RefreshCw, CheckCircle, AlertCircle, MapPin, Star, Truck 
} from 'lucide-react';

interface AdminWorkforceProps {
  tasks: WorkerTask[];
  onReassignTask?: (taskId: string, workerId: string) => void;
}

export default function AdminWorkforce({ tasks, onReassignTask }: AdminWorkforceProps) {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-1');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const workers = [
    { 
      id: 'worker-1', 
      name: 'Marcus Vance', 
      role: 'Senior Waste Specialist', 
      vehicle: 'EV-TRUCK-14', 
      status: 'active', // active, standby, break, off
      avatar: 'MV',
      color: 'bg-emerald-500',
      sla: '98.5%',
      avgResponse: '14.2 mins',
      phone: '(415) 555-0142'
    },
    { 
      id: 'worker-2', 
      name: 'Sarah Jenkins', 
      role: 'IoT Field Technician', 
      vehicle: 'EV-TRUCK-11', 
      status: 'active', 
      avatar: 'SJ',
      color: 'bg-cyan-500',
      sla: '95.8%',
      avgResponse: '16.8 mins',
      phone: '(415) 555-0111'
    },
    { 
      id: 'worker-3', 
      name: 'Dave Miller', 
      role: 'Heavy Debris Operator', 
      vehicle: 'EV-TRUCK-05', 
      status: 'standby', 
      avatar: 'DM',
      color: 'bg-amber-500',
      sla: '92.1%',
      avgResponse: '22.5 mins',
      phone: '(415) 555-0105'
    },
    { 
      id: 'worker-4', 
      name: 'Alex Patel', 
      role: 'Hazardous Waste Handler', 
      vehicle: 'EV-TRUCK-09', 
      status: 'break', 
      avatar: 'AP',
      color: 'bg-rose-500',
      sla: '99.1%',
      avgResponse: '11.4 mins',
      phone: '(415) 555-0109'
    }
  ];

  const handleSyncWorkers = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Sanitation crew GPS coordinates and check-in times synchronized.');
    }, 1000);
  };

  const selectedWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  // Helper tasks count
  const workerTasksCount = (workerId: string) => {
    // In our simplified mock system, tasks are linked to workers or reports
    // For worker-1, associate tasks on EV-TRUCK-14
    if (workerId === 'worker-1') {
      return tasks.filter(t => t.binId === 'bin-104' || t.title.includes('SB-104') || t.status === 'completed').length;
    }
    if (workerId === 'worker-2') {
      return tasks.filter(t => t.reportId === 'rep-502' || t.title.includes('SB-102') || t.status === 'in-progress').length;
    }
    if (workerId === 'worker-3') {
      return tasks.filter(t => t.priority === 'low').length || 1;
    }
    return tasks.filter(t => t.type === 'hazardous-spill').length;
  };

  const getWorkerTasksList = (workerId: string) => {
    if (workerId === 'worker-1') {
      return tasks.filter(t => t.status === 'completed' || t.title.includes('SB-104'));
    }
    if (workerId === 'worker-2') {
      return tasks.filter(t => t.status === 'in-progress' || t.title.includes('SB-102') || t.reportId === 'rep-502');
    }
    return tasks.filter(t => t.id === 'task-002');
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in" id="workforce-root">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/40 dark:border-zinc-800/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Users className="h-5 w-5 mr-1.5 text-blue-500" /> Crew & Workforce Operations
          </h3>
          <p className="text-xs text-slate-500">Track on-duty municipal workers, monitor SLA response times, and assign or reassign field tasks.</p>
        </div>

        <button
          onClick={handleSyncWorkers}
          disabled={isSyncing}
          className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold transition flex items-center space-x-1.5"
          id="sync-workforce-btn"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Locating Crews...' : 'Sync Fleet Coordinates'}</span>
        </button>
      </div>

      {/* Workforce HUD Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="workforce-hud">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/10 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-mono uppercase block">Active Workers</span>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">
              {workers.filter(w => w.status === 'active').length} On Duty
            </span>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">2 Standby Crew Units</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 rounded-xl">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-mono uppercase block">Shift Task completion</span>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">
              {tasks.filter(t => t.status === 'completed').length} / {tasks.length} Resolved
            </span>
            <span className="text-[9px] text-cyan-400 font-bold block mt-0.5">
              {(tasks.filter(t => t.status === 'completed').length / tasks.length * 100).toFixed(0)}% Shift SLA rate
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/10 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-mono uppercase block">Avg. Response Time</span>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">14.8 mins</span>
            <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">-2.4 mins vs Q2 Target</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/10 rounded-xl">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-mono uppercase block">Average Safety Rating</span>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight block">98.4% Index</span>
            <span className="text-[9px] text-indigo-500 font-bold block mt-0.5">Perfect Safety Record</span>
          </div>
        </div>

      </div>

      {/* Main Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="workforce-workspace">
        
        {/* Left Column: Workers List (5-cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Sanitation Crews</h4>
            
            <input 
              type="text"
              placeholder="Search crew name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-1 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[150px]"
            />
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto">
            {filteredWorkers.map(w => {
              const taskCount = workerTasksCount(w.id);
              const isSelected = selectedWorkerId === w.id;

              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWorkerId(w.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-blue-500/5 border-blue-500/30 shadow-sm' 
                      : 'bg-slate-50/50 dark:bg-slate-950/10 border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`h-10 w-10 rounded-full ${w.color} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                      {w.avatar}
                    </div>
                    <div className="truncate">
                      <span className="font-extrabold text-xs text-slate-850 dark:text-slate-150 block">{w.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{w.role}</span>
                      <span className="text-[9px] text-slate-500 block font-mono mt-0.5">{w.vehicle}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end justify-between h-10">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase font-mono ${
                      w.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : w.status === 'standby'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      {w.status}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 mt-2 block">
                      {taskCount} {taskCount === 1 ? 'task' : 'tasks'} active
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Workspace & Task Assignment (7-cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Header: Selected Worker Card */}
            <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className={`h-12 w-12 rounded-2xl ${selectedWorker.color} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                  {selectedWorker.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedWorker.name}</h5>
                    <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[8px] font-mono uppercase font-semibold">
                      ID: {selectedWorker.id}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{selectedWorker.role}</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">Vehicle: {selectedWorker.vehicle} | Contact: {selectedWorker.phone}</span>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs border-t sm:border-t-0 sm:border-l border-slate-200/60 dark:border-slate-800/60 pt-3 sm:pt-0 sm:pl-4 min-w-[120px]">
                <div className="p-1.5 bg-slate-100/50 dark:bg-slate-950/30 rounded-lg">
                  <span className="text-[8px] text-slate-400 uppercase font-mono block">SLA</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedWorker.sla}</span>
                </div>
                <div className="p-1.5 bg-slate-100/50 dark:bg-slate-950/30 rounded-lg">
                  <span className="text-[8px] text-slate-400 uppercase font-mono block">RESP</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedWorker.avgResponse}</span>
                </div>
              </div>
            </div>

            {/* Tasks list */}
            <div className="space-y-3">
              <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                CURRENT SHIFT DISPATCHED STOPS
              </span>

              {getWorkerTasksList(selectedWorker.id).length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <span className="text-2xl block mb-2">🎉</span>
                  <h6 className="font-bold text-slate-800 dark:text-slate-200 text-xs">No active route stops</h6>
                  <p className="text-[10px] text-slate-400 mt-0.5">This crew member has finalized all scheduled task sectors.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getWorkerTasksList(selectedWorker.id).map(task => (
                    <div 
                      key={task.id}
                      className="p-3.5 bg-slate-50/50 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850/60 rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 px-1 py-0.5 rounded">
                            {task.id}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{task.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{task.description}</p>
                        
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono pt-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{task.location}</span>
                          <span>•</span>
                          <span className={`font-semibold capitalize ${
                            task.priority === 'high' ? 'text-rose-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                          }`}>{task.priority} Priority</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                          task.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25' 
                            : task.status === 'in-progress'
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/25 animate-pulse'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                        }`}>
                          {task.status}
                        </span>

                        {/* Task Reassign Selector */}
                        {task.status !== 'completed' && (
                          <div className="flex items-center space-x-1">
                            <span className="text-[9px] text-slate-400 font-mono">Reassign:</span>
                            <select
                              onChange={(e) => {
                                const targetWorkerId = e.target.value;
                                if (confirm(`Confirm task re-dispatch: Are you sure you want to reassign ${task.id} to ${workers.find(w => w.id === targetWorkerId)?.name}?`)) {
                                  if (onReassignTask) {
                                    onReassignTask(task.id, targetWorkerId);
                                  } else {
                                    alert(`Task ${task.id} has been re-dispatched to ${workers.find(w => w.id === targetWorkerId)?.name} (Truck ${workers.find(w => w.id === targetWorkerId)?.vehicle}) successfully.`);
                                  }
                                }
                                e.target.value = ''; // reset
                              }}
                              className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[9px] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Choose...</option>
                              {workers.filter(w => w.id !== selectedWorker.id).map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>SHIFT TIME LEFT: 4h 15m</span>
            <span className="text-blue-500 font-bold">ALL CREWS CONSTANTLY AUDITED BY CENTRAL SLAS</span>
          </div>

        </div>

      </div>

    </div>
  );
}
