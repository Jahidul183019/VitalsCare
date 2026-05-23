import React, {useState, useEffect} from 'react';
import { API_BASE } from '../api';

interface Props {
  visible: boolean;
  name: string;
  onClose: () => void;
  onSave: (name: string) => void;
  onLogout: () => void;
}

export default function ProfileModal({ visible, name, onClose, onSave, onLogout }: Props) {
  const [tmpName, setTmpName] = useState(name);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setTmpName(name), [name]);

  useEffect(() => {
    if (!visible) return;
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const token = window.localStorage.getItem('vitalscare.token');
        const headers1: Record<string,string> = {};
        if (token) headers1['token'] = token;

        // Try token header first
        let res = await fetch(`${API_BASE}/auth/me`, { headers: headers1 });
        if (!res.ok) {
          // Try Authorization Bearer as fallback
          const headers2: Record<string,string> = {};
          if (token) headers2['Authorization'] = `Bearer ${token}`;
          res = await fetch(`${API_BASE}/auth/me`, { headers: headers2 });
        }

        if (!res.ok) {
          // fallback to localStorage values if available
          const localUser = window.localStorage.getItem('vitalscare.username');
          const localName = window.localStorage.getItem('vitalscare.profileName');
          if (localUser || localName) {
            setUsername(localUser || null);
            setTmpName(localName || '');
            setError(null);
            return;
          }
          throw new Error('Failed to load profile');
        }

        const j = await res.json();
        setUsername(j.username);
        setTmpName(j.name || '');
      } catch (err: any) {
        setError(String(err.message || err));
        // fallback to local storage even on error
        const localUser = window.localStorage.getItem('vitalscare.username');
        const localName = window.localStorage.getItem('vitalscare.profileName');
        setUsername(localUser || null);
        setTmpName(localName || '');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [visible]);

  if (!visible) return null;

  async function handleSave() {
    setError(null);
    try {
      const token = window.localStorage.getItem('vitalscare.token');
      const headers1: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token) headers1['token'] = token;
      let res = await fetch(`${API_BASE}/auth/me`, { method: 'PATCH', headers: headers1, body: JSON.stringify({ name: tmpName }) });
      if (!res.ok && token) {
        const headers2: Record<string,string> = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        res = await fetch(`${API_BASE}/auth/me`, { method: 'PATCH', headers: headers2, body: JSON.stringify({ name: tmpName }) });
      }

      if (!res.ok) {
        // Persist locally but inform user
        window.localStorage.setItem('vitalscare.profileName', tmpName);
        onSave(tmpName);
        setError('Saved locally (server unavailable)');
        return;
      }

      const j = await res.json();
      window.localStorage.setItem('vitalscare.profileName', j.name || j.username);
      onSave(j.name || j.username);
    } catch (err: any) {
      setError(String(err.message || err));
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-3">Profile</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {username && <div className="text-xs text-neutral-500 mb-2">@{username}</div>}
            <label className="text-sm text-neutral-600">Display name</label>
            <input value={tmpName} onChange={e => setTmpName(e.target.value)} className="w-full p-3 mt-2 mb-2 border rounded-md" />
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

            <div className="flex gap-2 justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-md bg-teal-700 text-white">Save</button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button onClick={onLogout} className="w-full text-left text-red-600">Logout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
