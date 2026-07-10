import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, Scale, DollarSign, Award, ChevronRight, FileText, 
  UserCheck, ShieldAlert, ShoppingBag, ShoppingCart, TrendingUp, RefreshCw, CheckCircle2
} from 'lucide-react';
import { SupabaseService } from '../../supabaseService';

interface Contractor {
  id: string;
  companyName: string;
  sector: string;
  complianceRate: number; // percentage
  employeeCount: number;
  fleetSize: number;
  activePayout: number;
  status: 'optimal' | 're-audit';
}

interface MarketListing {
  id: string;
  material: string;
  volumeTons: number;
  bidPricePerTon: number;
  buyerCompany: string;
  status: 'open' | 'pending-loading' | 'completed';
}

export default function CarbonMarketplaceContractor() {
  const [activeTab, setActiveTab] = useState<'carbon' | 'contractors' | 'marketplace'>('carbon');
  
  // Dynamic state
  const [esgData, setEsgData] = useState<any>(null);
  const [productivityData, setProductivityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [offsetCredits, setOffsetCredits] = useState(412.5);
  const [payoutLogs, setPayoutLogs] = useState<string[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const [contractors, setContractors] = useState<Contractor[]>([
    { id: 'con-1', companyName: 'RecycleCorp Global Services', sector: 'Sector C (Golden Gate Lane)', complianceRate: 98.4, employeeCount: 120, fleetSize: 18, activePayout: 24500, status: 'optimal' },
    { id: 'con-2', companyName: 'GreenSpire Waste Logistics', sector: 'Sector B (Fisherman Wharf)', complianceRate: 92.1, employeeCount: 85, fleetSize: 11, activePayout: 18200, status: 'optimal' },
    { id: 'con-3', companyName: 'Apex Refuse & Demolition', sector: 'Sector D (Mission East)', complianceRate: 74.8, employeeCount: 52, fleetSize: 6, activePayout: 8900, status: 're-audit' }
  ]);

  const [marketListings, setMarketListings] = useState<MarketListing[]>([
    { id: 'bid-1', material: 'High-Density PET Plastic (Flakes)', volumeTons: 40, bidPricePerTon: 280, buyerCompany: 'Dow Polymers Industries', status: 'open' },
    { id: 'bid-2', material: 'Smelted Alloy Aluminum ingots', volumeTons: 15, bidPricePerTon: 640, buyerCompany: 'Kaiser Recycled Metals', status: 'open' },
    { id: 'bid-3', material: 'Processed E-Waste Copper Alloys', volumeTons: 8, bidPricePerTon: 1250, buyerCompany: 'Apex Tech Remanufacturing', status: 'open' },
    { id: 'bid-4', material: 'Clean Corrugated Cardboard', volumeTons: 110, bidPricePerTon: 95, buyerCompany: 'WestRock Packaging Group', status: 'completed' }
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const esg = await SupabaseService.getESGData();
      setEsgData(esg);
      if (esg.kpis?.carbonSavedKg) {
        setOffsetCredits(esg.kpis.carbonSavedKg / 1000);
      }

      const prod = await SupabaseService.getWorkerProductivity();
      setProductivityData(prod);
      
      // Feed into contractors matrix state dynamically
      if (prod.workersList) {
        const mappedContractors = prod.workersList.map((worker: any, idx: number) => ({
          id: worker.workerId || `con-${idx}`,
          companyName: `${worker.name} Fleet Services`,
          sector: `Sector ${String.fromCharCode(65 + idx)} (${worker.activeVehicles})`,
          complianceRate: worker.fuelScore || 95,
          employeeCount: 24 + idx * 8,
          fleetSize: 1 + idx * 2,
          activePayout: 14000 + idx * 3200,
          status: worker.idleAlerts > 0 ? 're-audit' : 'optimal'
        }));
        setContractors(mappedContractors);
      }
    } catch (err) {
      console.error('Error fetching Carbon/Contractor stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerPayoutApprove = (id: string) => {
    setContractors(prev => prev.map(con => con.id === id ? { ...con, activePayout: 0 } : con));
    setPayoutLogs([`Payout processed successfully for ${contractors.find(c => c.id === id)?.companyName}`, ...payoutLogs]);
  };

  const fulfillMarketBid = (id: string) => {
    setMarketListings(prev => prev.map(list => {
      if (list.id === id) {
        // Boost carbon points dynamically as reward for trading recycling
        setOffsetCredits(c => c + list.volumeTons * 0.5);
        return { ...list, status: 'completed' };
      }
      return list;
    }));
  };

  const startPDFGeneration = () => {
    setIsGeneratingPDF(true);
    setDownloadLink(null);
    setTimeout(() => {
      setIsGeneratingPDF(false);
      setDownloadLink(`EcoTrack_Carbon_Audit_${new Date().getFullYear()}_Q3.pdf`);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Tab bar + Refetch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* 3-Subtabs Navigation */}
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-2.5 rounded-2xl flex items-center space-x-1 overflow-x-auto max-w-xl">
          {[
            { id: 'carbon', label: 'Carbon Ledger & Offsets', icon: <Leaf className="h-4 w-4" /> },
            { id: 'contractors', label: 'Contractors Matrix', icon: <Scale className="h-4 w-4" /> },
            { id: 'marketplace', label: 'B2B Recycling Marketplace', icon: <ShoppingBag className="h-4 w-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Ledgers</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >

          {/* CARBON LEDGER TAB */}
          {activeTab === 'carbon' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2.5">
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                      Sustainability Ledger & Carbon Credit Auditing
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-500/10 px-2 rounded-full">
                      ESG Rating: {esgData?.kpis?.esgRating || 'AA+'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Certified carbon offset accruals logged daily via routing efficiency coefficients and recycled polymer indices.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs space-y-1">
                    <span className="text-slate-400 block font-mono">CERTIFIED OFFSETS:</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{offsetCredits.toFixed(1)} Mt</span>
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">● Handshake verified with CCX</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs space-y-1">
                    <span className="text-slate-400 block font-mono">EV FLEET EMISSIONS DIVERTED:</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{(esgData?.kpis?.carbonSavedKg || 18450).toLocaleString()} kg</span>
                    <p className="text-[10px] text-cyan-500 font-bold mt-1">● Offset computed MoM</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs space-y-1">
                    <span className="text-slate-400 block font-mono">RECYCLABLE COMMUNITY SCORE:</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{esgData?.kpis?.communityGreenScore || 88}%</span>
                    <p className="text-[10px] text-purple-500 font-bold mt-1">● Measured via AI scanners</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-55/40 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-3">
                  <span className="font-extrabold text-slate-850 dark:text-slate-200 block">Carbon Equivalence Calculation Methods</span>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed italic">
                    "Each single ton of recycled aluminum offsets approximately 9 tons of carbon dioxide from standard bauxite extraction. Polyethylene offsets account for 1.5 tons carbon diversion per recycled unit, calculated real-time."
                  </p>
                </div>
              </div>

              {/* PDF Report Card */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
                    Executive Audit Exporter
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Generate the official, municipal Q3 Carbon Sustainability ledger summary. Certified under standard GHG protocols.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-850/40">
                  <button
                    onClick={startPDFGeneration}
                    disabled={isGeneratingPDF}
                    className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    {isGeneratingPDF ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span>{isGeneratingPDF ? 'Compiling PDF Records...' : 'Generate Q3 Audit PDF'}</span>
                  </button>

                  <AnimatePresence>
                    {downloadLink && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-[10px] font-mono text-emerald-500 font-bold">✓ PDF compile complete!</span>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert('EcoTrack AI v2.0: Certified Q3 PDF saved to virtual storage.'); }}
                          className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          📥 Download: {downloadLink}
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          )}

          {/* CONTRACTORS MATRIX TAB */}
          {activeTab === 'contractors' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2.5">
                Approved Private Sanitation Contractors
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500">
                  <thead className="text-[10px] uppercase font-mono bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-850/80 text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Contractor Partner</th>
                      <th className="py-3 px-4">Sector Ward Area</th>
                      <th className="py-3 px-4">Compliance Rating</th>
                      <th className="py-3 px-4">Active Fleet / Labor</th>
                      <th className="py-3 px-4">Pending Payout</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractors.map(con => (
                      <tr key={con.id} className="border-b border-slate-100 dark:border-slate-850/40 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition">
                        <td className="py-3.5 px-4 font-extrabold text-slate-950 dark:text-slate-150">{con.companyName}</td>
                        <td className="py-3.5 px-4 font-mono">{con.sector}</td>
                        <td className="py-3.5 px-4">
                          <span className={`font-mono font-bold ${con.complianceRate >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {con.complianceRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{con.fleetSize} trucks / {con.employeeCount} personnel</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">${con.activePayout.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          {con.activePayout > 0 ? (
                            <button
                              onClick={() => triggerPayoutApprove(con.id)}
                              className="px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-[10px] text-white font-bold rounded-lg hover:bg-slate-800 transition"
                            >
                              Approve Pay
                            </button>
                          ) : (
                            <span className="text-emerald-500 font-bold flex items-center gap-0.5 text-[10px]">
                              ✓ Cleared
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {payoutLogs.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2 text-[10px] font-mono text-slate-400">
                  <span className="uppercase block">TRANSACTION AUDIT LOGS</span>
                  {payoutLogs.slice(0, 2).map((log, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-emerald-500">
                      <span>●</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MARKETPLACE TAB */}
          {activeTab === 'marketplace' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                    Bulk Materials Trade Desk
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Corporate buy offers for sorted municipal recyclables.</p>
                </div>
                <span className="text-[9px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-300/10">
                  B2B Order Desk Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketListings.map(list => (
                  <div 
                    key={list.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 transition ${
                      list.status === 'completed'
                        ? 'bg-slate-50 dark:bg-slate-950/10 border-slate-100 dark:border-slate-850 opacity-60'
                        : 'bg-slate-55/40 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-cyan-500 font-bold uppercase block tracking-wider">{list.buyerCompany}</span>
                        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1">{list.material}</h5>
                      </div>

                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        list.status === 'open' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-slate-400/10 text-slate-400'
                      }`}>
                        {list.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850/60 pt-3 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-400 block text-[9px]">VOLUME BID:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{list.volumeTons} tons</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">OFFER VALUE:</span>
                        <span className="font-bold text-slate-750 dark:text-slate-300">${(list.volumeTons * list.bidPricePerTon).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-850/40">
                      <span className="text-[9px] font-mono text-slate-400">Bid/Ton: ${list.bidPricePerTon}</span>
                      
                      {list.status === 'open' ? (
                        <button
                          onClick={() => fulfillMarketBid(list.id)}
                          className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 font-bold text-[10px] flex items-center gap-1"
                        >
                          <ShoppingCart className="h-3 w-3" /> Fulfill Contract
                        </button>
                      ) : (
                        <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-0.5">
                          ✓ Dispatched & Invoiced
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
