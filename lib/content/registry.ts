/**
 * Registro estático do conteúdo.
 *
 * Os JSON são importados em tempo de build: o site final não busca nada em
 * rede para exibir o conteúdo. Para publicar um novo módulo: criar a pasta em
 * content/<ciclo>/<módulo>, adicionar a entrada abaixo e marcá-lo como
 * "available" em content/catalog.json.
 */
import c1m01Activity from '@/content/c1/m01/activity.json';
import c1m01Infographic from '@/content/c1/m01/infographic.json';
import c1m01Module from '@/content/c1/m01/module.json';
import c1m01Quiz from '@/content/c1/m01/quiz.json';
import c1m01Simulation from '@/content/c1/m01/simulation.json';
import c1m01Story from '@/content/c1/m01/story.json';
import catalog from '@/content/catalog.json';
import ui from '@/content/ui.json';

import type { ModuleBundle } from './types';

export const rawCatalog: unknown = catalog;
export const rawUiStrings: unknown = ui;

export const rawModules: Record<string, Record<keyof ModuleBundle, unknown>> = {
  'c1/m01': {
    module: c1m01Module,
    story: c1m01Story,
    infographic: c1m01Infographic,
    activity: c1m01Activity,
    simulation: c1m01Simulation,
    quiz: c1m01Quiz,
  },
};
