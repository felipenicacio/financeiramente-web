import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import { ConceptIcon, Illustration } from '@/components/illustrations';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentError } from '@/components/layout/ContentError';
import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { findCycle, loadCatalog, loadCycleSummary, loadModule } from '@/lib/content';
import { rawCycleSummaries } from '@/lib/content/registry';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';

type Params = { ciclo: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return Object.keys(rawCycleSummaries).map((ciclo) => ({ ciclo }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciclo } = await params;
  const summary = loadCycleSummary(ciclo);
  const catalog = loadCatalog();
  const cycle = catalog.ok ? findCycle(catalog.data, ciclo) : undefined;
  if (!summary?.ok || !cycle) return {};
  return {
    title: `${summary.data.title} ${cycle.ageRange}`,
    description: summary.data.intro,
    alternates: { canonical: routes.cycleSummary(ciclo) },
  };
}

/** "O que descobrimos?": resumo conceitual do ciclo, sem pontuação nem certificado. */
export default async function CycleSummaryPage({ params }: { params: Promise<Params> }) {
  const { ciclo } = await params;
  const summary = loadCycleSummary(ciclo);
  if (!summary) notFound();
  if (!summary.ok) {
    return (
      <main id="conteudo" className="flex-1">
        <ContentError issues={summary.issues} />
      </main>
    );
  }
  const { data } = summary;

  return (
    <div data-cycle={data.cycle} className="flex flex-1 flex-col">
      <AppHeader back={{ href: routes.journeys(data.cycle), label: t('back') }} />
      <main id="conteudo" className="flex-1 pb-16 pt-6 md:pt-12">
        <PageContainer width="reading" className="flex flex-col gap-8">
          <div className="animate-enter flex flex-col items-center gap-3 text-center">
            <Illustration name="done-path" className="w-48" />
            <h1 className="text-display font-bold tracking-[-0.03em]">{data.title}</h1>
            <p className="text-lead text-ink-soft">{data.intro}</p>
          </div>

          <ul className="flex flex-col gap-3">
            {data.discoveries.map((discovery) => {
              const moduleResult = loadModule(data.cycle, discovery.module);
              return (
                <li key={discovery.text}>
                  <Link
                    href={routes.module(data.cycle, discovery.module)}
                    className={`tone-${discovery.tone} group flex items-center gap-4 rounded-card bg-(--tone-soft) p-4 pr-5`}
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)">
                      <ConceptIcon icon={discovery.icon} className="size-7" />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-lead font-semibold">{discovery.text}</span>
                      {moduleResult.ok ? (
                        <span className="text-caption text-ink-soft">
                          {moduleResult.data.module.title}
                        </span>
                      ) : null}
                    </span>
                    <Icon
                      name="arrow-right"
                      className="size-5 text-(--tone-strong) transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <EconominhoGuide variant="bubble" state={data.guide.state} text={data.guide.text} />
          <p className="text-ink-soft">{data.closing}</p>

          <ButtonLink
            href={routes.journeys(data.cycle)}
            variant="secondary"
            icon="arrow-left"
            iconPosition="start"
          >
            {t('cycleSummaryBack')}
          </ButtonLink>
        </PageContainer>
      </main>
    </div>
  );
}
