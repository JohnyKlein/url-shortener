'use client';

import { useI18n } from '@/lib/i18n-context';

export function Footer() {
  const { t } = useI18n();

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 px-6 py-3 text-center text-xs text-slate-500">
      {t.footer} &copy; {year}{' '}
      <a
        href="https://johnyklein.com"
        target="_blank"
        rel="noreferrer"
        className="text-slate-400 hover:text-slate-200 underline"
      >
        Johny
      </a>
    </footer>
  );
}
