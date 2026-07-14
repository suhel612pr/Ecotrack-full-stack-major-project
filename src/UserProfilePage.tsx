import React from 'react';
import { UserProfile, AIWasteScan } from '../types';
import { Award, Zap, Recycle, Clock, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from './contexts/DataContext';

interface UserProfilePageProps {
  user: UserProfile;
  onNavigateToScanner: () => void;
}

const categoryIcon = (category: AIWasteScan['category']) => {
  switch (category) {
    case 'recyclable': return <Recycle className="h-5 w-5 text-blue-500" />;
    case 'organic': return <Recycle className="h-5 w-5 text-green-500" />;
    case 'hazardous': return <Zap className="h-5 w-5 text-yellow-500" />;
    default: return <Recycle className="h-5 w-5 text-slate-500" />;
  }
};

export default function UserProfilePage({ user, onNavigateToScanner }: UserProfilePageProps) {
  const { userScans: scans } = useData();

  return (
    <div className="space-y-8">
      {/* User Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-lg"
      >
        <div className="relative">
          <img 
            src={user.avatarUrl || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`} 
            alt="User Avatar" 
            className="h-24 w-24 rounded-full border-4 border-slate-200 dark:border-slate-700"
          />
          <span className="absolute bottom-0 right-0 block h-6 w-6 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{user.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/50 border border-green-500/20 rounded-xl">
              <Award className="h-5 w-5 text-green-500" />
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{user.points}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Green Credits</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">Recent Activity</h2>
        
        {scans.length > 0 ? (
          <div className="space-y-3">
            {scans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {categoryIcon(scan.category)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{scan.itemName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(scan.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-500">+{scan.greenPoints} XP</p>
                  <p className="text-xs text-slate-400 capitalize">{scan.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
            <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">No Activity Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4">Start scanning items to earn Green Credits and see your impact!</p>
            <button
              onClick={onNavigateToScanner}
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg text-sm transition hover:bg-green-700 flex items-center gap-2 mx-auto"
            >
              <Camera className="h-4 w-4" />
              Scan First Item
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}