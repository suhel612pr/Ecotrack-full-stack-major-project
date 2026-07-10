import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Eye, CheckCircle2, AlertOctagon, HelpCircle, MapPin, 
  Trash2, Award, Zap, Compass, RefreshCw, ZoomIn
} from 'lucide-react';
import { SupabaseService } from '../../supabaseService';

interface PresetMaterial {
  id: string;
  presetKey: string;
  name: string;
  imageUrl: string;
  category: 'recyclable' | 'organic' | 'landfill' | 'hazardous';
  siteCoords: string;
}

export default function ComputerVisionCV() {
  const presets: PresetMaterial[] = [
    {
      id: 'mat-1',
      presetKey: 'plastic_bottle',
      name: 'PET Plastic Water Bottle',
      imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=300',
      category: 'recyclable',
      siteCoords: '37.7812, -122.4115'
    },
    {
      id: 'mat-2',
      presetKey: 'banana_peel',
      name: 'Organic Food Scraps (Banana Peel)',
      imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=300',
      category: 'organic',
      siteCoords: '37.7785, -122.4192'
    },
    {
      id: 'mat-3',
      presetKey: 'cardboard_box',
      name: 'Corrugated Cardboard Shipping Box',
      imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300',
      category: 'recyclable',
      siteCoords: '37.7878, -122.4074'
    },
    {
      id: 'mat-4',
      presetKey: 'broken_glass',
      name: 'Tempered Plate Glass Shards',
      imageUrl: 'https://images.unsplash.com/photo-1597529480747-d3c6c2e3ab0f?auto=format&fit=crop&q=80&w=300',
      category: 'landfill',
      siteCoords: '37.7818, -122.4168'
    },
    {
      id: 'mat-5',
      presetKey: 'alkaline_battery',
      name: 'AA Alkaline Household Battery',
      imageUrl: 'https://images.unsplash.com/photo-1622322482620-759586013ec9?auto=format&fit=crop&q=80&w=300',
      category: 'hazardous',
      siteCoords: '37.7841, -122.4045'
    }
  ];

  const [activePreset, setActivePreset] = useState<PresetMaterial>(presets[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [classificationResult, setClassificationResult] = useState<any>(null);

  const startScan = async (preset: PresetMaterial) => {
    setActivePreset(preset);
    setIsScanning(true);
    setScanComplete(false);
    
    try {
      const result = await SupabaseService.classifyWaste(null, preset.presetKey);
      setClassificationResult(result);
    } catch (err) {
      console.error('Error running computer vision scan:', err);
    } finally {
      setIsScanning(false);
      setScanComplete(true);
    }
  };

  useEffect(() => {
    startScan(presets[0]);
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Camera className="h-5 w-5 mr-1.5 text-cyan-500 animate-pulse" /> Neural Material Classification Studio
          </h3>
          <p className="text-xs text-slate-500">Run real-time multi-spectral computer vision models, identify heavy metals or biological fluids, and calculate CO2 offsets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Columns - Preset selectors */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              Select Sample Payload Image
            </h4>

            <div className="space-y-3">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => startScan(p)}
                  disabled={isScanning}
                  className={`w-full p-3 rounded-2xl border text-xs text-left transition flex items-center gap-3 ${
                    activePreset.id === p.id 
                      ? 'bg-slate-900 dark:bg-slate-800 text-white border-transparent' 
                      : 'bg-slate-55/40 dark:bg-slate-950/20 hover:bg-slate-100/60 dark:hover:bg-slate-850 border-slate-150 dark:border-slate-850'
                  }`}
                >
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-300 dark:border-slate-850"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-extrabold block truncate text-slate-850 dark:text-slate-200">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5 capitalize">{p.category} Category</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 8 Columns - Visual Sweep Canvas & AI Metrics */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Visual Camera Canvas (6 Cols) */}
          <div className="md:col-span-6 bg-slate-950 rounded-3xl border border-slate-800/80 p-4 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
            
            {/* Visual scan laser line */}
            {isScanning && (
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-lg shadow-cyan-400/50 z-20"
              />
            )}

            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="text-[8px] font-mono font-bold bg-slate-900/90 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded uppercase">
                UAV Sweep / Fixed Cam
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center relative mt-4">
              <img 
                src={activePreset.imageUrl} 
                alt="Scanning target" 
                className={`w-full max-h-[220px] object-cover rounded-2xl border border-slate-900 transition ${isScanning ? 'opacity-80 blur-[1px]' : 'opacity-100'}`}
                referrerPolicy="no-referrer"
              />
              
              {isScanning && (
                <div className="absolute inset-0 bg-cyan-500/10 flex items-center justify-center backdrop-blur-[0.5px]">
                  <span className="text-xs font-mono font-black text-cyan-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/20 animate-pulse">
                    SEGMENTING CLOUD CHANNELS...
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>LIDAR Focal Scale: 12mm</span>
              <span className="text-cyan-400">FPS: 60 / CUDA Core ready</span>
            </div>
          </div>

          {/* AI Metrics Sheet (6 Cols) */}
          <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Neural Analytical Verdict</h4>
                {scanComplete && classificationResult && (
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    Match Confidence: {Math.round(classificationResult.confidence * 100)}%
                  </span>
                )}
              </div>

              {scanComplete && classificationResult ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-500/10">
                      {classificationResult.category} waste
                    </span>
                    <h5 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-2">{classificationResult.itemName}</h5>
                  </div>

                  {/* Materials detected */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wider">Identified Material Segments</span>
                    <div className="flex flex-wrap gap-1">
                      {classificationResult.materialsDetected?.map((seg: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400">
                          {seg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Disposal directives */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wider">Disposal Directives</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed bg-slate-55/40 dark:bg-slate-950/25 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      "{classificationResult.disposalInstructions}"
                    </p>
                  </div>

                  {/* CO2 offsets */}
                  {classificationResult.co2SavedKg > 0 && (
                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                      <Zap className="h-4 w-4 shrink-0" />
                      <span>Estimated offset: +{classificationResult.co2SavedKg} kg carbon savings if recycled correctly</span>
                    </div>
                  )}

                  {/* Nearest Disposal Site */}
                  <div className="pt-2 border-t border-slate-50 dark:border-slate-850/40 space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wider flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-slate-400" /> Optimal Routing Target
                    </span>
                    <span className="block font-bold text-slate-850 dark:text-slate-150 text-[11px] truncate">{classificationResult.binType || 'Local depot hub'}</span>
                    <span className="block font-mono text-[9px] text-slate-400">GPS Coords: {activePreset.siteCoords}</span>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 text-slate-300 animate-spin" />
                  <p>Processing neural segment maps. Running deep tensor calculations...</p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
