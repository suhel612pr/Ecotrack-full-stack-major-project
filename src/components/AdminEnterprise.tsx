import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, ShieldAlert, Cpu, Heart, Save, AlertTriangle, 
  Settings, RefreshCw, Key, Power, ToggleLeft, Activity, Radio,
  Database, FileSpreadsheet, Download, DownloadCloud, Trash2, 
  Layers, Palette, Type, Terminal, CheckCircle2, UserCheck, Play, 
  UserMinus, BookOpen, Send, HelpCircle, FileText, Plus, Check
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AdminEnterprise() {
  const [activePane, setActivePane] = useState<'branding' | 'security' | 'backups' | 'reports' | 'openapi'>('branding');

  // ==========================================
  // 1. BRANDING & WHITE-LABEL THEME BUILDER STATE
  // ==========================================
  const [municipalLogo, setMunicipalLogo] = useState('🌲 ECO-METRO');
  const [primaryColor, setPrimaryColor] = useState('#10B981'); // Emerald
  const [secondaryColor, setSecondaryColor] = useState('#6366F1'); // Indigo
  const [fontFamily, setFontFamily] = useState('Inter');
  const [cardBorderRadius, setCardBorderRadius] = useState('lg');
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'top'>('left');
  const [customDomain, setCustomDomain] = useState('smartcity.ecotrack.gov');
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBranding(true);
    setTimeout(() => {
      setIsSavingBranding(false);
      alert('Enterprise SaaS Configuration: White-label parameters synced successfully and saved to municipality records.');
    }, 1000);
  };

  // ==========================================
  // 2. SECURITY CENTER & DEVICE SESSIONS STATE
  // ==========================================
  const [blockedIPs, setBlockedIPs] = useState<string[]>(['192.168.12.85', '45.12.98.241', '103.22.45.12']);
  const [newIPInput, setNewIPInput] = useState('');
  const [deviceSessions, setDeviceSessions] = useState([
    { id: 'dev-1', device: 'Chrome on macOS (Elias)', location: 'San Francisco, CA', ip: '64.124.9.41', active: true, lastSeen: 'Just now' },
    { id: 'dev-2', device: 'EcoTrack Android App (Vance)', location: 'Municipal Depot Block A', ip: '192.168.1.14', active: false, lastSeen: '14 mins ago' },
    { id: 'dev-3', device: 'Safari on iPhone (Helen)', location: 'City Hall Suite 405', ip: '72.12.44.92', active: false, lastSeen: '2 hrs ago' }
  ]);

  const handleRevokeSession = (id: string) => {
    setDeviceSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleAddBlockedIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIPInput && !blockedIPs.includes(newIPInput)) {
      setBlockedIPs(prev => [...prev, newIPInput]);
      setNewIPInput('');
    }
  };

  const handleRemoveBlockedIP = (ip: string) => {
    setBlockedIPs(prev => prev.filter(item => item !== ip));
  };

  const securityAuditLogs = [
    { id: 'sec-101', action: 'ROLE_MODIFIED', profile: 'Helen Thorne (SuperAdmin)', target: 'Dave Miller', ip: '64.124.9.41', date: '2026-07-07 09:12' },
    { id: 'sec-102', action: 'FAILED_LOGIN_LIMIT_EXCEEDED', profile: 'Unknown IP Throttled', target: 'admin@ecotrack.ai', ip: '103.22.45.12', date: '2026-07-07 08:31' },
    { id: 'sec-103', action: 'DATABASE_BACKUP_EXPORT', profile: 'System Cron (Daily)', target: 'S3-Primary-Cloud', ip: '127.0.0.1', date: '2026-07-07 03:00' }
  ];

  // ==========================================
  // 3. BACKUP & RESTORE ENGINE STATE
  // ==========================================
  const [backupHistory, setBackupHistory] = useState([
    { id: 'bk-501', label: 'EcoTrack Automated Daily Backup', size: '24.8 MB', tables: 35, status: 'Completed', date: '2026-07-07 03:00' },
    { id: 'bk-502', label: 'Post-Migration Core Snapshot', size: '24.2 MB', tables: 35, status: 'Completed', date: '2026-07-06 18:30' },
    { id: 'bk-503', label: 'Initial System Provision Snapshot', size: '18.4 MB', tables: 28, status: 'Restored', date: '2026-07-04 12:00' }
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup = {
        id: `bk-${Math.floor(500 + Math.random() * 500)}`,
        label: 'Manual Core DB Backup',
        size: '25.1 MB',
        tables: 35,
        status: 'Completed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setBackupHistory(prev => [newBackup, ...prev]);
      setIsBackingUp(false);
      alert('Relational snapshot completed. DB state locked, compressed, and uploaded to encrypted primary vault.');
    }, 1500);
  };

  const handleExportDatabase = (format: 'SQL' | 'JSON') => {
    // Generates a local file download
    const dbState = {
      timestamp: new Date().toISOString(),
      format: format,
      engine: 'EcoTrack Enterprise Postgres Engine',
      municipality: municipalLogo,
      schemas: ['profiles', 'citizens', 'workers', 'garbage_bins', 'complaints', 'routes', 'audit_logs']
    };
    const fileContent = format === 'SQL' 
      ? `-- EcoTrack AI Enterprise v3.0.0 Database Schema Dump\n-- Generated at: ${dbState.timestamp}\n-- Target Schema: PostgreSQL\n\nCREATE DATABASE ecotrack_saas;\n\\c ecotrack_saas;\n\nCREATE TABLE profiles (\n  id UUID PRIMARY KEY,\n  first_name VARCHAR(100),\n  last_name VARCHAR(100),\n  role VARCHAR(50)\n);\nINSERT INTO profiles VALUES ('${crypto.randomUUID()}', 'Elias', 'Suhel', 'Citizen');\n`
      : JSON.stringify(dbState, null, 2);

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecotrack_db_dump_${dbState.timestamp.replace(/[:.]/g, '_')}.${format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = (id: string) => {
    if (confirm(`CRITICAL: Restoring snapshot [${id}] will reload in-memory tables. Proceed?`)) {
      setBackupHistory(prev => prev.map(b => b.id === id ? { ...b, status: 'Restored' } : b));
      alert('System state restored. Relational integrity indexes rebuilt successfully.');
    }
  };

  // ==========================================
  // 4. DRAG-AND-DROP ENTERPRISE REPORT BUILDER STATE
  // ==========================================
  const [selectedFields, setSelectedFields] = useState<string[]>(['Complaints', 'Smart Bins']);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [scheduleInterval, setScheduleInterval] = useState<'none' | 'daily' | 'weekly'>('none');
  const [generatedReportData, setGeneratedReportData] = useState<any[] | null>(null);

  const availableFields = ['Complaints', 'Smart Bins', 'Workers', 'Fleet Vehicles', 'Carbon Offsets'];

  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleGenerateReport = () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one data entity to build a report.');
      return;
    }
    // Formulate a realistic report query output
    const data = [
      { name: 'Mon', Complaints: 18, 'Smart Bins': 82, Workers: 14, 'Carbon Offsets': 2.4 },
      { name: 'Tue', Complaints: 24, 'Smart Bins': 74, Workers: 16, 'Carbon Offsets': 3.1 },
      { name: 'Wed', Complaints: 15, 'Smart Bins': 91, Workers: 15, 'Carbon Offsets': 2.8 },
      { name: 'Thu', Complaints: 29, 'Smart Bins': 68, Workers: 18, 'Carbon Offsets': 4.2 },
      { name: 'Fri', Complaints: 22, 'Smart Bins': 85, Workers: 17, 'Carbon Offsets': 3.9 }
    ];
    setGeneratedReportData(data);
  };

  const handleExportCSV = () => {
    if (!generatedReportData) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Day,Complaints,Smart Bins Fill,Workers,Carbon Saved (tons)\n';
    generatedReportData.forEach(row => {
      csvContent += `${row.name},${row.Complaints || 0},${row['Smart Bins'] || 0},${row.Workers || 0},${row['Carbon Offsets'] || 0}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `ecotrack_enterprise_report_${Date.now()}.csv`;
    link.click();
  };

  const handleEmailReport = () => {
    alert(`Report scheduled successfully. Updates will be auto-emailed to suhelias786@gmail.com on a ${scheduleInterval} cadence.`);
  };

  // ==========================================
  // 5. INTERACTIVE OPENAPI / SWAGGER EXPLORER
  // ==========================================
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET_smart_bins');
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiQueryParam, setApiQueryParam] = useState('');

  const apiEndpoints = {
    GET_smart_bins: {
      method: 'GET',
      path: '/api/v1/garbage-bins',
      description: 'Fetch array of smart IoT bins matching active geolocation limits.',
      parameters: [{ name: 'min_fill', type: 'integer', description: 'Filter bins above specific percentage.' }],
      responses: {
        200: [
          { id: 'bin-101', name: 'Smart Bin SB-101', fill_level: 42, lat: 37.7785, lng: -122.4192 }
        ],
        401: { error: 'Access token required.' }
      }
    },
    POST_complaint: {
      method: 'POST',
      path: '/api/v1/citizen/submit-complaint',
      description: 'Log clean-up incident report in database, trigger Nodemailer transaction.',
      parameters: [{ name: 'title', type: 'string', required: true }, { name: 'description', type: 'string', required: true }],
      responses: {
        201: { message: 'Complaint registered successfully.', id: 'rep-509' }
      }
    },
    GET_health: {
      method: 'GET',
      path: '/api/v1/super-admin/platform-health',
      description: 'Stream platform health dashboard metrics: CPU usage, database status.',
      parameters: [],
      responses: {
        200: { status: 'Healthy', databaseConnection: 'Connected', uptime: '99.98%' }
      }
    }
  };

  const handleTestAPI = () => {
    setApiLoading(true);
    setApiResponse(null);
    setTimeout(() => {
      const details = apiEndpoints[selectedEndpoint as keyof typeof apiEndpoints];
      if (selectedEndpoint === 'GET_smart_bins') {
        setApiResponse([
          { id: 'bin-101', name: 'Smart Bin SB-101', fill_level: 42, battery_level: 94, status: 'Normal', lat: 37.7785, lng: -122.4192 },
          { id: 'bin-102', name: 'Smart Bin SB-102', fill_level: 88, battery_level: 89, status: 'Full', lat: 37.7812, lng: -122.4115 }
        ]);
      } else if (selectedEndpoint === 'POST_complaint') {
        setApiResponse({
          status: 'success',
          code: 201,
          message: 'Complaint filed and registered. Crew dispatched ticket automatically.',
          complaint: {
            id: 'rep-942',
            title: 'Overflowing Trash segment XII',
            category: 'landfill',
            assigned_worker_id: 'worker-2',
            green_points: 25
          }
        });
      } else {
        setApiResponse({
          status: 'optimal',
          nodesOnline: true,
          cpuUsage: '14%',
          ramHeap: '382 MB / 1GB',
          latency: '42ms'
        });
      }
      setApiLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left">
      
      {/* Enterprise Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5 mb-6">
        <div>
          <span className="text-[10px] font-mono font-black text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            ECOTRACK AI ENTERPRISE SUITE v3.0.0
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 flex items-center">
            <Building className="h-5 w-5 mr-2 text-indigo-500" /> Municipal SaaS Control Command
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Control corporate white-labeling, construct report sheets, manage secure database backups, and test versioned REST APIs.</p>
        </div>

        {/* Mini Navigation tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-100 dark:border-slate-850/50">
          {[
            { id: 'branding', label: 'White-Label', icon: <Palette className="h-3.5 w-3.5" /> },
            { id: 'security', label: 'Security Center', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
            { id: 'backups', label: 'Backups', icon: <Database className="h-3.5 w-3.5" /> },
            { id: 'reports', label: 'Report Builder', icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
            { id: 'openapi', label: 'API Explorer', icon: <BookOpen className="h-3.5 w-3.5" /> }
          ].map(pane => (
            <button
              key={pane.id}
              onClick={() => setActivePane(pane.id as any)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
                activePane === pane.id 
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
              }`}
            >
              {pane.icon}
              <span>{pane.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePane}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="min-h-[420px]"
        >
          
          {/* =======================================================
              PANE 1: WHITE LABEL & THEME CUSTOMIZER
              ======================================================= */}
          {activePane === 'branding' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form onSubmit={handleSaveBranding} className="lg:col-span-7 space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2 uppercase tracking-wide">
                  Corporate Branding Configurations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Municipality Label Logo</label>
                    <input 
                      type="text" 
                      value={municipalLogo} 
                      onChange={e => setMunicipalLogo(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Custom Tenant Domain</label>
                    <input 
                      type="text" 
                      value={customDomain} 
                      onChange={e => setCustomDomain(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Primary Accent Color</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="h-9 w-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                      />
                      <input 
                        type="text" 
                        value={primaryColor} 
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="flex-1 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Secondary Color</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={secondaryColor} 
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="h-9 w-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                      />
                      <input 
                        type="text" 
                        value={secondaryColor} 
                        onChange={e => setSecondaryColor(e.target.value)}
                        className="flex-1 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Accent Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={e => setFontFamily(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl text-xs outline-none"
                    >
                      <option value="Inter">Inter (Swiss Clean)</option>
                      <option value="Poppins">Poppins (Modern Rounded)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Layout Rounded Card Style</label>
                    <div className="flex space-x-2">
                      {['none', 'md', 'lg', '3xl'].map(radius => (
                        <button
                          key={radius}
                          type="button"
                          onClick={() => setCardBorderRadius(radius)}
                          className={`flex-1 py-1.5 border rounded-xl text-[10px] uppercase font-bold transition ${
                            cardBorderRadius === radius 
                              ? 'bg-indigo-600 text-white border-transparent' 
                              : 'bg-white dark:bg-slate-950 border-slate-200 text-slate-500'
                          }`}
                        >
                          {radius === 'none' ? 'Sharp' : radius}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">Command Sidebar Position</label>
                    <div className="flex space-x-2">
                      {['left', 'top'].map(pos => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setSidebarPosition(pos as any)}
                          className={`flex-1 py-1.5 border rounded-xl text-[10px] uppercase font-bold transition ${
                            sidebarPosition === pos 
                              ? 'bg-indigo-600 text-white border-transparent' 
                              : 'bg-white dark:bg-slate-950 border-slate-200 text-slate-500'
                          }`}
                        >
                          {pos} Rail
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingBranding}
                  className="w-full py-2.5 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  {isSavingBranding ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span>{isSavingBranding ? 'Saving Parameters...' : 'Deploy White-Label Customization'}</span>
                </button>
              </form>

              {/* Preview Box on the Right */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-850 uppercase tracking-wide">
                  Live Viewport Preview
                </h3>

                <div 
                  className="border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between shadow-inner"
                  style={{ 
                    borderRadius: cardBorderRadius === 'none' ? '0px' : cardBorderRadius === 'md' ? '12px' : cardBorderRadius === 'lg' ? '18px' : '32px',
                    fontFamily: fontFamily === 'Inter' ? '"Inter", sans-serif' : fontFamily === 'Poppins' ? '"Poppins", sans-serif' : '"JetBrains Mono", monospace'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
                    <span className="font-extrabold flex items-center gap-1.5" style={{ color: primaryColor }}>
                      <span className="text-sm">🌲</span> {municipalLogo}
                    </span>
                    <span className="text-[9px] font-mono bg-slate-200 dark:bg-slate-850 px-2 py-0.5 rounded-full text-slate-500">
                      {customDomain}
                    </span>
                  </div>

                  <div className="py-8 text-center space-y-2">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">Smart Waste Portal</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Citizen Eco-Points accrued and sensor maps updated under custom brand regulations.</p>
                    
                    <button 
                      type="button"
                      className="px-4 py-1.5 text-white text-[11px] font-extrabold shadow-md transition"
                      style={{ 
                        backgroundColor: primaryColor,
                        borderRadius: cardBorderRadius === 'none' ? '0px' : cardBorderRadius === 'md' ? '8px' : '12px'
                      }}
                    >
                      Authenticate Account
                    </button>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>STATUS: 200 OK</span>
                    <span style={{ color: secondaryColor }}>WHITE-LABELED PORTAL</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 text-xs text-slate-500 leading-relaxed space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">SaaS Multitenancy Rules:</span>
                  <p className="text-[11px]">Each municipal tenant operates on fully isolated data structures. Dynamic routing maps queries dynamically based on inbound domain handshake.</p>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              PANE 2: ENTERPRISE SECURITY CENTER
              ======================================================= */}
          {activePane === 'security' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Device Sessions Management (Left 7-cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2 uppercase tracking-wide flex items-center justify-between">
                    <span>Authorized Device Sessions</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">DEVICE MANAGEMENT</span>
                  </h3>

                  <div className="space-y-2">
                    {deviceSessions.map(session => (
                      <div key={session.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-slate-800 dark:text-slate-250">{session.device}</span>
                            {session.active && (
                              <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                                CURRENT SESSION
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block">IP: {session.ip} • Geolocation: {session.location}</span>
                        </div>

                        <div className="text-right flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-slate-400">{session.lastSeen}</span>
                          {!session.active && (
                            <button
                              onClick={() => handleRevokeSession(session.id)}
                              className="p-1 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 rounded-lg transition"
                              title="Revoke and force logout"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => {
                        setDeviceSessions(prev => prev.filter(s => s.active));
                        alert('All other device sessions successfully revoked.');
                      }}
                      className="px-3 py-1.5 bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-extrabold transition uppercase"
                    >
                      Logout All Other Devices
                    </button>
                  </div>
                </div>

                {/* Blocked IPs Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2 uppercase tracking-wide">
                    Firewall IP Blacklist
                  </h3>

                  <form onSubmit={handleAddBlockedIP} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Enter IPv4 Address (e.g. 192.168.1.1)"
                      value={newIPInput}
                      onChange={e => setNewIPInput(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Block IP</span>
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    {blockedIPs.map(ip => (
                      <span 
                        key={ip} 
                        className="px-2.5 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/15 rounded-xl text-[10px] font-mono font-bold flex items-center space-x-1"
                      >
                        <span>{ip}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveBlockedIP(ip)}
                          className="hover:text-rose-700 font-extrabold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RBAC Security Audit Log (Right 5-cols) */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2 uppercase tracking-wide">
                  Sentinel Gatekeeper Audit
                </h3>

                <div className="space-y-3 max-h-[360px] overflow-y-auto">
                  {securityAuditLogs.map(log => (
                    <div 
                      key={log.id} 
                      className={`p-3 rounded-2xl border text-xs flex flex-col gap-1.5 ${
                        log.action === 'FAILED_LOGIN_LIMIT_EXCEEDED' 
                          ? 'bg-rose-500/5 border-rose-500/15 text-rose-800 dark:text-rose-400' 
                          : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span>ACTION: {log.action}</span>
                        <span>{log.date}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-normal">
                        User: {log.profile} ➔ Target: {log.target}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 block">Inbound IP: {log.ip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              PANE 3: DATA SNAPSHOTS & BACKUP MANAGER
              ======================================================= */}
          {activePane === 'backups' && (
            <div className="space-y-6">
              
              {/* Backups Action Panel */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-150 dark:border-slate-850">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
                    <Database className="h-4.5 w-4.5 text-indigo-500 mr-1.5" /> Core Relational Backup Vault
                  </h4>
                  <p className="text-xs text-slate-500">Safely backup municipal indices and restore active state ledger snapshots with a single click.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerBackup}
                    disabled={isBackingUp}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
                    <span>{isBackingUp ? 'Pinging Shards...' : 'Trigger Relational Backup'}</span>
                  </button>

                  <button
                    onClick={() => handleExportDatabase('SQL')}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 dark:border-slate-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export schema SQL</span>
                  </button>

                  <button
                    onClick={() => handleExportDatabase('JSON')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 dark:border-slate-850"
                  >
                    <DownloadCloud className="h-3.5 w-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Backups History Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2 uppercase tracking-wide">
                  Snapshots History & Restore Operations
                </h3>

                <div className="space-y-2">
                  {backupHistory.map(bk => (
                    <div key={bk.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                            {bk.id}
                          </span>
                          <span className="font-extrabold text-slate-850 dark:text-slate-200">{bk.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">Tables Synchronized: {bk.tables} • File Compression: {bk.size} • Backup Timestamp: {bk.date}</span>
                      </div>

                      <div className="flex items-center space-x-3 justify-end shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                          bk.status === 'Restored' 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {bk.status}
                        </span>

                        <button
                          onClick={() => handleRestoreBackup(bk.id)}
                          className="px-3 py-1 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition flex items-center space-x-1 hover:bg-slate-800"
                        >
                          <Play className="h-3 w-3" />
                          <span>Restore</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              PANE 4: DRAG-AND-DROP REPORT BUILDER
              ======================================================= */}
          {activePane === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Construction Form Left */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2 uppercase tracking-wide">
                  Drag-and-Drop Column Selector
                </h3>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 block">SELECT DATA ENTITIES TO AGGREGATE</span>
                  <div className="flex flex-wrap gap-2">
                    {availableFields.map(field => {
                      const isSelected = selectedFields.includes(field);
                      return (
                        <button
                          key={field}
                          type="button"
                          onClick={() => toggleField(field)}
                          className={`px-3 py-2 rounded-2xl border text-xs font-bold transition flex items-center space-x-1.5 ${
                            isSelected 
                              ? 'bg-indigo-500 border-transparent text-white shadow' 
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          <span>{field}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">CHART REPRESENTATION</label>
                    <div className="flex space-x-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-150 dark:border-slate-850">
                      {(['bar', 'line', 'pie'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setChartType(type)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                            chartType === type 
                              ? 'bg-slate-900 dark:bg-slate-800 text-white' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">SCHEDULE AUTOMATED EMAILS</label>
                    <select
                      value={scheduleInterval}
                      onChange={e => setScheduleInterval(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl text-xs outline-none"
                    >
                      <option value="none">Manual On-Demand</option>
                      <option value="daily">Daily Cron Summary</option>
                      <option value="weekly">Weekly Compilation</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Activity className="h-3.5 w-3.5 animate-pulse" />
                    <span>Generate custom Report</span>
                  </button>

                  {scheduleInterval !== 'none' && (
                    <button
                      type="button"
                      onClick={handleEmailReport}
                      className="px-4 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center"
                    >
                      <span>Schedule Cron</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Charts Preview Right */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    Live Report Output
                  </h3>

                  {generatedReportData && (
                    <button
                      onClick={handleExportCSV}
                      className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg text-[10px] font-extrabold transition uppercase flex items-center space-x-1"
                    >
                      <FileSpreadsheet className="h-3 w-3" />
                      <span>Export CSV sheet</span>
                    </button>
                  )}
                </div>

                {generatedReportData ? (
                  <div className="space-y-4">
                    <div className="h-[220px] bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-150 dark:border-slate-850">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart data={generatedReportData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                            <YAxis stroke="#94a3b8" fontSize={9} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            {selectedFields.includes('Complaints') && <Bar dataKey="Complaints" fill="#f43f5e" radius={[4, 4, 0, 0]} />}
                            {selectedFields.includes('Smart Bins') && <Bar dataKey="Smart Bins" fill="#10b981" radius={[4, 4, 0, 0]} />}
                            {selectedFields.includes('Workers') && <Bar dataKey="Workers" fill="#6366f1" radius={[4, 4, 0, 0]} />}
                            {selectedFields.includes('Carbon Offsets') && <Bar dataKey="Carbon Offsets" fill="#22c55e" radius={[4, 4, 0, 0]} />}
                          </BarChart>
                        ) : chartType === 'line' ? (
                          <LineChart data={generatedReportData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                            <YAxis stroke="#94a3b8" fontSize={9} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            {selectedFields.includes('Complaints') && <Line type="monotone" dataKey="Complaints" stroke="#f43f5e" strokeWidth={2.5} />}
                            {selectedFields.includes('Smart Bins') && <Line type="monotone" dataKey="Smart Bins" stroke="#10b981" strokeWidth={2.5} />}
                            {selectedFields.includes('Workers') && <Line type="monotone" dataKey="Workers" stroke="#6366f1" strokeWidth={2.5} />}
                            {selectedFields.includes('Carbon Offsets') && <Line type="monotone" dataKey="Carbon Offsets" stroke="#22c55e" strokeWidth={2.5} />}
                          </LineChart>
                        ) : (
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Complaints', value: 24 },
                                { name: 'Bins Collect', value: 76 }
                              ]}
                              dataKey="value"
                              cx="50%"
                              cy="50%"
                              outerRadius={65}
                              label={{ fontSize: 8 }}
                            >
                              <Cell fill="#f43f5e" />
                              <Cell fill="#10b981" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </div>

                    {/* Compact list */}
                    <div className="grid grid-cols-5 text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="font-bold">DAY</span>
                      {selectedFields.includes('Complaints') && <span className="text-rose-500 font-bold">COMPLAINTS</span>}
                      {selectedFields.includes('Smart Bins') && <span className="text-emerald-500 font-bold">BINS %</span>}
                      {selectedFields.includes('Workers') && <span className="text-indigo-500 font-bold">WORKERS</span>}
                      {selectedFields.includes('Carbon Offsets') && <span className="text-green-500 font-bold">CO2 OFFSET</span>}
                    </div>

                    <div className="space-y-1 text-[10px] font-mono">
                      {generatedReportData.map(row => (
                        <div key={row.name} className="grid grid-cols-5 border-b border-slate-100 dark:border-slate-850 pb-1.5">
                          <span>{row.name}</span>
                          {selectedFields.includes('Complaints') && <span>{row.Complaints}</span>}
                          {selectedFields.includes('Smart Bins') && <span>{row['Smart Bins']}%</span>}
                          {selectedFields.includes('Workers') && <span>{row.Workers}</span>}
                          {selectedFields.includes('Carbon Offsets') && <span>{row['Carbon Offsets']}t</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    <FileSpreadsheet className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Report Builder Canvas Empty</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Drag data segments, choose color layouts, and click Generate.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =======================================================
              PANE 5: SWAGGER / OPENAPI SPEC EXPLORER
              ======================================================= */}
          {activePane === 'openapi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* API Endpoints Navigator (Left 4-cols) */}
              <div className="lg:col-span-4 space-y-3">
                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">ENDPOINT CATALOG</span>
                <div className="space-y-2">
                  {Object.entries(apiEndpoints).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedEndpoint(key)}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-center space-x-2.5 ${
                        selectedEndpoint === key 
                          ? 'bg-slate-900 dark:bg-slate-800 border-transparent text-white shadow' 
                          : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 hover:bg-slate-100/50'
                      }`}
                    >
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                        value.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {value.method}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <span className="block text-[11px] font-bold truncate leading-tight">{value.path}</span>
                        <span className="text-[8px] text-slate-400 font-mono block truncate mt-0.5">{value.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameters & Live Sandbox (Right 8-cols) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Info Block */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-150 dark:border-slate-850 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-indigo-500 text-white font-mono text-[9px] font-bold rounded">
                      {apiEndpoints[selectedEndpoint as keyof typeof apiEndpoints].method}
                    </span>
                    <span className="font-mono font-bold text-slate-850 dark:text-slate-200">
                      {apiEndpoints[selectedEndpoint as keyof typeof apiEndpoints].path}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {apiEndpoints[selectedEndpoint as keyof typeof apiEndpoints].description}
                  </p>
                </div>

                {/* Parameters list & Sandbox button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Parameters */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-black text-slate-400 block uppercase">PARAMETERS CONFIG</span>
                    
                    {apiEndpoints[selectedEndpoint as keyof typeof apiEndpoints].parameters.length === 0 ? (
                      <span className="text-[10px] text-slate-400 font-mono italic">No query parameters required.</span>
                    ) : (
                      <div className="space-y-2">
                        {apiEndpoints[selectedEndpoint as keyof typeof apiEndpoints].parameters.map((param, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                {param.name} ({param.type})
                              </span>
                              {param.required && <span className="text-rose-500 text-[9px] font-mono">required</span>}
                            </div>
                            <input 
                              type="text" 
                              placeholder={param.description}
                              value={apiQueryParam}
                              onChange={e => setApiQueryParam(e.target.value)}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleTestAPI}
                        disabled={apiLoading}
                        className="w-full py-2 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow"
                      >
                        {apiLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        <span>{apiLoading ? 'Executing Sandbox Request...' : 'Send Test Request'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Schema Responses */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono font-black text-slate-400 block uppercase">SCHEMA RESPONSES</span>
                    <div className="bg-slate-950 text-white p-3 rounded-2xl border border-slate-850 font-mono text-[9px] leading-relaxed max-h-[160px] overflow-y-auto">
                      <span className="text-emerald-400 block">HTTP 200 OK Response Schema:</span>
                      <pre className="text-slate-400 whitespace-pre-wrap mt-1">
                        {JSON.stringify(apiEndpoints[selectedEndpoint as keyof typeof apiEndpoints].responses, null, 2)}
                      </pre>
                    </div>
                  </div>

                </div>

                {/* API Sandbox Output console */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-black text-slate-400 block uppercase">SANDBOX LIVE TERMINAL OUTPUT</span>
                  <div className="bg-slate-950 text-slate-300 p-4 rounded-2xl border border-slate-850 font-mono text-[10px] leading-relaxed min-h-[140px] max-h-[220px] overflow-y-auto relative">
                    <div className="absolute top-2 right-2 text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400">
                      CURL CLIENT READY
                    </div>

                    {apiResponse ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 border-b border-white/5 pb-1.5">
                          <span className="text-green-400">HTTP/1.1 200 OK</span>
                          <span className="text-slate-500">• Server: Express/Node Container</span>
                        </div>
                        <pre className="text-emerald-400 font-mono">
                          {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                      </div>
                    ) : apiLoading ? (
                      <span className="text-indigo-400 animate-pulse block">Pinging REST segments... resolving UUID keys... parsing headers...</span>
                    ) : (
                      <span className="text-slate-500">Terminal console idle. Configure inputs and click Send Test Request to query the live backend.</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
