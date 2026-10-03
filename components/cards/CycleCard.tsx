import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import type { CycleEntry } from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';

/**
 * Cartão de faixa etária. Cada um usa o acento do próprio ciclo
 * (data-cycle), mostrando a mesma marca em quatro expressões.
 */
export function CycleCard({ cycle }: { cycle: CycleEntry }) {
  const available = cycle.status === 'available';
  const body = (
    <>
      <span aria-hidden className="absolute inset-y-0 left-0 w-2 bg-accent" />
      <span className="flex items-start justify-between gap-3">
        <span className="flex flex-col">
          <span className="text-title font-semibold tracking-[-0.02em]">{cycle.ageRange}</span>
          <span className="text-label font-medium text-accent-strong">{cycle.label}</span>
        </span>
        <span
          className={
            'shrink-0 rounded-full px-3 py-1 text-caption font-medium ' +
            (available ? 'bg-accent-soft text-accent-strong' : 'bg-slate-100 text-ink-soft')
          }
        >
          {available ? t('ageAvailable') : t('ageSoon')}
        </span>
      </span>
      <span className="mt-2 block text-ink-soft">{cycle.description}</span>
      {available ? (
        <span className="mt-4 inline-flex items-center gap-1.5 text-label font-semibold text-ink">
          {t('homeCta')}
          <Icon
            name="arrow-right"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      ) : null}
    </>
  );

  const shell =
    'group relative block overflow-hidden rounded-card bg-surface py-5 pl-7 pr-5 shadow-card';

  return available ? (
    <Link
      href={routes.journeys(cycle.id)}
      data-cycle={cycle.id}
      className={`${shell} transition-shadow hover:shadow-raised`}
    >
      {body}
    </Link>
  ) : (
    <div data-cycle={cycle.id} className={shell}>
      {body}
    </div>
  );
}
