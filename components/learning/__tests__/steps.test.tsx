import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rawModules } from '@/lib/content/registry';
import type { ModuleBundle } from '@/lib/content/types';
import { SessionProvider } from '@/lib/session/SessionProvider';

import { ChoiceCard } from '../ChoiceCard';
import { ActivityStep } from '../steps/ActivityStep';
import { QuizStep } from '../steps/QuizStep';
import { SimulationStep } from '../steps/SimulationStep';
import { StoryStep } from '../steps/StoryStep';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const bundle = rawModules['c1/m01'] as unknown as ModuleBundle;
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
