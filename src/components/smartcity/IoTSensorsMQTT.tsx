import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Wifi, Flame, ShieldAlert, CheckCircle2, RefreshCw, 
  Settings, Battery, HardDrive, Radio, Signal, HelpCircle, Power
} from 'lucide-react';
import { SupabaseService } from '../../supabaseService';

interface SensorNode {
  id: string;
  name: string;
  mqttTopic: string;
  status: 'online' | 'offline' | 'alert';
  tilt: number;
  smokeLevel: number;
  battery: number;
  firmware: string;
  lastHeartbeat: string;
  rssi: number;
}

export default function IoTSensorsMQTT() {
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [heartbeatRate, setHeartbeatRate] = useState(5); // seconds
  const [isUpdatingFirmware, setIsUpdatingFirmware] = useState<string | null>(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [showPairModal, setShowPairModal] = useState(false);

  const brokerConfig = {
    host: 'broker.ecotrack.iot',
    port: 8883,
    clientId: 'smartcity_command_deck',
    protocol: 'MQTT/MQTTS (Secure TLS)'
  };

  // Fetch smart bins database and map to IoT sensor nodes
  const fetchIoTNodes = async () => {
    setIsSyncing(true);
    try {
      const bins = await SupabaseService.getSmartBins();
      const mapped: SensorNode[] = bins.map((bin: any) => {
        let status: 'online' | 'offline' | 'alert' = 'online';
        if (bin.fireAlert || bin.sensorHealth === 'degraded' || bin.batteryLevel < 15) {
          status = 'alert';
        }
        return {
          id: bin.id,
          name: `Node ${bin.name}`,
          mqttTopic: `city/sensors/${bin.id}/telemetry`,
          status,
          tilt: bin.sensorHealth === 'degraded' && !bin.fireAlert ? 48 : 2,
          smokeLevel: bin.fireAlert ? 85 : 8,
          battery: bin.batteryLevel,
          firmware: bin.batteryLevel < 15 ? 'v2.4.0' : 'v2.4.1',
          lastHeartbeat: '1.5s ago',
          rssi: bin.sensorHealth === 'degraded' ? -78 : -48
        };
      });
      setNodes(mapped);
    } catch (err) {
      console.error('Error fetching IoT nodes:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchIoTNodes();
    // Refresh interval for live MQTT polling
    const interval = setInterval(fetchIoTNodes, 6000);
    return () => clearInterval(interval);
  }, []);

  // Connect to live WebSocket to receive immediate bin updates!
  useEffect(() => {
    let ws: WebSocket | null = null;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/realtime`;

    const connectWS = () => {
      try {
        ws = new WebSocket(wsUrl);
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'BIN_UPDATED' || data.type === 'BIN_CREATED' || data.type === 'BIN_DELETED') {
            fetchIoTNodes();
          }
        };
        ws.onerror = (err) => {
          console.warn('IoT WebSocket connection error. Falling back to active REST polling.', err);
        };
      } catch (e) {
        console.warn('IoT WebSocket initialization failed. Falling back to active REST polling.', e);
      }
    };

    connectWS();
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const simulateAlert = async (id: string, type: 'smoke' | 'tilt' | 'battery') => {
    // Send telemetry hazard updates directly to the backend database!
    try {
      let body: any = {};
      if (type === 'smoke') {
        body.smokeLevel = 82;
      } else if (type === 'tilt') {
        body.tilt = 75;
      } else {
        body.battery = 4;
      }

      await SupabaseService.triggerTelemetryAlert(id, body);
      fetchIoTNodes();
    } catch (err) {
      console.error('Error simulating IoT alert:', err);
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      await SupabaseService.triggerTelemetryAlert(id, { status: 'online' });
      fetchIoTNodes();
    } catch (err) {
      console.error('Error resolving IoT alert:', err);
    }
  };

  const triggerFirmwareFlash = (id: string) => {
    setIsUpdatingFirmware(id);
    setUpdateProgress(0);
    const interval = setInterval(() => {
      setUpdateProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setNodes(prev => prev.map(n => n.id === id ? { ...n, firmware: 'v2.4.2 (Latest)' } : n));
            setIsUpdatingFirmware(null);
          }, 400);
          return 100;
        }
        return p + 25;
      });
    }, 300);
  };

  const registerNewPairing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    try {
      await SupabaseService.createSmartBin({
        name: newDeviceName,
        address: 'District IoT Mapped Segment',
        category: 'recyclable'
      });

      setNewDeviceName('');
      setShowPairModal(false);
      fetchIoTNodes();
    } catch (err) {
      console.error('Error provisioning IoT bin node:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Cpu className="h-5 w-5 mr-1.5 text-cyan-500" /> IoT Smart Grid & MQTT Broker Deck
          </h3>
          <p className="text-xs text-slate-500">Coordinate secure socket telemetry channels, monitor sensor fires/tilts, and provision new physical nodes.</p>
        </div>

        <button
          onClick={() => setShowPairModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
        >
          <Power className="h-3.5 w-3.5" />
          <span>Provision Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-Columns: Device nodes grid */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Active Connected Transceivers</h4>
              <span className="text-[9px] font-mono font-bold bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-400/20">
                MQTT Broker Subscriptions: {nodes.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes.map(node => (
                <div 
                  key={node.id}
                  className={`p-4 rounded-2xl border transition relative flex flex-col justify-between gap-4 ${
                    node.status === 'alert'
                      ? 'bg-rose-500/5 border-rose-500/15 shadow-sm shadow-rose-500/5'
                      : 'bg-slate-55/40 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850'
                  }`}
                >
                  {/* Status Indicator Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">{node.name}</h5>
                      <span className="text-[9px] text-slate-400 font-mono block mt-1">Topic: {node.mqttTopic}</span>
                    </div>

                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      node.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : node.status === 'alert' ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-slate-400/10 text-slate-400'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  {/* Telemetry Matrix */}
                  <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 dark:border-slate-850/60 py-3 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px]">TILT DEG:</span>
                      <span className={`font-bold ${node.tilt > 45 ? 'text-rose-500 font-black' : 'text-slate-700 dark:text-slate-300'}`}>{node.tilt}°</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">SMOKE LEVEL:</span>
                      <span className={`font-bold ${node.smokeLevel > 50 ? 'text-rose-500 font-black animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>{node.smokeLevel} ppm</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">RSSI:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{node.rssi} dBm</span>
                    </div>
                  </div>

                  {/* Device properties info */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Battery className={`h-3 w-3 ${node.battery < 20 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                      <span>{node.battery}%</span>
                    </div>
                    <span>FW: {node.firmware}</span>
                    <span>HRTB: {node.lastHeartbeat}</span>
                  </div>

                  {/* Simulation commands */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50 dark:border-slate-850/40">
                    {node.status === 'alert' ? (
                      <button 
                        onClick={() => resolveAlert(node.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] rounded-lg transition"
                      >
                        Reset Sensors
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => simulateAlert(node.id, 'smoke')}
                          className="px-2 py-1 bg-slate-950 dark:bg-slate-800 hover:bg-rose-900/30 text-[9px] text-slate-300 hover:text-rose-400 border border-slate-250 dark:border-slate-700 hover:border-rose-500/20 rounded-lg font-bold transition"
                        >
                          Sim Smoke Fire
                        </button>
                        <button 
                          onClick={() => simulateAlert(node.id, 'tilt')}
                          className="px-2 py-1 bg-slate-950 dark:bg-slate-800 hover:bg-amber-900/30 text-[9px] text-slate-300 hover:text-amber-400 border border-slate-250 dark:border-slate-700 hover:border-amber-500/20 rounded-lg font-bold transition"
                        >
                          Sim Tilt
                        </button>
                      </>
                    )}

                    <button 
                      onClick={() => triggerFirmwareFlash(node.id)}
                      disabled={isUpdatingFirmware !== null}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-950/20 text-[9px] text-slate-600 dark:text-slate-300 hover:text-cyan-400 border border-slate-200 dark:border-slate-700/60 hover:border-cyan-500/30 rounded-lg font-bold transition ml-auto"
                    >
                      {isUpdatingFirmware === node.id ? `Flashing ${updateProgress}%` : 'Update Firmw'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4-Columns: Broker settings */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center">
                <Settings className="h-4 w-4 mr-1.5 text-slate-500" /> Broker Configuration
              </h4>
            </div>

            <div className="space-y-3 font-mono text-[11px] text-slate-500">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-2 border border-slate-100 dark:border-slate-850">
                <div className="flex justify-between">
                  <span>MQTT Broker Host:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{brokerConfig.host}</span>
                </div>
                <div className="flex justify-between">
                  <span>TLS Port:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{brokerConfig.port}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="text-cyan-500 font-bold">{brokerConfig.protocol}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/40 dark:border-slate-800/50 pt-2 text-[10px]">
                  <span>Client ID:</span>
                  <span className="text-slate-400">{brokerConfig.clientId}</span>
                </div>
              </div>

              {/* Heartbeat rate slider */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-750 dark:text-slate-350">Heartbeat Interval</span>
                  <span className="font-bold text-cyan-500">{heartbeatRate}s</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="30" 
                  value={heartbeatRate}
                  onChange={(e) => setHeartbeatRate(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[9px] text-slate-400 italic block mt-1">Shorter interval increases telemetry precision but increases cellular battery draw.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Provisioning Modal */}
      <AnimatePresence>
        {showPairModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center">
                  <Wifi className="h-4 w-4 mr-1.5 text-cyan-500" /> Provision Node over MQTT
                </h4>
                <button 
                  onClick={() => setShowPairModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold font-mono"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={registerNewPairing} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Device Name / Location Label</label>
                  <input 
                    type="text" 
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="e.g. Node SB-108 (Library Plaza)"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-1.5 font-mono text-[10px] text-slate-400">
                  <p>● Auto-generates MQTT topic: city/sensors/iot-[n]/telemetry</p>
                  <p>● Binds sensor profiles (Smoke level index, Gyro Tilt indices, Battery Level)</p>
                  <p>● Establishes handshake via default TLS port 8883</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowPairModal(false)}
                    className="px-4 py-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                  >
                    Confirm Handshake
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
