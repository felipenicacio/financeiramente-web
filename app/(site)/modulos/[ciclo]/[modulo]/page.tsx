import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import { econominhoAssets, themePoses, type ThemePose } from '@/components/econominho/assets';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentError } from '@/components/layout/ContentError';
import { PageContainer } from '@/components/layout/PageContainer';
import { Icon } from '@/components/ui/Icon';
import { availableModules, loadModuleBundle } from '@/lib/content';
import { competencyDescription } from '@/lib/content/competencies';
import type { Lesson } from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import { routes, slugFromOrder } from '@/lib/learning/steps';

type Params = { ciclo: string; modulo: string };

const isThemeKey = (value: string | undefined): value is ThemePose =>
  (themePoses as readonly string[]).includes(value ?? '');

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return availableModules().map(({ cycle, moduleId }) => ({ ciclo: cycle, modulo: moduleId }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciclo, modulo } = await params;
  const bundle = loadModuleBundle(ciclo, modulo);
  if (!bundle.ok) return {};
  const { module } = bundle.data;
  return {
    title: `${module.code} · ${module.title}`,
    description: module.headline,
    alternates: { canonical: routes.module(ciclo, modulo) },
    openGraph: { title: module.title, description: module.headline },
  };
}

function AdultsPanel({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="flex flex-col gap-5 px-5 pb-5 text-label text-ink-soft">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="border-t border-line/70 pt-4 first:border-t-0 first:pt-0">
          <h3 className="font-semibold text-ink">
            {t('lessonHeadline', { current: lesson.order, total: lessons.length })}: {lesson.title}
          </h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {lesson.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
          <p className="mt-2">
            <span className="font-semibold text-ink">{t('moduleCompetencies')}: </span>
            {lesson.competencies
              .map((code) => `${code} — ${competencyDescription(code)}`)
              .join('; ')}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-ink">Fontes: </span>
            {lesson.sources.map((source) => `${source.source} (${source.reference})`).join('; ')}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-ink">{t('moduleSensitivity')}: </span>
            {lesson.sensitivity}
          </p>
        </div>
      ))}
    </div>
  );
}

export default async function ModulePage({ params }: { params: Promise<Params> }) {
  const { ciclo, modulo } = await params;
  const bundle = loadModuleBundle(ciclo, modulo);
  if (!bundle.ok) {
    if (bundle.issues.some((issue) => issue.message === 'módulo não registrado')) notFound();
    return (
      <main id="conteudo" className="flex-1">
        <ContentError issues={bundle.issues} />
      </main>
    );
  }
  const { module, lessons } = bundle.data;
  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);

  return (
    <div data-cycle={module.cycle} className="flex flex-1 flex-col">
      <AppHeader back={{ href: routes.journeys(module.cycle), label: t('back') }} />
      <main id="conteudo" className="flex-1 pb-16 pt-4 md:pt-10">
        <PageContainer width="reading" className="flex flex-col gap-8">
          {isThemeKey(module.theme) ? (
            <div className="animate-enter grid place-items-center rounded-hero bg-accent-soft px-4 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- arte local e estática */}
              <img
                src={econominhoAssets.theme(module.theme)}
                alt=""
                className="w-full max-w-[22rem]"
                decoding="async"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
              <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-accent-strong">
                {module.code}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" className="size-4" />
                {totalMinutes} {t('moduleMinutes')}
              </span>
              <span>
                {lessons.length} {lessons.length === 1 ? 'lição' : 'lições'}
              </span>
            </p>
            <h1 className="text-display font-bold tracking-[-0.03em]">{module.title}</h1>
            <p className="text-lead text-ink-soft">{module.headline}</p>
          </div>

          <EconominhoGuide variant="bubble" state="discover" text={module.summary} />

          <section aria-labelledby="licoes" className="flex flex-col gap-3">
            <h2 id="licoes" className="text-heading font-semibold">
              {t('moduleLessonsTitle')}
            </h2>
            <ol className="flex flex-col gap-2.5">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={routes.lesson(module.cycle, module.id, slugFromOrder(lesson.order))}
                    className="group flex items-center gap-4 rounded-card bg-surface p-4 shadow-card transition-shadow hover:shadow-raised"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-tint text-label font-bold text-accent-strong">
                      {lesson.order}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-lead font-semibold leading-snug">{lesson.title}</span>
                      <span className="text-caption text-ink-muted">
                        {lesson.estimatedMinutes} {t('lessonMinutes')}
                      </span>
                    </span>
                    <Icon
                      name="arrow-right"
                      className="size-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={routes.lesson(module.cycle, module.id, 'fechamento')}
                  className="group flex items-center gap-4 rounded-card bg-ink p-4 text-white shadow-card transition-shadow hover:shadow-raised"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
                    <Icon name="check" className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-lead font-semibold leading-snug">
                      {t('moduleClosingStep')}
                    </span>
                    <span className="text-caption text-slate-300">{module.conclusion.title}</span>
                  </span>
                  <Icon
                    name="arrow-right"
                    className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            </ol>
          </section>

          <details className="group rounded-card bg-surface shadow-card">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 font-semibold [&::-webkit-details-marker]:hidden">
              {t('moduleForAdults')}
              <Icon
                name="arrow-right"
                className="size-5 text-ink-muted transition-transform group-open:rotate-90"
              />
            </summary>
            <AdultsPanel lessons={lessons} />
          </details>
        </PageContainer>
      </main>
    </div>
  );
}
