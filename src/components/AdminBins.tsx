import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartBin, WasteCategory } from '../types';
import { 
  Plus, Trash2, Battery, Thermometer, MapPin, Check, 
  PlusCircle, PenTool, Database, Trash, Search, Filter, 
  ArrowUpDown, CheckSquare, Square, RefreshCw, Flame, 
  RotateCcw, Sparkles, AlertTriangle, Wifi, SignalHigh
} from 'lucide-react';

interface AdminBinsProps {
  bins: SmartBin[];
  onAddBin: (bin: any) => void;
  onDeleteBin: (binId: string) => void;
}

export default function AdminBins({ bins, onAddBin, onDeleteBin }: AdminBinsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Bin states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<WasteCategory>('recyclable');
  const [capacity, setCapacity] = useState('120L');
  const [lat, setLat] = useState('37.7749');
  const [lng, setLng] = useState('-122.4194');

  // Search & Filtering States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | WasteCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'low-battery' | 'fire-alert' | 'tilt-alert' | 'healthy' | 'degraded'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'fillLevel' | 'batteryLevel' | 'temperature'>('fillLevel');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Local state for fast responsive mutations
  const [localBins, setLocalBins] = useState<SmartBin[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Synchronize local state with props when database updates
  useEffect(() => {
    // Enrich bins with simulation data if fields are missing
    const enriched = bins.map(bin => ({
      ...bin,
      sensorHealth: bin.sensorHealth || 'healthy',
      signalStrength: bin.signalStrength || 'Excellent',
      fireAlert: bin.fireAlert || false,
      maintenanceStatus: bin.maintenanceStatus || 'none',
      // Simulate tilt alert for any near capacity or degraded bins for rich demo UI
      tiltAlert: bin.id === 'bin-103' || (bin.fillLevel > 90 && bin.id !== 'bin-104')
    }));
    setLocalBins(enriched as any);
  }, [bins]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    onAddBin({
      name,
      address,
      category,
      capacity,
      fillLevel: Math.floor(Math.random() * 40), // start low
      batteryLevel: 100,
      temperature: 18,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      lastEmptied: 'Just Added',
      sensorHealth: 'healthy',
      signalStrength: 'Excellent',
      fireAlert: false,
      maintenanceStatus: 'none'
    });

    // Reset states
    setName('');
    setAddress('');
    setCategory('recyclable');
    setCapacity('120L');
    setShowAddForm(false);
  };

  // Bulk action handlers
  const handleToggleSelectAll = () => {
    const visibleIds = filteredAndSortedBins.map(b => b.id);
    if (selectedIds.length === visibleIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleIds);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleBulkEmpty = () => {
    if (selectedIds.length === 0) return;
    setLocalBins(prev => prev.map(bin => {
      if (selectedIds.includes(bin.id)) {
        return {
          ...bin,
          fillLevel: 0,
          lastEmptied: new Date().toTimeString().substring(0, 5) + ' (Bulk emptied)'
        };
      }
      return bin;
    }));
    alert(`Bulk emptying successful. ${selectedIds.length} IoT Smart Bins reset to 0% capacity.`);
    setSelectedIds([]);
  };

  const handleBulkResetAlerts = () => {
    if (selectedIds.length === 0) return;
    setLocalBins(prev => prev.map(bin => {
      if (selectedIds.includes(bin.id)) {
        return {
          ...bin,
          fireAlert: false,
          tiltAlert: false as any,
          sensorHealth: 'healthy'
        };
      }
      return bin;
    }));
    alert(`Environmental alerts cleared for ${selectedIds.length} select nodes.`);
    setSelectedIds([]);
  };

  const handleBulkScheduleMaintenance = () => {
    if (selectedIds.length === 0) return;
    setLocalBins(prev => prev.map(bin => {
      if (selectedIds.includes(bin.id)) {
        return {
          ...bin,
          maintenanceStatus: 'scheduled'
        };
      }
      return bin;
    }));
    alert(`Technician dispatch routes scheduled for ${selectedIds.length} edge nodes.`);
    setSelectedIds([]);
  };

  // Filter & Sort Logic
  const filteredAndSortedBins = localBins
    .filter(bin => {
      const matchesSearch = bin.name.toLowerCase().includes(search.toLowerCase()) || 
                            bin.address.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || bin.category === categoryFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'critical') matchesStatus = bin.fillLevel >= 80;
      else if (statusFilter === 'low-battery') matchesStatus = bin.batteryLevel < 20;
      else if (statusFilter === 'fire-alert') matchesStatus = bin.fireAlert === true;
      else if (statusFilter === 'tilt-alert') matchesStatus = (bin as any).tiltAlert === true;
      else if (statusFilter === 'healthy') matchesStatus = bin.sensorHealth === 'healthy';
      else if (statusFilter === 'degraded') matchesStatus = bin.sensorHealth === 'degraded';

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = (a[sortBy] as number) - (b[sortBy] as number);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const getCategoryEmoji = (cat: WasteCategory) => {
    switch (cat) {
      case 'recyclable': return '🥤';
      case 'organic': return '🍌';
      case 'hazardous': return '🔋';
      default: return '🗑️';
    }
  };

  return (
    <div className="space-y-6 text-left" id="bins-root-pane">
      
      {/* Top Banner & Trigger Form Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <SignalHigh className="h-5 w-5 mr-1.5 text-emerald-500 animate-pulse" /> Smart Bin IoT Management
          </h3>
          <p className="text-xs text-slate-500">Monitor telemetry thresholds, clear fire/tilt faults, or provision new intelligent nodes.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
          id="add-bin-console-btn"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? 'Close Console' : 'Add IoT Node'}</span>
        </button>
      </div>

      {/* Provision Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4">
              <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                PROVISION NEW SMART BIN TELEMETRY
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Bin Name / Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g., Smart Bin SB-108"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Location Address</label>
                  <input
                    type="text"
                    placeholder="e.g., 500 Market St Corridor"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Waste category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as WasteCategory)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs capitalize text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="recyclable">Recyclable</option>
                    <option value="organic">Organic</option>
                    <option value="landfill">Landfill</option>
                    <option value="hazardous">Hazardous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Cylinder Capacity</label>
                  <select
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="120L">120L Standard Cylinder</option>
                    <option value="240L">240L Heavy Duty Container</option>
                    <option value="500L">500L Subsurface Commercial Vault</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Latitude Coordinate</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Longitude Coordinate</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
              >
                PROVISION & INTEGRATE IoT SMART NODE
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4" id="bins-filters-panel">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search bar (Left 4 cols) */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by node name or address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2 relative">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="recyclable">🥤 Recyclable</option>
              <option value="organic">🍌 Organic</option>
              <option value="landfill">🗑️ Landfill</option>
              <option value="hazardous">🔋 Hazardous</option>
            </select>
          </div>

          {/* Status/Health Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
            >
              <option value="all">All Sensor Healths</option>
              <option value="critical">🚨 Overflow (&gt;=80%)</option>
              <option value="low-battery">🔋 Low Battery (&lt;20%)</option>
              <option value="fire-alert">🔥 Fire Outbreak Alerts</option>
              <option value="tilt-alert">⚠️ Tilt Alerts</option>
              <option value="healthy">❇️ Status: Healthy</option>
              <option value="degraded">⚠️ Status: Degraded</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="md:col-span-3 flex items-center space-x-2">
            <div className="flex-grow">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
              >
                <option value="fillLevel">Sort: Fill Level</option>
                <option value="batteryLevel">Sort: Battery Life</option>
                <option value="temperature">Sort: Temperature</option>
                <option value="name">Sort: Node Name</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition"
              title="Toggle sorting direction"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Multi selection / Quick Statistics header row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-850/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 font-semibold"
            >
              {selectedIds.length === filteredAndSortedBins.length && filteredAndSortedBins.length > 0 ? (
                <CheckSquare className="h-4 w-4 text-emerald-500" />
              ) : (
                <Square className="h-4 w-4 text-slate-400" />
              )}
              <span>Select All Visible ({filteredAndSortedBins.length} found)</span>
            </button>

            {selectedIds.length > 0 && (
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                {selectedIds.length} SELECTED
              </span>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-4">
            <span>GRID COVERAGE: OK</span>
            <span>•</span>
            <span className="text-rose-500 font-semibold">{localBins.filter(b => b.fillLevel >= 80).length} OVERFLOWS</span>
            <span>•</span>
            <span className="text-orange-400 font-semibold">{localBins.filter(b => b.batteryLevel <= 15).length} LOW BATTERY</span>
          </div>

        </div>

      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bins-cards-grid">
        {filteredAndSortedBins.map(bin => {
          const isSelected = selectedIds.includes(bin.id);
          const hasFire = bin.fireAlert;
          const hasTilt = (bin as any).tiltAlert;

          return (
            <div 
              key={bin.id}
              onClick={() => handleToggleSelect(bin.id)}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 cursor-pointer relative ${
                isSelected 
                  ? 'border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/20' 
                  : 'border-slate-200/50 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-750'
              }`}
            >
              {/* Overlay Check Indicator */}
              <div className="absolute top-4 right-4 z-10">
                {isSelected ? (
                  <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-white border border-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center text-transparent" />
                )}
              </div>

              <div className="space-y-2">
                
                {/* Header details */}
                <div className="flex items-start justify-between pr-6">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-850 text-slate-500 px-2 py-0.5 rounded">
                        {bin.id}
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full ${bin.sensorHealth === 'healthy' ? 'bg-emerald-500' : 'bg-orange-500 animate-ping'}`} />
                      <span className="text-[9px] text-slate-400 uppercase font-mono">{bin.signalStrength || 'Online'}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-150 mt-1">{bin.name}</h4>
                  </div>
                </div>

                {/* Warning Alert Indicators */}
                {(hasFire || hasTilt) && (
                  <div className="flex flex-col space-y-1 mt-1">
                    {hasFire && (
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 font-mono font-bold text-[9px] animate-pulse">
                        <Flame className="h-3.5 w-3.5 mr-1" />
                        <span>🚨 EXTREME FIRE/THERMAL OUTBREAK DETECTED!</span>
                      </div>
                    )}
                    {hasTilt && (
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono font-bold text-[9px]">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        <span>⚠️ CAPSIZE / TILT ANGLE DEVIATION DETECTED</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Address & telemetry tags */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{bin.address}</span>
                  </div>
                  <div className="flex items-center space-x-3 pt-1">
                    <div className="flex items-center">
                      <Battery className={`h-3.5 w-3.5 mr-0.5 ${bin.batteryLevel < 20 ? 'text-rose-500 font-extrabold animate-bounce' : 'text-emerald-500'}`} />
                      <span className={bin.batteryLevel < 20 ? 'text-rose-500 font-bold' : ''}>{bin.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="h-3.5 w-3.5 mr-0.5 text-orange-500" />
                      <span>{bin.temperature}°C</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] font-bold">
                      {getCategoryEmoji(bin.category)} {bin.category.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Cylinder Fill Volume</span>
                  <span className={`font-bold ${bin.fillLevel >= 80 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}`}>{bin.fillLevel}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      bin.fillLevel >= 80 ? 'bg-rose-500' : bin.fillLevel >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${bin.fillLevel}%` }}
                  />
                </div>
              </div>

              {/* Maintenance indicators & single actions */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
                <div className="flex flex-col text-[10px] font-mono text-slate-400 text-left">
                  <span>Last Coll: {bin.lastEmptied || 'Never'}</span>
                  <span>Maint: <span className="capitalize text-slate-500 font-semibold">{bin.maintenanceStatus || 'none'}</span></span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Decommission smart bin: Are you sure you want to completely remove IoT node ${bin.name}? This removes all server communication rules.`)) {
                      onDeleteBin(bin.id);
                    }
                  }}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition"
                  title="Decommission node"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Floating Bulk Action Drawer */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 text-white p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            id="bulk-actions-drawer"
          >
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs font-bold font-mono tracking-widest text-emerald-400 block uppercase">
                  BULK COMMAND CENTRE
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Authorized action targeting <strong className="text-white">{selectedIds.length} selected</strong> municipal IoT nodes.
                </span>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 justify-end">
              <button
                onClick={handleBulkEmpty}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                id="bulk-empty-action"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Empty Cylinders</span>
              </button>
              
              <button
                onClick={handleBulkResetAlerts}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                id="bulk-reset-alerts-action"
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Reset Alerts</span>
              </button>

              <button
                onClick={handleBulkScheduleMaintenance}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                id="bulk-maint-action"
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>Schedule Maint.</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition"
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
