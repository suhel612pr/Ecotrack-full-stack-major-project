import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, ShieldAlert, Cpu, Heart, Save, AlertTriangle, 
  Settings, RefreshCw, Key, Power, ToggleLeft, Activity, Radio
} from 'lucide-react';

interface CityCorp {
  id: string;
  name: string;
  country: string;
  brandingLogo: string;
  activeDronesCount: number;
}

export default function SuperAdminSecurity() {
  const [cities, setCities] = useState<CityCorp[]>([
    { id: 'city-1', name: 'San Francisco Municipal Corp', country: 'United States', brandingLogo: '🌲 SF-ECO', activeDronesCount: 3 },
    { id: 'city-2', name: 'Mumbai Municipal Corporation (BMC)', country: 'India', brandingLogo: '🇮🇳 BMC-SWACHH', activeDronesCount: 8 },
    { id: 'city-3', name: 'Tokyo Bureau of Environment', country: 'Japan', brandingLogo: '🇯🇵 TOKYO-RECYCLE', activeDronesCount: 12 }
  ]);

  const [activeCityId, setActiveCityId] = useState('city-1');
  const [brandName, setBrandName] = useState('EcoTrack AI OS');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Feature flags state
  const [features, setFeatures] = useState({
    mqttSensors: true,
    dronePatrols: true,
    gamificationCoins: true,
    voiceAssistant: true
  });

  const securityAuditLogs = [
    { id: 'sec-1', severity: 'warning', text: 'Multiple rapid API calls from IP 198.162.24.8 on /api/v1/smart-bins. Throttled.', time: '12 mins ago' },
    { id: 'sec-2', severity: 'critical', text: 'Blocked unauthorized SSH handshake attempt on Node SB-103 IoT gateway.', time: '1 hr ago' },
    { id: 'sec-3', severity: 'info', text: 'Successful RBAC credential renewal for supervisor profile: officer-jenny.', time: '2 hrs ago' }
  ];

  const systemMetrics = [
    { title: 'API Gateways Latency', value: '42 ms', percentage: 12 }, // 12% is low/good
    { title: 'Database Pool Utilization', value: '28 / 100', percentage: 28 },
    { title: 'Server RAM Heap', value: '380 MB / 1GB', percentage: 38 }
  ];

  const handleFeatureToggle = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBrandingSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`EcoTrack AI: White-label parameters updated. Custom brand label set to "${brandName}".`);
  };

  const activeCity = cities.find(c => c.id === activeCityId) || cities[0];

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Settings className="h-5 w-5 mr-1.5 text-cyan-500" /> Super Admin, Security & White-Label Panel
          </h3>
          <p className="text-xs text-slate-500">Establish corporate white-labeling, audit failed security handshakes, select city corporations, and monitor server RAM.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Columns - Multi City & System Monitoring */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Multi City Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center">
              <Building className="h-4.5 w-4.5 mr-1.5 text-slate-450" /> Metropolitan Corporation Configuration
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {cities.map(city => (
                <button
                  key={city.id}
                  onClick={() => setActiveCityId(city.id)}
                  className={`p-4 rounded-2xl border text-xs text-left transition flex flex-col justify-between gap-4 ${
                    activeCityId === city.id 
                      ? 'bg-slate-900 dark:bg-slate-800 text-white border-transparent shadow' 
                      : 'bg-slate-50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-850 border-slate-150 dark:border-slate-850'
                  }`}
                >
                  <div>
                    <span className="block font-extrabold text-slate-850 dark:text-slate-200">{city.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{city.country}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="font-bold text-cyan-500">{city.brandingLogo}</span>
                    <span className="text-slate-400">Patrols: {city.activeDronesCount} UAVs</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* System Performance Diagnostics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              System Gateway Diagnostics
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {systemMetrics.map((met, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs space-y-2.5">
                  <span className="text-slate-400 block font-mono">{met.title}</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white block">{met.value}</span>
                  
                  {/* Progress bar scale */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${met.percentage > 70 ? 'bg-rose-500' : met.percentage > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${met.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Audit Center */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center text-rose-500">
              <ShieldAlert className="h-4.5 w-4.5 mr-1.5 animate-pulse" /> Security Sentinel Gatekeeper Logs
            </h4>

            <div className="space-y-3">
              {securityAuditLogs.map(log => (
                <div 
                  key={log.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-3 ${
                    log.severity === 'critical' ? 'bg-rose-500/5 border-rose-500/15 text-rose-800 dark:text-rose-400' : 'bg-amber-500/5 border-amber-500/10 text-amber-800 dark:text-amber-400'
                  }`}
                >
                  <span className="text-sm shrink-0">{log.severity === 'critical' ? '🚫' : '⚠️'}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between font-mono text-[9px] text-slate-400">
                      <span>ALERT FLAG CATEGORY: {log.severity.toUpperCase()}</span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-350 text-[11px] leading-relaxed font-semibold">
                      {log.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 Columns - White label and Maintenance */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* White label settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              White-Label Customization
            </h4>

            <form onSubmit={handleBrandingSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Custom Brand Name</label>
                <input 
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl"
                />
              </div>

              {/* Maintenance mode toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <div>
                  <span className="font-bold block">Maintenance mode</span>
                  <span className="text-[10px] text-slate-400">Locks civilian portals</span>
                </div>

                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`p-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    maintenanceMode ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{maintenanceMode ? 'Active' : 'Offline'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 text-white rounded-xl font-bold transition flex items-center justify-center gap-1"
              >
                <Save className="h-4 w-4" /> Save Branding Specs
              </button>
            </form>
          </div>

          {/* Feature flags toggles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              System Feature Flags
            </h4>

            <div className="space-y-3.5 text-xs">
              {[
                { key: 'mqttSensors', label: 'MQTT Telemetry Bins', desc: 'Allows sensor handshakes' },
                { key: 'dronePatrols', label: 'Aerial UAV Patrols', desc: 'Drone dispatch cockpit' },
                { key: 'gamificationCoins', label: 'Eco Coins Reward system', desc: 'Achievements & Store' },
                { key: 'voiceAssistant', label: 'Voice AI Command Assistant', desc: 'Multilingual speech simulator' }
              ].map(flag => (
                <div key={flag.key} className="flex items-center justify-between">
                  <div>
                    <span className="font-bold block">{flag.label}</span>
                    <span className="text-[10px] text-slate-400 block">{flag.desc}</span>
                  </div>

                  <button
                    onClick={() => handleFeatureToggle(flag.key as any)}
                    className={`h-6 w-11 rounded-full p-1 transition flex items-center ${
                      features[flag.key as keyof typeof features] ? 'bg-cyan-500 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full bg-white shadow-sm block" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
