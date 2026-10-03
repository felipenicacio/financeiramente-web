'use client';

import { Illustration } from '@/components/illustrations';
import type { QuizQuestion as QuizQuestionData } from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import { evaluateQuizAnswer } from '@/lib/learning';

import { ChoiceCard, type ChoiceState } from './ChoiceCard';
import { FeedbackCard } from './FeedbackCard';
import { ScreenTitle } from './LessonShell';

type Props = {
  question: QuizQuestionData;
  counter: string;
  answer: string | null;
  onAnswer: (optionId: string) => void;
};

/**
 * Uma pergunta por tela, retorno imediato ao tocar. Perguntas abertas
 * (answer.type = "open") aceitam qualquer opção e mostram a consequência dela.
 */
export function QuizQuestion({ question, counter, answer, onAnswer }: Props) {
  const result = answer ? evaluateQuizAnswer(question, answer) : null;
  const chosen = question.options.find((option) => option.id === answer);
  const expected = question.answer.type === 'single' ? question.answer.correctOptionId : null;

  const stateFor = (optionId: string): ChoiceState => {
    if (!answer) return 'idle';
    if (optionId === answer) {
      return result === 'rethink' ? 'chosen-rethink' : result === 'open' ? 'selected' : 'chosen-ok';
    }
    return optionId === expected ? 'expected' : 'dimmed';
  };

  const title =
    result === 'expected' ? t('great') : result === 'open' ? t('anyAnswer') : t('thinkAgain');
  const body = [chosen?.feedback, question.explanation].filter(Boolean).join(' ');

  return (
    <div key={question.id} className="flex flex-col gap-5">
      <div className="animate-enter-side flex flex-col gap-3">
        <p className="text-caption font-medium text-ink-muted">{counter}</p>
        {question.illustration ? (
          <div className="grid place-items-center rounded-hero bg-accent-soft py-4">
            <Illustration name={question.illustration} className="size-28" />
          </div>
        ) : null}
        <ScreenTitle>{question.prompt}</ScreenTitle>
      </div>
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <ChoiceCard
            key={`${question.id}-${option.id}`}
            label={option.label}
            state={stateFor(option.id)}
            disabled={answer !== null}
            onSelect={() => onAnswer(option.id)}
          />
        ))}
      </div>
      {result ? (
        <FeedbackCard
          tone={result === 'expected' ? 'positive' : result === 'open' ? 'neutral' : 'guide'}
          title={title}
          body={body}
        />
      ) : null}
    </div>
  );
}
