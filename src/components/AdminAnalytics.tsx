import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, TrendingUp, Users, Leaf, ArrowUpRight, Award, Trash2, 
  FileDown, Zap, AlertTriangle, Calendar, Shield, Activity, RefreshCw, 
  MapPin, Clock, CheckCircle
} from 'lucide-react';

export default function AdminAnalytics() {
  const [activeMetric, setActiveMetric] = useState<'waste' | 'carbon' | 'participation'>('waste');
  const [activePredictiveTab, setActivePredictiveTab] = useState<'overflow' | 'maintenance' | 'hotspots' | 'seasonal'>('overflow');
  
  // Exporter state
  const [selectedReport, setSelectedReport] = useState<'daily' | 'carbon' | 'bins' | 'complaints'>('daily');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const monthlyRecyclingData = [
    { month: 'Jan', recycled: 45, landfill: 55, co2Offset: 5.4 },
    { month: 'Feb', recycled: 50, landfill: 50, co2Offset: 6.1 },
    { month: 'Mar', recycled: 58, landfill: 42, co2Offset: 7.2 },
    { month: 'Apr', recycled: 62, landfill: 38, co2Offset: 8.0 },
    { month: 'May', recycled: 70, landfill: 30, co2Offset: 9.3 },
    { month: 'Jun', recycled: 76, landfill: 24, co2Offset: 10.5 }
  ];

  const overallStats = [
    { label: 'Greenhouse Gas saved', value: '46.5 Tons', icon: <Leaf className="h-5 w-5 text-emerald-500" />, rate: '+12.4% vs prev. half' },
    { label: 'Citizen Active Scanning', value: '8,421 Daily Scans', icon: <Users className="h-5 w-5 text-cyan-500" />, rate: '+18.5% weekly spike' },
    { label: 'Municipal Recycling Index', value: '76.4%', icon: <Award className="h-5 w-5 text-amber-500" />, rate: 'Target: 80% by Q4' },
    { label: 'Landfill Diversion Rate', value: '74.2 Tons Diversion', icon: <Trash2 className="h-5 w-5 text-indigo-500" />, rate: '+5.4% landfill offset' }
  ];

  // Predictive Analytics Mock Datasets
  const binOverflowPredictions = [
    { binId: 'bin-102', name: 'SB-102 (Transit Hub)', currentFill: 88, predictedHours: '2.1 hrs', confidence: 96, action: 'Queue Immediate Dispatch' },
    { binId: 'bin-104', name: 'SB-104 (Central Park)', currentFill: 92, predictedHours: '1.4 hrs', confidence: 98, action: 'Crew Route Priority Red' },
    { binId: 'bin-107', name: 'SB-107 (Fisherman Wharf)', currentFill: 82, predictedHours: '4.5 hrs', confidence: 84, action: 'Routine Schedule Sweep' }
  ];

  const vehicleMaintenancePredictions = [
    { vehicleId: 'EV-TRUCK-11', name: 'EV Collection Truck 11', batteryHealth: 74, wearFactor: 'Brake Pad Coolant Grid', recommendedService: 'In 2 days', status: 'critical' },
    { vehicleId: 'EV-TRUCK-14', name: 'EV Fleet Master 14', batteryHealth: 91, wearFactor: 'Tire Pressure Segment B', recommendedService: 'In 12 days', status: 'stable' },
    { vehicleId: 'EV-TRUCK-19', name: 'EV Compact Sorter 19', batteryHealth: 88, wearFactor: 'Hydraulic Compactor Filter', recommendedService: 'In 8 days', status: 'stable' }
  ];

  const complaintHotspots = [
    { sector: 'Sector C (Union Square East)', incidentType: 'Illegal Furniture Dumping', weeklyCount: 14, growthTrend: '+34% weekly spike', alertLevel: 'High alert' },
    { sector: 'Sector V (Golden Gate Ave)', incidentType: 'Hazardous Chemical Spills', weeklyCount: 6, growthTrend: '+12% steady climb', alertLevel: 'Medium monitoring' },
    { sector: 'Sector L (Mission Transit)', incidentType: 'General Overflowing Bins', weeklyCount: 22, growthTrend: '+45% heavy congestion', alertLevel: 'High alert' }
  ];

  const seasonalTrends = [
    { seasonEvent: 'Summer Civic Park Festival', wasteSpikeType: 'Organic Scraps & Compostables', expectedIncrease: '+28% organic load', recommendation: 'Deploy 2 temporary compost bins on Central Trail' },
    { seasonEvent: 'Winter Holiday Packing Surge', wasteSpikeType: 'Corrugated Cardboard & Paper', expectedIncrease: '+42% recyclable load', recommendation: 'Halve collection intervals for paper segment bins' }
  ];

  // Client-side report CSV/JSON file generation
  const handleExportReport = () => {
    setIsExporting(true);
    setExportSuccess(false);

    setTimeout(() => {
      let content = '';
      let filename = '';

      if (selectedReport === 'daily') {
        filename = `EcoTrack_Daily_Operational_Report_${new Date().toISOString().substring(0, 10)}`;
        if (exportFormat === 'csv') {
          content = `Report: EcoTrack AI Daily Municipal Operational Report\nGenerated: ${new Date().toISOString()}\n\n` +
                    `Metric,Value,Status\n` +
                    `Total Bins Monitored,7,Active\n` +
                    `Landfill Diversion Rate,74.2 Tons,Audited\n` +
                    `Carbon Saved,46.5 Tons,Verified\n` +
                    `Active Citizen Scanners,8421 Scans,Spike +18%\n` +
                    `Active Crew Units,3 Trucks,On-duty`;
        } else {
          content = JSON.stringify({
            report: "Daily Municipal Operational Report",
            timestamp: new Date().toISOString(),
            metrics: {
              binsMonitored: 7,
              diversionRateTons: 74.2,
              co2SavedKg: 46500,
              citizenDailyScans: 8421,
              activeVehicles: 3
            }
          }, null, 2);
        }
      } else if (selectedReport === 'carbon') {
        filename = `EcoTrack_Carbon_Diversion_Audit_${new Date().toISOString().substring(0, 10)}`;
        if (exportFormat === 'csv') {
          content = `Report: Carbon Diversion & Greenhouse Gas Audit\nGenerated: ${new Date().toISOString()}\n\n` +
                    `Month,Recycled (%),Landfill (%),CO2 Offset (Tons)\n` +
                    `Jan,45,55,5.4\n` +
                    `Feb,50,50,6.1\n` +
                    `Mar,58,42,7.2\n` +
                    `Apr,62,38,8.0\n` +
                    `May,70,30,9.3\n` +
                    `Jun,76,24,10.5`;
        } else {
          content = JSON.stringify(monthlyRecyclingData, null, 2);
        }
      } else if (selectedReport === 'bins') {
        filename = `EcoTrack_IoT_Smart_Bin_Audit_${new Date().toISOString().substring(0, 10)}`;
        if (exportFormat === 'csv') {
          content = `Report: IoT Smart Bin Telemetry Audit Log\nGenerated: ${new Date().toISOString()}\n\n` +
                    `Bin ID,Name,Location,Category,Fill Level (%),Battery (%)\n` +
                    `bin-101,Smart Bin SB-101,120 Civic Center Plaza,recyclable,42,94\n` +
                    `bin-102,Smart Bin SB-102,450 Market St,landfill,88,89\n` +
                    `bin-103,Smart Bin SB-103,Union Square East,recyclable,76,12\n` +
                    `bin-104,Smart Bin SB-104,820 Mission St,organic,92,81\n` +
                    `bin-105,Smart Bin SB-105,Golden Gate Ave & Hyde St,hazardous,15,98\n` +
                    `bin-106,Smart Bin SB-106,Civic Park South Trail,organic,31,74\n` +
                    `bin-107,Smart Bin SB-107,Jefferson St & Taylor St,landfill,82,68`;
        } else {
          content = JSON.stringify({
            report: "IoT Smart Bin State Dump",
            timestamp: new Date().toISOString(),
            binsCount: 7,
            status: "Normal Operations"
          }, null, 2);
        }
      } else {
        filename = `EcoTrack_Citizen_Incident_Logs_${new Date().toISOString().substring(0, 10)}`;
        if (exportFormat === 'csv') {
          content = `Report: Citizen Cleanliness Complaints and Incident Logs\nGenerated: ${new Date().toISOString()}\n\n` +
                    `Report ID,Citizen,Incident Title,Category,Location,Status,Reward (Credits)\n` +
                    `rep-501,Sarah Jenkins,Overflowing Recyclables near Bus Shelter,recyclable,450 Market St Transit Stop,pending,25\n` +
                    `rep-502,Michael Chen,Illegal Dumping of Construction Waste,hazardous,Golden Gate Ave & Hyde St,dispatched,50`;
        } else {
          content = JSON.stringify([
            { id: 'rep-501', citizen: 'Sarah Jenkins', title: 'Overflowing Recyclables near Bus Shelter', status: 'pending' },
            { id: 'rep-502', citizen: 'Michael Chen', title: 'Illegal Dumping of Construction Waste', status: 'dispatched' }
          ], null, 2);
        }
      }

      // Trigger download
      const mime = exportFormat === 'csv' ? 'text/csv' : 'application/json';
      const ext = exportFormat === 'csv' ? 'csv' : 'json';
      const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Grid: 4 bento stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{stat.label}</span>
              <div className="p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl shrink-0">
                {stat.icon}
              </div>
            </div>

            <div>
              <span className="block text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                {stat.value}
              </span>
              <span className="block text-[10px] text-emerald-600 font-bold font-mono mt-1 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> {stat.rate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Card (Apple/Linear Style SVG Grid) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center">
              <BarChart3 className="h-4 w-4 mr-1.5 text-emerald-600 animate-pulse" /> Environmental Diversion Trends
            </h4>
            <p className="text-xs text-slate-400">Monthly breakdown comparing processed recyclables vs traditional general landfill tonnage.</p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {[
              { id: 'waste', label: 'Waste Tonnage' },
              { id: 'carbon', label: 'CO₂ Offset' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  activeMetric === m.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic visual representation based on active metric */}
        {activeMetric === 'waste' ? (
          <div className="space-y-5">
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] text-slate-400 font-mono font-bold uppercase pb-2">
              <span>Month</span>
              <span className="col-span-5 text-left pl-4">Relative Diversion Volume (Recycled / Landfill)</span>
            </div>

            {monthlyRecyclingData.map((d, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 items-center text-xs">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{d.month}</span>
                <div className="col-span-5 flex h-6 w-full rounded-lg overflow-hidden border border-slate-200/40 dark:border-slate-850 relative group">
                  {/* Recycled block */}
                  <div 
                    className="bg-emerald-500 hover:opacity-90 transition-opacity flex items-center pl-3 text-white text-[10px] font-bold font-mono"
                    style={{ width: `${d.recycled}%` }}
                  >
                    <span>{d.recycled}% Recycled</span>
                  </div>
                  {/* Landfill block */}
                  <div 
                    className="bg-slate-200 dark:bg-slate-800 hover:opacity-90 transition-opacity flex items-center justify-end pr-3 text-slate-600 dark:text-slate-400 text-[10px] font-bold font-mono"
                    style={{ width: `${d.landfill}%` }}
                  >
                    <span>{d.landfill}% Landfill</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // CO2 Offset Graph Visualizer
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-100 dark:border-slate-850 pb-2">
              <span>MONTHLY CARBON CO₂ PRESERVATION (TONS)</span>
              <span className="text-emerald-500 font-bold">GRID TARGET: 12.0 Tons / mo</span>
            </div>

            <div className="space-y-4 pt-2">
              {monthlyRecyclingData.map((d, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{d.month}</span>
                    <span className="text-emerald-600 font-bold">{d.co2Offset} Tons Saved</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${(d.co2Offset / 12) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carbon footnote */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
          <span>ALL DATA AUDITED SECURELY VIA IoT CITADEL TELEMETRY DATA HOUSES</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" /> Global Recycling Efficiency +24% YoY
          </span>
        </div>

      </div>

      {/* ====================================================================== */}
      {/* PREDICTIVE FORECASTING CENTER (Bento Section) */}
      {/* ====================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center">
              <Zap className="h-4.5 w-4.5 mr-1.5 text-amber-500" /> AI-Powered Predictive Forecasting Engine
            </h4>
            <p className="text-xs text-slate-400">Advanced prediction models estimating bin fill triggers, vehicle failures, and complaint hotspots.</p>
          </div>

          {/* Subtabs */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            {[
              { id: 'overflow', label: '🗑️ Bin Overflow' },
              { id: 'maintenance', label: '🚛 Vehicle Health' },
              { id: 'hotspots', label: '📍 Complaint Hotspots' },
              { id: 'seasonal', label: '📅 Seasonal Swings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePredictiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activePredictiveTab === tab.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Predictive Tab Context */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePredictiveTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {activePredictiveTab === 'overflow' && (
              binOverflowPredictions.map((bin, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase">IoT TELEMETRY CELL</span>
                      <span className="block font-bold text-xs text-slate-900 dark:text-white mt-0.5">{bin.name}</span>
                    </div>
                    <span className="text-xs bg-rose-500/10 text-rose-500 font-mono font-bold px-2 py-0.5 rounded-full border border-rose-500/20">
                      Fill Level: {bin.currentFill}%
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-400">Predictive Overflow In:</span>
                      <span className="text-rose-500 font-bold flex items-center">
                        <Clock className="h-3 w-3 mr-0.5" /> {bin.predictedHours}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] pt-1">
                      <span className="text-slate-400">ML Model Confidence:</span>
                      <span className="text-emerald-500 font-bold">{bin.confidence}% Accuracy</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-[10px] font-bold font-mono text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{bin.action}</span>
                  </div>
                </div>
              ))
            )}

            {activePredictiveTab === 'maintenance' && (
              vehicleMaintenancePredictions.map((veh, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase">{veh.vehicleId}</span>
                      <span className="block font-bold text-xs text-slate-900 dark:text-white mt-0.5">{veh.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold border ${
                      veh.status === 'critical' 
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      Battery: {veh.batteryHealth}%
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="font-mono text-[10px] flex justify-between">
                      <span className="text-slate-400">Wear Indicator:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{veh.wearFactor}</span>
                    </div>
                    <div className="font-mono text-[10px] flex justify-between">
                      <span className="text-slate-400">Next Service Scan:</span>
                      <span className="text-amber-500 font-bold">{veh.recommendedService}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 flex items-center">
                    <Activity className="h-3.5 w-3.5 mr-1 text-cyan-500" /> AI Fleet diagnostics sync: OK
                  </span>
                </div>
              ))
            )}

            {activePredictiveTab === 'hotspots' && (
              complaintHotspots.map((hot, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase">HOTSPOT COMPLIANCE</span>
                      <span className="block font-bold text-xs text-slate-900 dark:text-white mt-0.5">{hot.sector}</span>
                    </div>
                    <span className="text-[9px] bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded-full uppercase">
                      {hot.alertLevel}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="font-mono text-[10px] flex justify-between">
                      <span className="text-slate-400">Primary Incident Type:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{hot.incidentType}</span>
                    </div>
                    <div className="font-mono text-[10px] flex justify-between">
                      <span className="text-slate-400">Weekly Registered:</span>
                      <span className="text-slate-900 dark:text-white font-bold">{hot.weeklyCount} cases</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold font-mono text-rose-500 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" /> Complaint Density: {hot.growthTrend}
                  </span>
                </div>
              ))
            )}

            {activePredictiveTab === 'seasonal' && (
              seasonalTrends.map((sea, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4 col-span-1 md:col-span-1">
                  <div>
                    <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase">CIVIC CALENDAR PREDICTION</span>
                    <span className="block font-bold text-xs text-slate-900 dark:text-white mt-0.5">{sea.seasonEvent}</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">Predicted Material Spike:</span>
                      <span className="text-xs font-bold text-indigo-500">{sea.wasteSpikeType}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase">ML Predicted Volume Shift:</span>
                      <span className="text-xs font-black text-rose-500">{sea.expectedIncrease}</span>
                    </div>
                  </div>

                  <p className="text-[10px] leading-tight text-slate-500 italic">
                    💡 <strong>Smart Decision Support:</strong> {sea.recommendation}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ====================================================================== */}
      {/* EXPORT DATA & MUNICIPAL REPORT CENTER */}
      {/* ====================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-4 mb-5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl">
            <FileDown className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Municipal Report & Data Export Center</h4>
            <p className="text-xs text-slate-400">Download audited performance ledgers and carbon offset sheets for environmental stakeholders.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/50">
          
          {/* Report Choice */}
          <div className="flex-1 space-y-1.5 text-left">
            <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase">CHOOSE REPORT CATEGORY</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="daily">Daily Operational Summary Ledger</option>
              <option value="carbon">Weekly Carbon & Landfill Diversion Audit</option>
              <option value="bins">IoT Smart Bin Telemetry State Dump</option>
              <option value="complaints">Citizen Incident Complaints & Action Logs</option>
            </select>
          </div>

          {/* Export Format */}
          <div className="w-full md:w-40 space-y-1.5 text-left">
            <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase">FILE FORMAT</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="csv">CSV Spreadsheet (.csv)</option>
              <option value="json">Structured JSON (.json)</option>
            </select>
          </div>

          {/* Action Trigger */}
          <div className="flex items-end justify-center pt-3 md:pt-0">
            {exportSuccess ? (
              <div className="px-5 py-2.5 bg-green-50 dark:bg-green-950/40 border border-green-500/30 text-green-700 dark:text-green-400 rounded-xl font-bold font-mono text-xs flex items-center justify-center space-x-1.5 shrink-0">
                <CheckCircle className="h-4.5 w-4.5 text-green-500 animate-bounce" />
                <span>DOWNLOAD DISPATCHED</span>
              </div>
            ) : (
              <button
                onClick={handleExportReport}
                disabled={isExporting}
                className="w-full md:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md disabled:bg-slate-200 dark:disabled:bg-slate-850 disabled:text-slate-400 shrink-0"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>AUDITING LEDGER...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    <span>EXPORT & DOWNLOAD REPORT</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
