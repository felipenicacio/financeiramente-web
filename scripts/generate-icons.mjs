/**
 * Gera favicon, ícones do PWA e imagem Open Graph a partir da marca
 * Econominho (public/brand). Execução manual, só quando a marca mudar:
 * `node scripts/generate-icons.mjs`. Os arquivos gerados ficam versionados
 * em public/; o build não depende deste script. Usa o `sharp`, já instalado
 * como dependência do Next.js.
 */
import { readFile, writeFile } from 'node:fs/promises';

import sharp from 'sharp';

const navy = '#0B3B75';
const amber = '#FFC83D';

/** Desenho do "E" com raios, no grid 256×256 do arquivo original. */
const mark = `<g fill="${amber}">
  <rect x="78" y="24" width="14" height="40" rx="7" transform="rotate(-28 85 44)"/>
  <rect x="121" y="16" width="14" height="44" rx="7"/>
  <rect x="164" y="24" width="14" height="40" rx="7" transform="rotate(28 171 44)"/>
  <path d="M78 82h101v31h-63v24h55v29h-55v27h66v31H78z"/>
</g>`;

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${body}</svg>`;

/** Ícone padrão: igual ao arquivo de marca (quadrado arredondado). */
const rounded = await readFile('public/brand/econominho-icon.svg', 'utf8');

/** Maskable e Apple: fundo cheio, marca reduzida para a zona segura. */
const fullBleed = (scale) => {
  const offset = (256 * (1 - scale)) / 2;
  return svg(
    `<rect width="256" height="256" fill="${navy}"/><g transform="translate(${offset} ${offset}) scale(${scale})">${mark}</g>`,
  );
};

const png = (source, size, file) =>
  sharp(Buffer.from(source), { density: 400 }).resize(size, size).png().toFile(file);

await writeFile('public/icons/icon.svg', rounded);
await png(rounded, 192, 'public/icons/icon-192.png');
await png(rounded, 512, 'public/icons/icon-512.png');
await png(fullBleed(0.72), 512, 'public/icons/icon-maskable-512.png');
await png(fullBleed(0.8), 180, 'public/icons/apple-touch-icon.png');

// Imagem Open Graph: logotipo + ícone sobre o fundo claro do site.
const wordmark = await sharp('public/brand/econominho-wordmark.png')
  .resize({ width: 760 })
  .toBuffer();
const wordmarkMeta = await sharp(wordmark).metadata();
const icon = await sharp(Buffer.from(rounded), { density: 400 }).resize(220, 220).png().toBuffer();
const tagline = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F8FAFC"/>
  <rect x="0" y="590" width="1200" height="40" fill="${navy}"/>
  <rect x="0" y="582" width="1200" height="8" fill="${amber}"/>
  <text x="96" y="470" font-family="Lexend" font-weight="400" font-size="38" fill="#334155">Educação financeira para crianças</text>
</svg>`;
await sharp(Buffer.from(tagline))
  .composite([
    { input: icon, left: 884, top: 150 },
    { input: wordmark, left: 80, top: 380 - (wordmarkMeta.height ?? 170) },
  ])
  .png()
  .toFile('public/og.png');

// favicon.ico com uma imagem PNG 32×32 embutida (formato ICO aceita PNG).
const fav = await sharp(Buffer.from(rounded), { density: 400 }).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(fav.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, fav]));

console.log('Ícones e imagem Open Graph gerados em public/ a partir da marca Econominho.');
