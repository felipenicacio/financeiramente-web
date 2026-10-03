import { conceptIconNames, illustrationKeys } from '@/components/illustrations';
import {
  availableModules,
  cycleModules,
  loadCatalog,
  loadCycleSummary,
  loadModule,
  nextModuleId,
} from '@/lib/content';
import { rawCycleSummaries, rawModules, rawUiStrings } from '@/lib/content/registry';
import type { ModuleBundle } from '@/lib/content/types';
import { acceptedAnswers, storyValues, templateTokens } from '@/lib/learning';

import {
  activitySchema,
  competencyCode,
  quizSchema,
  simulationSchema,
  storySchema,
  uiStringsSchema,
  validateModuleBundle,
} from '../contentSchemas';

const knownIllustrations = new Set<string>(illustrationKeys);
const moduleKeys = Object.keys(rawModules);

const bundleOf = (key: string): ModuleBundle => {
  const raw = rawModules[key];
  if (!raw) throw new Error(`módulo ${key} não registrado`);
  const result = validateModuleBundle(raw);
  if (!result.ok) throw new Error(JSON.stringify(result.issues, null, 2));
  return result.bundle;
};

function collectIllustrations(bundle: ModuleBundle): string[] {
  const { module, story, infographic, activity, simulation, quiz } = bundle;
  const list = [
    module.illustration,
    ...story.panels.map((panel) => panel.illustration),
    ...infographic.concepts.flatMap((concept) => concept.examples.map((e) => e.illustration)),
    infographic.keyIdeaIllustration,
    ...quiz.questions.flatMap((question) => (question.illustration ? [question.illustration] : [])),
  ];
  for (const item of activity.items) {
    if (item.kind === 'classify' && item.illustration) list.push(item.illustration);
    if (item.kind === 'compare' || item.kind === 'afford') {
      list.push(...item.products.map((product) => product.illustration));
    }
    if (item.kind === 'change') list.push(item.product.illustration);
  }
  if (simulation.kind === 'spend') {
    list.push(...simulation.options.map((option) => option.illustration));
    if (simulation.goal) list.push(simulation.goal.illustration);
  }
  if (simulation.kind === 'presentation') list.push(simulation.product.illustration);
  if (simulation.kind === 'budget') list.push(...simulation.items.map((item) => item.illustration));
  return list;
}

/** Todo texto visível de um módulo, para regras editoriais. */
function allText(bundle: ModuleBundle): string {
  return JSON.stringify(bundle, (key, value) =>
    ['id', 'illustration', 'kind', 'icon', 'tone', 'state', 'expr', 'code'].includes(key)
      ? undefined
      : value,
  );
}

describe('catálogo e registro', () => {
  it('catálogo é válido', () => {
    const result = loadCatalog();
    expect(result.ok ? [] : result.issues).toEqual([]);
  });

  it('textos de interface são válidos', () => {
    expect(uiStringsSchema(rawUiStrings, 'ui.json')).toEqual([]);
  });

  it('o C1 tem os quatro módulos publicados, na ordem', () => {
    expect(cycleModules('c1')).toEqual(['m01', 'm02', 'm03', 'm04']);
  });

  it('todo módulo disponível no catálogo está registrado, válido e na jornada certa', () => {
    const catalog = loadCatalog();
    if (!catalog.ok) throw new Error('catálogo inválido');
    for (const cycle of catalog.data.cycles) {
      for (const journey of cycle.journeys) {
        for (const ref of journey.modules.filter((entry) => entry.status === 'available')) {
          const result = loadModule(cycle.id, ref.id);
          expect({ key: `${cycle.id}/${ref.id}`, issues: result.ok ? [] : result.issues }).toEqual({
            key: `${cycle.id}/${ref.id}`,
            issues: [],
          });
          if (result.ok) {
            expect(result.data.module.id).toBe(ref.id);
            expect(result.data.module.cycle).toBe(cycle.id);
            expect(result.data.module.journeyId).toBe(journey.id);
          }
        }
      }
    }
  });

  it('todo módulo registrado aparece no catálogo (nada fica órfão)', () => {
    const published = availableModules().map((entry) => `${entry.cycle}/${entry.moduleId}`);
    expect(moduleKeys.sort()).toEqual(published.sort());
  });

  it('navegação entre módulos segue o catálogo', () => {
    expect(nextModuleId('c1', 'm01')).toBe('m02');
    expect(nextModuleId('c1', 'm03')).toBe('m04');
    expect(nextModuleId('c1', 'm04')).toBeNull();
  });

  it.each(Object.keys(rawCycleSummaries))(
    'resumo do ciclo %s é válido e cita módulos publicados',
    (cycle) => {
      const summary = loadCycleSummary(cycle);
      expect(summary?.ok ? [] : summary?.issues).toEqual([]);
      if (summary?.ok) {
        const modules = cycleModules(cycle);
        expect(summary.data.discoveries.filter((d) => !modules.includes(d.module))).toEqual([]);
        expect(summary.data.discoveries.filter((d) => !conceptIconNames.includes(d.icon))).toEqual(
          [],
        );
      }
    },
  );
});

describe.each(moduleKeys)('módulo %s', (key) => {
  const bundle = bundleOf(key);
  const { module, story, activity, simulation, quiz } = bundle;

  it('competências usam código válido e são únicas', () => {
    const codes = module.competencies.map((competency) => competency.code);
    expect(codes.filter((code) => !competencyCode.test(code))).toEqual([]);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('duração entre 8 e 12 minutos', () => {
    expect(module.estimatedMinutes).toBeGreaterThanOrEqual(8);
    expect(module.estimatedMinutes).toBeLessThanOrEqual(12);
  });

  it('usa apenas ilustrações e ícones existentes', () => {
    expect(collectIllustrations(bundle).filter((name) => !knownIllustrations.has(name))).toEqual(
      [],
    );
    const icons = [
      ...bundle.infographic.concepts.map((concept) => concept.icon),
      ...activity.categories.map((category) => category.icon),
      ...module.conclusion.recap.map((entry) => entry.icon),
    ];
    expect(icons.filter((icon) => !conceptIconNames.includes(icon))).toEqual([]);
  });

  it('o Econominho fala em todos os momentos do módulo', () => {
    expect(Object.keys(module.guide).sort()).toEqual(
      ['activity', 'concept', 'done', 'opening', 'quiz', 'simulation', 'story'].sort(),
    );
  });

  it('a história resolve todos os valores citados e nenhum fica negativo', () => {
    const values = storyValues(story);
    const texts = [
      ...story.panels.map((panel) => panel.text),
      ...story.question.options.map((option) => option.reflection),
      story.closing,
    ];
    const tokens = texts.flatMap(templateTokens);
    expect(tokens.filter((token) => !(token in values))).toEqual([]);
    expect(Object.values(values).filter((value) => value < 0)).toEqual([]);
  });

  it('nenhum valor em reais é digitado à mão em textos da história ou da simulação', () => {
    const texts = [
      ...story.panels.map((panel) => panel.text),
      ...story.question.options.map((option) => option.reflection),
      story.closing,
      ...(simulation.kind === 'spend'
        ? [simulation.intro, ...simulation.options.flatMap((option) => [option.now, option.later])]
        : []),
      ...(simulation.kind === 'budget' ? [simulation.intro, simulation.wrapUp] : []),
    ];
    expect(texts.filter((text) => /R\$\s?\d/.test(text))).toEqual([]);
  });

  it('toda atividade tem resposta possível e itens contextuais explicam o contexto', () => {
    for (const item of activity.items) {
      expect({ id: item.id, accepted: acceptedAnswers(item).length > 0 }).toEqual({
        id: item.id,
        accepted: true,
      });
      if (item.kind === 'classify' && item.accepted.length > 1) {
        expect({ id: item.id, note: Boolean(item.contextNote) }).toEqual({
          id: item.id,
          note: true,
        });
      }
    }
  });

  it('o quiz tem 4 a 6 perguntas, com ao menos uma aberta', () => {
    expect(quiz.questions.length).toBeGreaterThanOrEqual(4);
    expect(quiz.questions.length).toBeLessThanOrEqual(6);
    expect(quiz.questions.some((question) => question.answer.type === 'open')).toBe(true);
  });

  it('nenhum texto julga a criança, moraliza ou estigmatiza', () => {
    const text = allText(bundle);
    const forbidden =
      /você errou|má escolha|escolha correta|escolha errada|fam[ií]lias? (pobres?|ricas?)|\bpobres?\b|\bricos?\b|comprar é ruim|guardar é sempre/i;
    expect(text.match(forbidden)).toBeNull();
  });

  it('o Econominho não dá ordens financeiras nem recomenda produtos', () => {
    const lines = Object.values(module.guide).map((line) => line.text);
    const orders = /\b(compre|não compre|guarde|gaste|economize|você deve|tem que)\b/i;
    expect(lines.filter((line) => orders.test(line))).toEqual([]);
  });
});

describe('conteúdo específico do C1', () => {
  it('M01: "Água para beber" é necessidade (ajuste validado)', () => {
    const water = bundleOf('c1/m01').activity.items.find((item) => item.id === 'water');
    expect(water?.kind === 'classify' && water.label).toBe('Água para beber');
    expect(water?.kind === 'classify' && water.accepted).toEqual(['need']);
  });

  it('M01: "bola nova" não é exemplo genérico de "posso esperar" (é a meta da história)', () => {
    const wait = bundleOf('c1/m01').infographic.concepts.find((concept) => concept.id === 'wait');
    expect(wait?.examples.map((example) => example.label.toLowerCase())).not.toContain('bola nova');
  });

  it('M01: a simulação não promete que a meta está "garantida"', () => {
    expect(allText(bundleOf('c1/m01'))).not.toMatch(/garantid/i);
  });

  it('M01: história do Téo com R$ 10, R$ 15 guardados, meta de R$ 30 e figurinhas de R$ 5', () => {
    expect(storyValues(bundleOf('c1/m01').story)).toMatchObject({
      gift: 10,
      saved: 15,
      goalPrice: 30,
      temptationPrice: 5,
      missingIfBuy: 10,
      missingIfSave: 5,
    });
  });

  it('M02: história da feira com troco calculado', () => {
    expect(storyValues(bundleOf('c1/m02').story)).toMatchObject({
      changeApples: 5,
      changeKite: 2,
      missingBoth: 3,
    });
  });

  it('M03: a atividade separa informação e convencimento', () => {
    const { activity } = bundleOf('c1/m03');
    expect(activity.categories.map((category) => category.id)).toEqual(['info', 'persuade']);
  });

  it('M04: pagar depois soma o preço inteiro', () => {
    const { simulation } = bundleOf('c1/m04');
    if (simulation.kind !== 'budget') throw new Error('M04 deveria ter simulação de orçamento');
    const later = simulation.items.filter((item) => item.payLater);
    expect(later.length).toBeGreaterThan(0);
    for (const item of later) expect(item.payLater!.now + item.payLater!.later).toBe(item.cost);
  });

  it('personagens infantis recorrentes: no máximo quatro', () => {
    const kids = ['Téo', 'Nina', 'Bia', 'Caio'];
    const text = moduleKeys.map((key) => allText(bundleOf(key))).join(' ');
    const used = kids.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
    expect(used.length).toBeLessThanOrEqual(4);
  });
});

describe('validadores', () => {
  const quizQuestion = (id: string, answer: object) => ({
    id,
    kind: 'recognition',
    prompt: 'Pergunta?',
    options: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    answer,
    explanation: 'Explicação.',
  });

  it('rejeita resposta esperada que não existe nas opções', () => {
    const quiz = {
      title: 'Teste',
      questions: [
        quizQuestion('q0', { type: 'single', correctOptionId: 'z' }),
        quizQuestion('q1', { type: 'single', correctOptionId: 'a' }),
        quizQuestion('q2', { type: 'single', correctOptionId: 'a' }),
        quizQuestion('q3', { type: 'open' }),
      ],
    };
    const issues = quizSchema(quiz, 'quiz.json');
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain('q0');
  });

  it('exige ao menos uma pergunta aberta no quiz', () => {
    const quiz = {
      title: 'Teste',
      questions: ['q0', 'q1', 'q2', 'q3'].map((id) =>
        quizQuestion(id, { type: 'single', correctOptionId: 'a' }),
      ),
    };
    expect(quizSchema(quiz, 'quiz.json')[0]?.message).toContain('pergunta aberta');
  });

  it('rejeita IDs duplicados', () => {
    const quiz = {
      title: 'Teste',
      questions: ['q0', 'q0', 'q1', 'q2'].map((id) => quizQuestion(id, { type: 'open' })),
    };
    expect(quizSchema(quiz, 'quiz.json').map((issue) => issue.message)).toContain(
      'valor repetido: q0',
    );
  });

  it('rejeita opção de simulação mais cara que o valor disponível', () => {
    const option = (id: string, cost: number) => ({
      id,
      label: id,
      cost,
      illustration: 'item-car',
      now: 'Agora.',
      later: 'Depois.',
    });
    const simulation = {
      kind: 'spend',
      title: 'Teste',
      intro: 'Você tem {budget}.',
      budget: 10,
      leftoverRule: 'Sobra.',
      options: [option('a', 5), option('b', 15)],
      wrapUp: 'Fim.',
    };
    expect(simulationSchema(simulation, 'simulation.json')).toEqual([
      { path: 'simulation.json', message: 'opção "b" custa mais que o valor disponível' },
    ]);
  });

  it('rejeita "pagar depois" que não soma o preço', () => {
    const simulation = {
      kind: 'budget',
      title: 'Teste',
      intro: 'Você tem {budget}.',
      budget: 10,
      nextBudget: 10,
      nextLabel: 'Depois',
      items: [
        { id: 'a', label: 'A', cost: 8, illustration: 'item-car' },
        { id: 'b', label: 'B', cost: 6, illustration: 'item-car' },
        { id: 'c', label: 'C', cost: 10, illustration: 'item-car', payLater: { now: 5, later: 4 } },
      ],
      wrapUp: 'Fim.',
    };
    expect(simulationSchema(simulation, 'simulation.json').map((issue) => issue.message)).toContain(
      'agora + depois precisa ser igual ao preço',
    );
  });

  it('rejeita troco cujas opções não incluem a resposta calculada', () => {
    const activity = {
      title: 'Teste',
      instructions: 'Escolha.',
      categories: [],
      items: [
        {
          kind: 'change',
          id: 'c1',
          prompt: 'Quanto volta?',
          paid: 10,
          product: { id: 'p', label: 'P', price: 7, illustration: 'item-car' },
          options: [2, 4, 5],
          feedback: 'Troco.',
        },
        ...['a', 'b', 'c'].map((id) => ({
          kind: 'compare',
          id,
          prompt: 'Qual custa mais?',
          target: 'most',
          products: [
            { id: 'x', label: 'X', price: 1, illustration: 'item-car' },
            { id: 'y', label: 'Y', price: 2, illustration: 'item-car' },
          ],
          feedback: 'Ok.',
        })),
      ],
    };
    expect(activitySchema(activity, 'activity.json')).toEqual([
      {
        path: 'activity.json.items[0].options',
        message: 'as opções precisam incluir o troco calculado (3)',
      },
    ]);
  });

  it('rejeita classificação com categoria inexistente', () => {
    const item = (id: string, accepted: string[]) => ({
      kind: 'classify',
      id,
      label: 'L',
      situation: 'S',
      accepted,
      feedback: 'F',
    });
    const activity = {
      title: 'Teste',
      instructions: 'Escolha.',
      categories: [
        { id: 'a', label: 'A', short: 'A', icon: 'info', tone: 'cyan' },
        { id: 'b', label: 'B', short: 'B', icon: 'ad', tone: 'coral' },
      ],
      items: [item('i1', ['a']), item('i2', ['b']), item('i3', ['a']), item('i4', ['zzz'])],
    };
    expect(activitySchema(activity, 'activity.json')).toEqual([
      { path: 'activity.json.items[3].accepted', message: 'categoria inexistente: zzz' },
    ]);
  });

  it('rejeita variável de template desconhecida na história', () => {
    const story = structuredClone(rawModules['c1/m01']?.story) as { panels: { text: string }[] };
    story.panels[0]!.text = 'O Téo ganhou {presente}.';
    expect(storySchema(story, 'story.json')).toEqual([
      { path: 'story.json.panels[0].text', message: 'variável desconhecida: {presente}' },
    ]);
  });

  it('rejeita valor derivado que fica negativo', () => {
    const story = structuredClone(rawModules['c1/m02']?.story) as {
      values: Record<string, number>;
    };
    story.values.money = 1;
    expect(storySchema(story, 'story.json').map((issue) => issue.message)).toContain(
      '"changeApples" ficou negativo',
    );
  });

  it('aponta o caminho exato de campos ausentes', () => {
    const result = validateModuleBundle({
      ...rawModules['c1/m01']!,
      story: { title: 'Sem quadros' },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.map((item) => item.path)).toEqual(
        expect.arrayContaining(['story.json.values', 'story.json.panels', 'story.json.question']),
      );
    }
  });
});
