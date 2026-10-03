'use client';

import Link from 'next/link';

import { Illustration } from '@/components/illustrations';
import { Icon } from '@/components/ui/Icon';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';
import { moduleKey, useSession } from '@/lib/session/SessionProvider';

type Props = {
  cycle: string;
  moduleId: string;
  title: string;
  headline: string;
  minutes: number;
  illustration: string;
  position: number;
};

/** Cartão de módulo dentro de uma jornada. Mostra se foi concluído nesta visita. */
export function ModuleCard({
  cycle,
  moduleId,
  title,
  headline,
  minutes,
  illustration,
  position,
}: Props) {
  const { completedModules } = useSession();
  const done = completedModules.has(moduleKey(cycle, moduleId));

  return (
    <Link
      href={routes.module(cycle, moduleId)}
      className="group flex flex-col overflow-hidden rounded-card bg-surface shadow-card transition-shadow hover:shadow-raised"
    >
      <span className="block bg-accent-soft px-6 pt-4">
        <Illustration name={illustration} className="mx-auto w-full max-w-[18rem]" />
      </span>
      <span className="flex min-w-0 flex-col gap-1 p-5">
        <span className="flex items-center gap-3 text-caption text-ink-muted">
          <span>
            {t('moduleEyebrow')} {position}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" className="size-3.5" />
            {minutes} {t('moduleMinutes')}
          </span>
        </span>
        <span className="text-heading font-semibold">{title}</span>
        <span className="text-label text-ink-soft">{headline}</span>
        <span
          className={
            'mt-1 inline-flex items-center gap-1.5 text-label font-semibold ' +
            (done ? 'text-green-700' : 'text-ink')
          }
        >
          {done ? <Icon name="check" className="size-4" /> : null}
          {done ? t('journeyModuleDone') : t('journeyModuleStart')}
          {!done ? (
            <Icon
              name="arrow-right"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          ) : null}
        </span>
      </span>
    </Link>
  );
}
