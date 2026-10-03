import { Illustration } from '@/components/illustrations';
import { t } from '@/lib/content/ui';
import { formatMoney, goalProgress } from '@/lib/learning';

type Props = {
  label: string;
  illustration: string;
  price: number;
  saved: number;
  /** Valor antes da escolha: o trecho novo aparece destacado na barra. */
  previousSaved?: number;
};

/** Pote da meta: quanto já foi guardado e quanto falta, sempre em texto e em barra. */
export function GoalMeter({ label, illustration, price, saved, previousSaved }: Props) {
  const missing = Math.max(price - saved, 0);
  const before = goalProgress(previousSaved ?? saved, price);
  const after = goalProgress(saved, price);
  return (
    <div className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card">
      <Illustration name={illustration} className="size-16 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="text-caption text-ink-muted">{t('simGoal')}</span>
          <span className="text-label font-semibold">
            {label}: {formatMoney(price)}
          </span>
        </p>
        <div
          role="meter"
          aria-label={`${t('simSaved')}: ${formatMoney(saved)} / ${formatMoney(price)}`}
          aria-valuemin={0}
          aria-valuemax={price}
          aria-valuenow={saved}
          className="relative h-4 overflow-hidden rounded-full bg-slate-100"
        >
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-amber-700"
            style={{ width: `${before * 100}%` }}
          />
          {after > before ? (
            <span
              key={saved}
              className="animate-grow absolute inset-y-0 rounded-full bg-amber-500"
              style={{ left: `${before * 100}%`, width: `${(after - before) * 100}%` }}
            />
          ) : null}
        </div>
        <p className="flex flex-wrap justify-between gap-x-3 text-label">
          <span>
            {t('simSaved')}: <strong>{formatMoney(saved)}</strong>
          </span>
          <span className={missing === 0 ? 'font-semibold text-green-700' : 'text-ink-soft'}>
            {missing === 0 ? t('simReached') : `${t('simMissing')}: ${formatMoney(missing)}`}
          </span>
        </p>
      </div>
    </div>
  );
}
