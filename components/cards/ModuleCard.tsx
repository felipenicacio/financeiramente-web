'use client';

import Link from 'next/link';

import { econominhoAssets } from '@/components/econominho/assets';
import { Icon } from '@/components/ui/Icon';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';
import { moduleKey, useSession } from '@/lib/session/SessionProvider';

type ThemeKey = 'm01' | 'm02' | 'm03' | 'm04';

type Props = {
  cycle: string;
  moduleId: string;
  code: string;
  title: string;
  headline: string;
  minutes: number;
  lessonsCount: number;
  theme?: ThemeKey;
};

/** Cartão de módulo dentro da fase. Mostra se foi concluído nesta visita. */
export function ModuleCard({
  cycle,
  moduleId,
  code,
  title,
  headline,
  minutes,
  lessonsCount,
  theme,
}: Props) {
  const { completedModules } = useSession();
  const done = completedModules.has(moduleKey(cycle, moduleId));

  return (
    <Link
      href={routes.module(cycle, moduleId)}
      className="group flex flex-col overflow-hidden rounded-card bg-surface shadow-card transition-shadow hover:shadow-raised"
    >
      <span className="grid place-items-center bg-accent-soft px-6 pt-5">
        {theme ? (
          // eslint-disable-next-line @next/next/no-img-element -- arte local e estática
          <img src={econominhoAssets.theme(theme)} alt="" className="w-full max-w-[14rem]" decoding="async" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- arte local e estática
          <img
            src={econominhoAssets.fullbody()}
            alt=""
            className="w-full max-w-[8rem]"
            decoding="async"
          />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 p-5">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
          <span className="font-semibold text-accent-strong">{code}</span>
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" className="size-3.5" />
            {minutes} {t('moduleMinutes')}
          </span>
          <span>
            {lessonsCount} {lessonsCount === 1 ? 'lição' : 'lições'}
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
