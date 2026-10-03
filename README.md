# Econominho Web

Versão Web/PWA do **Econominho** (nome de trabalho; antes "Financeiramente"): educação financeira, econômica, social e comportamental para crianças e adolescentes, para estudar em família.

Conteúdo fixo, escrito, revisado e aprovado antes da publicação. **Sem login, sem cadastro, sem perfil, sem banco de dados, sem backend, sem analytics, sem cookies, sem publicidade, sem IA em tempo de execução e sem coleta de dados.**

## Status

Ciclo **C1 (6–8 anos)** completo, com quatro módulos abertos em qualquer ordem:

| Módulo                               | Etapa                         |
| ------------------------------------ | ----------------------------- |
| M01 Quero, preciso ou posso esperar? | Eu escolho                    |
| M02 Dinheiro, preço e cuidado        | Eu entendo dinheiro e preço   |
| M03 Publicidade e escolhas           | Eu percebo o que influencia   |
| M04 Trabalho, renda e limites        | Eu entendo trabalho e limites |

Cada módulo: abertura → história → pergunta → conceito → atividade → simulação → quiz → conclusão. Ao fim do ciclo, a página "O que descobrimos?".

O guia **Econominho** já tem sua função editorial (falas em cada etapa). **Visual do personagem: pendente de aprovação**; a interface usa um marcador neutro.

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
