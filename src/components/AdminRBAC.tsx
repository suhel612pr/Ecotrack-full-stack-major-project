import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, Trash2, Key, Users, AlertTriangle } from 'lucide-react';

export default function AdminRBAC() {
  const [profiles, setProfiles] = useState([
    { id: 'u-1', name: 'Marcus Vance', email: 'marcus@ecotrack.gov', role: 'Sanitation Worker', status: 'Active', perm: 'Fleet, QR Scan' },
    { id: 'u-2', name: 'Elena Rostova', email: 'elena@citizen.org', role: 'Citizen', status: 'Active', perm: 'Scan, Claim, Report' },
    { id: 'u-3', name: 'Sarah Jenkins', email: 'sarah.j@ecotrack.gov', role: 'Supervisor', status: 'Active', perm: 'All Portals, Dispatch' },
    { id: 'u-4', name: 'Michael Finch', email: 'finch@admin.gov', role: 'Admin', status: 'Active', perm: 'Full Database Operations' },
    { id: 'u-5', name: 'Blocked User', email: 'spammer@fake.com', role: 'Citizen', status: 'Suspended', perm: 'None' }
  ]);

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [roleChange, setRoleChange] = useState('Citizen');

  const handleRoleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId) return;

    setProfiles(profiles.map(p => {
      if (p.id === selectedProfileId) {
        return { 
          ...p, 
          role: roleChange,
          perm: roleChange === 'Admin' ? 'Full Database Operations' : roleChange === 'Supervisor' ? 'All Portals, Dispatch' : roleChange === 'Sanitation Worker' ? 'Fleet, QR Scan' : 'Scan, Claim, Report'
        };
      }
      return p;
    }));

    setSelectedProfileId(null);
    alert('Security Clearance Level upgraded and propagated through regional LDAP authentication servers.');
  };

  const handleToggleStatus = (id: string) => {
    setProfiles(profiles.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Active' ? 'Suspended' : 'Active';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
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

        {/* Desktop Table View */}
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
                    {p.role}
                  </td>
                  <td className="py-3 pr-2 text-slate-400 text-[10px]">
                    {p.perm}
                  </td>
                  <td className="py-3 pr-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
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
                          setRoleChange(p.role);
                        }}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded text-[9px] font-bold text-slate-600 dark:text-slate-300 transition"
                      >
                        Elevate Role
                      </button>
                      <button
                        onClick={() => handleToggleStatus(p.id)}
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
                <option value="Citizen">Citizen (Scan & Report)</option>
                <option value="Sanitation Worker">Sanitation Worker (Route Clearance & QR Scan)</option>
                <option value="Supervisor">Supervisor (Dispatch Crew & Manage Bins)</option>
                <option value="Admin">Admin (Full Control)</option>
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
