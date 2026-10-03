import type {
  ActivityItem,
  CategoryId,
  QuizQuestion,
  Simulation,
  SimulationOption,
  StoryMoney,
} from '@/lib/content/types';

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

// ---------- história ----------

export type StoryValues = {
  gift: number;
  saved: number;
  goalPrice: number;
  temptationPrice: number;
  /** O que sobra do presente se comprar a tentação. */
  leftIfBuy: number;
  missingIfBuy: number;
  missingIfSave: number;
};

/** Números derivados da história, calculados a partir dos valores declarados. */
export function storyValues(money: StoryMoney): StoryValues {
  const leftIfBuy = Math.max(money.gift - money.temptation.price, 0);
  return {
    gift: money.gift,
    saved: money.saved,
    goalPrice: money.goal.price,
    temptationPrice: money.temptation.price,
    leftIfBuy,
    missingIfBuy: Math.max(money.goal.price - (money.saved + leftIfBuy), 0),
    missingIfSave: Math.max(money.goal.price - (money.saved + money.gift), 0),
  };
}

export const storyTokens = Object.keys(
  storyValues({
    gift: 0,
    saved: 0,
    goal: { label: '', price: 0 },
    temptation: { label: '', price: 0 },
  }),
);

/** Valores da história já formatados como dinheiro, prontos para `fillTemplate`. */
export function storyMoneyLabels(money: StoryMoney): Record<string, string> {
  return Object.fromEntries(
    Object.entries(storyValues(money)).map(([key, value]) => [key, formatMoney(value)]),
  );
}

export const simulationTokens = ['budget'];

// ---------- simulação ----------

export type SimulationOutcome = {
  option: SimulationOption;
  /** Quanto foi gasto. */
  spent: number;
  /** Quanto sobra do valor disponível depois da escolha. */
  left: number;
  /** Guardado na meta antes e depois (o que sobra vai para o pote). */
  savedBefore: number;
  savedAfter: number;
  missing: number;
  reached: boolean;
};

/**
 * Consequência de uma escolha na simulação. Os números da tela são sempre
 * calculados aqui, a partir do conteúdo, para nunca divergirem do texto editorial.
 */
export function simulateChoice(simulation: Simulation, optionId: string): SimulationOutcome | null {
  const option = simulation.options.find((entry) => entry.id === optionId);
  if (!option) return null;
  const spent = Math.min(option.cost, simulation.budget);
  const left = simulation.budget - spent;
  const savedBefore = simulation.goal.saved;
  const total = savedBefore + left;
  const savedAfter = Math.min(total, simulation.goal.price);
  const missing = Math.max(simulation.goal.price - total, 0);
  return { option, spent, left, savedBefore, savedAfter, missing, reached: missing === 0 };
}

/** Fração da meta (0 a 1) para a barra de progresso. */
export function goalProgress(saved: number, price: number): number {
  if (price <= 0) return 0;
  return Math.min(Math.max(saved / price, 0), 1);
}

// ---------- atividade ----------

/** Uma classificação é aceita se estiver entre as respostas possíveis do item. */
export function isAcceptedCategory(item: ActivityItem, choice: CategoryId): boolean {
  return item.accepted.includes(choice);
}

/** Itens com mais de uma resposta aceita mostram a nota "isso pode mudar". */
export function dependsOnContext(item: ActivityItem): boolean {
  return item.accepted.length > 1 || Boolean(item.contextNote);
}

/**
 * Estado visual de cada categoria depois de responder. Respostas que também
 * valem aparecem marcadas, para mostrar que "quero" e "posso esperar" coexistem.
 */
export type ChoiceResult = 'idle' | 'chosen-ok' | 'chosen-rethink' | 'also-ok' | 'dimmed';

export function activityChoiceState(
  item: ActivityItem,
  category: CategoryId,
  choice: CategoryId | null,
): ChoiceResult {
  if (choice === null) return 'idle';
  if (category === choice) return isAcceptedCategory(item, choice) ? 'chosen-ok' : 'chosen-rethink';
  return isAcceptedCategory(item, category) ? 'also-ok' : 'dimmed';
}

// ---------- quiz ----------

export type QuizAnswerResult = 'expected' | 'rethink' | 'open';

/** Perguntas abertas não têm resposta errada. */
export function evaluateQuizAnswer(question: QuizQuestion, optionId: string): QuizAnswerResult {
  if (question.answer.type === 'open') return 'open';
  return question.answer.correctOptionId === optionId ? 'expected' : 'rethink';
}
