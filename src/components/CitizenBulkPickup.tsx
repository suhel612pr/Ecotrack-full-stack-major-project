import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Truck, HelpCircle, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface CitizenBulkPickupProps {
  onSuccess: (details: any) => void;
}

export default function CitizenBulkPickup({ onSuccess }: CitizenBulkPickupProps) {
  const [scheduled, setScheduled] = useState(false);
  
  // Form states
  const [date, setDate] = useState('2026-07-15');
  const [time, setTime] = useState('09:00');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [wasteType, setWasteType] = useState('Furniture');
  const [volume, setVolume] = useState(2); // estimated volume in cubic meters
  const [description, setDescription] = useState('');

  // Dynamically calculated cost based on wasteType and volume
  const getMultiplier = (type: string) => {
    switch (type) {
      case 'Electronics': return 25.00;
      case 'Construction Waste': return 35.00;
      case 'Large Appliances': return 30.00;
      case 'Garden Waste': return 12.00;
      default: return 15.00; // Furniture
    }
  };

  const calculatedCost = volume * getMultiplier(wasteType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      preferred_date: date,
      waste_description: `[${wasteType}] ${description || 'Debris disposal'}`,
      estimated_volume: volume,
      cost: calculatedCost
    });
    setScheduled(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-xl">
      <AnimatePresence mode="wait">
        {!scheduled ? (
          <motion.div
            key="bulk-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* Left form details */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Schedule Bulk Waste Pickup</h3>
                  <p className="text-xs text-slate-500">Arrange dedicated container trucks to clear heavy debris and large items.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Waste Category Type</label>
                  <select
                    value={wasteType}
                    onChange={e => setWasteType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {['Furniture', 'Electronics', 'Construction Waste', 'Garden Waste', 'Large Appliances'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">
                    Estimated Volume (m³ / Cubic Yards)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={volume}
                      onChange={e => setVolume(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                    <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg shrink-0 text-slate-700 dark:text-slate-300">
                      {volume} m³
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Preferred Time Window</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                    <select
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="09:00">09:00 AM - 12:00 PM</option>
                      <option value="12:00">12:00 PM - 03:00 PM</option>
                      <option value="15:00">03:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Disposal Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Debris details / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g., 3 large wooden bookshelves, disassembled. Left next to the garage doors."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/15"
              >
                <span>TRANSMIT BULK DISPOSAL REQUEST</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>

            {/* Right Cost Summary Panel (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/20 p-6 rounded-3xl border border-slate-150 dark:border-slate-850 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                  ESTIMATED CLEARANCE RECEIPT
                </span>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Basic Rate:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">1 m³ = ${getMultiplier(wasteType).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Total Volume:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{volume} m³</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Waste Multiplier:</span>
                    <span className="font-mono font-bold text-emerald-600">{wasteType}</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Municipal Surcharge:</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      ${calculatedCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Helpful tips */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-xs space-y-1.5">
                  <h5 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-1" /> Environmental Note
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Bulk debris pickup fee includes clean separation, sorting, and organic shredding. Non-recyclables are disposed following strict regional landfill codes.
                  </p>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 font-mono text-center pt-4">
                <span>REIMBURSED VIA CITIZEN WASTE RECOVERY REWARDS SYSTEM</span>
              </div>
            </div>
          </motion.div>
        ) : (
          // Success simulated Receipt screen!
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center space-y-6 py-6"
          >
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Bulk Pickup Scheduled!</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Municipal dispatchers have booked your container truck. Crew alpha has been dispatched to <strong>{address}</strong> on <strong>{date}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2 text-left text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{wasteType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Volume:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{volume} m³</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-850 pt-1.5 flex justify-between font-bold text-sm">
                <span className="text-slate-800 dark:text-slate-200">Amount Charged:</span>
                <span className="text-emerald-600">${calculatedCost.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setScheduled(false)}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              Book Another Pickup
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
