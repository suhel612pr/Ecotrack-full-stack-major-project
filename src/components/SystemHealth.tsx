import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Database, Shield, Server, Cpu, HardDrive, RefreshCw, 
  Activity, CheckCircle, AlertTriangle, Key, Terminal, Code
} from 'lucide-react';

export default function SystemHealth() {
  const [latency, setLatency] = useState<number>(42);
  const [uptime, setUptime] = useState<string>('5d 14h 22m');
  const [cpuUsage, setCpuUsage] = useState<number>(14);
  const [memoryUsage, setMemoryUsage] = useState<number>(68.4);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Randomize some server diagnostic values on refresh
  const handleRefreshDiagnostics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLatency(Math.floor(28 + Math.random() * 25));
      setCpuUsage(Math.floor(8 + Math.random() * 15));
      setMemoryUsage(parseFloat((64 + Math.random() * 6).toFixed(1)));
      setIsRefreshing(false);
    }, 1200);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(32 + Math.random() * 18));
      setCpuUsage(Math.floor(10 + Math.random() * 8));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const serviceStatuses = [
    { name: 'Supabase PostgreSQL Client', service: 'Database', status: 'optimal', latency: '12ms', details: 'Durable tables synced' },
    { name: 'Google Gemini 3.5 Flash Model', service: 'AI Model API', status: 'optimal', latency: '140ms', details: 'Secure server-side proxy' },
    { name: 'Cloudinary Asset Delivery Network', service: 'Storage', status: 'optimal', latency: '48ms', details: 'Incident images pipeline ok' },
    { name: 'Google Maps platform SDK', service: 'Maps Platform', status: 'optimal', latency: '18ms', details: 'Store locations active' },
    { name: 'Nodemailer SMTP Relayers', service: 'Notification', status: 'optimal', latency: '124ms', details: 'Transactional emails online' },
    { name: 'Municipal IoT Telemetry WebSockets', service: 'Real-time Sync', status: 'optimal', latency: '8ms', details: 'Polling channel synced' }
  ];

  const envVariables = [
    { name: 'GEMINI_API_KEY', status: 'set', desc: 'Required for EcoBot and Image Waste scan' },
    { name: 'SUPABASE_URL', status: 'set', desc: 'Primary relational database endpoint' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', status: 'set', desc: 'Secure backend row bypass access' },
    { name: 'CLOUDINARY_URL', status: 'set', desc: 'Civic images CDN pipeline hosting' },
    { name: 'SMTP_SERVER_URL', status: 'set', desc: 'Sanitation worker assignment templates' }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Server className="h-5 w-5 mr-1.5 text-emerald-600" /> Municipal System Health Diagnostics
          </h3>
          <p className="text-xs text-slate-500">Real-time telemetry, server resource loads, third-party API dependencies, and security states.</p>
        </div>

        <button
          onClick={handleRefreshDiagnostics}
          disabled={isRefreshing}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold transition flex items-center space-x-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Pinging Nodes...' : 'Query Full Health Audit'}</span>
        </button>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed text-amber-300">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Demonstration Data</p>
          <p className="mt-1 text-slate-400">The metrics displayed on this page (CPU, Latency, Service Status) are for demonstration purposes only and do not reflect live server performance. They are generated locally to showcase the UI's capabilities.</p>
        </div>
      </div>

      {/* Grid: Uptime, latency, memory, CPU bento widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* API Latency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">SERVER LATENCY</span>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{latency}ms</span>
            <span className="text-[9px] text-emerald-500 font-mono font-bold block">● OPTIMAL PERFORMANCE</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Server Uptime */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">SYSTEM UPTIME</span>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{uptime}</span>
            <span className="text-[9px] text-emerald-500 font-mono font-bold block">● ZERO OUTAGES LOGGED</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* CPU Resource Usage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1 w-full mr-4">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">CONTAINER CPU</span>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{cpuUsage}%</span>
              <span className="text-[10px] text-slate-400 font-mono">Limit: 1 Core</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cpuUsage}%` }} />
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300 rounded-2xl shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
        </div>

        {/* Memory Resource Usage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="space-y-1 w-full mr-4">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">CONTAINER RAM</span>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{memoryUsage}%</span>
              <span className="text-[10px] text-slate-400 font-mono">Limit: 512MB</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: `${memoryUsage}%` }} />
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300 rounded-2xl shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Grid: Services checklist and environment readout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Third-Party Dependencies Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
            <Shield className="h-4.5 w-4.5 text-emerald-600" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Third-Party Gateway Service Status</h4>
          </div>

          <div className="space-y-3">
            {serviceStatuses.map((ser, i) => (
              <div 
                key={i} 
                className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850/80 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="block font-bold text-slate-900 dark:text-slate-200">{ser.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{ser.service} • {ser.details}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    ONLINE ({ser.latency})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Security, Environmental Variable verification, Version logs */}
        <div className="space-y-6">
          
          {/* Environment check */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Key className="h-4.5 w-4.5 text-amber-500" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Secure Secret Variable Checklist</h4>
            </div>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto">
              {envVariables.map((variable, i) => (
                <div 
                  key={i} 
                  className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850/60 flex items-center justify-between text-[11px]"
                >
                  <div className="space-y-0.5">
                    <span className="block font-mono font-bold text-slate-800 dark:text-slate-300">{variable.name}</span>
                    <span className="text-[9px] text-slate-400">{variable.desc}</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Docker Container Version Audit */}
          <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-850 shadow-xl space-y-4">
            <div className="flex items-center space-x-1.5 text-cyan-400">
              <Terminal className="h-4.5 w-4.5" />
              <span className="text-[10px] font-bold font-mono tracking-wider uppercase">CONTAINER CONSOLE INFO</span>
            </div>

            <div className="space-y-1 font-mono text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Application Version:</span>
                <span className="text-white font-bold">EcoTrack AI v1.4.2</span>
              </div>
              <div className="flex justify-between">
                <span>Production Run Container:</span>
                <span className="text-white">Cloud Run G-Node-18</span>
              </div>
              <div className="flex justify-between">
                <span>Target Port binding:</span>
                <span className="text-emerald-400 font-bold">PORT 3000 (Compliant)</span>
              </div>
              <div className="flex justify-between">
                <span>Build System tool:</span>
                <span className="text-white">Vite ES-Bundle CJS</span>
              </div>
              <div className="flex justify-between">
                <span>SHA-256 Checksum:</span>
                <span className="text-cyan-400">bf10e42f9b88e14b...</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
