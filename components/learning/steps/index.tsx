'use client';

import type { LessonStepId, ModuleBundle } from '@/lib/content/types';

import { ActivityStep } from './ActivityStep';
import { ConceptStep } from './ConceptStep';
import { DoneStep } from './DoneStep';
import { QuizStep } from './QuizStep';
import { SimulationStep } from './SimulationStep';
import { StoryStep } from './StoryStep';
import type { LessonNav } from './types';

const steps = {
  story: StoryStep,
  concept: ConceptStep,
  activity: ActivityStep,
  simulation: SimulationStep,
  quiz: QuizStep,
  done: DoneStep,
} satisfies Record<
  LessonStepId,
  (props: { bundle: ModuleBundle; nav?: LessonNav }) => React.ReactNode
>;

/** Renderiza a etapa pedida. Estado de cada etapa vive só em memória. */
export function LessonStep({
  step,
  bundle,
  nav,
}: {
  step: LessonStepId;
  bundle: ModuleBundle;
  nav: LessonNav;
}) {
  const Step = steps[step];
  return <Step bundle={bundle} nav={nav} />;
}
