import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartBin, CivicReport, WasteCategory } from '../types';
import { Compass, ShieldAlert, CheckCircle, Flame, Battery, Zap, Clock, Info, Layers, Filter } from 'lucide-react';

interface SmartBinMapProps {
  bins: SmartBin[];
  reports: CivicReport[];
  selectedBinId?: string | null;
  onSelectBin?: (binId: string) => void;
  onQuickReport?: (bin: SmartBin) => void;
}

export default function SmartBinMap({ bins, reports, selectedBinId, onSelectBin, onQuickReport }: SmartBinMapProps) {
  const [filter, setFilter] = useState<string>('all');
  const [hoveredBin, setHoveredBin] = useState<SmartBin | null>(null);
  const [hoveredReport, setHoveredReport] = useState<CivicReport | null>(null);

  const filteredBins = bins.filter(bin => {
    if (filter === 'all') return true;
    if (filter === 'critical') return bin.fillLevel >= 80;
    if (filter === 'battery') return bin.batteryLevel < 20;
    return bin.category === filter;
  });

  // Convert GPS coordinate systems to relative responsive SVG view-box locations (Map bounds: Lat 37.77-37.81, Lng -122.40 to -122.42)
  const getXY = (lat: number, lng: number) => {
    const minLat = 37.7700;
    const maxLat = 37.8100;
    const minLng = -122.4250;
    const maxLng = -122.4000;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100; // Invert Y for SVG coordinates
    return { x, y };
  };

  const getBinColor = (level: number) => {
    if (level >= 85) return '#EF4444'; // Critically full
    if (level >= 60) return '#F59E0B'; // Medium
    return '#22C55E'; // Good (Green-500)
  };

  const getCategoryEmoji = (cat: WasteCategory) => {
    switch (cat) {
      case 'recyclable': return '🥤';
      case 'organic': return '🍌';
      case 'hazardous': return '🔋';
      default: return '🗑️';
    }
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col md:flex-row h-[550px]">
      
      {/* Sidebar Controls - HUD style */}
      <div className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col justify-between z-10 shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 mb-4">
            <Compass className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-bold font-mono tracking-widest uppercase">MAP OVERVIEW SYSTEMS</span>
          </div>

          <h4 className="text-sm font-bold text-slate-100 mb-2">Live Municipal Grids</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Real-time IoT smart bin monitoring. Pulsing alerts indicate telemetry thresholds crossed.
          </p>

          {/* Filter system */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-2">FILTER TELEMETRY</span>
            <button
              onClick={() => setFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition font-medium ${filter === 'all' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="flex items-center"><Layers className="h-3.5 w-3.5 mr-2" /> All Sensors</span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400">{bins.length}</span>
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition font-medium ${filter === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="flex items-center"><Flame className="h-3.5 w-3.5 mr-2" /> Critical (&gt;85% Fill)</span>
              <span className="bg-rose-500/20 px-1.5 py-0.5 rounded text-[10px] text-rose-400">{bins.filter(b => b.fillLevel >= 85).length}</span>
            </button>
            <button
              onClick={() => setFilter('battery')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition font-medium ${filter === 'battery' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="flex items-center"><Battery className="h-3.5 w-3.5 mr-2" /> Low Battery (&lt;20%)</span>
              <span className="bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px] text-amber-400">{bins.filter(b => b.batteryLevel < 20).length}</span>
            </button>
            <div className="pt-2 border-t border-slate-800 mt-2">
              <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-2">BY WASTE TYPE</span>
              {['recyclable', 'organic', 'hazardous', 'landfill'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-xl transition font-medium capitalize ${filter === cat ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-sm">{getCategoryEmoji(cat as WasteCategory)}</span>
                    {cat}
                  </span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400">{bins.filter(b => b.category === cat).length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-800 hidden md:block">
          <div className="text-[10px] font-mono text-slate-500 mb-2">MAP LEGEND</div>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span>Optimal level (&lt;60%)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span>Attention level (60%-85%)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="h-2 w-2 bg-rose-500 rounded-full animate-ping" style={{ animationDuration: '2s' }}></span>
              <span>Overflow threshold (&gt;85%)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="h-2.5 w-2.5 bg-orange-500 rounded border border-white text-white flex items-center justify-center text-[7px] font-bold">⚠️</span>
              <span>Citizen Civic Incident</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Stage */}
      <div className="flex-1 relative bg-slate-950 overflow-hidden">
        {/* Animated Cyber Compass background */}
        <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-500 bg-slate-900/60 p-2 rounded-xl border border-slate-800 flex items-center space-x-2">
          <span>PORT: 3000</span>
          <span>•</span>
          <span className="text-cyan-400 animate-pulse">GRID OVERVIEW ACTIVE</span>
        </div>

        {/* Dynamic Canvas representing downtown with roads & water */}
        <svg className="absolute inset-0 w-full h-full select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Blue Sea / Bay outline */}
          <path d="M 0,0 L 25,0 C 20,40 5,60 0,75 Z" fill="#0F172A" opacity="0.3" stroke="#1E293B" strokeWidth="0.5" />
          <path d="M 0,80 C 15,85 20,95 25,100 L 0,100 Z" fill="#0F172A" opacity="0.3" stroke="#1E293B" strokeWidth="0.5" />

          {/* Central Park Green Area */}
          <rect x="40" y="35" width="25" height="30" rx="3" fill="#064E3B" opacity="0.15" stroke="#047857" strokeWidth="0.3" strokeDasharray="1 1" />
          <text x="52" y="52" fill="#047857" opacity="0.5" fontSize="3" className="font-sans font-bold" textAnchor="middle">CENTRAL GREEN</text>

          {/* Grid street network (grey veins) */}
          {/* Avenue 1 */}
          <line x1="15" y1="0" x2="15" y2="100" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
          {/* Avenue 2 */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
          {/* Avenue 3 */}
          <line x1="85" y1="0" x2="85" y2="100" stroke="#334155" strokeWidth="0.5" opacity="0.4" />

          {/* Cross Streets */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1="45" x2="100" y2="45" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#334155" strokeWidth="0.5" opacity="0.4" />

          {/* Diagonal Transit Boulevard */}
          <line x1="0" y1="90" x2="100" y2="10" stroke="#475569" strokeWidth="1" strokeDasharray="1 2" opacity="0.5" />
        </svg>

        {/* SMART BIN PINS LAYOUT */}
        {filteredBins.map(bin => {
          const { x, y } = getXY(bin.lat, bin.lng);
          const isSelected = selectedBinId === bin.id;
          const isCritical = bin.fillLevel >= 85;

          return (
            <div
              key={bin.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onSelectBin && onSelectBin(bin.id)}
              onMouseEnter={() => setHoveredBin(bin)}
              onMouseLeave={() => setHoveredBin(null)}
            >
              {/* Pulse animations */}
              <div 
                className={`absolute inset-0 rounded-full -m-3 animate-ping ${isCritical ? 'bg-rose-500/30' : 'bg-green-500/10'}`}
                style={{ animationDuration: isCritical ? '1.5s' : '3s' }}
              ></div>

              {/* Pin Icon */}
              <div 
                className={`p-1.5 rounded-full shadow-lg border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'scale-125 border-cyan-400 bg-cyan-950 z-30' 
                    : `border-slate-800 hover:scale-115`
                }`}
                style={{ backgroundColor: getBinColor(bin.fillLevel) }}
              >
                <span className="text-xs">{getCategoryEmoji(bin.category)}</span>
              </div>

              {/* Minimal level flag */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-[8px] font-bold font-mono px-1 rounded border border-white/10 shadow leading-none">
                {Math.round(bin.fillLevel)}%
              </div>
            </div>
          );
        })}

        {/* CIVIC INCIDENTS PINS LAYOUT (Yellow Warning triangles) */}
        {reports.map(report => {
          const { x, y } = getXY(report.lat, report.lng);
          if (report.status === 'completed') return null;

          return (
            <div
              key={report.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredReport(report)}
              onMouseLeave={() => setHoveredReport(null)}
            >
              <div className="absolute inset-0 rounded bg-orange-500/30 -m-2 animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="bg-orange-500 border border-white text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-1 shadow-md scale-95 hover:scale-105 transition-transform">
                <span>⚠️</span>
                <span className="text-[8px] font-mono">INCIDENT</span>
              </div>
            </div>
          );
        })}

        {/* MOUSE HOVER POPUP DISPLAY - Apple-inspired glass pane */}
        <AnimatePresence>
          {hoveredBin && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl z-40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">IoT Sensor Stream</span>
                <span className="text-slate-500 text-[10px] font-mono flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {hoveredBin.lastEmptied}
                </span>
              </div>

              <h5 className="font-bold text-slate-100 text-sm mt-1.5">{hoveredBin.name}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">{hoveredBin.address}</p>

              {/* Fill bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span>Fill Level</span>
                  <span className={hoveredBin.fillLevel >= 85 ? 'text-rose-400 font-bold' : 'text-green-400'}>
                    {hoveredBin.fillLevel}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${hoveredBin.fillLevel}%`,
                      backgroundColor: getBinColor(hoveredBin.fillLevel)
                    }}
                  ></div>
                </div>
              </div>

              {/* Temp / Battery grids */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="block text-[8px] text-slate-500 font-mono">TEMPERATURE</span>
                  <span className="text-xs font-bold font-mono text-amber-500">{hoveredBin.temperature}°C</span>
                </div>
                <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="block text-[8px] text-slate-500 font-mono">BATTERY LIFE</span>
                  <span className={`text-xs font-bold font-mono flex items-center justify-center ${hoveredBin.batteryLevel < 20 ? 'text-rose-400 animate-pulse' : 'text-green-400'}`}>
                    <Battery className="h-3 w-3 mr-0.5" />
                    {hoveredBin.batteryLevel}%
                  </span>
                </div>
                <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="block text-[8px] text-slate-500 font-mono">CATEGORY</span>
                  <span className="text-[9px] font-bold capitalize text-slate-300">{hoveredBin.category}</span>
                </div>
              </div>

              {hoveredBin.fillLevel >= 75 && (
                <div className="mt-3">
                  <button 
                    onClick={() => onQuickReport && onQuickReport(hoveredBin)}
                    className="w-full py-1 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1"
                  >
                    <span>⚠️</span>
                    <span>REPORT OVERFLOW DISPATCH</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {hoveredReport && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl z-40"
            >
              <div className="flex items-center justify-between text-orange-400">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">⚠️ CITIZEN CIVIC INCIDENT</span>
                <span className="text-[9px] bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded text-orange-400 uppercase font-mono">
                  {hoveredReport.status}
                </span>
              </div>

              <h5 className="font-bold text-slate-100 text-sm mt-1.5">{hoveredReport.title}</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">Location: {hoveredReport.location}</p>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                "{hoveredReport.description}"
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-400">
                <span>By: {hoveredReport.citizenName}</span>
                <span>Reward: +{hoveredReport.greenPoints} Credits</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
