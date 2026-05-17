'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import { Loader2, X } from 'lucide-react';

export function AuthModal() {
  const { showAuthModal, closeAuthModal, login, register } = useAuthContext();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!showAuthModal) {
      setEmail('');
      setPassword('');
      setError(null);
      setSubmitting(false);
    }
  }, [showAuthModal]);

  useEffect(() => {
    if (!showAuthModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showAuthModal, closeAuthModal]);

  if (!showAuthModal) return null;

  const handleSubmit = async (mode: 'login' | 'register') => {
    setError(null);
    setSubmitting(true);
    try {
      await (mode === 'login' ? login(email, password) : register(email, password));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.authFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      <div className="relative w-full max-w-md bg-slate-900 p-6 rounded-xl shadow-2xl space-y-4 mx-4">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold">{t.signIn}</h2>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <input
          className="w-full bg-slate-800 px-3 py-2 rounded outline-none focus:ring-2 ring-brand"
          placeholder={t.email}
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={submitting}
        />
        <input
          className="w-full bg-slate-800 px-3 py-2 rounded outline-none focus:ring-2 ring-brand"
          type="password"
          placeholder={t.password}
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={submitting}
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit('login')}
            disabled={submitting}
            className="flex-1 bg-brand hover:bg-brand-dark py-2 rounded font-medium disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : t.login}
          </button>
          <button
            onClick={() => handleSubmit('register')}
            disabled={submitting}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded font-medium disabled:opacity-50"
          >
            {t.register}
          </button>
        </div>
      </div>
    </div>
  );
}
