'use client';

import { useState } from 'react';

import { Illustration } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';
import { fillTemplate, formatMoney, simulateChoice } from '@/lib/learning';

import { ChoiceCard } from '../ChoiceCard';
import { GoalMeter } from '../GoalMeter';
import { LessonShell, ScreenTitle } from '../LessonShell';
import { SimulationPanel } from '../SimulationPanel';
import type { StepProps } from './types';
import { useLessonNav } from './useLessonNav';

/**
 * Simulação com valor fictício. Mostra "se você escolher X, acontece Y",
 * sem julgar a decisão, e permite testar outra opção para comparar.
 */
export function SimulationStep({ bundle }: StepProps) {
  const { module, simulation } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'simulation');
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [tried, setTried] = useState(0);

  const outcome = selected && revealed ? simulateChoice(simulation, selected) : null;
  const budget = formatMoney(simulation.budget);

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
            <p className="text-ink-soft">{fillTemplate(simulation.intro, { budget })}</p>
          </div>

          <div className="flex items-center justify-between rounded-hero bg-accent-soft px-5 py-4">
            <span className="text-label font-medium text-ink-soft">{t('simBudget')}</span>
            <span className="text-display font-bold tabular-nums text-accent-strong">{budget}</span>
          </div>

          <GoalMeter
            label={simulation.goal.label}
            illustration={simulation.goal.illustration}
            price={simulation.goal.price}
            saved={simulation.goal.saved}
          />

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
          <SimulationPanel budget={simulation.budget} outcome={outcome} />
          <p className="text-caption text-ink-muted">{simulation.leftoverRule}</p>
          <GoalMeter
            label={simulation.goal.label}
            illustration={simulation.goal.illustration}
            price={simulation.goal.price}
            saved={outcome.savedAfter}
            previousSaved={outcome.savedBefore}
          />
          <p className="text-ink-soft">{simulation.wrapUp}</p>
        </div>
      )}
    </LessonShell>
  );
}
