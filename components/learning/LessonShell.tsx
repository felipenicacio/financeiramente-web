'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';

import { ProgressIndicator } from './ProgressIndicator';

type Props = {
  cycle: string;
  moduleId: string;
  /** Rótulos de todas as etapas do módulo (5 lições + fechamento). */
  stepLabels: string[];
  currentStep: number;
  /**
   * Muda a cada tela interna (objeto da lição). Na mudança, a página volta ao
   * topo e o foco vai para o título, para quem navega por teclado ou leitor.
   */
  screenKey: string;
  footer: ReactNode;
  children: ReactNode;
};

/** Estrutura comum de toda lição: progresso, uma tela por objeto e ações fixas no rodapé. */
export function LessonShell({
  cycle,
  moduleId,
  stepLabels,
  currentStep,
  screenKey,
  footer,
  children,
}: Props) {
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current
      ?.querySelector<HTMLElement>('[data-screen-title]')
      ?.focus({ preventScroll: true });
  }, [screenKey]);

  return (
    <div data-cycle={cycle} className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 w-full max-w-[40rem] items-center gap-3 px-4 sm:px-6">
          <Link
            href={routes.module(cycle, moduleId)}
            aria-label={t('close')}
            className="grid size-11 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-slate-100"
          >
            <Icon name="close" className="size-6" />
          </Link>
          <ProgressIndicator labels={stepLabels} current={currentStep} />
        </div>
      </header>

      <main
        id="conteudo"
        ref={mainRef}
        className="mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6"
      >
        {children}
      </main>

      <nav
        aria-label={t('stepActions')}
        className="sticky bottom-0 z-20 border-t border-line/70 bg-background/95 backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-[40rem] flex-row-reverse flex-wrap gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 [&>*:first-child]:min-w-[11rem] [&>*:first-child]:flex-1 [&>*:not(:first-child)]:px-5">
          {footer}
        </div>
      </nav>
    </div>
  );
}

/** Título de cada tela. Recebe o foco quando a tela muda. */
export function ScreenTitle({
  children,
  as: Tag = 'h1',
}: {
  children: ReactNode;
  as?: 'h1' | 'h2';
}) {
  return (
    <Tag
      data-screen-title
      tabIndex={-1}
      className="text-title font-semibold tracking-[-0.02em] outline-none"
    >
      {children}
    </Tag>
  );
}
