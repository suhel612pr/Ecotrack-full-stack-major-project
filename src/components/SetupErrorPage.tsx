import React, { useState } from 'react';
import { 
  Database, ShieldAlert, CheckCircle, Copy, AlertTriangle, 
  Terminal, RefreshCw, ArrowRight, ExternalLink, HelpCircle 
} from 'lucide-react';

interface SetupErrorPageProps {
  onRetry: () => Promise<void>;
}

export default function SetupErrorPage({ onRetry }: SetupErrorPageProps) {
  const [retrying, setRetrying] = useState(false);
  const [retryStatus, setRetryStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText('supabase/migrations/20260709000000_init_schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetry = async () => {
    setRetrying(true);
    setRetryStatus('idle');
    try {
      await onRetry();
      setRetryStatus('success');
    } catch (err) {
      console.error(err);
      setRetryStatus('failed');
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-red-500/30">
      
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden space-y-8 z-10">
        
        {/* Connection status header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
              <Database className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                DATABASE SCHEMA MISSING
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white mt-1">Supabase Setup Required</h1>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl shrink-0 self-start md:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-black">
              ENV ACTIVE
            </span>
          </div>
        </div>

        {/* Informative banner */}
        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed text-red-200">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-300">Strict Production Mode Active</p>
            <p className="mt-1 text-slate-400">
              Your environment variables for Supabase are configured and reachable. To protect user records, fallback simulation and LocalStorage states are disabled in production. You must apply the database schema migration to continue.
            </p>
          </div>
        </div>

        {/* Step-by-step resolution instruction */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-emerald-500" />
            INITIALIZATION STEPS
          </h2>

          <div className="space-y-3 font-sans text-xs">
            {/* Step 1 */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 text-emerald-400">
                1
              </div>
              <div className="space-y-2 w-full">
                <p className="font-bold text-white">Locate the SQL Initialization Script</p>
                <p className="text-slate-400">
                  We have provided a complete PostgreSQL script designed specifically for your EcoTrack platform at:
                </p>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800/80 px-3 py-2 rounded-xl mt-1.5 overflow-x-auto gap-3">
                  <code className="font-mono text-emerald-400 text-[10px] select-all truncate">
                    supabase/migrations/20260709000000_init_schema.sql
                  </code>
                  <button 
                    onClick={handleCopyPath}
                    className="p-1 text-slate-400 hover:text-white transition shrink-0 hover:bg-slate-800 rounded-lg"
                    title="Copy path to clipboard"
                  >
                    {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 text-emerald-400">
                2
              </div>
              <div className="space-y-1 w-full">
                <p className="font-bold text-white">Execute Script in Supabase Dashboard</p>
                <p className="text-slate-400">
                  Open your <span className="text-white font-medium">Supabase Console</span>, navigate to the <span className="text-emerald-400 font-bold">SQL Editor</span> tab from the left sidebar, paste the entire contents of the <code>20260709000000_init_schema.sql</code> file, and click the <span className="text-white font-medium">Run</span> button.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 text-emerald-400">
                3
              </div>
              <div className="space-y-1.5 w-full">
                <p className="font-bold text-white">Missing Tables Checklist</p>
                <p className="text-slate-400">
                  The application is currently waiting for the following tables to be created in the <code>public</code> schema:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {['profiles', 'smart_bins', 'reports', 'worker_tasks', 'vehicles'].map(t => (
                    <span key={t} className="px-2.5 py-1 bg-slate-900 border border-slate-800/80 rounded-lg text-[10px] font-mono text-slate-400 text-center">
                      • {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center text-xs text-slate-500 gap-1.5 justify-center sm:justify-start">
            <HelpCircle className="h-4 w-4" />
            <span>Need assistance? Read the deployment guides.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className={`px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 border border-emerald-500/20 ${
                retrying ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
              <span>{retrying ? 'Syncing...' : 'Retry Connection'}</span>
            </button>
          </div>
        </div>

        {retryStatus === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs text-red-400 text-center flex items-center justify-center gap-2 animate-fade-in">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Tables are still missing. Ensure you successfully run the SQL script and retry.</span>
          </div>
        )}

      </div>
    </div>
  );
}
