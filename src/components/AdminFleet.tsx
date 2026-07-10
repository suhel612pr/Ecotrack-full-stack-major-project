import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, Navigation, Zap, Play, Check, ShieldAlert, 
  Battery, AlertOctagon, HelpCircle, Activity, ChevronRight,
  CloudSun, Sun, Eye, ArrowUpRight, MapPin, Clock, Info
} from 'lucide-react';

export default function AdminFleet() {
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [hazardMsg, setHazardMsg] = useState('');
  const [hazards, setHazards] = useState([
    { id: 'haz-1', route: 'Grid Segment C', msg: 'Road block on Civic Trail East', level: 'Critical' }
  ]);

  const [activeWeather, setActiveWeather] = useState({ condition: 'Light Rain Advisory', temp: '16°C', trafficFactor: '1.24x delay' });

  const trucks = [
    { id: 't-1', plate: 'EV-TRUCK-14', driver: 'Marcus Vance', battery: 92, range: 180, status: 'Active Duty', model: 'MACK LR Electric' },
    { id: 't-2', plate: 'EV-TRUCK-11', driver: 'Sarah Jenkins', battery: 84, range: 154, status: 'Active Duty', model: 'BYD Electric' },
    { id: 't-3', plate: 'EV-TRUCK-05', driver: 'Dave Miller', battery: 15, range: 25, status: 'Charging', model: 'MACK LR Electric' }
  ];

  // Advanced Hamiltonian Route Waypoints matching Weather, Traffic, Bins, and Complaints
  const optimizedWaypoints = [
    { 
      step: 1, 
      name: 'Central Municipal Depot', 
      type: 'depot', 
      detail: 'Starting point - Full charge inspection complete.', 
      loc: '120 Civic Plaza Hub',
      eta: '08:00 AM' 
    },
    { 
      step: 2, 
      name: 'Hazard Remediation Stop: Sector V', 
      type: 'complaint', 
      detail: 'Priority Complaint #rep-502: Drywall and paint cans blockage on Golden Gate Ave & Hyde St.', 
      loc: 'Golden Gate Ave & Hyde St',
      eta: '08:22 AM' 
    },
    { 
      step: 3, 
      name: 'Critical Smart Bin SB-104 Collection', 
      type: 'bin', 
      detail: 'IoT Alert: Organic Bin at 92% capacity. Temperature threshold stable.', 
      loc: '820 Mission St (Central Park)',
      eta: '08:48 AM' 
    },
    { 
      step: 4, 
      name: 'Urgent Smart Bin SB-102 Collection', 
      type: 'bin', 
      detail: 'IoT Alert: Landfill Bin at 88% capacity. Positioned on heavy transit terminal corner.', 
      loc: '450 Market St (Transit Hub)',
      eta: '09:12 AM' 
    },
    { 
      step: 5, 
      name: 'Smart Bin SB-103 Routine Collect', 
      type: 'bin', 
      detail: 'Predictive Sweep: Recyclable Bin at 76% capacity. Near-critical threshold forecast in 3.5 hrs.', 
      loc: 'Union Square East',
      eta: '09:35 AM' 
    },
    { 
      step: 6, 
      name: 'Civic Materials Recycling Terminal', 
      type: 'depot', 
      detail: 'Unload and register materials. Auto-crediting citizen green points.', 
      loc: 'Fisherman Wharf Depot',
      eta: '10:05 AM' 
    }
  ];

  const handleRouteOptimization = () => {
    setOptimizing(true);
    setOptimized(false);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
    }, 1800);
  };

  const handleBroadcastHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardMsg) return;
    const newHaz = {
      id: `haz-${Date.now()}`,
      route: 'All Sectors',
      msg: hazardMsg,
      level: 'Critical'
    };
    setHazards([newHaz, ...hazards]);
    setHazardMsg('');
    alert('Emergency dispatch broadcast transmitted securely to all on-duty truck EV screens.');
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Truck className="h-5 w-5 mr-1.5 text-cyan-600" /> Municipal Fleet & Hamiltonian Routes
          </h3>
          <p className="text-xs text-slate-500">Coordinate zero-emissions electric containers, dispatch safety warnings, and optimize grids.</p>
        </div>

        <button
          onClick={handleRouteOptimization}
          disabled={optimizing}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-cyan-600/10"
        >
          <Navigation className="h-4 w-4 text-cyan-200" />
          <span>{optimizing ? 'Calculating Hamiltonian Grid...' : 'Optimize Shift Routes'}</span>
        </button>
      </div>

      {/* Grid listing weather and route state info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center space-x-3 text-xs">
          <CloudSun className="h-8 w-8 text-cyan-500 shrink-0" />
          <div>
            <span className="block text-[9px] font-mono text-slate-400 font-bold uppercase">WEATHER SENSOR TELEMETRY</span>
            <span className="block font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeWeather.condition} ({activeWeather.temp})</span>
            <span className="text-[10px] text-slate-400 font-mono">Brake friction guidelines applied</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center space-x-3 text-xs">
          <Activity className="h-8 w-8 text-emerald-500 shrink-0" />
          <div>
            <span className="block text-[9px] font-mono text-slate-400 font-bold uppercase">TRAFFIC INTENSITY FACTOR</span>
            <span className="block font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeWeather.trafficFactor} near Market Corridor</span>
            <span className="text-[10px] text-slate-400 font-mono">Dynamic detouring active</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center space-x-3 text-xs">
          <Zap className="h-8 w-8 text-amber-500 shrink-0" />
          <div>
            <span className="block text-[9px] font-mono text-slate-400 font-bold uppercase">FLEET ELECTRIFICATION INDEX</span>
            <span className="block font-bold text-slate-900 dark:text-slate-100 mt-0.5">100% Zero-Emissions Trucks</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">Diverted 240 kg greenhouse gas today</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {optimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Optimization stats */}
            <div className="p-5 bg-gradient-to-r from-cyan-600/10 to-teal-600/10 border border-cyan-500/20 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">GRID CALCULATOR</span>
                <span className="block text-cyan-600 dark:text-cyan-400 font-extrabold flex items-center">
                  ✔ SUCCESSFUL OPTIMIZATION
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">EMISSION REDUCTIONS</span>
                <span className="block text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                  -14.2 kg CO₂ OFFSET (30%)
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">ENERGY CELL RESERVE</span>
                <span className="block text-slate-700 dark:text-slate-200 font-extrabold text-sm">
                  45.2 kWh BATTERY CONSERVED
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-slate-400 text-[10px] uppercase font-bold">MILAGE REDUCTION INDEX</span>
                <span className="block text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">
                  1.8 miles Saved per Truck
                </span>
              </div>
            </div>

            {/* Smart Hamiltonian Waypoint Steps Walkthrough */}
            <div className="bg-slate-55 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center">
                    <Navigation className="h-4 w-4 mr-1.5 text-cyan-500" /> Hamiltonian Route Stops (Dispatch: EV-TRUCK-14)
                  </h4>
                  <p className="text-[11px] text-slate-400">Step-by-step route generated considering weather rain coefficients, traffic spikes, IoT fill triggers, and citizen hazardous complaints.</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-600 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  ACTIVE ROUTE PATH
                </span>
              </div>

              {/* Waypoint Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizedWaypoints.map((way) => (
                  <div 
                    key={way.step} 
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-start space-x-3 text-xs"
                  >
                    <div className="h-6 w-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                      {way.step}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">{way.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{way.eta}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-normal text-[11px]">{way.detail}</p>
                      <div className="flex items-center text-[10px] font-mono text-slate-400 pt-1.5">
                        <MapPin className="h-3 w-3 mr-0.5 text-cyan-600" />
                        <span>{way.loc}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid listing trucks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trucks.map(truck => (
          <div 
            key={truck.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-none">{truck.plate}</h4>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">{truck.model}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                truck.status === 'Active Duty' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40'
              }`}>
                {truck.status}
              </span>
            </div>

            {/* Range and fuel/battery telemetry */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center"><Battery className="h-3.5 w-3.5 mr-0.5 text-emerald-500" /> Charge level:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{truck.battery}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Range:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{truck.range} miles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Crew:</span>
                <span className="font-bold text-emerald-600">{truck.driver}</span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${truck.battery}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Emergency broadcast dispatcher warning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Form area */}
        <form onSubmit={handleBroadcastHazard} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-1.5 text-rose-500">
            <AlertOctagon className="h-5 w-5 animate-pulse" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Emergency Dispatch Warnings console</h4>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Broadcast direct message</label>
            <input
              type="text"
              placeholder="e.g., Chemical spill reported at Sector Block C. Put on full biohazard uniforms."
              value={hazardMsg}
              onChange={e => setHazardMsg(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition"
          >
            TRANSMIT SECURE WARNING DIRECTIVE
          </button>
        </form>

        {/* Hazard List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
            ACTIVE SYSTEM BROADCAST LISTING
          </span>

          <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
            {hazards.map(haz => (
              <div key={haz.id} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-rose-600 font-bold">● {haz.route}</span>
                  <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">{haz.msg}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
