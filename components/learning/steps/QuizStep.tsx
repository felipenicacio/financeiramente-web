'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { t } from '@/lib/content/ui';

import { LessonShell } from '../LessonShell';
import { QuizQuestion } from '../QuizQuestion';
import type { StepProps } from './types';
import { useLessonNav } from './useLessonNav';

/** Quiz sem pontos nem placar: o objetivo é conversar sobre as respostas. */
export function QuizStep({ bundle }: StepProps) {
  const { module, quiz } = bundle;
  const goNext = useLessonNav(module.cycle, module.id, 'quiz');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);

  const question = quiz.questions[index];
  if (!question) return null;
  const isLast = index === quiz.questions.length - 1;

  const advance = () => {
    if (isLast) return goNext();
    setAnswer(null);
    setIndex((value) => value + 1);
  };

  return (
    <LessonShell
      cycle={module.cycle}
      moduleId={module.id}
      step="quiz"
      screenKey={`quiz-${index}`}
      footer={
        <Button icon="arrow-right" onClick={advance} disabled={!answer}>
          {isLast ? t('continue') : t('next')}
        </Button>
      }
    >
      <QuizQuestion
        key={question.id}
        question={question}
        counter={t('quizCounter', { current: index + 1, total: quiz.questions.length })}
        answer={answer}
        onAnswer={setAnswer}
      />
    </LessonShell>
  );
}
