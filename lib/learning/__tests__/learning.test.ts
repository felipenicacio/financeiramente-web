import { rawModules } from '@/lib/content/registry';
import type {
  ActivityItem,
  AffordItem,
  BudgetSimulation,
  ChangeItem,
  CompareItem,
  QuizQuestion,
  SpendSimulation,
} from '@/lib/content/types';

import { evaluateExpression, resolveValues } from '../expr';
import {
  acceptedAnswers,
  affordResult,
  budgetState,
  changeAnswer,
  choiceState,
  compareAnswer,
  dependsOnContext,
  evaluateQuizAnswer,
  fillTemplate,
  formatMoney,
  goalProgress,
  simulateChoice,
  templateTokens,
} from '../index';
import { lessonSteps, nextStep, previousStep, routes, stepBySlug, stepIndex } from '../steps';

const m01Simulation = rawModules['c1/m01']!.simulation as SpendSimulation;
const m02Simulation = rawModules['c1/m02']!.simulation as SpendSimulation;
const m04Simulation = rawModules['c1/m04']!.simulation as BudgetSimulation;

describe('expressões de valores derivados', () => {
  it('calcula soma, subtração, multiplicação e parênteses', () => {
    expect(evaluateExpression('a - b + 2 * (c - 1)', { a: 10, b: 3, c: 4 })).toBe(13);
  });

  it('resolve derivados em ordem', () => {
    expect(
      resolveValues({ x: 10 }, [
        { name: 'y', expr: 'x - 4' },
        { name: 'z', expr: 'y * 2' },
      ]),
    ).toEqual({ x: 10, y: 6, z: 12 });
  });

  it('acusa nomes desconhecidos e expressões inválidas', () => {
    expect(() => evaluateExpression('a + nada', { a: 1 })).toThrow('valor desconhecido: nada');
    expect(() => evaluateExpression('a +', { a: 1 })).toThrow();
    expect(() => evaluateExpression('a; alert(1)', { a: 1 })).toThrow();
  });
});

describe('simulação de escolha com meta (M01: R$ 20, meta R$ 30, guardado R$ 10)', () => {
  it('calcula gasto, saldo e efeito na meta para cada opção', () => {
    expect(simulateChoice(m01Simulation, 'icecream')).toMatchObject({
      spent: 5,
      left: 15,
      goal: { savedBefore: 10, savedAfter: 25, missing: 5, reached: false },
    });
    expect(simulateChoice(m01Simulation, 'car')).toMatchObject({
      spent: 15,
      left: 5,
      goal: { savedAfter: 15, missing: 15, reached: false },
    });
    expect(simulateChoice(m01Simulation, 'save')).toMatchObject({
      spent: 0,
      left: 20,
      goal: { savedAfter: 30, missing: 0, reached: true },
    });
  });

  it('o saldo nunca passa da meta', () => {
    const outcome = simulateChoice({ ...m01Simulation, budget: 100 }, 'save');
    expect(outcome?.goal).toMatchObject({ savedAfter: 30, missing: 0 });
  });

  it('ignora opção inexistente', () => {
    expect(simulateChoice(m01Simulation, 'nada')).toBeNull();
  });

  it('limita o progresso da meta entre 0 e 1', () => {
    expect(goalProgress(45, 30)).toBe(1);
    expect(goalProgress(-1, 30)).toBe(0);
    expect(goalProgress(15, 30)).toBe(0.5);
    expect(goalProgress(10, 0)).toBe(0);
  });
});

describe('simulação de escolha sem meta (M02: papelaria com R$ 10)', () => {
  it('o que sobra é o troco', () => {
    const pencils = simulateChoice(m02Simulation, 'pencils');
    expect(pencils).toMatchObject({ spent: 5, left: 5 });
    expect(pencils?.goal).toBeUndefined();
    expect(simulateChoice(m02Simulation, 'notebook')).toMatchObject({ spent: 10, left: 0 });
    expect(simulateChoice(m02Simulation, 'eraser')).toMatchObject({ spent: 2, left: 8 });
  });
});

describe('orçamento com pagar depois (M04: R$ 30, próximo passeio R$ 30)', () => {
  it('cada escolha reduz o que sobra para as outras', () => {
    const state = budgetState(m04Simulation, ['snack', 'boat']);
    expect(state.spentNow).toBe(25);
    expect(state.leftNow).toBe(5);
    expect(state.fits('icecream')).toBe(true);
    expect(state.fits('paints')).toBe(false);
    expect(state.missingFor('paints')).toBe(5);
  });

  it('pagar depois usa só a parte de agora e compromete o próximo período', () => {
    const state = budgetState(m04Simulation, ['paints']);
    expect(state.spentNow).toBe(10);
    expect(state.leftNow).toBe(20);
    expect(state.owedLater).toBe(10);
    expect(state.nextAvailable).toBe(20);
  });

  it('sem escolhas, nada é gasto nem combinado', () => {
    const state = budgetState(m04Simulation, []);
    expect(state).toMatchObject({ spentNow: 0, leftNow: 30, owedLater: 0, nextAvailable: 30 });
  });
});

describe('templates e dinheiro', () => {
  it('formata reais sem centavos', () => {
    expect(formatMoney(20)).toBe('R$ 20');
    expect(formatMoney(1250)).toBe('R$ 1.250');
    expect(formatMoney(-5)).toBe('-R$ 5');
  });

  it('preenche variáveis e mantém visíveis as desconhecidas', () => {
    expect(fillTemplate('Você tem {budget}.', { budget: 'R$ 20' })).toBe('Você tem R$ 20.');
    expect(fillTemplate('{x} e {y}', { x: 1 })).toBe('1 e {y}');
    expect(templateTokens('{a} {b}')).toEqual(['a', 'b']);
  });
});

describe('atividade', () => {
  const sneaker: ActivityItem = {
    kind: 'classify',
    id: 'sneaker',
    label: 'Tênis',
    situation: '',
    accepted: ['wait', 'want'],
    feedback: '',
    contextNote: 'Pode mudar.',
  };
  const product = (id: string, price: number) => ({
    id,
    label: id,
    price,
    illustration: 'item-car',
  });

  it('classificação aceita qualquer categoria listada e marca as que também valem', () => {
    expect(acceptedAnswers(sneaker)).toEqual(['wait', 'want']);
    expect(choiceState(sneaker, 'want', null)).toBe('idle');
    expect(choiceState(sneaker, 'want', 'want')).toBe('chosen-ok');
    expect(choiceState(sneaker, 'wait', 'want')).toBe('also-ok');
    expect(choiceState(sneaker, 'need', 'want')).toBe('dimmed');
    expect(choiceState(sneaker, 'need', 'need')).toBe('chosen-rethink');
    expect(dependsOnContext(sneaker)).toBe(true);
  });

  it('comparação calcula o mais caro e o mais barato pelos preços', () => {
    const base: CompareItem = {
      kind: 'compare',
      id: 'c',
      prompt: '',
      target: 'most',
      products: [product('a', 5), product('b', 10), product('c', 2)],
      feedback: '',
    };
    expect(compareAnswer(base).map((p) => p.id)).toEqual(['b']);
    expect(acceptedAnswers({ ...base, target: 'least' })).toEqual(['c']);
  });

  it('"o que posso comprar" aceita tudo que cabe e calcula sobra ou falta', () => {
    const item: AffordItem = {
      kind: 'afford',
      id: 'a',
      prompt: '',
      budget: 10,
      products: [product('kite', 8), product('book', 15), product('pencils', 5)],
      feedback: '',
    };
    expect(acceptedAnswers(item)).toEqual(['kite', 'pencils']);
    expect(affordResult(item, 'kite')).toMatchObject({ fits: true, left: 2, missing: 0 });
    expect(affordResult(item, 'book')).toMatchObject({ fits: false, left: 0, missing: 5 });
  });

  it('troco é o valor pago menos o preço', () => {
    const item: ChangeItem = {
      kind: 'change',
      id: 't',
      prompt: '',
      paid: 10,
      product: product('kite', 8),
      options: [2, 3, 8],
      feedback: '',
    };
    expect(changeAnswer(item)).toBe(2);
    expect(acceptedAnswers(item)).toEqual(['2']);
    expect(choiceState(item, '3', '3')).toBe('chosen-rethink');
    expect(choiceState(item, '2', '3')).toBe('expected');
  });
});

describe('quiz', () => {
  const base: QuizQuestion = {
    id: 'q',
    kind: 'recognition',
    prompt: '',
    options: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    answer: { type: 'single', correctOptionId: 'a' },
    explanation: '',
  };

  it('diferencia resposta esperada de "vamos pensar"', () => {
    expect(evaluateQuizAnswer(base, 'a')).toBe('expected');
    expect(evaluateQuizAnswer(base, 'b')).toBe('rethink');
  });

  it('pergunta aberta não tem resposta errada', () => {
    const open: QuizQuestion = { ...base, answer: { type: 'open' } };
    expect(evaluateQuizAnswer(open, 'a')).toBe('open');
    expect(evaluateQuizAnswer(open, 'b')).toBe('open');
  });
});

describe('etapas e rotas', () => {
  it('segue a ordem do módulo e termina na conclusão', () => {
    expect(lessonSteps.map((step) => step.slug)).toEqual([
      'historia',
      'conceito',
      'atividade',
      'simulacao',
      'quiz',
      'conclusao',
    ]);
    expect(stepIndex('story')).toBe(0);
    expect(nextStep('quiz')?.id).toBe('done');
    expect(nextStep('done')).toBeNull();
    expect(previousStep('story')).toBeNull();
    expect(stepBySlug('simulacao')?.id).toBe('simulation');
    expect(stepBySlug('inexistente')).toBeUndefined();
  });

  it('gera URLs com barra final, compatíveis com a exportação estática', () => {
    expect(routes.lesson('c1', 'm01', 'quiz')).toBe('/aprender/c1/m01/quiz/');
    expect(routes.module('c1', 'm01')).toBe('/modulos/c1/m01/');
    expect(routes.journeys('c1')).toBe('/jornadas/c1/');
    expect(routes.cycleSummary('c1')).toBe('/jornadas/c1/o-que-descobrimos/');
  });
});
