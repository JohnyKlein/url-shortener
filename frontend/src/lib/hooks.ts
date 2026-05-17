'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, AuthResponse, ShortUrl } from '@/lib/api';

const AUTH_STORAGE_KEY = 'auth';

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
    if (!token) return;
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
    setUrls(prev => [...newUrls, ...prev]);
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
