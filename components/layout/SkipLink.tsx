import { t } from '@/lib/content/ui';

/** Primeiro elemento focável: leva direto ao conteúdo principal. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-label font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t('skipToContent')}
    </a>
  );
}
