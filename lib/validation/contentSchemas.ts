import { moduleThemes, type Lesson, type Module } from '@/lib/content/types';
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

/** Catálogo oficial das 36 competências (Matriz Curricular v1.0). */
export const competencyCodes = [
  'F-D1-C1-01','F-D1-C2-01','F-D1-C3-01','F-D1-C4-01',
  'F-D2-C1-01','F-D2-C2-01','F-D2-C3-01','F-D2-C4-01',
  'F-D3-C1-01','F-D3-C2-01','F-D3-C3-01','F-D3-C4-01',
  'F-D4-C1-01','F-D4-C2-01','F-D4-C3-01','F-D4-C4-01',
  'F-D5-C1-01','F-D5-C2-01','F-D5-C3-01','F-D5-C4-01',
  'F-D6-C1-01','F-D6-C2-01','F-D6-C3-01','F-D6-C4-01',
  'F-D7-C1-01','F-D7-C2-01','F-D7-C3-01','F-D7-C4-01',
  'F-D8-C1-01','F-D8-C2-01','F-D8-C3-01','F-D8-C4-01',
  'F-D9-C1-01','F-D9-C2-01','F-D9-C3-01','F-D9-C4-01',
] as const;
const competencySet = new Set<string>(competencyCodes);

export const sourceCodes = ['FB1', 'FB2', 'AV-C', 'AV-P', 'MC', 'BNCC'] as const;
export const toneValues = ['teal', 'coral', 'amber', 'cyan', 'purple', 'green'] as const;
export const conceptIconValues = [
  'need','want','wait','money','price','change','care','shared','ad','info','persuade',
  'work','good','service','income','limit','later','choice','trade','save','goal','safe',
] as const;

const short = string({ maxLength: 48 });
const line = string({ maxLength: 100 });
const paragraph = string({ maxLength: 260 });
const illustration = string({ maxLength: 48 });
const tone = literal(...toneValues);
const conceptIcon = literal(...conceptIconValues);
const money = number({ min: 0, max: 100000, integer: true });

const id = (value: unknown, path: string): ValidationIssue[] => {
  const base = string({ maxLength: 48 })(value, path);
  if (base.length > 0) return base;
  return /^[a-z0-9][a-z0-9-]*$/.test(value as string)
    ? []
    : [{ path, message: 'id deve usar minúsculas, números e hífen' }];
};
const name = (value: unknown, path: string): ValidationIssue[] => {
  const base = string({ maxLength: 32 })(value, path);
  if (base.length > 0) return base;
  return /^[A-Za-z_]\w*$/.test(value as string)
    ? []
    : [{ path, message: 'nome de valor deve usar letras, números e _' }];
};

const guideLine = object({
  state: literal('ask', 'discover', 'compare', 'consequence', 'summary', 'reflect'),
  text: line,
});

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

const byType =
  (validators: Record<string, Validator>): Validator =>
  (value, path) => {
    const type = (value as { type?: unknown } | null)?.type;
    const validator = typeof type === 'string' ? validators[type] : undefined;
    return validator
      ? validator(value, path)
      : [{ path: `${path}.type`, message: `tipo de objeto inválido: ${String(type)}` }];
  };

const withRules =
  (structural: Validator, rules: (value: never, path: string) => ValidationIssue[]): Validator =>
  (value, path) => {
    const issues = structural(value, path);
    return issues.length > 0 ? issues : rules(value as never, path);
  };

// ---------- objetos de conteúdo ----------

const explanation = object({
  type: literal('explanation'),
  title: optional(line),
  body: paragraph,
  illustration: optional(illustration),
  bullets: optional(
    array(object({ icon: optional(conceptIcon), tone: optional(tone), text: line }), { max: 4 }),
  ),
});

const story = withRules(
  object({
    type: literal('story'),
    title: optional(line),
    values: optional((value, path) => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return [{ path, message: 'deveria ser objeto de valores' }];
      }
      return Object.entries(value).flatMap(([k, v]) => [
        ...name(k, `${path}.${k}`),
        ...money(v, `${path}.${k}`),
      ]);
    }),
    derived: optional(all(array(object({ name, expr: string({ maxLength: 120 }) })), uniqueBy('name'))),
    panels: all(array(object({ id, illustration, text: paragraph }), { min: 1, max: 6 }), uniqueBy('id')),
    question: optional(
      object({
        prompt: line,
        options: all(array(object({ id, label: line, reflection: paragraph }), { min: 2, max: 3 }), uniqueBy('id')),
      }),
    ),
    closing: optional(paragraph),
  }),
  (
    obj: {
      values?: Record<string, number>;
      derived?: { name: string; expr: string }[];
      panels: { text: string }[];
      question?: { options: { reflection: string }[] };
      closing?: string;
    },
    path: string,
  ) => {
    let resolved: Record<string, number> = {};
    if (obj.values || obj.derived) {
      try {
        resolved = resolveValues(obj.values ?? {}, obj.derived ?? []);
      } catch (error) {
        return [{ path: `${path}.derived`, message: (error as Error).message }];
      }
      for (const [k, v] of Object.entries(resolved)) {
        if (v < 0) return [{ path: `${path}.derived`, message: `"${k}" ficou negativo` }];
      }
    }
    const allowed = Object.keys(resolved);
    const issues: ValidationIssue[] = [];
    obj.panels.forEach((p, i) => issues.push(...templated(paragraph, allowed)(p.text, `${path}.panels[${i}].text`)));
    obj.question?.options.forEach((o, i) =>
      issues.push(...templated(paragraph, allowed)(o.reflection, `${path}.question.options[${i}].reflection`)),
    );
    if (obj.closing) issues.push(...templated(paragraph, allowed)(obj.closing, `${path}.closing`));
    return issues;
  },
);

const concepts = object({
  type: literal('concepts'),
  title: optional(line),
  intro: optional(paragraph),
  concepts: all(
    array(
      object({
        id,
        label: short,
        short: line,
        description: paragraph,
        icon: conceptIcon,
        tone,
        examples: optional(array(object({ label: short, illustration }), { max: 3 })),
      }),
      { min: 2, max: 4 },
    ),
    uniqueBy('id'),
  ),
  keyIdea: optional(paragraph),
  keyIdeaIllustration: optional(illustration),
});

const activityCategory = object({ id, label: short, short: line, icon: conceptIcon, tone });
const product = object({ id, label: short, price: money, illustration });

const classify = withRules(
  object({
    type: literal('classify'),
    prompt: optional(line),
    instructions: optional(line),
    categories: all(array(activityCategory, { min: 2, max: 4 }), uniqueBy('id')),
    items: all(
      array(
        object({
          id,
          label: short,
          situation: line,
          illustration: optional(illustration),
          accepted: all(array(id, { min: 1, max: 4 }), (v, p) =>
            Array.isArray(v) && new Set(v).size !== v.length ? [{ path: p, message: 'categoria repetida' }] : [],
          ),
          feedback: paragraph,
          contextNote: optional(paragraph),
        }),
        { min: 3, max: 8 },
      ),
      uniqueBy('id'),
    ),
  }),
  (obj: { categories: { id: string }[]; items: { id: string; accepted: string[] }[] }, path) => {
    const known = new Set(obj.categories.map((c) => c.id));
    const issues: ValidationIssue[] = [];
    obj.items.forEach((it, i) => {
      for (const a of it.accepted) {
        if (!known.has(a)) issues.push({ path: `${path}.items[${i}].accepted`, message: `categoria inexistente: ${a}` });
      }
    });
    return issues;
  },
);

const compare = withRules(
  object({
    type: literal('compare'),
    prompt: line,
    target: literal('most', 'least'),
    products: all(array(product, { min: 2, max: 3 }), uniqueBy('id')),
    feedback: paragraph,
  }),
  (obj: { target: string; products: { price: number }[] }, path) => {
    const prices = obj.products.map((p) => p.price);
    const target = obj.target === 'most' ? Math.max(...prices) : Math.min(...prices);
    return prices.filter((p) => p === target).length > 1
      ? [{ path, message: 'empate de preços: a pergunta precisa de uma resposta só' }]
      : [];
  },
);

const afford = withRules(
  object({
    type: literal('afford'),
    prompt: templated(line, ['budget']),
    budget: money,
    products: all(array(product, { min: 2, max: 3 }), uniqueBy('id')),
    feedback: paragraph,
  }),
  (obj: { budget: number; products: { price: number }[] }, path) =>
    obj.products.some((p) => p.price <= obj.budget)
      ? []
      : [{ path, message: 'nenhuma opção cabe no valor disponível' }],
);

const change = withRules(
  object({
    type: literal('change'),
    prompt: templated(line, ['paid', 'price']),
    paid: money,
    product,
    options: array(money, { min: 2, max: 4 }),
    feedback: paragraph,
  }),
  (obj: { paid: number; product: { price: number }; options: number[] }, path) => {
    const answer = obj.paid - obj.product.price;
    if (answer < 0) return [{ path, message: 'valor pago é menor que o preço' }];
    if (new Set(obj.options).size !== obj.options.length) return [{ path: `${path}.options`, message: 'opções repetidas' }];
    return obj.options.includes(answer)
      ? []
      : [{ path: `${path}.options`, message: `as opções precisam incluir o troco calculado (${answer})` }];
  },
);

const choice = object({
  type: literal('choice'),
  prompt: line,
  illustration: optional(illustration),
  options: all(array(object({ id, label: line, reflection: paragraph }), { min: 2, max: 3 }), uniqueBy('id')),
  note: optional(object({ title: line, body: paragraph })),
});

const ordering = withRules(
  object({
    type: literal('ordering'),
    prompt: line,
    instructions: optional(line),
    items: all(array(object({ id, label: line, illustration: optional(illustration) }), { min: 3, max: 5 }), uniqueBy('id')),
    correct: array(id, { min: 3, max: 5 }),
    feedback: paragraph,
  }),
  (obj: { items: { id: string }[]; correct: string[] }, path) => {
    const ids = new Set(obj.items.map((i) => i.id));
    if (obj.correct.length !== obj.items.length) return [{ path: `${path}.correct`, message: 'correct deve listar todos os itens' }];
    for (const c of obj.correct) if (!ids.has(c)) return [{ path: `${path}.correct`, message: `item inexistente: ${c}` }];
    return [];
  },
);

const trueFalse = object({
  type: literal('trueFalse'),
  prompt: optional(line),
  statements: all(
    array(
      object({ id, text: paragraph, isTrue: (v, p) => (typeof v === 'boolean' ? [] : [{ path: p, message: 'isTrue deve ser booleano' }]), explanation: paragraph }),
      { min: 3, max: 5 },
    ),
    uniqueBy('id'),
  ),
});

const quizAnswer: Validator = (value, path) => {
  const typeIssues = object({ type: literal('single', 'open') })(value, path);
  if (typeIssues.length > 0) return typeIssues;
  return (value as { type: string }).type === 'single'
    ? object({ type: literal('single'), correctOptionId: id })(value, path)
    : [];
};
const quiz = withRules(
  object({
    type: literal('quiz'),
    title: optional(line),
    questions: all(
      array(
        object({
          id,
          kind: literal('recognition', 'situation', 'decision', 'explanation'),
          prompt: paragraph,
          illustration: optional(illustration),
          options: all(array(object({ id, label: line, feedback: optional(paragraph) }), { min: 2, max: 4 }), uniqueBy('id')),
          answer: quizAnswer,
          explanation: paragraph,
        }),
        { min: 2, max: 6 },
      ),
      uniqueBy('id'),
    ),
  }),
  (obj: { questions: { id: string; options: { id: string }[]; answer: { type: string; correctOptionId?: string } }[] }, path) => {
    for (const q of obj.questions) {
      if (q.answer.type === 'single' && !q.options.some((o) => o.id === q.answer.correctOptionId)) {
        return [{ path, message: `pergunta "${q.id}": correctOptionId não corresponde a nenhuma opção` }];
      }
    }
    return [];
  },
);

const reflection = object({
  type: literal('reflection'),
  state: literal('ask', 'discover', 'compare', 'consequence', 'summary', 'reflect'),
  text: paragraph,
  body: optional(paragraph),
});

export const lessonObjectSchema: Validator = byType({
  explanation,
  story,
  concepts,
  classify,
  compare,
  afford,
  change,
  choice,
  ordering,
  trueFalse,
  quiz,
  reflection,
});

// ---------- lição ----------

const sourceRef = object({
  source: literal(...sourceCodes),
  reference: string({ maxLength: 60 }),
  role: literal('principal', 'complementar'),
});

const competency = (value: unknown, path: string): ValidationIssue[] =>
  typeof value === 'string' && competencySet.has(value)
    ? []
    : [{ path, message: `competência inválida: ${String(value)}` }];

export const lessonSchema: Validator = withRules(
  object({
    id,
    cycle: literal('c1', 'c2', 'c3', 'c4'),
    module: id,
    order: number({ min: 1, max: 6, integer: true }),
    title: line,
    headline: line,
    objectives: array(paragraph, { min: 1, max: 5 }),
    competencies: all(array(competency, { min: 1, max: 4 }), uniqueBy()),
    sources: array(sourceRef, { min: 1, max: 4 }),
    sensitivity: literal('N1', 'N2', 'N3'),
    estimatedMinutes: number({ min: 1, max: 15, integer: true }),
    guide: optional(guideLine),
    content: array(lessonObjectSchema, { min: 2, max: 5 }),
    summary: array(line, { min: 1, max: 3 }),
  }),
  (obj: { sources: { role: string }[] }, path) =>
    obj.sources.some((s) => s.role === 'principal')
      ? []
      : [{ path: `${path}.sources`, message: 'toda lição precisa de uma fonte principal' }],
);

// ---------- módulo ----------

export const moduleSchema: Validator = object({
  id,
  cycle: literal('c1', 'c2', 'c3', 'c4'),
  order: number({ min: 1, max: 6, integer: true }),
  code: short,
  title: line,
  headline: line,
  summary: paragraph,
  theme: optional(literal(...moduleThemes)),
  competencies: all(array(competency, { min: 1, max: 9 }), uniqueBy()),
  integrative: object({ title: line, intro: paragraph, object: lessonObjectSchema }),
  conclusion: object({
    title: line,
    message: paragraph,
    recap: array(object({ icon: conceptIcon, tone, text: line }), { min: 3, max: 8 }),
  }),
});

// ---------- catálogo e ciclo ----------

export const catalogSchema: Validator = object({
  cycles: all(
    array(
      object({
        id: literal('c1', 'c2', 'c3', 'c4'),
        label: short,
        ageRange: short,
        description: line,
        status: literal('available', 'soon'),
        modules: all(array(object({ id, status: literal('available', 'soon') })), uniqueBy('id')),
      }),
      { min: 1 },
    ),
    uniqueBy('id'),
  ),
});

export const cycleSummarySchema: Validator = object({
  cycle: literal('c1', 'c2', 'c3', 'c4'),
  title: line,
  intro: paragraph,
  discoveries: array(object({ text: line, icon: conceptIcon, tone, module: id }), { min: 4, max: 8 }),
  guide: guideLine,
  closing: paragraph,
});

export const uiStringsSchema: Validator = (value, path) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return [{ path, message: 'deveria ser objeto' }];
  }
  return Object.entries(value).flatMap(([k, v]) => string({ maxLength: 160 })(v, `${path}.${k}`));
};

export type BundleValidation =
  | { ok: true; bundle: { module: Module; lessons: Lesson[] } }
  | { ok: false; issues: ValidationIssue[] };

export function validateModuleBundle(rawModule: unknown, rawLessons: unknown[]): BundleValidation {
  const issues = [...moduleSchema(rawModule, 'module.json')];
  rawLessons.forEach((lesson, index) => {
    issues.push(...lessonSchema(lesson, `lessons/l${String(index + 1).padStart(2, '0')}.json`));
  });
  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, bundle: { module: rawModule as Module, lessons: rawLessons as Lesson[] } };
}
