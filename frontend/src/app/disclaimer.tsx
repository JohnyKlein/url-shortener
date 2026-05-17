'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export function Disclaimer() {
  const [visible, setVisible] = useState(true);
  const { t } = useI18n();

  if (!visible) return null;

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-start gap-3 text-sm text-yellow-300">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-400" />
      <span>
        <span className="font-semibold">{t.disclaimerTitle}:</span>{' '}
        {t.disclaimerText}
      </span>
      <button
        onClick={() => setVisible(false)}
        className="ml-auto shrink-0 text-yellow-400 hover:text-yellow-200"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
