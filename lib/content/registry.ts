/**
 * Registro estático do conteúdo do C1 (currículo v2.0).
 *
 * Importado em tempo de build: o site não busca nada em rede para exibir o
 * conteúdo. Para publicar um novo ciclo/módulo, criar as pastas em content/ e
 * adicionar as importações aqui, além de content/catalog.json.
 */
import M01Module from '@/content/c1/m01/module.json';
import M01L1 from '@/content/c1/m01/lessons/l01.json';
import M01L2 from '@/content/c1/m01/lessons/l02.json';
import M01L3 from '@/content/c1/m01/lessons/l03.json';
import M01L4 from '@/content/c1/m01/lessons/l04.json';
import M01L5 from '@/content/c1/m01/lessons/l05.json';
import M02Module from '@/content/c1/m02/module.json';
import M02L1 from '@/content/c1/m02/lessons/l01.json';
import M02L2 from '@/content/c1/m02/lessons/l02.json';
import M02L3 from '@/content/c1/m02/lessons/l03.json';
import M02L4 from '@/content/c1/m02/lessons/l04.json';
import M02L5 from '@/content/c1/m02/lessons/l05.json';
import M03Module from '@/content/c1/m03/module.json';
import M03L1 from '@/content/c1/m03/lessons/l01.json';
import M03L2 from '@/content/c1/m03/lessons/l02.json';
import M03L3 from '@/content/c1/m03/lessons/l03.json';
import M03L4 from '@/content/c1/m03/lessons/l04.json';
import M03L5 from '@/content/c1/m03/lessons/l05.json';
import M04Module from '@/content/c1/m04/module.json';
import M04L1 from '@/content/c1/m04/lessons/l01.json';
import M04L2 from '@/content/c1/m04/lessons/l02.json';
import M04L3 from '@/content/c1/m04/lessons/l03.json';
import M04L4 from '@/content/c1/m04/lessons/l04.json';
import M04L5 from '@/content/c1/m04/lessons/l05.json';
import M05Module from '@/content/c1/m05/module.json';
import M05L1 from '@/content/c1/m05/lessons/l01.json';
import M05L2 from '@/content/c1/m05/lessons/l02.json';
import M05L3 from '@/content/c1/m05/lessons/l03.json';
import M05L4 from '@/content/c1/m05/lessons/l04.json';
import M05L5 from '@/content/c1/m05/lessons/l05.json';
import M06Module from '@/content/c1/m06/module.json';
import M06L1 from '@/content/c1/m06/lessons/l01.json';
import M06L2 from '@/content/c1/m06/lessons/l02.json';
import M06L3 from '@/content/c1/m06/lessons/l03.json';
import M06L4 from '@/content/c1/m06/lessons/l04.json';
import M06L5 from '@/content/c1/m06/lessons/l05.json';
import c1Cycle from '@/content/c1/cycle.json';
import catalog from '@/content/catalog.json';
import ui from '@/content/ui.json';

import type { CycleSummary } from './types';

export const rawCatalog: unknown = catalog;
export const rawUiStrings: unknown = ui;

/** Para cada módulo: metadados crus + lições cruas na ordem l01..l05. */
export const rawModules: Record<string, { module: unknown; lessons: unknown[] }> = {
  'c1/m01': { module: M01Module, lessons: [M01L1, M01L2, M01L3, M01L4, M01L5] },
  'c1/m02': { module: M02Module, lessons: [M02L1, M02L2, M02L3, M02L4, M02L5] },
  'c1/m03': { module: M03Module, lessons: [M03L1, M03L2, M03L3, M03L4, M03L5] },
  'c1/m04': { module: M04Module, lessons: [M04L1, M04L2, M04L3, M04L4, M04L5] },
  'c1/m05': { module: M05Module, lessons: [M05L1, M05L2, M05L3, M05L4, M05L5] },
  'c1/m06': { module: M06Module, lessons: [M06L1, M06L2, M06L3, M06L4, M06L5] },
};

export const rawCycleSummaries: Record<string, unknown> = { c1: c1Cycle };
export type { CycleSummary };
