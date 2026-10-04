'use client';

import Link from 'next/link';
import { Fragment, useMemo, useState, type ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';
import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';
import type { Lesson, LessonObject } from '@/lib/content/types';
import { t } from '@/lib/content/ui';

import { seededRandom, shuffle } from '@/lib/learning';

import { LessonShell, ScreenTitle } from './LessonShell';
import {
  AffordView,
  ChangeView,
  ChoiceView,
  ClassifyItemView,
  CompareView,
  ConceptsView,
  ExplanationView,
  OrderingView,
  ReflectionView,
  StoryView,
  TrueFalseView,
} from './objects';
import { QuizQuestion } from './QuizQuestion';

export type Done = { onComplete: () => void };

/** Destino após a última tela da lição (próxima lição ou fechamento do módulo). */
type Next = { href: string; label: string };

type Props = {
  cycle: string;
  moduleId: string;
  stepLabels: string[];
  currentStep: number;
  lesson: Lesson;
  next: Next;
};

export type Screen = {
  key: string;
  interactive: boolean;
  /** Tela de síntese final: o rodapé vira link para o próximo passo. */
  summary?: boolean;
  render: (done: Done) => ReactNode;
};

// ---------- uma pergunta de quiz por tela, com estado próprio ----------

function QuizScreen({
  object,
  index,
  total,
  onComplete,
}: {
  object: Extract<LessonObject, { type: 'quiz' }>;
  index: number;
  total: number;
} & Done) {
  const [answer, setAnswer] = useState<string | null>(null);
  const question = object.questions[index]!;
  // Ordem embaralhada de apresentação: a correção continua resolvida pelo
  // `id` da alternativa, nunca pela posição. Semeada pelo `id` da pergunta
  // (estável entre o HTML do build estático e a hidratação no cliente, o
  // que evita erro de hidratação do React) e memoizada para ficar estável
  // enquanto a tela estiver na tela (não reembaralha a cada render nem
  // depois de responder); a próxima pergunta, remontada por `key` em
  // screensForObject, recebe seu próprio embaralhamento.
  const shuffledOptions = useMemo(
    () => shuffle(question.options, seededRandom(question.id)),
    [question],
  );
  return (
    <QuizQuestion
      question={{ ...question, options: shuffledOptions }}
      counter={t('quizCounter', { current: index + 1, total })}
      answer={answer}
      onAnswer={(optionId) => {
        if (answer) return;
        setAnswer(optionId);
        onComplete();
      }}
    />
  );
}

// ---------- um objeto vira uma ou mais telas ----------

export function screensForObject(object: LessonObject, keyBase: string): Screen[] {
  switch (object.type) {
    case 'explanation':
      return [
        { key: keyBase, interactive: false, render: () => <ExplanationView object={object} /> },
      ];
    case 'story':
      return [
        {
          key: keyBase,
          interactive: Boolean(object.question),
          render: ({ onComplete }) => <StoryView object={object} onComplete={onComplete} />,
        },
      ];
    case 'concepts':
      return [{ key: keyBase, interactive: false, render: () => <ConceptsView object={object} /> }];
    case 'reflection':
      return [
        { key: keyBase, interactive: false, render: () => <ReflectionView object={object} /> },
      ];
    case 'classify':
      return object.items.map((item) => ({
        key: `${keyBase}-${item.id}`,
        interactive: true,
        render: ({ onComplete }) => (
          <ClassifyItemView object={object} itemId={item.id} onComplete={onComplete} />
        ),
      }));
    case 'compare':
      return [
        {
          key: keyBase,
          interactive: true,
          render: ({ onComplete }) => <CompareView object={object} onComplete={onComplete} />,
        },
      ];
    case 'afford':
      return [
        {
          key: keyBase,
          interactive: true,
          render: ({ onComplete }) => <AffordView object={object} onComplete={onComplete} />,
        },
      ];
    case 'change':
      return [
        {
          key: keyBase,
          interactive: true,
          render: ({ onComplete }) => <ChangeView object={object} onComplete={onComplete} />,
        },
      ];
    case 'choice':
      return [
        {
          key: keyBase,
          interactive: true,
          render: ({ onComplete }) => <ChoiceView object={object} onComplete={onComplete} />,
        },
      ];
    case 'ordering':
      return [
        {
          key: keyBase,
          interactive: true,
          render: ({ onComplete }) => <OrderingView object={object} onComplete={onComplete} />,
        },
      ];
    case 'trueFalse':
      return [
        {
          key: keyBase,
          interactive: true,
          render: ({ onComplete }) => <TrueFalseView object={object} onComplete={onComplete} />,
        },
      ];
    case 'quiz':
      return object.questions.map((question, index) => ({
        key: `${keyBase}-${question.id}`,
        interactive: true,
        render: ({ onComplete }) => (
          <QuizScreen
            object={object}
            index={index}
            total={object.questions.length}
            onComplete={onComplete}
          />
        ),
      }));
    default: {
      // Exaustividade: um tipo novo não compila sem tratamento aqui.
      const _never: never = object;
      return _never;
    }
  }
}

function LessonSummaryView({ lesson }: { lesson: Lesson }) {
  return (
    <section className="flex flex-col gap-5">
      <EconominhoGuide variant="bubble" state="summary" text={lesson.headline} />
      <div className="rounded-hero bg-surface p-5 shadow-card sm:p-6">
        <p className="text-label font-semibold text-accent-strong">{t('lessonSummaryTitle')}</p>
        <ScreenTitle as="h2">{lesson.title}</ScreenTitle>
        <ul className="mt-3 flex flex-col gap-2.5">
          {lesson.summary.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-strong">
                <Icon name="check" className="size-4" />
              </span>
              <span className="font-medium">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Motor da lição: achata os objetos em telas, libera o avanço e navega ao fim. */
export function LessonRunner({ cycle, moduleId, stepLabels, currentStep, lesson, next }: Props) {
  const screens = useMemo<Screen[]>(() => {
    const content = lesson.content.flatMap((object, index) =>
      screensForObject(object, `o${index}`),
    );
    const summary: Screen = {
      key: 'resumo',
      interactive: false,
      summary: true,
      render: () => <LessonSummaryView lesson={lesson} />,
    };
    return [...content, summary];
  }, [lesson]);

  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(() => !screens[0]!.interactive);

  const screen = screens[index]!;
  const isLast = index === screens.length - 1;

  const goNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= screens.length) return;
    setIndex(nextIndex);
    setUnlocked(!screens[nextIndex]!.interactive);
  };

  const primary = screen.summary ? (
    <Link
      href={next.href}
      className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-accent-strong px-6 text-lead font-semibold text-white transition-transform active:scale-[0.99]"
    >
      {next.label}
      <Icon name="arrow-right" className="size-5" />
    </Link>
  ) : (
    <button
      type="button"
      disabled={!unlocked}
      onClick={goNext}
      className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-accent-strong px-6 text-lead font-semibold text-white transition-[transform,opacity] active:scale-[0.99] disabled:opacity-40"
    >
      {t('continue')}
      <Icon name="arrow-right" className="size-5" />
    </button>
  );

  return (
    <LessonShell
      cycle={cycle}
      moduleId={moduleId}
      stepLabels={stepLabels}
      currentStep={currentStep}
      screenKey={`${lesson.id}-${screen.key}`}
      footer={primary}
    >
      {screens.length > 2 && !isLast ? (
        <p className="text-caption font-medium text-ink-muted">
          {t('screenCounter', { current: index + 1, total: screens.length - 1 })}
        </p>
      ) : null}
      {/* key por tela: remonta o objeto e zera o estado interno (escolha/resposta)
          ao trocar de tela, mesmo entre objetos do mesmo tipo. */}
      <Fragment key={screen.key}>{screen.render({ onComplete: () => setUnlocked(true) })}</Fragment>
    </LessonShell>
  );
}
