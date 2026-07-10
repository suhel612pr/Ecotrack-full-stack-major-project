import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Users, Landmark, Award, Leaf, Zap, RefreshCw, 
  MessageSquare, Calendar, ChevronRight, Search, ThumbsUp, Heart, Share2 
} from 'lucide-react';
import { UserProfile } from '../types';

interface CitizenCommunityProps {
  user: UserProfile;
}

interface FeedItem {
  id: string;
  type: 'milestone' | 'resolved' | 'achievement' | 'challenge' | 'summary';
  title: string;
  description: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  comments: number;
  district: string;
  icon: string;
  imageUrl?: string;
}

export default function CitizenCommunity({ user }: CitizenCommunityProps) {
  const [boardType, setBoardType] = useState<'city' | 'district' | 'workplace'>('district');
  const [metricFilter, setMetricFilter] = useState<'points' | 'carbon' | 'scans' | 'reports'>('points');
  const [feedSearch, setFeedSearch] = useState('');

  // Mock Leaderboard users database matching Authorized boundaries
  const cityLeaderboard = [
    { rank: 1, name: 'Siddharth Patel', points: 3450, carbon: 414, scans: 240, reports: 12, group: 'District Grid V', badge: '🥇 Green Titan' },
    { rank: 2, name: 'Alex Rivera', points: 3210, carbon: 385, scans: 198, reports: 8, group: 'District Grid III', badge: '🥈 Eco Overlord' },
    { rank: 3, name: 'Chloe Dubois', points: 3080, carbon: 369, scans: 185, reports: 15, group: 'District Grid V', badge: '🥉 Sustain Master' },
    { rank: 4, name: 'Yuki Tanaka', points: 2950, carbon: 354, scans: 210, reports: 9, group: 'District Grid II', badge: '🌿 Active Advocate' },
    { rank: 5, name: 'Fatima Al-Sayed', points: 2800, carbon: 336, scans: 165, reports: 11, group: 'District Grid I', badge: '🌿 Active Advocate' },
    { rank: 12, name: 'Marcus Vance', points: 690, carbon: 82, scans: 45, reports: 4, group: 'District Grid V', badge: '🍂 Waste Reducer' },
    { rank: 13, name: `${user.name} (You)`, points: user.points || 125, carbon: Math.round((user.points || 125) * 0.12), scans: 18, reports: 2, group: 'District Grid V', badge: '🌱 Eco Initiate', highlight: true }
  ];

  const districtLeaderboard = [
    { rank: 1, name: 'Siddharth Patel', points: 1450, carbon: 174, scans: 110, reports: 5, group: 'Sector Grid V', badge: '🏆 Green Legend' },
    { rank: 2, name: 'Chloe Dubois', points: 1080, carbon: 129, scans: 78, reports: 4, group: 'Sector Grid II', badge: '🌟 Eco Champion' },
    { rank: 3, name: 'Elena Rostova', points: 940, carbon: 112, scans: 55, reports: 3, group: 'Sector Grid IV', badge: '🌱 Sustain Master' },
    { rank: 4, name: 'Li Wei', points: 890, carbon: 106, scans: 49, reports: 2, group: 'Sector Grid V', badge: '🍂 Waste Reducer' },
    { rank: 5, name: `${user.name} (You)`, points: user.points || 125, carbon: Math.round((user.points || 125) * 0.12), scans: 18, reports: 2, group: 'Sector Grid V', badge: '🌱 Eco Initiate', highlight: true }
  ];

  const workplaceLeaderboard = [
    { rank: 1, name: 'Corporate Green Team A', points: 8450, carbon: 1014, scans: 610, reports: 35, group: 'Municipal HQ', badge: '🏢 Corporate Hero' },
    { rank: 2, name: 'EcoTech Office B', points: 7210, carbon: 865, scans: 498, reports: 28, group: 'District Depot', badge: '🏢 Carbon Neutral' },
    { rank: 3, name: 'Green Scholars Club', points: 5080, carbon: 609, scans: 310, reports: 15, group: 'Highschool C', badge: '🏫 Youth Advocates' },
    { rank: 10, name: `${user.name} (You)`, points: user.points || 125, carbon: Math.round((user.points || 125) * 0.12), scans: 18, reports: 2, group: 'Municipal Office', badge: '🌱 Eco Initiate', highlight: true }
  ];

  const getActiveLeaderboard = () => {
    switch (boardType) {
      case 'city': return cityLeaderboard;
      case 'workplace': return workplaceLeaderboard;
      default: return districtLeaderboard;
    }
  };

  const getMetricValue = (item: any) => {
    switch (metricFilter) {
      case 'carbon': return `${item.carbon} kg`;
      case 'scans': return `${item.scans} scans`;
      case 'reports': return `${item.reports} reports`;
      default: return `${item.points} PTS`;
    }
  };

  // Mock Community Activity Feed Items
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 'f_1',
      type: 'milestone',
      title: 'District Recycling Milestone Reached!',
      description: 'District Grid V has successfully recycled over 25,000 plastic bottles this quarter. This offsets enough fossil fuels to power our district library for 6 full months! Keep on scanning.',
      timestamp: '2 hours ago',
      likes: 142,
      hasLiked: false,
      comments: 18,
      district: 'District Grid V',
      icon: '🎉'
    },
    {
      id: 'f_2',
      type: 'resolved',
      title: 'Dumping Complaint Resolved: Hamilton Lanes',
      description: 'Thanks to active reports submitted by local residents, our sanitation EV crew cleared 400kg of illegal electronics dumping. Bins SB-105 & SB-106 are back online and fully calibrated.',
      timestamp: '4 hours ago',
      likes: 85,
      hasLiked: true,
      comments: 6,
      district: 'District Grid III',
      icon: '✅'
    },
    {
      id: 'f_3',
      type: 'challenge',
      title: 'New Community Mission Launched: Solar Spark',
      description: 'Get ready for the Summer Solar Spark! Scan at least 15 clear glass products this week to unlock the "Solar Citizen" badge and earn +250 Green Credits automatically.',
      timestamp: 'Yesterday',
      likes: 210,
      hasLiked: false,
      comments: 32,
      district: 'City-wide',
      icon: '⚡'
    },
    {
      id: 'f_4',
      type: 'achievement',
      title: 'Elena Rostova unlocked "Carbon Saver"!',
      description: 'Congratulations to Elena Rostova for diverting 50 kilograms of solid compost and saving 20kg of CO₂ greenhouse emissions from the environment. A true district warrior.',
      timestamp: 'Yesterday',
      likes: 54,
      hasLiked: false,
      comments: 2,
      district: 'District Grid V',
      icon: '🏆'
    },
    {
      id: 'f_5',
      type: 'summary',
      title: 'Weekly Sustainability Summary Report',
      description: 'A stellar week for our city: Over 12.8 metric tons of recyclable goods routed away from municipal landfill centers. AI Camera scanner accuracy hit an all-time high of 96.2% confidence. Keep up the green momentum!',
      timestamp: '3 days ago',
      likes: 310,
      hasLiked: false,
      comments: 41,
      district: 'All Districts',
      icon: '📈'
    }
  ]);

  const handleLike = (id: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: item.hasLiked ? item.likes - 1 : item.likes + 1,
          hasLiked: !item.hasLiked
        };
      }
      return item;
    }));
  };

  const filteredFeed = feedItems.filter(item => {
    if (!feedSearch) return true;
    const searchLower = feedSearch.toLowerCase();
    return item.title.toLowerCase().includes(searchLower) || 
           item.description.toLowerCase().includes(searchLower) ||
           item.district.toLowerCase().includes(searchLower);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Community Activity Feed (Left 7-columns) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Search and Feed Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                <Users className="h-5 w-5 mr-1.5 text-emerald-500" />
                District Community Activity
              </h3>
              <p className="text-xs text-slate-400">Stay up to date with environmental events, goals, and resolutions in your area.</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search community announcements or district updates..." 
              value={feedSearch}
              onChange={(e) => setFeedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {filteredFeed.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-12 rounded-3xl text-center space-y-2">
              <span className="text-3xl block">🔍</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-300">No community posts match your search</p>
              <p className="text-xs text-slate-400">Try searching for other terms like "milestone" or "dumping".</p>
            </div>
          ) : (
            filteredFeed.map(item => (
              <motion.div 
                layout
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm text-left space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-950/45 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-xl shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                        {item.type} • {item.district}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-50 mt-0.5 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Social Actions */}
                <div className="pt-3 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center space-x-1.5 hover:text-emerald-500 transition ${
                        item.hasLiked ? 'text-emerald-500 font-bold' : ''
                      }`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${item.hasLiked ? 'fill-emerald-500/10' : ''}`} />
                      <span>{item.likes}</span>
                    </button>
                    <div className="flex items-center space-x-1.5">
                      <MessageSquare className="h-4 w-4" />
                      <span>{item.comments} comments</span>
                    </div>
                  </div>

                  <button className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition">
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>

      {/* 2. High-Fidelity Leaderboard (Right 5-columns) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6 text-left self-start">
        
        {/* Header Title */}
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
          <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">EcoTrack Leaderboard</h4>
            <p className="text-[10px] text-slate-400">Authorized performance metrics of top district citizens.</p>
          </div>
        </div>

        {/* Board Scope Switcher (City, District, Workplace) */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/20 dark:border-slate-850/50">
          {[
            { id: 'district', label: 'District' },
            { id: 'city', label: 'City-wide' },
            { id: 'workplace', label: 'Workplaces' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setBoardType(opt.id as any)}
              className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-xl transition ${
                boardType === opt.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-50 dark:border-slate-850 pb-3">
          {[
            { id: 'points', label: 'Green Points' },
            { id: 'carbon', label: 'Carbon Saved' },
            { id: 'scans', label: 'AI Scans' },
            { id: 'reports', label: 'Reports' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMetricFilter(m.id as any)}
              className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded-full border transition ${
                metricFilter === m.id
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-black'
                  : 'bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-zinc-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Entries */}
        <div className="space-y-2">
          {getActiveLeaderboard().map((item, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-2xl flex items-center justify-between text-xs transition ${
                item.highlight 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-bold' 
                  : 'bg-slate-50/50 dark:bg-slate-950/20 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                {/* Rank Badge */}
                <span className={`font-mono font-black w-5 text-center text-xs ${
                  item.rank === 1 ? 'text-amber-500' : item.rank === 2 ? 'text-slate-400' : item.rank === 3 ? 'text-amber-650' : 'text-slate-400'
                }`}>
                  {item.rank}
                </span>
                <div className="truncate text-left">
                  <span className="block truncate font-bold text-slate-850 dark:text-slate-100">{item.name}</span>
                  <span className="block text-[9px] text-slate-400 font-mono font-medium leading-none mt-0.5">
                    {item.badge} • {item.group}
                  </span>
                </div>
              </div>

              <span className="font-mono font-extrabold text-slate-700 dark:text-slate-300 shrink-0 pl-2">
                {getMetricValue(item)}
              </span>
            </div>
          ))}
        </div>

        {/* Extra Leaderboard Bottom Notice */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/30 dark:border-zinc-800/40 rounded-2xl text-[10px] text-zinc-400 leading-relaxed text-left">
          🌿 <strong>Privacy Notice:</strong> Leaderboard visibility is configured according to city open-data frameworks. You can toggle anonymous display anytime in profile configurations.
        </div>

      </div>

    </div>
  );
}
