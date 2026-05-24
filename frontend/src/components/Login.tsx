import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, HeartPulse, ShieldCheck, TrendingDown, Users } from 'lucide-react';
import { API_BASE } from '../api';

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

  function getFriendlyAuthError(detail: unknown, isRegisterFlow: boolean) {
    if (typeof detail !== 'string') {
      return isRegisterFlow ? 'We could not create your account right now. Please try again.' : 'We could not sign you in right now. Please try again.';
    }

    const errorMap: Record<string, string> = {
      'invalid-credentials': 'Incorrect username or password. Please try again.',
      'username-taken': 'That username is already taken. Please choose a different one.',
      'register-error': 'We could not create your account right now. Please try again.',
      'login-error': 'We could not sign you in right now. Please try again.',
      'new-password-too-short': 'The new password must be at least 6 characters long.',
      'invalid-current-password': 'The current password you entered is incorrect.',
      'unknown-user': 'Your account could not be found. Please sign in again.',
      'Missing auth token': 'Your session has expired. Please sign in again.',
      'Invalid or expired token': 'Your session has expired. Please sign in again.',
      'Unknown user': 'Your session is no longer valid. Please sign in again.',
    };

    return errorMap[detail] ?? detail;
  }

  async function doAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const url = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password, name: name || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const detail = body && typeof body === 'object' && 'detail' in body ? (body as { detail?: unknown }).detail : null;
        throw new Error(getFriendlyAuthError(detail ?? res.statusText ?? 'Auth failed', isRegister));
      }
      const j = await res.json();
      // store token and username locally for subsequent requests
      window.localStorage.setItem('vitalscare.token', j.token);
      window.localStorage.setItem('vitalscare.profileName', j.name || j.username || 'Community Member');
      window.localStorage.setItem('vitalscare.username', j.username);
      onLogin(j.token, j.name || j.username);
    } catch (err: any) {
      setError(String(err?.message || 'Something went wrong. Please try again.'));
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 text-neutral-800 selection:bg-teal-700 selection:text-white">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-teal-100/80 via-emerald-50/30 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-0 w-80 h-80 bg-teal-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-25 pointer-events-none" />

      <header className="sticky top-0 z-30 border-b border-neutral-200/70 bg-white/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 soft-shadow">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">VitalsCare</p>
                <p className="text-lg font-bold text-neutral-950">Health Risk Radar</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800">
            Secure access to your health dashboard
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 md:px-12 py-10 md:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Trusted in Bangladesh
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Welcome back to a cleaner way to track health risk.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-600">
                Sign in to view assessments, manage your profile, and continue using the same teal-and-glass interface from the homepage.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-card soft-shadow rounded-2xl p-5">
                <TrendingDown className="h-5 w-5 text-teal-700" />
                <p className="mt-3 text-2xl font-extrabold text-neutral-950">30%</p>
                <p className="mt-1 text-sm text-neutral-600">Risk reduction focus</p>
              </div>
              <div className="glass-card soft-shadow rounded-2xl p-5">
                <Users className="h-5 w-5 text-teal-700" />
                <p className="mt-3 text-2xl font-extrabold text-neutral-950">1 in 4</p>
                <p className="mt-1 text-sm text-neutral-600">Adults face hypertension</p>
              </div>
              <div className="glass-card soft-shadow rounded-2xl p-5">
                <ShieldCheck className="h-5 w-5 text-teal-700" />
                <p className="mt-3 text-2xl font-extrabold text-neutral-950">Private</p>
                <p className="mt-1 text-sm text-neutral-600">Secure session access</p>
              </div>
            </div>

            <div className="glass-card soft-shadow rounded-[2rem] p-6 md:p-8 max-w-2xl">
              <h3 className="text-lg font-bold text-neutral-950">Why sign in?</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                You can save your profile, return to previous assessments, and keep the design consistent across the app.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -translate-y-3 translate-x-3 rounded-[2.5rem] bg-teal-200/30 blur-2xl pointer-events-none" />
            <div className="relative glass-card soft-shadow rounded-[2.5rem] p-6 md:p-8 border border-white/70">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Account access</p>
                  <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950">
                    {isRegister ? 'Create your account' : 'Login to continue'}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    {isRegister
                      ? 'Set up your profile and start tracking health risks.'
                      : 'Enter your details to access your dashboard.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRegister(s => !s)}
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  {isRegister ? 'Back to login' : 'Create account'}
                </button>
              </div>

              <form onSubmit={doAuth} className="flex flex-col gap-4">
                {isRegister && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-700">Full name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full name (optional)"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">Username</label>
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">Password</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800"
                      aria-pressed={showPassword}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isRegister && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-700">Confirm password</label>
                    <div className="relative">
                      <input
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                        aria-label="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-800"
                        aria-pressed={showConfirmPassword}
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert" aria-live="polite">
                    {error}
                  </div>
                )}

                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-teal-800 hover:-translate-y-0.5 soft-shadow">
                  {isRegister ? 'Register' : 'Login'}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="text-xs leading-relaxed text-neutral-500">
                  By continuing, you agree to use this app for preventive screening only and not as a medical diagnosis.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
