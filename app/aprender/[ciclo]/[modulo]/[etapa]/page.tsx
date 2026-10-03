import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentError } from '@/components/layout/ContentError';
import { LessonRunner } from '@/components/learning/LessonRunner';
import { ModuleClosing } from '@/components/learning/ModuleClosing';
import { availableModules, loadCycleSummary, loadModuleBundle, nextModuleId } from '@/lib/content';
import { t } from '@/lib/content/ui';
import {
  CLOSING_SLUG,
  isLessonSlug,
  moduleSteps,
  orderFromSlug,
  routes,
  slugFromOrder,
} from '@/lib/learning/steps';

type Params = { ciclo: string; modulo: string; etapa: string };

export const dynamicParams = false;

/** Uma página estática por lição e pelo fechamento de cada módulo publicado. */
export function generateStaticParams(): Params[] {
  return availableModules().flatMap(({ cycle, moduleId }) => {
    const bundle = loadModuleBundle(cycle, moduleId);
    const count = bundle.ok ? bundle.data.lessons.length : 0;
    return moduleSteps(count).map((etapa) => ({ ciclo: cycle, modulo: moduleId, etapa }));
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciclo, modulo, etapa } = await params;
  const bundle = loadModuleBundle(ciclo, modulo);
  if (!bundle.ok || !isLessonSlug(etapa)) return {};
  const { module, lessons } = bundle.data;
  const order = orderFromSlug(etapa);
  const title =
    etapa === CLOSING_SLUG
      ? `${module.conclusion.title}: ${module.title}`
      : `${lessons.find((l) => l.order === order)?.title ?? module.title} — ${module.title}`;
  return {
    title,
    description: module.headline,
    alternates: { canonical: routes.lesson(ciclo, modulo, etapa) },
    // As etapas são um fluxo; o módulo é a página indexável.
    robots: { index: false, follow: true },
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { ciclo, modulo, etapa } = await params;
  if (!isLessonSlug(etapa)) notFound();

  const bundle = loadModuleBundle(ciclo, modulo);
  if (!bundle.ok) {
    return (
      <main id="conteudo" className="flex-1">
        <ContentError issues={bundle.issues} />
      </main>
    );
  }
  const { module, lessons } = bundle.data;
  const stepLabels = [...lessons.map((lesson) => lesson.title), t('moduleClosingStep')];

  if (etapa === CLOSING_SLUG) {
    const nextId = nextModuleId(ciclo, modulo);
    const next = nextId ? loadModuleBundle(ciclo, nextId) : null;
    return (
      <ModuleClosing
        cycle={ciclo}
        moduleId={modulo}
        stepLabels={stepLabels}
        currentStep={lessons.length}
        module={module}
        nav={{
          nextModule:
            nextId && next?.ok ? { cycle: ciclo, id: nextId, title: next.data.module.title } : null,
          cycleSummary: loadCycleSummary(ciclo)?.ok ? routes.cycleSummary(ciclo) : null,
        }}
      />
    );
  }

  const order = orderFromSlug(etapa)!;
  const lesson = lessons.find((entry) => entry.order === order);
  if (!lesson) notFound();

  const isLastLesson = order >= lessons.length;
  const next = isLastLesson
    ? { href: routes.lesson(ciclo, modulo, CLOSING_SLUG), label: t('lessonToClosing') }
    : { href: routes.lesson(ciclo, modulo, slugFromOrder(order + 1)), label: t('lessonNext') };

  return (
    <LessonRunner
      cycle={ciclo}
      moduleId={modulo}
      stepLabels={stepLabels}
      currentStep={order - 1}
      lesson={lesson}
      next={next}
    />
  );
}
