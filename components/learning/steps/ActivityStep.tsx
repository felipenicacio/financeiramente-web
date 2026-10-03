'use client';

import { useState } from 'react';

import { CategoryIcon, Illustration } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import type { CategoryId } from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import { activityChoiceState, dependsOnContext, isAcceptedCategory } from '@/lib/learning';

import { ChoiceCard } from '../ChoiceCard';
import { FeedbackCard } from '../FeedbackCard';
import { LessonShell, ScreenTitle } from '../LessonShell';
import type { StepProps } from './types';
import { useLessonNav } from './useLessonNav';

/**
 * Classificação: uma situação por tela, três categorias. Itens com mais de uma
 * resposta aceita mostram que a classificação depende do contexto, que é o
 * ponto pedagógico central do módulo. Nenhuma resposta é tratada como erro.
 */
export function ActivityStep({ bundle }: StepProps) {
  const { module, activity, infographic } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'activity');
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<CategoryId | null>(null);

  const item = activity.items[index];
  if (!item) return null;
  const isLast = index === activity.items.length - 1;
  const accepted = choice ? isAcceptedCategory(item, choice) : false;

  const advance = () => {
    if (isLast) return goNext();
    setChoice(null);
    setIndex((value) => value + 1);
  };

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="activity"
      screenKey={`activity-${index}`}
      footer={
        <Button icon="arrow-right" onClick={advance} disabled={!choice}>
          {isLast ? t('continue') : t('next')}
        </Button>
      }
    >
      <div className="flex flex-col gap-1">
        <p className="text-caption font-medium text-ink-muted">
          {t('activityCounter', { current: index + 1, total: activity.items.length })}
        </p>
        <p className="text-label text-ink-soft">{activity.instructions}</p>
      </div>

      <div
        key={item.id}
        className="animate-enter-side flex flex-col items-center gap-2 rounded-hero bg-surface p-5 text-center shadow-card"
      >
        <span className="grid size-28 place-items-center rounded-full bg-accent-soft">
          <Illustration name={item.illustration} className="size-20" />
        </span>
        <ScreenTitle>{item.label}</ScreenTitle>
        <p className="text-ink-soft">{item.situation}</p>
      </div>

      <div className="flex flex-col gap-3">
        {infographic.categories.map((category) => (
          <ChoiceCard
            key={`${item.id}-${category.id}`}
            label={category.label}
            detail={category.short}
            tone={`tone-${category.id}`}
            state={activityChoiceState(item, category.id, choice)}
            disabled={choice !== null}
            onSelect={() => setChoice(category.id)}
            leading={
              <span
                className={`tone-${category.id} grid size-12 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)`}
              >
                <CategoryIcon category={category.id} className="size-7" />
              </span>
            }
          />
        ))}
      </div>

      {choice ? (
        <FeedbackCard
          key={`${item.id}-${choice}`}
          tone={accepted ? 'positive' : 'guide'}
          title={accepted ? t('great') : t('thinkAgain')}
          body={item.feedback}
          note={
            dependsOnContext(item) && item.contextNote
              ? { title: t('itMayChange'), body: item.contextNote }
              : undefined
          }
        />
      ) : null}
    </LessonShell>
  );
}
