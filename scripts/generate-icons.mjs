/**
 * Gera os ícones PNG do PWA e a imagem Open Graph a partir de SVG.
 * Execução manual, só quando a marca mudar: `node scripts/generate-icons.mjs`.
 * Os PNG gerados ficam versionados em public/; o build não depende deste script.
 * Usa o `sharp`, já instalado como dependência do Next.js. A imagem OG usa a
 * fonte Lexend instalada no sistema de quem gera (sem fonte, cai no padrão).
 */
import { mkdir, writeFile } from 'node:fs/promises';

import sharp from 'sharp';

const navy = '#0F172A';
const stones = (scale = 1, dx = 0, dy = 0) => `
  <g transform="translate(${dx} ${dy}) scale(${scale})">
    <ellipse cx="9" cy="23" rx="4.5" ry="2.6" fill="#14B8A6"/>
    <ellipse cx="16" cy="17" rx="4.5" ry="2.6" fill="#FB7185"/>
    <ellipse cx="23" cy="11" rx="4.5" ry="2.6" fill="#F59E0B"/>
  </g>`;

/** Ícone padrão: quadrado arredondado. */
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="9" fill="${navy}"/>${stones()}</svg>`;

/** Ícone "maskable": fundo cheio, marca dentro da zona segura (80% central). */
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${navy}"/>${stones(0.7, 4.8, 4.8)}</svg>`;

/** Ícone Apple: quadrado cheio (o iOS aplica o arredondamento). */
const apple = maskable.replace(stones(0.7, 4.8, 4.8), stones(0.8, 3.2, 3.2));

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F8FAFC"/>
  <path d="M640 640c80-110 230-80 290-170s180-100 250-190" stroke="#CCFBF1" stroke-width="90" fill="none" stroke-linecap="round"/>
  <ellipse cx="700" cy="560" rx="52" ry="28" fill="#14B8A6"/>
  <ellipse cx="850" cy="470" rx="52" ry="28" fill="#38BDF8"/>
  <ellipse cx="990" cy="380" rx="52" ry="28" fill="#F59E0B"/>
  <ellipse cx="1120" cy="290" rx="52" ry="28" fill="#FB7185"/>
  <g transform="translate(96 110)">
    <rect width="88" height="88" rx="25" fill="${navy}"/>
    ${stones(2.75)}
  </g>
  <text x="96" y="300" font-family="Lexend" font-weight="700" font-size="76" fill="${navy}" letter-spacing="-2">Financeiramente</text>
  <text x="96" y="370" font-family="Lexend" font-weight="400" font-size="36" fill="#334155">Aprender a escolher, juntos.</text>
  <text x="96" y="430" font-family="Lexend" font-weight="400" font-size="26" fill="#64748B">Educação financeira para estudar em família</text>
</svg>`;

const png = (svg, size, file) =>
  sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toFile(file);

await mkdir('public/icons', { recursive: true });
await png(rounded, 192, 'public/icons/icon-192.png');
await png(rounded, 512, 'public/icons/icon-512.png');
await png(maskable, 512, 'public/icons/icon-maskable-512.png');
await png(apple, 180, 'public/icons/apple-touch-icon.png');
await sharp(Buffer.from(og)).png().toFile('public/og.png');

// favicon.ico com uma imagem PNG 32×32 embutida (formato ICO aceita PNG).
const fav = await sharp(Buffer.from(rounded), { density: 600 }).resize(32, 32).png().toBuffer();
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

console.log('Ícones e imagem Open Graph gerados em public/.');
