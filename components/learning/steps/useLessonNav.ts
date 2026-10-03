'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { LessonStepId } from '@/lib/content/types';
import { nextStep, routes } from '@/lib/learning/steps';

/** Avança para a próxima etapa do módulo (rotas estáticas, navegação no cliente). */
export function useLessonNav(cycle: string, moduleId: string, step: LessonStepId) {
  const router = useRouter();
  return useCallback(() => {
    const next = nextStep(step);
    router.push(next ? routes.lesson(cycle, moduleId, next.slug) : routes.module(cycle, moduleId));
  }, [router, cycle, moduleId, step]);
}
