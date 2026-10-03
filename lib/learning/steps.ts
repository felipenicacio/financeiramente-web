/**
 * Slugs de lição e rotas do produto.
 *
 * Um módulo tem 5 lições (l01..l05) e um fechamento (avaliação integradora +
 * "O que descobrimos?"). A navegação é livre: nada bloqueia a próxima lição.
 */
export const LESSON_SLUGS = ['l01', 'l02', 'l03', 'l04', 'l05'] as const;
export const CLOSING_SLUG = 'fechamento';

export type LessonSlug = (typeof LESSON_SLUGS)[number] | typeof CLOSING_SLUG;

export function orderFromSlug(slug: string): number | null {
  const index = (LESSON_SLUGS as readonly string[]).indexOf(slug);
  return index >= 0 ? index + 1 : null;
}

export function slugFromOrder(order: number): string {
  return `l${String(order).padStart(2, '0')}`;
}

export function isLessonSlug(slug: string): slug is LessonSlug {
  return slug === CLOSING_SLUG || orderFromSlug(slug) !== null;
}

/** Todas as etapas navegáveis de um módulo, na ordem. */
export function moduleSteps(lessonCount: number): string[] {
  return [...LESSON_SLUGS.slice(0, lessonCount), CLOSING_SLUG];
}

export const routes = {
  home: '/',
  age: '/idade/',
  /** Página da fase: lista os módulos do ciclo. */
  cycle: (cycle: string) => `/jornadas/${cycle}/`,
  journeys: (cycle: string) => `/jornadas/${cycle}/`,
  cycleSummary: (cycle: string) => `/jornadas/${cycle}/o-que-descobrimos/`,
  module: (cycle: string, moduleId: string) => `/modulos/${cycle}/${moduleId}/`,
  lesson: (cycle: string, moduleId: string, slug: string) =>
    `/aprender/${cycle}/${moduleId}/${slug}/`,
};
