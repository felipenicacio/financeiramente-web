'use client';

import { useEffect } from 'react';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import { ConceptIcon, Illustration } from '@/components/illustrations';
import { ButtonLink } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';
import { moduleKey, useSession } from '@/lib/session/SessionProvider';

import { LessonShell, ScreenTitle } from '../LessonShell';
import type { StepProps } from './types';

/** Conclusão: mensagem central, resumo do módulo e próximos caminhos (sem pontos nem placar). */
export function DoneStep({ bundle, nav }: StepProps) {
  const { module } = bundle;
  const { markModuleDone } = useSession();

  useEffect(() => {
    markModuleDone(moduleKey(module.cycle, module.id));
  }, [markModuleDone, module.cycle, module.id]);

  const primary = nav?.nextModule
    ? { href: routes.module(module.cycle, nav.nextModule.id), label: t('doneNextModule') }
    : nav?.hasCycleSummary
      ? { href: routes.cycleSummary(module.cycle), label: t('doneCycleSummary') }
      : { href: routes.journeys(module.cycle), label: t('doneBackToJourney') };

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="done"
      screenKey="done"
      footer={
        <>
          <ButtonLink href={primary.href} icon="arrow-right">
            {primary.label}
          </ButtonLink>
          {primary.href !== routes.journeys(module.cycle) ? (
            <ButtonLink href={routes.journeys(module.cycle)} variant="secondary">
              {t('doneBackToJourney')}
            </ButtonLink>
          ) : null}
        </>
      }
    >
      <div className="animate-enter flex flex-col items-center gap-3 text-center">
        <Illustration name="done-path" className="w-56 animate-pop" />
        <ScreenTitle>{module.conclusion.title}</ScreenTitle>
        <p className="text-lead text-ink-soft">{module.conclusion.message}</p>
      </div>

      <blockquote className="rounded-hero bg-ink px-6 py-5 text-center text-lead font-semibold text-white">
        {module.centralMessage}
      </blockquote>

      <EconominhoGuide state={module.guide.done.state} text={module.guide.done.text} />

      <section aria-labelledby="resumo" className="flex flex-col gap-3">
        <h2 id="resumo" className="text-heading font-semibold">
          {t('rememberTitle')}
        </h2>
        <ul className="flex flex-col gap-2">
          {module.conclusion.recap.map((entry) => (
            <li
              key={entry.text}
              className={`tone-${entry.tone} flex items-center gap-3 rounded-card bg-(--tone-soft) p-3 pr-4`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)">
                <ConceptIcon icon={entry.icon} className="size-6" />
              </span>
              <span className="font-medium">{entry.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <ButtonLink
        href={routes.lesson(module.cycle, module.id, 'historia')}
        variant="quiet"
        icon="refresh"
        iconPosition="start"
        className="self-center"
      >
        {t('doneRestart')}
      </ButtonLink>
    </LessonShell>
  );
}
