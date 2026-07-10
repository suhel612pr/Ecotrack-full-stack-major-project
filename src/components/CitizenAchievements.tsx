import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Sparkles, CheckCircle2, ChevronRight, RefreshCw, 
  Flame, Lock, Trophy, Zap, Shield, HelpCircle, AlertCircle, Play 
} from 'lucide-react';
import { UserProfile } from '../types';

interface CitizenAchievementsProps {
  user: UserProfile;
  onEarnPoints: (points: number) => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  unlockedAt?: string;
  pointsReward: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly';
  target: number;
  current: number;
  reward: number;
  expiryDays: number;
}

export default function CitizenAchievements({ user, onEarnPoints }: CitizenAchievementsProps) {
  // Experience and levels state
  const points = user.points || 125;
  const lifetimeXp = points * 10; // Convert 1 green point to 10 XP
  
  // XP per level model: each level needs 500 XP
  const xpPerLevel = 500;
  const currentLevel = Math.floor(lifetimeXp / xpPerLevel) + 1;
  const currentXp = lifetimeXp % xpPerLevel;
  const xpNeeded = xpPerLevel;
  const xpPercentage = (currentXp / xpNeeded) * 100;

  // Track simulated level ups for celebration overlay
  const [celebrateLevelUp, setCelebrateLevelUp] = useState<number | null>(null);

  // Default Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_scan', name: 'First Scan', description: 'Scan your first recyclable item using AI camera.', icon: '📸', category: 'Scanning', targetCount: 1, currentCount: 1, unlocked: true, unlockedAt: '2026-06-12', pointsReward: 50 },
    { id: 'first_report', name: 'First Report', description: 'Submit an incident report for overflowing trash bins.', icon: '⚠️', category: 'Reporting', targetCount: 1, currentCount: 1, unlocked: true, unlockedAt: '2026-06-14', pointsReward: 50 },
    { id: 'eco_beginner', name: 'Eco Beginner', description: 'Reach Level 2 in your municipal citizenship profile.', icon: '🌱', category: 'Level', targetCount: 1, currentCount: 1, unlocked: true, unlockedAt: '2026-06-18', pointsReward: 100 },
    { id: 'recycling_expert', name: 'Recycling Expert', description: 'Deposit 25 glass, plastic or metal items successfully.', icon: '♻️', category: 'Scanning', targetCount: 25, currentCount: 18, unlocked: false, pointsReward: 150 },
    { id: 'community_hero', name: 'Community Hero', description: 'Submit 5 cleanliness reports that get resolved.', icon: '🦸', category: 'Reporting', targetCount: 5, currentCount: 3, unlocked: false, pointsReward: 200 },
    { id: 'smart_citizen', name: 'Smart Citizen', description: 'Maintain a 14-day activity streak scanning/reporting.', icon: '📱', category: 'Streak', targetCount: 14, currentCount: 14, unlocked: true, unlockedAt: '2026-07-08', pointsReward: 150 },
    { id: 'carbon_saver', name: 'Carbon Saver', description: 'Divert enough trash to save 20kg of carbon emissions.', icon: '☁️', category: 'Impact', targetCount: 20, currentCount: 15, unlocked: false, pointsReward: 250 },
    { id: 'ai_explorer', name: 'AI Explorer', description: 'Achieve 95% confidence level on 10 scanner matches.', icon: '🤖', category: 'Scanning', targetCount: 10, currentCount: 7, unlocked: false, pointsReward: 120 },
    { id: 'waste_warrior', name: 'Waste Warrior', description: 'Schedule 3 bulk waste or hazardous pickups.', icon: '🚛', category: 'Bulk', targetCount: 3, currentCount: 1, unlocked: false, pointsReward: 100 },
    { id: 'sustain_champ', name: 'Sustainability Champion', description: 'Unlock all standard badges in EcoTrack.', icon: '🏆', category: 'Meta', targetCount: 9, currentCount: 5, unlocked: false, pointsReward: 500 }
  ]);

  // Default Challenges
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 'ch_1', title: 'Scan 10 Recyclable Items', description: 'Sort plastic, paper, and glass with the AI Camera.', type: 'weekly', target: 10, current: 8, reward: 80, expiryDays: 3 },
    { id: 'ch_2', title: 'Submit 3 Valid Reports', description: 'Clean up city lanes by reporting municipal overflows.', type: 'weekly', target: 3, current: 2, reward: 120, expiryDays: 5 },
    { id: 'ch_3', title: 'Earn 500 Green Points', description: 'Recycle specialized waste and complete bulk assignments.', type: 'monthly', target: 500, current: 125, reward: 300, expiryDays: 22 },
    { id: 'ch_4', title: 'Complete 5 Recycling Actions', description: 'Dispose of garbage nodes at verified smart bins.', type: 'weekly', target: 5, current: 5, reward: 100, expiryDays: 1 },
    { id: 'ch_5', title: 'Maintain a 7-day Streak', description: 'Keep your eco momentum active daily.', type: 'weekly', target: 7, current: 7, reward: 150, expiryDays: 2 }
  ]);

  // Simulation controls to demonstrate level ups & points deposits
  const simulateAction = (xpToAdd: number) => {
    // Standard simulation triggers points (1 Green Point = 10 XP)
    const pointsToAdd = Math.floor(xpToAdd / 10);
    
    // Check if new points will advance level
    const newPoints = points + pointsToAdd;
    const newLifetimeXp = newPoints * 10;
    const newLevel = Math.floor(newLifetimeXp / xpPerLevel) + 1;
    
    onEarnPoints(pointsToAdd);

    if (newLevel > currentLevel) {
      setCelebrateLevelUp(newLevel);
    }

    // Advance some challenge counts randomly for visual feedback
    setChallenges(prev => prev.map(ch => {
      if (ch.current < ch.target) {
        return { ...ch, current: Math.min(ch.target, ch.current + 1) };
      }
      return ch;
    }));

    // Advance achievements count
    setAchievements(prev => prev.map(ach => {
      if (!ach.unlocked && ach.currentCount < ach.targetCount) {
        const nextCount = ach.currentCount + 1;
        const isNowUnlocked = nextCount >= ach.targetCount;
        return {
          ...ach,
          currentCount: nextCount,
          unlocked: isNowUnlocked,
          unlockedAt: isNowUnlocked ? new Date().toISOString().substring(0, 10) : undefined
        };
      }
      return ach;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Celebration Level Up Banner overlay */}
      <AnimatePresence>
        {celebrateLevelUp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4"
          >
            <div className="bg-slate-900 border border-emerald-500/30 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent pointer-events-none" />
              <div className="text-6xl animate-bounce">🎉</div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">LEVEL ACQUIRED</span>
                <h3 className="text-3xl font-black text-white font-sans leading-none">Level {celebrateLevelUp}!</h3>
                <p className="text-xs text-slate-400">
                  Congratulations! Your sustainability rating has improved. You have earned <strong>+50 bonus Green Points</strong>.
                </p>
              </div>
              <div className="flex justify-center">
                <span className="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl font-bold text-xs font-mono shadow-md">
                  REWARDS CREDITED
                </span>
              </div>
              <button 
                onClick={() => setCelebrateLevelUp(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold transition border border-slate-700"
              >
                Dismiss Celebration
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Level & XP Progress Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-550 to-teal-650 text-white flex items-center justify-center text-xl font-black shadow-lg">
              {currentLevel}
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">CITIZEN EXPERIENCE</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Rank: Level {currentLevel} Specialist</h3>
              <p className="text-xs text-slate-400 leading-none mt-0.5">Total accrued: <span className="font-mono font-bold">{lifetimeXp}</span> XP (Lifetime)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {/* Quick action button to simulate civic recycling to increase XP */}
            <button
              onClick={() => simulateAction(120)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl text-[10px] font-bold shadow-md flex items-center space-x-1.5 transition uppercase tracking-wider shrink-0"
            >
              <Play className="h-3 w-3 fill-zinc-950" />
              <span>Simulate Eco Scan (+120 XP)</span>
            </button>
            <span className="text-[10px] font-mono text-zinc-400 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-xl">
              🔥 14-DAY STREAK
            </span>
          </div>
        </div>

        {/* XP Progress Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-slate-400">Level Progress</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {currentXp} <span className="text-slate-400 font-normal">/</span> {xpNeeded} XP
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" 
              style={{ width: `${xpPercentage}%` }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ type: 'spring', stiffness: 80 }}
            />
          </div>
          <span className="block text-[10px] text-slate-400 text-left">
            Earn <strong>{xpNeeded - currentXp} XP</strong> to advance to Level {currentLevel + 1} and unlock additional Rewards discounts.
          </span>
        </div>
      </div>

      {/* 2. Challenge Grid (Weekly / Monthly Missions) */}
      <div className="space-y-4">
        <div className="text-left">
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
            <Flame className="h-5 w-5 mr-1.5 text-amber-500 animate-pulse" /> Weekly & Monthly Citizen Challenges
          </h4>
          <p className="text-xs text-slate-400">Achieve these municipal targets to secure massive Green Point bonuses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map(ch => {
            const isCompleted = ch.current >= ch.target;
            const progressPct = (ch.current / ch.target) * 100;

            return (
              <div 
                key={ch.id} 
                className={`p-5 rounded-3xl border text-left flex flex-col justify-between transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
                    : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      ch.type === 'weekly' ? 'bg-indigo-500/15 text-indigo-500' : 'bg-pink-500/15 text-pink-500'
                    }`}>
                      {ch.type} challenge
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center">
                      ⏱️ {ch.expiryDays}d left
                    </span>
                  </div>

                  <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-snug mt-1.5">{ch.title}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ch.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {ch.current} / {ch.target}
                    </span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center">
                      💎 +{ch.reward} Green Points
                    </span>
                    {isCompleted ? (
                      <span className="text-emerald-500 font-bold flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-0.5" /> Claimed
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Achievement Badges Gallery */}
      <div className="space-y-4">
        <div className="text-left">
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
            <Trophy className="h-5 w-5 mr-1.5 text-yellow-500" /> Locked & Unlocked Achievements Gallery
          </h4>
          <p className="text-xs text-slate-400">Unlock standard, rare, and legendary citizenship medallions through daily action.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map(ach => {
            const isCompleted = ach.unlocked;
            const progressPct = (ach.currentCount / ach.targetCount) * 100;

            return (
              <div 
                key={ach.id} 
                className={`p-4 rounded-3xl border text-center relative flex flex-col justify-between items-center space-y-3 transition ${
                  isCompleted 
                    ? 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 shadow-sm' 
                    : 'bg-slate-50/50 dark:bg-slate-950/15 border-transparent opacity-80'
                }`}
              >
                {/* Visual Icon Badge */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border shadow-inner ${
                    isCompleted 
                      ? 'bg-yellow-500/10 border-yellow-500/20' 
                      : 'bg-slate-200/50 dark:bg-slate-850/50 border-transparent text-slate-300'
                  }`}>
                    {isCompleted ? ach.icon : '🔒'}
                  </div>
                  {isCompleted && (
                    <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-zinc-950 p-0.5 rounded-full border-2 border-white dark:border-slate-900">
                      <Sparkles className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-center">
                  <h5 className={`font-bold text-xs truncate max-w-full ${isCompleted ? 'text-slate-850 dark:text-white' : 'text-slate-400'}`}>
                    {ach.name}
                  </h5>
                  <p className="text-[9px] text-slate-400 leading-snug line-clamp-2 min-h-[26px]">
                    {ach.description}
                  </p>
                </div>

                {/* Progress bar or Unlock status */}
                <div className="w-full pt-2 border-t border-slate-50 dark:border-slate-850 space-y-1.5">
                  {isCompleted ? (
                    <div className="text-center">
                      <span className="text-[8px] font-mono text-emerald-500 font-bold block uppercase leading-none">
                        Unlocked
                      </span>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">
                        {ach.unlockedAt}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                        <span>Progress</span>
                        <span>{ach.currentCount}/{ach.targetCount}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  )}
                  <span className="block text-[8px] font-mono font-bold text-amber-500">
                    💎 {ach.pointsReward} PTS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
