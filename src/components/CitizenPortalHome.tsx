import React from 'react';
import { motion } from 'motion/react';
import { SmartBin, UserProfile, CivicReport } from '../types';
import { 
  Award, Leaf, MapPin, Bell, Calendar, Flame, CheckCircle, 
  ChevronRight, Sparkles, Navigation, Info, ShieldCheck, ListTodo 
} from 'lucide-react';

interface CitizenPortalHomeProps {
  user: UserProfile;
  bins: SmartBin[];
  reports: CivicReport[];
  onNavigateTab: (tab: 'scanner' | 'map' | 'report' | 'rewards' | 'bulk' | 'recycling') => void;
}

export default function CitizenPortalHome({ user, bins, reports, onNavigateTab }: CitizenPortalHomeProps) {
  // Mock Community Leaderboard
  const leaderboard = [
    { rank: 1, name: 'Alex Rivera', points: 1450, badge: '🏆 Green Legend' },
    { rank: 2, name: 'Siddharth Patel', points: 1210, badge: '🌟 Eco Champion' },
    { rank: 3, name: 'Chloe Dubois', points: 1080, badge: '🌱 Sustain Master' },
    { rank: 11, name: 'Marcus Vance', points: 690, badge: '🌿 Active Advocate' },
    { rank: 12, name: 'Elena Rostova (You)', points: 640, badge: '🌿 Active Advocate', highlight: true },
    { rank: 13, name: 'Li Wei', points: 590, badge: '🍂 Waste reducer' }
  ];

  // Mock Recycling Centers
  const recyclingCenters = [
    { name: 'Central District EcoDepot', distance: '0.4 mi', materials: ['Plastics', 'Aluminum', 'Glass'], hours: '8 AM - 6 PM' },
    { name: 'Mission Green-Cycle Hub', distance: '1.2 mi', materials: ['E-Waste', 'Paper', 'Compost'], hours: '9 AM - 7 PM' }
  ];

  // Count pending complaints
  const myPendingComplaints = reports.filter(r => r.status !== 'completed').length;

  return (
    <div className="space-y-6">
      
      {/* Premium Dashboard Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 border-b border-zinc-200/40 dark:border-zinc-800/60 pb-4">
          <div>
            <span className="text-[9px] font-bold font-mono tracking-wider text-zinc-400 uppercase">CITIZEN STATUS RADAR</span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans mt-0.5">
              Good morning, {user.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              You are ranked in the top <strong className="text-zinc-800 dark:text-zinc-200">8% of local recyclers</strong> this week.
            </p>
          </div>
          
          {/* Micro Action Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-full flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              14-DAY COMMUNITY STREAK
            </span>
            <span className="text-[9px] font-mono font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/50 px-2.5 py-1 rounded-full">
              📍 SECTOR GRID V
            </span>
          </div>
        </div>

        {/* Micro-metrics Grid: 4 compact bento cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/60 rounded-xl space-y-1 shadow-sm">
            <span className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wide">City Health Index</span>
            <span className="block text-base font-bold text-zinc-900 dark:text-zinc-50">94% Optimal</span>
            <span className="block text-[10px] text-zinc-400 leading-none">Cleanliness levels excellent</span>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/60 rounded-xl space-y-1 shadow-sm">
            <span className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wide">Carbon Saved</span>
            <span className="block text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{(user.points * 0.12).toFixed(1)} kg CO₂</span>
            <span className="block text-[10px] text-zinc-400 leading-none">Equiv. {Math.round(user.points / 25)} saplings planted</span>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/60 rounded-xl space-y-1 shadow-sm">
            <span className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wide">Accrued Credits</span>
            <span className="block text-base font-bold text-amber-600 dark:text-amber-400 font-mono">{user.points} PTS</span>
            <span className="block text-[10px] text-zinc-400 leading-none">Redeemable in rewards vault</span>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/60 rounded-xl space-y-1 shadow-sm">
            <span className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wide">Current Weather</span>
            <span className="block text-base font-bold text-zinc-900 dark:text-zinc-50">72°F Sunny</span>
            <span className="block text-[10px] text-zinc-400 leading-none">Ideal sorting conditions</span>
          </div>
        </div>

        {/* Minimalist AI Summary Bar */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/30 dark:border-zinc-800/50 rounded-xl flex items-center space-x-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="px-2 py-0.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold font-mono text-[8px] rounded tracking-wide shrink-0">
            AI SUMMARY
          </span>
          <p className="leading-relaxed text-[11px] text-zinc-500 dark:text-zinc-400">
            Your neighborhood smart bins are online. Zero anomalies reported in District Grid V. Sanitation EVs deployed on Hamilton-optimal pathways to reduce carbon emissions by 40% today.
          </p>
        </div>
      </div>

      {/* Grid: Cleanliness score & Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cleanliness Index (Left 7-columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">REALTIME CITY FEEDBACK</span>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">Today's City Cleanliness Index</h4>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                Excellent (Optimal)
              </span>
            </div>

            {/* Dial Representation */}
            <div className="flex items-center space-x-6 my-6">
              <div className="relative flex items-center justify-center shrink-0">
                {/* SVG circular track */}
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-emerald-500" strokeWidth="8" fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * 94) / 100}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="block text-2xl font-black text-slate-900 dark:text-white leading-none">94%</span>
                  <span className="text-[8px] font-mono text-slate-400">INDEX</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The municipal sensor mesh indicates downtown waste collection is <strong className="text-slate-900 dark:text-slate-200">94% optimal</strong>. Fleet dispatchers cleared 18 smart bins in the last 4 hours.
                </p>
                <div className="flex items-center space-x-4 pt-2 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" /> Bins Online
                  </span>
                  <span className="flex items-center text-cyan-500">
                    <Navigation className="h-3 w-3 mr-1" /> Route Optimized
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button 
              onClick={() => onNavigateTab('scanner')}
              className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-100 dark:border-slate-850 rounded-xl hover:bg-emerald-500/5 hover:border-emerald-500/20 text-center transition"
            >
              <span className="block text-lg mb-0.5">📸</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-none">Scan Item</span>
            </button>
            <button 
              onClick={() => onNavigateTab('report')}
              className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-100 dark:border-slate-850 rounded-xl hover:bg-rose-500/5 hover:border-rose-500/20 text-center transition"
            >
              <span className="block text-lg mb-0.5">⚠️</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-none">Quick Report</span>
            </button>
            <button 
              onClick={() => onNavigateTab('bulk')}
              className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-100 dark:border-slate-850 rounded-xl hover:bg-cyan-500/5 hover:border-cyan-500/20 text-center transition col-span-2 sm:col-span-1"
            >
              <span className="block text-lg mb-0.5">🗓️</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-none">Bulk Pickup</span>
            </button>
          </div>
        </div>

        {/* Community Leaderboard (Right 5-columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-2">
            <Award className="h-5 w-5 text-amber-500" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Community Leaderboard</h4>
              <p className="text-[10px] text-slate-400">Top carbon savers this month in District Grid V</p>
            </div>
          </div>

          <div className="space-y-2">
            {leaderboard.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-2 rounded-xl flex items-center justify-between text-xs transition ${
                  item.highlight 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-semibold' 
                    : 'bg-slate-50/50 dark:bg-slate-950/20 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-slate-400 w-4 text-center">{item.rank}</span>
                  <div>
                    <span className="block">{item.name}</span>
                    <span className="block text-[9px] text-slate-400 font-normal">{item.badge}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{item.points} PTS</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Nearby Bins & Recycling Centers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nearby Smart Bins */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Nearby Smart Bins</h4>
                <p className="text-[10px] text-slate-400">Check capacity and status of nearest waste nodes</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('map')}
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-xs font-semibold flex items-center"
            >
              <span>View Map</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {bins.slice(0, 3).map(bin => {
              const isFull = bin.fillLevel >= 80;
              return (
                <div key={bin.id} className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                  <div className="space-y-0.5 truncate max-w-[70%]">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{bin.id} • {bin.category}</span>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{bin.name}</h5>
                    <span className="text-[9px] text-slate-500 block truncate">{bin.address}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`block text-xs font-mono font-extrabold ${isFull ? 'text-rose-500 animate-pulse' : 'text-green-600'}`}>
                      {Math.round(bin.fillLevel)}%
                    </span>
                    <span className="text-[8px] text-slate-400 block font-mono">Capacity</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nearby Recycling Centers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Eco Recycling Centers</h4>
                <p className="text-[10px] text-slate-400">Deposit specialized materials (E-Waste, Glass, Batteries)</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigateTab('recycling')}
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-xs font-semibold flex items-center"
            >
              <span>All Centers</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recyclingCenters.map((center, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">{center.name}</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {center.materials.map((m, i) => (
                      <span key={i} className="text-[8px] font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">{center.distance}</span>
                  <span className="text-[8px] text-slate-400 block">{center.hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Recent Complaints & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* My Recent Reports (Left 7-columns) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <div className="flex items-center space-x-2">
              <ListTodo className="h-5 w-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Cleanliness Reports</h4>
                <p className="text-[10px] text-slate-400">Track status of your submitted civic alerts</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
              {myPendingComplaints} PENDING
            </span>
          </div>

          <div className="space-y-2 max-h-[160px] overflow-y-auto">
            {reports.slice(0, 2).map(rep => (
              <div 
                key={rep.id} 
                onClick={() => onNavigateTab('report')}
                className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-850/50 transition"
              >
                <div className="space-y-0.5 truncate max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1 py-0.2 rounded font-bold uppercase">
                      {rep.id}
                    </span>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{rep.title}</h5>
                  </div>
                  <span className="text-[9px] text-slate-400 block truncate font-mono">📍 {rep.location}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase ${
                  rep.status === 'completed' ? 'text-green-600' : rep.status === 'dispatched' ? 'text-cyan-500' : 'text-amber-500'
                }`}>
                  ● {rep.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications (Right 5-columns) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-2">
            <Bell className="h-5 w-5 text-emerald-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">System Notifications</h4>
              <p className="text-[10px] text-slate-400">EcoTrack citizen ledger alerts</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-green-50/50 dark:bg-green-950/10 border border-green-500/10 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-green-700 dark:text-green-400">Credits Deposited</span>
                <span className="text-[10px] font-mono text-slate-400">10:45 AM</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Deposited <strong>+25 PTS</strong> to your environmental balance for report verification of SB-104.
              </p>
            </div>
            <div className="p-2.5 bg-slate-50/50 dark:bg-slate-950/10 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-700 dark:text-slate-300">Transit Pass Redeemable</span>
                <span className="text-[10px] font-mono text-slate-400">Yesterday</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Your Eco Balance is enough to claim the <strong>1-Month Transit Pass</strong>! Redeem in the Rewards Vault.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
