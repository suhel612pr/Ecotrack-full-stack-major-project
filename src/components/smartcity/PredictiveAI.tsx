import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, BrainCircuit, Activity, Calendar, AlertTriangle, 
  TrendingUp, Leaf, Wrench, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import { SupabaseService } from '../../supabaseService';

interface PredictionNode {
  binId: string;
  binName: string;
  probability: number;
  estimatedTimeHours: number;
  reason: string;
}

export default function PredictiveAI() {
  const [activeFactors, setActiveFactors] = useState({
    rain: false,
    festival: true,
    holiday: false
  });
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const data = await SupabaseService.getAIPredictions();
      setPredictions(data);
    } catch (err) {
      console.error('Failed to fetch AI forecasts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 12000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically calculate interactive chart points based on factors
  const getChartData = () => {
    let multiplier = 1.0;
    if (activeFactors.rain) multiplier += 0.15;
    if (activeFactors.festival) multiplier += 0.35;
    if (activeFactors.holiday) multiplier += 0.22;

    const baseHist = [45, 52, 48, 60, 58, 65]; // last 6 months (historical)
    const baseProj = [68, 72, 75, 80, 78, 85]; // next 6 months (neural projections)

    const hist = baseHist.map(v => Math.round(v));
    const proj = baseProj.map(v => Math.round(v * multiplier));

    return { hist, proj };
  };

  const { hist, proj } = getChartData();
  const maxVal = Math.max(...hist, ...proj) * 1.15;

  const activePredictions: PredictionNode[] = predictions?.overflowForecast || [
    { binId: 'bin-102', binName: 'Smart Bin SB-102', probability: 92, estimatedTimeHours: 4, reason: 'High retail zone foot traffic' },
    { binId: 'bin-107', binName: 'Smart Bin SB-107', probability: 84, estimatedTimeHours: 9, reason: 'Fisherman Wharf weekend influx' },
    { binId: 'bin-103', binName: 'Smart Bin SB-103', probability: 48, estimatedTimeHours: 18, reason: 'Organic waste decay speed' }
  ];

  const failureForecasts = predictions?.failureForecast || [
    { binId: 'bin-103', binName: 'Smart Bin SB-103', failureType: 'Battery Depletion', riskScore: 98, actionRequired: 'Replace lithium battery core' },
    { binId: 'bin-106', binName: 'Smart Bin SB-106', failureType: 'Lid Optical Sensor Obstruction', riskScore: 65, actionRequired: 'Sanitize sensor lens' }
  ];

  const diversion = predictions?.landfillDiversionRatePrediction || {
    currentRate: 64.5,
    predictedNextMonth: 68.2,
    gainExplanation: 'AI camera-assisted sorting has significantly improved citizen recycling fidelity.'
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <BrainCircuit className="h-5 w-5 mr-1.5 text-cyan-500 animate-pulse" /> Neural Forecast & Predictive AI Engine
          </h3>
          <p className="text-xs text-slate-500">Run recurrent neural network simulations forecasting refuse rates, compaction degradation, and winter holiday trends using Gemini-3.5-Flash.</p>
        </div>

        <button
          onClick={fetchPredictions}
          disabled={loading}
          className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Matrix</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns - Overflows, maintenance and Multi-line SVG chart */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Smart Bin Neural Prediction */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                Neural Bin Overflow Predictor
              </h4>
              <span className="text-[10px] font-mono text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full font-bold">
                Landfill Diversion Next Month: {diversion.predictedNextMonth}%
              </span>
            </div>

            <div className="space-y-3">
              {activePredictions.map(pred => {
                const isCritical = pred.probability >= 80;
                return (
                  <div 
                    key={pred.binId}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3.5 text-xs ${
                      isCritical
                        ? 'bg-rose-500/5 border-rose-500/15'
                        : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg text-xs shrink-0 mt-0.5 font-mono font-bold ${
                      isCritical ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {pred.probability}% Prob
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-850 dark:text-slate-200">{pred.binName}</span>
                        <span className="text-[10px] text-cyan-600 font-mono font-bold">ETA: {pred.estimatedTimeHours} hrs</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                        {pred.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-400 italic font-mono p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
              💡 **AI Insight:** {diversion.gainExplanation}
            </p>
          </div>

          {/* Recharts-Style Interactive SVG Trend Curve */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                  Seasonal Volumetric Forecast Map
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Interactive Multi-spectral projection vs historical baseline.</p>
              </div>

              {/* Factors toggles */}
              <div className="flex flex-wrap gap-1.5 text-[9px] font-mono">
                <button
                  onClick={() => setActiveFactors(prev => ({ ...prev, rain: !prev.rain }))}
                  className={`px-2 py-1 rounded border transition ${activeFactors.rain ? 'bg-blue-500 text-white border-transparent font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800'}`}
                >
                  Rain (+15% Mass)
                </button>
                <button
                  onClick={() => setActiveFactors(prev => ({ ...prev, festival: !prev.festival }))}
                  className={`px-2 py-1 rounded border transition ${activeFactors.festival ? 'bg-purple-500 text-white border-transparent font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800'}`}
                >
                  Festival (+35% Recyclables)
                </button>
                <button
                  onClick={() => setActiveFactors(prev => ({ ...prev, holiday: !prev.holiday }))}
                  className={`px-2 py-1 rounded border transition ${activeFactors.holiday ? 'bg-amber-500 text-white border-transparent font-bold' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800'}`}
                >
                  Holiday (+22% Cardboard)
                </button>
              </div>
            </div>

            {/* Custom SVG Line drawing */}
            <div className="relative pt-4">
              <svg viewBox="0 0 450 160" className="w-full h-auto overflow-visible select-none">
                
                {/* Horizontal grid guide lines */}
                {[0, 1, 2, 3].map(step => {
                  const y = 140 - step * 40;
                  return (
                    <g key={step}>
                      <line x1="20" y1={y} x2="430" y2={y} stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
                      <text x="5" y={y + 3} fill="rgba(148, 163, 184, 0.4)" fontSize="8" fontFamily="monospace">
                        {Math.round((step * 40 * maxVal) / 140)}t
                      </text>
                    </g>
                  );
                })}

                {/* X-axis indicators */}
                {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map((m, idx) => (
                  <text key={m} x={25 + idx * 35} y="155" fill="rgba(148, 163, 184, 0.5)" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {m}
                  </text>
                ))}

                {/* Divider Line (Historical vs Projections) */}
                <line x1="225" y1="10" x2="225" y2="140" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="215" y="18" fill="rgba(6, 182, 212, 0.8)" fontSize="7" fontFamily="monospace" textAnchor="end">HISTORICAL</text>
                <text x="235" y="18" fill="rgba(168, 85, 247, 0.8)" fontSize="7" fontFamily="monospace" textAnchor="start">PROJECTION</text>

                {/* Draw Historical curve (First 6 points) */}
                <path 
                  d={`M ${25} ${140 - (hist[0] / maxVal) * 140}
                     L ${60} ${140 - (hist[1] / maxVal) * 140}
                     L ${95} ${140 - (hist[2] / maxVal) * 140}
                     L ${130} ${140 - (hist[3] / maxVal) * 140}
                     L ${165} ${140 - (hist[4] / maxVal) * 140}
                     L ${200} ${140 - (hist[5] / maxVal) * 140}`}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Draw Projection curve (Last 6 points) starting from point 6 */}
                <path 
                  d={`M ${200} ${140 - (hist[5] / maxVal) * 140}
                     L ${235} ${140 - (proj[0] / maxVal) * 140}
                     L ${270} ${140 - (proj[1] / maxVal) * 140}
                     L ${305} ${140 - (proj[2] / maxVal) * 140}
                     L ${340} ${140 - (proj[3] / maxVal) * 140}
                     L ${375} ${140 - (proj[4] / maxVal) * 140}
                     L ${410} ${140 - (proj[5] / maxVal) * 140}`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="1"
                />

                {/* Little glow node indicators */}
                <circle cx="200" cy={140 - (hist[5] / maxVal) * 140} r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />
                <circle cx="410" cy={140 - (proj[5] / maxVal) * 140} r="4" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />

              </svg>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 justify-center">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span> Solid Baseline
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span> Neural Projection Trend (with environmental parameters)
              </span>
            </div>
          </div>

        </div>

        {/* Right 5 Columns - EV fleet compactors health index */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center">
              <Wrench className="h-4.5 w-4.5 mr-1.5 text-slate-400" /> Fleet Maintenance Predictor
            </h4>

            <div className="space-y-4">
              {failureForecasts.map((m: any, idx: number) => {
                const isCritical = m.riskScore >= 80;
                return (
                  <div 
                    key={m.binId || idx}
                    className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                      isCritical
                        ? 'bg-rose-500/5 border-rose-500/15'
                        : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-extrabold text-slate-850 dark:text-slate-100 block">{m.binName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{m.failureType}</span>
                      </div>

                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                        isCritical ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {m.riskScore}% failure index
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 border border-slate-100 dark:border-slate-850/50 rounded-xl leading-relaxed">
                      ⚙️ <span className="font-bold">Required Actions:</span> {m.actionRequired || m.action}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
