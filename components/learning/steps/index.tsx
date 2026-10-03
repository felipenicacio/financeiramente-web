'use client';

import type { LessonStepId, ModuleBundle } from '@/lib/content/types';

import { ActivityStep } from './ActivityStep';
import { ConceptStep } from './ConceptStep';
import { DoneStep } from './DoneStep';
import { QuizStep } from './QuizStep';
import { SimulationStep } from './SimulationStep';
import { StoryStep } from './StoryStep';

const steps = {
  story: StoryStep,
  concept: ConceptStep,
  activity: ActivityStep,
  simulation: SimulationStep,
  quiz: QuizStep,
  done: DoneStep,
} satisfies Record<LessonStepId, (props: { bundle: ModuleBundle }) => React.ReactNode>;

/** Renderiza a etapa pedida. Estado de cada etapa vive só em memória. */
export function LessonStep({ step, bundle }: { step: LessonStepId; bundle: ModuleBundle }) {
  const Step = steps[step];
  return <Step bundle={bundle} />;
}
