'use client';

import { Link2, Globe, LogIn, LogOut } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { useAuthContext } from '@/lib/auth-context';

export function Header() {
  const { locale, setLocale, t } = useI18n();
  const { auth, logout, openAuthModal } = useAuthContext();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'pt' : 'en');
  };

  return (
    <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Link2 className="w-5 h-5 text-brand" /> URL Shortener
      </h1>
      <div className="flex items-center gap-4">
        {auth ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              {t.hello}, <span className="text-slate-100">{auth.email}</span>
            </span>
            <button
              onClick={logout}
              className="text-sm text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> {t.logout}
            </button>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="text-sm text-slate-300 hover:text-white flex items-center gap-1.5 bg-brand/20 hover:bg-brand/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" /> {t.signIn}
          </button>
        )}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          title={locale === 'en' ? 'Mudar para Português' : 'Switch to English'}
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase font-medium">{locale}</span>
        </button>
      </div>
    </header>
  );
}
