import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Globe, Zap, Award, CheckCircle, Users, BarChart3, ChevronRight } from 'lucide-react';
import CitySkyline from '../components/CitySkyline';

interface LandingPageProps {
  onLaunchPortal: () => void;
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onLaunchPortal, onNavigate }: LandingPageProps) {
  const [activeTabStep, setActiveTabStep] = useState(0);

  const steps = [
    {
      title: 'Scan Waste',
      desc: 'Take a picture of any item. Our computer vision neural network instant-classifies materials, identifies the correct disposal bin, and estimates carbon savings.',
      icon: '📸',
    },
    {
      title: 'Sort Correctly',
      desc: 'Place the material in the color-coded smart bin. The bin sensors instantly log the weight and update city analytics.',
      icon: '♻️',
    },
    {
      title: 'Earn Green Credits',
      desc: 'Claim green points directly on your citizen ledger. Points can be redeemed for public transit passes, community garden seeds, or utility bill discounts.',
      icon: '🎁',
    },
    {
      title: 'Optimize Logistics',
      desc: 'Supervisors receive overflowing reports and dispatch sanitation crews using AI-optimized shortest-path routing, cutting carbon emissions by 40%.',
      icon: '🚚',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold font-mono px-3.5 py-1.5 rounded-full border border-zinc-200/30 dark:border-zinc-800/50">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>CIVIC PLATFORM REVOLUTION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans leading-[1.05]">
              Building cleaner <br />
              <span className="text-emerald-600 dark:text-emerald-400">cities</span> with smart technology.
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
              EcoTrack AI is an enterprise-grade smart waste platform designed for municipalities. We leverage server-side computer vision, real-time IoT bin sensors, and game-theoretic rewards to build zero-waste smart cities.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              <button
                onClick={onLaunchPortal}
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-medium rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm"
              >
                <span>Launch Municipal Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-zinc-200/50 dark:border-zinc-800/80 transition"
              >
                <span>Explore City Services</span>
              </button>
            </div>

            {/* Micro stats banner */}
            <div className="pt-6 border-t border-zinc-150 dark:border-zinc-800/60 flex items-center space-x-8 text-zinc-400 text-[10px] font-mono">
              <div>
                <span className="block text-zinc-900 dark:text-zinc-100 text-lg font-bold font-sans">142,500</span>
                <span>MUNICIPAL CITIZENS</span>
              </div>
              <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
              <div>
                <span className="block text-zinc-900 dark:text-zinc-100 text-lg font-bold font-sans">42,800 kg</span>
                <span>CO₂ EMISSIONS REDUCED</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            {/* Interactive Telemetry Skyline */}
            <CitySkyline />
          </div>

        </div>
      </section>

      {/* 2. Interactive Municipal statistics Cards (Apple Style) */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-16 border-y border-slate-200/50 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] font-bold font-mono tracking-widest text-green-600 uppercase">MUNICIPAL PROGRESS TELEMETRY</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">EcoTrack Impact Index</h2>
            <p className="text-xs text-slate-400">Verifiable city-wide carbon mitigation and material utilization stats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md">
              <div className="h-10 w-10 bg-green-50 dark:bg-green-950/40 rounded-xl flex items-center justify-center text-green-600 mb-4">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="text-slate-400 text-xs font-mono uppercase tracking-wider">Recycling Rate Optimization</h3>
              <span className="block text-4xl font-extrabold text-slate-950 dark:text-white mt-1">72.4%</span>
              <span className="block text-green-600 text-xs font-mono font-bold mt-1">↑ 18.2% from previous fiscal year</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Enhanced by automatic computer vision scan accuracy mapping and reward distribution.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md">
              <div className="h-10 w-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-slate-400 text-xs font-mono uppercase tracking-wider">Collection Diesel Fuel Offset</h3>
              <span className="block text-4xl font-extrabold text-slate-950 dark:text-white mt-1">15,400 Gal</span>
              <span className="block text-green-600 text-xs font-mono font-bold mt-1">↓ 34% sanitation fleet fuel consumption</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Delivered by dynamic shortest-path optimization based on telemetry bin fill thresholds.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md">
              <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-slate-400 text-xs font-mono uppercase tracking-wider">Civic Rewards Issued</h3>
              <span className="block text-4xl font-extrabold text-slate-950 dark:text-white mt-1">1.82M Credits</span>
              <span className="block text-green-600 text-xs font-mono font-bold mt-1">↑ 92% active community deponents</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Redeemed for transit tickets, environmental initiatives, and public garden materials.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Features section (Notion/Linear Bento Grid style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-bold font-mono tracking-widest text-green-600 uppercase">CIVIC FEATURES SUITE</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">The Modern Smart City Framework</h2>
          <p className="text-xs text-slate-400">Everything a municipality needs to transition into a clean smart city.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-8 bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between min-h-[300px]">
            <div className="z-10 space-y-2 max-w-md">
              <span className="text-[9px] font-bold font-mono tracking-widest text-green-400 bg-green-950/40 border border-green-800/30 px-2.5 py-0.5 rounded-full uppercase">INTELLIGENT AI ENGINE</span>
              <h3 className="text-2xl font-bold tracking-tight">Server-Side Material Scanning</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Empowered by the Gemini 3.5 Flash model, citizens instantly identify material properties, chemical layers, and the direct bin placement. It completely replaces guess-work in recycling.
              </p>
            </div>
            <div className="mt-6 flex space-x-4 items-center">
              <button 
                onClick={onLaunchPortal}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
              >
                <span>Try AI Scanner</span>
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
              <span className="text-[10px] text-slate-500 font-mono">POWERED BY @GOOGLE/GENAI SDK</span>
            </div>
            {/* Visual background shadow */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-green-600/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="md:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-md border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Live IoT Mapping</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Supervisors track bin occupancy, temperatures, and low batteries instantly via live SVG grid telemetry mappings.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">100% SECURE IoT HEARTBEAT</span>
            </div>
          </div>

          <div className="md:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-md border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Gamified Civic Rewards</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Gain carbon offset points and exchange them for certified green transit passes, municipal events, and shopping certificates.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">LOCAL BUSINESS REBATES</span>
            </div>
          </div>

          <div className="md:col-span-8 bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between min-h-[300px]">
            <div className="z-10 space-y-2 max-w-md">
              <span className="text-[9px] font-bold font-mono tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase">LOGISTICS SYSTEMS</span>
              <h3 className="text-2xl font-bold tracking-tight">Driver Routing Optimization</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sanitation workers are dispatched only to smart bins crossing occupancy thresholds, with automatically optimized directions overlay mapping. No wasted trips.
              </p>
            </div>
            <div className="mt-6">
              <span className="text-[10px] text-slate-500 font-mono">SHORTEST-PATH HAMILTONIAN GRAPH ENGINE</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Interactive How It Works Stepper */}
      <section className="bg-slate-50 dark:bg-slate-950/40 py-16 border-y border-slate-200/50 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold font-mono tracking-widest text-green-600 uppercase">STEP-BY-STEP OPERATION</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">How EcoTrack Works</h2>
            <p className="text-xs text-slate-400">An integrated loop syncing citizens, hardware, and city teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveTabStep(idx)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                  activeTabStep === idx 
                    ? 'bg-white dark:bg-slate-900 border-green-600 shadow-xl scale-102' 
                    : 'bg-slate-100 dark:bg-slate-900/10 border-slate-200/55 dark:border-slate-800/80'
                }`}
              >
                <div className="text-4xl mb-4">{st.icon}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-green-600">0{idx + 1}</span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{st.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Verified Alliances / Government Logos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <span className="text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase">VALIDATED BY CIVIC INSTITUTIONS</span>
        </div>
        <div className="flex flex-wrap items-center justify-around gap-8 opacity-45 dark:opacity-30 grayscale hover:grayscale-0 transition duration-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold tracking-tight text-slate-800 dark:text-slate-200">US EPA REGISTERED</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6" />
            <span className="font-bold tracking-tight text-slate-800 dark:text-slate-200">SMART CITY GLOBAL</span>
          </div>
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="font-bold tracking-tight text-slate-800 dark:text-slate-200">CLEAN EARTH COOPERATIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6" />
            <span className="font-bold tracking-tight text-slate-800 dark:text-slate-200">CIVIC TRUST ALLIANCE</span>
          </div>
        </div>
      </section>

      {/* 6. High-impact CTA banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-10 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Modernize Your Sanitation Grids?</h2>
          <p className="text-sm text-green-50/90 max-w-xl mx-auto leading-relaxed">
            Connect with municipal software architects to run a live smart bin pilot in your city. Empower citizens and reduce operation costs by 40%.
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={onLaunchPortal}
              className="px-8 py-3 bg-white text-green-700 hover:bg-green-50 font-extrabold rounded-xl text-xs transition shadow-lg flex items-center space-x-2"
            >
              <span>ACCESS MUNICIPAL DEMO</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
