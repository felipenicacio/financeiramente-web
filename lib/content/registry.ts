/**
 * Registro estático do conteúdo.
 *
 * Os JSON são importados em tempo de build: o site final não busca nada em
 * rede para exibir o conteúdo. Para publicar um novo módulo: criar a pasta em
 * content/<ciclo>/<módulo>, adicionar a entrada abaixo e marcá-lo como
 * "available" em content/catalog.json.
 */
import c1M01Activity from '@/content/c1/m01/activity.json';
import c1M01Infographic from '@/content/c1/m01/infographic.json';
import c1M01Module from '@/content/c1/m01/module.json';
import c1M01Quiz from '@/content/c1/m01/quiz.json';
import c1M01Simulation from '@/content/c1/m01/simulation.json';
import c1M01Story from '@/content/c1/m01/story.json';
import c1M02Activity from '@/content/c1/m02/activity.json';
import c1M02Infographic from '@/content/c1/m02/infographic.json';
import c1M02Module from '@/content/c1/m02/module.json';
import c1M02Quiz from '@/content/c1/m02/quiz.json';
import c1M02Simulation from '@/content/c1/m02/simulation.json';
import c1M02Story from '@/content/c1/m02/story.json';
import c1M03Activity from '@/content/c1/m03/activity.json';
import c1M03Infographic from '@/content/c1/m03/infographic.json';
import c1M03Module from '@/content/c1/m03/module.json';
import c1M03Quiz from '@/content/c1/m03/quiz.json';
import c1M03Simulation from '@/content/c1/m03/simulation.json';
import c1M03Story from '@/content/c1/m03/story.json';
import c1M04Activity from '@/content/c1/m04/activity.json';
import c1M04Infographic from '@/content/c1/m04/infographic.json';
import c1M04Module from '@/content/c1/m04/module.json';
import c1M04Quiz from '@/content/c1/m04/quiz.json';
import c1M04Simulation from '@/content/c1/m04/simulation.json';
import c1M04Story from '@/content/c1/m04/story.json';
import c1Cycle from '@/content/c1/cycle.json';
import catalog from '@/content/catalog.json';
import ui from '@/content/ui.json';

import type { ModuleBundle } from './types';

export const rawCatalog: unknown = catalog;
export const rawUiStrings: unknown = ui;

export const rawModules: Record<string, Record<keyof ModuleBundle, unknown>> = {
  'c1/m01': {
    module: c1M01Module,
    story: c1M01Story,
    infographic: c1M01Infographic,
    activity: c1M01Activity,
    simulation: c1M01Simulation,
    quiz: c1M01Quiz,
  },
  'c1/m02': {
    module: c1M02Module,
    story: c1M02Story,
    infographic: c1M02Infographic,
    activity: c1M02Activity,
    simulation: c1M02Simulation,
    quiz: c1M02Quiz,
  },
  'c1/m03': {
    module: c1M03Module,
    story: c1M03Story,
    infographic: c1M03Infographic,
    activity: c1M03Activity,
    simulation: c1M03Simulation,
    quiz: c1M03Quiz,
  },
  'c1/m04': {
    module: c1M04Module,
    story: c1M04Story,
    infographic: c1M04Infographic,
    activity: c1M04Activity,
    simulation: c1M04Simulation,
    quiz: c1M04Quiz,
  },
};

/** Página "O que descobrimos?" de cada ciclo. */
export const rawCycleSummaries: Record<string, unknown> = {
  c1: c1Cycle,
};
