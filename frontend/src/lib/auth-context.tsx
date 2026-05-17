'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AuthResponse } from '@/lib/api';
import { useAuth } from '@/lib/hooks';

interface AuthContextValue {
  auth: AuthResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, loading, login: doLogin, register: doRegister, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = useCallback(() => setShowAuthModal(true), []);
  const closeAuthModal = useCallback(() => setShowAuthModal(false), []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await doLogin(email, password);
    closeAuthModal();
    return res;
  }, [doLogin, closeAuthModal]);

  const register = useCallback(async (email: string, password: string) => {
    const res = await doRegister(email, password);
    closeAuthModal();
    return res;
  }, [doRegister, closeAuthModal]);

  return (
    <AuthContext.Provider value={{
      auth, loading, login, register, logout,
      showAuthModal, openAuthModal, closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
