'use client';

import { Link2, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { Locale } from '@/lib/i18n';

export function Header() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'pt' : 'en');
  };

  return (
    <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Link2 className="w-5 h-5 text-brand" /> URL Shortener
      </h1>
      <button
        onClick={toggleLocale}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        title={locale === 'en' ? 'Mudar para Português' : 'Switch to English'}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase font-medium">{locale}</span>
      </button>
    </header>
  );
}
