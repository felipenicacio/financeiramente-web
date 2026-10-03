/**
 * Textos de interface (content/ui.json). Módulo separado do registro de
 * conteúdo para que componentes de cliente importem só os rótulos, sem
 * carregar todos os módulos no bundle do navegador.
 */
import ui from '@/content/ui.json';
import { uiStringsSchema } from '@/lib/validation/contentSchemas';

import type { UiStrings } from './types';

const issues = uiStringsSchema(ui, 'ui.json');
if (issues.length > 0 && process.env.NODE_ENV !== 'production') {
  console.warn(`[conteúdo] ui.json tem ${issues.length} problema(s)`, issues);
}

/** Chave ausente cai no próprio nome da chave, sem quebrar a tela. */
const strings: UiStrings = issues.length === 0 ? (ui as UiStrings) : {};

export function t(key: string, vars?: Record<string, string | number>): string {
  const template = strings[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  );
}
