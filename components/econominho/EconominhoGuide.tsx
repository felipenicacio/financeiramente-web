import type { ReactNode } from 'react';

import type { GuideState } from '@/lib/content/types';
import { t } from '@/lib/content/ui';

import { econominhoAssets } from './assets';

type Props = {
  /** Fala editorial vinda do conteúdo (módulo/lição → guide). */
  text: string;
  state: GuideState;
  /** `bubble`: balão destacado (aberturas). `inline`: discreto, dentro da lição. */
  variant?: 'bubble' | 'inline';
  /** Espaço reservado para sobrepor a arte padrão por um asset específico. */
  avatar?: ReactNode;
  className?: string;
};

/**
 * Econominho, o guia pedagógico (personagem oficial aprovado, assets individuais v2).
 * Só função pedagógica: perguntar, apresentar descobertas, comparar, explicar
 * consequências, resumir e provocar reflexão. Nunca dá ordens financeiras.
 */
export function EconominhoGuide({
  text,
  state,
  variant = 'inline',
  avatar,
  className = '',
}: Props) {
  const size = variant === 'bubble' ? 'size-14' : 'size-11';

  return (
    <figure data-guide-state={state} className={`flex items-start gap-3 ${className}`}>
      <span
        className={`${size} shrink-0 overflow-hidden rounded-full bg-accent-soft ring-1 ring-inset ring-accent-tint`}
      >
        {avatar ?? (
          // eslint-disable-next-line @next/next/no-img-element -- arte local e estática
          <img
            src={econominhoAssets.avatar(state)}
            alt=""
            width={120}
            height={120}
            className="size-full object-cover object-top"
            decoding="async"
          />
        )}
      </span>
      <figcaption
        className={
          'relative min-w-0 flex-1 rounded-card rounded-tl-md px-4 py-3 ' +
          (variant === 'bubble' ? 'bg-surface shadow-card' : 'bg-accent-soft')
        }
      >
        <span className="block text-caption font-semibold text-accent-strong">
          {t('guideName')}
        </span>
        <span className={variant === 'bubble' ? 'text-lead font-medium' : 'font-medium'}>
          {text}
        </span>
      </figcaption>
    </figure>
  );
}
