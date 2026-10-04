/**
 * Embaralhamento puro e testável (Fisher-Yates).
 *
 * Nunca muta o array recebido — sempre retorna uma cópia nova. O gerador de
 * números aleatórios é injetável: produção usa uma semente determinística
 * (`seededRandom`), testes passam uma função fixa para verificar o
 * algoritmo sem depender de sorte.
 *
 * A correção de uma alternativa é sempre resolvida pelo `id`, nunca pela
 * posição — este utilitário só decide a ORDEM de apresentação.
 */
export type RandomFn = () => number;

export function shuffle<T>(items: readonly T[], randomFn: RandomFn = Math.random): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

/**
 * Gera uma função aleatória determinística a partir de um texto-semente
 * (xmur3 + xorshift). Mesma semente sempre produz a mesma sequência.
 *
 * As telas de lição são pré-renderizadas no build estático e depois
 * hidratadas no navegador: se o embaralhamento usasse `Math.random`, o
 * HTML gerado no build e o HTML calculado na hidratação do cliente
 * ficariam com ordens diferentes, e o React rejeita a árvore (erro de
 * hidratação). Semear pelo `id` do conteúdo (estável entre build e
 * cliente) resolve isso: a ordem ainda varia de pergunta para pergunta,
 * só não varia entre o HTML do build e o do navegador para a mesma
 * pergunta.
 */
export function seededRandom(seed: string): RandomFn {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function random() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
