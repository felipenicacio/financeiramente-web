import { publicAsset } from '@/lib/asset';
import { t } from '@/lib/content/ui';

/**
 * Marca Econominho (pacote econominho-assets-v1, arquivos de marca provisórios
 * aprovados para uso técnico).
 *
 * - BrandMark: ícone "E" com raios, vetorial e inline (sem requisição).
 * - Brand: logotipo "Econominho" (public/brand/econominho-wordmark.png).
 */
export const brandColors = { navy: '#0B3B75', amber: '#FFC83D' } as const;

export function BrandMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden focusable={false}>
      <rect width="256" height="256" rx="58" fill={brandColors.navy} />
      <g fill={brandColors.amber}>
        <rect x="78" y="24" width="14" height="40" rx="7" transform="rotate(-28 85 44)" />
        <rect x="121" y="16" width="14" height="44" rx="7" />
        <rect x="164" y="24" width="14" height="40" rx="7" transform="rotate(28 171 44)" />
        <path d="M78 82h101v31h-63v24h55v29h-55v27h66v31H78z" />
      </g>
    </svg>
  );
}

export function Brand({ className = 'h-9' }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <BrandMark className="size-9 shrink-0 sm:size-10" />
      {/* eslint-disable-next-line @next/next/no-img-element -- exportação estática, arquivo local */}
      <img
        src={publicAsset('/brand/econominho-wordmark.png')}
        alt={t('appName')}
        width={1123}
        height={252}
        className={`${className} w-auto`}
        decoding="async"
      />
    </span>
  );
}
