import type {
  AffordObject,
  ChangeObject,
  ClassifyItem,
  CompareObject,
  LessonObject,
  PricedProduct,
  QuizQuestion,
  StoryObject,
} from '@/lib/content/types';

import { resolveValues } from './expr';

// ---------- dinheiro e templates ----------

/** Formata reais sem centavos, igual no build, nos testes e no navegador. */
export function formatMoney(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}R$ ${digits}`;
}

const TOKEN = /\{(\w+)\}/g;

export function templateTokens(text: string): string[] {
  return Array.from(text.matchAll(TOKEN), (match) => match[1] ?? '');
}

export function fillTemplate(
  text: string,
  values: Record<string, string | number | undefined>,
): string {
  return text.replace(TOKEN, (whole, name: string) => {
    const value = values[name];
    return value != null ? String(value) : whole;
  });
}

const asMoney = (values: Record<string, number>) =>
  Object.fromEntries(Object.entries(values).map(([k, v]) => [k, formatMoney(v)]));

// ---------- história ----------

export function storyValues(story: Pick<StoryObject, 'values' | 'derived'>): Record<string, number> {
  return resolveValues(story.values ?? {}, story.derived ?? []);
}

export function storyMoneyLabels(story: Pick<StoryObject, 'values' | 'derived'>): Record<string, string> {
  return asMoney(storyValues(story));
}

export function goalProgress(saved: number, price: number): number {
  if (price <= 0) return 0;
  return Math.min(Math.max(saved / price, 0), 1);
}

// ---------- atividades de preço ----------

export function compareAnswer(obj: CompareObject): PricedProduct[] {
  const prices = obj.products.map((p) => p.price);
  const target = obj.target === 'most' ? Math.max(...prices) : Math.min(...prices);
  return obj.products.filter((p) => p.price === target);
}

export function changeAnswer(obj: ChangeObject): number {
  return obj.paid - obj.product.price;
}

export function affordResult(obj: AffordObject, productId: string) {
  const product = obj.products.find((p) => p.id === productId);
  if (!product) return null;
  const diff = obj.budget - product.price;
  return { product, fits: diff >= 0, left: Math.max(diff, 0), missing: Math.max(-diff, 0) };
}

// ---------- classificação ----------

export function isAcceptedCategory(item: ClassifyItem, choice: string): boolean {
  return item.accepted.includes(choice);
}

export function classifyDependsOnContext(item: ClassifyItem): boolean {
  return item.accepted.length > 1 || Boolean(item.contextNote);
}

export type ChoiceResult = 'idle' | 'chosen-ok' | 'chosen-rethink' | 'also-ok' | 'expected' | 'dimmed';

export function classifyChoiceState(item: ClassifyItem, category: string, choice: string | null): ChoiceResult {
  if (choice === null) return 'idle';
  if (category === choice) return isAcceptedCategory(item, choice) ? 'chosen-ok' : 'chosen-rethink';
  return isAcceptedCategory(item, category) ? 'also-ok' : 'dimmed';
}

// ---------- quiz ----------

export type QuizAnswerResult = 'expected' | 'rethink' | 'open';

export function evaluateQuizAnswer(question: QuizQuestion, optionId: string): QuizAnswerResult {
  if (question.answer.type === 'open') return 'open';
  return question.answer.correctOptionId === optionId ? 'expected' : 'rethink';
}

// ---------- objetos: quais são interativos ----------

const INTERACTIVE: ReadonlySet<LessonObject['type']> = new Set([
  'classify',
  'compare',
  'afford',
  'change',
  'choice',
  'ordering',
  'trueFalse',
  'quiz',
]);

/** Um objeto exige ação antes de avançar. */
export function isInteractive(object: LessonObject): boolean {
  return INTERACTIVE.has(object.type);
}
