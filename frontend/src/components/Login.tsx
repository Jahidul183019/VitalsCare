import React, {useState} from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string, name?: string) => void;
  onRegister?: (token: string, name?: string) => void;
}

export default function Login({ onLogin, onRegister }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function doAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password, name: name || undefined }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || 'Auth failed');
      }
      const j = await res.json();
      // store token and username locally for subsequent requests
      window.localStorage.setItem('vitalscare.token', j.token);
      window.localStorage.setItem('vitalscare.profileName', j.name || j.username || 'Community Member');
      window.localStorage.setItem('vitalscare.username', j.username);
      onLogin(j.token, j.name || j.username);
    } catch (err: any) {
      setError(String(err.message || err));
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">{isRegister ? 'Create Account' : 'Login'}</h3>
      <form onSubmit={doAuth} className="flex flex-col gap-3">
        {isRegister && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name (optional)" className="p-3 rounded-md border" />
        )}
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="p-3 rounded-md border" />
        <div className="relative">
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="p-3 rounded-md border w-full pr-10"
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800"
            aria-pressed={showPassword}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {isRegister && (
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              className="p-3 rounded-md border w-full pr-10"
              aria-label="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800"
              aria-pressed={showConfirmPassword}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button className="flex-1 bg-teal-700 text-white py-2 rounded-md">{isRegister ? 'Register' : 'Login'}</button>
          <button type="button" onClick={() => setIsRegister(s => !s)} className="px-3 py-2 border rounded-md">{isRegister ? 'Back' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
