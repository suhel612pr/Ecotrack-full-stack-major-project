import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

interface FAQContactProps {
  initialView?: 'about' | 'faq' | 'privacy' | 'terms';
}

export default function FAQContact({ initialView = 'faq' }: FAQContactProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'faq' | 'privacy' | 'terms'>(initialView);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does the Gemini AI classification scanner operate?',
      a: 'The scanner uses computer vision algorithms powered server-side by Gemini 3.5 Flash. When you upload a picture or select an item preset, the model analyzes physical and textual structures of the item to determine if it is recyclable, compostable, hazard-restricted, or destined for standard landfill. It also estimates CO2 offsets based on average commodity weights.'
    },
    {
      q: 'How do citizens receive and redeem Green Credits?',
      a: 'Each time you scan and correctly dispose of items or report issues (like illegal dumping or full public bins), our platform verifies the action and adds credits to your citizen ledger. These points can be redeemed on the Rewards tab for transit tickets, organic cotton totes, seed kits, or solar-grid electricity credits.'
    },
    {
      q: 'What should I do if a public smart bin is full or damaged?',
      a: 'Open the Citizen Portal, click "Report Incident" or select the bin on the live smart map and click "Report Overflow". Fill in the specific location and details. Our supervisors will instantly receive the report on the dispatch panel and assign a crew leader using optimized shortest-path directions.'
    },
    {
      q: 'Are hazardous or electronic wastes accepted?',
      a: 'Yes, but NOT in standard street bins. E-waste (like batteries or circuit boards) must be scanned via the AI Scanner to verify hazard details and then brought directly to designated municipal electronics recycling depots. Disposing of hazardous items incorrectly is a violation of environmental city ordinances.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Category Toggles */}
      <div className="flex justify-center space-x-2">
        {['about', 'faq', 'privacy', 'terms'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase border capitalize transition ${
              activeTab === tab 
                ? 'bg-green-600 text-white border-green-600 shadow-md' 
                : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-850 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Information Panel */}
        <div className="lg:col-span-7">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold font-mono tracking-widest text-green-600 uppercase">CIVIC ALLIANCES & TECHNOLOGY</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">About EcoTrack AI</h2>
                <p className="text-xs text-slate-400">Pioneering municipal software ecosystems for the cleaner, smarter cities of tomorrow.</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                EcoTrack AI is a flagship environmental technology platform created in partnership with city councils, green logistics teams, and artificial intelligence laboratories. Our mission is to automate civic waste systems, eliminate landfill contamination, and reward citizens for daily ecological efforts.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200">Zero-Waste Directives</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Automating recycling categories detection and container fill states prevents toxic runoff and landfill overflows.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200">Carbon Mitigation</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Route optimization cuts sanitation diesel emissions, contributing directly to city climate neutrality pledges.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold font-mono tracking-widest text-green-600 uppercase">FREQUENTLY ASKED QUESTIONS</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">FAQ Control Desk</h2>
                <p className="text-xs text-slate-400">Everything you need to know about the smart city zero-waste program.</p>
              </div>

              <div className="space-y-4 pt-4">
                {faqs.map((f, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-2">
                    <h4 className="font-bold text-sm text-slate-950 dark:text-slate-100 flex items-start space-x-2">
                      <HelpCircle className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
                      <span>{f.q}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-6">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold font-mono tracking-widest text-green-600 uppercase">PRIVACY & SECURITIES</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Privacy Policy Brief</h2>
                <p className="text-xs text-slate-400">We prioritize citizen data sovereignty and telemetry confidentiality.</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our civic platform is strictly secure and complies with international municipal privacy standards. Citizen reports are kept private by default unless flagged for emergency municipal cleanup. Geolocation coordinates of trash scans are utilized exclusively for proximity bin search calculations and never shared with commercial third parties. No biometric data is captured when camera sensors are active.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold font-mono tracking-widest text-green-600 uppercase">CIVIC LICENSE TERMS</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Terms of Service</h2>
                <p className="text-xs text-slate-400">Standard operating guidelines for deponent environmental rewards.</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                By participating in the EcoTrack Smart Zero-Waste Program, you agree to:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <li>Submit accurate, unmodified photographic scans of materials.</li>
                <li>Dispose of materials into the correctly designated bins.</li>
                <li>Report actual, verifiable public incidents (false reports are subject to municipal citations).</li>
                <li>Redeem rewards ledger points solely through authorized city channels.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Contact Desk Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-50 dark:bg-green-950/40 text-green-600 rounded-xl">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Municipal Citizen Desk</h3>
              <p className="text-[11px] text-slate-500">Contact municipal environmental support and smart bin services.</p>
            </div>
          </div>

          {submitted && (
            <div className="p-4 bg-green-50 dark:bg-green-950/40 border border-green-500/30 text-green-700 dark:text-green-400 rounded-2xl text-[10px] font-bold font-mono flex items-center space-x-1.5">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>INQUIRY ROUTED TO MUNICIPAL DUTY CLERK.</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Your Full Name</label>
              <input 
                type="text" 
                placeholder="Citizen Name"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="citizen@ecotrack.gov"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">Message Body</label>
              <textarea 
                rows={3}
                placeholder="State your inquiry, hardware suggestions, or smart-city suggestions..."
                value={contactMsg}
                onChange={e => setContactMsg(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow"
            >
              <Send className="h-4 w-4" />
              <span>DISPATCH INQUIRY</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-center">
            <Heart className="h-3 w-3 text-rose-500 mr-1" />
            <span>EcoCity Municipal Hall</span>
          </div>
        </div>

      </div>

    </div>
  );
}
