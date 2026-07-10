import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, RefreshCw, HelpCircle, Shield, Award, MapPin, User } from 'lucide-react';
import { UserProfile } from '../types';
import { getSupabase } from '../supabaseClient';

interface EcoBotProps {
  user: UserProfile;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

export default function EcoBot({ user }: EcoBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Greetings! I am **EcoBot**, your intelligent Smart Waste & Eco-Assistant.\n\nI am configured for your active role as a **${user.role.toUpperCase()}**. Select one of the quick-action briefs below or type any question to begin!`,
      sender: 'bot',
      timestamp: new Date().toTimeString().substring(0, 5)
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update welcome message if role changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${user.role}`,
        text: `Greetings! I am **EcoBot**, your intelligent Smart Waste & Eco-Assistant.\n\nI am configured for your active role as a **${user.role.toUpperCase()}**. Select one of the quick-action briefs below or type any question to begin!`,
        sender: 'bot',
        timestamp: new Date().toTimeString().substring(0, 5)
      }
    ]);
  }, [user.role]);

  // Define Chips based on user role
  const getRoleChips = () => {
    switch (user.role) {
      case 'citizen':
        return [
          { label: '♻️ Segregation Guide', query: 'Show me the Waste Segregation Guide' },
          { label: '📍 Recycling Hubs', query: 'What are the nearby recycling suggestions?' },
          { label: '📝 Report Incident Help', query: 'How do I submit an incident report / complaint?' },
          { label: '🏛️ Government Initiatives', query: 'Tell me about government schemes or initiatives' }
        ];
      case 'worker':
        return [
          { label: '🚛 Route Optimization', query: 'Suggest optimal worker route paths' },
          { label: '🛡️ Safety Protocol', query: 'Give me worker safety tips' },
          { label: '⚠️ Hazard Alerts', query: 'Are there any hazard or road closure detections?' },
          { label: '🗒️ Daily Briefing', query: 'Give me the daily worker briefing' }
        ];
      case 'supervisor':
        return [
          { label: '📊 Team Performance', query: 'Provide worker performance summary' },
          { label: '🚨 Delayed Route Alert', query: 'Show delayed route detection' },
          { label: '📈 Collection Forecast', query: 'Calculate the collection forecast' }
        ];
      case 'admin':
      case 'superadmin':
        return [
          { label: '🏛️ Executive AI Summary', query: 'Generate daily AI summary' },
          { label: '💡 Cost Savings', query: 'Provide cost saving suggestions' },
          { label: '⚙️ Resource Planning', query: 'Suggest resource planning optimizations' }
        ];
      default:
        return [
          { label: '💡 Waste Separation Tips', query: 'Give me waste segregation tips' },
          { label: '❓ FAQ Assistance', query: 'What is EcoTrack AI?' }
        ];
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toTimeString().substring(0, 5)
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      let replyText = "";
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.functions.invoke('chatbot', {
            body: { message: textToSend, role: user.role }
          });
          if (!error && data?.reply) {
            replyText = data.reply;
          }
        } catch (e) {
          console.warn("Supabase chatbot edge function failed, falling back to local responder", e);
        }
      }

      if (!replyText) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const lower = textToSend.toLowerCase();
        if (lower.includes('segregation') || lower.includes('separate') || lower.includes('guide')) {
          replyText = `### EcoTrack Smart Waste Segregation Guide:\n\n- **Blue Recycling Bin**: Plastics (PET 1, HDPE 2), Cardboard, Paperboard, and Aluminum Cans. Clean and compress containers first.\n- **Green Organics Bin**: Food scraps, coffee grounds, plant clippings, and compostable paper wrappers.\n- **Black Landfill Bin**: Styrofoam, multi-layer pouches, diapers, and contaminated greasy pizza boxes.\n- **Red Haz / E-Waste**: Household batteries, spent LED bulbs, chemical paints, and mercury thermometers.`;
        } else if (lower.includes('route') || lower.includes('optimize') || lower.includes('worker')) {
          replyText = `### AI Route Optimization Brief:\n\nUsing an integrated TSP Hamiltonian Solver, crew vehicles are auto-routed past critical smart bins (over 85% fill) and active citizen hazard reports. This cuts municipal carbon footprints by **28.5%** on average and guarantees same-day clearance.`;
        } else if (lower.includes('saving') || lower.includes('cost') || lower.includes('budget')) {
          replyText = `### Administrative Cost Analysis:\n\n- **Dynamically Routed Fleets**: Reduced fuel consumption by **18.4%** across Segment V.\n- **On-Demand Clearance**: Prevented empty-bin runs, saving an estimated **$12,400** in municipal overtime this quarter.\n- **Landfill Diversion Bonuses**: Improved sorting fidelity yields a +5% diversion credit from state environmental oversight boards.`;
        } else if (lower.includes('report') || lower.includes('incident') || lower.includes('complaint')) {
          replyText = `### Submitting a Civic Report:\n\nTo report illegal dumping or overflowing bins:\n1. Switch your role to **Citizen** using the top-right profile switcher.\n2. Navigate to the **Incident Reporter** tab.\n3. Input the title, description, category, and attach a simulated image.\n4. Click "Register Citizen Report" to dispatch sanitation crews and earn **25 Green Credits**!`;
        } else {
          replyText = `EcoBot here! To assist you as a **${user.role.toUpperCase()}**, I've queued up system telemetry logs.\n\nEcoTrack's AI models are analyzing active smart bins, fuel-saving EV routing matrices, and community leaderboards to build cleaner, more sustainable municipal segments. Ask me about **segregation guidelines**, **route optimization**, or **citizen rewards**!`;
        }
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        text: replyText,
        sender: 'bot',
        timestamp: new Date().toTimeString().substring(0, 5)
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        text: "I apologize, I experienced a minor network interruption. Here is a localized response: Please verify your internet connection or try again shortly.",
        sender: 'bot',
        timestamp: new Date().toTimeString().substring(0, 5)
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to strip markdown for simple rendering, or we can format simply
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let content = line;
      let isHeader3 = false;
      let isHeader4 = false;
      let isBullet = false;

      if (line.startsWith('### ')) {
        content = line.replace('### ', '');
        isHeader3 = true;
      } else if (line.startsWith('#### ')) {
        content = line.replace('#### ', '');
        isHeader4 = true;
      } else if (line.startsWith('- ')) {
        content = line.replace('- ', '');
        isBullet = true;
      }

      // Bold tag parser
      const parts = content.split('**');
      const formattedContent = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-extrabold text-slate-900 dark:text-white">{part}</strong>;
        }
        return part;
      });

      if (isHeader3) {
        return <h4 key={i} className="text-sm font-bold text-slate-950 dark:text-white mt-3 mb-1.5 flex items-center border-b border-emerald-500/20 pb-0.5">{formattedContent}</h4>;
      }
      if (isHeader4) {
        return <h5 key={i} className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1">{formattedContent}</h5>;
      }
      if (isBullet) {
        return (
          <div key={i} className="flex items-start space-x-1.5 ml-2 my-0.5">
            <span className="text-emerald-500 text-xs mt-0.5">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-1">{formattedContent}</span>
          </div>
        );
      }
      return <p key={i} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-1">{formattedContent}</p>;
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 pointer-events-none flex items-center justify-end">
      
      {/* 1. Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto z-40"
          />
        )}
      </AnimatePresence>

      {/* 2. Sliding Side Panel Workspace */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="w-full sm:w-[480px] h-screen bg-[#09090B] border-l border-zinc-800 shadow-[20px_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto z-50 relative"
          >
            {/* Panel Header */}
            <div className="p-5 border-b border-zinc-800 bg-[#111113] text-[#FAFAFA] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl relative">
                  <Bot className="h-5 w-5" />
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-sm tracking-tight text-[#FAFAFA]">EcoBot Workspace</span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase">AI ENGINE</span>
                  </div>
                  <span className="text-[11px] text-[#A1A1AA] flex items-center mt-0.5">
                    <Sparkles className="h-3 w-3 mr-1 text-amber-500 animate-pulse" />
                    Powered by @google/genai SDK
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#09090B]">
              {messages.map((m) => {
                const isBot = m.sender === 'bot';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start space-x-3 ${!isBot ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`p-2 rounded-xl shrink-0 ${isBot ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' : 'bg-emerald-600 text-white'}`}>
                      {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    {/* Speech Bubble */}
                    <div className={`max-w-[85%] p-4 rounded-2xl text-left border ${
                      isBot 
                        ? 'bg-[#111113] border-zinc-800/80 text-[#FAFAFA]' 
                        : 'bg-emerald-600/90 border-emerald-500 text-white shadow-md'
                    }`}>
                      {isBot ? (
                        <div className="space-y-1">
                          {renderText(m.text)}
                        </div>
                      ) : (
                        <p className="text-xs leading-relaxed">{m.text}</p>
                      )}
                      <span className={`block text-[8px] mt-1 text-right font-mono ${isBot ? 'text-[#A1A1AA]' : 'text-emerald-200'}`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-zinc-900 text-emerald-400 border border-zinc-800 shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-[#111113] border border-zinc-800/80 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1 items-center py-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggester Chips */}
            <div className="px-5 py-3.5 bg-[#111113] border-t border-b border-zinc-800">
              <span className="block text-[10px] font-bold font-mono tracking-wider text-zinc-400 uppercase mb-2 text-left">
                QUICK INTEGRATION CHECKS:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {getRoleChips().map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.query)}
                    className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] rounded-lg hover:border-emerald-500/60 transition shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-4 bg-[#111113] border-t border-zinc-800 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Query EcoBot system database...`}
                className="flex-1 px-3.5 py-2.5 bg-[#09090B] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all-custom"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-xl text-white transition-all-custom ${inputText.trim() ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-950' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Launcher Panel Trigger (Always floating, closed by default) */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-zinc-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-zinc-800 relative group focus:outline-none"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse opacity-20 blur-md group-hover:opacity-45 transition"></span>
          <div className="relative z-10 flex items-center">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6 text-zinc-400 hover:text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center space-x-1.5"
                >
                  <Bot className="h-6 w-6 text-emerald-400" />
                  <span className="text-xs font-bold font-mono tracking-wider ml-1 uppercase pr-1 text-zinc-200">AI AGENT</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>

    </div>
  );
}
