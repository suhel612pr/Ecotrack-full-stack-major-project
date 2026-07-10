import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartBin } from '../types';
import { 
  QrCode, Scan, ShieldAlert, CheckCircle, RefreshCw, 
  Battery, Thermometer, Database, Landmark, AlertTriangle, 
  Trash2, ChevronRight, Activity 
} from 'lucide-react';

interface WorkerQRScannerProps {
  bins: SmartBin[];
  onCompleteBinCollection: (binId: string) => void;
}

export default function WorkerQRScanner({ bins, onCompleteBinCollection }: WorkerQRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [scannedBin, setScannedBin] = useState<SmartBin | null>(null);
  const [collectionSuccess, setCollectionSuccess] = useState(false);

  const startSimulatedScan = (binId: string) => {
    setScanning(true);
    setScannedBin(null);
    setSelectedBinId(binId);
    setCollectionSuccess(false);

    setTimeout(() => {
      setScanning(false);
      const bin = bins.find(b => b.id === binId);
      if (bin) {
        setScannedBin(bin);
      }
    }, 1800); // simulate scanning time
  };

  const handleEmptyBin = () => {
    if (!scannedBin) return;
    onCompleteBinCollection(scannedBin.id);
    setCollectionSuccess(true);
    
    // Refresh local scannedBin state to reflect cleared capacity
    setScannedBin(prev => prev ? { ...prev, fillLevel: 0, lastEmptied: 'Just Now' } : null);
    setTimeout(() => {
      setCollectionSuccess(false);
      setScannedBin(null);
      setSelectedBinId(null);
    }, 4000);
  };

  const handleReportMaintenance = () => {
    alert(`Maintenance flag successfully logged for ${scannedBin?.name}. Dispatch team alerted.`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Scanning HUD (7 Cols equivalent) */}
        <div className="flex-1 space-y-4 text-left">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">QR Code Fleet Scanner</h3>
              <p className="text-xs text-slate-500">Scan smart bin physical tags to retrieve sensor matrices and log clearance operations.</p>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
            {/* HUD Scan corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-500"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-500"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-500"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-500"></div>

            <AnimatePresence mode="wait">
              {scanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Decoding QR Security Matrix...</p>
                    <p className="text-xs text-slate-500 font-mono text-center">Interrogating bin sensor hardware [{selectedBinId}]</p>
                  </div>
                  {/* Laser line sweep */}
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-bounce top-1/2"></div>
                </motion.div>
              ) : scannedBin ? (
                <motion.div
                  key="scanned"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center p-4 text-center space-y-2"
                >
                  <div className="text-4xl">🏷️</div>
                  <h4 className="text-base font-extrabold text-slate-50">{scannedBin.name} Verified</h4>
                  <p className="text-xs text-emerald-400 font-mono">ENCRYPTED TELEMETRY AUTHENTICATED</p>
                  
                  <button 
                    onClick={() => setScannedBin(null)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold font-mono transition"
                  >
                    Scan Another Tag
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  className="flex flex-col items-center space-y-3 p-4"
                >
                  <Scan className="h-10 w-10 text-slate-600 animate-pulse" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-300">Tag Scanner Dormant</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                      Select any physical bin code below to trigger simulated optical scans.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick simulation buttons list */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
              SIMULATE MUNICIPAL SMART BIN LABELS:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {bins.map(bin => (
                <button
                  key={bin.id}
                  onClick={() => startSimulatedScan(bin.id)}
                  disabled={scanning}
                  className={`p-2.5 rounded-xl border font-mono text-left transition flex items-center justify-between ${
                    selectedBinId === bin.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold truncate">{bin.name.replace('Smart Bin ', '')}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Smart Bin Telemetry / Actions (5 Cols) */}
        <div className="w-full md:w-[320px] shrink-0 bg-slate-50 dark:bg-slate-950/20 p-5 rounded-3xl border border-slate-150 dark:border-slate-850 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {scannedBin ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">BIN telemetry matrix</span>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border border-emerald-500/15">
                    {scannedBin.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{scannedBin.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono block">📍 {scannedBin.address}</span>
                </div>

                {/* Progress fill bar */}
                <div className="space-y-1.5 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Fill level capacity:</span>
                    <span className={`font-mono font-bold ${scannedBin.fillLevel >= 80 ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {scannedBin.fillLevel}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        scannedBin.fillLevel >= 80 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${scannedBin.fillLevel}%` }}
                    />
                  </div>
                </div>

                {/* Sensor indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">HEAT INDICATOR</span>
                    <span className="text-slate-700 dark:text-slate-200 font-extrabold flex items-center">
                      <Thermometer className="h-4 w-4 mr-1 text-orange-500" /> {scannedBin.temperature || 21}°C
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">BATTERY UNIT</span>
                    <span className="text-slate-700 dark:text-slate-200 font-extrabold flex items-center">
                      <Battery className="h-4 w-4 mr-1 text-emerald-500" /> {scannedBin.batteryLevel || 94}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl text-[10px] text-slate-400 font-mono flex items-center">
                  <Activity className="h-4 w-4 text-emerald-500 mr-2 shrink-0 animate-pulse" />
                  <span>LAST EMPTIED: {scannedBin.lastEmptied || 'Yesterday'}</span>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-slate-850">
                  {collectionSuccess ? (
                    <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl text-center text-xs font-bold text-green-600 font-mono">
                      ✔ CLEARANCE LOGGED SUCCESSFUL
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleEmptyBin}
                        disabled={scannedBin.fillLevel === 0}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                          scannedBin.fillLevel === 0 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Empty & Reset Bin capacity</span>
                      </button>
                      <button
                        onClick={handleReportMaintenance}
                        className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        <span>Flag Maintenance Required</span>
                      </button>
                    </>
                  )}
                </div>

              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[300px]">
                <Database className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2.5 animate-pulse" />
                <h5 className="font-bold text-slate-700 dark:text-slate-300">Awaiting QR Tag scan</h5>
                <p className="text-xs text-slate-400 leading-relaxed mt-1 max-w-xs">
                  Trigger an optical label scan to decrypt hardware telemetry parameters and log emptying tasks in realtime.
                </p>
              </div>
            )}
          </AnimatePresence>

          <div className="text-[9px] text-slate-400 font-mono text-center pt-4">
            <span>SYNCHRONIZED WITH CITADEL FLEET LOGS IN REALTIME</span>
          </div>
        </div>

      </div>
    </div>
  );
}
