import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkerTask } from '../types';
import { 
  Play, Check, ChevronRight, MapPin, Phone, MessageSquare, 
  Trash, ShieldAlert, CheckCircle2, Navigation, UploadCloud, 
  History, User, ClipboardList, Info 
} from 'lucide-react';

interface WorkerTasksProps {
  tasks: WorkerTask[];
  onCompleteTask: (taskId: string) => void;
}

export default function WorkerTasks({ tasks, onCompleteTask }: WorkerTasksProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [crewNotes, setCrewNotes] = useState('');
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || pendingTasks[0];

  const handleStartStop = (id: string) => {
    setSelectedTaskId(id);
    setBeforePhoto('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400'); // set automatic mock photo
  };

  const simulatePhotoUpload = (type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforePhoto('https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400');
    } else {
      setAfterPhoto('https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=400');
    }
  };

  const handleCompleteCollection = () => {
    if (!selectedTask) return;
    onCompleteTask(selectedTask.id);
    setCrewNotes('');
    setBeforePhoto(null);
    setAfterPhoto(null);
    setSelectedTaskId(null);
    alert('Transit Segment Collection Marked Complete. Rewards issued and database synced.');
  };

  const getPriorityTheme = (prio: string) => {
    switch (prio) {
      case 'high': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Left Column: List of stops (5 Cols) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Assigned Stop Sheet</h4>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-full text-slate-500">
            {pendingTasks.length} Pending Stops
          </span>
        </div>

        <div className="space-y-2.5 max-h-[450px] overflow-y-auto">
          {pendingTasks.map((task, idx) => {
            const isSelected = selectedTask?.id === task.id;
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer text-left space-y-1.5 ${
                  isSelected
                    ? 'bg-slate-950 text-white border-green-500 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded uppercase ${
                    isSelected ? 'bg-emerald-500/25 text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    STOP {idx + 1}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 rounded uppercase ${getPriorityTheme(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <h5 className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {task.title}
                </h5>
                <span className="text-[9px] text-slate-400 block truncate font-mono">📍 {task.location}</span>
              </div>
            );
          })}

          {pendingTasks.length === 0 && (
            <div className="text-center py-12 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
              <h5 className="font-bold text-slate-700 dark:text-slate-300">All Stops Cleared!</h5>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                No active collection tasks remaining on your sector grid. Report back to supervisor for reassignment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Detailed Stop operations (7 Cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
        {selectedTask ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-500 uppercase">
                  {selectedTask.type.replace('-', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5">{selectedTask.title}</h3>
                <span className="text-xs text-slate-400 font-mono block">📍 {selectedTask.location}</span>
              </div>

              {/* Navigation button */}
              <button
                onClick={() => alert(`Launching Tesla-style Navigation to coordinates: [${selectedTask.lat}, ${selectedTask.lng}]`)}
                className="px-3 py-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 rounded-xl text-[10px] font-bold hover:bg-cyan-500/20 transition flex items-center space-x-1"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Navigate</span>
              </button>
            </div>

            {/* Description details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-1 text-xs">
              <span className="block font-bold text-[10px] text-slate-400 font-mono uppercase">DISPATCH DESCRIPTION</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedTask.description}</p>
            </div>

            {/* Citizen Details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-200 dark:bg-slate-800 text-slate-600 rounded-full shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-bold text-[9px] text-slate-400 font-mono">DEPONENT CONTACT</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Sarah Jenkins (Citizen)</span>
                  <span className="block text-[10px] text-slate-400">Phone: +1 555-0177</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('Dialing citizen Sarah Jenkins via secure municipal communications...')}
                  className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition"
                >
                  <Phone className="h-4 w-4 text-emerald-600" />
                </button>
                <button
                  onClick={() => alert('Sending encrypted operational notification to citizen...')}
                  className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition"
                >
                  <MessageSquare className="h-4 w-4 text-cyan-600" />
                </button>
              </div>
            </div>

            {/* Before / After Photo Area */}
            <div>
              <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-2">OPERATIONAL CLEARANCE PHOTO RECORD</span>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Before Photo */}
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center space-y-2">
                  <span className="block text-[10px] text-slate-400 font-bold font-mono uppercase">BEFORE COLLECTION</span>
                  {beforePhoto ? (
                    <img src={beforePhoto} className="h-24 w-full object-cover rounded-xl border border-slate-100" alt="Before" />
                  ) : (
                    <button 
                      onClick={() => simulatePhotoUpload('before')}
                      className="w-full py-6 bg-slate-50 dark:bg-slate-950/20 text-[10px] text-slate-500 hover:bg-slate-100 rounded-xl"
                    >
                      [Auto Preset]
                    </button>
                  )}
                </div>

                {/* After Photo */}
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center space-y-2">
                  <span className="block text-[10px] text-slate-400 font-bold font-mono uppercase">AFTER COLLECTION</span>
                  {afterPhoto ? (
                    <img src={afterPhoto} className="h-24 w-full object-cover rounded-xl border border-slate-100" alt="After" />
                  ) : (
                    <button 
                      onClick={() => simulatePhotoUpload('after')}
                      className="w-full py-6 bg-emerald-50 dark:bg-emerald-950/20 text-[10px] text-emerald-600 font-bold hover:bg-emerald-100/50 rounded-xl"
                    >
                      Take Photo
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Crew Notes and Submit */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase">CREW AUDIT COMMENTS</label>
              <input
                type="text"
                placeholder="e.g., Emptied organic bin. Scrubbed and sprayed microbial sanitizer. No overflow spilled."
                value={crewNotes}
                onChange={e => setCrewNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
              />

              <button
                onClick={handleCompleteCollection}
                disabled={!afterPhoto}
                className={`w-full py-3 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-lg ${
                  afterPhoto
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-emerald-600/15'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200/50'
                }`}
              >
                <Check className="h-4 w-4" />
                <span>CONFIRM COLLECTION & SYNCHRONIZE LEDGERS</span>
              </button>
              {!afterPhoto && (
                <span className="block text-[9px] text-slate-400 text-center font-mono mt-1">
                  * PLEASE LOG "AFTER COLLECTION" PHOTO RECORD BEFORE TRANSMITTING CLEARANCE
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 h-full border border-dashed border-slate-150 dark:border-slate-850 rounded-3xl min-h-[400px]">
            <ClipboardList className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
            <h5 className="font-bold text-slate-700 dark:text-slate-300">Awaiting Stop Dispatch</h5>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Select any pending segment stop from the left sidebar to begin GPS routing and clear smart bin levels.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
