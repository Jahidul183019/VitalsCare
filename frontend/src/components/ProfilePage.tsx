import React, { useEffect, useState } from 'react';
import { API_BASE } from '../api';
import { ArrowLeft, Eye, EyeOff, LogOut, Shield, User } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function ProfilePage({ onBack, onLogout }: ProfilePageProps) {
  const [username, setUsername] = useState<string>(() => {
    try {
      return window.localStorage.getItem('vitalscare.username') || '';
    } catch {
      return '';
    }
  });

  const [name, setName] = useState<string>(() => {
    try {
      return window.localStorage.getItem('vitalscare.profileName') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const token = window.localStorage.getItem('vitalscare.token');
      // prefer server profile when available, try two header styles
      if (!token) return;
      try {
        let res = await fetch(`${API_BASE}/auth/me`, { headers: token ? { token } : {} });
        if (!res.ok) {
          // try Authorization: Bearer <token>
          res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        }
        if (!res.ok) return;
        const j = await res.json();
        setUsername(j.username || window.localStorage.getItem('vitalscare.username') || '');
        setName(j.name || window.localStorage.getItem('vitalscare.profileName') || j.username || '');
      } catch (e) {
        // ignore — fall back to localStorage
      }
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveName() {
    setLoading(true);
    setMsg(null);
    try {
      const token = window.localStorage.getItem('vitalscare.token');
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to save name');
      window.localStorage.setItem('vitalscare.profileName', name || 'Community Member');
      setMsg('Saved');
    } catch (e: any) {
      setMsg(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError(null);
    if (!currentPwd || !newPwd) {
      setPwdError('Please fill both fields');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const token = window.localStorage.getItem('vitalscare.token');
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
        body: JSON.stringify({ current_password: currentPwd, new_password: newPwd }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || 'Failed to change password');
      }
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setMsg('Password changed');
    } catch (err: any) {
      setPwdError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 text-neutral-800 selection:bg-teal-700 selection:text-white">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-teal-100/70 via-emerald-50/30 to-transparent pointer-events-none" />
      <div className="absolute top-24 right-0 w-80 h-80 bg-teal-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-72 left-0 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-25 pointer-events-none" />

      <header className="sticky top-0 z-30 border-b border-neutral-200/70 bg-white/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 soft-shadow">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">VitalsCare</p>
              <h2 className="text-lg font-bold text-neutral-950">Profile</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-800 hover:-translate-y-0.5 soft-shadow"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 md:px-12 py-10 md:py-16">
        <section className="glass-card soft-shadow rounded-[2rem] p-6 md:p-10 mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">
                <Shield className="h-3.5 w-3.5" />
                Account settings
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Keep your profile aligned with your health journey.
              </h1>
              <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-neutral-600">
                Update your display name, manage your password, and sign out securely from the same teal-and-glass interface used across the app.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-teal-100 bg-white/85 p-5 md:min-w-[18rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Signed in as</p>
              <p className="mt-2 text-2xl font-bold text-neutral-950">{name || 'Community Member'}</p>
              <p className="mt-1 text-sm text-neutral-600">@{username || 'unknown'}</p>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-teal-50 px-4 py-3 text-teal-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {(name || username || 'CM').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('') || 'CM'}
                </div>
                <div>
                  <p className="text-sm font-semibold">Secure session active</p>
                  <p className="text-xs text-teal-800/80">Your data stays tied to your account.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="glass-card soft-shadow rounded-[2rem] p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-neutral-950">Profile details</h3>
                <p className="text-sm text-neutral-600 mt-1">Edit the display name shown throughout the app.</p>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">Editable</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-neutral-700">Username</label>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-700">@{username}</div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-neutral-700">Display name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                  placeholder="Enter your display name"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => { setName(window.localStorage.getItem('vitalscare.profileName') || ''); }}
                className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 hover:border-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={saveName}
                disabled={loading}
                className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 soft-shadow"
              >
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>

            {msg && <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">{msg}</div>}
          </section>

          <section className="glass-card soft-shadow rounded-[2rem] p-6">
            <h3 className="text-xl font-bold text-neutral-950">Change password</h3>
            <p className="mt-1 text-sm text-neutral-600">Update your login credentials from here.</p>

            <form onSubmit={changePassword} className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Current password"
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
                <button type="button" onClick={() => setShowCurrent(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
                <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
                <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {pwdError && <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{pwdError}</div>}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Change password'}
              </button>
            </form>
          </section>

          <section className="glass-card soft-shadow rounded-[2rem] p-6 lg:col-span-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-950">Session controls</h3>
                <p className="mt-1 text-sm text-neutral-600">Use the Logout button in the header to sign out from this device.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
