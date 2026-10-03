import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rawModules } from '@/lib/content/registry';
import type { ModuleBundle } from '@/lib/content/types';
import { SessionProvider } from '@/lib/session/SessionProvider';

import { EconominhoGuide } from '@/components/econominho/EconominhoGuide';

import { ChoiceCard } from '../ChoiceCard';
import { ActivityStep } from '../steps/ActivityStep';
import { DoneStep } from '../steps/DoneStep';
import { QuizStep } from '../steps/QuizStep';
import { SimulationStep } from '../steps/SimulationStep';
import { StoryStep } from '../steps/StoryStep';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const bundleOf = (key: string) => rawModules[key] as unknown as ModuleBundle;
const bundle = bundleOf('c1/m01');
const renderStep = (ui: React.ReactElement) => render(<SessionProvider>{ui}</SessionProvider>);

beforeEach(() => {
  push.mockReset();
  window.scrollTo = vi.fn();
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as never;
});

describe('ChoiceCard', () => {
  it('é um botão com estado anunciado e área de toque grande', async () => {
    const onSelect = vi.fn();
    render(<ChoiceCard label="Preciso" state="idle" onSelect={onSelect} />);
    const button = screen.getByRole('button', { name: /Preciso/ });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.className).toContain('min-h-16');
    await userEvent.click(button);
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('História', () => {
  it('insere os valores calculados no texto e na pergunta final', async () => {
    renderStep(<StoryStep bundle={bundle} />);
    expect(screen.getByText(/ganhou R\$ 10 de presente/)).toBeInTheDocument();
    for (let i = 0; i < 4; i += 1) {
      await userEvent.click(screen.getByRole('button', { name: /Próximo/ }));
    }
    const next = screen.getByRole('button', { name: /Continuar/ });
    expect(next).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /Compro as figurinhas/ }));
    expect(screen.getByRole('status')).toHaveTextContent('faltam R$ 10 para a bola');
    await userEvent.click(next);
    expect(push).toHaveBeenCalledWith('/aprender/c1/m01/conceito/');
  });
});

describe('Atividade', () => {
  it('só avança depois da escolha e mostra retorno sem julgar', async () => {
    renderStep(<ActivityStep bundle={bundle} />);
    const next = screen.getByRole('button', { name: /Próximo/ });
    expect(next).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /^Quero/ }));
    const feedback = screen.getByRole('status');
    expect(feedback).toHaveTextContent('Vamos pensar juntos');
    expect(feedback).not.toHaveTextContent(/errad/i);
    expect(next).toBeEnabled();
  });

  it('em situações que dependem do contexto, marca a outra resposta e explica', async () => {
    renderStep(<ActivityStep bundle={bundle} />);
    await userEvent.click(screen.getByRole('button', { name: /Preciso/ }));
    await userEvent.click(screen.getByRole('button', { name: /Próximo/ }));
    expect(screen.getByRole('heading', { name: 'Robô de brinquedo' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /^Quero/ }));
    expect(screen.getByRole('button', { name: /Posso esperar/ })).toHaveTextContent(
      'Também combina',
    );
    expect(screen.getByRole('status')).toHaveTextContent('Isso pode mudar dependendo da situação');
  });
});

describe('Simulação', () => {
  it('mostra recurso, gasto, saldo e meta calculados', async () => {
    renderStep(<SimulationStep bundle={bundle} />);
    expect(screen.getByText(/Você tem R\$ 20 para usar/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Carrinho/ }));
    await userEvent.click(screen.getByRole('button', { name: /Ver o que acontece/ }));

    const terms = screen.getAllByRole('term').map((term) => term.textContent);
    const values = screen.getAllByRole('definition').map((value) => value.textContent);
    expect(Object.fromEntries(terms.map((term, i) => [term, values[i]]))).toEqual({
      'Você tem': 'R$ 20',
      Gastou: 'R$ 15',
      Sobrou: 'R$ 5',
    });
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '15');
    expect(screen.getByText(/Falta: R\$ 15/)).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/errou|má escolha|escolha correta/i);

    await userEvent.click(screen.getByRole('button', { name: /Testar outra escolha/ }));
    await userEvent.click(screen.getByRole('button', { name: /Guardar tudo/ }));
    await userEvent.click(screen.getByRole('button', { name: /Ver o que acontece/ }));
    expect(screen.getByText('Meta alcançada')).toBeInTheDocument();
  });
});

describe('Quiz', () => {
  it('pergunta aberta aceita qualquer opção', async () => {
    renderStep(<QuizStep bundle={bundle} />);
    const answerAndNext = async (option: RegExp) => {
      await userEvent.click(screen.getByRole('button', { name: option }));
      await userEvent.click(screen.getByRole('button', { name: /Próximo/ }));
    };
    await answerAndNext(/Um casaco/);
    await answerAndNext(/Pensar no que é mais importante/);

    await userEvent.click(screen.getByRole('button', { name: /Um lanche gostoso/ }));
    const status = screen.getByRole('status');
    expect(within(status).getByText('Boa escolha para pensar!')).toBeInTheDocument();
    expect(status).toHaveTextContent('Aqui não tem resposta errada');
  });
});

describe('Econominho (placeholder)', () => {
  it('mostra o nome e a fala, com estado para a arte futura', () => {
    render(<EconominhoGuide state="compare" text="Vamos comparar?" />);
    const figure = screen.getByRole('figure');
    expect(figure).toHaveTextContent('Econominho');
    expect(figure).toHaveTextContent('Vamos comparar?');
    expect(figure).toHaveAttribute('data-guide-state', 'compare');
    expect(figure.querySelector('img')).toBeNull();
  });

  it('aparece na primeira tela de cada etapa', () => {
    renderStep(<StoryStep bundle={bundle} />);
    const guide = screen
      .getAllByRole('figure')
      .find((figure) => figure.hasAttribute('data-guide-state'));
    expect(guide).toHaveTextContent(bundle.module.guide.story.text);
  });
});

describe('M02: atividade de preços', () => {
  it('comparação mostra os preços e a diferença calculada', async () => {
    renderStep(<ActivityStep bundle={bundleOf('c1/m02')} />);
    expect(screen.getByRole('heading', { name: 'Qual custa mais?' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Livro/ }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Isso mesmo!');
    expect(status).toHaveTextContent('DiferençaR$ 8');
  });

  it('troco: escolha diferente leva a "vamos pensar" e mostra a conta', async () => {
    renderStep(<ActivityStep bundle={bundleOf('c1/m02')} />);
    const next = () => userEvent.click(screen.getByRole('button', { name: /Próximo/ }));
    await userEvent.click(screen.getByRole('button', { name: /Livro/ }));
    await next();
    await userEvent.click(screen.getByRole('button', { name: /^Pão/ }));
    await next();
    await userEvent.click(screen.getByRole('button', { name: /Pipa/ }));
    await next();
    expect(
      screen.getByRole('heading', { name: /A pipa custa R\$ 8. Você paga com R\$ 10/ }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /R\$ 3/ }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Vamos pensar juntos');
    expect(status).toHaveTextContent('TrocoR$ 2');
  });
});

describe('M03: mesmo produto, dois jeitos', () => {
  it('mostra as duas versões e confirma que as informações são iguais', async () => {
    renderStep(<SimulationStep bundle={bundleOf('c1/m03')} />);
    expect(screen.getByText('Versão A')).toBeInTheDocument();
    expect(screen.getByText('Versão B')).toBeInTheDocument();
    const next = screen.getByRole('button', { name: /Continuar/ });
    expect(next).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /A versão B parece melhor/ }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Boa escolha para pensar!');
    expect(within(status).getAllByText('Igual nas duas')).toHaveLength(3);
    expect(next).toBeEnabled();
  });
});

describe('M04: orçamento da família', () => {
  it('cada escolha diminui o que sobra e pagar depois compromete o próximo passeio', async () => {
    renderStep(<SimulationStep bundle={bundleOf('c1/m04')} />);
    await userEvent.click(screen.getByRole('button', { name: /Passeio de barquinho/ }));
    await userEvent.click(screen.getByRole('button', { name: /Lanche no parque/ }));
    expect(screen.getByText('Sobrou').nextSibling).toHaveTextContent('R$ 5');

    const paints = screen.getByRole('button', { name: /Kit de pintura/ });
    expect(paints).toBeDisabled();
    expect(paints).toHaveTextContent('Não cabe agora: falta R$ 5');

    await userEvent.click(screen.getByRole('button', { name: /Lanche no parque/ }));
    await userEvent.click(screen.getByRole('button', { name: /Kit de pintura/ }));
    expect(screen.getByText('Já combinado').nextSibling).toHaveTextContent('R$ 10');
    expect(screen.getByText(/Disponível no próximo passeio/).nextSibling).toHaveTextContent(
      'R$ 20',
    );
  });
});

describe('Conclusão do módulo', () => {
  it('leva ao próximo módulo, sem pontos nem placar', () => {
    renderStep(
      <DoneStep
        bundle={bundle}
        nav={{ nextModule: { id: 'm02', title: 'Dinheiro' }, hasCycleSummary: true }}
      />,
    );
    expect(screen.getByRole('link', { name: /Próximo módulo/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/modulos\/c1\/m02\/?$/),
    );
    expect(document.body).not.toHaveTextContent(/pontos|ranking|placar/i);
  });

  it('no último módulo, leva ao "O que descobrimos?"', () => {
    renderStep(
      <DoneStep bundle={bundleOf('c1/m04')} nav={{ nextModule: null, hasCycleSummary: true }} />,
    );
    expect(screen.getByRole('link', { name: /O que descobrimos/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/jornadas\/c1\/o-que-descobrimos\/?$/),
    );
  });
});
