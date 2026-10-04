import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { availableModules, loadCatalog, loadCycleSummary, loadModuleBundle } from '@/lib/content';
import { econominhoAssets, themePoses } from '@/components/econominho/assets';
import { moduleThemes } from '@/lib/content/types';
import ui from '@/content/ui.json';
import { competencyCodes, sourceCodes } from '@/lib/validation/contentSchemas';
import type { Lesson } from '@/lib/content/types';
import competencyCatalog from '@/content/competencies.json';
import { competencyDescription } from '@/lib/content/competencies';

/**
 * Guarda de conteúdo do currículo C1–C2 (v2.0). Valida a arquitetura
 * ciclo → módulo → lição, a rastreabilidade (competências, fontes,
 * sensibilidade) e a existência dos assets oficiais do Econominho.
 */
const root = join(__dirname, '..');
const sensitivities = new Set(['N1', 'N2', 'N3']);

const modules = availableModules();

function allLessons(): Lesson[] {
  return modules.flatMap(({ cycle, moduleId }) => {
    const bundle = loadModuleBundle(cycle, moduleId);
    if (!bundle.ok) throw new Error(`${cycle}/${moduleId} não validou`);
    return bundle.data.lessons;
  });
}

describe('catálogo', () => {
  it('carrega sem problemas de validação', () => {
    const catalog = loadCatalog();
    expect(catalog.ok).toBe(true);
  });

  it('publica o C1 com 6 módulos', () => {
    const c1 = modules.filter((entry) => entry.cycle === 'c1');
    expect(c1).toHaveLength(6);
  });

  it('publica o C2 com 6 módulos', () => {
    const c2 = modules.filter((entry) => entry.cycle === 'c2');
    expect(c2).toHaveLength(6);
  });
});

describe('módulos e lições (C1 e C2)', () => {
  it.each(modules)('o módulo %s valida e tem 5 lições', ({ cycle, moduleId }) => {
    const bundle = loadModuleBundle(cycle, moduleId);
    expect(bundle.ok).toBe(true);
    if (!bundle.ok) return;
    expect(bundle.data.lessons).toHaveLength(5);
    // Lições em ordem 1..5.
    expect(bundle.data.lessons.map((lesson) => lesson.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it('tem 60 lições no total (C1 + C2)', () => {
    expect(allLessons()).toHaveLength(60);
  });

  it('não repete o id de nenhuma lição', () => {
    const ids = allLessons().map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada lição tem de 2 a 4 objetos', () => {
    for (const lesson of allLessons()) {
      expect(lesson.content.length).toBeGreaterThanOrEqual(2);
      expect(lesson.content.length).toBeLessThanOrEqual(4);
    }
  });

  // Barra de qualidade do template C1 (herdada por C2–C4):
  // arco ensinar → mostrar → aplicar, sem repetir tipo e sempre com interação.
  it('cada lição tem ao menos 3 objetos (arco completo)', () => {
    for (const lesson of allLessons()) {
      expect(lesson.content.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('cada lição usa tipos de objeto variados (sem repetir tipo)', () => {
    for (const lesson of allLessons()) {
      const types = lesson.content.map((object) => object.type);
      expect(new Set(types).size).toBe(types.length);
    }
  });

  it('cada lição tem ao menos um objeto interativo', () => {
    const interactive = new Set([
      'classify',
      'compare',
      'afford',
      'change',
      'choice',
      'ordering',
      'trueFalse',
      'quiz',
    ]);
    for (const lesson of allLessons()) {
      expect(lesson.content.some((object) => interactive.has(object.type))).toBe(true);
    }
  });
});

describe('catálogo de competências', () => {
  it('contém as 36 competências oficiais com descrição legível', () => {
    expect(competencyCatalog.competencies).toHaveLength(36);
    for (const item of competencyCatalog.competencies) {
      expect(item.code).toBeTruthy();
      expect(item.description.trim().length).toBeGreaterThan(10);
      expect(competencyDescription(item.code)).toBe(item.description);
    }
  });
});

describe('rastreabilidade', () => {
  it('toda competência citada existe na matriz (36 códigos)', () => {
    const valid = new Set<string>(competencyCodes);
    for (const lesson of allLessons()) {
      expect(lesson.competencies.length).toBeGreaterThan(0);
      for (const code of lesson.competencies) expect(valid.has(code)).toBe(true);
    }
  });

  it('toda fonte usa um código conhecido e tem referência', () => {
    const valid = new Set<string>(sourceCodes);
    for (const lesson of allLessons()) {
      for (const source of lesson.sources) {
        expect(valid.has(source.source)).toBe(true);
        expect(source.reference.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('toda lição declara sensibilidade N1, N2 ou N3', () => {
    for (const lesson of allLessons()) expect(sensitivities.has(lesson.sensitivity)).toBe(true);
  });

  it('cada módulo fecha com avaliação integradora e síntese', () => {
    for (const { cycle, moduleId } of modules) {
      const bundle = loadModuleBundle(cycle, moduleId);
      if (!bundle.ok) continue;
      const { module } = bundle.data;
      expect(module.integrative.object).toBeTruthy();
      expect(module.conclusion.recap.length).toBeGreaterThan(0);
    }
  });
});

describe('resumo do ciclo', () => {
  it('o C1 tem "O que descobrimos?"', () => {
    const summary = loadCycleSummary('c1');
    expect(summary?.ok).toBe(true);
  });

  it('o C2 tem "O que descobrimos?"', () => {
    const summary = loadCycleSummary('c2');
    expect(summary?.ok).toBe(true);
  });
});

describe('assets oficiais do Econominho', () => {
  it('o avatar de cada estado de fala existe no disco', () => {
    const states = ['ask', 'discover', 'compare', 'consequence', 'summary', 'reflect'] as const;
    for (const state of states) {
      const rel = econominhoAssets.avatar(state).replace(/^.*?(\/econominho\/)/, 'econominho/');
      expect(existsSync(join(root, 'public', rel))).toBe(true);
    }
  });

  it('cada pose de tema existe no disco', () => {
    for (const pose of themePoses) {
      const rel = econominhoAssets.theme(pose).replace(/^.*?(\/econominho\/)/, 'econominho/');
      expect(existsSync(join(root, 'public', rel))).toBe(true);
    }
  });

  it('o theme de cada módulo é uma pose válida', () => {
    const valid = new Set<string>(themePoses);
    for (const { cycle, moduleId } of modules) {
      const bundle = loadModuleBundle(cycle, moduleId);
      if (!bundle.ok) continue;
      const { theme } = bundle.data.module;
      if (theme) expect(valid.has(theme)).toBe(true);
    }
  });

  it('todo PNG de personagem é um asset individual aprovado (v2)', () => {
    const dir = join(root, 'public', 'econominho', 'character');
    const pngs = readdirSync(dir).filter((name) => name.endsWith('.png'));
    // Todos os PNGs de personagem devem ser os v2 aprovados.
    for (const name of pngs) expect(name.endsWith('-v2.png')).toBe(true);
  });
});

// ---------- guardas adicionais da revisão final do C1 ----------

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (['node_modules', '.next', 'out', '.git', 'screenshots'].includes(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const textFiles = (dirs: string[]) =>
  dirs
    .flatMap((dir) => walk(join(root, dir)))
    .filter((path) => /\.(tsx?|json|md|css|mjs|js)$/.test(path))
    .map((path) => ({ path: relative(root, path), text: readFileSync(path, 'utf8') }));

describe('módulos: tema (pose do Econominho)', () => {
  it('cada módulo do C1 usa a pose combinada, nunca um id de módulo', () => {
    const esperado: Record<string, string> = {
      m01: 'descoberta',
      m02: 'pensando',
      m03: 'comparando',
      m04: 'lendo',
      m05: 'feliz',
      m06: 'explicando',
    };
    for (const [moduleId, theme] of Object.entries(esperado)) {
      const bundle = loadModuleBundle('c1', moduleId);
      expect(bundle.ok).toBe(true);
      if (bundle.ok) expect(bundle.data.module.theme).toBe(theme);
    }
  });

  it('cada módulo do C2 usa a pose combinada, nunca um id de módulo', () => {
    const esperado: Record<string, string> = {
      m01: 'descoberta',
      m02: 'pensando',
      m03: 'comparando',
      m04: 'explicando',
      m05: 'lendo',
      m06: 'feliz',
    };
    for (const [moduleId, theme] of Object.entries(esperado)) {
      const bundle = loadModuleBundle('c2', moduleId);
      expect(bundle.ok).toBe(true);
      if (bundle.ok) expect(bundle.data.module.theme).toBe(theme);
    }
  });

  it('o tipo ModuleTheme cobre exatamente as poses com arte disponível', () => {
    expect([...moduleThemes].sort()).toEqual([...themePoses].sort());
    expect(moduleThemes).not.toContain('m01');
  });
});

describe('assets do Econominho: somente v2 individuais aprovados', () => {
  // A palavra é montada por partes para o próprio teste não acusar a si mesmo.
  const pacoteAntigo = ['econominho', 'assets', 'v1'].join('-');

  it('nenhum código ou documentação ativa cita o pacote antigo', () => {
    const files = textFiles([
      'app',
      'components',
      'lib',
      'content',
      'docs',
      'public/econominho',
      'scripts',
    ]);
    files.push({ path: 'README.md', text: readFileSync(join(root, 'README.md'), 'utf8') });
    const ofensores = files.filter((f) => f.text.includes(pacoteAntigo)).map((f) => f.path);
    expect(ofensores).toEqual([]);
  });

  it('nenhum caminho aponta para arte de personagem sem sufixo -v2', () => {
    const files = textFiles(['app', 'components', 'lib', 'content', 'public/econominho']);
    const padrao = /econominho\/character\/[\w-]+\.png/g;
    const ruins = files.flatMap((f) =>
      (f.text.match(padrao) ?? [])
        .filter((caminho) => !caminho.endsWith('-v2.png'))
        .map((c) => `${f.path}: ${c}`),
    );
    expect(ruins).toEqual([]);
  });

  it('não restam pastas ou arquivos do pacote antigo em public/econominho', () => {
    expect(existsSync(join(root, 'public/econominho/themes'))).toBe(false);
    const logos = readdirSync(join(root, 'public/econominho/logo'));
    expect(logos.every((name) => name.includes('-v2'))).toBe(true);
  });

  it('o manifesto declara assets individuais aprovados e todos os caminhos existem', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'public/econominho/assets.json'), 'utf8'));
    expect(manifest.source).toMatch(/individuais aprovados/i);
    const caminhos: string[] = [];
    const coletar = (valor: unknown) => {
      if (typeof valor === 'string' && valor.startsWith('/')) caminhos.push(valor);
      else if (valor && typeof valor === 'object') Object.values(valor).forEach(coletar);
    };
    coletar(manifest);
    expect(caminhos.length).toBeGreaterThan(0);
    for (const caminho of caminhos) expect(existsSync(join(root, 'public', caminho))).toBe(true);
  });

  it('o logotipo do cabeçalho usa o wordmark v2', () => {
    const brand = readFileSync(join(root, 'components/ui/Brand.tsx'), 'utf8');
    expect(brand).toContain('wordmark-v2');
    expect(existsSync(join(root, 'public/brand/econominho-wordmark.png'))).toBe(false);
  });
});

describe('competências: catálogo oficial', () => {
  it('cada competência tem código, descrição, ciclo, domínio e sensibilidade', () => {
    for (const item of competencyCatalog.competencies) {
      expect(item.code).toMatch(/^F-D[1-9]-C[1-4]-\d{2}$/);
      expect(item.description.trim().length).toBeGreaterThan(10);
      expect(item.cycle).toBe(`c${item.code.charAt(6)}`);
      expect(item.domain).toBe(item.code.slice(2, 4).replace('-', ''));
      expect(['N1', 'N2', 'N3']).toContain(item.sensitivity);
    }
    const codigos = competencyCatalog.competencies.map((item) => item.code);
    expect(new Set(codigos).size).toBe(36);
  });

  it('o catálogo e a lista de códigos validados coincidem', () => {
    const catalogo = competencyCatalog.competencies.map((item) => item.code).sort();
    expect([...competencyCodes].sort()).toEqual(catalogo);
  });

  it('toda competência usada por módulos e lições tem descrição legível', () => {
    const usadas = new Set<string>();
    for (const lesson of allLessons()) lesson.competencies.forEach((code) => usadas.add(code));
    for (const { cycle, moduleId } of modules) {
      const bundle = loadModuleBundle(cycle, moduleId);
      if (bundle.ok) bundle.data.module.competencies.forEach((code) => usadas.add(code));
    }
    expect(usadas.size).toBeGreaterThan(0);
    for (const code of usadas)
      expect(competencyDescription(code)?.trim().length).toBeGreaterThan(10);
  });
});

describe('personagens das histórias', () => {
  const criancas = ['Téo', 'Nina', 'Bia', 'Caio'];
  const adultos = ['Jorge', 'Lúcia', 'Marta', 'Luís', 'Davi', 'Sônia', 'Rosa', 'Rita'];
  const lugares = ['Brasil'];

  /** Nomes próprios no meio de frases, vindos de todo o texto do C1. */
  function nomesPropriosNoConteudo(): Set<string> {
    const textos: string[] = [];
    const coletar = (valor: unknown, chave = '') => {
      if (typeof valor === 'string') {
        if (
          ![
            'id',
            'type',
            'illustration',
            'icon',
            'tone',
            'state',
            'kind',
            'source',
            'reference',
            'role',
            'sensitivity',
            'cycle',
            'module',
            'theme',
            'code',
          ].includes(chave)
        ) {
          textos.push(valor);
        }
      } else if (Array.isArray(valor)) valor.forEach((item) => coletar(item, chave));
      else if (valor && typeof valor === 'object') {
        Object.entries(valor).forEach(([k, v]) => coletar(v, k));
      }
    };
    for (const lesson of allLessons()) coletar(lesson);
    for (const { cycle, moduleId } of modules) {
      const bundle = loadModuleBundle(cycle, moduleId);
      if (bundle.ok) coletar(bundle.data.module);
    }
    const nomes = new Set<string>();
    for (const texto of textos) {
      for (const m of texto.matchAll(/\s([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)/g)) {
        const antes = texto.slice(0, m.index).trimEnd();
        if (antes === '' || /[.!?:“"”—]$/.test(antes)) continue;
        nomes.add(m[1] as string);
      }
    }
    return nomes;
  }

  it('mantém Téo, Nina, Bia e Caio e não cria outros personagens', () => {
    const nomes = nomesPropriosNoConteudo();
    for (const nome of criancas) expect(nomes.has(nome)).toBe(true);
    const conhecidos = new Set([...criancas, ...adultos, ...lugares]);
    const desconhecidos = [...nomes].filter((nome) => !conhecidos.has(nome));
    expect(desconhecidos).toEqual([]);
  });

  it('no máximo quatro crianças recorrentes', () => {
    expect(criancas).toHaveLength(4);
  });
});

describe('sem nota, ranking, certificado ou gamificação', () => {
  const proibidos =
    /\b(ranking|certificado|pontua[çc][ãa]o|pontos?|placar|notas?|medalha|estrelas?|troféu|streak)\b|%/i;

  it('o conteúdo do C1, do C2 e os textos da interface não usam esse vocabulário', () => {
    const arquivos = textFiles(['content/c1', 'content/c2']).concat([
      { path: 'content/ui.json', text: JSON.stringify(ui) },
    ]);
    const ofensores = arquivos.filter((f) => proibidos.test(f.text)).map((f) => f.path);
    expect(ofensores).toEqual([]);
  });

  it('as lições não são bloqueadas: nada no código impede abrir qualquer módulo ou lição', () => {
    const files = textFiles(['app', 'components', 'lib']);
    const bloqueios = files
      .filter((f) => /\b(locked|isLocked|unlockModule|requiresCompletion)\b/.test(f.text))
      .map((f) => f.path);
    expect(bloqueios).toEqual([]);
  });
});
