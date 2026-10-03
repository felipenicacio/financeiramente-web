# Financeiramente Web

Versão Web/PWA do Financeiramente: educação financeira, econômica, social e comportamental para crianças e adolescentes, para estudar em família.

Conteúdo fixo, revisado e aprovado. **Sem login, sem cadastro, sem banco de dados, sem backend, sem analytics, sem cookies, sem publicidade, sem IA generativa e sem coleta de dados.**

## Status

Primeiro vertical slice: ciclo C1 (6–8 anos), jornada "Descobrir escolhas e valor", módulo "Quero, preciso ou posso esperar?".

Fluxo: início → idade → jornada → módulo → história → conceito → atividade → simulação → quiz → conclusão.

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
- [Design System](docs/design-system.md): tokens, expressão por ciclo, componentes, acessibilidade
- [Arquitetura de conteúdo](docs/content-architecture.md): formato dos JSON, regras pedagógicas, como publicar um módulo
- [Publicação no Cloudflare Pages](docs/deployment.md): configuração, previews, cabeçalhos de segurança
- [Screenshots](docs/screenshots/)

## Stack

Next.js 16 (App Router, exportação estática) · TypeScript · Tailwind CSS 4 · Vitest + Testing Library · ESLint · Prettier. Fonte Lexend (SIL OFL) empacotada localmente.

Projeto irmão: [`financeiramente-app`](https://github.com/felipenicacio/financeiramente-app) (React Native/Expo), com o mesmo formato de conteúdo.
