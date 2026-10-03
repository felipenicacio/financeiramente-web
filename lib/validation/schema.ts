/**
 * Validação mínima de JSON sem dependências externas.
 *
 * Cada validador recebe um valor desconhecido e um caminho, e devolve a lista
 * de problemas encontrados. Os tipos TypeScript do conteúdo (lib/content/types.ts)
 * descrevem o mesmo formato; os testes garantem que os dois andam juntos.
 */
export type ValidationIssue = { path: string; message: string };
export type Validator = (value: unknown, path: string) => ValidationIssue[];

const issue = (path: string, message: string): ValidationIssue[] => [{ path, message }];

export const string =
  (options: { minLength?: number; maxLength?: number } = {}): Validator =>
  (value, path) => {
    if (typeof value !== 'string') return issue(path, 'deveria ser texto');
    const trimmed = value.trim();
    const min = options.minLength ?? 1;
    if (trimmed.length < min) return issue(path, `texto vazio ou menor que ${min} caracteres`);
    if (options.maxLength && trimmed.length > options.maxLength) {
      return issue(path, `texto com ${trimmed.length} caracteres; o limite é ${options.maxLength}`);
    }
    return [];
  };

export const number =
  (options: { min?: number; max?: number; integer?: boolean } = {}): Validator =>
  (value, path) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return issue(path, 'deveria ser número');
    if (options.integer && !Number.isInteger(value))
      return issue(path, 'deveria ser número inteiro');
    if (options.min !== undefined && value < options.min)
      return issue(path, `menor que ${options.min}`);
    if (options.max !== undefined && value > options.max)
      return issue(path, `maior que ${options.max}`);
    return [];
  };

export const literal =
  <T extends string>(...allowed: T[]): Validator =>
  (value, path) =>
    typeof value === 'string' && (allowed as string[]).includes(value)
      ? []
      : issue(path, `deveria ser um de: ${allowed.join(', ')}`);

export const array =
  (item: Validator, options: { min?: number; max?: number } = {}): Validator =>
  (value, path) => {
    if (!Array.isArray(value)) return issue(path, 'deveria ser lista');
    const problems: ValidationIssue[] = [];
    if (options.min !== undefined && value.length < options.min) {
      problems.push({ path, message: `deveria ter ao menos ${options.min} itens` });
    }
    if (options.max !== undefined && value.length > options.max) {
      problems.push({ path, message: `deveria ter no máximo ${options.max} itens` });
    }
    value.forEach((entry, index) => problems.push(...item(entry, `${path}[${index}]`)));
    return problems;
  };

type Shape = Record<string, Validator | { optional: Validator }>;

export const optional = (validator: Validator) => ({ optional: validator });

export const object =
  (shape: Shape): Validator =>
  (value, path) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return issue(path, 'deveria ser objeto');
    }
    const record = value as Record<string, unknown>;
    const problems: ValidationIssue[] = [];
    for (const [key, rule] of Object.entries(shape)) {
      const childPath = path ? `${path}.${key}` : key;
      if ('optional' in rule) {
        if (record[key] !== undefined) problems.push(...rule.optional(record[key], childPath));
      } else if (record[key] === undefined) {
        problems.push({ path: childPath, message: 'campo obrigatório ausente' });
      } else {
        problems.push(...rule(record[key], childPath));
      }
    }
    return problems;
  };

/** Garante que os valores de `field` sejam únicos dentro de uma lista. */
export const uniqueBy =
  (field: string): Validator =>
  (value, path) => {
    if (!Array.isArray(value)) return [];
    const seen = new Set<unknown>();
    const problems: ValidationIssue[] = [];
    value.forEach((entry, index) => {
      const key = (entry as Record<string, unknown> | null)?.[field];
      if (seen.has(key))
        problems.push({
          path: `${path}[${index}].${field}`,
          message: `valor repetido: ${String(key)}`,
        });
      seen.add(key);
    });
    return problems;
  };

export const all =
  (...validators: Validator[]): Validator =>
  (value, path) =>
    validators.flatMap((validate) => validate(value, path));

/** Regra customizada sobre um valor já validado estruturalmente. */
export const refine =
  (check: (value: never) => string | null): Validator =>
  (value, path) => {
    const message = check(value as never);
    return message ? issue(path, message) : [];
  };
