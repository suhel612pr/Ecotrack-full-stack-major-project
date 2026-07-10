import React, { useState, useEffect } from 'react';
import { SmartBin, CivicReport, WorkerTask, WasteCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, ClipboardList, ShieldCheck, UserCheck, 
  Flame, Plus, Play, Trash, Send, CheckCircle2, RefreshCw,
  Truck, ShieldAlert, Activity, Navigation, Settings, LayoutDashboard,
  Search, Filter, MapPin, Clock, Eye, AlertCircle, ArrowUpRight
} from 'lucide-react';
import AdminBins from '../components/AdminBins';
import AdminFleet from '../components/AdminFleet';
import AdminRBAC from '../components/AdminRBAC';
import AdminAnalytics from '../components/AdminAnalytics';
import CityHeatmap from '../components/CityHeatmap';
import SystemHealth from '../components/SystemHealth';
import AdminEnterprise from '../components/AdminEnterprise';
import EnterpriseOverview from '../components/EnterpriseOverview';
import AdminWorkforce from '../components/AdminWorkforce';

interface AdminPortalProps {
  bins: SmartBin[];
  reports: CivicReport[];
  tasks: WorkerTask[];
  onDispatchReport: (reportId: string, workerId: string, priority: 'low' | 'medium' | 'high') => void;
  onDismissReport: (reportId: string) => void;
  onAddBin: (bin: any) => void;
  onDeleteBin: (binId: string) => void;
  activeSubTab?: 'dashboard' | 'dispatch' | 'bins' | 'fleet' | 'workforce' | 'rbac' | 'analytics' | 'heatmap' | 'health' | 'enterprise';
  onSubTabChange?: (tab: 'dashboard' | 'dispatch' | 'bins' | 'fleet' | 'workforce' | 'rbac' | 'analytics' | 'heatmap' | 'health' | 'enterprise') => void;
}

export default function AdminPortal({ 
  bins, reports, tasks, onDispatchReport, onDismissReport, onAddBin, onDeleteBin,
  activeSubTab: propActiveSubTab, onSubTabChange: propOnSubTabChange
}: AdminPortalProps) {
  const [internalSubTab, setInternalSubTab] = useState<'dashboard' | 'dispatch' | 'bins' | 'fleet' | 'workforce' | 'rbac' | 'analytics' | 'heatmap' | 'health' | 'enterprise'>('dashboard');
  const activeSubTab = propActiveSubTab !== undefined ? propActiveSubTab : internalSubTab;
  const setActiveSubTab = (tab: any) => {
    if (propOnSubTabChange) {
      propOnSubTabChange(tab);
    } else {
      setInternalSubTab(tab);
    }
  };

  // State for Incident Command Center Workspace
  const [incidentSearch, setIncidentSearch] = useState('');
  const [incidentStatusFilter, setIncidentStatusFilter] = useState<'all' | 'pending' | 'dispatched' | 'completed'>('all');
  const [incidentPriorityFilter, setIncidentPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [incidentCategoryFilter, setIncidentCategoryFilter] = useState<'all' | WasteCategory>('all');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Dispatch variables
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-1');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  // Local state for Incident lists (allowing mock priority toggles and resolution states for premium UI)
  const [localReports, setLocalReports] = useState<CivicReport[]>([]);

  // Synchronize local reports state when prop updates
  useEffect(() => {
    setLocalReports(reports);
    if (reports.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(reports[0].id);
    }
  }, [reports]);

  // Handle local status / priority changes
  const handleDispatch = (reportId: string) => {
    onDispatchReport(reportId, selectedWorkerId, selectedPriority);
    setDispatchedId(reportId);
    setTimeout(() => setDispatchedId(null), 3000);
    
    // Update local state for instant feedback
    setLocalReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: 'dispatched',
          assignedWorkerId: selectedWorkerId
        };
      }
      return rep;
    }));
  };

  const handleEscalatePriority = (reportId: string) => {
    setLocalReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        const nextPriority = selectedPriority === 'high' ? 'low' : selectedPriority === 'low' ? 'medium' : 'high';
        setSelectedPriority(nextPriority as any);
        alert(`Incident ${reportId} priority escalated to: ${nextPriority.toUpperCase()}`);
        return {
          ...rep,
          greenPoints: rep.greenPoints + 15
        };
      }
      return rep;
    }));
  };

  const handleMarkResolved = (reportId: string) => {
    setLocalReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: 'completed'
        };
      }
      return rep;
    }));
    alert(`Incident ${reportId} status updated to RESOLVED. Civic credits dispersed.`);
  };

  const handleReassignWorker = (reportId: string, workerId: string) => {
    setLocalReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          assignedWorkerId: workerId
        };
      }
      return rep;
    }));
    alert(`Incident reassigned to Crew Unit on vehicle ${workerId === 'worker-1' ? 'EV-TRUCK-14' : 'EV-TRUCK-11'}.`);
  };

  // Filtered reports
  const filteredReports = localReports.filter(rep => {
    const matchesSearch = rep.title.toLowerCase().includes(incidentSearch.toLowerCase()) || 
                          rep.description.toLowerCase().includes(incidentSearch.toLowerCase()) ||
                          rep.location.toLowerCase().includes(incidentSearch.toLowerCase());
    const matchesStatus = incidentStatusFilter === 'all' || rep.status === incidentStatusFilter;
    const matchesCategory = incidentCategoryFilter === 'all' || rep.category === incidentCategoryFilter;
    
    // Check priority: simulated or match task details
    const task = tasks.find(t => t.reportId === rep.id);
    const repPriority = task ? task.priority : 'medium';
    const matchesPriority = incidentPriorityFilter === 'all' || repPriority === incidentPriorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const selectedIncident = localReports.find(r => r.id === selectedIncidentId) || filteredReports[0];

  const getWorkerName = (id?: string) => {
    if (id === 'worker-1') return 'Marcus Vance (Truck EV-14)';
    if (id === 'worker-2') return 'Sarah Jenkins (Truck EV-11)';
    if (id === 'worker-3') return 'Dave Miller (Sanitation Crew 4)';
    return 'Unassigned';
  };

  return (
    <div className="space-y-6 text-left" id="admin-portal-root">
      
      {/* 10-Subtabs Navigation Panel with Horizontal Scroll */}
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/60 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-6 min-w-[750px] sm:min-w-0 pb-px">
          {[
            { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="h-3.5 w-3.5 text-indigo-500" /> },
            { id: 'dispatch', label: 'Incident Command', icon: <ClipboardList className="h-3.5 w-3.5 text-orange-500" /> },
            { id: 'bins', label: 'Smart Bin IoT', icon: <Settings className="h-3.5 w-3.5 text-zinc-500" /> },
            { id: 'fleet', label: 'Fleet Operations', icon: <Truck className="h-3.5 w-3.5 text-cyan-500" /> },
            { id: 'workforce', label: 'Workforce Hub', icon: <Users className="h-3.5 w-3.5 text-blue-500" /> },
            { id: 'rbac', label: 'RBAC Profiles', icon: <ShieldCheck className="h-3.5 w-3.5 text-purple-500" /> },
            { id: 'analytics', label: 'Analytics Insights', icon: <BarChart3 className="h-3.5 w-3.5 text-pink-500" /> },
            { id: 'heatmap', label: 'City Heatmaps', icon: <Flame className="h-3.5 w-3.5 text-rose-500 animate-pulse" /> },
            { id: 'health', label: 'System Health', icon: <Activity className="h-3.5 w-3.5 text-emerald-500" /> },
            { id: 'enterprise', label: 'Enterprise Suite', icon: <ShieldAlert className="h-3.5 w-3.5 text-teal-500" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 py-3 text-[11px] font-medium tracking-tight border-b-2 transition-all duration-200 focus:outline-none ${
                activeSubTab === tab.id
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

      {/* Main Dynamic Stages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.15 }}
        >
          {activeSubTab === 'dashboard' && (
            <EnterpriseOverview 
              bins={bins}
              reports={reports}
              tasks={tasks}
              onDispatchReport={onDispatchReport}
              onDismissReport={onDismissReport}
              onTabChange={setActiveSubTab}
            />
          )}

          {/* Redesigned Premium Incident Command Center */}
          {activeSubTab === 'dispatch' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="incident-command-workspace">
              
              {/* Left Column: Filterable Incident List (5-cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
                
                {/* Search & Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center">
                      <ShieldAlert className="h-4.5 w-4.5 text-orange-500 mr-1.5" /> Incident Dispatch Panel
                    </h4>
                    <span className="text-[10px] font-mono bg-orange-500/10 text-orange-600 border border-orange-500/20 px-2 py-0.5 rounded font-bold uppercase">
                      {filteredReports.length} Incidents
                    </span>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search incident title or sector..."
                      value={incidentSearch}
                      onChange={e => setIncidentSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Multiple filters */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <div>
                    <select
                      value={incidentStatusFilter}
                      onChange={e => setIncidentStatusFilter(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={incidentPriorityFilter}
                      onChange={e => setIncidentPriorityFilter(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={incidentCategoryFilter}
                      onChange={e => setIncidentCategoryFilter(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      <option value="all">All Types</option>
                      <option value="recyclable">Recyclable</option>
                      <option value="organic">Organic</option>
                      <option value="landfill">Landfill</option>
                      <option value="hazardous">Hazardous</option>
                    </select>
                  </div>
                </div>

                {/* Vertical Scrollable List */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                  {filteredReports.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      <span className="text-2xl block mb-2">🎉</span>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">No matching incidents</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Adjust filter settings to find historical tickets.</p>
                    </div>
                  ) : (
                    filteredReports.map(rep => {
                      const isSelected = selectedIncidentId === rep.id;
                      const isPending = rep.status === 'pending';
                      const isDispatched = rep.status === 'dispatched';
                      
                      return (
                        <div
                          key={rep.id}
                          onClick={() => setSelectedIncidentId(rep.id)}
                          className={`p-3.5 border rounded-2xl cursor-pointer text-left transition flex flex-col justify-between space-y-2 ${
                            isSelected 
                              ? 'bg-orange-500/5 border-orange-500/30 ring-1 ring-orange-500/10' 
                              : 'bg-slate-50/50 dark:bg-slate-950/10 border-slate-150 dark:border-slate-850 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-slate-200/30 dark:border-slate-800/30 pb-1.5">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[9px] font-mono font-bold bg-slate-200 dark:bg-slate-850 text-slate-500 px-1.5 py-0.5 rounded">
                                {rep.id}
                              </span>
                              <span className="font-extrabold text-xs text-slate-850 dark:text-slate-150 block truncate max-w-[150px]">
                                {rep.title}
                              </span>
                            </div>
                            
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                              rep.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : rep.status === 'dispatched'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-orange-500/10 text-orange-500 animate-pulse'
                            }`}>
                              {rep.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 truncate mt-1">"{rep.description}"</p>
                          
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1">
                            <span className="truncate max-w-[140px]">📍 {rep.location}</span>
                            <span className="text-amber-500">+{rep.greenPoints} credits</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Subsurface breakdown */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-150 dark:border-slate-850 text-xs text-left font-mono">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">MUNICIPAL SLA PERFORMANCE INDEX</span>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Average incident resolution:</span>
                    <span className="font-extrabold text-emerald-500">18.4 minutes (Target met)</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Detailed Incident workspace (7-cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                {selectedIncident ? (
                  <div className="space-y-6 text-left">
                    
                    {/* Header detail info */}
                    <div className="border-b border-slate-100 dark:border-slate-850 pb-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                            {selectedIncident.id}
                          </span>
                          <span className="text-xs font-mono capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                            {selectedIncident.category} Category
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Filed {selectedIncident.createdAt || 'recent'}</span>
                      </div>
                      <h4 className="font-black text-lg text-slate-900 dark:text-white mt-2.5 tracking-tight">
                        {selectedIncident.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2 p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850/60 rounded-xl">
                        "{selectedIncident.description}"
                      </p>
                    </div>

                    {/* Grid metadata coordinates and visual thumbnails */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* GPS map coordinate coordinates */}
                      <div className="space-y-2 text-xs font-mono text-slate-500">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Precise GIS Sector Coordinates</span>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-150 dark:border-slate-850 space-y-1.5 text-[11px]">
                          <div className="flex justify-between">
                            <span>Sector Location:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedIncident.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Latitude:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedIncident.lat.toFixed(4)}° N</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Longitude:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedIncident.lng.toFixed(4)}° W</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Citizens credits:</span>
                            <span className="text-amber-500 font-bold">+{selectedIncident.greenPoints} QP credits</span>
                          </div>
                        </div>
                      </div>

                      {/* Image Preview attachment */}
                      <div className="space-y-2">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Computer Vision Image Attachment</span>
                        <div className="relative h-28 bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-850 overflow-hidden flex items-center justify-center text-xs text-slate-400">
                          {selectedIncident.imageUrl ? (
                            <img 
                              src={selectedIncident.imageUrl} 
                              alt={selectedIncident.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="text-center font-mono p-4 text-[10px]">
                              <span>📷 IMAGING SATELLITE: NO EXIF ATTACHMENT</span>
                              <span className="block text-slate-500 mt-1 text-[8px]">Sector: Civic Center Central</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Core status history timeline */}
                    <div className="space-y-2">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">SLA Dispatch & Resolution Timeline</span>
                      <div className="grid grid-cols-4 gap-2 text-center font-mono text-[9px]" id="dispatch-timeline">
                        {[
                          { title: '1. Reported', active: true, desc: 'Citizen filed ticket' },
                          { title: '2. Dispatched', active: selectedIncident.status === 'dispatched' || selectedIncident.status === 'completed', desc: 'Crew routing scheduled' },
                          { title: '3. In Progress', active: selectedIncident.status === 'dispatched' || selectedIncident.status === 'completed', desc: 'Vehicle in sector' },
                          { title: '4. Resolved', active: selectedIncident.status === 'completed', desc: 'Materials certified' }
                        ].map((step, idx) => (
                          <div key={idx} className={`p-2 rounded-xl border ${step.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 font-bold' : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 text-slate-400'}`}>
                            <span>{step.title}</span>
                            <span className="block opacity-80 mt-1 text-[7px] font-normal leading-relaxed">{step.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Commands: Assign, Reassign, Escalate, Resolve */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-850/60 space-y-4">
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-150 dark:border-slate-850/60">
                        <div className="space-y-1 text-xs">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sanitation Crew Assignment</span>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">Assigned: <strong>{getWorkerName(selectedIncident.assignedWorkerId)}</strong></span>
                        </div>

                        {selectedIncident.status !== 'completed' && (
                          <div className="flex items-center space-x-2">
                            <select 
                              value={selectedWorkerId}
                              onChange={e => setSelectedWorkerId(e.target.value)}
                              className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                              id="crew-dispatch-selector"
                            >
                              <option value="worker-1">Marcus Vance (Truck EV-14)</option>
                              <option value="worker-2">Sarah Jenkins (Truck EV-11)</option>
                              <option value="worker-3">Dave Miller (Sanitation Crew 4)</option>
                            </select>

                            {selectedIncident.status === 'dispatched' ? (
                              <button
                                onClick={() => handleReassignWorker(selectedIncident.id, selectedWorkerId)}
                                className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow"
                                id="reassign-dispatch-btn"
                              >
                                <span>Reassign</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDispatch(selectedIncident.id)}
                                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-md shadow-orange-500/10"
                                id="initial-dispatch-btn"
                              >
                                <Send className="h-3 w-3" />
                                <span>Dispatch Crew</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Escalate & Resolve actions row */}
                      {selectedIncident.status !== 'completed' && (
                        <div className="flex items-center justify-between gap-3 pt-1">
                          
                          <button
                            onClick={() => handleEscalatePriority(selectedIncident.id)}
                            className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-rose-500/10"
                            id="escalate-priority-btn"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            <span>Escalate Priority Level</span>
                          </button>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to dismiss this incident? This deletes the ticket.')) {
                                  onDismissReport(selectedIncident.id);
                                  setSelectedIncidentId(null);
                                }
                              }}
                              className="px-3 py-2 bg-slate-100 hover:bg-rose-500 text-slate-500 hover:text-white dark:bg-slate-850 rounded-xl text-xs font-bold transition"
                            >
                              Dismiss Ticket
                            </button>

                            <button
                              onClick={() => handleMarkResolved(selectedIncident.id)}
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/15"
                              id="resolve-incident-btn"
                            >
                              Mark Incident Resolved
                            </button>
                          </div>

                        </div>
                      )}

                    </div>

                  </div>
                ) : (
                  <div className="text-center py-24 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center">
                    <span className="text-3xl block mb-2">📋</span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">No Incident Selected</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Choose an incident ticket from the left panel to execute commands.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeSubTab === 'bins' && (
            <AdminBins 
              bins={bins} 
              onAddBin={onAddBin} 
              onDeleteBin={onDeleteBin} 
            />
          )}

          {activeSubTab === 'fleet' && (
            <AdminFleet />
          )}

          {/* New Workforce Management tab */}
          {activeSubTab === 'workforce' && (
            <AdminWorkforce 
              tasks={tasks}
              onReassignTask={(taskId, workerId) => {
                // Trigger dispatch handler to simulate task re-routing
                alert(`Task ${taskId} has been re-dispatched to worker ID ${workerId} successfully.`);
              }}
            />
          )}

          {activeSubTab === 'rbac' && (
            <AdminRBAC />
          )}

          {activeSubTab === 'analytics' && (
            <AdminAnalytics />
          )}

          {activeSubTab === 'heatmap' && (
            <CityHeatmap />
          )}

          {activeSubTab === 'health' && (
            <SystemHealth />
          )}

          {activeSubTab === 'enterprise' && (
            <AdminEnterprise />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
