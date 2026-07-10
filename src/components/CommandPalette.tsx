import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Compass, Settings, ShieldAlert, Cpu, 
  HelpCircle, Sparkles, Moon, Sun, Database, Terminal 
} from 'lucide-react';
import { isSupabaseActive } from '../supabaseClient';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, role?: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onTriggerBackup: () => void;
  onLoadDemoMode: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Developer';
  title: string;
  description: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onToggleDarkMode,
  isDarkMode,
  onTriggerBackup,
  onLoadDemoMode
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Go to Landing Page',
      description: 'Navigate to the main municipal welcome portal.',
      shortcut: 'G H',
      icon: <Compass className="h-4 w-4 text-indigo-500" />,
      action: () => { onNavigate('home'); onClose(); }
    },
    {
      id: 'nav-citizen',
      category: 'Navigation',
      title: 'Open Citizen Portal',
      description: 'Access rewards, file incident reports, view recycling depots.',
      shortcut: 'G C',
      icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
      action: () => { onNavigate('dashboard', 'citizen'); onClose(); }
    },
    {
      id: 'nav-worker',
      category: 'Navigation',
      title: 'Open Worker Path Sheet',
      description: 'Access assigned EV routes and collect smart bins.',
      shortcut: 'G W',
      icon: <Terminal className="h-4 w-4 text-amber-500" />,
      action: () => { onNavigate('dashboard', 'worker'); onClose(); }
    },
    {
      id: 'nav-supervisor',
      category: 'Navigation',
      title: 'Open Supervisor Panel',
      description: 'Assign tasks, dispatch crews, and manage municipal assets.',
      shortcut: 'G S',
      icon: <Settings className="h-4 w-4 text-purple-500" />,
      action: () => { onNavigate('dashboard', 'supervisor'); onClose(); }
    },
    {
      id: 'nav-smartcity',
      category: 'Navigation',
      title: 'Open Smart City OS',
      description: 'Launch Palantir-style command cockpit and 3D digital twin.',
      shortcut: 'G O',
      icon: <Cpu className="h-4 w-4 text-cyan-500" />,
      action: () => { onNavigate('smartcity'); onClose(); }
    },
    {
      id: 'nav-faq',
      category: 'Navigation',
      title: 'Open FAQ & Contacts',
      description: 'Browse help guides, documentation, and municipal contact cards.',
      shortcut: 'G F',
      icon: <HelpCircle className="h-4 w-4 text-slate-500" />,
      action: () => { onNavigate('faq'); onClose(); }
    },
    {
      id: 'action-theme',
      category: 'Actions',
      title: 'Toggle Color Theme',
      description: `Switch interface appearance to ${isDarkMode ? 'Light' : 'Dark'} Mode.`,
      shortcut: 'T T',
      icon: isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />,
      action: () => { onToggleDarkMode(); onClose(); }
    },
    {
      id: 'action-backup',
      category: 'Actions',
      title: 'Trigger Core DB Backup',
      description: 'Commit in-memory records and export relational snapshot.',
      shortcut: 'B B',
      icon: <Database className="h-4 w-4 text-emerald-600" />,
      action: () => { onTriggerBackup(); onClose(); }
    },
    {
      id: 'dev-demo',
      category: 'Developer',
      title: 'Initialize City-Scale Demo Mode',
      description: 'Pre-populate database with +10K citizens, +2K bins, and trigger dashboards.',
      shortcut: 'D D',
      icon: <ShieldAlert className="h-4 w-4 text-cyan-400" />,
      action: () => { onLoadDemoMode(); onClose(); }
    }
  ];

  // Filter commands based on search and Supabase state
  const filteredCommands = commands.filter(cmd => {
    if (cmd.id === 'dev-demo' && isSupabaseActive()) {
      return false; // Hide demo seeding in production/configured mode
    }
    return (
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation within list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4 z-50 animate-fade-in">
          
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.97, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-left"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            {/* Search Input */}
            <div className="flex items-center space-x-3 p-4 border-b border-slate-100 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a page, command, or shortcut..."
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none"
                aria-autocomplete="list"
              />
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold shrink-0">
                ESC
              </span>
            </div>

            {/* Results list */}
            <div className="max-h-[340px] overflow-y-auto p-2 space-y-3" role="listbox">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No commands matching "{search}" found.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Categorized grouping */}
                  {['Navigation', 'Actions', 'Developer'].map(category => {
                    const categoryCmds = filteredCommands.filter(c => c.category === category);
                    if (categoryCmds.length === 0) return null;

                    return (
                      <div key={category} className="space-y-1">
                        <span className="px-3 text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider block">
                          {category}
                        </span>

                        <div className="space-y-0.5">
                          {categoryCmds.map(cmd => {
                            // Find matching index in filtered list
                            const originalIdx = filteredCommands.findIndex(c => c.id === cmd.id);
                            const isSelected = selectedIndex === originalIdx;

                            return (
                              <button
                                key={cmd.id}
                                onClick={cmd.action}
                                onMouseEnter={() => setSelectedIndex(originalIdx)}
                                className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-3 text-xs ${
                                  isSelected 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                                    : 'text-slate-600 dark:text-slate-400'
                                }`}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white dark:bg-slate-900 text-indigo-500' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'}`}>
                                    {cmd.icon}
                                  </div>
                                  <div className="overflow-hidden">
                                    <span className="block font-bold truncate leading-tight">{cmd.title}</span>
                                    <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">{cmd.description}</span>
                                  </div>
                                </div>

                                {cmd.shortcut && (
                                  <span className="text-[9px] font-mono bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-200/50 dark:border-slate-800 px-2 py-0.5 rounded-lg font-bold shrink-0">
                                    {cmd.shortcut}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3 border-t border-slate-150 dark:border-slate-850/50 flex justify-between text-[9px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span>↑↓</span> to move
                <span>↵</span> to select
              </span>
              <span>
                Ctrl + K to toggle anywhere
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
