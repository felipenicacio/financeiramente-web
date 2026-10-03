import { t } from '@/lib/content/ui';
import { fillTemplate, formatMoney, type SpendOutcome } from '@/lib/learning';

type Props = {
  budget: number;
  outcome: SpendOutcome;
  /** Com meta, o que sobra vai para o pote ("Sobrou"); sem meta, é "Troco". */
  hasGoal: boolean;
  templateValues: Record<string, string>;
};

/**
 * Resultado de uma escolha: recurso, gasto, saldo, agora e depois.
 * Os números chegam calculados (simulateChoice).
 */
export function SimulationPanel({ budget, outcome, hasGoal, templateValues }: Props) {
  const rows = [
    { label: t('simBudget'), value: formatMoney(budget) },
    { label: t('simSpent'), value: formatMoney(outcome.spent) },
    {
      label: hasGoal ? t('simLeft') : t('simChange'),
      value: formatMoney(outcome.left),
      strong: true,
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-3 overflow-hidden rounded-card bg-surface shadow-card">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex flex-col items-center gap-0.5 px-2 py-3 text-center ${row.strong ? 'bg-accent-soft' : ''}`}
          >
            <dt className="text-caption text-ink-muted">{row.label}</dt>
            <dd
              className={`text-heading font-bold tabular-nums ${row.strong ? 'text-accent-strong' : ''}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="tone-coral rounded-card bg-(--tone-soft) p-4">
          <p className="text-label font-semibold text-(--tone-strong)">{t('simNow')}</p>
          <p className="mt-1">{fillTemplate(outcome.option.now, templateValues)}</p>
        </div>
        <div className="tone-guide rounded-card bg-(--tone-soft) p-4">
          <p className="text-label font-semibold text-(--tone-strong)">{t('simLater')}</p>
          <p className="mt-1">{fillTemplate(outcome.option.later, templateValues)}</p>
        </div>
      </div>
    </div>
  );
}
