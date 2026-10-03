'use client';

import { useMemo, useState } from 'react';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import { Button } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';
import { fillTemplate, storyMoneyLabels } from '@/lib/learning';

import { ChoiceCard } from '../ChoiceCard';
import { FeedbackCard } from '../FeedbackCard';
import { LessonShell, ScreenTitle } from '../LessonShell';
import { StoryCard } from '../StoryCard';
import type { StepProps } from './types';
import { useLessonNav } from './useLessonNav';

/** História em quadros (um por tela) e, no fim, a pergunta "O que você faria?". */
export function StoryStep({ bundle }: StepProps) {
  const { module, story } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'story');
  const [page, setPage] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const money = useMemo(() => storyMoneyLabels(story), [story]);

  const total = story.panels.length;
  const onQuestion = page >= total;
  const panel = story.panels[page];
  const chosen = story.question.options.find((option) => option.id === choice);

  const footer = onQuestion ? (
    <>
      <Button icon="arrow-right" disabled={!choice} onClick={goNext}>
        {t('continue')}
      </Button>
      <Button
        variant="secondary"
        icon="arrow-left"
        iconPosition="start"
        onClick={() => setPage(total - 1)}
      >
        {t('back')}
      </Button>
    </>
  ) : (
    <>
      <Button icon="arrow-right" onClick={() => setPage((value) => value + 1)}>
        {t('next')}
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
  );

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="story"
      screenKey={`story-${page}`}
      footer={footer}
    >
      {!onQuestion && panel ? (
        <>
          <ScreenTitle>{story.title}</ScreenTitle>
          {page === 0 ? (
            <EconominhoGuide state={module.guide.story.state} text={module.guide.story.text} />
          ) : null}
          <StoryCard
            key={panel.id}
            illustration={panel.illustration}
            labels={money}
            text={fillTemplate(panel.text, money)}
            counter={t('storyCounter', { current: page + 1, total })}
          />
        </>
      ) : (
        <>
          <div className="animate-enter-side flex flex-col gap-2">
            <p className="text-caption font-medium text-accent-strong">{t('storyYourTurn')}</p>
            <ScreenTitle>{story.question.prompt}</ScreenTitle>
          </div>
          <div className="flex flex-col gap-3">
            {story.question.options.map((option) => (
              <ChoiceCard
                key={option.id}
                label={option.label}
                state={choice === option.id ? 'selected' : 'idle'}
                onSelect={() => setChoice(option.id)}
              />
            ))}
          </div>
          {chosen ? (
            <FeedbackCard
              key={chosen.id}
              tone="neutral"
              title={t('anyAnswer')}
              body={fillTemplate(chosen.reflection, money)}
              note={{ title: t('rememberTitle'), body: fillTemplate(story.closing, money) }}
            />
          ) : null}
        </>
      )}
    </LessonShell>
  );
}
