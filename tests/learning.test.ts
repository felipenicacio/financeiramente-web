import { describe, expect, it } from 'vitest';

import { rawModules } from '@/lib/content/registry';
import type { AffordObject, ChangeObject, ClassifyItem, CompareObject, QuizQuestion } from '@/lib/content/types';
import {
  affordResult,
  changeAnswer,
  classifyChoiceState,
  classifyDependsOnContext,
  compareAnswer,
  evaluateQuizAnswer,
  fillTemplate,
  formatMoney,
  goalProgress,
  isInteractive,
  storyValues,
  templateTokens,
} from '@/lib/learning';
import { evaluateExpression, resolveValues } from '@/lib/learning/expr';
import { validateModuleBundle } from '@/lib/validation/contentSchemas';

/** Regra de ouro: todo número que pode ser calculado é calculado no código. */
describe('dinheiro e templates', () => {
  it('formata reais sem centavos e com separador de milhar', () => {
    expect(formatMoney(8)).toBe('R$ 8');
    expect(formatMoney(1250)).toBe('R$ 1.250');
    expect(formatMoney(-3)).toBe('-R$ 3');
  });

  it('preenche {tokens} e mantém os desconhecidos visíveis', () => {
    expect(fillTemplate('Custa {price}, pagou {paid}.', { price: 'R$ 8', paid: 'R$ 10' })).toBe(
      'Custa R$ 8, pagou R$ 10.',
    );
    expect(fillTemplate('Falta {x}', {})).toBe('Falta {x}');
    expect(templateTokens('{a} e {b}')).toEqual(['a', 'b']);
  });
});

describe('expressões seguras (sem eval)', () => {
  it('avalia contas simples com parênteses', () => {
    expect(evaluateExpression('(money - price) * 2', { money: 10, price: 8 })).toBe(4);
  });

  it('resolve valores derivados em ordem', () => {
    expect(
      resolveValues({ money: 10, kitePrice: 8 }, [{ name: 'change', expr: 'money - kitePrice' }]),
    ).toMatchObject({ change: 2 });
    expect(storyValues({ values: { a: 5 }, derived: [{ name: 'b', expr: 'a + 1' }] })).toMatchObject({ b: 6 });
  });

  it('recusa código arbitrário e variável desconhecida', () => {
    expect(() => evaluateExpression('process.exit(1)', {})).toThrow();
    expect(() => evaluateExpression('a + 1', {})).toThrow();
  });
});

describe('atividades de preço', () => {
  const produto = (id: string, price: number) => ({ id, label: id, price, illustration: 'item-coin' });

  it('compare: o resultado vem dos preços, não do conteúdo', () => {
    const base: CompareObject = {
      type: 'compare',
      prompt: '?',
      target: 'most',
      products: [produto('a', 5), produto('b', 10), produto('c', 2)],
      feedback: '.',
    };
    expect(compareAnswer(base).map((p) => p.id)).toEqual(['b']);
    expect(compareAnswer({ ...base, target: 'least' }).map((p) => p.id)).toEqual(['c']);
  });

  it('change: troco = pago - preço', () => {
    const obj: ChangeObject = {
      type: 'change',
      prompt: '?',
      paid: 10,
      product: produto('kite', 8),
      options: [2, 3, 8],
      feedback: '.',
    };
    expect(changeAnswer(obj)).toBe(2);
    expect(obj.options).toContain(changeAnswer(obj));
  });

  it('afford: mostra o que sobra ou o que falta', () => {
    const obj: AffordObject = {
      type: 'afford',
      prompt: '?',
      budget: 10,
      products: [produto('kite', 8), produto('book', 15)],
      feedback: '.',
    };
    expect(affordResult(obj, 'kite')).toMatchObject({ fits: true, left: 2, missing: 0 });
    expect(affordResult(obj, 'book')).toMatchObject({ fits: false, left: 0, missing: 5 });
    expect(affordResult(obj, 'nada')).toBeNull();
  });

  it('meta: progresso fica entre 0 e 1', () => {
    expect(goalProgress(5, 10)).toBe(0.5);
    expect(goalProgress(20, 10)).toBe(1);
    expect(goalProgress(1, 0)).toBe(0);
  });
});

describe('classificação e quiz', () => {
  const item: ClassifyItem = {
    id: 'i',
    label: 'Casaco',
    situation: '.',
    accepted: ['need', 'wait'],
    feedback: '.',
    contextNote: 'Depende da situação.',
  };

  it('aceita mais de uma categoria quando o contexto muda a resposta', () => {
    expect(classifyDependsOnContext(item)).toBe(true);
    expect(classifyChoiceState(item, 'need', 'need')).toBe('chosen-ok');
    expect(classifyChoiceState(item, 'wait', 'need')).toBe('also-ok');
    expect(classifyChoiceState(item, 'need', null)).toBe('idle');
  });

  it('quiz: pergunta aberta aceita qualquer opção', () => {
    const q = (answer: QuizQuestion['answer']): QuizQuestion => ({
      id: 'q',
      kind: 'decision',
      prompt: '?',
      options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
      answer,
      explanation: '.',
    });
    expect(evaluateQuizAnswer(q({ type: 'single', correctOptionId: 'a' }), 'a')).toBe('expected');
    expect(evaluateQuizAnswer(q({ type: 'single', correctOptionId: 'a' }), 'b')).toBe('rethink');
    expect(evaluateQuizAnswer(q({ type: 'open' }), 'b')).toBe('open');
  });

  it('só objetos que pedem ação travam o avanço', () => {
    expect(isInteractive({ type: 'explanation', body: '.' })).toBe(false);
    expect(isInteractive({ type: 'reflection', state: 'ask', text: '.' })).toBe(false);
    expect(isInteractive({ type: 'choice', prompt: '?', options: [] })).toBe(true);
  });
});

describe('o schema recusa conteúdo inválido', () => {
  const clone = <T,>(value: T): T => structuredClone(value);
  const raw = rawModules['c1/m01'] as { module: Record<string, unknown>; lessons: Record<string, unknown>[] };

  it('o módulo publicado valida', () => {
    expect(validateModuleBundle(raw.module, raw.lessons).ok).toBe(true);
  });

  it('theme que é um id antigo de módulo é inválido', () => {
    const modulo = { ...clone(raw.module), theme: 'm02' };
    const result = validateModuleBundle(modulo, raw.lessons);
    expect(result.ok).toBe(false);
  });

  it('competência inexistente é inválida', () => {
    const lessons = clone(raw.lessons);
    (lessons[0] as { competencies: string[] }).competencies = ['F-D9-C9-99'];
    expect(validateModuleBundle(raw.module, lessons).ok).toBe(false);
  });

  it('sensibilidade fora de N1–N3 é inválida', () => {
    const lessons = clone(raw.lessons);
    (lessons[0] as { sensitivity: string }).sensitivity = 'N9';
    expect(validateModuleBundle(raw.module, lessons).ok).toBe(false);
  });

  it('lição sem fontes é inválida', () => {
    const lessons = clone(raw.lessons);
    (lessons[0] as { sources: unknown[] }).sources = [];
    expect(validateModuleBundle(raw.module, lessons).ok).toBe(false);
  });
});
