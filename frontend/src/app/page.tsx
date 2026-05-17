'use client';

import { FormEvent, useState } from 'react';
import { api, ShortUrl } from '@/lib/api';
import { usePreviewUrls, useUrls } from '@/lib/hooks';
import { useAuthContext } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import { Link, Scissors, Trash2, ExternalLink, Loader2, Save, X } from 'lucide-react';

export default function Home() {
  const { auth, loading } = useAuthContext();
  const { urls, error, setError, addUrls, removeUrl, incrementHits } = useUrls(auth?.accessToken);
  const { previews, addPreviews, removePreview, clearPreviews } = usePreviewUrls();
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
          onCreated={addPreviews}
          onError={setError}
        />
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        {previews.length > 0 && (
          <PreviewList urls={previews} onDiscard={removePreview} />
        )}
      </div>
    );
  }

  const handleSavePreview = async (preview: ShortUrl) => {
    setError(null);
    try {
      const created = await api.shorten(auth.accessToken, [{ url: preview.originalUrl }]);
      addUrls(created);
      removePreview(preview.shortCode);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.saveFailed);
      throw e;
    }
  };

  const handleSaveAllPreviews = async () => {
    if (previews.length === 0) return;
    setError(null);
    try {
      const created = await api.shorten(
        auth.accessToken,
        previews.map(p => ({ url: p.originalUrl }))
      );
      addUrls(created);
      clearPreviews();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.saveFailed);
    }
  };

  return (
    <div className="space-y-8">
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

      {previews.length > 0 && (
        <PendingPreviewList
          urls={previews}
          onSave={handleSavePreview}
          onDiscard={removePreview}
          onSaveAll={handleSaveAllPreviews}
        />
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

function PreviewList({ urls, onDiscard }: { urls: ShortUrl[]; onDiscard: (shortCode: string) => void }) {
  const { t } = useI18n();
  const { openAuthModal } = useAuthContext();
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg space-y-3">
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm px-3 py-2 rounded">
        {t.previewNoticeStart}{' '}
        <button
          onClick={openAuthModal}
          className="underline text-amber-200 hover:text-amber-100 font-medium"
        >
          {t.signIn}
        </button>{' '}
        {t.previewNoticeEnd}
      </div>
      <ul className="space-y-2 text-sm">
        {urls.map(u => (
          <li key={u.shortCode} className="flex items-center justify-between border-t border-slate-800 pt-2 gap-2">
            <span className="text-slate-400 truncate max-w-[55%]" title={u.originalUrl}>{u.originalUrl}</span>
            <span className="inline-flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{t.previewBadge}</span>
              <span className="text-brand font-mono">{u.shortCode}</span>
              <button
                onClick={() => onDiscard(u.shortCode)}
                className="text-slate-400 hover:text-red-400"
                title={t.discard}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PendingPreviewList({ urls, onSave, onDiscard, onSaveAll }: {
  urls: ShortUrl[];
  onSave: (preview: ShortUrl) => Promise<void>;
  onDiscard: (shortCode: string) => void;
  onSaveAll: () => Promise<void>;
}) {
  const { t } = useI18n();
  const [saving, setSaving] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  const handleSave = async (preview: ShortUrl) => {
    setSaving(preview.shortCode);
    try {
      await onSave(preview);
    } catch {
      // error surfaced by parent
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      await onSaveAll();
    } finally {
      setSavingAll(false);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{t.pendingPreviews}</h2>
        {urls.length > 1 && (
          <button
            onClick={handleSaveAll}
            disabled={savingAll}
            className="text-xs bg-brand hover:bg-brand-dark disabled:opacity-50 px-3 py-1.5 rounded font-medium inline-flex items-center gap-1"
          >
            {savingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {t.saveAll}
          </button>
        )}
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm px-3 py-2 rounded">
        {t.pendingPreviewsNotice}
      </div>
      <ul className="space-y-2 text-sm">
        {urls.map(u => (
          <li key={u.shortCode} className="flex items-center justify-between border-t border-slate-800 pt-2 gap-2">
            <span className="text-slate-400 truncate max-w-[50%]" title={u.originalUrl}>{u.originalUrl}</span>
            <span className="inline-flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{t.previewBadge}</span>
              <span className="text-brand font-mono">{u.shortCode}</span>
              <button
                onClick={() => handleSave(u)}
                disabled={saving === u.shortCode || savingAll}
                className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                title={t.save}
              >
                {saving === u.shortCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onDiscard(u.shortCode)}
                disabled={saving === u.shortCode || savingAll}
                className="text-slate-400 hover:text-red-400 disabled:opacity-50"
                title={t.discard}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          </li>
        ))}
      </ul>
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
