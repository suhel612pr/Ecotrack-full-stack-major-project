import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Award, Compass, BrainCircuit, ShieldAlert, Leaf, Settings, 
  MapPin, Clock, Calendar, ShieldCheck, Activity, Radio, HelpCircle, Star
} from 'lucide-react';

// Submodule imports
import ExecutiveCommand from '../components/smartcity/ExecutiveCommand';
import DigitalTwin from '../components/smartcity/DigitalTwin';
import IoTSensorsMQTT from '../components/smartcity/IoTSensorsMQTT';
import DroneManagement from '../components/smartcity/DroneManagement';
import ComputerVisionCV from '../components/smartcity/ComputerVisionCV';
import PredictiveAI from '../components/smartcity/PredictiveAI';
import CarbonMarketplaceContractor from '../components/smartcity/CarbonMarketplaceContractor';
import CitizenRewardsVoiceAI from '../components/smartcity/CitizenRewardsVoiceAI';
import SuperAdminSecurity from '../components/smartcity/SuperAdminSecurity';

export default function SmartCityOS() {
  const [activeModule, setActiveModule] = useState<
    'executive' | 'twin' | 'sensors' | 'drone' | 'vision' | 'forecasting' | 'ledger' | 'rewards' | 'superadmin'
  >('executive');

  const modules = [
    { id: 'executive', label: 'Executive Command', icon: '👑', component: <ExecutiveCommand /> },
    { id: 'twin', label: '3D Digital Twin', icon: '🌐', component: <DigitalTwin /> },
    { id: 'sensors', label: 'IoT Smart Sensors', icon: '⚡', component: <IoTSensorsMQTT /> },
    { id: 'drone', label: 'UAV Drone Control', icon: '🛸', component: <DroneManagement /> },
    { id: 'vision', label: 'Neural waste sorting', icon: '👁️', component: <ComputerVisionCV /> },
    { id: 'forecasting', label: 'Predictive AI Core', icon: '🔮', component: <PredictiveAI /> },
    { id: 'ledger', label: 'Carbon & Trade Ledgers', icon: '🌱', component: <CarbonMarketplaceContractor /> },
    { id: 'rewards', label: 'Eco Rewards & Voice AI', icon: '🎙️', component: <CitizenRewardsVoiceAI /> },
    { id: 'superadmin', label: 'Security & Super Admin', icon: '🛡️', component: <SuperAdminSecurity /> },
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Top OS Header panel */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Smart City Operating System v2.0
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full uppercase">
              Tesla/Palantir Dashboard Layout
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">EcoTrack AI Command Cockpit</h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Centralized monitoring console aggregating distributed telemetry. Optimized for metropolitan municipalities, carbon compliance authorities, and supervisor engineers.
          </p>
        </div>

        {/* Dynamic status widgets */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9px] leading-tight">ACTIVE MUNICIPAL SERVICES:</span>
              <span className="font-extrabold text-white">All Channels NOMINAL</span>
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9px] leading-tight">MAPPED SENSOR NODES:</span>
              <span className="font-extrabold text-white">1,480 Active transceivers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Subtabs horizontal layout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-2xl shadow-sm overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-[1000px] lg:min-w-0 justify-between">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                activeModule === mod.id
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <span className="text-sm">{mod.icon}</span>
              <span>{mod.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Module Stage */}
      <div className="bg-slate-55/30 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850/40 p-1 rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="p-4"
          >
            {modules.find(m => m.id === activeModule)?.component}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
