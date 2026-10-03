/**
 * Avaliador mínimo de expressões aritméticas para valores derivados do
 * conteúdo (ex.: "dinheiro - preco"). Suporta números inteiros, nomes,
 * + - * e parênteses. Não usa eval: o conteúdo nunca executa código.
 */

type Token =
  { type: 'num'; value: number } | { type: 'name'; value: string } | { type: 'op'; value: string };

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /\s*(?:(\d+)|([A-Za-z_]\w*)|([-+*()]))/y;
  let index = 0;
  while (index < source.length) {
    if (/^\s*$/.test(source.slice(index))) break;
    pattern.lastIndex = index;
    const match = pattern.exec(source);
    if (!match) throw new Error(`caractere inválido em "${source}"`);
    if (match[1]) tokens.push({ type: 'num', value: Number(match[1]) });
    else if (match[2]) tokens.push({ type: 'name', value: match[2] });
    else if (match[3]) tokens.push({ type: 'op', value: match[3] });
    index = pattern.lastIndex;
  }
  return tokens;
}

export function evaluateExpression(source: string, scope: Record<string, number>): number {
  const tokens = tokenize(source);
  let position = 0;

  const peek = () => tokens[position];
  const take = () => tokens[position++];

  function primary(): number {
    const token = take();
    if (!token) throw new Error(`expressão incompleta: "${source}"`);
    if (token.type === 'num') return token.value;
    if (token.type === 'name') {
      if (!(token.value in scope)) throw new Error(`valor desconhecido: ${token.value}`);
      return scope[token.value] as number;
    }
    if (token.value === '(') {
      const value = sum();
      const close = take();
      if (!close || close.value !== ')') throw new Error(`parêntese sem fechar: "${source}"`);
      return value;
    }
    if (token.value === '-') return -primary();
    throw new Error(`operador inesperado "${token.value}" em "${source}"`);
  }

  function product(): number {
    let value = primary();
    while (peek()?.value === '*') {
      take();
      value *= primary();
    }
    return value;
  }

  function sum(): number {
    let value = product();
    while (peek()?.value === '+' || peek()?.value === '-') {
      const op = take()?.value;
      const right = product();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

  const result = sum();
  if (position < tokens.length) throw new Error(`sobra texto na expressão: "${source}"`);
  return result;
}

/**
 * Resolve valores declarados + derivados, na ordem. Lança erro se uma
 * expressão for inválida ou citar um valor que não existe.
 */
export function resolveValues(
  values: Record<string, number>,
  derived: { name: string; expr: string }[],
): Record<string, number> {
  const scope: Record<string, number> = { ...values };
  for (const entry of derived) {
    scope[entry.name] = evaluateExpression(entry.expr, scope);
  }
  return scope;
}
