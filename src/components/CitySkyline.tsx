import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck, Navigation, ShieldCheck, Sun, Zap, Trash2 } from 'lucide-react';

export default function CitySkyline() {
  const [truckPos, setTruckPos] = useState(0);
  const [turbineAngle, setTurbineAngle] = useState(0);
  const [cleanlinessScore, setCleanlinessScore] = useState(94.2);

  useEffect(() => {
    // Spin wind turbines
    const turbineInterval = setInterval(() => {
      setTurbineAngle(prev => (prev + 3) % 360);
    }, 30);

    // Animate municipal truck driving across
    const truckInterval = setInterval(() => {
      setTruckPos(prev => (prev >= 100 ? -15 : prev + 0.15));
    }, 40);

    // Random fluctuation in live cleanliness telemetry
    const cleanInterval = setInterval(() => {
      setCleanlinessScore(prev => {
        const delta = (Math.random() - 0.5) * 0.1;
        return parseFloat(Math.min(100, Math.max(90, prev + delta)).toFixed(1));
      });
    }, 3000);

    return () => {
      clearInterval(turbineInterval);
      clearInterval(truckInterval);
      clearInterval(cleanInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-80 bg-gradient-to-b from-sky-400/10 via-sky-300/5 to-slate-900/10 dark:from-slate-950/80 dark:via-slate-900/40 dark:to-slate-950 overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl backdrop-blur-sm">
      {/* Sky Background elements */}
      <div className="absolute top-8 left-12 flex items-center space-x-2 text-amber-500/80 dark:text-amber-400/50">
        <Sun className="h-10 w-10 animate-spin" style={{ animationDuration: '60s' }} />
        <div className="text-xs font-mono">SOLAR FEED: 1.2 GW</div>
      </div>

      {/* Cybernetic Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Wind Turbines & Mountains Layer (Far Background) */}
      <div className="absolute bottom-16 left-0 right-0 h-40 flex justify-around items-end opacity-40 select-none">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col items-center translate-y-4">
            <svg width="40" height="40" viewBox="0 0 100 100" style={{ transform: `rotate(${turbineAngle + i * 45}deg)` }}>
              <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="4" className="text-slate-400 dark:text-slate-600" />
              <line x1="50" y1="50" x2="85" y2="70" stroke="currentColor" strokeWidth="4" className="text-slate-400 dark:text-slate-600" />
              <line x1="50" y1="50" x2="15" y2="70" stroke="currentColor" strokeWidth="4" className="text-slate-400 dark:text-slate-600" />
            </svg>
            <div className="w-1.5 h-20 bg-slate-400 dark:bg-slate-600 rounded-t"></div>
          </div>
        ))}
      </div>

      {/* Smart City Buildings Vector Silhouette (Midground) */}
      <div className="absolute bottom-12 left-0 right-0 h-32 flex items-end justify-between px-6 opacity-30 select-none">
        <div className="w-12 h-24 bg-slate-500 dark:bg-slate-700 rounded-t-lg"></div>
        <div className="w-16 h-28 bg-slate-400 dark:bg-slate-800 rounded-t-lg relative">
          <div className="absolute top-2 left-2 right-2 bottom-0 grid grid-cols-2 gap-1">
            {[...Array(12)].map((_, j) => (
              <div key={j} className="h-2 bg-amber-300/40 dark:bg-amber-400/20 rounded-sm"></div>
            ))}
          </div>
        </div>
        <div className="w-10 h-16 bg-slate-500 dark:bg-slate-700 rounded-t-md"></div>
        <div className="w-20 h-32 bg-slate-600 dark:bg-slate-900 rounded-t-xl relative border-t-2 border-emerald-500/40">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-emerald-500/50"></div>
        </div>
        <div className="w-14 h-20 bg-slate-500 dark:bg-slate-800 rounded-t-lg"></div>
        <div className="w-16 h-26 bg-slate-400 dark:bg-slate-700 rounded-t-md"></div>
        <div className="w-12 h-30 bg-slate-600 dark:bg-slate-900 rounded-t-lg"></div>
      </div>

      {/* Live Clean Road (Foreground Layer) */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-200 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 flex items-center">
        {/* Road markings */}
        <div className="w-full flex justify-between px-4 opacity-50">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="w-6 h-1 bg-white dark:bg-slate-700"></div>
          ))}
        </div>

        {/* Smart Bin IoT Mock on Roadside */}
        <div className="absolute bottom-10 left-[18%] flex flex-col items-center group">
          <div className="absolute -top-12 bg-slate-900/90 text-[10px] text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 shadow-lg font-mono scale-0 group-hover:scale-100 transition-transform origin-bottom duration-200">
            SB-101: 42%
          </div>
          <div className="w-4 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-t relative flex items-center justify-center">
            <div className="w-2 h-1 bg-emerald-400 animate-pulse absolute top-1 rounded"></div>
            <Trash2 className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="absolute bottom-10 left-[72%] flex flex-col items-center group">
          <div className="absolute -top-12 bg-slate-900/90 text-[10px] text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 shadow-lg font-mono scale-0 group-hover:scale-100 transition-transform origin-bottom duration-200">
            SB-104: 92% (ALERT)
          </div>
          <div className="w-4 h-8 bg-rose-500 dark:bg-rose-600 rounded-t relative flex items-center justify-center">
            <div className="w-2 h-1 bg-rose-300 animate-ping absolute top-1 rounded"></div>
            <Trash2 className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Animated Tesla/Uber Style EV Garbage Truck */}
        <div 
          className="absolute bottom-4 flex items-center space-x-1"
          style={{ left: `${truckPos}%` }}
        >
          <div className="bg-emerald-600 text-white p-1 rounded-l-md shadow-md flex items-center space-x-1">
            <Truck className="h-4 w-4" />
            <div className="text-[8px] font-mono font-bold leading-none hidden md:block">ECO-TRUCK (EV-14)</div>
          </div>
          <div className="w-4 h-6 bg-slate-800 rounded-r-md flex items-center justify-center">
            <Zap className="h-2 w-2 text-emerald-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 left-2 w-2 h-2 bg-slate-950 rounded-full border border-slate-700"></div>
          <div className="absolute -bottom-1 left-7 w-2 h-2 bg-slate-950 rounded-full border border-slate-700"></div>
        </div>
      </div>

      {/* IoT Flying Drone Scanning animation */}
      <motion.div 
        className="absolute top-1/3 left-1/3 p-2 bg-slate-950/80 text-cyan-400 border border-cyan-500/40 rounded-full shadow-lg"
        animate={{
          y: [0, -15, 0],
          x: [0, 40, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative">
          <Navigation className="h-4 w-4 rotate-45" />
          <div className="absolute -bottom-12 -left-16 w-36 text-center text-[7px] font-mono text-cyan-400 bg-slate-950/90 p-1 rounded border border-cyan-500/20">
            DRONE DETECT: ACTIVE
          </div>
          <div className="absolute -inset-4 border border-cyan-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        </div>
      </motion.div>

      {/* Floating Real-time HUD (Tesla / Apple UI) */}
      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white font-sans max-w-xs shadow-2xl">
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">CIVIC TELEMETRY</span>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold tracking-tight text-emerald-400">{cleanlinessScore}%</div>
          <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1">
            <span>City Cleanliness Index</span>
            <span className="font-mono text-emerald-400/90 flex items-center"><ShieldCheck className="h-3 w-3 mr-0.5" /> Optimal</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-center text-[9px] font-mono">
          <div className="bg-white/5 p-1 rounded">
            <span className="block text-slate-400">ACTIVE BINS</span>
            <span className="text-emerald-400 font-bold">142/142</span>
          </div>
          <div className="bg-white/5 p-1 rounded">
            <span className="block text-slate-400">AI SCANS / DAY</span>
            <span className="text-cyan-400 font-bold">1,842</span>
          </div>
        </div>
      </div>
    </div>
  );
}
