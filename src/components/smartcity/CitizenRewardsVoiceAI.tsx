import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Star, Zap, Volume2, Mic, CheckCircle2, ShoppingBag, 
  RefreshCw, TrendingUp, Compass, Flame, HelpCircle
} from 'lucide-react';
import { getSupabase } from '../../supabaseClient';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  xpValue: number;
}

interface LanguageOption {
  code: string;
  label: string;
  speakText: string;
  response: string;
}

export default function CitizenRewardsVoiceAI() {
  const [ecoCoins, setEcoCoins] = useState(380);
  const [xp, setXp] = useState(2450);
  const [userLevel, setUserLevel] = useState(8);

  const [activeSpeechLanguage, setActiveSpeechLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState<string | null>(null);

  const languages: { [key: string]: LanguageOption } = {
    en: {
      code: 'en',
      label: 'English (US)',
      speakText: 'Where is the nearest organic smart bin?',
      response: 'The nearest organic smart bin is SB-104 located at 820 Mission St, Central Park. It is currently at 92% capacity.'
    },
    hi: {
      code: 'hi',
      label: 'Hindi (भारत)',
      speakText: 'नज़दीकी रिसाइकिलिंग केंद्र कहाँ है?',
      response: 'निकटतम रीसाइक्लिंग केंद्र वार्ड 3 में फ़ाइनेंशियल हब के पास है, जो केवल 500 मीटर की दूरी पर स्थित है।'
    },
    mr: {
      code: 'mr',
      label: 'Marathi (महाराष्ट्र)',
      speakText: 'माझ्या कचऱ्याची तक्रार कशी नोंदवू?',
      response: 'आपण मुख्य स्क्रीनवरील "Quick Complaint" बटण वापरून त्वरित आपल्या प्रभागातील कचऱ्याची तक्रार दाखल करू शकता.'
    },
    es: {
      code: 'es',
      label: 'Spanish (ES)',
      speakText: '¿Cómo canjeo mis monedas ecológicas?',
      response: 'Puede canjear sus Eco Coins en la sección Tienda de Recompensas por pases de autobús o reducciones de impuestos.'
    },
    fr: {
      code: 'fr',
      label: 'French (FR)',
      speakText: 'Quel est mon score de propreté aujourd’hui?',
      response: 'Le score global de propreté de la ville de San Francisco est évalué à 88,4% aujourd’hui. Excellent travail!'
    },
    de: {
      code: 'de',
      label: 'German (DE)',
      speakText: 'Gibt es eine Abholverzögerung?',
      response: 'Die Abholung von Müllbehälter SB-102 verzögert sich verkehrsbedingt um ca. 12 Minuten. Bitte haben Sie Geduld.'
    },
    ar: {
      code: 'ar',
      label: 'Arabic (العربية)',
      speakText: 'أين يمكنني التخلص من النفايات الطبية؟',
      response: 'يجب التخلص من النفايات الطبية في منشأة المستشفى العام المعتمدة في الوردية الحادية عشر.'
    }
  };

  const achievements: Achievement[] = [
    { id: 'ach-1', title: 'Recycling Sentinel', description: 'Scanned 15 recyclable packages with the Neural AI camera.', unlocked: true, xpValue: 500 },
    { id: 'ach-2', title: 'Clean Streak', description: 'Maintained perfect garbage compliance for 3 consecutive weeks.', unlocked: true, xpValue: 750 },
    { id: 'ach-3', title: 'Community Pillar', description: 'Successfully resolved 5 local street dumping citizen complaints.', unlocked: false, xpValue: 1000 }
  ];

  const storeItems = [
    { id: 'item-1', name: 'Muni Metro 1-Day Transit Pass', cost: 150, category: 'Transit' },
    { id: 'item-2', name: 'Golden Gate Park Conservatory Entry', cost: 250, category: 'Park Voucher' },
    { id: 'item-3', name: '$10 Municipal Water Bill Rebate', cost: 350, category: 'Utility Bill' }
  ];

  const triggerVoiceAI = async () => {
    setIsSpeaking(true);
    setVoiceOutput(null);

    try {
      let reply = "";
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.functions.invoke('chatbot', {
            body: {
              message: languages[activeSpeechLanguage].speakText,
              role: 'citizen'
            }
          });
          if (!error && data?.reply) {
            reply = data.reply;
          }
        } catch (e) {
          console.warn('Supabase chatbot failed for voice AI:', e);
        }
      }

      if (reply) {
        setVoiceOutput(reply);
      } else {
        setVoiceOutput(languages[activeSpeechLanguage].response);
      }
    } catch (err) {
      console.error('Error querying chatbot for voice AI:', err);
      setVoiceOutput(languages[activeSpeechLanguage].response);
    } finally {
      setIsSpeaking(false);
    }
  };

  const buyEcoReward = (cost: number, name: string) => {
    if (ecoCoins < cost) {
      alert('EcoTrack AI: Insufficient Eco Coins credits.');
      return;
    }
    setEcoCoins(c => c - cost);
    alert(`EcoTrack AI: Reward Claimed! ${name} voucher sent to your registered email profile.`);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Award className="h-5.5 w-5.5 mr-2 text-yellow-500" /> Rewards, Achievements & Voice AI Control
          </h3>
          <p className="text-xs text-slate-500">Track citizen gamification levels, claim Eco Coin rebates, and simulate multi-lingual speech models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns - Gamification & Rewards store */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Level stats */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">
                Green Citizen Profile
              </span>
              <h4 className="text-xl font-black">Level {userLevel} Environmental Advocate</h4>
              <p className="text-xs text-slate-300 leading-relaxed">XP Progress: {xp} / 3000. Keep scanning recyclables to unlock tier levels.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0 font-mono text-xs">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-slate-400 block text-[9px]">ECO COINS:</span>
                <span className="text-xl font-black text-emerald-400">{ecoCoins} COINS</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-slate-400 block text-[9px]">ACTIVE STREAK:</span>
                <span className="text-xl font-black text-amber-400">12 Days 🔥</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              Unlocked Civic Achievements
            </h4>

            <div className="space-y-3">
              {achievements.map(ach => (
                <div 
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 text-xs ${
                    ach.unlocked 
                      ? 'bg-emerald-500/5 border-emerald-500/10' 
                      : 'bg-slate-50 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-base shrink-0 mt-0.5">{ach.unlocked ? '🏆' : '🔒'}</span>
                    <div>
                      <span className="font-extrabold text-slate-850 dark:text-slate-200 block">{ach.title}</span>
                      <span className="text-[10px] text-slate-450 block mt-0.5">{ach.description}</span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">
                    +{ach.xpValue} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Eco Coins redeem store */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
              Redeem Eco Coins Store
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {storeItems.map(item => (
                <div 
                  key={item.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col justify-between text-xs space-y-3"
                >
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider">{item.category}</span>
                    <span className="font-extrabold text-slate-850 dark:text-slate-200 block mt-1 leading-tight">{item.name}</span>
                  </div>

                  <button
                    onClick={() => buyEcoReward(item.cost, item.name)}
                    className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl transition text-[11px] flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="h-3 w-3" /> {item.cost} Coins
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 Columns - Multilingual Voice AI assistant simulator */}
        <div className="lg:col-span-5">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center">
                  <Volume2 className="h-4.5 w-4.5 mr-1.5 text-cyan-500 animate-pulse" /> Multilingual Voice AI Simulator
                </h4>
              </div>

              <div className="space-y-3">
                
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Select Input Language Profile</label>
                  <select
                    value={activeSpeechLanguage}
                    onChange={(e) => {
                      setActiveSpeechLanguage(e.target.value);
                      setVoiceOutput(null);
                    }}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl"
                  >
                    {Object.values(languages).map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>

                {/* Simulated speech trigger query display */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl relative text-xs text-left">
                  <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-widest block mb-2">Simulated microphone query</span>
                  <p className="text-white font-bold italic font-mono text-[11px] leading-relaxed">
                    " {languages[activeSpeechLanguage].speakText} "
                  </p>

                  {/* Equalizer animation */}
                  {isSpeaking && (
                    <div className="flex items-center gap-0.5 h-6 absolute right-4 bottom-4">
                      {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: ['4px', '20px', '4px'] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-0.5 bg-cyan-400 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-850/40">
              <button
                onClick={triggerVoiceAI}
                disabled={isSpeaking}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-500/10"
              >
                <Mic className="h-4 w-4" />
                <span>{isSpeaking ? 'Simulating Audio Sweep...' : 'Trigger Voice Command Simulation'}</span>
              </button>

              <AnimatePresence>
                {voiceOutput && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 rounded-2xl text-xs space-y-1"
                  >
                    <span className="text-[9px] font-mono text-cyan-500 font-bold block uppercase tracking-wider">Voice AI Audio Response</span>
                    <p className="text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                      {voiceOutput}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
