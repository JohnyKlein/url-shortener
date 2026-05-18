'use client';

import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export function Disclaimer() {
  const { t } = useI18n();

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-start gap-3 text-sm text-yellow-300">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-400" />
      <span>
        <span className="font-semibold">{t.disclaimerTitle}:</span>{' '}
        {t.disclaimerText}
      </span>
    </div>
  );
}
