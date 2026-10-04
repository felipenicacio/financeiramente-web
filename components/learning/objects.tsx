'use client';

import { useMemo, useState } from 'react';

import { ConceptIcon, Illustration, type SceneLabels } from '@/components/illustrations';
import { Icon } from '@/components/ui/Icon';
import type {
  AffordObject,
  ChangeObject,
  ChoiceObject,
  ClassifyObject,
  CompareObject,
  ConceptsObject,
  ExplanationObject,
  OrderingObject,
  PricedProduct,
  ReflectionObject,
  StoryObject,
  TrueFalseObject,
} from '@/lib/content/types';
import { t } from '@/lib/content/ui';
import {
  affordResult,
  changeAnswer,
  classifyChoiceState,
  classifyDependsOnContext,
  fillTemplate,
  formatMoney,
  isAcceptedCategory,
  seededRandom,
  shuffle,
  storyMoneyLabels,
} from '@/lib/learning';
import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';

import { ChoiceCard } from './ChoiceCard';
import { ConceptCard } from './ConceptCard';
import { FeedbackCard } from './FeedbackCard';
import { ScreenTitle } from './LessonShell';
import { StoryCard } from './StoryCard';

/** Objetos interativos avisam quando podem avançar. */
type Done = { onComplete: () => void };

// ---------- explanation ----------

export function ExplanationView({ object }: { object: ExplanationObject }) {
  return (
    <section className="animate-enter-side flex flex-col gap-4">
      {object.title ? <ScreenTitle>{object.title}</ScreenTitle> : null}
      {object.illustration ? (
        <div className="grid place-items-center rounded-hero bg-accent-soft py-5">
          <Illustration name={object.illustration} className="w-full max-w-[16rem]" />
        </div>
      ) : null}
      <p className="text-lead leading-relaxed text-ink-soft">{object.body}</p>
      {object.bullets && object.bullets.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {object.bullets.map((b) => (
            <li
              key={b.text}
              className={`${b.tone ? `tone-${b.tone}` : 'tone-neutral'} flex items-center gap-3 rounded-card bg-(--tone-soft) p-3 pr-4`}
            >
              {b.icon ? (
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)">
                  <ConceptIcon icon={b.icon} className="size-6" />
                </span>
              ) : null}
              <span className="font-medium">{b.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

// ---------- story ----------

export function StoryView({ object, onComplete }: { object: StoryObject } & Done) {
  const labels: SceneLabels = useMemo(
    () => (object.values || object.derived ? storyMoneyLabels(object) : {}),
    [object],
  );
  const [choice, setChoice] = useState<string | null>(null);
  const chosen = object.question?.options.find((o) => o.id === choice);

  return (
    <section className="flex flex-col gap-4">
      {object.title ? <ScreenTitle>{object.title}</ScreenTitle> : null}
      <div className="flex flex-col gap-3">
        {object.panels.map((panel, index) => (
          <StoryCard
            key={panel.id}
            illustration={panel.illustration}
            labels={labels}
            text={fillTemplate(panel.text, labels)}
            counter={t('storyCounter', { current: index + 1, total: object.panels.length })}
          />
        ))}
      </div>
      {object.question ? (
        <>
          <h2 className="text-heading font-semibold">{object.question.prompt}</h2>
          <div className="flex flex-col gap-3">
            {object.question.options.map((option) => (
              <ChoiceCard
                key={option.id}
                label={option.label}
                state={choice === option.id ? 'selected' : choice ? 'dimmed' : 'idle'}
                disabled={choice !== null}
                onSelect={() => {
                  setChoice(option.id);
                  onComplete();
                }}
              />
            ))}
          </div>
          {chosen ? (
            <FeedbackCard
              tone="neutral"
              title={t('anyAnswer')}
              body={fillTemplate(chosen.reflection, labels)}
              note={
                object.closing
                  ? { title: t('rememberTitle'), body: fillTemplate(object.closing, labels) }
                  : undefined
              }
            />
          ) : null}
        </>
      ) : object.closing ? (
        <p className="text-ink-soft">{fillTemplate(object.closing, labels)}</p>
      ) : null}
    </section>
  );
}

// ---------- concepts ----------

export function ConceptsView({ object }: { object: ConceptsObject }) {
  return (
    <section className="flex flex-col gap-4">
      {object.title ? <ScreenTitle>{object.title}</ScreenTitle> : null}
      {object.intro ? <p className="text-ink-soft">{object.intro}</p> : null}
      <div className="flex flex-col gap-3">
        {object.concepts.map((concept) => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </div>
      {object.keyIdea ? (
        <div className="animate-enter-side flex flex-col items-center gap-3 rounded-hero bg-surface p-5 text-center shadow-card">
          <p className="text-label font-semibold text-accent-strong">{t('rememberTitle')}</p>
          {object.keyIdeaIllustration ? (
            <Illustration name={object.keyIdeaIllustration} className="size-24" />
          ) : null}
          <p className="text-lead font-medium">{object.keyIdea}</p>
        </div>
      ) : null}
    </section>
  );
}

// ---------- reflection ----------

export function ReflectionView({ object }: { object: ReflectionObject }) {
  return (
    <section className="flex flex-col gap-4">
      <EconominhoGuide variant="bubble" state={object.state} text={object.text} />
      {object.body ? <p className="text-lead text-ink-soft">{object.body}</p> : null}
    </section>
  );
}

// ---------- classification (um item por tela) ----------

export function ClassifyItemView({
  object,
  itemId,
  onComplete,
}: { object: ClassifyObject; itemId: string } & Done) {
  const item = object.items.find((entry) => entry.id === itemId)!;
  const [choice, setChoice] = useState<string | null>(null);
  const accepted = choice !== null && isAcceptedCategory(item, choice);

  return (
    <section className="flex flex-col gap-5">
      {object.instructions ? (
        <p className="text-label text-ink-soft">{object.instructions}</p>
      ) : null}
      <div className="animate-enter-side flex flex-col items-center gap-2 rounded-hero bg-surface p-5 text-center shadow-card">
        {item.illustration ? (
          <span className="grid size-24 place-items-center rounded-full bg-accent-soft">
            <Illustration name={item.illustration} className="size-16" />
          </span>
        ) : null}
        <ScreenTitle>{item.label}</ScreenTitle>
        <p className="text-ink-soft">{item.situation}</p>
      </div>
      <div className="flex flex-col gap-3">
        {object.categories.map((category) => (
          <ChoiceCard
            key={category.id}
            label={category.label}
            detail={category.short}
            tone={`tone-${category.tone}`}
            state={classifyChoiceState(item, category.id, choice)}
            disabled={choice !== null}
            onSelect={() => {
              setChoice(category.id);
              onComplete();
            }}
            leading={
              <span
                className={`tone-${category.tone} grid size-12 place-items-center rounded-full bg-(--tone-tint) text-(--tone-strong)`}
              >
                <ConceptIcon icon={category.icon} className="size-7" />
              </span>
            }
          />
        ))}
      </div>
      {choice !== null ? (
        <FeedbackCard
          key={choice}
          tone={accepted ? 'positive' : 'guide'}
          title={accepted ? t('great') : t('thinkAgain')}
          body={item.feedback}
          note={
            classifyDependsOnContext(item) && item.contextNote
              ? { title: t('itMayChange'), body: item.contextNote }
              : undefined
          }
        />
      ) : null}
    </section>
  );
}

// ---------- preço: compare / afford / change ----------

const productLeading = (product: PricedProduct) => (
  <span className="grid size-14 place-items-center rounded-control bg-slate-100">
    <Illustration name={product.illustration} className="size-11" />
  </span>
);

function PriceFacts({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-control bg-surface/80 px-3 py-2">
          <dt className="text-caption text-ink-muted">{row.label}</dt>
          <dd className="font-bold tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CompareView({ object, onComplete }: { object: CompareObject } & Done) {
  const [choice, setChoice] = useState<string | null>(null);
  const prices = object.products.map((p) => p.price);
  const target = object.target === 'most' ? Math.max(...prices) : Math.min(...prices);
  const ok = choice !== null && object.products.find((p) => p.id === choice)?.price === target;
  return (
    <section className="flex flex-col gap-5">
      <ScreenTitle>{object.prompt}</ScreenTitle>
      <div className="flex flex-col gap-3">
        {object.products.map((product) => (
          <ChoiceCard
            key={product.id}
            label={product.label}
            detail={formatMoney(product.price)}
            leading={productLeading(product)}
            state={
              choice === null
                ? 'idle'
                : product.id === choice
                  ? ok
                    ? 'chosen-ok'
                    : 'chosen-rethink'
                  : product.price === target
                    ? 'expected'
                    : 'dimmed'
            }
            disabled={choice !== null}
            onSelect={() => {
              setChoice(product.id);
              onComplete();
            }}
          />
        ))}
      </div>
      {choice !== null ? (
        <FeedbackCard
          tone={ok ? 'positive' : 'guide'}
          title={ok ? t('great') : t('thinkAgain')}
          body={object.feedback}
          facts={
            <PriceFacts
              rows={[
                ...object.products.map((p) => ({ label: p.label, value: formatMoney(p.price) })),
                {
                  label: t('activityDifference'),
                  value: formatMoney(Math.max(...prices) - Math.min(...prices)),
                },
              ]}
            />
          }
        />
      ) : null}
    </section>
  );
}

export function AffordView({ object, onComplete }: { object: AffordObject } & Done) {
  const [choice, setChoice] = useState<string | null>(null);
  const result = choice ? affordResult(object, choice) : null;
  return (
    <section className="flex flex-col gap-5">
      <ScreenTitle>
        {fillTemplate(object.prompt, { budget: formatMoney(object.budget) })}
      </ScreenTitle>
      <div className="flex flex-col gap-3">
        {object.products.map((product) => (
          <ChoiceCard
            key={product.id}
            label={product.label}
            detail={formatMoney(product.price)}
            leading={productLeading(product)}
            state={
              choice === null
                ? 'idle'
                : product.id === choice
                  ? product.price <= object.budget
                    ? 'chosen-ok'
                    : 'chosen-rethink'
                  : product.price <= object.budget
                    ? 'expected'
                    : 'dimmed'
            }
            disabled={choice !== null}
            onSelect={() => {
              setChoice(product.id);
              onComplete();
            }}
          />
        ))}
      </div>
      {result ? (
        <FeedbackCard
          tone={result.fits ? 'positive' : 'guide'}
          title={result.fits ? t('great') : t('thinkAgain')}
          body={object.feedback}
          facts={
            <PriceFacts
              rows={[
                { label: t('simBudget'), value: formatMoney(object.budget) },
                { label: result.product.label, value: formatMoney(result.product.price) },
                result.fits
                  ? { label: t('activityLeft'), value: formatMoney(result.left) }
                  : { label: t('activityMissing'), value: formatMoney(result.missing) },
              ]}
            />
          }
        />
      ) : null}
    </section>
  );
}

export function ChangeView({ object, onComplete }: { object: ChangeObject } & Done) {
  const [choice, setChoice] = useState<number | null>(null);
  const answer = changeAnswer(object);
  const ok = choice === answer;
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-center gap-4 rounded-hero bg-accent-soft p-4">
        <Illustration name={object.product.illustration} className="size-20" />
        <Illustration name="item-banknote" className="size-16" />
      </div>
      <ScreenTitle>
        {fillTemplate(object.prompt, {
          paid: formatMoney(object.paid),
          price: formatMoney(object.product.price),
        })}
      </ScreenTitle>
      <div className="flex flex-col gap-3">
        {object.options.map((value) => (
          <ChoiceCard
            key={value}
            label={formatMoney(value)}
            leading={
              <span className="grid size-12 place-items-center rounded-full bg-amber-50">
                <Illustration name="item-coins" className="size-9" />
              </span>
            }
            state={
              choice === null
                ? 'idle'
                : value === choice
                  ? value === answer
                    ? 'chosen-ok'
                    : 'chosen-rethink'
                  : value === answer
                    ? 'expected'
                    : 'dimmed'
            }
            disabled={choice !== null}
            onSelect={() => {
              setChoice(value);
              onComplete();
            }}
          />
        ))}
      </div>
      {choice !== null ? (
        <FeedbackCard
          tone={ok ? 'positive' : 'guide'}
          title={ok ? t('great') : t('thinkAgain')}
          body={object.feedback}
          facts={
            <PriceFacts
              rows={[
                { label: t('simBudget'), value: formatMoney(object.paid) },
                { label: t('simPrice'), value: formatMoney(object.product.price) },
                { label: t('activityChangeAnswer'), value: formatMoney(answer) },
              ]}
            />
          }
        />
      ) : null}
    </section>
  );
}

// ---------- choice reflexiva ----------

export function ChoiceView({ object, onComplete }: { object: ChoiceObject } & Done) {
  const [choice, setChoice] = useState<string | null>(null);
  const chosen = object.options.find((o) => o.id === choice);
  return (
    <section className="flex flex-col gap-5">
      {object.illustration ? (
        <div className="grid place-items-center rounded-hero bg-accent-soft py-5">
          <Illustration name={object.illustration} className="w-full max-w-[14rem]" />
        </div>
      ) : null}
      <ScreenTitle>{object.prompt}</ScreenTitle>
      <div className="flex flex-col gap-3">
        {object.options.map((option) => (
          <ChoiceCard
            key={option.id}
            label={option.label}
            state={choice === option.id ? 'selected' : choice ? 'dimmed' : 'idle'}
            disabled={choice !== null}
            onSelect={() => {
              setChoice(option.id);
              onComplete();
            }}
          />
        ))}
      </div>
      {chosen ? (
        <FeedbackCard
          tone="neutral"
          title={t('anyAnswer')}
          body={chosen.reflection}
          note={object.note}
        />
      ) : null}
    </section>
  );
}

// ---------- ordenação ----------

export function OrderingView({ object, onComplete }: { object: OrderingObject } & Done) {
  // Ordem embaralhada de apresentação do banco de itens: estável enquanto a
  // tela estiver ativa (a tela é remontada por `key` a cada nova atividade,
  // o que gera um novo embaralhamento). Nunca ordena pelo `id` nem por
  // qualquer critério que possa revelar a sequência correta. Semeada pelo
  // conteúdo do próprio objeto (estável entre o HTML do build estático e a
  // hidratação no cliente, o que evita erro de hidratação do React).
  const shuffled = useMemo(() => {
    const seed = object.prompt + object.items.map((item) => item.id).join('|');
    return shuffle(object.items, seededRandom(seed));
  }, [object]);
  const [picked, setPicked] = useState<string[]>([]);
  const done = picked.length === object.items.length;
  const correct = done && picked.every((id, i) => id === object.correct[i]);

  // Toggle: clicar num item do banco adiciona ao fim da sequência; clicar
  // num item já escolhido o retira e recalcula a numeração dos que ficaram.
  // Reversível em qualquer momento antes ou depois de completar a
  // sequência — não há "confirmar" separado, então desfazer mesmo após
  // completar volta a tela ao estado "em andamento" (sem feedback).
  const pick = (id: string) => {
    const next = [...picked, id];
    setPicked(next);
    if (next.length === object.items.length) onComplete();
  };
  const unpick = (id: string) => {
    setPicked((prev) => prev.filter((pickedId) => pickedId !== id));
  };

  return (
    <section className="flex flex-col gap-5">
      {object.instructions ? (
        <p className="text-label text-ink-soft">{object.instructions}</p>
      ) : null}
      <ScreenTitle>{object.prompt}</ScreenTitle>

      {picked.length > 0 ? (
        <ol className="flex flex-col gap-2">
          {picked.map((id, index) => {
            const item = object.items.find((i) => i.id === id)!;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={true}
                  aria-label={t('orderingRemove', { label: item.label })}
                  onClick={() => unpick(id)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-card bg-accent-soft p-3 text-left ring-1 ring-inset ring-accent-tint transition-[box-shadow,background-color] enabled:active:scale-[0.99]"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-strong text-caption font-bold text-white">
                    {index + 1}
                  </span>
                  {item.illustration ? (
                    <Illustration name={item.illustration} className="size-9" />
                  ) : null}
                  <span className="min-w-0 flex-1 font-medium">{item.label}</span>
                  <Icon name="close" className="size-4 shrink-0 text-ink-muted" />
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}

      {!done ? (
        <div className="flex flex-col gap-3">
          <p className="text-caption text-ink-muted">{t('orderingPick')}</p>
          {shuffled
            .filter((item) => !picked.includes(item.id))
            .map((item) => (
              <ChoiceCard
                key={item.id}
                label={item.label}
                leading={
                  item.illustration ? (
                    <Illustration name={item.illustration} className="size-10" />
                  ) : undefined
                }
                onSelect={() => pick(item.id)}
              />
            ))}
        </div>
      ) : (
        <FeedbackCard
          tone={correct ? 'positive' : 'guide'}
          title={correct ? t('great') : t('thinkAgain')}
          body={object.feedback}
          note={
            !correct
              ? {
                  title: t('orderingRight'),
                  body: object.correct
                    .map((id, i) => `${i + 1}. ${object.items.find((it) => it.id === id)!.label}`)
                    .join('  '),
                }
              : undefined
          }
        />
      )}
      {done ? (
        <button
          type="button"
          onClick={() => setPicked([])}
          className="self-start text-label font-semibold text-accent-strong underline-offset-4 hover:underline"
        >
          {t('tryAnother')}
        </button>
      ) : null}
    </section>
  );
}

// ---------- verdadeiro ou falso ----------

export function TrueFalseView({ object, onComplete }: { object: TrueFalseObject } & Done) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const answeredCount = Object.keys(answers).length;

  const answer = (id: string, value: boolean) => {
    if (id in answers) return;
    const next = { ...answers, [id]: value };
    setAnswers(next);
    if (Object.keys(next).length === object.statements.length) onComplete();
  };

  return (
    <section className="flex flex-col gap-4">
      {object.prompt ? <ScreenTitle>{object.prompt}</ScreenTitle> : null}
      <p className="text-caption text-ink-muted">
        {t('trueFalseCounter', { current: answeredCount, total: object.statements.length })}
      </p>
      <ul className="flex flex-col gap-3">
        {object.statements.map((s) => {
          const picked = answers[s.id];
          const answered = s.id in answers;
          const right = answered && picked === s.isTrue;
          return (
            <li key={s.id} className="flex flex-col gap-2 rounded-card bg-surface p-4 shadow-card">
              <p className="font-medium">{s.text}</p>
              <div className="flex gap-2">
                {[
                  { v: true, label: t('isTrue') },
                  { v: false, label: t('isFalse') },
                ].map((opt) => {
                  const chosen = picked === opt.v;
                  const base =
                    'min-h-11 flex-1 rounded-full px-4 text-label font-semibold ring-2 ring-inset transition-colors';
                  const style = !answered
                    ? 'ring-line hover:ring-line-strong'
                    : chosen
                      ? right
                        ? 'tone-positive bg-(--tone-soft) ring-(--tone-strong) text-(--tone-strong)'
                        : 'tone-guide bg-(--tone-soft) ring-(--tone-strong) text-(--tone-strong)'
                      : opt.v === s.isTrue
                        ? 'tone-positive ring-(--tone-strong) text-(--tone-strong)'
                        : 'ring-line opacity-50';
                  return (
                    <button
                      key={String(opt.v)}
                      type="button"
                      aria-pressed={chosen}
                      disabled={answered}
                      onClick={() => answer(s.id, opt.v)}
                      className={`${base} ${style}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {answered ? (
                <p
                  role="status"
                  className={`text-label ${right ? 'text-green-700' : 'text-cyan-700'}`}
                >
                  {right ? t('great') : t('thinkAgain')} {s.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
