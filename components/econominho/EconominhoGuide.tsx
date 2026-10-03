import type { ReactNode } from 'react';

import type { GuideState } from '@/lib/content/types';
import { t } from '@/lib/content/ui';

import { econominhoAssets, guideStatePresentation } from './assets';

type Props = {
  /** Fala editorial vinda do conteúdo (module.json → guide). */
  text: string;
  state: GuideState;
  /** `bubble`: balão destacado (aberturas). `inline`: discreto, dentro da lição. */
  variant?: 'bubble' | 'inline';
  /** Espaço reservado para a arte aprovada; sobrepõe o marcador neutro. */
  avatar?: ReactNode;
  className?: string;
};

/**
 * Econominho, o guia pedagógico. Nesta etapa só a função editorial está
 * implementada: perguntar, apresentar descobertas, ajudar a comparar,
 * explicar consequências, resumir e estimular reflexão.
 *
 * VISUAL DO PERSONAGEM — PENDENTE DE APROVAÇÃO: o avatar é um marcador
 * neutro (balão de fala). Ver components/econominho/assets.ts.
 */
export function EconominhoGuide({
  text,
  state,
  variant = 'inline',
  avatar,
  className = '',
}: Props) {
  const presentation = guideStatePresentation[state];
  const src = econominhoAssets.enabled ? econominhoAssets.avatar[state] : undefined;
  const size = variant === 'bubble' ? 'size-12' : 'size-10';

  return (
    <figure
      data-guide-state={state}
      data-guide-pose={presentation.pose}
      data-guide-expression={presentation.expression}
      className={`flex items-start gap-3 ${className}`}
    >
      <span className={`${size} shrink-0`}>
        {avatar ??
          (src ? (
            // eslint-disable-next-line @next/next/no-img-element -- arte local e estática
            <img src={src} alt="" className="size-full" />
          ) : (
            <GuidePlaceholder />
          ))}
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

/** Marcador neutro e provisório: círculo com balão de fala. Não é o personagem. */
function GuidePlaceholder() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden focusable={false}>
      <circle cx={24} cy={24} r={23} fill="var(--accent-tint)" />
      <circle
        cx={24}
        cy={24}
        r={22}
        fill="none"
        stroke="var(--accent-strong)"
        strokeWidth={1.5}
        strokeDasharray="3 4"
      />
      <path
        d="M15 17h18a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-9l-5 4v-4h-4a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Z"
        fill="var(--accent-strong)"
      />
      <circle cx={19.5} cy={24} r={1.6} fill="white" />
      <circle cx={24} cy={24} r={1.6} fill="white" />
      <circle cx={28.5} cy={24} r={1.6} fill="white" />
    </svg>
  );
}
