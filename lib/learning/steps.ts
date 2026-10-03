import type { LessonStepId } from '@/lib/content/types';

/**
 * Ordem fixa das etapas de um módulo. Todo módulo segue o mesmo padrão.
 * `slug` é o trecho da URL (em português) e `labelKey` aponta para ui.json.
 */
export const lessonSteps = [
  { id: 'story', slug: 'historia', labelKey: 'stepStory' },
  { id: 'concept', slug: 'conceito', labelKey: 'stepConcept' },
  { id: 'activity', slug: 'atividade', labelKey: 'stepActivity' },
  { id: 'simulation', slug: 'simulacao', labelKey: 'stepSimulation' },
  { id: 'quiz', slug: 'quiz', labelKey: 'stepQuiz' },
  { id: 'done', slug: 'conclusao', labelKey: 'stepDone' },
] as const satisfies readonly { id: LessonStepId; slug: string; labelKey: string }[];

export type LessonStep = (typeof lessonSteps)[number];
export type LessonStepSlug = LessonStep['slug'];

export function stepBySlug(slug: string): LessonStep | undefined {
  return lessonSteps.find((step) => step.slug === slug);
}

export function stepIndex(id: LessonStepId): number {
  return lessonSteps.findIndex((step) => step.id === id);
}

export function nextStep(id: LessonStepId): LessonStep | null {
  const index = stepIndex(id);
  return index >= 0 && index < lessonSteps.length - 1 ? (lessonSteps[index + 1] ?? null) : null;
}

export function previousStep(id: LessonStepId): LessonStep | null {
  const index = stepIndex(id);
  return index > 0 ? (lessonSteps[index - 1] ?? null) : null;
}

/** Rotas do produto, centralizadas para não espalhar strings de URL. */
export const routes = {
  home: '/',
  age: '/idade/',
  journeys: (cycle: string) => `/jornadas/${cycle}/`,
  cycleSummary: (cycle: string) => `/jornadas/${cycle}/o-que-descobrimos/`,
  module: (cycle: string, moduleId: string) => `/modulos/${cycle}/${moduleId}/`,
  lesson: (cycle: string, moduleId: string, slug: LessonStepSlug) =>
    `/aprender/${cycle}/${moduleId}/${slug}/`,
};
