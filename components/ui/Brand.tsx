import { t } from '@/lib/content/ui';

/**
 * Marca: três pedras em subida (um caminho de escolhas) + nome.
 * As cores das pedras são as três categorias do primeiro módulo.
 */
export function BrandMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable={false}>
      <rect width="32" height="32" rx="9" fill="#0F172A" />
      <ellipse cx="9" cy="23" rx="4.5" ry="2.6" fill="#14B8A6" />
      <ellipse cx="16" cy="17" rx="4.5" ry="2.6" fill="#FB7185" />
      <ellipse cx="23" cy="11" rx="4.5" ry="2.6" fill="#F59E0B" />
    </svg>
  );
}

export function Brand() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BrandMark />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
        {t('appName')}
      </span>
    </span>
  );
}
