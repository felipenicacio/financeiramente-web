import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { LessonRunner } from '@/components/learning/LessonRunner';
import { ModuleClosing } from '@/components/learning/ModuleClosing';
import type { Lesson, LessonObject, Module } from '@/lib/content/types';
import { SessionProvider } from '@/lib/session/SessionProvider';

/**
 * Regressão do bug de estado: objetos interativos do mesmo tipo, em sequência,
 * reaproveitavam a instância do componente e herdavam a resposta da tela
 * anterior (pergunta já respondida, cartões desabilitados, "Continuar"
 * travado). Cada tela precisa nascer limpa.
 */
afterEach(cleanup);

const money = { id: 'item-coin', illustration: 'item-coin' };

const quiz = (id: string): LessonObject => ({
  type: 'quiz',
  questions: [1, 2, 3].map((n) => ({
    id: `${id}q${n}`,
    kind: 'recognition' as const,
    prompt: `Pergunta ${id}${n}`,
    options: [
      { id: 'a', label: `Certa ${id}${n}` },
      { id: 'b', label: `Outra ${id}${n}` },
    ],
    answer: { type: 'single' as const, correctOptionId: 'a' },
    explanation: 'Explicação.',
  })),
});

const choice = (id: string): LessonObject => ({
  type: 'choice',
  prompt: `Escolha ${id}`,
  options: [
    { id: 'a', label: `Opção A ${id}`, reflection: 'Reflexão A.' },
    { id: 'b', label: `Opção B ${id}`, reflection: 'Reflexão B.' },
  ],
});

const classify: LessonObject = {
  type: 'classify',
  categories: [
    { id: 'x', label: 'Categoria X', short: 'x', icon: 'need', tone: 'teal' },
    { id: 'y', label: 'Categoria Y', short: 'y', icon: 'want', tone: 'coral' },
  ],
  items: ['i1', 'i2', 'i3'].map((id) => ({
    id,
    label: `Item ${id}`,
    situation: 'Situação.',
    accepted: ['x'],
    feedback: 'Retorno.',
    illustration: money.illustration,
  })),
};

/** Quiz com a alternativa correta em posições variadas (nunca a primeira). */
const quizWithCorrectAt = (correctIndex: number): LessonObject => {
  const labels = ['Zebra', 'Mapa', 'Girafa', 'Navio'];
  return {
    type: 'quiz',
    questions: [
      {
        id: 'posq',
        kind: 'recognition' as const,
        prompt: 'Pergunta de posição',
        options: labels.map((label, i) => ({
          id: `opt${i}`,
          label,
          feedback: i === correctIndex ? 'Boa escolha.' : 'Pense de novo.',
        })),
        answer: { type: 'single' as const, correctOptionId: `opt${correctIndex}` },
        explanation: 'Explicação da pergunta.',
      },
    ],
  };
};

const ordering: LessonObject = {
  type: 'ordering',
  prompt: 'Ordene os passos',
  items: [
    { id: 'a', label: 'Passo A' },
    { id: 'b', label: 'Passo B' },
    { id: 'c', label: 'Passo C' },
  ],
  correct: ['a', 'b', 'c'],
  feedback: 'Retorno da ordenação.',
};

const trueFalse = (id: string): LessonObject => ({
  type: 'trueFalse',
  prompt: `VF ${id}`,
  statements: [
    { id: 's1', text: `Afirmação 1 ${id}`, isTrue: true, explanation: 'Sim.' },
    { id: 's2', text: `Afirmação 2 ${id}`, isTrue: false, explanation: 'Não.' },
  ],
});

const lessonWith = (content: LessonObject[]): Lesson => ({
  id: 'c1-m01-l01',
  cycle: 'c1',
  module: 'm01',
  order: 1,
  title: 'Lição de teste',
  headline: 'Fala do Econominho.',
  objectives: ['Objetivo'],
  competencies: ['F-D1-C1-01'],
  sources: [{ source: 'MC', reference: 'Matriz', role: 'principal' }],
  sensitivity: 'N1',
  estimatedMinutes: 3,
  content,
  summary: ['Resumo.'],
});

function setup(content: LessonObject[]) {
  render(
    <LessonRunner
      cycle="c1"
      moduleId="m01"
      stepLabels={['Lição de teste', 'Fechamento']}
      currentStep={0}
      lesson={lessonWith(content)}
      next={{ href: '/proxima/', label: 'Próxima lição' }}
    />,
  );
  return userEvent.setup();
}

const continuar = () => screen.getByRole('button', { name: /continuar/i });
const marcados = () =>
  screen.queryAllByRole('button').filter((b) => b.getAttribute('aria-pressed') === 'true');
const cartoesDesabilitados = () =>
  screen
    .queryAllByRole('button')
    .filter((b) => b.hasAttribute('aria-pressed') && (b as HTMLButtonElement).disabled);

/** A tela nova não pode trazer nada marcado, desabilitado ou liberado. */
function expectTelaLimpa() {
  expect(marcados()).toHaveLength(0);
  expect(cartoesDesabilitados()).toHaveLength(0);
  expect(continuar()).toBeDisabled();
}

describe('LessonRunner: estado não vaza entre telas', () => {
  it('quiz com várias perguntas: cada pergunta nasce sem resposta', async () => {
    const user = setup([quiz('A')]);
    for (const n of [1, 2, 3]) {
      expect(screen.getByText(`Pergunta A${n}`)).toBeInTheDocument();
      expectTelaLimpa();
      await user.click(screen.getByRole('button', { name: new RegExp(`Certa A${n}`) }));
      expect(continuar()).toBeEnabled();
      await user.click(continuar());
    }
    // Depois da última pergunta vem a síntese, com link para a próxima lição.
    expect(screen.getByRole('link', { name: /próxima lição/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/proxima\/?$/),
    );
  });

  it('classify com vários itens: cada item nasce sem classificação', async () => {
    const user = setup([classify]);
    for (const id of ['i1', 'i2', 'i3']) {
      expect(screen.getByText(`Item ${id}`)).toBeInTheDocument();
      expectTelaLimpa();
      await user.click(screen.getByRole('button', { name: /Categoria X/ }));
      expect(continuar()).toBeEnabled();
      await user.click(continuar());
    }
  });

  it('dois objetos choice em sequência: o segundo não herda a escolha do primeiro', async () => {
    const user = setup([choice('P'), choice('Q')]);
    expectTelaLimpa();
    await user.click(screen.getByRole('button', { name: /Opção A P/ }));
    await user.click(continuar());
    expect(screen.getByText('Escolha Q')).toBeInTheDocument();
    expectTelaLimpa();
    expect(screen.queryByText('Reflexão A.')).not.toBeInTheDocument();
  });

  it('dois objetos trueFalse em sequência: o segundo nasce sem respostas', async () => {
    const user = setup([trueFalse('P'), trueFalse('Q')]);
    expect(continuar()).toBeDisabled();
    for (const text of ['Afirmação 1 P', 'Afirmação 2 P']) {
      const item = screen.getByText(text).closest('li')!;
      await user.click(within(item).getByRole('button', { name: /verdadeiro/i }));
    }
    expect(continuar()).toBeEnabled();
    await user.click(continuar());

    expect(screen.getByText('VF Q')).toBeInTheDocument();
    expect(marcados()).toHaveLength(0);
    expect(screen.queryAllByRole('status')).toHaveLength(0);
    expect(continuar()).toBeDisabled();
  });

  it('sequência mista (quiz, choice, classify): nenhuma tela chega respondida', async () => {
    const user = setup([quiz('M'), choice('M'), classify]);
    // quiz (3 telas)
    for (const n of [1, 2, 3]) {
      expectTelaLimpa();
      await user.click(screen.getByRole('button', { name: new RegExp(`Certa M${n}`) }));
      await user.click(continuar());
    }
    // choice
    expectTelaLimpa();
    await user.click(screen.getByRole('button', { name: /Opção B M/ }));
    await user.click(continuar());
    // classify (3 itens)
    for (let i = 0; i < 3; i += 1) {
      expectTelaLimpa();
      await user.click(screen.getByRole('button', { name: /Categoria Y/ }));
      await user.click(continuar());
    }
    expect(screen.getByRole('link', { name: /próxima lição/i })).toBeInTheDocument();
  });

  it('o primeiro objeto interativo mantém "Continuar" travado até responder', () => {
    setup([choice('P')]);
    expect(continuar()).toBeDisabled();
  });
});

describe('quiz: a correção é pelo ID da alternativa, nunca pela posição', () => {
  it.each([0, 1, 2, 3])(
    'alternativa correta originalmente na posição %i: acertar marca "chosen-ok"',
    async (correctIndex) => {
      const user = setup([quizWithCorrectAt(correctIndex)]);
      const labels = ['Zebra', 'Mapa', 'Girafa', 'Navio'];
      await user.click(screen.getByRole('button', { name: labels[correctIndex] }));
      expect(screen.getByText(/^Boa escolha\./)).toBeInTheDocument();
      expect(continuar()).toBeEnabled();
    },
  );

  it('escolher a alternativa errada mostra o feedback dela, não o da correta', async () => {
    const user = setup([quizWithCorrectAt(2)]);
    await user.click(screen.getByRole('button', { name: 'Zebra' }));
    expect(screen.getByText(/Pense de novo\./)).toBeInTheDocument();
    expect(screen.queryByText(/^Boa escolha\./)).not.toBeInTheDocument();
  });

  it('a ordem de apresentação não muda depois que o usuário responde', async () => {
    const user = setup([quizWithCorrectAt(1)]);
    const labelOrder = () =>
      screen
        .getAllByRole('button')
        .map((b) => /Zebra|Mapa|Girafa|Navio/.exec(b.textContent ?? '')?.[0])
        .filter((label): label is string => Boolean(label));
    const before = labelOrder();
    await user.click(screen.getByRole('button', { name: 'Mapa' }));
    expect(labelOrder()).toEqual(before);
  });

  it('nova pergunta (tela nova) pode receber uma nova ordem, mas a correção continua pelo ID', async () => {
    const quizMultiplo: LessonObject = {
      type: 'quiz',
      questions: [0, 1, 2, 3].map((correctIndex) => ({
        id: `q${correctIndex}`,
        kind: 'recognition' as const,
        prompt: `Pergunta ${correctIndex}`,
        options: ['Zebra', 'Mapa', 'Girafa', 'Navio'].map((label, i) => ({
          id: `opt${i}`,
          label,
        })),
        answer: { type: 'single' as const, correctOptionId: `opt${correctIndex}` },
        explanation: '.',
      })),
    };
    const user = setup([quizMultiplo]);
    const labels = ['Zebra', 'Mapa', 'Girafa', 'Navio'];
    for (const correctIndex of [0, 1, 2, 3]) {
      await user.click(screen.getByRole('button', { name: labels[correctIndex] }));
      expect(continuar()).toBeEnabled();
      await user.click(continuar());
    }
    expect(screen.getByRole('link', { name: /próxima lição/i })).toBeInTheDocument();
  });
});

describe('ordering: seleção e ordenação reversíveis antes da confirmação', () => {
  it('estado inicial: nenhum item selecionado', () => {
    setup([ordering]);
    expect(screen.getByText('Ordene os passos')).toBeInTheDocument();
    expect(screen.queryByText('Passo A')).toBeInTheDocument();
    expect(continuar()).toBeDisabled();
  });

  it('selecionar A, B, C numera 1, 2, 3 e libera o avanço', async () => {
    const user = setup([ordering]);
    await user.click(screen.getByRole('button', { name: 'Passo A' }));
    await user.click(screen.getByRole('button', { name: 'Passo B' }));
    await user.click(screen.getByRole('button', { name: 'Passo C' }));
    const list = screen.getByRole('list');
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual([
      expect.stringContaining('1'),
      expect.stringContaining('2'),
      expect.stringContaining('3'),
    ]);
    expect(continuar()).toBeEnabled();
  });

  it('desfazer um item do meio retira da sequência e renumera os seguintes', async () => {
    const user = setup([ordering]);
    await user.click(screen.getByRole('button', { name: 'Passo A' }));
    await user.click(screen.getByRole('button', { name: 'Passo B' }));
    await user.click(screen.getByRole('button', { name: 'Passo C' }));
    // Retira "Passo B" (posição 2) clicando no item já selecionado.
    await user.click(screen.getByRole('button', { name: /Retirar Passo B/ }));

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]!.textContent).toContain('1');
    expect(items[0]!.textContent).toContain('Passo A');
    expect(items[1]!.textContent).toContain('2');
    expect(items[1]!.textContent).toContain('Passo C');
    // "Passo B" volta para o banco de itens disponíveis.
    expect(screen.getByRole('button', { name: 'Passo B' })).toBeInTheDocument();
  });

  it('readicionar o item removido vai para o fim da sequência', async () => {
    const user = setup([ordering]);
    await user.click(screen.getByRole('button', { name: 'Passo A' }));
    await user.click(screen.getByRole('button', { name: 'Passo B' }));
    await user.click(screen.getByRole('button', { name: 'Passo C' }));
    await user.click(screen.getByRole('button', { name: /Retirar Passo B/ }));
    await user.click(screen.getByRole('button', { name: 'Passo B' }));

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual([
      expect.stringContaining('Passo A'),
      expect.stringContaining('Passo C'),
      expect.stringContaining('Passo B'),
    ]);
    expect(continuar()).toBeEnabled();
  });

  it('desmarcar o primeiro item recalcula a numeração dos demais', async () => {
    const user = setup([ordering]);
    await user.click(screen.getByRole('button', { name: 'Passo A' }));
    await user.click(screen.getByRole('button', { name: 'Passo B' }));
    await user.click(screen.getByRole('button', { name: /Retirar Passo A/ }));
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0]!.textContent).toContain('1');
    expect(items[0]!.textContent).toContain('Passo B');
  });

  it('desmarcar o último item some com a sequência inteira ao esvaziar', async () => {
    const user = setup([ordering]);
    await user.click(screen.getByRole('button', { name: 'Passo A' }));
    await user.click(screen.getByRole('button', { name: /Retirar Passo A/ }));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(continuar()).toBeDisabled();
  });
});

describe('ModuleClosing: estado não vaza entre perguntas da avaliação integradora', () => {
  const modulo: Module = {
    id: 'm01',
    cycle: 'c1',
    order: 1,
    code: 'C1.1',
    title: 'Módulo de teste',
    headline: 'Chamada.',
    summary: 'Resumo.',
    competencies: ['F-D1-C1-01'],
    integrative: { title: 'Juntando tudo', intro: 'Vamos ver?', object: quiz('Z') },
    conclusion: {
      title: 'O que descobrimos?',
      message: 'Mensagem do Econominho.',
      recap: [{ icon: 'money', tone: 'teal', text: 'Ideia 1' }],
    },
  };

  it('cada pergunta nasce limpa e a conclusão aparece no fim, sem nota', async () => {
    render(
      <SessionProvider>
        <ModuleClosing
          cycle="c1"
          moduleId="m01"
          stepLabels={['Lição', 'Fechamento']}
          currentStep={1}
          module={modulo}
          nav={{ nextModule: null, cycleSummary: '/jornadas/c1/o-que-descobrimos/' }}
        />
      </SessionProvider>,
    );
    const user = userEvent.setup();
    for (const n of [1, 2, 3]) {
      expect(screen.getByText(`Pergunta Z${n}`)).toBeInTheDocument();
      expectTelaLimpa();
      await user.click(screen.getByRole('button', { name: new RegExp(`Certa Z${n}`) }));
      await user.click(continuar());
    }
    expect(screen.getByText('Mensagem do Econominho.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /o que descobrimos/i })).toBeInTheDocument();
    // Sem nota, pontos ou percentual.
    expect(screen.queryByText(/%|pontos|nota\b/i)).not.toBeInTheDocument();
  });
});
