'use client';

import React, { useEffect, useState } from 'react';
import {
  Moon,
  Sun,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Github,
  Chrome,
  User,
} from 'lucide-react';
import {
  loginWithCredentials,
  registerWithCredentials,
  startOAuthLogin,
  type AuthUser,
} from '@/lib/authService';

interface LoginPageProps {
  errorMessage?: string | null;
  onLoginSuccess?: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ errorMessage, onLoginSuccess }) => {
  const [isDark, setIsDark] = useState(true);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<'google' | 'github' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('veritas-theme');
    const dark = saved !== 'light';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('veritas-theme', next ? 'dark' : 'light');
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);

    try {
      const user = mode === 'login'
        ? await loginWithCredentials(email, password)
        : await registerWithCredentials(name, email, password);
      setSubmitted(true);
      window.setTimeout(() => onLoginSuccess?.(user), 400);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    setOauthProvider(provider);
    startOAuthLogin(provider);
  };

  const displayError = localError ?? errorMessage;

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between items-center transition-colors duration-700 relative overflow-hidden ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse ${
            isDark ? 'bg-indigo-600' : 'bg-blue-400'
          }`}
        />
        <div
          className={`absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30 animate-pulse delay-1000 ${
            isDark ? 'bg-purple-600' : 'bg-violet-300'
          }`}
        />
      </div>

      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            VeritasAI
          </span>
        </div>

        <button
          onClick={toggleTheme}
          type="button"
          className={`relative p-2.5 rounded-full border transition-all duration-300 shadow-md ${
            isDark
              ? 'bg-slate-900/80 border-slate-700 text-amber-400 hover:border-amber-400/50 hover:bg-slate-800'
              : 'bg-white/80 border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-slate-100'
          } backdrop-blur-md`}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      <main className="w-full max-w-md px-4 z-10 my-auto">
        <div
          className={`p-8 rounded-3xl backdrop-blur-xl border transition-all duration-500 shadow-2xl ${
            isDark
              ? 'bg-slate-900/60 border-slate-800/80 shadow-black/50 hover:border-slate-700'
              : 'bg-white/70 border-white/60 shadow-slate-200/50 hover:border-slate-200'
          }`}
        >
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 mb-4">
              <Lock className="w-3.5 h-3.5" />
              Secure sign-in
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {mode === 'login'
                ? 'Sign in to save essays and revisit your analysis history.'
                : 'Create an account to save essays and analysis history.'}
            </p>
          </div>

          {displayError && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {displayError}
            </div>
          )}

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold">Authentication Successful</h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Opening your workspace…
              </p>
            </div>
          ) : (
            <form onSubmit={handleCredentials} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Name
                  </label>
                  <div className="relative flex items-center">
                    <User className={`absolute left-3.5 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        isDark
                          ? 'bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          : 'bg-slate-50/80 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className={`absolute left-3.5 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? 'bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        : 'bg-slate-50/80 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Password
                  </label>
                  {mode === 'login' && (
                    <span className="text-xs font-medium text-slate-500">8+ characters</span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className={`absolute left-3.5 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={mode === 'signup' ? 8 : 1}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? 'bg-slate-950/50 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        : 'bg-slate-50/80 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all flex justify-center items-center space-x-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {!submitted && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-3 ${isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={oauthProvider !== null}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-60 ${
                    isDark
                      ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Chrome className="w-4 h-4" />
                  <span>{oauthProvider === 'google' ? 'Connecting…' : 'Google'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  disabled={oauthProvider !== null}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-60 ${
                    isDark
                      ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>{oauthProvider === 'github' ? 'Connecting…' : 'GitHub'}</span>
                </button>
              </div>
            </>
          )}

          {!submitted && (
            <p className={`mt-6 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setLocalError(null);
                  setPassword('');
                }}
                className="text-indigo-500 hover:underline font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}

          <p className={`mt-4 text-center text-xs leading-5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Google and GitHub passwords are never shared with VeritasAI. Local-account passwords are stored only as secure hashes.
          </p>
        </div>
      </main>

      <footer className="w-full text-center py-4 z-10 text-xs opacity-60">
        © {new Date().getFullYear()} VeritasAI. All rights reserved.
      </footer>
    </div>
  );
};
