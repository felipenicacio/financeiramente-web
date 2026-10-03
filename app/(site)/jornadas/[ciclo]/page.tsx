import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JourneyCard } from '@/components/cards/JourneyCard';
import { ModuleCard } from '@/components/cards/ModuleCard';
import { Illustration } from '@/components/illustrations';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentError } from '@/components/layout/ContentError';
import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { cycleIds, findCycle, loadCatalog, loadModule } from '@/lib/content';
import { t } from '@/lib/content/ui';
import { routes } from '@/lib/learning/steps';

type Params = { ciclo: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return cycleIds.map((ciclo) => ({ ciclo }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciclo } = await params;
  const catalog = loadCatalog();
  const cycle = catalog.ok ? findCycle(catalog.data, ciclo) : undefined;
  return cycle
    ? {
        title: `${t('journeysTitle')}: ${cycle.ageRange}`,
        description: cycle.description,
        alternates: { canonical: routes.journeys(ciclo) },
        robots: cycle.status === 'available' ? undefined : { index: false },
      }
    : {};
}

export default async function JourneysPage({ params }: { params: Promise<Params> }) {
  const { ciclo } = await params;
  const catalog = loadCatalog();
  if (!catalog.ok) {
    return (
      <main id="conteudo" className="flex-1">
        <ContentError issues={catalog.issues} />
      </main>
    );
  }
  const cycle = findCycle(catalog.data, ciclo);
  if (!cycle) notFound();

  const available = cycle.status === 'available' && cycle.journeys.length > 0;

  return (
    <div data-cycle={cycle.id} className="flex flex-1 flex-col">
      <AppHeader back={{ href: routes.age, label: t('back') }} />
      <main id="conteudo" className="flex-1 pb-16 pt-6 md:pt-12">
        <PageContainer width="reading">
          <p className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-caption font-medium text-accent-strong">
            {cycle.ageRange}
          </p>
          <h1 className="mt-3 text-display font-bold tracking-[-0.03em]">{cycle.label}</h1>
          <p className="mt-2 text-lead text-ink-soft">{cycle.description}</p>

          {available ? (
            <div className="mt-10 flex flex-col gap-10">
              {cycle.journeys.map((journey) => (
                <JourneyCard
                  key={journey.id}
                  id={journey.id}
                  title={journey.title}
                  description={journey.description}
                >
                  {journey.modules.map((ref, index) => {
                    const bundle = ref.status === 'available' ? loadModule(cycle.id, ref.id) : null;
                    if (!bundle || !bundle.ok) {
                      return (
                        <p
                          key={ref.id}
                          className="rounded-card border-2 border-dashed border-line p-5 text-ink-muted"
                        >
                          {t('moduleEyebrow')} {index + 1}: {t('journeyModuleSoon')}
                        </p>
                      );
                    }
                    const { module } = bundle.data;
                    return (
                      <ModuleCard
                        key={ref.id}
                        cycle={cycle.id}
                        moduleId={module.id}
                        title={module.title}
                        headline={module.headline}
                        minutes={module.estimatedMinutes}
                        illustration={module.illustration}
                        position={index + 1}
                      />
                    );
                  })}
                  <p className="text-caption text-ink-muted">{t('journeySoon')}</p>
                </JourneyCard>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-start gap-4 rounded-hero bg-surface p-6 shadow-card sm:p-8">
              <Illustration name="home-hero" className="w-48" />
              <h2 className="text-heading font-semibold">{t('cycleSoonTitle')}</h2>
              <p className="text-ink-soft">{t('cycleSoonBody')}</p>
              <ButtonLink
                href={routes.age}
                variant="secondary"
                icon="arrow-left"
                iconPosition="start"
              >
                {t('cycleSoonCta')}
              </ButtonLink>
            </div>
          )}
        </PageContainer>
      </main>
    </div>
  );
}
