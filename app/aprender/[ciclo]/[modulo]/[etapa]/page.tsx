import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentError } from '@/components/layout/ContentError';
import { LessonStep } from '@/components/learning/steps';
import { availableModules, loadCycleSummary, loadModule, nextModuleId } from '@/lib/content';
import { t } from '@/lib/content/ui';
import { lessonSteps, routes, stepBySlug } from '@/lib/learning/steps';

type Params = { ciclo: string; modulo: string; etapa: string };

export const dynamicParams = false;

/** Uma página estática por etapa de cada módulo publicado. */
export function generateStaticParams(): Params[] {
  return availableModules().flatMap(({ cycle, moduleId }) =>
    lessonSteps.map((step) => ({ ciclo: cycle, modulo: moduleId, etapa: step.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciclo, modulo, etapa } = await params;
  const result = loadModule(ciclo, modulo);
  const step = stepBySlug(etapa);
  if (!result.ok || !step) return {};
  return {
    title: `${t(step.labelKey)}: ${result.data.module.title}`,
    description: result.data.module.headline,
    alternates: { canonical: routes.lesson(ciclo, modulo, step.slug) },
    // As etapas são parte de um fluxo; o módulo é a página indexável.
    robots: { index: false, follow: true },
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { ciclo, modulo, etapa } = await params;
  const step = stepBySlug(etapa);
  if (!step) notFound();
  const result = loadModule(ciclo, modulo);
  if (!result.ok) {
    return (
      <main id="conteudo" className="flex-1">
        <ContentError issues={result.issues} />
      </main>
    );
  }
  const nextId = nextModuleId(ciclo, modulo);
  const next = nextId ? loadModule(ciclo, nextId) : null;
  const nav = {
    nextModule: nextId && next?.ok ? { id: nextId, title: next.data.module.title } : null,
    hasCycleSummary: loadCycleSummary(ciclo)?.ok ?? false,
  };
  return <LessonStep step={step.id} bundle={result.data} nav={nav} />;
}
