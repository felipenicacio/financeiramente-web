import { describe, expect, it } from 'vitest';

import { rawModules } from '@/lib/content/registry';
import type {
  AffordObject,
  ChangeObject,
  ClassifyItem,
  CompareObject,
  QuizQuestion,
} from '@/lib/content/types';
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
  seededRandom,
  shuffle,
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
    expect(
      storyValues({ values: { a: 5 }, derived: [{ name: 'b', expr: 'a + 1' }] }),
    ).toMatchObject({ b: 6 });
  });

  it('recusa código arbitrário e variável desconhecida', () => {
    expect(() => evaluateExpression('process.exit(1)', {})).toThrow();
    expect(() => evaluateExpression('a + 1', {})).toThrow();
  });
});

describe('atividades de preço', () => {
  const produto = (id: string, price: number) => ({
    id,
    label: id,
    price,
    illustration: 'item-coin',
  });

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
      options: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
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

describe('shuffle: embaralhamento puro e testável (Fisher-Yates)', () => {
  const items = ['A', 'B', 'C', 'D'] as const;

  it('não muta o array original', () => {
    const original = [...items];
    shuffle(items);
    expect(items).toEqual(original);
  });

  it('mantém todos os elementos, sem duplicar nem remover', () => {
    const result = shuffle(items, () => 0.37);
    expect(result).toHaveLength(items.length);
    expect([...result].sort()).toEqual([...items].sort());
  });

  it('com RNG controlado em 0, produz a permutação esperada (determinístico)', () => {
    // Fisher-Yates com randomFn() => 0: j = 0 em cada passo.
    // i=3 troca(3,0); i=2 troca(2,0); i=1 troca(1,0) — resultado conhecido.
    expect(shuffle(items, () => 0)).toEqual(['B', 'C', 'D', 'A']);
  });

  it('com RNG controlado no limite superior, nunca estoura o índice (j <= i)', () => {
    // randomFn bem próximo de 1: floor(rand*(i+1)) deve ficar em j === i,
    // ou seja, nenhuma troca ocorre e a ordem original é preservada.
    expect(shuffle(items, () => 0.999999)).toEqual([...items]);
  });

  it('pode alterar a ordem com o RNG de produção (Math.random)', () => {
    // Não testamos "rode uma vez e espere ordem diferente" (frágil).
    // Em vez disso, verificamos que o algoritmo é capaz de produzir uma
    // ordem diferente da original em várias tentativas independentes.
    const bigArray = Array.from({ length: 30 }, (_, i) => i);
    const anyDifferent = Array.from({ length: 10 }).some(
      () => !shuffle(bigArray).every((v, i) => v === bigArray[i]),
    );
    expect(anyDifferent).toBe(true);
  });

  it('IDs permanecem associados aos seus dados ao embaralhar objetos', () => {
    const options = [
      { id: 'a', label: 'Primeira' },
      { id: 'b', label: 'Segunda' },
      { id: 'c', label: 'Terceira' },
    ];
    const result = shuffle(options, () => 0.5);
    for (const option of result) {
      const original = options.find((o) => o.id === option.id)!;
      expect(option.label).toBe(original.label);
    }
    expect(result).toHaveLength(options.length);
  });
});

describe('seededRandom: aleatoriedade determinística por semente', () => {
  it('a mesma semente produz sempre a mesma sequência', () => {
    const seq = (seed: string) => {
      const rnd = seededRandom(seed);
      return [rnd(), rnd(), rnd()];
    };
    expect(seq('c1-m01-l01-q1')).toEqual(seq('c1-m01-l01-q1'));
  });

  it('sementes diferentes tendem a produzir sequências diferentes', () => {
    const rndA = seededRandom('pergunta-a');
    const rndB = seededRandom('pergunta-b');
    expect(rndA()).not.toBe(rndB());
  });

  it('sempre produz números no intervalo [0, 1)', () => {
    const rnd = seededRandom('qualquer-coisa');
    for (let i = 0; i < 50; i += 1) {
      const value = rnd();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('usado com shuffle, garante a mesma ordem de apresentação entre chamadas (estável para build e hidratação)', () => {
    const options = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
      { id: 'd', label: 'D' },
    ];
    const first = shuffle(options, seededRandom('c1-m01-l01-q1'));
    const second = shuffle(options, seededRandom('c1-m01-l01-q1'));
    expect(first.map((o) => o.id)).toEqual(second.map((o) => o.id));
  });
});

describe('o schema recusa conteúdo inválido', () => {
  const clone = <T>(value: T): T => structuredClone(value);
  const raw = rawModules['c1/m01'] as {
    module: Record<string, unknown>;
    lessons: Record<string, unknown>[];
  };

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
