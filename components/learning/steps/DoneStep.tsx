'use client';

import { useEffect } from 'react';

import { CategoryIcon, Illustration } from '@/components/illustrations';
import { ButtonLink } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';
import { moduleKey, useSession } from '@/lib/session/SessionProvider';

import { LessonShell, ScreenTitle } from '../LessonShell';
import type { StepProps } from './types';

/** Conclusão: mensagem central, resumo das três categorias e próximos caminhos. */
export function DoneStep({ bundle }: StepProps) {
  const { module } = bundle;
  const { markModuleDone } = useSession();

  useEffect(() => {
    markModuleDone(moduleKey(module.cycle, module.id));
  }, [markModuleDone, module.cycle, module.id]);

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="done"
      screenKey="done"
      footer={
        <>
          <ButtonLink href={routes.journeys(module.cycle)} icon="arrow-right">
            {t('doneBackToJourney')}
          </ButtonLink>
          <ButtonLink
            href={routes.lesson(module.cycle, module.id, 'historia')}
            variant="secondary"
            icon="refresh"
            iconPosition="start"
          >
            {t('doneRestart')}
          </ButtonLink>
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

      <section aria-labelledby="resumo" className="flex flex-col gap-3">
        <h2 id="resumo" className="text-heading font-semibold">
          {t('rememberTitle')}
        </h2>
        <ul className="flex flex-col gap-2">
          {module.conclusion.recap.map((entry) => (
            <li
              key={entry.category}
              className={`tone-${entry.category} flex items-center gap-3 rounded-card bg-(--tone-soft) p-3 pr-4`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)">
                <CategoryIcon category={entry.category} className="size-6" />
              </span>
              <span className="font-medium">{entry.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </LessonShell>
  );
}
