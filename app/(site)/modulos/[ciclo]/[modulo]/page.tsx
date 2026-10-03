import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Illustration } from '@/components/illustrations';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentError } from '@/components/layout/ContentError';
import { PageContainer } from '@/components/layout/PageContainer';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { availableModules, loadModule } from '@/lib/content';
import { t } from '@/lib/content/ui';
import { lessonSteps, routes } from '@/lib/learning/steps';

type Params = { ciclo: string; modulo: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return availableModules().map(({ cycle, moduleId }) => ({ ciclo: cycle, modulo: moduleId }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciclo, modulo } = await params;
  const result = loadModule(ciclo, modulo);
  if (!result.ok) return {};
  const { module } = result.data;
  return {
    title: module.title,
    description: module.headline,
    alternates: { canonical: routes.module(ciclo, modulo) },
    openGraph: { title: module.title, description: module.headline },
  };
}

export default async function ModulePage({ params }: { params: Promise<Params> }) {
  const { ciclo, modulo } = await params;
  const result = loadModule(ciclo, modulo);
  if (!result.ok) {
    if (result.issues.some((issue) => issue.message === 'módulo não registrado')) notFound();
    return (
      <main id="conteudo" className="flex-1">
        <ContentError issues={result.issues} />
      </main>
    );
  }
  const { module } = result.data;

  return (
    <div data-cycle={module.cycle} className="flex flex-1 flex-col">
      <AppHeader back={{ href: routes.journeys(module.cycle), label: t('back') }} />
      <main id="conteudo" className="flex-1 pb-16 pt-4 md:pt-10">
        <PageContainer width="reading" className="flex flex-col gap-8">
          <div className="animate-enter rounded-hero bg-accent-soft px-4 pb-2 pt-6">
            <Illustration name={module.illustration} className="mx-auto w-full max-w-[26rem]" />
          </div>

          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-caption text-ink-muted">
              <Icon name="clock" className="size-4" />
              {module.estimatedMinutes} {t('moduleMinutes')}
            </p>
            <h1 className="text-display font-bold tracking-[-0.03em]">{module.title}</h1>
            <p className="text-lead text-ink-soft">{module.headline}</p>
          </div>

          <section aria-labelledby="etapas">
            <h2 id="etapas" className="text-heading font-semibold">
              {t('moduleStepsTitle')}
            </h2>
            <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {lessonSteps.map((step, index) => (
                <li
                  key={step.id}
                  className="flex items-center gap-3 rounded-control bg-surface px-3 py-3 shadow-card"
                >
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-tint text-caption font-bold text-accent-strong"
                  >
                    {index + 1}
                  </span>
                  <span className="text-label font-medium">{t(step.labelKey)}</span>
                </li>
              ))}
            </ol>
          </section>

          <ButtonLink
            href={routes.lesson(module.cycle, module.id, 'historia')}
            icon="arrow-right"
            block
          >
            {module.cta}
          </ButtonLink>

          <details className="group rounded-card bg-surface shadow-card">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 font-semibold [&::-webkit-details-marker]:hidden">
              {t('moduleForAdults')}
              <Icon
                name="arrow-right"
                className="size-5 text-ink-muted transition-transform group-open:rotate-90"
              />
            </summary>
            <div className="flex flex-col gap-4 px-5 pb-5 text-label text-ink-soft">
              <p>{module.summary}</p>
              <div>
                <h3 className="font-semibold text-ink">{t('moduleObjectives')}</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {module.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </div>
              <p>
                <span className="font-semibold text-ink">{t('moduleCompetencies')}: </span>
                {module.competencies.join(', ')}
              </p>
            </div>
          </details>
        </PageContainer>
      </main>
    </div>
  );
}
