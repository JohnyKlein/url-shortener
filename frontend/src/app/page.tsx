'use client';

import { FormEvent, useState } from 'react';
import { api, ShortUrl } from '@/lib/api';
import { useAuth, useUrls } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n-context';
import { Link, LogOut, Scissors, Trash2, ExternalLink, Loader2 } from 'lucide-react';

export default function Home() {
  const { auth, loading, login, register, logout } = useAuth();
  const { urls, error, setError, addUrls, removeUrl, incrementHits } = useUrls(auth?.accessToken);
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="space-y-8">
        <ShortenForm
          token={null}
          onCreated={addUrls}
          onError={setError}
        />
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        {urls.length > 0 && (
          <PreviewList urls={urls} />
        )}
        <AuthForm onLogin={login} onRegister={register} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-400">
          {t.hello}, <span className="text-slate-100">{auth.email}</span>
        </p>
        <button onClick={logout} className="text-sm text-slate-400 hover:text-red-400 flex items-center gap-1">
          <LogOut className="w-3.5 h-3.5" /> {t.logout}
        </button>
      </div>

      <ShortenForm
        token={auth.accessToken}
        onCreated={addUrls}
        onError={setError}
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <UrlTable
        urls={urls}
        token={auth.accessToken}
        onDeleted={removeUrl}
        onError={setError}
        onLinkClick={incrementHits}
      />
    </div>
  );
}

function PreviewList({ urls }: { urls: ShortUrl[] }) {
  const { t } = useI18n();
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg space-y-3">
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm px-3 py-2 rounded">
        {t.previewNotice}
      </div>
      <ul className="space-y-2 text-sm">
        {urls.map(u => (
          <li key={u.shortCode} className="flex items-center justify-between border-t border-slate-800 pt-2">
            <span className="text-slate-400 truncate max-w-[60%]" title={u.originalUrl}>{u.originalUrl}</span>
            <span className="inline-flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{t.previewBadge}</span>
              <span className="text-brand font-mono">{u.shortCode}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuthForm({ onLogin, onRegister }: {
  onLogin: (email: string, password: string) => Promise<unknown>;
  onRegister: (email: string, password: string) => Promise<unknown>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useI18n();

  const handleSubmit = async (mode: 'login' | 'register') => {
    setError(null);
    setSubmitting(true);
    try {
      await (mode === 'login' ? onLogin(email, password) : onRegister(email, password));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.authFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-xl shadow-lg space-y-4">
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
  );
}

function ShortenForm({ token, onCreated, onError }: {
  token: string | null;
  onCreated: (urls: ShortUrl[]) => void;
  onError: (msg: string | null) => void;
}) {
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { t } = useI18n();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onError(null);
    setSubmitting(true);
    try {
      const created = await api.shorten(token, [{ url: url.trim() }]);
      onCreated(created);
      setUrl('');
    } catch (e: unknown) {
      onError(e instanceof Error ? e.message : t.shortenFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-xl shadow-lg space-y-3">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Scissors className="w-5 h-5 text-brand" /> {t.shortenUrl}
      </h2>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-slate-800 px-3 py-2 rounded outline-none focus:ring-2 ring-brand"
          placeholder={t.placeholder}
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand hover:bg-brand-dark px-4 py-2 rounded font-medium disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t.shorten}
        </button>
      </div>
    </form>
  );
}

function UrlTable({ urls, token, onDeleted, onError, onLinkClick }: {
  urls: ShortUrl[];
  token: string;
  onDeleted: (shortCode: string) => void;
  onError: (msg: string | null) => void;
  onLinkClick: (shortCode: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { t } = useI18n();

  const handleDelete = async (shortCode: string) => {
    onError(null);
    setDeleting(shortCode);
    try {
      await api.deleteUrl(token, shortCode);
      onDeleted(shortCode);
    } catch (e: unknown) {
      onError(e instanceof Error ? e.message : t.deleteFailed);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Link className="w-5 h-5 text-brand" /> {t.yourUrls}
      </h2>
      {urls.length === 0 ? (
        <p className="text-slate-500 text-sm">{t.noUrls}</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-slate-400 text-left">
            <tr>
              <th className="py-2">{t.short}</th>
              <th>{t.original}</th>
              <th className="text-right">{t.hits}</th>
              <th className="text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {urls.map(u => (
              <tr key={u.shortCode} className="border-t border-slate-800">
                <td className="py-2">
                  <a
                    className="text-brand hover:underline inline-flex items-center gap-1"
                    href={u.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onLinkClick(u.shortCode)}
                  >
                    {u.shortCode} <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="truncate max-w-xs" title={u.originalUrl}>{u.originalUrl}</td>
                <td className="text-right tabular-nums">{u.hits}</td>
                <td className="text-right">
                  {deleting === u.shortCode ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400 inline" />
                  ) : confirmDelete === u.shortCode ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="text-xs text-slate-400">{t.confirmDelete}</span>
                      <button
                        onClick={() => handleDelete(u.shortCode)}
                        className="text-red-400 hover:text-red-300 text-xs font-medium"
                      >
                        {t.yes}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-slate-400 hover:text-slate-300 text-xs font-medium"
                      >
                        {t.no}
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(u.shortCode)}
                      className="text-red-400 hover:text-red-300"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
