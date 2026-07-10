import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Search, Trash2, Check, Filter, Calendar, Award, 
  Flame, Gift, HelpCircle, AlertCircle, RefreshCw, MailOpen 
} from 'lucide-react';

interface CitizenNotificationsProps {
  onEarnPoints: (points: number) => void;
}

interface NotificationItem {
  id: string;
  category: 'achievement' | 'challenge' | 'reward' | 'report' | 'summary' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  pointsValue?: number;
}

export default function CitizenNotifications({ onEarnPoints }: CitizenNotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'achievement' | 'challenge' | 'report' | 'announcement'>('all');
  const [search, setSearch] = useState('');

  // Initial rich sample notifications catering to the Phase 5 requirements
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      category: 'achievement',
      title: '🏆 Achievement Unlocked: Eco Beginner!',
      description: 'Congratulations! You reached profile Level 2. +100 Green Points have been successfully credited to your ecological balance.',
      timestamp: '10:45 AM',
      isRead: false,
      pointsValue: 100
    },
    {
      id: 'notif_2',
      category: 'challenge',
      title: '🔥 Challenge Completed: Scan 10 Recyclables',
      description: 'Incredible work! You completed the weekly mission by classifying 10 separate aluminum, paper, and plastic items. +80 Green Points granted.',
      timestamp: '9:12 AM',
      isRead: false,
      pointsValue: 80
    },
    {
      id: 'notif_3',
      category: 'reward',
      title: '🎁 Transit Pass Voucher Dispatched',
      description: 'Your redemption request for the "1-Month Transit Pass" was verified. Your digital transit bar-code has been sent to your registered email.',
      timestamp: 'Yesterday',
      isRead: true
    },
    {
      id: 'notif_4',
      category: 'report',
      title: '✅ Report Status Update: Resolved SB-104',
      description: 'The overflow complaint you logged at Hamilton Smart Bin has been processed and resolved. Sanitation EV unit 04 swept and emptied the sector grid.',
      timestamp: 'Yesterday',
      isRead: false
    },
    {
      id: 'notif_5',
      category: 'summary',
      title: '📈 Weekly Citizenship Sustainability Summary',
      description: 'Your weekly eco report is ready! You successfully diverted 8.2 kilograms of waste, saving 4.5kg of carbon emissions. You rank in the top 8% of local recyclers.',
      timestamp: '2 days ago',
      isRead: true
    },
    {
      id: 'notif_6',
      category: 'announcement',
      title: '📢 Community Announcement: Electronic Drive',
      description: 'Municipal Sanitation is hosting a zero-cost hazardous electronic waste pickup drive at Mission Green Hub this Saturday. Clean out your old gear and earn double credits!',
      timestamp: '3 days ago',
      isRead: true
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        // If it was unread and has a pointsValue, let's claim it!
        if (!n.isRead && n.pointsValue) {
          onEarnPoints(n.pointsValue);
        }
        return { ...n, isRead: true };
      }
      return n;
    }));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => {
      if (!n.isRead && n.pointsValue) {
        onEarnPoints(n.pointsValue);
      }
      return { ...n, isRead: true };
    }));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || n.category === filter;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Award className="h-4.5 w-4.5 text-yellow-500" />;
      case 'challenge': return <Flame className="h-4.5 w-4.5 text-amber-500" />;
      case 'reward': return <Gift className="h-4.5 w-4.5 text-rose-500" />;
      case 'report': return <Check className="h-4.5 w-4.5 text-blue-500" />;
      default: return <Bell className="h-4.5 w-4.5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Global Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <Bell className="h-5 w-5 mr-1.5 text-emerald-500" />
              Citizenship Notifications Center
            </h3>
            <p className="text-xs text-slate-400">Keep track of your environmental milestones, rewards, challenges, and resolved neighborhood alerts.</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-150 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200/40 dark:border-slate-800/80 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 transition flex items-center gap-1 uppercase tracking-wider"
            >
              <MailOpen className="h-3 w-3" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/15 dark:hover:bg-rose-950/30 border border-rose-500/10 rounded-xl text-[10px] font-bold text-rose-600 dark:text-rose-400 transition flex items-center gap-1 uppercase tracking-wider"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search alerts, vouchers, achievements, or summary topics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* 2. Categorized Tabs & Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-left">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'achievement', label: 'Achievements' },
          { id: 'challenge', label: 'Challenges' },
          { id: 'report', label: 'Reports' },
          { id: 'announcement', label: 'Announcements' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-2xl border transition shrink-0 ${
              filter === tab.id
                ? 'bg-emerald-500 text-zinc-950 border-emerald-500'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Notifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-12 rounded-3xl text-center space-y-2"
            >
              <span className="text-3xl block">🔔</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-300">Clean Notification Inbox</p>
              <p className="text-xs text-slate-400">All alerts cleared or no matching categories found.</p>
            </motion.div>
          ) : (
            filteredNotifications.map(n => (
              <motion.div
                layout
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className={`p-4 rounded-3xl border transition flex items-start gap-4 text-left ${
                  n.isRead 
                    ? 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-850/80' 
                    : 'bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500/20'
                }`}
              >
                {/* Category Icon indicator */}
                <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex items-center justify-center shrink-0">
                  {getCategoryIcon(n.category)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold text-sm ${n.isRead ? 'text-slate-800 dark:text-slate-200' : 'text-slate-950 dark:text-white font-black'}`}>
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {n.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {n.description}
                  </p>

                  {/* Actions Bar */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[9px] rounded hover:bg-emerald-500/15 transition uppercase"
                        >
                          Mark as Read {n.pointsValue ? `(+${n.pointsValue} PTS)` : ''}
                        </button>
                      )}
                      {n.isRead && (
                        <span className="text-[9px] font-mono font-medium text-slate-400 flex items-center gap-0.5">
                          ✓ Read
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDelete(n.id)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 rounded transition"
                      title="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
