import React, { useState } from 'react';
import { motion } from 'motion/react';
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

    if (!isSupabaseActive() || !supabase) {
      // Local Sandbox Fallback Mode
      await new Promise(resolve => setTimeout(resolve, 800));
      const simulatedProfile: UserProfile = {
        email: email || 'suhelias786@gmail.com',
        role: 'citizen',
        name: name || email.split('@')[0] || 'Elias Suhel',
        points: 125,
        avatarUrl: ''
      };
      onAuthSuccess(simulatedProfile);
      setSuccess('Connected via offline Local Sandbox session!');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1500);
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        console.log('[AUTH START] Signup flow initiated.');
        console.log('[SIGNUP REQUEST] Registering email:', email);
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
          console.error('[SIGNUP FAILED] Error:', signUpError);
          throw signUpError;
        }

        console.log('[SIGNUP RESPONSE] Signup call completed successfully. User ID:', data.user?.id, 'Session exists:', !!data.session);

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
            console.log('[SESSION STATUS] Active session detected on signup.');
            console.log('[PROFILE FETCH] Querying newly created profile for user:', data.user.id);
            let profile: UserProfile | null = null;
            try {
              profile = await SupabaseService.getProfile(data.user.id);
              if (profile) {
                console.log('[PROFILE FETCHED] Successfully obtained profile from trigger:', profile);
              }
            } catch (profileErr) {
              console.warn('[PROFILE FETCH] Profile fetch failed immediately after signup (trigger might be executing/replicating):', profileErr);
            }

            const activeProfile = profile || newProfile;
            console.log('[PROFILE CREATED] Logged in with profile:', activeProfile);
            onAuthSuccess(activeProfile);
            setSuccess('Signup successful! Welcome to EcoTrack.');
          } else {
            console.log('[SESSION STATUS] Session is null (email verification might be enabled).');
            setSuccess('Registration successful! Please check your inbox for a verification email or try signing in if auto-confirmed.');
          }

          setTimeout(() => {
            onClose();
            setSuccess(null);
          }, 3000);
        }
      } else {
        console.log('[AUTH START] Login flow initiated.');
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('[LOGIN FAILED] Error during sign-in:', signInError);
          throw signInError;
        }

        if (data.user) {
          console.log('[LOGIN SUCCESS] Credentials accepted. User ID:', data.user.id);
          console.log('[PROFILE FETCH] Fetching user profile...');
          
          let profile: UserProfile | null = null;
          try {
            profile = await SupabaseService.getProfile(data.user.id);
            if (profile) {
              console.log('[PROFILE FETCHED] Profile successfully loaded:', profile);
            }
          } catch (profileErr) {
            console.error('[PROFILE FETCH FAILED] Error fetching profile:', profileErr);
          }

          if (profile) {
            onAuthSuccess(profile);
          } else {
            const fallbackProfile: UserProfile = {
              email: data.user.email || '',
              role: 'citizen',
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Citizen',
              points: 100,
              avatarUrl: ''
            };
            console.log('[PROFILE CREATED] Using user metadata fallback profile:', fallbackProfile);
            onAuthSuccess(fallbackProfile);
          }
          setSuccess('Authenticated successfully via Supabase!');
          setTimeout(() => {
            onClose();
            setSuccess(null);
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
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
      setSuccess('Verification/Reset link dispatched to your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch recovery email.');
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
            {isSupabaseActive() ? (
              <div className="flex items-center space-x-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Cloud className="h-3 w-3 mr-1" /> Cloud Mode Active
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                <WifiOff className="h-3 w-3 mr-1" /> Simulated Mode
              </div>
            )}
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
                <span>{isSignUp ? 'Activate Cloud Sync' : 'Access Dashboard'}</span>
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
