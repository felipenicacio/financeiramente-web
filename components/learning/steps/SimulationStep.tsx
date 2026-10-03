'use client';

import { useMemo, useState } from 'react';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import { Illustration } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import type {
  BudgetSimulation,
  ModuleBundle,
  PresentationSimulation,
  SpendSimulation,
} from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import {
  budgetState,
  budgetTemplateValues,
  fillTemplate,
  formatMoney,
  simulateChoice,
  spendTemplateValues,
} from '@/lib/learning';

import { ChoiceCard } from '../ChoiceCard';
import { FeedbackCard } from '../FeedbackCard';
import { GoalMeter } from '../GoalMeter';
import { LessonShell, ScreenTitle } from '../LessonShell';
import { SimulationPanel } from '../SimulationPanel';
import type { StepProps } from './types';
import { useLessonNav } from './useLessonNav';

/**
 * Simulação com valores fictícios: "se você escolher X, acontece Y".
 * Nenhuma escolha é julgada; dá para testar outra opção e comparar.
 */
export function SimulationStep({ bundle }: StepProps) {
  const { simulation } = bundle;
  switch (simulation.kind) {
    case 'spend':
      return <SpendView bundle={bundle} simulation={simulation} />;
    case 'presentation':
      return <PresentationView bundle={bundle} simulation={simulation} />;
    case 'budget':
      return <BudgetView bundle={bundle} simulation={simulation} />;
  }
}

type ViewProps<S> = { bundle: ModuleBundle; simulation: S };

function Guide({ bundle }: { bundle: ModuleBundle }) {
  const line = bundle.module.guide.simulation;
  return <EconominhoGuide state={line.state} text={line.text} />;
}

// ---------- escolher uma opção (M01, M02) ----------

function SpendView({ bundle, simulation }: ViewProps<SpendSimulation>) {
  const { module } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'simulation');
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [tried, setTried] = useState(0);
  const values = useMemo(() => spendTemplateValues(simulation), [simulation]);

  const outcome = selected && revealed ? simulateChoice(simulation, selected) : null;
  const budget = formatMoney(simulation.budget);
  const goal = simulation.goal;

  const footer = outcome ? (
    <>
      <Button icon="arrow-right" onClick={goNext}>
        {t('continue')}
      </Button>
      <Button
        variant="secondary"
        icon="refresh"
        iconPosition="start"
        onClick={() => {
          setRevealed(false);
          setSelected(null);
          setTried((value) => value + 1);
        }}
      >
        {t('tryAnother')}
      </Button>
    </>
  ) : (
    <Button icon="arrow-right" disabled={!selected} onClick={() => setRevealed(true)}>
      {t('seeWhatHappens')}
    </Button>
  );

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="simulation"
      screenKey={outcome ? `outcome-${outcome.option.id}` : `choose-${tried}`}
      footer={footer}
    >
      {!outcome ? (
        <div key="choose" className="animate-enter flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <ScreenTitle>{simulation.title}</ScreenTitle>
            <p className="text-ink-soft">{fillTemplate(simulation.intro, values)}</p>
          </div>
          {tried === 0 ? <Guide bundle={bundle} /> : null}

          <div className="flex items-center justify-between rounded-hero bg-accent-soft px-5 py-4">
            <span className="text-label font-medium text-ink-soft">{t('simBudget')}</span>
            <span className="text-display font-bold tabular-nums text-accent-strong">{budget}</span>
          </div>

          {goal ? (
            <GoalMeter
              label={goal.label}
              illustration={goal.illustration}
              price={goal.price}
              saved={goal.saved}
            />
          ) : null}

          <div className="flex flex-col gap-3">
            {simulation.options.map((option) => (
              <ChoiceCard
                key={option.id}
                label={option.label}
                detail={`${t('simCost')} ${formatMoney(option.cost)}`}
                state={selected === option.id ? 'selected' : 'idle'}
                onSelect={() => setSelected(option.id)}
                leading={
                  <span className="grid size-14 place-items-center rounded-control bg-slate-100">
                    <Illustration name={option.illustration} className="size-11" />
                  </span>
                }
              />
            ))}
          </div>
          {!selected ? <p className="text-caption text-ink-muted">{t('simNoChoice')}</p> : null}
        </div>
      ) : (
        <div key={outcome.option.id} className="animate-enter flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-card bg-accent-soft">
              <Illustration name={outcome.option.illustration} className="size-12" />
            </span>
            <ScreenTitle>{t('simIfYouChoose', { option: outcome.option.label })}</ScreenTitle>
          </div>
          <SimulationPanel
            budget={simulation.budget}
            outcome={outcome}
            hasGoal={Boolean(goal)}
            templateValues={values}
          />
          <p className="text-caption text-ink-muted">{simulation.leftoverRule}</p>
          {goal && outcome.goal ? (
            <GoalMeter
              label={goal.label}
              illustration={goal.illustration}
              price={goal.price}
              saved={outcome.goal.savedAfter}
              previousSaved={outcome.goal.savedBefore}
            />
          ) : null}
          <p className="text-ink-soft">{simulation.wrapUp}</p>
        </div>
      )}
    </LessonShell>
  );
}

// ---------- mesmo produto, dois jeitos de mostrar (M03) ----------

function PresentationView({ bundle, simulation }: ViewProps<PresentationSimulation>) {
  const { module } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'simulation');
  const [answer, setAnswer] = useState<string | null>(null);
  const chosen = simulation.question.options.find((option) => option.id === answer);

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="simulation"
      screenKey="presentation"
      footer={
        <Button icon="arrow-right" disabled={!answer} onClick={goNext}>
          {t('continue')}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <ScreenTitle>{simulation.title}</ScreenTitle>
        <p className="text-ink-soft">{simulation.intro}</p>
      </div>
      <Guide bundle={bundle} />

      <div className="grid gap-3 sm:grid-cols-2">
        {simulation.versions.map((version) => (
          <AdVersion
            key={version.id}
            version={version}
            illustration={simulation.product.illustration}
          />
        ))}
      </div>

      <section aria-labelledby="pergunta" className="flex flex-col gap-3">
        <h2 id="pergunta" className="text-heading font-semibold">
          {simulation.question.prompt}
        </h2>
        {simulation.question.options.map((option) => (
          <ChoiceCard
            key={option.id}
            label={option.label}
            state={answer === option.id ? 'selected' : answer ? 'dimmed' : 'idle'}
            disabled={answer !== null}
            onSelect={() => setAnswer(option.id)}
          />
        ))}
      </section>

      {chosen ? (
        <FeedbackCard
          key={chosen.id}
          tone="neutral"
          title={t('anyAnswer')}
          body={chosen.reflection}
          facts={
            <div className="rounded-control bg-surface/80 p-4">
              <p className="text-label font-semibold">
                {t('simSameFacts')}: {simulation.product.label}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {simulation.product.facts.map((fact) => (
                  <li key={fact} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label">
                    <span>{fact}</span>
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-caption font-semibold text-green-700">
                      {t('simSameInBoth')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          }
          note={{ title: t('rememberTitle'), body: simulation.wrapUp }}
        />
      ) : null}
    </LessonShell>
  );
}

function AdVersion({
  version,
  illustration,
}: {
  version: PresentationSimulation['versions'][number];
  illustration: string;
}) {
  const loud = version.style === 'loud';
  return (
    <figure
      className={
        'relative overflow-hidden rounded-hero p-5 ' +
        (loud
          ? 'bg-purple-700 text-white shadow-raised'
          : 'bg-surface text-ink shadow-card ring-1 ring-inset ring-line')
      }
    >
      <figcaption
        className={`text-caption font-semibold ${loud ? 'text-purple-100' : 'text-ink-muted'}`}
      >
        {version.label}
      </figcaption>
      {loud ? (
        <Illustration
          name="item-sparkles"
          className="absolute -right-4 -top-4 size-24 opacity-90"
        />
      ) : null}
      <div className="mt-3 flex items-center gap-4">
        <span
          className={`grid size-20 shrink-0 place-items-center rounded-full ${loud ? 'bg-amber-500' : 'bg-slate-100'}`}
        >
          <Illustration name={illustration} className="size-14" />
        </span>
        <p
          className={
            loud ? 'text-heading font-bold leading-tight' : 'text-lead font-semibold leading-snug'
          }
        >
          {version.headline}
        </p>
      </div>
      <ul className="mt-4 flex flex-col gap-1.5">
        {version.lines.map((line) => (
          <li
            key={line}
            className={
              loud
                ? 'w-fit rounded-full bg-white/15 px-3 py-1 font-semibold'
                : 'text-label text-ink-soft'
            }
          >
            {line}
          </li>
        ))}
      </ul>
    </figure>
  );
}

// ---------- orçamento com várias escolhas (M04) ----------

function BudgetView({ bundle, simulation }: ViewProps<BudgetSimulation>) {
  const { module } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'simulation');
  const [selected, setSelected] = useState<string[]>([]);
  const state = budgetState(simulation, selected);
  const values = useMemo(() => budgetTemplateValues(simulation), [simulation]);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="simulation"
      screenKey="budget"
      footer={
        <Button icon="arrow-right" disabled={selected.length === 0} onClick={goNext}>
          {t('continue')}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <ScreenTitle>{simulation.title}</ScreenTitle>
        <p className="text-ink-soft">{fillTemplate(simulation.intro, values)}</p>
      </div>
      <Guide bundle={bundle} />

      <div
        aria-live="polite"
        className="sticky top-[4.6rem] z-10 grid grid-cols-2 gap-2 rounded-hero bg-accent-soft p-3 shadow-card"
      >
        <BudgetFigure label={t('simBudget')} value={formatMoney(simulation.budget)} />
        <BudgetFigure label={t('simLeft')} value={formatMoney(state.leftNow)} strong />
        {state.nextAvailable !== null && state.owedLater > 0 ? (
          <>
            <BudgetFigure
              label={t('simCommitted')}
              value={formatMoney(state.owedLater)}
              tone="purple"
            />
            <BudgetFigure
              label={`${t('simAvailableNext')} ${(simulation.nextLabel ?? t('simLater')).toLowerCase()}`}
              value={formatMoney(state.nextAvailable)}
              tone="purple"
            />
          </>
        ) : null}
      </div>

      <p className="text-caption text-ink-muted">{t('simChooseMany')}</p>
      <div className="flex flex-col gap-3">
        {simulation.items.map((item) => {
          const isSelected = selected.includes(item.id);
          const fits = state.fits(item.id);
          const detail = item.payLater
            ? t('simSplit', {
                cost: formatMoney(item.cost),
                now: formatMoney(item.payLater.now),
                later: formatMoney(item.payLater.later),
              })
            : formatMoney(item.cost);
          return (
            <ChoiceCard
              key={item.id}
              label={item.label}
              detail={
                fits || isSelected
                  ? detail
                  : `${detail}. ${t('simDoesNotFit')}: ${t('activityMissing').toLowerCase()} ${formatMoney(state.missingFor(item.id))}`
              }
              state={isSelected ? 'selected' : fits ? 'idle' : 'dimmed'}
              disabled={!fits && !isSelected}
              onSelect={() => toggle(item.id)}
              leading={
                <span className="grid size-14 place-items-center rounded-control bg-slate-100">
                  <Illustration name={item.illustration} className="size-11" />
                </span>
              }
            />
          );
        })}
      </div>

      {selected.length > 0 ? <p className="text-ink-soft">{simulation.wrapUp}</p> : null}
    </LessonShell>
  );
}

function BudgetFigure({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: 'purple';
}) {
  return (
    <div
      className={`rounded-control px-3 py-2 ${tone ? 'tone-purple bg-(--tone-tint)' : 'bg-surface'}`}
    >
      <p className="text-caption text-ink-muted">{label}</p>
      <p
        className={`text-heading font-bold tabular-nums ${strong ? 'text-accent-strong' : ''} ${tone ? 'text-(--tone-strong)' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
