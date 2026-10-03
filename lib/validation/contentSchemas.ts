import type { ModuleBundle } from '@/lib/content/types';
import { resolveValues } from '@/lib/learning/expr';
import { templateTokens } from '@/lib/learning';

import {
  all,
  array,
  literal,
  number,
  object,
  optional,
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
const illustration = string({ maxLength: 40 });
const id = (value: unknown, path: string): ValidationIssue[] => {
  const base = string({ maxLength: 40 })(value, path);
  if (base.length > 0) return base;
  return /^[a-z0-9][a-z0-9-]*$/.test(value as string)
    ? []
    : [{ path, message: 'id deve usar letras minúsculas, números e hífen' }];
};
const name = (value: unknown, path: string): ValidationIssue[] => {
  const base = string({ maxLength: 30 })(value, path);
  if (base.length > 0) return base;
  return /^[A-Za-z_]\w*$/.test(value as string)
    ? []
    : [{ path, message: 'nome de valor deve usar letras, números e _' }];
};
const cycle = literal('c1', 'c2', 'c3', 'c4');
const money = number({ min: 0, max: 100000, integer: true });
export const toneValues = ['teal', 'coral', 'amber', 'cyan', 'purple', 'green'] as const;
const tone = literal(...toneValues);
export const conceptIconValues = [
  'need',
  'want',
  'wait',
  'money',
  'price',
  'change',
  'care',
  'shared',
  'ad',
  'info',
  'persuade',
  'work',
  'good',
  'service',
  'income',
  'limit',
  'later',
  'choice',
] as const;
const conceptIcon = literal(...conceptIconValues);
const guideLine = object({
  state: literal('ask', 'discover', 'compare', 'consequence', 'summary', 'reflect'),
  text: line,
});

/** Código de competência, ex.: F-D1-C1-01. */
export const competencyCode = /^F-D\d+-C[1-4]-\d{2}$/;

/** Texto que só pode citar variáveis conhecidas, como `{budget}`. */
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

/** Escolhe o validador pelo valor de `kind`. */
const byKind =
  (validators: Record<string, Validator>): Validator =>
  (value, path) => {
    const kind = (value as { kind?: unknown } | null)?.kind;
    const validator = typeof kind === 'string' ? validators[kind] : undefined;
    return validator
      ? validator(value, path)
      : [
          {
            path: `${path}.kind`,
            message: `deveria ser um de: ${Object.keys(validators).join(', ')}`,
          },
        ];
  };

const withRules =
  (structural: Validator, rules: (value: never, path: string) => ValidationIssue[]): Validator =>
  (value, path) => {
    const issues = structural(value, path);
    return issues.length > 0 ? issues : rules(value as never, path);
  };

// ---------- catálogo ----------

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

export const cycleSummarySchema: Validator = object({
  cycle,
  title: line,
  intro: paragraph,
  discoveries: array(object({ text: line, icon: conceptIcon, tone, module: id }), {
    min: 3,
    max: 8,
  }),
  guide: guideLine,
  closing: paragraph,
});

// ---------- módulo ----------

export const moduleSchema: Validator = object({
  id,
  cycle,
  journeyId: id,
  stage: short,
  title: line,
  headline: line,
  summary: paragraph,
  competencies: all(
    array(
      object({
        code: (value, path) =>
          typeof value === 'string' && competencyCode.test(value)
            ? []
            : [{ path, message: 'código de competência inválido (ex.: F-D1-C1-01)' }],
        description: paragraph,
      }),
      { min: 1, max: 4 },
    ),
    uniqueBy('code'),
  ),
  sensitivity: literal('N1', 'N2'),
  objectives: array(paragraph, { min: 1, max: 8 }),
  centralMessage: line,
  estimatedMinutes: number({ min: 1, max: 30, integer: true }),
  illustration,
  cta: short,
  guide: object({
    opening: guideLine,
    story: guideLine,
    concept: guideLine,
    activity: guideLine,
    simulation: guideLine,
    quiz: guideLine,
    done: guideLine,
  }),
  conclusion: object({
    title: line,
    message: paragraph,
    recap: array(object({ icon: conceptIcon, tone, text: line }), { min: 2, max: 4 }),
  }),
});

// ---------- história ----------

export const storySchema: Validator = withRules(
  object({
    title: line,
    values: (value, path) => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return [{ path, message: 'deveria ser objeto de valores em reais' }];
      }
      return Object.entries(value).flatMap(([key, entry]) => [
        ...name(key, `${path}.${key}`),
        ...money(entry, `${path}.${key}`),
      ]);
    },
    derived: all(array(object({ name, expr: string({ maxLength: 120 }) })), uniqueBy('name')),
    panels: all(
      array(object({ id, illustration, text: paragraph }), { min: 2, max: 6 }),
      uniqueBy('id'),
    ),
    question: object({
      prompt: line,
      options: all(
        array(object({ id, label: line, reflection: paragraph }), { min: 2, max: 3 }),
        uniqueBy('id'),
      ),
    }),
    closing: paragraph,
  }),
  (
    story: {
      values: Record<string, number>;
      derived: { name: string; expr: string }[];
      panels: { text: string }[];
      question: { options: { reflection: string }[] };
      closing: string;
    },
    path: string,
  ) => {
    let resolved: Record<string, number>;
    try {
      resolved = resolveValues(story.values, story.derived);
    } catch (error) {
      return [{ path: `${path}.derived`, message: (error as Error).message }];
    }
    const issues: ValidationIssue[] = [];
    for (const entry of story.derived) {
      if ((resolved[entry.name] ?? 0) < 0) {
        issues.push({ path: `${path}.derived`, message: `"${entry.name}" ficou negativo` });
      }
    }
    const allowed = Object.keys(resolved);
    const check = (text: string, at: string) =>
      issues.push(...templated(paragraph, allowed)(text, at));
    story.panels.forEach((panel, index) => check(panel.text, `${path}.panels[${index}].text`));
    story.question.options.forEach((option, index) =>
      check(option.reflection, `${path}.question.options[${index}].reflection`),
    );
    check(story.closing, `${path}.closing`);
    return issues;
  },
);

// ---------- conceito ----------

export const infographicSchema: Validator = object({
  title: line,
  intro: paragraph,
  concepts: all(
    array(
      object({
        id,
        label: short,
        short: line,
        description: paragraph,
        icon: conceptIcon,
        tone,
        examples: array(object({ label: short, illustration }), { max: 3 }),
      }),
      { min: 2, max: 4 },
    ),
    uniqueBy('id'),
  ),
  keyIdea: paragraph,
  keyIdeaIllustration: illustration,
});

// ---------- atividade ----------

const product = object({ id, label: short, price: money, illustration });

const classifyItem = object({
  kind: literal('classify'),
  id,
  label: line,
  situation: line,
  illustration: optional(illustration),
  accepted: all(array(id, { min: 1, max: 3 }), (value, path) =>
    Array.isArray(value) && new Set(value).size !== value.length
      ? [{ path, message: 'categoria repetida' }]
      : [],
  ),
  feedback: paragraph,
  contextNote: optional(paragraph),
});

const compareItem = withRules(
  object({
    kind: literal('compare'),
    id,
    prompt: line,
    target: literal('most', 'least'),
    products: all(array(product, { min: 2, max: 3 }), uniqueBy('id')),
    feedback: paragraph,
  }),
  (item: { target: string; products: { price: number }[] }, path: string) => {
    const prices = item.products.map((entry) => entry.price);
    const target = item.target === 'most' ? Math.max(...prices) : Math.min(...prices);
    return prices.filter((price) => price === target).length > 1
      ? [{ path, message: 'empate de preços: a pergunta precisa de uma resposta só' }]
      : [];
  },
);

const affordItem = withRules(
  object({
    kind: literal('afford'),
    id,
    prompt: templated(line, ['budget']),
    budget: money,
    products: all(array(product, { min: 2, max: 3 }), uniqueBy('id')),
    feedback: paragraph,
  }),
  (item: { budget: number; products: { price: number }[] }, path: string) =>
    item.products.some((entry) => entry.price <= item.budget)
      ? []
      : [{ path, message: 'nenhuma opção cabe no valor disponível' }],
);

const changeItem = withRules(
  object({
    kind: literal('change'),
    id,
    prompt: templated(line, ['paid', 'price']),
    paid: money,
    product,
    options: array(money, { min: 2, max: 4 }),
    feedback: paragraph,
  }),
  (item: { paid: number; product: { price: number }; options: number[] }, path: string) => {
    const answer = item.paid - item.product.price;
    if (answer < 0) return [{ path, message: 'valor pago é menor que o preço' }];
    if (new Set(item.options).size !== item.options.length) {
      return [{ path: `${path}.options`, message: 'opções repetidas' }];
    }
    return item.options.includes(answer)
      ? []
      : [
          {
            path: `${path}.options`,
            message: `as opções precisam incluir o troco calculado (${answer})`,
          },
        ];
  },
);

export const activitySchema: Validator = withRules(
  object({
    title: line,
    instructions: line,
    categories: all(
      array(object({ id, label: short, short: line, icon: conceptIcon, tone }), { max: 4 }),
      uniqueBy('id'),
    ),
    items: all(
      array(
        byKind({
          classify: classifyItem,
          compare: compareItem,
          afford: affordItem,
          change: changeItem,
        }),
        { min: 4, max: 8 },
      ),
      uniqueBy('id'),
    ),
  }),
  (
    activity: {
      categories: { id: string }[];
      items: { kind: string; id: string; accepted?: string[] }[];
    },
    path: string,
  ) => {
    const known = new Set(activity.categories.map((entry) => entry.id));
    const issues: ValidationIssue[] = [];
    const classify = activity.items.filter((item) => item.kind === 'classify');
    if (classify.length > 0 && known.size < 2) {
      issues.push({
        path: `${path}.categories`,
        message: 'itens "classify" precisam de ao menos 2 categorias',
      });
    }
    activity.items.forEach((item, index) => {
      for (const answer of item.accepted ?? []) {
        if (!known.has(answer)) {
          issues.push({
            path: `${path}.items[${index}].accepted`,
            message: `categoria inexistente: ${answer}`,
          });
        }
      }
    });
    return issues;
  },
);

// ---------- simulação ----------

const spendSimulation = withRules(
  object({
    kind: literal('spend'),
    title: line,
    intro: paragraph,
    budget: number({ min: 1, max: 1000, integer: true }),
    goal: optional(
      object({
        label: short,
        price: number({ min: 1, integer: true }),
        saved: number({ min: 0, integer: true }),
        illustration,
      }),
    ),
    leftoverRule: line,
    options: all(
      array(
        object({ id, label: short, cost: money, illustration, now: paragraph, later: paragraph }),
        { min: 2, max: 3 },
      ),
      uniqueBy('id'),
    ),
    wrapUp: paragraph,
  }),
  (
    sim: {
      intro: string;
      budget: number;
      goal?: { price: number; saved: number };
      options: { id: string; cost: number; now: string; later: string }[];
    },
    path: string,
  ) => {
    const issues: ValidationIssue[] = [];
    if (sim.goal && sim.goal.saved >= sim.goal.price) {
      issues.push({
        path: `${path}.goal`,
        message: 'goal.saved já atinge a meta; a simulação perde o sentido',
      });
    }
    const tooExpensive = sim.options.find((option) => option.cost > sim.budget);
    if (tooExpensive) {
      issues.push({
        path,
        message: `opção "${tooExpensive.id}" custa mais que o valor disponível`,
      });
    }
    const tokens = ['budget', ...(sim.goal ? ['goalPrice', 'goalSaved'] : [])];
    issues.push(...templated(paragraph, tokens)(sim.intro, `${path}.intro`));
    sim.options.forEach((option, index) => {
      issues.push(...templated(paragraph, tokens)(option.now, `${path}.options[${index}].now`));
      issues.push(...templated(paragraph, tokens)(option.later, `${path}.options[${index}].later`));
    });
    return issues;
  },
);

const presentationSimulation = withRules(
  object({
    kind: literal('presentation'),
    title: line,
    intro: paragraph,
    product: object({ label: short, illustration, facts: array(line, { min: 1, max: 4 }) }),
    versions: all(
      array(
        object({
          id,
          label: short,
          style: literal('plain', 'loud'),
          headline: short,
          lines: array(line, { min: 1, max: 4 }),
        }),
        { min: 2, max: 2 },
      ),
      uniqueBy('id'),
    ),
    question: object({
      prompt: line,
      options: all(
        array(object({ id, label: line, reflection: paragraph }), { min: 2, max: 3 }),
        uniqueBy('id'),
      ),
    }),
    wrapUp: paragraph,
  }),
  (sim: { versions: { style: string }[] }, path: string) =>
    new Set(sim.versions.map((version) => version.style)).size === 2
      ? []
      : [{ path: `${path}.versions`, message: 'precisa de uma versão "plain" e uma "loud"' }],
);

const budgetSimulation = withRules(
  object({
    kind: literal('budget'),
    title: line,
    intro: paragraph,
    budget: number({ min: 1, max: 1000, integer: true }),
    nextBudget: optional(number({ min: 1, max: 1000, integer: true })),
    nextLabel: optional(short),
    items: all(
      array(
        object({
          id,
          label: short,
          cost: money,
          illustration,
          payLater: optional(object({ now: money, later: money })),
        }),
        { min: 3, max: 5 },
      ),
      uniqueBy('id'),
    ),
    wrapUp: paragraph,
  }),
  (
    sim: {
      intro: string;
      budget: number;
      nextBudget?: number;
      nextLabel?: string;
      items: { id: string; cost: number; payLater?: { now: number; later: number } }[];
    },
    path: string,
  ) => {
    const issues: ValidationIssue[] = [];
    const total = sim.items.reduce((sum, item) => sum + (item.payLater?.now ?? item.cost), 0);
    if (total <= sim.budget) {
      issues.push({ path, message: 'tudo cabe no valor disponível; não há escolha a fazer' });
    }
    sim.items.forEach((item, index) => {
      const at = `${path}.items[${index}]`;
      if ((item.payLater?.now ?? item.cost) > sim.budget) {
        issues.push({ path: at, message: `"${item.id}" não cabe nem sozinho` });
      }
      if (item.payLater && item.payLater.now + item.payLater.later !== item.cost) {
        issues.push({
          path: `${at}.payLater`,
          message: 'agora + depois precisa ser igual ao preço',
        });
      }
    });
    const owed = sim.items.reduce((sum, item) => sum + (item.payLater?.later ?? 0), 0);
    if (owed > 0 && (sim.nextBudget === undefined || !sim.nextLabel)) {
      issues.push({ path, message: 'pagar depois exige nextBudget e nextLabel' });
    }
    const tokens = ['budget', ...(sim.nextBudget !== undefined ? ['nextBudget'] : [])];
    issues.push(...templated(paragraph, tokens)(sim.intro, `${path}.intro`));
    return issues;
  },
);

export const simulationSchema: Validator = byKind({
  spend: spendSimulation,
  presentation: presentationSimulation,
  budget: budgetSimulation,
});

// ---------- quiz ----------

const answerSchema: Validator = (value, path) => {
  const typeIssues = object({ type: literal('single', 'open') })(value, path);
  if (typeIssues.length > 0) return typeIssues;
  return (value as { type: string }).type === 'single'
    ? object({ type: literal('single'), correctOptionId: id })(value, path)
    : [];
};

export const quizSchema: Validator = withRules(
  object({
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
  }),
  (
    quiz: {
      questions: {
        id: string;
        options: { id: string }[];
        answer: { type: string; correctOptionId?: string };
      }[];
    },
    path: string,
  ) => {
    for (const question of quiz.questions) {
      if (
        question.answer.type === 'single' &&
        !question.options.some((option) => option.id === question.answer.correctOptionId)
      ) {
        return [
          {
            path,
            message: `pergunta "${question.id}": correctOptionId não corresponde a nenhuma opção`,
          },
        ];
      }
    }
    return quiz.questions.some((question) => question.answer.type === 'open')
      ? []
      : [
          {
            path,
            message: 'o quiz precisa de ao menos uma pergunta aberta (answer.type = "open")',
          },
        ];
  },
);

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
