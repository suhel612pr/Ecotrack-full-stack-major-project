import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartBin, CivicReport, UserProfile, WasteCategory } from '../types';
import AICameraScanner from '../components/AICameraScanner';
import SmartBinMap from '../components/SmartBinMap';
import CitizenPortalHome from '../components/CitizenPortalHome';
import CitizenComplaintForm from '../components/CitizenComplaintForm';
import CitizenBulkPickup from '../components/CitizenBulkPickup';
import CitizenRecyclingCenters from '../components/CitizenRecyclingCenters';
import CitizenJourney from '../components/CitizenJourney';
import CitizenAchievements from '../components/CitizenAchievements';
import CitizenCommunity from '../components/CitizenCommunity';
import CitizenNotifications from '../components/CitizenNotifications';
import { 
  Leaf, Award, MapPin, Send, PlusCircle, CheckCircle2, 
  ShoppingBag, Clock, ShieldAlert, History, Map, Home, 
  Trash2, HelpCircle, Truck, Building, Gift, Bell, Trophy, Zap
} from 'lucide-react';

interface CitizenPortalProps {
  user: UserProfile;
  bins: SmartBin[];
  reports: CivicReport[];
  onEarnPoints: (points: number) => void;
  onAddReport: (report: Partial<CivicReport>) => void;
  activeTab?: 'home' | 'scanner' | 'map' | 'complaints' | 'bulk' | 'recycling' | 'rewards' | 'journey' | 'achievements' | 'community' | 'notifications';
  onTabChange?: (tab: 'home' | 'scanner' | 'map' | 'complaints' | 'bulk' | 'recycling' | 'rewards' | 'journey' | 'achievements' | 'community' | 'notifications') => void;
}

export default function CitizenPortal({ 
  user, bins, reports, onEarnPoints, onAddReport,
  activeTab: propActiveTab, onTabChange: propOnTabChange
}: CitizenPortalProps) {
  const [internalTab, setInternalTab] = useState<'home' | 'scanner' | 'map' | 'complaints' | 'bulk' | 'recycling' | 'rewards' | 'journey' | 'achievements' | 'community' | 'notifications'>('home');
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;
  const setActiveTab = (tab: any) => {
    if (propOnTabChange) {
      propOnTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  // Expanded high-fidelity rewards catalogue representing Phase 5 requirements
  const rewards = [
    { id: 'pass', name: '1-Month Transit Pass', points: 300, desc: 'Public transport discount: Unlimited municipal subway & electric bus rides.', icon: '🚇' },
    { id: 'bag', name: 'Zero-Waste Canvas Tote Bag', points: 80, desc: 'Eco-friendly merchandise: Durable organic cotton shopping bag.', icon: '🛍️' },
    { id: 'hoodie', name: 'Organic Eco Hoodie', points: 200, desc: 'Eco-friendly merchandise: Recycled cotton warmth & custom print.', icon: '👕' },
    { id: 'garden', name: 'Starter Recycling/Garden Kit', points: 120, desc: 'Recycling kit: Organic herb seeds, bio-pots, and compost kit.', icon: '🌱' },
    { id: 'fame', name: 'Hall of Fame Highlight', points: 400, desc: 'Community recognition: High profile highlight on municipal monitors.', icon: '⭐' },
    { id: 'utility', name: '$10 Municipal Utility Rebate', points: 250, desc: 'Utility credit toward household solar-grid accounts.', icon: '⚡' }
  ];

  const [redeemedItem, setRedeemedItem] = useState<string | null>(null);

  const handleRedeem = (rewardId: string, cost: number) => {
    if (user.points >= cost) {
      onEarnPoints(-cost); // Deduct points
      setRedeemedItem(rewardId);
      setTimeout(() => setRedeemedItem(null), 3000);
    } else {
      alert('Insufficient Green Credits. Earn more by scanning and depositing recyclable materials!');
    }
  };

  const handleBulkSuccess = (details: any) => {
    // Add custom mock database bulk request log or trigger reward deposit
    onEarnPoints(15); // deposit points for schedule
    alert(`Bulk Waste Pickup booked for ${details.preferred_date}! Cost: $${details.cost.toFixed(2)}. +15 green points deposited.`);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Subnavigation Headers */}
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/60 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-6 min-w-[900px] sm:min-w-0 pb-px">
          {[
            { id: 'home', label: 'Dashboard', icon: <Home className="h-3.5 w-3.5" /> },
            { id: 'journey', label: 'Sustainability Journey', icon: <Leaf className="h-3.5 w-3.5" /> },
            { id: 'achievements', label: 'Achievements & Challenges', icon: <Award className="h-3.5 w-3.5" /> },
            { id: 'community', label: 'Community Hub', icon: <Trophy className="h-3.5 w-3.5" /> },
            { id: 'rewards', label: 'Rewards Vault', icon: <Gift className="h-3.5 w-3.5" /> },
            { id: 'notifications', label: 'Notifications Center', icon: <Bell className="h-3.5 w-3.5" /> },
            { id: 'scanner', label: 'AI Scanner', icon: <Trash2 className="h-3.5 w-3.5" /> },
            { id: 'map', label: 'Smart Bins Map', icon: <Map className="h-3.5 w-3.5" /> },
            { id: 'complaints', label: 'Report Incident', icon: <History className="h-3.5 w-3.5" /> },
            { id: 'bulk', label: 'Bulk Pickup', icon: <Truck className="h-3.5 w-3.5" /> },
            { id: 'recycling', label: 'Recycling Hubs', icon: <Building className="h-3.5 w-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-3 text-[11px] font-medium tracking-tight border-b-2 transition-all duration-200 focus:outline-none shrink-0 ${
                activeTab === tab.id
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-950 dark:text-zinc-50 font-semibold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dynamic Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'home' && (
            <CitizenPortalHome 
              user={user} 
              bins={bins} 
              reports={reports} 
              onNavigateTab={(tab) => setActiveTab(tab === 'report' ? 'complaints' : tab as any)} 
            />
          )}

          {activeTab === 'journey' && (
            <CitizenJourney user={user} />
          )}

          {activeTab === 'achievements' && (
            <CitizenAchievements user={user} onEarnPoints={onEarnPoints} />
          )}

          {activeTab === 'community' && (
            <CitizenCommunity user={user} />
          )}

          {activeTab === 'notifications' && (
            <CitizenNotifications onEarnPoints={onEarnPoints} />
          )}

          {activeTab === 'scanner' && (
            <div className="space-y-6">
              <AICameraScanner onEarnPoints={onEarnPoints} />
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center">
                    <Map className="h-5 w-5 mr-1.5 text-emerald-600" /> Nearby Smart Bins & Incidents
                  </h3>
                  <p className="text-xs text-slate-400">Locate garbage bins, check real-time fill levels, and discover citizen reports.</p>
                </div>
              </div>
              <SmartBinMap 
                bins={bins} 
                reports={reports} 
                onQuickReport={(bin) => {
                  onAddReport({
                    title: `[Overflowing Bin] Smart Bin ${bin.name} alert`,
                    description: `Automated alert of overflowing status at ${bin.address}.`,
                    category: bin.category,
                    location: bin.address
                  });
                  setActiveTab('complaints');
                }}
              />
            </div>
          )}

          {activeTab === 'complaints' && (
            <CitizenComplaintForm 
              reports={reports} 
              onAddReport={onAddReport} 
            />
          )}

          {activeTab === 'bulk' && (
            <CitizenBulkPickup onSuccess={handleBulkSuccess} />
          )}

          {activeTab === 'recycling' && (
            <CitizenRecyclingCenters />
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3 text-center sm:text-left">
                  <span className="text-3xl">🎁</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-amber-400 text-sm">Citizen Green Rewards Vault</h3>
                    <p className="text-xs text-slate-500">Redeem accrued environmental points for eco-friendly public transit passes & utility rebates.</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-amber-500 text-white rounded-2xl font-mono font-bold text-xs shrink-0">
                  AVAILABLE BALANCE: {user.points} CREDITS
                </div>
              </div>

              {/* Grid Catalogue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map(rw => {
                  const canAfford = user.points >= rw.points;
                  const isRedeeming = redeemedItem === rw.id;

                  return (
                    <div 
                      key={rw.id}
                      className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
                        isRedeeming 
                          ? 'bg-green-50 dark:bg-green-950/40 border-green-600 shadow-lg scale-102'
                          : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/80 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between space-x-3">
                        <div className="text-3xl p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-850 shrink-0">
                          {rw.icon}
                        </div>
                        <div className="space-y-1 text-left">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rw.name}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{rw.desc}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-amber-500 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full block">
                            {rw.points} PTS
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">MUNICIPAL REWARD TOKEN</span>
                        {isRedeeming ? (
                          <span className="text-xs font-bold text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> REDEEMED / EMAIL DISPATCHED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRedeem(rw.id, rw.points)}
                            disabled={!canAfford}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition flex items-center space-x-1 ${
                              canAfford 
                                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>REDEEM REWARD</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
