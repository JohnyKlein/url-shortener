'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, AuthResponse, ShortUrl } from '@/lib/api';

const AUTH_STORAGE_KEY = 'auth';
const PREVIEW_STORAGE_KEY = 'previewUrls';

function getStoredAuth(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthResponse;
    if (!parsed.accessToken) return null;
    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function getStoredPreviews(): ShortUrl[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShortUrl[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(PREVIEW_STORAGE_KEY);
    return [];
  }
}

function storePreviews(urls: ShortUrl[]): void {
  if (typeof window === 'undefined') return;
  if (urls.length === 0) {
    localStorage.removeItem(PREVIEW_STORAGE_KEY);
  } else {
    localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(urls));
  }
}

export function usePreviewUrls() {
  const [previews, setPreviews] = useState<ShortUrl[]>([]);

  useEffect(() => {
    setPreviews(getStoredPreviews());
  }, []);

  const addPreviews = useCallback((newUrls: ShortUrl[]) => {
    setPreviews(prev => {
      const next = [...newUrls, ...prev];
      storePreviews(next);
      return next;
    });
  }, []);

  const removePreview = useCallback((shortCode: string) => {
    setPreviews(prev => {
      const next = prev.filter(u => u.shortCode !== shortCode);
      storePreviews(next);
      return next;
    });
  }, []);

  const clearPreviews = useCallback(() => {
    setPreviews([]);
    storePreviews([]);
  }, []);

  return { previews, addPreviews, removePreview, clearPreviews };
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuth(getStoredAuth());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res));
    setAuth(res);
    return res;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await api.register(email, password);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res));
    setAuth(res);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  }, []);

  return { auth, loading, login, register, logout };
}

export function useUrls(token: string | undefined) {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUrls = useCallback(async () => {
    if (!token) {
      setUrls([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.myUrls(token);
      setUrls(data);
      setError(null);
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 401) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        window.location.reload();
        return;
      }
      setError(e instanceof Error ? e.message : 'Failed to load URLs');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const addUrls = useCallback((newUrls: ShortUrl[]) => {
    setUrls(prev => {
      const map = new Map<string, ShortUrl>();
      [...newUrls, ...prev].forEach(u => map.set(u.shortCode, u));
      return Array.from(map.values());
    });
  }, []);

  const removeUrl = useCallback((shortCode: string) => {
    setUrls(prev => prev.filter(u => u.shortCode !== shortCode));
  }, []);

  const incrementHits = useCallback((shortCode: string) => {
    setUrls(prev => prev.map(u =>
      u.shortCode === shortCode ? { ...u, hits: u.hits + 1 } : u
    ));
  }, []);

  return { urls, error, isLoading, setError, addUrls, removeUrl, incrementHits, refetch: fetchUrls };
}
