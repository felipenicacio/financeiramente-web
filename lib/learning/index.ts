import type {
  ActivityItem,
  AffordItem,
  BudgetSimulation,
  ChangeItem,
  CompareItem,
  PricedProduct,
  QuizQuestion,
  SpendOption,
  SpendSimulation,
  Story,
} from '@/lib/content/types';

import { resolveValues } from './expr';

// ---------- dinheiro e templates ----------

/**
 * Formata valores fictícios (ex.: R$ 20, R$ 1.250). Implementação própria,
 * sem Intl, para o resultado ser idêntico no build, nos testes e no navegador.
 */
export function formatMoney(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}R$ ${digits}`;
}

const TOKEN = /\{(\w+)\}/g;

/** Nomes de variáveis citados em um texto, como `{gift}`. */
export function templateTokens(text: string): string[] {
  return Array.from(text.matchAll(TOKEN), (match) => match[1] ?? '');
}

/** Substitui `{nome}` pelo valor. Variáveis desconhecidas ficam visíveis, para o erro aparecer. */
export function fillTemplate(text: string, values: Record<string, string | number>): string {
  return text.replace(TOKEN, (whole, name: string) =>
    name in values ? String(values[name]) : whole,
  );
}

const asMoney = (values: Record<string, number>) =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [key, formatMoney(value)]));

// ---------- história ----------

/** Valores declarados + derivados da história (ex.: troco, quanto falta). */
export function storyValues(story: Pick<Story, 'values' | 'derived'>): Record<string, number> {
  return resolveValues(story.values, story.derived);
}

/** Valores da história já formatados como dinheiro, prontos para `fillTemplate`. */
export function storyMoneyLabels(story: Pick<Story, 'values' | 'derived'>): Record<string, string> {
  return asMoney(storyValues(story));
}

// ---------- simulação: escolher uma opção ----------

export type SpendOutcome = {
  option: SpendOption;
  spent: number;
  /** O que sobra do valor disponível (troco, ou o que vai para a meta). */
  left: number;
  /** Só quando há meta: guardado antes e depois, e quanto falta. */
  goal?: { savedBefore: number; savedAfter: number; missing: number; reached: boolean };
};

/**
 * Consequência de uma escolha. Os números da tela são sempre calculados aqui,
 * a partir do conteúdo, para nunca divergirem do texto editorial.
 */
export function simulateChoice(simulation: SpendSimulation, optionId: string): SpendOutcome | null {
  const option = simulation.options.find((entry) => entry.id === optionId);
  if (!option) return null;
  const spent = Math.min(option.cost, simulation.budget);
  const left = simulation.budget - spent;
  if (!simulation.goal) return { option, spent, left };
  const savedBefore = simulation.goal.saved;
  const total = savedBefore + left;
  const missing = Math.max(simulation.goal.price - total, 0);
  return {
    option,
    spent,
    left,
    goal: {
      savedBefore,
      savedAfter: Math.min(total, simulation.goal.price),
      missing,
      reached: missing === 0,
    },
  };
}

/** Valores citáveis nos textos de uma simulação de escolha. */
export function spendTemplateValues(simulation: SpendSimulation): Record<string, string> {
  return asMoney({
    budget: simulation.budget,
    ...(simulation.goal
      ? { goalPrice: simulation.goal.price, goalSaved: simulation.goal.saved }
      : {}),
  });
}

/** Fração da meta (0 a 1) para a barra de progresso. */
export function goalProgress(saved: number, price: number): number {
  if (price <= 0) return 0;
  return Math.min(Math.max(saved / price, 0), 1);
}

// ---------- simulação: orçamento ----------

export type BudgetState = {
  /** Quanto sai do valor de agora (o custo, ou só a parte "agora" de quem paga depois). */
  spentNow: number;
  leftNow: number;
  /** Total combinado para depois. */
  owedLater: number;
  /** Valor do próximo período já descontando o que ficou para pagar. */
  nextAvailable: number | null;
  /** Itens que ainda cabem no que sobrou. */
  fits: (itemId: string) => boolean;
  /** Quanto falta para um item caber. */
  missingFor: (itemId: string) => number;
};

const nowCost = (item: BudgetSimulation['items'][number]) => item.payLater?.now ?? item.cost;

export function budgetState(
  simulation: BudgetSimulation,
  selected: readonly string[],
): BudgetState {
  const chosen = simulation.items.filter((item) => selected.includes(item.id));
  const spentNow = chosen.reduce((total, item) => total + nowCost(item), 0);
  const owedLater = chosen.reduce((total, item) => total + (item.payLater?.later ?? 0), 0);
  const leftNow = simulation.budget - spentNow;
  const byId = (id: string) => simulation.items.find((item) => item.id === id);
  return {
    spentNow,
    leftNow,
    owedLater,
    nextAvailable: simulation.nextBudget === undefined ? null : simulation.nextBudget - owedLater,
    fits: (id) => {
      const item = byId(id);
      return !!item && (selected.includes(id) || nowCost(item) <= leftNow);
    },
    missingFor: (id) => {
      const item = byId(id);
      return item ? Math.max(nowCost(item) - leftNow, 0) : 0;
    },
  };
}

export function budgetTemplateValues(simulation: BudgetSimulation): Record<string, string> {
  return asMoney({
    budget: simulation.budget,
    ...(simulation.nextBudget !== undefined ? { nextBudget: simulation.nextBudget } : {}),
  });
}

// ---------- atividade ----------

/** Respostas que valem para um item. Para preços, calculadas a partir dos números. */
export function acceptedAnswers(item: ActivityItem): string[] {
  switch (item.kind) {
    case 'classify':
      return item.accepted;
    case 'compare':
      return compareAnswer(item).map((product) => product.id);
    case 'afford':
      return item.products.filter((product) => product.price <= item.budget).map((p) => p.id);
    case 'change':
      return [String(changeAnswer(item))];
  }
}

export function compareAnswer(item: CompareItem): PricedProduct[] {
  const prices = item.products.map((product) => product.price);
  const target = item.target === 'most' ? Math.max(...prices) : Math.min(...prices);
  return item.products.filter((product) => product.price === target);
}

export function changeAnswer(item: ChangeItem): number {
  return item.paid - item.product.price;
}

/** Para "o que posso comprar": quanto sobra ou quanto falta com cada opção. */
export function affordResult(item: AffordItem, productId: string) {
  const product = item.products.find((entry) => entry.id === productId);
  if (!product) return null;
  const difference = item.budget - product.price;
  return {
    product,
    fits: difference >= 0,
    left: Math.max(difference, 0),
    missing: Math.max(-difference, 0),
  };
}

export function isAccepted(item: ActivityItem, answer: string): boolean {
  return acceptedAnswers(item).includes(answer);
}

/** Itens com mais de uma resposta aceita mostram a nota "isso pode mudar". */
export function dependsOnContext(item: ActivityItem): boolean {
  return item.kind === 'classify' && (item.accepted.length > 1 || Boolean(item.contextNote));
}

/**
 * Estado visual de cada alternativa depois de responder. Outras respostas
 * que também valem aparecem marcadas: "quero" e "posso esperar" coexistem.
 */
export type ChoiceResult =
  'idle' | 'chosen-ok' | 'chosen-rethink' | 'also-ok' | 'expected' | 'dimmed';

export function choiceState(
  item: ActivityItem,
  option: string,
  choice: string | null,
): ChoiceResult {
  if (choice === null) return 'idle';
  const accepted = acceptedAnswers(item);
  if (option === choice) return accepted.includes(choice) ? 'chosen-ok' : 'chosen-rethink';
  if (!accepted.includes(option)) return 'dimmed';
  // Perguntas de conta (qual custa mais, troco) têm uma resposta só: ela aparece
  // como "combina mais". Classificação e "o que cabe" podem ter várias.
  return item.kind === 'compare' || item.kind === 'change' ? 'expected' : 'also-ok';
}

// ---------- quiz ----------

export type QuizAnswerResult = 'expected' | 'rethink' | 'open';

/** Perguntas abertas não têm resposta errada. */
export function evaluateQuizAnswer(question: QuizQuestion, optionId: string): QuizAnswerResult {
  if (question.answer.type === 'open') return 'open';
  return question.answer.correctOptionId === optionId ? 'expected' : 'rethink';
}
