import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, Crosshair, Send, AlertTriangle, ShieldCheck, 
  Map, Battery, RefreshCw, Eye, Image as ImageIcon, Camera, Activity
} from 'lucide-react';

interface DroneUnit {
  id: string;
  name: string;
  status: 'idle' | 'patrolling' | 'charging' | 'surveying';
  battery: number;
  altitude: number; // meters
  speed: number; // km/h
  sector: string;
  payloadCamera: string;
}

interface MissionLog {
  id: string;
  droneName: string;
  type: string;
  sector: string;
  result: string;
  time: string;
  image?: string;
}

export default function DroneManagement() {
  const [drones, setDrones] = useState<DroneUnit[]>([
    { id: 'dr-1', name: 'EcoDrone Alpha (Heavy Lift)', status: 'patrolling', battery: 84, altitude: 120, speed: 45, sector: 'Sector B (Fisherman Wharf)', payloadCamera: 'ONLINE (Wide Angle)' },
    { id: 'dr-2', name: 'EcoDrone Beta (Thermal Multi-Spectral)', status: 'idle', battery: 98, altitude: 0, speed: 0, sector: 'Dock Station 2', payloadCamera: 'STANDBY (Thermal Infrared)' },
    { id: 'dr-3', name: 'EcoDrone Delta (Rapid LiDAR Scan)', status: 'charging', battery: 18, altitude: 0, speed: 0, sector: 'Dock Station 4', payloadCamera: 'OFFLINE' }
  ]);

  const [missionLogs, setMissionLogs] = useState<MissionLog[]>([
    { id: 'ml-1', droneName: 'EcoDrone Alpha', type: 'Illegal Dumping sweep', sector: 'Sector C (Golden Gate Lane)', result: 'Discovered unauthorized concrete rubble near golden gate fence. Coordinates forwarded to Dispatch.', time: '10 mins ago', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=200' },
    { id: 'ml-2', droneName: 'EcoDrone Alpha', type: 'Smart Bin Overflow Audit', sector: 'Sector B (Fisherman Wharf)', result: 'Scanned 14 smart bins. SB-102 verified at 88% overflow capacity; validated collection task urgency.', time: '28 mins ago' }
  ]);

  const [selectedDroneId, setSelectedDroneId] = useState('dr-1');
  const [targetSector, setTargetSector] = useState('Sector A (Civic Center Hub)');
  const [missionType, setMissionType] = useState('Illegal Dumping Sweep');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  const triggerDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    setLaunchProgress(0);

    const activeDrone = drones.find(d => d.id === selectedDroneId);
    if (!activeDrone) return;

    // Simulate flight launch telemetry
    const interval = setInterval(() => {
      setLaunchProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Update drone state
            setDrones(prev => prev.map(d => d.id === selectedDroneId ? { ...d, status: 'surveying', altitude: 150, speed: 52, sector: targetSector } : d));
            
            // Append log
            const id = `ml-${Date.now()}`;
            const newLog: MissionLog = {
              id,
              droneName: activeDrone.name,
              type: missionType,
              sector: targetSector,
              result: `Completed high-res multi-spectral imaging. AI analysis model detected no immediate blockages. All ward telemetry parameters marked NOMINAL.`,
              time: 'Just Now',
              image: missionType.includes('Dumping') 
                ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=200'
                : undefined
            };
            setMissionLogs([newLog, ...missionLogs]);
            setIsLaunching(false);
          }, 400);
          return 100;
        }
        return p + 20;
      });
    }, 250);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Navigation className="h-5 w-5 mr-1.5 text-cyan-500" /> Aerial Drone Fleet Command
          </h3>
          <p className="text-xs text-slate-500">Dispatch remote multi-spectral drone sweeps, inspect illegal litter dumps, and capture real-time visual proof.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns - Drone Fleet status & Mission Log */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Units */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              Patrol Drones Telemetry Grid
            </h4>

            <div className="space-y-3">
              {drones.map(dr => (
                <div 
                  key={dr.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{dr.name}</span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        dr.status === 'patrolling' ? 'bg-cyan-500/10 text-cyan-500' : dr.status === 'surveying' ? 'bg-purple-500/10 text-purple-500 animate-pulse' : 'bg-slate-400/10 text-slate-400'
                      }`}>
                        {dr.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Location/Dock: {dr.sector}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 font-mono text-[10px] text-slate-500">
                    <div>
                      <span className="block text-[8px] text-slate-450">ALTITUDE:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{dr.altitude}m</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-450">BATTERY:</span>
                      <span className={`font-bold flex items-center gap-0.5 ${dr.battery < 20 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
                        <Battery className="h-3 w-3" /> {dr.battery}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-450">CAMERA:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 truncate block max-w-[80px]">{dr.payloadCamera}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission logs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              Recent Flight Operations Records
            </h4>

            <div className="space-y-4">
              {missionLogs.map(log => (
                <div 
                  key={log.id}
                  className="p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex gap-4 text-xs"
                >
                  {log.image && (
                    <img 
                      src={log.image} 
                      alt="Drone capture payload" 
                      className="h-16 w-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-850 dark:text-slate-200">{log.type} ({log.droneName})</span>
                      <span className="text-[9px] text-slate-400 font-mono">{log.time}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-cyan-600 block bg-cyan-50 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded w-max">
                      {log.sector}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed italic">
                      "{log.result}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 Columns - Flight dispatch controller */}
        <div className="lg:col-span-5">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center">
                <Crosshair className="h-4.5 w-4.5 mr-1.5 text-cyan-500" /> Aerial Mission Dispatch Cockpit
              </h4>
            </div>

            <form onSubmit={triggerDispatch} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Select UAV Airframe</label>
                <select 
                  value={selectedDroneId}
                  onChange={(e) => setSelectedDroneId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl"
                >
                  {drones.filter(d => d.status !== 'charging').map(d => (
                    <option key={d.id} value={d.id}>{d.name} (Batt: {d.battery}%)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Mission Parameters</label>
                <select 
                  value={missionType}
                  onChange={(e) => setMissionType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl"
                >
                  <option value="Illegal Dumping Survey">Illegal Dumping Sweep (Multi-Spectral Cameras)</option>
                  <option value="Smart Bin Overflow Audit">Smart Bin Overflow Audit (LiDAR Scan)</option>
                  <option value="Hazardous Spill Area Patrol">Hazardous Spill Area Patrol (Thermal Sweep)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Ward Sector</label>
                <select 
                  value={targetSector}
                  onChange={(e) => setTargetSector(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl"
                >
                  <option value="Sector A (Civic Center Hub)">Sector A (Civic Center Hub)</option>
                  <option value="Sector B (Fisherman Wharf)">Sector B (Fisherman Wharf)</option>
                  <option value="Sector C (Golden Gate Lane)">Sector C (Golden Gate Lane)</option>
                  <option value="Sector D (Mission District East)">Sector D (Mission District East)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-1 text-[10px] text-slate-400 font-mono">
                <p>● Max flight duration: 25 minutes</p>
                <p>● Auto return-to-dock triggered at 15% backup power</p>
                <p>● Flight routes synchronized with San Francisco Municipal Airway corridors</p>
              </div>

              <button
                type="submit"
                disabled={isLaunching}
                className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5"
              >
                {isLaunching ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>{isLaunching ? `Arming Autopilot & Preflight: ${launchProgress}%` : 'Authorize Flight Dispatch'}</span>
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
