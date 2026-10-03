import { illustrationKeys } from '@/components/illustrations';
import { availableModules, loadCatalog, loadModule } from '@/lib/content';
import { rawModules, rawUiStrings } from '@/lib/content/registry';
import type { ModuleBundle } from '@/lib/content/types';

import {
  quizSchema,
  simulationSchema,
  storySchema,
  uiStringsSchema,
  validateModuleBundle,
} from '../contentSchemas';

const knownIllustrations = new Set<string>(illustrationKeys);

function collectIllustrations(bundle: ModuleBundle): string[] {
  return [
    bundle.module.illustration,
    ...bundle.story.panels.map((panel) => panel.illustration),
    ...bundle.infographic.categories.flatMap((category) =>
      category.examples.map((example) => example.illustration),
    ),
    bundle.infographic.keyIdeaIllustration,
    ...bundle.activity.items.map((item) => item.illustration),
    bundle.simulation.goal.illustration,
    ...bundle.simulation.options.map((option) => option.illustration),
    ...bundle.quiz.questions.flatMap((question) =>
      question.illustration ? [question.illustration] : [],
    ),
  ];
}

const bundleOf = (key: string) => {
  const raw = rawModules[key];
  if (!raw) throw new Error(`módulo ${key} não registrado`);
  const result = validateModuleBundle(raw);
  if (!result.ok) throw new Error(JSON.stringify(result.issues, null, 2));
  return result.bundle;
};

describe('conteúdo publicado', () => {
  it('catálogo é válido', () => {
    const result = loadCatalog();
    expect(result.ok ? [] : result.issues).toEqual([]);
  });

  it('textos de interface são válidos', () => {
    expect(uiStringsSchema(rawUiStrings, 'ui.json')).toEqual([]);
  });

  it('todo módulo marcado como disponível está registrado, é válido e aponta para a jornada certa', () => {
    const catalog = loadCatalog();
    if (!catalog.ok) throw new Error('catálogo inválido');
    const declared = catalog.data.cycles.flatMap((cycle) =>
      cycle.journeys.flatMap((journey) =>
        journey.modules
          .filter((ref) => ref.status === 'available')
          .map((ref) => ({ cycle: cycle.id, journey: journey.id, id: ref.id })),
      ),
    );
    expect(declared.length).toBeGreaterThan(0);
    for (const ref of declared) {
      const result = loadModule(ref.cycle, ref.id);
      expect(result.ok ? [] : result.issues).toEqual([]);
      if (result.ok) {
        expect(result.data.module.cycle).toBe(ref.cycle);
        expect(result.data.module.journeyId).toBe(ref.journey);
      }
    }
    expect(availableModules()).toHaveLength(declared.length);
  });

  it.each(Object.keys(rawModules))('%s usa apenas ilustrações existentes', (key) => {
    const missing = collectIllustrations(bundleOf(key)).filter(
      (name) => !knownIllustrations.has(name),
    );
    expect(missing).toEqual([]);
  });

  it.each(Object.keys(rawModules))(
    '%s: toda situação com mais de uma resposta explica o contexto',
    (key) => {
      const withoutNote = bundleOf(key).activity.items.filter(
        (item) => item.accepted.length > 1 && !item.contextNote,
      );
      expect(withoutNote.map((item) => item.id)).toEqual([]);
    },
  );

  it.each(Object.keys(rawModules))('%s: a atividade usa as três categorias', (key) => {
    const used = new Set(bundleOf(key).activity.items.flatMap((item) => item.accepted));
    expect([...used].sort()).toEqual(['need', 'wait', 'want']);
  });

  it('C1/M01 mantém o ajuste validado: "Água para beber" é necessidade', () => {
    const water = bundleOf('c1/m01').activity.items.find((item) => item.id === 'water');
    expect(water?.label).toBe('Água para beber');
    expect(water?.accepted).toEqual(['need']);
  });

  it('nenhum texto educacional usa linguagem de erro ou julgamento', () => {
    const forbidden = /você errou|má escolha|escolha correta|escolha errada/i;
    const text = JSON.stringify(Object.values(rawModules));
    expect(text.match(forbidden)).toBeNull();
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
      title: 'Teste',
      intro: 'Você tem {budget}.',
      budget: 10,
      goal: { label: 'Meta', price: 30, saved: 5, illustration: 'item-jar' },
      leftoverRule: 'Sobra vai para o pote.',
      options: [option('a', 5), option('b', 15)],
      wrapUp: 'Fim.',
    };
    expect(simulationSchema(simulation, 'simulation.json')).toEqual([
      { path: 'simulation.json', message: 'opção "b" custa mais que o valor disponível' },
    ]);
  });

  it('rejeita variável de template desconhecida na história', () => {
    const story = structuredClone(rawModules['c1/m01']?.story) as {
      panels: { text: string }[];
    };
    story.panels[0]!.text = 'O Téo ganhou {presente}.';
    const issues = storySchema(story, 'story.json');
    expect(issues).toEqual([
      { path: 'story.json.panels[0].text', message: 'variável desconhecida: {presente}' },
    ]);
  });

  it('aponta o caminho exato de campos ausentes', () => {
    const result = validateModuleBundle({
      ...rawModules['c1/m01']!,
      story: { title: 'Sem quadros' },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.map((item) => item.path)).toEqual(
        expect.arrayContaining(['story.json.money', 'story.json.panels', 'story.json.question']),
      );
    }
  });
});
