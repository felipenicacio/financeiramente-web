# Publicação no Cloudflare Pages

O site é estático: o Cloudflare Pages só executa o build e serve a pasta `out/`. Nenhuma credencial fica no repositório.

## Configuração do projeto

No painel da Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** e escolher `felipenicacio/financeiramente-web`.

| Campo                  | Valor                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| Production branch      | `main`                                                               |
| Framework preset       | `None` (não usar o preset Next.js, que tenta um deploy com servidor) |
| Build command          | `npm run build`                                                      |
| Build output directory | `out`                                                                |
| Root directory         | `/` (padrão)                                                         |
| Node.js                | 22 (lido de `.nvmrc`; se necessário, definir `NODE_VERSION=22`)      |

### Variáveis de ambiente

| Variável                    | Obrigatória                        | Uso                                                                                                |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `NEXT_TELEMETRY_DISABLED=1` | Recomendada                        | Desliga a telemetria anônima do Next.js durante o build                                            |
| `NEXT_PUBLIC_SITE_URL`      | Não                                | Domínio próprio para Open Graph, sitemap e robots. Padrão: `https://financeiramente-web.pages.dev` |
| `NODE_VERSION=22`           | Só se o `.nvmrc` não for detectado | Versão do Node no build                                                                            |

Nenhum segredo é necessário.

## Comportamento

- **Produção**: cada merge na `main` dispara build e deploy automático.
- **Previews**: cada Pull Request recebe uma URL própria (`<hash>.financeiramente-web.pages.dev`) e um comentário no PR. Em **Settings → Builds → Branch control**, manter "Preview branches: All non-production branches".
- **Rollback**: em **Deployments**, qualquer deploy anterior pode ser promovido de volta.
- **404**: `out/404.html` é usado automaticamente pelo Pages para URLs inexistentes.

## Segurança

`public/_headers` vira `out/_headers`, aplicado pelo Pages a todas as respostas:

| Cabeçalho                             | Valor                                          | Motivo                                                    |
| ------------------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `Content-Security-Policy`             | `default-src 'self'` e variações               | Bloqueia scripts, fontes, imagens e conexões de terceiros |
| `X-Content-Type-Options`              | `nosniff`                                      |                                                           |
| `X-Frame-Options` / `frame-ancestors` | `DENY` / `'none'`                              | Impede embutir o site em outro                            |
| `Referrer-Policy`                     | `strict-origin-when-cross-origin`              |                                                           |
| `Permissions-Policy`                  | câmera, microfone, localização etc. desligados | O site não usa nenhum                                     |
| `Strict-Transport-Security`           | 1 ano                                          | Só HTTPS                                                  |
| `Cache-Control` em `/_next/static/*`  | 1 ano, `immutable`                             | Arquivos com hash                                         |
| `Cache-Control` em `/sw.js`           | `no-cache`                                     | Atualização do service worker sempre verificada           |

**Limitação conhecida da CSP**: a exportação estática do Next.js injeta scripts inline com o payload das páginas (`self.__next_f.push`). Por isso `script-src` precisa de `'unsafe-inline'`. O risco é baixo (não há conteúdo enviado por usuários nem scripts de terceiros), mas a evolução recomendada é gerar hashes desses scripts no build e trocar `'unsafe-inline'` por `'sha256-…'`. `style-src 'unsafe-inline'` é necessário pelos estilos inline das barras de progresso.

## Validar antes de ativar o deploy de produção

1. Criar o projeto no Pages com a configuração acima.
2. Abrir a URL de preview do PR e conferir: fluxo completo do módulo, instalação do PWA (Chrome Android: "Instalar app"; iOS Safari: "Adicionar à Tela de Início"), cabeçalhos (`curl -I https://<preview>/`).
3. Só então fazer o merge na `main`.

O CI (`.github/workflows/ci.yml`) roda typecheck, lint, formatação, testes e build em todo PR, mas **não publica nada**: o deploy é responsabilidade exclusiva do Cloudflare Pages.

## Rodar localmente

```bash
npm ci
npm run dev        # desenvolvimento em http://localhost:3000 (service worker desligado)
npm run build      # gera out/
npm start          # serve out/ em http://localhost:3000 (inclui service worker)
npm run check      # typecheck + lint + testes + build
```
