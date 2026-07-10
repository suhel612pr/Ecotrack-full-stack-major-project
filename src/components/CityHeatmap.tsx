import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Compass, RefreshCw, Eye, Info, ShieldAlert, CheckCircle } from 'lucide-react';

type HeatmapMetric = 'complaints' | 'garbage' | 'overflow' | 'illegal' | 'frequency' | 'recycling';

interface HeatPoint {
  x: number;
  y: number;
  intensity: number; // 0 to 1
  label: string;
}

export default function CityHeatmap() {
  const [activeMetric, setActiveMetric] = useState<HeatmapMetric>('complaints');
  const [isScanning, setIsScanning] = useState(false);
  const [scanOk, setScanOk] = useState(false);

  // High fidelity grid data for different layers
  const heatmapData: Record<HeatmapMetric, HeatPoint[]> = {
    complaints: [
      { x: 120, y: 150, intensity: 0.92, label: 'Golden Gate Ave (Heavy Dumping)' },
      { x: 340, y: 180, intensity: 0.78, label: 'Market St Bus Transit (Overflow)' },
      { x: 220, y: 310, intensity: 0.45, label: 'Mission District (Organic scrap leak)' },
      { x: 450, y: 260, intensity: 0.88, label: 'Union Square East (Illegal furniture)' }
    ],
    garbage: [
      { x: 180, y: 220, intensity: 0.85, label: 'Civic Plaza Central' },
      { x: 310, y: 140, intensity: 0.64, label: 'Sutter Corridor' },
      { x: 400, y: 320, intensity: 0.95, label: 'Financial Hub Alley' },
      { x: 150, y: 340, intensity: 0.35, label: 'South Van Ness Trail' }
    ],
    overflow: [
      { x: 450, y: 180, intensity: 0.88, label: 'SB-102 (Transit Hub) - 88% full' },
      { x: 400, y: 320, intensity: 0.92, label: 'SB-104 (Central Park) - 92% full' },
      { x: 340, y: 180, intensity: 0.82, label: 'SB-107 (Fisherman Wharf) - 82% full' }
    ],
    illegal: [
      { x: 120, y: 150, intensity: 0.98, label: 'Golden Gate Ave - Drywall/paint cans' },
      { x: 450, y: 260, intensity: 0.76, label: 'Union Square East - Mattress blockage' }
    ],
    frequency: [
      { x: 120, y: 150, intensity: 0.30, label: 'Civic Plaza North (Serviced daily)' },
      { x: 450, y: 180, intensity: 0.95, label: 'Market Corridor (Serviced 4x daily)' },
      { x: 400, y: 320, intensity: 0.65, label: 'Central Park West (Serviced 2x daily)' }
    ],
    recycling: [
      { x: 120, y: 150, intensity: 0.82, label: 'Civic Plaza Depot - 82% recycling diversion' },
      { x: 450, y: 180, intensity: 0.94, label: 'Transit Hub Terminal - 94% plastic redemption' },
      { x: 310, y: 140, intensity: 0.76, label: 'Sutter Corner Hub - 76% paper diversion' }
    ]
  };

  const handleHeatmapRefresh = () => {
    setIsScanning(true);
    setScanOk(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanOk(true);
      setTimeout(() => setScanOk(false), 3000);
    }, 1500);
  };

  const getMetricMetadata = (met: HeatmapMetric) => {
    switch (met) {
      case 'complaints':
        return { desc: 'Concentration of citizen cleanliness tickets filed within 72 hrs.', color: 'from-rose-500 to-amber-500', maxLabel: 'Red Alert: Sector C' };
      case 'garbage':
        return { desc: 'Relative tonnage of daily municipal waste accumulated per square meter.', color: 'from-amber-500 to-yellow-500', maxLabel: 'Peak: Financial Alley' };
      case 'overflow':
        return { desc: 'IoT sensor indicators showing active smart bins exceeding 80% volume capacity.', color: 'from-rose-600 to-pink-500', maxLabel: 'SB-104 (92%)' };
      case 'illegal':
        return { desc: 'Heat indices flagging unauthorized heavy debris, hazardous or construction material dumping.', color: 'from-red-600 to-amber-600', maxLabel: 'Critical: Golden Gate' };
      case 'frequency':
        return { desc: 'Average daily truck dispatch frequency and sanitation sweep coverage loops.', color: 'from-cyan-500 to-emerald-500', maxLabel: 'Max: Market Corridor' };
      default:
        return { desc: 'Percentage of total waste diverted from general landfills to recycling operations.', color: 'from-emerald-500 to-teal-500', maxLabel: 'Max: Transit Hub' };
    }
  };

  const activeMeta = getMetricMetadata(activeMetric);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Flame className="h-5 w-5 mr-1.5 text-rose-500 animate-pulse" /> Live City Density & Heatmaps
          </h3>
          <p className="text-xs text-slate-500">Overlay GIS telemetry, citizen complaints, and smart-sensor indices over municipal grids.</p>
        </div>

        <button
          onClick={handleHeatmapRefresh}
          disabled={isScanning}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold transition flex items-center space-x-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Syncing drone coordinates...' : 'Trigger Grid Refetch'}</span>
        </button>
      </div>

      {/* Grid Controller Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-2.5 rounded-2xl flex flex-wrap gap-1.5">
        {[
          { id: 'complaints', label: '🔥 Citizen Complaints' },
          { id: 'garbage', label: '🗑️ Garbage Density' },
          { id: 'overflow', label: '🚨 Overflow Bins' },
          { id: 'illegal', label: '⚠️ Illegal Dumping' },
          { id: 'frequency', label: '🚛 Dispatch Frequency' },
          { id: 'recycling', label: '♻️ Recycling Rate' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveMetric(btn.id as HeatmapMetric)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeMetric === btn.id
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grid: Map display + details sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive SVG Map container (Left 8-cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800/80 p-4 shadow-xl min-h-[400px] relative overflow-hidden flex flex-col justify-between">
          
          {/* Legend/Subheaders */}
          <div className="flex justify-between items-center z-10 text-white text-xs">
            <span className="font-mono text-[10px] uppercase text-slate-500 flex items-center">
              <Compass className="h-4 w-4 mr-1 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} /> Segment Grid: Civic Center Base [37.7749° N, 122.4194° W]
            </span>
            <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
              GPS LOCK: ACTIVE
            </span>
          </div>

          {/* Futuristic Grid Drawing */}
          <div className="absolute inset-0 opacity-10 flex flex-col justify-between pointer-events-none p-10 select-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-px bg-slate-500" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0 w-px bg-slate-500" style={{ left: `${(i / 12) * 100}%` }} />
            ))}
          </div>

          {/* Streets labels */}
          <div className="absolute inset-0 pointer-events-none p-6 text-[8px] font-mono text-slate-600 select-none flex justify-between items-end">
            <span className="transform rotate-90 origin-left">GOLDEN GATE AVE</span>
            <span className="transform -rotate-12">MARKET STREET CENTRAL CORRIDOR</span>
            <span>MISSION DISTRICT TERMINAL</span>
          </div>

          {/* Dynamic Heatmap Node overlays with pulses */}
          <div className="relative flex-1 min-h-[320px]">
            <AnimatePresence mode="popLayout">
              {heatmapData[activeMetric].map((point, index) => {
                const colors = activeMetric === 'recycling' || activeMetric === 'frequency' 
                  ? 'bg-emerald-500 border-emerald-400 shadow-emerald-500'
                  : 'bg-rose-500 border-rose-400 shadow-rose-500';

                const opacity = point.intensity;

                return (
                  <motion.div
                    key={`${activeMetric}-${index}`}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="absolute cursor-pointer group"
                    style={{ left: `${point.x}px`, top: `${point.y}px` }}
                  >
                    {/* Glowing ring */}
                    <div 
                      className={`absolute -inset-4 rounded-full opacity-35 animate-ping ${
                        activeMetric === 'recycling' || activeMetric === 'frequency' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ animationDuration: `${2.5 - opacity}s` }}
                    />
                    
                    {/* Hot point */}
                    <div 
                      className={`h-4.5 w-4.5 rounded-full border-2 shadow-[0_0_15px] flex items-center justify-center text-[7px] font-bold text-white font-mono ${colors}`}
                      style={{ transform: `scale(${0.8 + opacity * 0.5})` }}
                    >
                      {Math.floor(opacity * 100)}
                    </div>

                    {/* Popover label on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-32 hidden group-hover:block bg-slate-900/95 border border-slate-700 p-2 rounded-lg text-[9px] text-slate-100 font-mono shadow-2xl z-30">
                      <span className="block font-bold">{point.label}</span>
                      <span className="block text-slate-400 mt-1">Density: {(opacity * 100).toFixed(0)}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bottom details overlay */}
          <div className="flex justify-between items-center z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center space-x-1.5 text-xs text-white font-mono">
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${activeMeta.color}`}></span>
              <span>Metric active: <strong>{activeMetric.toUpperCase()} LAYER</strong></span>
            </div>
            {scanOk && (
              <span className="text-[10px] text-green-400 font-mono flex items-center">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Telemetry nodes synced!
              </span>
            )}
          </div>

        </div>

        {/* Info detail sidebar (Right 4-cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase block">ACTIVE LAYER SPECIFICATIONS</span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white capitalize mt-0.5">{activeMetric} Heat Index</h4>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {activeMeta.desc}
            </p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-slate-400">Layer Color:</span>
                <span className={`font-bold bg-gradient-to-r ${activeMeta.color} bg-clip-text text-transparent`}>
                  Graduated Spectrum
                </span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-slate-400">Max Peak:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{activeMeta.maxLabel}</span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-slate-400">Update Cadence:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">Continuous Stream (8s)</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-[10px] text-slate-400">
              <Info className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">To view node titles and exact geographic statistics, hover over individual heatmap pulses on the map.</p>
            </div>
          </div>

          {/* Color Key guide */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-3">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">SPECTRUM INTENSITY MATRIX</span>
            
            <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-gradient-to-r from-slate-200 via-yellow-400 to-rose-600 dark:from-slate-800 dark:via-yellow-500 dark:to-rose-600" />
            
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>0% (CLEAN/OPTIMAL)</span>
              <span>50% (STEADY)</span>
              <span>100% (CRITICAL)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
