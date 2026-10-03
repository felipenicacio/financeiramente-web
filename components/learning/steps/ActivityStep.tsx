'use client';

import { useState } from 'react';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import { ConceptIcon, Illustration } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import type { Activity, ActivityItem, PricedProduct } from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import {
  affordResult,
  changeAnswer,
  choiceState,
  dependsOnContext,
  fillTemplate,
  formatMoney,
  isAccepted,
} from '@/lib/learning';

import { ChoiceCard } from '../ChoiceCard';
import { FeedbackCard } from '../FeedbackCard';
import { LessonShell, ScreenTitle } from '../LessonShell';
import type { StepProps } from './types';
import { useLessonNav } from './useLessonNav';

/**
 * Atividade: uma situação por tela, retorno imediato, nenhuma resposta
 * tratada como erro. Quatro formatos:
 * - classify: escolher uma categoria (pode haver mais de uma certa, conforme o contexto);
 * - compare: qual custa mais/menos (resposta calculada pelos preços);
 * - afford: o que cabe no dinheiro que tenho (todas as que cabem valem);
 * - change: quanto volta de troco (resposta calculada).
 */
export function ActivityStep({ bundle }: StepProps) {
  const { module, activity } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'activity');
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);

  const item = activity.items[index];
  if (!item) return null;
  const isLast = index === activity.items.length - 1;

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
      {index === 0 ? (
        <EconominhoGuide state={module.guide.activity.state} text={module.guide.activity.text} />
      ) : null}

      <ItemView
        key={item.id}
        item={item}
        activity={activity}
        choice={choice}
        onChoose={setChoice}
      />
    </LessonShell>
  );
}

type ItemProps = {
  item: ActivityItem;
  activity: Activity;
  choice: string | null;
  onChoose: (value: string) => void;
};

function ItemView({ item, activity, choice, onChoose }: ItemProps) {
  const accepted = choice !== null && isAccepted(item, choice);

  return (
    <>
      <ItemHeader item={item} />
      <div className="flex flex-col gap-3">
        <ItemOptions item={item} activity={activity} choice={choice} onChoose={onChoose} />
      </div>
      {choice !== null ? (
        <FeedbackCard
          key={choice}
          tone={accepted ? 'positive' : 'guide'}
          title={accepted ? t('great') : t('thinkAgain')}
          body={item.feedback}
          facts={<ItemFacts item={item} choice={choice} />}
          note={
            dependsOnContext(item) && item.kind === 'classify' && item.contextNote
              ? { title: t('itMayChange'), body: item.contextNote }
              : undefined
          }
        />
      ) : null}
    </>
  );
}

function ItemHeader({ item }: { item: ActivityItem }) {
  if (item.kind === 'classify') {
    return (
      <div className="animate-enter-side flex flex-col items-center gap-2 rounded-hero bg-surface p-5 text-center shadow-card">
        {item.illustration ? (
          <span className="grid size-28 place-items-center rounded-full bg-accent-soft">
            <Illustration name={item.illustration} className="size-20" />
          </span>
        ) : null}
        <ScreenTitle>{item.label}</ScreenTitle>
        <p className="text-ink-soft">{item.situation}</p>
      </div>
    );
  }

  const prompt =
    item.kind === 'afford'
      ? fillTemplate(item.prompt, { budget: formatMoney(item.budget) })
      : item.kind === 'change'
        ? fillTemplate(item.prompt, {
            paid: formatMoney(item.paid),
            price: formatMoney(item.product.price),
          })
        : item.prompt;

  return (
    <div className="animate-enter-side flex flex-col gap-3">
      {item.kind === 'change' ? (
        <div className="flex items-center justify-center gap-4 rounded-hero bg-accent-soft p-4">
          <Illustration name={item.product.illustration} className="size-20" />
          <Illustration name="item-banknote" className="size-16" />
        </div>
      ) : null}
      <ScreenTitle>{prompt}</ScreenTitle>
    </div>
  );
}

const productLeading = (product: PricedProduct) => (
  <span className="grid size-14 place-items-center rounded-control bg-slate-100">
    <Illustration name={product.illustration} className="size-11" />
  </span>
);

function ItemOptions({ item, activity, choice, onChoose }: ItemProps) {
  const common = (optionId: string) => ({
    state: choiceState(item, optionId, choice),
    disabled: choice !== null,
    onSelect: () => onChoose(optionId),
  });

  switch (item.kind) {
    case 'classify':
      return activity.categories.map((category) => (
        <ChoiceCard
          key={category.id}
          label={category.label}
          detail={category.short}
          tone={`tone-${category.tone}`}
          {...common(category.id)}
          leading={
            <span
              className={`tone-${category.tone} grid size-12 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)`}
            >
              <ConceptIcon icon={category.icon} className="size-7" />
            </span>
          }
        />
      ));
    case 'compare':
    case 'afford':
      return item.products.map((product) => (
        <ChoiceCard
          key={product.id}
          label={product.label}
          detail={formatMoney(product.price)}
          leading={productLeading(product)}
          {...common(product.id)}
        />
      ));
    case 'change':
      return item.options.map((value) => (
        <ChoiceCard
          key={value}
          label={formatMoney(value)}
          leading={
            <span className="grid size-12 place-items-center rounded-full bg-amber-50">
              <Illustration name="item-coins" className="size-9" />
            </span>
          }
          {...common(String(value))}
        />
      ));
  }
}

/** Números da resposta, sempre calculados a partir do conteúdo. */
function ItemFacts({ item, choice }: { item: ActivityItem; choice: string }) {
  const rows: { label: string; value: string }[] = [];
  if (item.kind === 'compare') {
    const prices = item.products.map((product) => product.price);
    for (const product of item.products) {
      rows.push({ label: product.label, value: formatMoney(product.price) });
    }
    rows.push({
      label: t('activityDifference'),
      value: formatMoney(Math.max(...prices) - Math.min(...prices)),
    });
  } else if (item.kind === 'afford') {
    const result = affordResult(item, choice);
    if (!result) return null;
    rows.push({ label: t('simBudget'), value: formatMoney(item.budget) });
    rows.push({ label: result.product.label, value: formatMoney(result.product.price) });
    rows.push(
      result.fits
        ? { label: t('activityLeft'), value: formatMoney(result.left) }
        : { label: t('activityMissing'), value: formatMoney(result.missing) },
    );
  } else if (item.kind === 'change') {
    rows.push({ label: t('simBudget'), value: formatMoney(item.paid) });
    rows.push({ label: t('simPrice'), value: formatMoney(item.product.price) });
    rows.push({ label: t('activityChangeAnswer'), value: formatMoney(changeAnswer(item)) });
  } else {
    return null;
  }
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-control bg-surface/80 px-3 py-2">
          <dt className="text-caption text-ink-muted">{row.label}</dt>
          <dd className="font-bold tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
