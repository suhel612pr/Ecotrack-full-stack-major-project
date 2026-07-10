import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CivicReport, WasteCategory } from '../types';
import { 
  Send, PlusCircle, CheckCircle2, AlertTriangle, MapPin, 
  Trash, ShieldAlert, History, UploadCloud, Eye, Check, X,
  Clock, Landmark, PhoneCall, CheckCircle, Info, ChevronRight
} from 'lucide-react';

interface CitizenComplaintFormProps {
  reports: CivicReport[];
  onAddReport: (report: Partial<CivicReport>) => void;
}

export default function CitizenComplaintForm({ reports, onAddReport }: CitizenComplaintFormProps) {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Form, Step 2: Confirmation / Success Tracking
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Overflowing Bin');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [preferredContact, setPreferredContact] = useState<'Email' | 'Push' | 'SMS' | 'None'>('Email');
  
  // Media uploads simulation
  const [imageUploaded, setImageUploaded] = useState<string | null>(null);
  const [videoUploaded, setVideoUploaded] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const categoriesList = [
    'Overflowing Bin', 'Garbage Dump', 'Illegal Dumping', 'Dead Animal', 
    'Medical Waste', 'Construction Waste', 'Roadside Garbage', 'Drain Blockage', 
    'Open Sewage', 'Broken Dustbin', 'Other'
  ];

  // Mock timeline states for selected complaint
  const timelineStates = [
    { name: 'Submitted', key: 'pending', desc: 'Complaint logged in municipal ledger.', date: 'Today, 10:30 AM', checked: true },
    { name: 'Verified', key: 'verified', desc: 'GIS dispatch verified coordinates.', date: 'Today, 10:45 AM', checked: true },
    { name: 'Assigned', key: 'assigned', desc: 'Assigned to Sanitation Crew Leader Marcus Vance.', date: 'Today, 11:00 AM', checked: true },
    { name: 'Worker Dispatched', key: 'dispatched', desc: 'EV-Truck EV-14 is en route.', date: 'Today, 11:15 AM', checked: true },
    { name: 'Cleaning Started', key: 'started', desc: 'Clearing and debris separation active.', date: 'Est. Today, 11:45 AM', checked: false },
    { name: 'Completed', key: 'completed', desc: 'Materials collected & recycled.', date: 'Est. Today, 12:15 PM', checked: false },
    { name: 'Verified by Supervisor', key: 'verified_supervisor', desc: 'Photo verification audited by Chief Reynolds.', date: 'Est. Today, 12:30 PM', checked: false },
    { name: 'Closed', key: 'closed', desc: 'Ledger closed and green points distributed.', date: 'Est. Today, 12:45 PM', checked: false }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true);
    } else if (e.type === "dragleave") {
      setDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (file.type.startsWith('image/')) {
            setImageUploaded(event.target.result as string);
          } else if (file.type.startsWith('video/')) {
            setVideoUploaded(file.name);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateSelectFile = (type: 'image' | 'video') => {
    if (type === 'image') {
      setImageUploaded('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600');
    } else {
      setVideoUploaded('illegal_dumping_incident_V5.mp4');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    // Map categories to overall waste types
    let mappedCat: WasteCategory = 'landfill';
    if (category.includes('Bin') || category.includes('Garbage')) mappedCat = 'landfill';
    if (category.includes('Recyclable')) mappedCat = 'recyclable';
    if (category.includes('Medical') || category.includes('Hazardous') || category.includes('Sewage')) mappedCat = 'hazardous';
    if (category.includes('Organic') || category.includes('Animal')) mappedCat = 'organic';

    const tempId = `rep-${Math.floor(100 + Math.random() * 900)}`;
    setLastSubmittedId(tempId);

    onAddReport({
      id: tempId,
      citizenName: isAnonymous ? 'Anonymous Citizen' : 'Elena Rostova',
      title: `[${category}] ${title}`,
      description,
      category: mappedCat,
      location,
      lat: 37.7749 + (Math.random() - 0.5) * 0.02,
      lng: -122.4194 + (Math.random() - 0.5) * 0.02,
    });

    setStep(2);
    setSelectedReportId(tempId);
  };

  const activeReport = reports.find(r => r.id === (selectedReportId || reports[0]?.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: Report Form or Active Tracker (7 Cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl space-y-6">
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="complaint-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Submit Incident Report</h3>
                  <p className="text-xs text-slate-500">Alert our automated dispatch centers regarding waste spills or broken bins.</p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                
                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Report Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {categoriesList.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Headline</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Overflowing organic bin near bench"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Current Street Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 450 Market St transit center"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Urgency / Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'medium', 'high'].map(prio => (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setPriority(prio as any)}
                          className={`py-2 rounded-xl text-[10px] font-bold uppercase transition border ${
                            priority === prio 
                              ? prio === 'high' 
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500' 
                                : prio === 'medium'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500'
                                : 'bg-green-500/10 text-green-600 border-green-500'
                              : 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {prio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Detailed description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe any blockages, hazardous material leaks, or public health concerns..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {/* Drag and Drop File Upload Area */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition cursor-pointer ${
                    dragging 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/20'
                  }`}
                >
                  <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Drag incident media here or browse
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Supports high-resolution PNG, JPG, or MP4 video (Simulated)
                  </span>

                  {/* Thumbnail Previews */}
                  <div className="flex justify-center gap-2 mt-3">
                    {imageUploaded ? (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-200 h-14 w-24 shrink-0">
                        <img src={imageUploaded} className="h-full w-full object-cover" alt="Preview" />
                        <button 
                          type="button" 
                          onClick={() => setImageUploaded(null)}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => simulateSelectFile('image')} 
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[9px] font-mono text-slate-500"
                      >
                        [Simulate Photo.jpg]
                      </button>
                    )}

                    {videoUploaded ? (
                      <div className="px-2.5 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[9px] font-mono flex items-center">
                        <span className="truncate max-w-[120px]">{videoUploaded}</span>
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setVideoUploaded(null)} />
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => simulateSelectFile('video')} 
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[9px] font-mono text-slate-500"
                      >
                        [Simulate Video.mp4]
                      </button>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Submit Anonymously</span>
                      <span className="block text-[10px] text-slate-400">Hide my identity from workers and public ledgers</span>
                    </div>
                  </label>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Preferred Contact</label>
                    <div className="flex gap-2">
                      {['Email', 'Push', 'SMS', 'None'].map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPreferredContact(item as any)}
                          className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition ${
                            preferredContact === item 
                              ? 'bg-emerald-500 text-white border-emerald-500' 
                              : 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-500'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/10"
                >
                  <Send className="h-4 w-4" />
                  <span>TRANSMIT REPORT TO DISPATCH CENTERS</span>
                </button>

              </form>
            </motion.div>
          ) : (
            // Success & Tracker timeline screen!
            <motion.div
              key="tracker"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                    <CheckCircle className="h-5 w-5 mr-1.5 text-emerald-500" /> Active Complaint Tracker
                  </h3>
                  <p className="text-xs text-slate-400">Live operational monitoring of cleanup resolution.</p>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold hover:bg-slate-200 transition"
                >
                  File New Report
                </button>
              </div>

              {/* Status Header */}
              {activeReport && (
                <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                        ID: {activeReport.id}
                      </span>
                      <span className="bg-cyan-500/10 text-cyan-500 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/20 capitalize">
                        {activeReport.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">{activeReport.title}</h4>
                    <span className="text-xs text-slate-400 font-mono block">📍 {activeReport.location}</span>
                  </div>

                  {/* Estimated resolution / Dept */}
                  <div className="grid grid-cols-2 gap-3 sm:text-right font-mono text-[10px] text-slate-400">
                    <div>
                      <span className="block font-bold text-slate-500">ASSIGNED DEPT</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
                        <Landmark className="h-3.5 w-3.5 text-emerald-500" /> SAN-OPS
                      </span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-500">EST. RESOLUTION</span>
                      <span className="text-amber-500 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 animate-pulse" /> ~3.5 Hours
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time 8-Step Timeline */}
              <div className="space-y-4 text-left">
                <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                  8-STAGE RESOLUTION MILESTONES:
                </span>
                <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800 ml-3 space-y-5">
                  {timelineStates.map((state, idx) => {
                    // Decide if state has been completed
                    const isPassed = state.checked || (activeReport && activeReport.status === 'completed');
                    const isActive = activeReport?.status === state.key;

                    return (
                      <div key={idx} className="relative">
                        {/* Circle dot marker */}
                        <div className={`absolute -left-[31px] top-0.5 h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-colors z-10 ${
                          isPassed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : isActive 
                            ? 'bg-cyan-500 border-cyan-500 text-white animate-pulse' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}>
                          {isPassed ? (
                            <Check className="h-3 w-3 stroke-[3]" />
                          ) : (
                            <span className="text-[8px] font-mono">{idx + 1}</span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h5 className={`font-bold text-xs ${isPassed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                              {state.name}
                            </h5>
                            <span className="text-[9px] font-mono text-slate-400">{state.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{state.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* RIGHT COLUMN: Active/Completed Reports Ledger List (5 Cols) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <History className="h-4.5 w-4.5" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">CIVIC COMPLAINTS LEDGER</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold">{reports.length} Reports Total</span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto">
            {reports.map(rep => {
              const isSelected = selectedReportId === rep.id;
              return (
                <div 
                  key={rep.id} 
                  onClick={() => {
                    setSelectedReportId(rep.id);
                    setStep(2);
                  }}
                  className={`p-3.5 rounded-2xl border transition text-left cursor-pointer flex items-start justify-between space-x-2 ${
                    isSelected 
                      ? 'bg-slate-950 text-white border-emerald-500 shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850/50'
                  }`}
                >
                  <div className="space-y-1 truncate max-w-[70%]">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                        isSelected ? 'bg-emerald-500/25 text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {rep.id}
                      </span>
                      <span className={`text-[9px] font-bold uppercase ${
                        rep.status === 'completed' ? 'text-green-600' : rep.status === 'dispatched' ? 'text-cyan-500' : 'text-amber-500'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <h5 className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                      {rep.title}
                    </h5>
                    <span className="text-[9px] text-slate-400 block truncate font-mono">📍 {rep.location}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-500 font-mono">+{rep.greenPoints} PTS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 text-center text-[10px] text-slate-400 font-mono leading-relaxed">
          <span>ALL DEPONENT INCIDENTS ENCRYPTED VIA CITADEL LEDGER REGISTRY</span>
        </div>
      </div>

    </div>
  );
}
