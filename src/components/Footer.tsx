import React from 'react';
import { Leaf, Phone, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-extrabold text-white font-sans tracking-tight">
              EcoTrack <span className="text-green-400">AI</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            A production-grade Smart Waste Management System. Building cleaner, zero-waste cities using artificial intelligence, real-time IoT sensors, and civic gamification networks.
          </p>
          <div className="pt-2 flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
            <MapPin className="h-3 w-3 text-rose-500" />
            <span>EcoCity Municipal Hall, Grid-V</span>
          </div>
        </div>

        {/* Municipal Links */}
        <div>
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest mb-4">MUNICIPAL PORTALS</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-green-400 transition">
                Civic Homepage
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-green-400 transition">
                Smart Bins Occupancy Grid
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-green-400 transition">
                City Services Guidelines
              </button>
            </li>
            <li>
              <a href="https://epa.gov" target="_blank" rel="noreferrer" className="hover:text-green-400 transition flex items-center">
                <span>Environmental Protection Agency</span>
                <ExternalLink className="h-3 w-3 ml-1 text-slate-600" />
              </a>
            </li>
          </ul>
        </div>

        {/* Emergency Services Hotlines */}
        <div>
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest mb-4">EMERGENCY TELEPHONY</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start space-x-2">
              <Phone className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-200 font-bold leading-none">Hazardous Cleanup</span>
                <span className="text-[10px] font-mono text-slate-500">1-800-555-0199 (24/7 Duty)</span>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <Phone className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-200 font-bold leading-none">Sanitation Dispatch</span>
                <span className="text-[10px] font-mono text-slate-500">1-800-555-0240 (Office Hours)</span>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-200 font-bold leading-none">IoT System Support</span>
                <span className="text-[10px] font-mono text-slate-500">support@ecotrackai.gov</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest">CIVIC DISPATCHES</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Subscribe to receive local recycling drive notices, hazardous drop-off schedules, and city clean-up events.
          </p>
          <form className="flex" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="government@citizen.org" 
              className="px-3 py-2 bg-slate-800 border-none rounded-l-xl text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
            <button 
              type="submit" 
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-xl text-xs font-bold transition"
            >
              Sign Up
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
        <div>
          © 2026 EcoTrack AI Inc. Municipal Civic Technology License.
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <button onClick={() => onNavigate('privacy')} className="hover:text-green-400 transition">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => onNavigate('terms')} className="hover:text-green-400 transition">Terms of Service</button>
          <span>•</span>
          <span className="text-slate-600">Secure AES-256</span>
        </div>
      </div>
    </footer>
  );
}
