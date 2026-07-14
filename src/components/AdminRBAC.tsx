import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, Trash2, Key, Users, AlertTriangle } from 'lucide-react';
import { SupabaseService } from '../supabaseService';
import { UserProfile } from '../types';
import { logError } from '../logger';

interface AdminRBACProps {
  addNotification: (notif: { title: string; desc: string; type: 'info' | 'warn' | 'success' }) => void;
}

export default function AdminRBAC({ addNotification }: AdminRBACProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [roleChange, setRoleChange] = useState('citizen');

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getUsers();
      setProfiles(data);
    } catch (err) {
      setError('Failed to fetch user profiles.');
      logError('Failed to fetch user profiles.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleRoleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId) return;

    try {
      await SupabaseService.updateUserRole(selectedProfileId, roleChange as UserProfile['role']);
      await fetchProfiles(); // Refetch to show updated data
      addNotification({
        title: 'Role Upgraded',
        desc: `User's security clearance level was upgraded successfully.`,
        type: 'success'
      });
      setSelectedProfileId(null);
    } catch (err) {
      addNotification({
        title: 'Update Failed',
        desc: 'Failed to update the user role. Please check permissions.',
        type: 'warn'
      });
      logError('Failed to update user role.', err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if (confirm(`Are you sure you want to set user status to ${nextStatus}?`)) {
      try {
        // Assuming a service function exists for this
        await SupabaseService.updateUserStatus(id, nextStatus);
        await fetchProfiles(); // Refetch to show updated data
        addNotification({
          title: 'User Status Updated',
          desc: `User status has been changed to ${nextStatus}.`,
          type: 'info'
        });
      } catch (err) {
        addNotification({
          title: 'Update Failed',
          desc: 'Failed to update user status.',
          type: 'warn'
        });
        logError('Failed to update user status.', err);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Left Column: Accounts Directory Table (8 Cols) */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">LDAP Security profiles</h4>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-850 px-2.5 py-0.5 rounded-full text-slate-500">
            {profiles.length} Accounts Registered
          </span>
        </div>

        {loading && <div className="text-center py-8 text-xs text-slate-400">Loading LDAP profiles...</div>}
        {error && <div className="text-center py-8 text-xs text-rose-500">{error}</div>}

        {!loading && !error && (
          /* Desktop Table View */
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-mono">
                <th className="pb-3 pt-1">User Identifier</th>
                <th className="pb-3 pt-1">Role Type</th>
                <th className="pb-3 pt-1">Security Tokens</th>
                <th className="pb-3 pt-1">Ledger Status</th>
                <th className="pb-3 pt-1 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-mono">
              {profiles.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition">
                  <td className="py-3 pr-2">
                    <span className="font-sans block font-bold text-slate-800 dark:text-slate-200 leading-none">{p.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{p.email}</span>
                  </td>
                  <td className="py-3 pr-2 font-bold text-slate-700 dark:text-slate-300">
                    {p.role || 'citizen'}
                  </td>
                  <td className="py-3 pr-2 text-slate-400 text-[10px]">
                    {/* Permissions should be derived from role */}
                  </td>
                  <td className="py-3 pr-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold capitalize ${
                      p.status === 'Active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedProfileId(p.id);
                          setRoleChange(p.role || 'citizen');
                        }}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded text-[9px] font-bold text-slate-600 dark:text-slate-300 transition"
                      >
                        Elevate Role
                      </button>
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status || 'Active')}
                        className={`px-2 py-1 rounded text-[9px] font-bold text-white transition ${
                          p.status === 'Active' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {p.status === 'Active' ? 'Block' : 'Unblock'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Right Column: Elevate Role Console (4 Cols) */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
        {selectedProfileId ? (
          <form onSubmit={handleRoleChangeSubmit} className="space-y-4">
            <div className="flex items-center space-x-1.5 text-emerald-600 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Key className="h-5 w-5" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Role Elevation Console</h4>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl text-xs space-y-1">
              <span className="block font-bold text-[9px] text-slate-400 font-mono">SELECTED IDENTITY:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                {profiles.find(p => p.id === selectedProfileId)?.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {profiles.find(p => p.id === selectedProfileId)?.email}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">New Authority level</label>
              <select
                value={roleChange}
                onChange={e => setRoleChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="citizen">Citizen (Scan & Report)</option>
                <option value="worker">Sanitation Worker (Route Clearance & QR Scan)</option>
                <option value="supervisor">Supervisor (Dispatch Crew & Manage Bins)</option>
                <option value="admin">Admin (Full Control)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedProfileId(null)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
              >
                Apply Level
              </button>
            </div>
          </form>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[300px]">
            <ShieldCheck className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2.5" />
            <h5 className="font-bold text-slate-700 dark:text-slate-300 text-xs">Role Management Panel</h5>
            <p className="text-xs text-slate-400 leading-relaxed mt-1 max-w-xs">
              Select any registered municipal profile from the left LDAP list to upgrade credentials, alter permissions, or flag access blocks.
            </p>
          </div>
        )}

        <div className="text-[9px] text-slate-400 font-mono text-center pt-4">
          <span>REAL-TIME ROLE ENFORCEMENT & DECRPYTION TOKENS</span>
        </div>
      </div>

    </div>
  );
}
