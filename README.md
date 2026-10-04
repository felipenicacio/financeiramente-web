# Econominho Web

Versão Web/PWA do **Econominho** (nome de trabalho; antes "Financeiramente"): educação financeira, econômica, social e comportamental para crianças e adolescentes, para estudar em família.

Conteúdo fixo, escrito, revisado e aprovado antes da publicação. **Sem login, sem cadastro, sem perfil, sem banco de dados, sem backend, sem analytics, sem cookies, sem publicidade, sem IA em tempo de execução e sem coleta de dados.**

## Status

Ciclos **C1 (6–8 anos)**, **C2 (9–11 anos)**, **C3 (12–14 anos)** e **C4 (15–17 anos)** completos no currículo v2.0: 6 módulos e 30 lições em cada um, abertos em qualquer ordem.

| C1                                      | C2                                                    | C3                                        | C4                                                  |
| --------------------------------------- | ----------------------------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| C1.1 O dinheiro está por toda parte     | C2.1 Pagar de um jeito ou de outro                    | C3.1 Consumo por impulso e pressão social | C4.1 Decisões de consumo e custo de oportunidade    |
| C1.2 Quero, preciso ou posso esperar?   | C2.2 Esperar vale a pena: metas e prioridades         | C3.2 Preços, oferta, demanda e inflação   | C4.2 Câmbio e fatores macroeconômicos               |
| C1.3 Preço, comparação e troco          | C2.3 Comparar de verdade: preço, qualidade e promoção | C3.3 Orçamento com renda variável         | C4.3 Planejamento de vida e cenários financeiros    |
| C1.4 Trabalho, renda, bens e serviços   | C2.4 Orçamento da família: receita, despesa e saldo   | C3.4 Cartão, parcelamento e juros         | C4.4 Crédito e modalidades de financiamento         |
| C1.5 Guardar e cuidar                   | C2.5 Trabalho, renda e compromisso                    | C3.5 Trabalho e renda                     | C4.5 Trabalho, tributos e lucro                     |
| C1.6 Escolhas, influência e convivência | C2.6 Guardar, proteger e contribuir                   | C3.6 Dívida, golpes e riscos              | C4.6 Investimentos, políticas econômicas e contexto |

Arquitetura **ciclo → módulo → lição → objetos**: cada módulo tem 5 lições; cada lição tem de 2 a 4 objetos educacionais de tipos variados (explicação, história, conceitos, classificação, comparação, troco, escolha, ordenação, V/F, quiz, reflexão). Cada módulo fecha com avaliação integradora e a síntese "O que descobrimos?" — sem nota e sem certificado. Currículo completo (C1–C4). Detalhes em [docs/content-architecture.md](docs/content-architecture.md).

O guia **Econominho** usa os assets individuais aprovados (v2, em `public/econominho/`), com falas por estado pedagógico.

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
