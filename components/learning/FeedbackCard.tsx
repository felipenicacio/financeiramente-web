'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';

type Props = {
  tone: 'positive' | 'guide' | 'neutral';
  title: string;
  body: string;
  note?: { title: string; body: string };
  /** Números calculados que explicam o retorno (preços, troco, diferença). */
  facts?: ReactNode;
};

/**
 * Retorno imediato depois de uma escolha. Em atividades objetivas (quiz,
 * trueFalse, classify, compare, afford, change, ordering) o título sempre
 * diz com clareza se a resposta está certa ou errada — sem usar "errado"
 * de um jeito humilhante, mas também sem disfarçar o erro com um tom
 * acolhedor demais, o que geraria contradição com o `body` (ver
 * docs/editorial-guidelines.md). Em escolhas reflexivas (`choice`), onde
 * toda opção é válida, o tom é sempre neutro (`anyAnswer`), nunca de
 * certo/errado. role="status" faz o leitor de tela anunciar o retorno.
 */
export function FeedbackCard({ tone, title, body, note, facts }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // O retorno aparece abaixo das alternativas: traz para a área visível,
  // acima do rodapé fixo, sem animação se o sistema pedir menos movimento.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ref.current?.scrollIntoView?.({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      className={`tone-${tone} animate-enter scroll-mb-40 rounded-card bg-(--tone-soft) p-5 ring-1 ring-inset ring-(--tone-tint)`}
    >
      <p className="flex items-center gap-2 text-lead font-semibold text-(--tone-strong)">
        <Icon name={tone === 'positive' ? 'check' : 'info'} className="size-5 shrink-0" />
        {title}
      </p>
      <p className="mt-1.5">{body}</p>
      {facts ? <div className="mt-4">{facts}</div> : null}
      {note ? (
        <div className="mt-4 rounded-control bg-surface/80 p-4">
          <p className="text-label font-semibold">{note.title}</p>
          <p className="mt-1 text-label text-ink-soft">{note.body}</p>
        </div>
      ) : null}
    </div>
  );
}
