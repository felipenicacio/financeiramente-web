import { rawModules } from '@/lib/content/registry';
import type { ActivityItem, QuizQuestion, Simulation, Story } from '@/lib/content/types';

import {
  activityChoiceState,
  dependsOnContext,
  evaluateQuizAnswer,
  fillTemplate,
  formatMoney,
  goalProgress,
  isAcceptedCategory,
  simulateChoice,
  storyValues,
  templateTokens,
} from '../index';
import { lessonSteps, nextStep, previousStep, routes, stepBySlug, stepIndex } from '../steps';

const simulation = rawModules['c1/m01']!.simulation as Simulation;
const story = rawModules['c1/m01']!.story as Story;

describe('simulação (C1/M01: R$ 20, meta R$ 30, guardado R$ 10)', () => {
  it('calcula gasto, saldo e efeito na meta para cada opção', () => {
    expect(simulateChoice(simulation, 'icecream')).toMatchObject({
      spent: 5,
      left: 15,
      savedBefore: 10,
      savedAfter: 25,
      missing: 5,
      reached: false,
    });
    expect(simulateChoice(simulation, 'car')).toMatchObject({
      spent: 15,
      left: 5,
      savedAfter: 15,
      missing: 15,
      reached: false,
    });
    expect(simulateChoice(simulation, 'save')).toMatchObject({
      spent: 0,
      left: 20,
      savedAfter: 30,
      missing: 0,
      reached: true,
    });
  });

  it('o saldo nunca fica negativo nem passa da meta', () => {
    const generous: Simulation = { ...simulation, budget: 100 };
    const outcome = simulateChoice(generous, 'save');
    expect(outcome?.savedAfter).toBe(30);
    expect(outcome?.missing).toBe(0);
  });

  it('ignora opção inexistente', () => {
    expect(simulateChoice(simulation, 'nada')).toBeNull();
  });

  it('limita o progresso da meta entre 0 e 1', () => {
    expect(goalProgress(45, 30)).toBe(1);
    expect(goalProgress(-1, 30)).toBe(0);
    expect(goalProgress(15, 30)).toBe(0.5);
    expect(goalProgress(10, 0)).toBe(0);
  });
});

describe('história: valores derivados', () => {
  it('calcula a partir do presente, do pote e dos preços', () => {
    expect(storyValues(story.money)).toEqual({
      gift: 10,
      saved: 15,
      goalPrice: 30,
      temptationPrice: 5,
      leftIfBuy: 5,
      missingIfBuy: 10,
      missingIfSave: 5,
    });
  });

  it('acompanha mudanças nos valores sem editar texto', () => {
    const values = storyValues({ ...story.money, gift: 20 });
    expect(values.leftIfBuy).toBe(15);
    expect(values.missingIfSave).toBe(0);
  });

  it('nenhum texto da história digita valores em reais à mão', () => {
    const texts = [
      ...story.panels.map((panel) => panel.text),
      ...story.question.options.map((option) => option.reflection),
    ];
    expect(texts.filter((text) => /R\$\s?\d/.test(text))).toEqual([]);
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
    id: 'sneaker',
    label: 'Tênis',
    situation: '',
    illustration: 'item-sneaker',
    accepted: ['wait', 'want'],
    feedback: '',
    contextNote: 'Pode mudar.',
  };

  it('aceita qualquer categoria listada', () => {
    expect(isAcceptedCategory(sneaker, 'wait')).toBe(true);
    expect(isAcceptedCategory(sneaker, 'want')).toBe(true);
    expect(isAcceptedCategory(sneaker, 'need')).toBe(false);
  });

  it('identifica itens que dependem do contexto', () => {
    expect(dependsOnContext(sneaker)).toBe(true);
    expect(dependsOnContext({ ...sneaker, accepted: ['need'], contextNote: undefined })).toBe(
      false,
    );
  });

  it('marca as outras respostas que também valem ("quero" e "posso esperar" coexistem)', () => {
    expect(activityChoiceState(sneaker, 'want', null)).toBe('idle');
    expect(activityChoiceState(sneaker, 'want', 'want')).toBe('chosen-ok');
    expect(activityChoiceState(sneaker, 'wait', 'want')).toBe('also-ok');
    expect(activityChoiceState(sneaker, 'need', 'want')).toBe('dimmed');
    expect(activityChoiceState(sneaker, 'need', 'need')).toBe('chosen-rethink');
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
  });
});
