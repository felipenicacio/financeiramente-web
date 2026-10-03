import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Guarda de privacidade e segurança: o código do site não pode coletar,
 * gravar ou enviar dados, nem carregar recursos de terceiros.
 * Se um teste daqui falhar, a mudança precisa de decisão explícita e
 * documentação (docs/architecture.md), não de ajuste no teste.
 */
const root = join(__dirname, '..');
const scanned = ['app', 'components', 'lib', 'theme', 'styles', 'public'];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : files(path);
    return /\.(tsx?|css|js|json|html|webmanifest)$/.test(name) && !/\.test\./.test(name)
      ? [path]
      : [];
  });
}

const sources = scanned
  .flatMap((dir) => files(join(root, dir)))
  .map((path) => ({ path: relative(root, path), text: readFileSync(path, 'utf8') }));

const offenders = (pattern: RegExp) =>
  sources.filter((file) => pattern.test(file.text)).map((file) => file.path);

describe('privacidade', () => {
  it('não usa armazenamento persistente do navegador', () => {
    expect(offenders(/\b(localStorage|sessionStorage|indexedDB|document\.cookie)\b/)).toEqual([]);
  });

  it('não envia dados (fetch/beacon/XHR) a partir do código da aplicação', () => {
    const appCode = /\b(navigator\.sendBeacon|XMLHttpRequest|axios)\b|[^.\w]fetch\(/;
    // O service worker usa fetch apenas para servir os próprios arquivos do site.
    expect(offenders(appCode).filter((path) => path !== 'public/sw.js')).toEqual([]);
  });

  it('não carrega scripts, fontes ou imagens de terceiros', () => {
    const external = /(src|href)=["'{`]\s*https?:\/\/|fonts\.googleapis|googletagmanager|gtag\(/;
    expect(offenders(external)).toEqual([]);
  });

  it('não contém formulários de dados pessoais', () => {
    expect(offenders(/<(form|input|textarea)\b/)).toEqual([]);
  });
});
