import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, X, Check, ArrowRight, ShieldCheck, Sparkles, Cloud, WifiOff } from 'lucide-react';
import { getSupabase, isSupabaseActive } from '../supabaseClient';
import { SupabaseService } from '../supabaseService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userProfile: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    const supabase = getSupabase();
    const active = isSupabaseActive();

    if (!active || !supabase) {
      setError(
        'Database connection is not available. Please check your network or app configuration.'
      );
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0]
            }
          }
        });
        if (signUpError) {
          throw signUpError;
        }

        if (data.user) {
          const newProfile: UserProfile = {
            email,
            role: 'citizen',
            name: name || email.split('@')[0],
            points: 100,
            avatarUrl: ''
          };

          // If there is an active session (auto-confirm is ON)
          if (data.session) {
            let profile: UserProfile | null = null;
            try {
              // The DB trigger might have a slight delay. Poll for the profile.
              for (let i = 0; i < 5; i++) {
                profile = await SupabaseService.getProfile(data.user.id);
                if (profile) break;
                await new Promise(res => setTimeout(res, 300));
              }
              profile = await SupabaseService.getProfile(data.user.id);
            } catch (profileErr) {
              // The profile might not be available immediately due to replication delay.
            }

            const activeProfile = profile || newProfile;
            onAuthSuccess(activeProfile);
            setSuccess('Signup successful! Welcome to EcoTrack.');
          } else {
            setSuccess('Registration successful! Please check your inbox for a verification email or try signing in if auto-confirmed.');
          }

          setTimeout(() => {
            onClose();
            setSuccess(null);
          }, 3000);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) {
          throw signInError;
        }

        if (data.user) {
          let profile: UserProfile | null = null;
          try {
            profile = await SupabaseService.getProfile(data.user.id);
          } catch (profileErr) {
            // Error is thrown by the service if the profile is not found.
            // This is expected if the trigger failed or is delayed.
          }

          if (profile) {
            onAuthSuccess(profile);
          } else {
            // Fallback to user metadata if profile is not found.
            const fallbackProfile: UserProfile = {
              email: data.user.email || '',
              role: 'citizen',
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Citizen',
              points: 100,
              avatarUrl: ''
            };
            onAuthSuccess(fallbackProfile);
          }
          setSuccess('Authenticated successfully via Supabase!');
          setTimeout(() => {
            onClose();
            setSuccess(null);
          }, 1500);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unknown error occurred during authentication.';
      console.error('Authentication error:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please provide your email address to request a reset link.');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError('Password recovery is only available when real Supabase connection is active.');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (resetError) throw resetError;
      setSuccess('If an account exists for this email, a password reset link has been sent.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to dispatch recovery email.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md overflow-hidden bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-900 rounded-3xl shadow-2xl p-6"
      >
        {/* Connection status header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1.5">
            <div className={`flex items-center space-x-1 text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full border ${isSupabaseActive() 
              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-500/20'}`}>
              {isSupabaseActive() ? <Cloud className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />} {isSupabaseActive() ? 'Cloud Connection Active' : 'Database Offline'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Title */}
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-950 dark:bg-zinc-50 flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6 text-white dark:text-zinc-950" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isSignUp ? 'Create Smart City Identity' : 'Authorized Sign-In'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isSignUp
              ? 'Register to record real-time waste classification telemetry.'
              : 'Access your municipal operations, citizen profile, or dispatch hubs.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-3 mb-4 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 rounded-xl border border-rose-500/20">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl border border-emerald-500/20 flex items-center">
            <Check className="h-4 w-4 mr-1.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Elias Suhel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                placeholder="suhelias786@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono uppercase">Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-zinc-950 dark:bg-zinc-550 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle signup/signin */}
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-400">
            {isSignUp ? 'Already have an identity?' : "Don't have a database identity?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up / Create'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
