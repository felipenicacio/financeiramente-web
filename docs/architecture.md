# Arquitetura

## Visão geral

Site educacional **100% estático**, gerado com Next.js (App Router) em modo `output: 'export'`. O build produz a pasta `out/`, publicada no Cloudflare Pages. Não há servidor, banco de dados, API própria, autenticação nem chamadas externas para exibir o conteúdo.

```
content/*.json ──► lib/content (registro + validação) ──► páginas (geradas no build)
                                                         │
                                                         ▼
                                    out/ (HTML + JS + payloads RSC + assets)
                                                         │
                                                         ▼
                                              Cloudflare Pages (CDN)
```

## Decisões técnicas

| Decisão                                          | Motivo                                                                                                                                                                      |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js 16 + `output: 'export'`                  | Rotas, metadata e SEO do App Router sem runtime de servidor. Recursos que exigiriam servidor (cookies, server actions, rewrites, route handlers dinâmicos) falham no build. |
| `trailingSlash: true`                            | Gera `rota/index.html`, formato servido nativamente pelo Cloudflare Pages sem regras de redirecionamento.                                                                   |
| `dynamicParams = false` + `generateStaticParams` | Toda URL válida é conhecida no build; endereços inexistentes caem no `404.html`.                                                                                            |
| Conteúdo em JSON importado no build              | Textos educacionais revisados fora do código; nenhuma requisição de rede para consumir o conteúdo.                                                                          |
| Validação própria, sem biblioteca                | O validador (`lib/validation/schema.ts`) tem ~100 linhas e cobre o necessário; evita dependência só para isso.                                                              |
| Tailwind CSS 4 com tokens em CSS                 | Design System centralizado em `styles/globals.css`, com variações por ciclo via variáveis CSS.                                                                              |
| Ilustrações em SVG inline                        | Sem requisições de imagem, nítidas em qualquer tela, cores do Design System, valores em dinheiro vindos do conteúdo.                                                        |
| Animações só em CSS                              | Sem biblioteca de animação; `prefers-reduced-motion` desliga tudo de forma global.                                                                                          |
| Fonte Lexend local (`next/font/local`)           | Nenhuma fonte carregada de terceiros. Licença SIL OFL em `app/fonts/OFL.txt`.                                                                                               |
| Service worker escrito à mão                     | Estratégia de cache curta e auditável (ver PWA abaixo), sem plugin de PWA.                                                                                                  |

## Rotas

| URL                                   | Arquivo                                          | Conteúdo                                                                      |
| ------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `/`                                   | `app/(site)/page.tsx`                            | Início                                                                        |
| `/idade/`                             | `app/(site)/idade/page.tsx`                      | Seleção de faixa etária                                                       |
| `/jornadas/[ciclo]/`                  | `app/(site)/jornadas/[ciclo]/page.tsx`           | Jornadas do ciclo (c1 a c4; c2–c4 mostram "em preparação")                    |
| `/modulos/[ciclo]/[modulo]/`          | `app/(site)/modulos/[ciclo]/[modulo]/page.tsx`   | Apresentação do módulo                                                        |
| `/aprender/[ciclo]/[modulo]/[etapa]/` | `app/aprender/[ciclo]/[modulo]/[etapa]/page.tsx` | Etapas: `historia`, `conceito`, `atividade`, `simulacao`, `quiz`, `conclusao` |

Cada etapa é uma página estática própria: o botão "voltar" do navegador funciona, e cada etapa pode ser aberta direto. Dentro da etapa, as telas internas (quadros da história, itens da atividade, perguntas do quiz) são estado em memória do componente.

## Estrutura de pastas

```
app/                    rotas, layout raiz, manifest, robots, sitemap, fonte
components/
  cards/                CycleCard, JourneyCard, ModuleCard
  illustrations/        SVGs (itens 120×120, cenas 320×200) e ícones de categoria
  layout/               PageContainer, AppHeader, SiteFooter, SkipLink, ContentError
  learning/             LessonShell, ProgressIndicator, ChoiceCard, FeedbackCard,
                        StoryCard, ConceptCard, GoalMeter, SimulationPanel, QuizQuestion
  learning/steps/       uma etapa por arquivo + despachante
  pwa/                  registro do service worker e aviso de atualização
  ui/                   Button/ButtonLink, Icon, Brand
content/                catálogo, textos de interface e módulos (JSON)
lib/content/            tipos, registro estático, carregamento, textos de interface
lib/validation/         validador genérico e schemas do conteúdo
lib/learning/           regras: simulação, atividade, quiz, templates, etapas e rotas
lib/session/            progresso da visita, só em memória
styles/globals.css      tokens do Design System
theme/                  paleta e expressões por ciclo em TypeScript
public/                 ícones, favicon, imagem OG, sw.js, _headers
docs/                   esta documentação e screenshots
```

## Estado e privacidade

- O estado de cada etapa vive em `useState` do componente.
- O progresso da visita ("Concluído" na jornada) vive em `SessionProvider`, em memória. Recarregar a página zera tudo.
- **Não há** Web Storage, cookies, IndexedDB, identificadores, analytics, pixels ou envio de respostas.
- `tests/privacy.test.ts` falha o CI se o código passar a usar armazenamento persistente, `fetch`/beacon na aplicação, recursos de terceiros ou formulários.
- Salvar progresso no aparelho no futuro exige decisão explícita, registrada aqui, e ajuste consciente desse teste.

## PWA

**Manifest** (`app/manifest.ts` → `/manifest.webmanifest`): nome, nome curto, ícones 192/512 e maskable, `display: standalone`, `theme_color` e `background_color` vindos de `theme/tokens.ts`.

**Service worker** (`public/sw.js`), registrado só em produção:

| Recurso                                       | Estratégia                          | Por quê                                                    |
| --------------------------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| Páginas HTML e payloads de navegação (`.txt`) | Rede primeiro; cache só sem conexão | Conteúdo sempre atualizado quando há internet              |
| `/_next/static/*`                             | Cache primeiro                      | Arquivos com hash no nome: um deploy novo gera nomes novos |
| Ícones, fonte, manifest                       | Stale-while-revalidate              | Rápido e atualizado em segundo plano                       |

Cada cache tem limite de entradas. Requisições de outras origens não são interceptadas.

**Estratégia de atualização**

1. Deploy novo publica HTML e JS novos. Como páginas vêm da rede primeiro, o visitante online já recebe o conteúdo novo na próxima navegação.
2. `sw.js` é servido com `Cache-Control: no-cache` e registrado com `updateViaCache: 'none'`, então o navegador sempre verifica se ele mudou.
3. Se `sw.js` mudou (incrementar `VERSION` ao alterar a estratégia), o worker novo fica em espera e aparece o aviso "Há uma versão nova do conteúdo. Atualizar". Ao tocar, o worker novo assume e a página recarrega; sem toque, a troca ocorre na próxima abertura.
4. Na ativação, caches de versões anteriores são apagados.

Resultado: ninguém fica preso em conteúdo antigo enquanto estiver online; offline, vê a última versão visitada.

## Tratamento de conteúdo inválido

`loadCatalog()` e `loadModule()` validam o JSON e devolvem `{ ok, data }` ou `{ ok: false, issues }`. Páginas com conteúdo inválido mostram `ContentError`:

- produção: mensagem amigável e botão para o início, sem exibir conteúdo pela metade;
- desenvolvimento: lista de problemas com o caminho exato do campo (ex.: `story.json.panels[0].text: variável desconhecida: {presente}`), também impressa no terminal.

Os testes de conteúdo rodam no CI, então conteúdo inválido não chega a ser publicado.
