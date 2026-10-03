'use client';

import { useState } from 'react';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import { Illustration } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';

import { ConceptCard } from '../ConceptCard';
import { LessonShell, ScreenTitle } from '../LessonShell';
import type { StepProps } from './types';
import { useLessonNav } from './useLessonNav';

/** Conceito: uma categoria por tela e, por fim, a ideia-chave (o contexto muda tudo). */
export function ConceptStep({ bundle }: StepProps) {
  const { module, infographic } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'concept');
  const [page, setPage] = useState(0);
  const total = infographic.concepts.length + 1;
  const concept = infographic.concepts[page];
  const isLast = page === total - 1;

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="concept"
      screenKey={`concept-${page}`}
      footer={
        <>
          <Button
            icon="arrow-right"
            onClick={isLast ? goNext : () => setPage((value) => value + 1)}
          >
            {isLast ? t('continue') : t('next')}
          </Button>
          {page > 0 ? (
            <Button
              variant="secondary"
              icon="arrow-left"
              iconPosition="start"
              onClick={() => setPage((value) => value - 1)}
            >
              {t('back')}
            </Button>
          ) : null}
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <ScreenTitle>{infographic.title}</ScreenTitle>
        {page === 0 ? <p className="text-ink-soft">{infographic.intro}</p> : null}
        {page === 0 ? (
          <EconominhoGuide
            state={module.guide.concept.state}
            text={module.guide.concept.text}
            className="mt-2"
          />
        ) : null}
      </div>

      <PageDots current={page} total={total} />

      {concept ? (
        <ConceptCard key={concept.id} concept={concept} />
      ) : (
        <div className="animate-enter-side flex flex-col items-center gap-4 rounded-hero bg-surface p-6 text-center shadow-card">
          <p className="text-label font-semibold text-accent-strong">{t('rememberTitle')}</p>
          <Illustration name={infographic.keyIdeaIllustration} className="size-28" />
          <p className="text-lead font-medium">{infographic.keyIdea}</p>
        </div>
      )}
    </LessonShell>
  );
}

function PageDots({ current, total }: { current: number; total: number }) {
  return (
    <div aria-hidden className="flex gap-1.5">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={
            'h-1.5 rounded-full transition-all duration-300 ' +
            (index === current ? 'w-6 bg-accent-strong' : 'w-1.5 bg-slate-300')
          }
        />
      ))}
    </div>
  );
}
