import React, { useEffect, useState } from 'react';
import { API_BASE } from '../api';
import { Eye, EyeOff } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
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
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button onClick={onBack} className="px-3 py-1 border rounded-md">Back</button>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-neutral-600 mb-1">Username</label>
          <div className="p-3 rounded-md border bg-neutral-50">@{username}</div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-neutral-600 mb-1">Display name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-md border" />
          <div className="flex gap-3 mt-3">
            <button onClick={() => { setName(window.localStorage.getItem('vitalscare.profileName') || ''); }} className="px-4 py-2 border rounded-md">Cancel</button>
            <button onClick={saveName} className="px-4 py-2 bg-teal-700 text-white rounded-md" disabled={loading}>Save</button>
          </div>
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <form onSubmit={changePassword} className="flex flex-col gap-3 max-w-md">
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} placeholder="Current password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} className="p-3 rounded-md border w-full pr-10" />
              <button type="button" onClick={() => setShowCurrent(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <input type={showNew ? 'text' : 'password'} placeholder="New password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="p-3 rounded-md border w-full pr-10" />
              <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className="p-3 rounded-md border w-full pr-10" />
              <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {pwdError && <div className="text-red-600">{pwdError}</div>}
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-teal-700 text-white rounded-md" disabled={loading}>Change password</button>
            </div>
          </form>
          {msg && <div className="mt-3 text-teal-700">{msg}</div>}
        </div>

      </div>
    </div>
  );
}
