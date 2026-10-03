# Econominho Web

Versão Web/PWA do **Econominho** (nome de trabalho; antes "Financeiramente"): educação financeira, econômica, social e comportamental para crianças e adolescentes, para estudar em família.

Conteúdo fixo, escrito, revisado e aprovado antes da publicação. **Sem login, sem cadastro, sem perfil, sem banco de dados, sem backend, sem analytics, sem cookies, sem publicidade, sem IA em tempo de execução e sem coleta de dados.**

## Status

Ciclo **C1 (6–8 anos)** completo no currículo v2.0: 6 módulos, 30 lições, abertos em qualquer ordem.

| Módulo | Título                              |
| ------ | ----------------------------------- |
| C1.1   | O dinheiro está por toda parte      |
| C1.2   | Quero, preciso ou posso esperar?    |
| C1.3   | Preço, comparação e troco           |
| C1.4   | Trabalho, renda, bens e serviços    |
| C1.5   | Guardar e cuidar                    |
| C1.6   | Escolhas, influência e convivência  |

Arquitetura **ciclo → módulo → lição → objetos**: cada módulo tem 5 lições; cada lição tem de 2 a 4 objetos educacionais de tipos variados (explicação, história, conceitos, classificação, comparação, troco, escolha, ordenação, V/F, quiz, reflexão). Cada módulo fecha com avaliação integradora e a síntese "O que descobrimos?" — sem nota e sem certificado. Ciclos C2–C4 em preparação. Detalhes em [docs/content-architecture.md](docs/content-architecture.md).

O guia **Econominho** usa o personagem oficial aprovado (pacote `econominho-assets-v1`, em `public/econominho/`), com falas por estado pedagógico.

## Comandos

```bash
npm ci               # instala dependências (Node 22, ver .nvmrc)
npm run dev          # desenvolvimento em http://localhost:3000
npm run build        # site estático em out/
npm start            # serve out/ localmente
npm run typecheck
npm run lint
npm run format       # Prettier
npm test             # Vitest
npm run check        # typecheck + lint + testes + build
```

Nenhuma variável de ambiente é necessária.

## Documentação

- [Arquitetura](docs/architecture.md): decisões técnicas, rotas, privacidade, PWA e estratégia de atualização
- [Design System](docs/design-system.md): tokens, tons, expressão por ciclo, componentes, acessibilidade
- [Arquitetura de conteúdo](docs/content-architecture.md): formatos dos JSON, valores calculados, regras testadas
- [Diretrizes editoriais](docs/editorial-guidelines.md): princípios, tom de voz, personagens, checklist de revisão
- [Econominho, o guia](docs/econominho-guide.md): função pedagógica, personalidade, estados (visual pendente)
- [Publicação no Cloudflare Pages](docs/deployment.md)
- [Screenshots](docs/screenshots/): `mobile/` e `desktop/`

## Stack

Next.js 16 (App Router, exportação estática) · TypeScript · Tailwind CSS 4 · Vitest + Testing Library · ESLint · Prettier. Fonte Lexend (SIL OFL) empacotada localmente.

Identificadores técnicos (repositório `financeiramente-web`, pacote npm, domínio) ainda não mudaram de nome nesta etapa.

Projeto irmão: [`financeiramente-app`](https://github.com/felipenicacio/financeiramente-app) (React Native/Expo).
