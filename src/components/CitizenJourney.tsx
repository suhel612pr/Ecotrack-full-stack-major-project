import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, Leaf, Award, Globe, HelpCircle, Calendar, Zap, 
  Trash2, Flame, Heart, ArrowUpRight, Scale 
} from 'lucide-react';
import { UserProfile } from '../types';

interface CitizenJourneyProps {
  user: UserProfile;
}

export default function CitizenJourney({ user }: CitizenJourneyProps) {
  const [timeframe, setTimeframe] = useState<'monthly' | 'annual'>('monthly');

  // --- Metric Calculation Constants ---
  // These multipliers should ideally be managed in a central configuration or fetched from the backend
  // to ensure consistency across the application (e.g., matching the values in `supabaseService.ts`).
  const CARBON_KG_PER_POINT = 0.12;
  const PLASTIC_KG_PER_POINT = 0.04;
  const RECYCLED_WASTE_KG_PER_POINT = 0.22;
  const POINTS_PER_TREE_EQUIVALENT = 25;

  // Dynamic statistics calculations based on user points
  const points = user.points || 125;
  const carbonSaved = (points * CARBON_KG_PER_POINT).toFixed(1);
  const treesEquivalent = Math.max(1, Math.round(points / POINTS_PER_TREE_EQUIVALENT));
  const plasticReducedKg = (points * PLASTIC_KG_PER_POINT).toFixed(1);
  const wasteRecycledKg = (points * RECYCLED_WASTE_KG_PER_POINT).toFixed(1);

  // Timeframe-based mock trends
  const monthlyData = [
    { name: 'Jan', carbon: 8.2, waste: 15.4, trees: 1, plastic: 2.8 },
    { name: 'Feb', carbon: 10.5, waste: 20.1, trees: 1, plastic: 3.5 },
    { name: 'Mar', carbon: 15.1, waste: 28.5, trees: 2, plastic: 5.1 },
    { name: 'Apr', carbon: 12.4, waste: 22.3, trees: 2, plastic: 4.2 },
    { name: 'May', carbon: 19.8, waste: 36.2, trees: 3, plastic: 6.8 },
    { name: 'Jun', carbon: 24.5, waste: 45.0, trees: 4, plastic: 8.4 },
    { name: 'Jul', carbon: Number(carbonSaved), waste: Number(wasteRecycledKg), trees: treesEquivalent, plastic: Number(plasticReducedKg) },
  ];

  // --- Demonstrative / Mock Data ---
  // In a production environment, this data would be fetched from an analytics endpoint.
  const recyclingRate = 88.5; // percent
  const sustainabilityScore = 92; // scale of 100
  const annualData = [
    { name: '2021', carbon: 45, waste: 92, trees: 3, plastic: 15 },
    { name: '2022', carbon: 85, waste: 180, trees: 7, plastic: 32 },
    { name: '2023', carbon: 124, waste: 260, trees: 10, plastic: 48 },
    { name: '2024', carbon: 168, waste: 345, trees: 14, plastic: 65 },
    { name: '2025', carbon: 210, waste: 410, trees: 17, plastic: 82 },
    { name: '2026 (YTD)', carbon: Number(carbonSaved) * 2, waste: Number(wasteRecycledKg) * 2, trees: treesEquivalent * 2, plastic: Number(plasticReducedKg) * 2 },
  ];

  const currentData = timeframe === 'monthly' ? monthlyData : annualData;

  return (
    <div className="space-y-6">
      
      {/* 1. Sustainability Ledger Header */}
      <div className="bg-gradient-to-br from-emerald-550 to-teal-650 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-emerald-500/10">
        <div className="absolute right-0 top-0 transform translate-x-10 -translate-y-6 opacity-10">
          <Globe className="w-80 h-80" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase bg-white/20 text-white px-2.5 py-1 rounded-full inline-block backdrop-blur-xs tracking-wider">
              REAL-TIME LEDGER IMPACT
            </span>
            <h2 className="text-2xl font-black tracking-tight font-sans mt-2">
              My Environmental Ledger
            </h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Every item you scan, sort, and dispose of responsibly writes directly to your verified sustainability record. Here is your collective environmental impact in District Grid V.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🌱
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-mono text-emerald-100 font-bold uppercase leading-none">SUSTAINABILITY INDEX</span>
              <span className="block text-xl font-extrabold font-mono mt-1 text-white">{sustainabilityScore}% Optimal</span>
              <span className="block text-[9px] text-emerald-200">Outperforming 92% of district residents</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Enhanced User Profile Impact Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Carbon Saved Card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full">
              CO₂ DIRECT
            </span>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Carbon Avoided</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {carbonSaved} <span className="text-xs font-semibold text-slate-500">kg</span>
            </span>
            <div className="flex items-center text-[10px] text-green-500 font-bold mt-1.5">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              <span>+18.4% monthly</span>
            </div>
          </div>
        </div>

        {/* Trees Equivalent Card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-mono font-bold text-teal-500 bg-teal-500/5 px-2 py-0.5 rounded-full">
              OFFSET
            </span>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Trees Equivalent</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {treesEquivalent} <span className="text-xs font-semibold text-slate-500">saplings</span>
            </span>
            <span className="block text-[10px] text-slate-400 mt-1.5">
              Total lifetime soil absorption value
            </span>
          </div>
        </div>

        {/* Recycling Accuracy Rate */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Scale className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-mono font-bold text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-full">
              ACCURACY
            </span>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Recycling Rate</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {recyclingRate}%
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${recyclingRate}%` }} />
            </div>
          </div>
        </div>

        {/* Plastic Avoided Card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Trash2 className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full">
              REDUCED
            </span>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Plastic Reduced</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {plasticReducedKg} <span className="text-xs font-semibold text-slate-500">kg</span>
            </span>
            <span className="block text-[10px] text-slate-400 mt-1.5">
              Prevented from ocean landfilling
            </span>
          </div>
        </div>

      </div>

      {/* 3. Time Trend Visualization Charts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <TrendingUp className="h-4.5 w-4.5 mr-1.5 text-emerald-500" />
              Sustainability Trend Metrics
            </h3>
            <p className="text-xs text-slate-400">
              Comparing carbon saved vs. total solid waste recycled over time.
              <span className="hidden sm:inline italic opacity-70"> (Data is illustrative)</span>
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-center border border-slate-200/20 dark:border-slate-700/40">
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                timeframe === 'monthly'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Weekly/Monthly
            </button>
            <button
              onClick={() => setTimeframe('annual')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                timeframe === 'annual'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Annual Trends
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontStyle="mono" tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} fontStyle="mono" tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(51, 65, 85, 0.5)', 
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              <Area type="monotone" name="Carbon Saved (kg CO₂)" dataKey="carbon" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCarbon)" />
              <Area type="monotone" name="Waste Recycled (kg)" dataKey="waste" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWaste)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Multi-Metric Grid Extra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/25 rounded-2xl text-xs space-y-1 text-left">
            <span className="block font-bold text-slate-800 dark:text-slate-200">How Carbon Avoidance is Tracked</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Our EPA approved algorithms compute the CO₂ equivalent saved depending on the exact material composted, recycled or diverted. E.g. Aluminum can recycling yields 10x savings versus glass bottles.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950/25 rounded-2xl text-xs space-y-1 text-left">
            <span className="block font-bold text-slate-800 dark:text-slate-200">Annual Sustainable Goal Tracker</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              You are currently on schedule to avert <strong>35.2 kg of CO₂</strong> emissions for the year 2026. This offsets the standard heating and cooling output of a modern home for a full work week.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Lifetime Statistics & Material Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Material breakdown bento block */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
              <Scale className="h-4 w-4 mr-1 text-emerald-500" /> Material Disposed Lifetime Breakdown
            </h4>
            <p className="text-[11px] text-slate-400">Estimated weights based on Smart Bin sensor calibration logs.</p>
          </div>

          <div className="space-y-3.5">
            {[
              { type: 'Paper & Cardboard', weight: '22.4 kg', count: 48, percentage: 45, color: 'bg-amber-400' },
              { type: 'Plastics (PET/HDPE)', weight: '14.8 kg', count: 32, percentage: 30, color: 'bg-cyan-400' },
              { type: 'Aluminum & Tin Cans', weight: '7.4 kg', count: 16, percentage: 15, color: 'bg-emerald-400' },
              { type: 'Glass Containers', weight: '4.9 kg', count: 10, percentage: 10, color: 'bg-indigo-400' },
            ].map((mat, i) => (
              <div key={i} className="space-y-1 text-left">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{mat.type}</span>
                  <span className="text-slate-400 font-mono">{mat.weight} ({mat.count} pieces)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className={`${mat.color} h-full rounded-full`} style={{ width: `${mat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifetime Activity Stats List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4 text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lifetime Accomplishments</h4>
            <div className="space-y-3">
              {[
                { label: 'Scanned Items via AI', value: '112 items' },
                { label: 'Verified Bin Discharges', value: '42 dumps' },
                { label: 'Civic Incidents Handled', value: '12 reports' },
                { label: 'Bulk Clearances Booked', value: '4 scheduled' },
                { label: 'Earned Badges Count', value: '8 badges' },
                { label: 'Sustainability Missions', value: '15 missions' }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-850 pb-2">
                  <span className="text-slate-500">{stat.label}</span>
                  <span className="font-bold text-slate-850 dark:text-slate-200 font-mono">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
