'use client';

import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ConceptIcon } from '@/components/illustrations';
import { Icon } from '@/components/ui/Icon';
import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import type { Module } from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';
import { moduleKey, useSession } from '@/lib/session/SessionProvider';

import { LessonShell, ScreenTitle } from './LessonShell';
import { screensForObject, type Screen } from './LessonRunner';

type Nav = {
  nextModule: { cycle: string; id: string; title: string } | null;
  cycleSummary: string | null;
};

type Props = {
  cycle: string;
  moduleId: string;
  stepLabels: string[];
  currentStep: number;
  module: Module;
  nav: Nav;
};

/** Marca o módulo como concluído nesta visita assim que o fechamento abre. */
function useMarkDone(cycle: string, moduleId: string) {
  const { markModuleDone } = useSession();
  useEffect(() => {
    markModuleDone(moduleKey(cycle, moduleId));
  }, [cycle, moduleId, markModuleDone]);
}

function ConclusionView({ module }: { module: Module }) {
  return (
    <section className="flex flex-col gap-5">
      <p className="text-label font-semibold text-accent-strong">{t('closingRecapTitle')}</p>
      <ScreenTitle>{module.conclusion.title}</ScreenTitle>
      <EconominhoGuide variant="bubble" state="summary" text={module.conclusion.message} />
      <ul className="flex flex-col gap-3">
        {module.conclusion.recap.map((item) => (
          <li
            key={item.text}
            className={`tone-${item.tone} flex items-center gap-3 rounded-card bg-(--tone-soft) p-4`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)">
              <ConceptIcon icon={item.icon} className="size-6" />
            </span>
            <span className="font-medium">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Fechamento do módulo: avaliação integradora + síntese "O que descobrimos?". */
export function ModuleClosing({ cycle, moduleId, stepLabels, currentStep, module, nav }: Props) {
  useMarkDone(cycle, moduleId);

  const screens = useMemo<Screen[]>(() => {
    const activity = screensForObject(module.integrative.object, `${cycle}-${moduleId}-atividade`);
    const conclusion: Screen = {
      key: 'descobrimos',
      interactive: false,
      summary: true,
      render: () => <ConclusionView module={module} />,
    };
    return [...activity, conclusion];
  }, [module, cycle, moduleId]);

  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(() => !screens[0]!.interactive);

  const screen = screens[index]!;

  const goNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= screens.length) return;
    setIndex(nextIndex);
    setUnlocked(!screens[nextIndex]!.interactive);
  };

  const linkClass =
    'inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-6 text-lead font-semibold transition-transform active:scale-[0.99]';

  let footer: ReactNode;
  if (screen.summary) {
    const links: ReactNode[] = [];
    if (nav.nextModule) {
      links.push(
        <Link
          key="next"
          href={routes.module(nav.nextModule.cycle, nav.nextModule.id)}
          className={`${linkClass} bg-accent-strong text-white`}
        >
          {t('doneNextModule')}
          <Icon name="arrow-right" className="size-5" />
        </Link>,
      );
    }
    if (nav.cycleSummary) {
      links.push(
        <Link
          key="summary"
          href={nav.cycleSummary}
          className={`${linkClass} ${nav.nextModule ? 'bg-surface text-ink ring-2 ring-inset ring-line' : 'bg-accent-strong text-white'}`}
        >
          {t('doneCycleSummary')}
        </Link>,
      );
    }
    links.push(
      <Link
        key="journey"
        href={routes.cycle(cycle)}
        className={
          links.length === 0
            ? `${linkClass} bg-accent-strong text-white`
            : 'inline-flex min-h-13 items-center justify-center px-5 text-label font-semibold text-ink-soft hover:text-ink'
        }
      >
        {t('doneBackToJourney')}
      </Link>,
    );
    footer = <>{links}</>;
  } else {
    footer = (
      <button
        type="button"
        disabled={!unlocked}
        onClick={goNext}
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-accent-strong px-6 text-lead font-semibold text-white transition-[transform,opacity] active:scale-[0.99] disabled:opacity-40"
      >
        {t('continue')}
        <Icon name="arrow-right" className="size-5" />
      </button>
    );
  }

  return (
    <LessonShell
      cycle={cycle}
      moduleId={moduleId}
      stepLabels={stepLabels}
      currentStep={currentStep}
      screenKey={`fechamento-${screen.key}`}
      footer={footer}
    >
      {index === 0 ? (
        <header className="flex flex-col gap-2">
          <p className="text-caption font-semibold uppercase tracking-wide text-accent-strong">
            {t('closingEyebrow')}
          </p>
          <ScreenTitle>{module.integrative.title}</ScreenTitle>
          <p className="text-lead text-ink-soft">{module.integrative.intro}</p>
        </header>
      ) : null}
      <Fragment key={screen.key}>{screen.render({ onComplete: () => setUnlocked(true) })}</Fragment>
    </LessonShell>
  );
}
