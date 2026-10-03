import type { ModuleBundle } from '@/lib/content/types';
import { simulationTokens, storyTokens, templateTokens } from '@/lib/learning';

import {
  all,
  array,
  literal,
  number,
  object,
  optional,
  refine,
  string,
  uniqueBy,
  type ValidationIssue,
  type Validator,
} from './schema';

/**
 * Limites de tamanho pensados para o C1 (6–8 anos): uma ideia por tela,
 * frases curtas e leitura rápida. Quem escreve o conteúdo recebe o erro com o
 * caminho exato do campo que passou do limite.
 */
const short = string({ maxLength: 40 });
const line = string({ maxLength: 90 });
const paragraph = string({ maxLength: 220 });
const category = literal('need', 'want', 'wait');
const illustration = string({ maxLength: 40 });
const id = string({ maxLength: 40 });
const cycle = literal('c1', 'c2', 'c3', 'c4');
const money = number({ min: 0, max: 100000, integer: true });

/** Texto que só pode citar variáveis conhecidas, como `{gift}`. */
const templated =
  (base: Validator, allowed: readonly string[]): Validator =>
  (value, path) => {
    const issues = base(value, path);
    if (issues.length > 0 || typeof value !== 'string') return issues;
    const unknown = templateTokens(value).filter((token) => !allowed.includes(token));
    return unknown.length > 0
      ? [{ path, message: `variável desconhecida: ${unknown.map((t) => `{${t}}`).join(', ')}` }]
      : [];
  };

export const catalogSchema: Validator = object({
  cycles: all(
    array(
      object({
        id: cycle,
        label: short,
        ageRange: short,
        description: line,
        status: literal('available', 'soon'),
        journeys: array(
          object({
            id,
            title: short,
            description: line,
            modules: all(
              array(object({ id, status: literal('available', 'soon') })),
              uniqueBy('id'),
            ),
          }),
        ),
      }),
      { min: 1 },
    ),
    uniqueBy('id'),
  ),
});

export const moduleSchema: Validator = object({
  id,
  cycle,
  journeyId: id,
  title: line,
  headline: line,
  summary: paragraph,
  competencies: array(string({ maxLength: 20 }), { min: 1 }),
  objectives: array(paragraph, { min: 1 }),
  centralMessage: line,
  estimatedMinutes: number({ min: 1, max: 30, integer: true }),
  illustration,
  cta: short,
  conclusion: object({
    title: line,
    message: paragraph,
    recap: array(object({ category, text: line }), { min: 1, max: 3 }),
  }),
});

const storyText = templated(paragraph, storyTokens);

const storyRules = refine((story: { money: { gift: number; temptation: { price: number } } }) =>
  story.money.temptation.price > story.money.gift
    ? 'money.temptation.price é maior que o presente; a história perde o sentido'
    : null,
);

export const storySchema: Validator = (value, path) => {
  const structural = object({
    title: line,
    money: object({
      gift: money,
      saved: money,
      goal: object({ label: short, price: money }),
      temptation: object({ label: short, price: money }),
    }),
    panels: all(
      array(object({ id, illustration, text: storyText }), { min: 2, max: 6 }),
      uniqueBy('id'),
    ),
    question: object({
      prompt: line,
      options: all(
        array(object({ id, label: line, reflection: storyText }), { min: 2, max: 3 }),
        uniqueBy('id'),
      ),
    }),
    closing: paragraph,
  })(value, path);
  return structural.length > 0 ? structural : storyRules(value, path);
};

export const infographicSchema: Validator = object({
  title: line,
  intro: paragraph,
  categories: all(
    array(
      object({
        id: category,
        label: short,
        short: line,
        description: paragraph,
        examples: array(object({ label: short, illustration }), { min: 1, max: 3 }),
      }),
      { min: 3, max: 3 },
    ),
    uniqueBy('id'),
  ),
  keyIdea: paragraph,
  keyIdeaIllustration: illustration,
});

export const activitySchema: Validator = object({
  title: line,
  instructions: line,
  items: all(
    array(
      object({
        id,
        label: short,
        situation: line,
        illustration,
        accepted: all(array(category, { min: 1, max: 3 }), (value, path) =>
          Array.isArray(value) && new Set(value).size !== value.length
            ? [{ path, message: 'categoria repetida' }]
            : [],
        ),
        feedback: paragraph,
        contextNote: optional(paragraph),
      }),
      { min: 4, max: 8 },
    ),
    uniqueBy('id'),
  ),
});

const simulationRules = refine(
  (sim: {
    budget: number;
    goal: { price: number; saved: number };
    options: { id: string; cost: number }[];
  }) => {
    if (sim.goal.saved >= sim.goal.price) {
      return 'goal.saved já atinge a meta; a simulação perde o sentido';
    }
    const tooExpensive = sim.options.find((option) => option.cost > sim.budget);
    return tooExpensive ? `opção "${tooExpensive.id}" custa mais que o valor disponível` : null;
  },
);

export const simulationSchema: Validator = (value, path) => {
  const structural = object({
    title: line,
    intro: templated(paragraph, simulationTokens),
    budget: number({ min: 1, max: 1000, integer: true }),
    goal: object({
      label: short,
      price: number({ min: 1, integer: true }),
      saved: number({ min: 0, integer: true }),
      illustration,
    }),
    leftoverRule: line,
    options: all(
      array(
        object({
          id,
          label: short,
          cost: number({ min: 0, integer: true }),
          illustration,
          now: paragraph,
          later: paragraph,
        }),
        { min: 2, max: 3 },
      ),
      uniqueBy('id'),
    ),
    wrapUp: paragraph,
  })(value, path);
  return structural.length > 0 ? structural : simulationRules(value, path);
};

const quizRules = refine(
  (quiz: {
    questions: {
      id: string;
      options: { id: string }[];
      answer: { type: string; correctOptionId?: string };
    }[];
  }) => {
    for (const question of quiz.questions) {
      if (question.answer.type === 'single') {
        const exists = question.options.some(
          (option) => option.id === question.answer.correctOptionId,
        );
        if (!exists) {
          return `pergunta "${question.id}": correctOptionId não corresponde a nenhuma opção`;
        }
      }
    }
    if (!quiz.questions.some((question) => question.answer.type === 'open')) {
      return 'o quiz precisa de ao menos uma pergunta aberta (answer.type = "open")';
    }
    return null;
  },
);

const answerSchema: Validator = (value, path) => {
  const typeIssues = object({ type: literal('single', 'open') })(value, path);
  if (typeIssues.length > 0) return typeIssues;
  return (value as { type: string }).type === 'single'
    ? object({ type: literal('single'), correctOptionId: id })(value, path)
    : [];
};

export const quizSchema: Validator = (value, path) => {
  const structural = object({
    title: line,
    questions: all(
      array(
        object({
          id,
          kind: literal('recognition', 'situation', 'decision', 'explanation'),
          prompt: paragraph,
          illustration: optional(illustration),
          options: all(
            array(object({ id, label: line, feedback: optional(paragraph) }), { min: 2, max: 4 }),
            uniqueBy('id'),
          ),
          answer: answerSchema,
          explanation: paragraph,
        }),
        { min: 4, max: 6 },
      ),
      uniqueBy('id'),
    ),
  })(value, path);
  return structural.length > 0 ? structural : quizRules(value, path);
};

export const uiStringsSchema: Validator = (value, path) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return [{ path, message: 'deveria ser objeto' }];
  }
  return Object.entries(value).flatMap(([key, text]) =>
    string({ maxLength: 160 })(text, `${path}.${key}`),
  );
};

export type BundleValidation =
  { ok: true; bundle: ModuleBundle } | { ok: false; issues: ValidationIssue[] };

/** Valida todos os arquivos de um módulo de uma vez e informa o arquivo de cada problema. */
export function validateModuleBundle(raw: Record<keyof ModuleBundle, unknown>): BundleValidation {
  const issues = [
    ...moduleSchema(raw.module, 'module.json'),
    ...storySchema(raw.story, 'story.json'),
    ...infographicSchema(raw.infographic, 'infographic.json'),
    ...activitySchema(raw.activity, 'activity.json'),
    ...simulationSchema(raw.simulation, 'simulation.json'),
    ...quizSchema(raw.quiz, 'quiz.json'),
  ];
  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, bundle: raw as ModuleBundle };
}
