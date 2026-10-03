import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { palette } from './tokens';

/** A paleta em TypeScript (SVGs, manifest) e a do CSS precisam ser a mesma. */
describe('Design System', () => {
  const css = readFileSync(join(__dirname, '../styles/globals.css'), 'utf8').toLowerCase();

  it.each(Object.entries(palette))('%s (%s) está declarada no CSS', (_, hex) => {
    expect(css).toContain(hex.toLowerCase());
  });
});
