import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Eye, Play, Sun, Moon, CloudSun, CloudRain, Wind, 
  MapPin, Info, ArrowUpRight, Truck, Radio, Navigation, ZoomIn, ZoomOut
} from 'lucide-react';
import { SupabaseService } from '../../supabaseService';

interface Building {
  id: string;
  name: string;
  x: number;
  y: number;
  height: number;
  type: 'residential' | 'commercial' | 'industrial' | 'park';
  status: 'optimal' | 'pending-collection';
}

interface TruckSim {
  id: string;
  plate: string;
  x: number;
  y: number;
  angle: number;
  battery: number;
  speed: number;
  targetNode: number;
}

export default function DigitalTwin() {
  const [dayCycle, setDayCycle] = useState<'day' | 'sunset' | 'night'>('night');
  const [weather, setWeather] = useState<'sunny' | 'rain' | 'fog'>('sunny');
  const [selectedElement, setSelectedElement] = useState<{ type: string; name: string; details: string; status: string } | null>({
    type: 'Grid Node',
    name: 'Sector C Central Core',
    details: 'Primary GIS junction, coordinates mapped via high-precision LIDAR sweep.',
    status: 'Steady operational flow'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Roads layout nodes for truck motion
  const roadNodes = [
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 500, y: 100 },
    { x: 500, y: 250 },
    { x: 300, y: 250 },
    { x: 100, y: 250 },
    { x: 100, y: 380 },
    { x: 500, y: 380 }
  ];

  // Simulated truck positions
  const [trucks, setTrucks] = useState<TruckSim[]>([
    { id: 'tr-1', plate: 'EV-TRUCK-14', x: 100, y: 100, angle: 0, battery: 92, speed: 1.5, targetNode: 1 },
    { id: 'tr-2', plate: 'EV-TRUCK-11', x: 500, y: 250, angle: 1.5, battery: 84, speed: 1.2, targetNode: 4 }
  ]);

  // Simulated static smart bins
  const smartBins = [
    { id: 'sb-101', name: 'SB-101 (Municipal Hub)', x: 180, y: 100, fill: 42, temp: 21 },
    { id: 'sb-102', name: 'SB-102 (Transit Hub)', x: 450, y: 100, fill: 88, temp: 24 },
    { id: 'sb-103', name: 'SB-103 (Union Sq East)', x: 300, y: 250, fill: 76, temp: 22 },
    { id: 'sb-104', name: 'SB-104 (Central Park)', x: 220, y: 380, fill: 92, temp: 28 }
  ];

  const binCoords: Record<string, {x: number, y: number}> = {
    'bin-101': { x: 180, y: 100 },
    'bin-102': { x: 450, y: 100 },
    'bin-103': { x: 300, y: 250 },
    'bin-104': { x: 220, y: 380 },
    'bin-105': { x: 130, y: 200 },
    'bin-106': { x: 380, y: 320 },
    'bin-107': { x: 490, y: 380 },
    'bin-201': { x: 80,  y: 280 },
    'bin-202': { x: 350, y: 180 },
    'bin-203': { x: 420, y: 320 },
    'bin-204': { x: 280, y: 90 },
    'bin-205': { x: 240, y: 220 },
    'bin-206': { x: 150, y: 340 }
  };

  const [liveBins, setLiveBins] = useState<any[]>([]);
  const liveBinsRef = useRef<any[]>([]);

  const fetchLiveBins = async () => {
    try {
      const data = await SupabaseService.getSmartBins();
      setLiveBins(data);
      liveBinsRef.current = data;
    } catch (err) {
      console.error('Error fetching live bins for digital twin:', err);
    }
  };

  useEffect(() => {
    fetchLiveBins();
    const interval = setInterval(fetchLiveBins, 8000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic buildings block map
  const buildings: Building[] = [
    { id: 'b-1', name: 'Salesforce Corporate Tower', x: 150, y: 180, height: 110, type: 'commercial', status: 'optimal' },
    { id: 'b-2', name: 'Sutter Medical Center', x: 400, y: 160, height: 75, type: 'residential', status: 'optimal' },
    { id: 'b-3', name: 'Civic Plaza Residences', x: 250, y: 320, height: 60, type: 'residential', status: 'optimal' },
    { id: 'b-4', name: 'Union Square Shopping Plaza', x: 450, y: 320, height: 85, type: 'commercial', status: 'pending-collection' }
  ];

  // Drone simulation
  const [drone, setDrone] = useState({ x: 200, y: 150, tx: 300, ty: 280, alt: 120, mode: 'Inspection' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 650;
    canvas.height = 420;

    let rainParticles: { x: number; y: number; speed: number; len: number }[] = [];
    for (let i = 0; i < 40; i++) {
      rainParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 5 + Math.random() * 5,
        len: 10 + Math.random() * 10
      });
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Backdrop based on Day cycle
      let bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (dayCycle === 'day') {
        bgGrad.addColorStop(0, '#0f172a'); // Keep dark grid theme for supreme executive contrast
        bgGrad.addColorStop(1, '#1e293b');
      } else if (dayCycle === 'sunset') {
        bgGrad.addColorStop(0, '#111827');
        bgGrad.addColorStop(1, '#31102f');
      } else {
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(1, '#0b0f19');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Futuristic grid lines (3D perspective perspective effect)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // 3. Draw Roads / Routes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(roadNodes[0].x, roadNodes[0].y);
      for (let n = 1; n < roadNodes.length; n++) {
        ctx.lineTo(roadNodes[n].x, roadNodes[n].y);
      }
      ctx.stroke();

      // Draw road dashed yellow lines
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(roadNodes[0].x, roadNodes[0].y);
      for (let n = 1; n < roadNodes.length; n++) {
        ctx.lineTo(roadNodes[n].x, roadNodes[n].y);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 4. Render Isometric / 3D looking wireframe Buildings
      buildings.forEach(b => {
        // Draw 3D Building Base
        ctx.fillStyle = b.type === 'commercial' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)';
        ctx.strokeStyle = b.type === 'commercial' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1.5;

        // Draw side columns
        ctx.beginPath();
        ctx.rect(b.x - 20, b.y - b.height, 40, b.height);
        ctx.fill();
        ctx.stroke();

        // Draw top face
        ctx.fillStyle = b.type === 'commercial' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.moveTo(b.x - 20, b.y - b.height);
        ctx.lineTo(b.x, b.y - b.height - 10);
        ctx.lineTo(b.x + 20, b.y - b.height);
        ctx.lineTo(b.x, b.y - b.height + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw little glowing antenna at peak
        ctx.fillStyle = b.status === 'pending-collection' ? '#f43f5e' : '#10b981';
        ctx.beginPath();
        ctx.arc(b.x, b.y - b.height - 10, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Render Smart Bins
      const currentBins = liveBinsRef.current.length > 0
        ? liveBinsRef.current.map((b, idx) => ({
            id: b.id,
            name: b.name,
            x: binCoords[b.id]?.x || (80 + (idx * 73) % 480),
            y: binCoords[b.id]?.y || (80 + (idx * 61) % 280),
            fill: b.fillLevel,
            temp: b.temperature
          }))
        : smartBins;

      currentBins.forEach(bin => {
        const fillCol = bin.fill >= 85 ? '#f43f5e' : bin.fill >= 70 ? '#f59e0b' : '#10b981';
        ctx.shadowColor = fillCol;
        ctx.shadowBlur = 8;
        ctx.fillStyle = fillCol;
        ctx.beginPath();
        ctx.arc(bin.x, bin.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Label tag
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.font = '8px monospace';
        ctx.fillText(`${bin.fill}%`, bin.x - 8, bin.y - 10);
      });

      // 6. Update and Draw Simulated Moving Trucks
      setTrucks(prev => prev.map(tr => {
        // Seek target node coordinates
        const target = roadNodes[tr.targetNode];
        const dx = target.x - tr.x;
        const dy = target.y - tr.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let nx = tr.x;
        let ny = tr.y;
        let nextTarget = tr.targetNode;

        if (dist > 2) {
          nx += (dx / dist) * tr.speed;
          ny += (dy / dist) * tr.speed;
        } else {
          // Choose next node loop
          nextTarget = (tr.targetNode + 1) % roadNodes.length;
        }

        // Draw truck icon
        ctx.save();
        ctx.translate(tr.x, tr.y);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.fillRect(-8, -4, 16, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, -3, 4, 6); // windshield
        ctx.restore();
        ctx.shadowBlur = 0;

        return { ...tr, x: nx, y: ny, targetNode: nextTarget };
      }));

      // 7. Update and Draw Drone
      let ddx = drone.tx - drone.x;
      let ddy = drone.ty - drone.y;
      let ddist = Math.sqrt(ddx * ddx + ddy * ddy);
      let ndx = drone.x;
      let ndy = drone.y;
      let ndtx = drone.tx;
      let ndty = drone.ty;

      if (ddist > 4) {
        ndx += (ddx / ddist) * 2;
        ndy += (ddy / ddist) * 2;
      } else {
        // Change targets randomly
        ndtx = Math.random() * (canvas.width - 100) + 50;
        ndty = Math.random() * (canvas.height - 100) + 50;
      }

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ndx, ndy);
      ctx.lineTo(ndx, ndy + 30); // camera projection
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Drone core
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(ndx, ndy, 5, 0, Math.PI * 2);
      ctx.fill();
      // Quad rotors
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ndx - 8, ndy - 8); ctx.lineTo(ndx + 8, ndy + 8);
      ctx.moveTo(ndx - 8, ndy + 8); ctx.lineTo(ndx + 8, ndy - 8);
      ctx.stroke();

      // 8. WEATHER OVERLAYS
      if (weather === 'rain') {
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.lineWidth = 1.5;
        rainParticles.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.len);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 0.5;
          if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
        });
      }

      if (weather === 'fog') {
        let fogGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width / 1.5);
        fogGrad.addColorStop(0, 'rgba(148, 163, 184, 0.05)');
        fogGrad.addColorStop(1, 'rgba(148, 163, 184, 0.35)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Loop animation
      animationRef.current = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [dayCycle, weather]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const currentBins = liveBinsRef.current.length > 0
      ? liveBinsRef.current.map((b, idx) => ({
          id: b.id,
          name: b.name,
          x: binCoords[b.id]?.x || (80 + (idx * 73) % 480),
          y: binCoords[b.id]?.y || (80 + (idx * 61) % 280),
          fill: b.fillLevel,
          temp: b.temperature
        }))
      : smartBins;

    // Check if clicked close to a Smart Bin
    const clickedBin = currentBins.find(bin => {
      const dx = bin.x - clickX;
      const dy = bin.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    if (clickedBin) {
      setSelectedElement({
        type: 'Smart IoT Bin Node',
        name: clickedBin.name,
        details: `Active sensor mapping coordinate indices. Current volume capacity computed at ${clickedBin.fill}% capacity threshold.`,
        status: clickedBin.fill >= 85 ? '🚨 ALERT: Near-overflow limit triggered!' : '🟢 Nominal operational cycle'
      });
      return;
    }

    // Check if clicked close to a Building
    const clickedBldg = buildings.find(b => {
      const dx = b.x - clickX;
      const dy = (b.y - b.height / 2) - clickY;
      return Math.sqrt(dx * dx + dy * dy) < 30;
    });

    if (clickedBldg) {
      setSelectedElement({
        type: 'GIS Building Overlay',
        name: clickedBldg.name,
        details: `Building profile categorized as ${clickedBldg.type}. Peak height registers at ${clickedBldg.height} meters in the GIS mesh.`,
        status: clickedBldg.status === 'optimal' ? '🟢 Grid clear' : '⚠️ Refuse collection requested near rear alley.'
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Compass className="h-5 w-5 mr-1.5 text-cyan-500 animate-spin" style={{ animationDuration: '15s' }} /> Live 3D Digital Twin Core
          </h3>
          <p className="text-xs text-slate-500">Real-time vector telemetry simulation drawing active vehicles, drone sweeps, and ward sensor nodes.</p>
        </div>

        {/* HUD control dials */}
        <div className="flex items-center gap-2">
          {/* Day/Night buttons */}
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setDayCycle('day')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${dayCycle === 'day' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
              title="Day Solar light"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDayCycle('sunset')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${dayCycle === 'sunset' ? 'bg-amber-500 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
              title="Sunset Solar light"
            >
              <CloudSun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDayCycle('night')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${dayCycle === 'night' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
              title="Midnight HUD Mode"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>

          {/* Weather buttons */}
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setWeather('sunny')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${weather === 'sunny' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
              title="Clear ambient weather"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setWeather('rain')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${weather === 'rain' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
              title="Activate Rain Particle Engine"
            >
              <CloudRain className="h-4 w-4" />
            </button>
            <button
              onClick={() => setWeather('fog')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${weather === 'fog' ? 'bg-slate-500 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
              title="Activate Fog/Haze layer"
            >
              <Wind className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main layout Map + Sidebar Inspect */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Canvas Area */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800/80 p-3 shadow-xl overflow-hidden flex flex-col justify-between relative">
          
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-[9px] font-mono font-black text-cyan-400 bg-cyan-950/85 border border-cyan-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              interactive lidar twin mesh
            </span>
            <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-950/85 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              60 fps rendering active
            </span>
          </div>

          {/* HTML5 Interactive canvas */}
          <div className="flex-1 flex items-center justify-center min-h-[350px]">
            <canvas 
              ref={canvasRef} 
              onClick={handleCanvasClick}
              className="w-full max-w-[650px] aspect-[65/42] rounded-2xl border border-slate-900 cursor-pointer block"
            />
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl z-10 mt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>💡 Click buildings, trucks, or smart-bin points directly on the LIDAR mesh to inspect GIS metadata.</span>
            <span className="text-emerald-400 font-bold">● SIMULATION LOOP ONLINE</span>
          </div>
        </div>

        {/* Sidebar Element Inspector */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Radio className="h-4.5 w-4.5 text-cyan-500 animate-pulse" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">LIDAR Inspector HUD</h4>
              </div>

              {selectedElement ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-500 font-bold block uppercase tracking-wider">{selectedElement.type}</span>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{selectedElement.name}</h5>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    "{selectedElement.details}"
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-400">Node Status:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedElement.status}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-400">Mesh Resolution:</span>
                      <span className="text-slate-850 dark:text-slate-200 font-bold">0.05m Point Density</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-slate-400">GIS Sync Lock:</span>
                      <span className="text-emerald-500 font-bold">Active (0.2s refresh)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p>No element selected. Click on objects inside the 3D twin wireframe to inspect coordinates.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">TELEMETRY CORRELATOR</span>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-slate-400 block">EV FLEET COORDS:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">2 Active Units</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-slate-400 block">ACTIVE FLIGHTS:</span>
                  <span className="text-purple-500 font-bold">1 Patrol Drone</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
