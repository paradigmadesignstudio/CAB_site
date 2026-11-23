# Deploy — Site CAB (Laravel + Inertia + React)

**Versão:** segurança (CSP/P3), SEO, LCP mobile, tablet/iPad, planos, academia e proxy de mídia  
**Data:** 16/09/2026  
**PHP:** 8.3+  
**Node (build local):** apenas para gerar assets; não necessário no servidor

---

## 1. Conteúdo do pacote

### Incluído
- `app/`, `bootstrap/`, `config/`, `routes/`, `vendor/` (sem dev)
- `database/migrations/` + `database/data/`
- `resources/views/` (Blade/Inertia)
- `public/` completo (`build/`, `images/`, `index.php`)
- `storage/` (estrutura vazia)
- `artisan`, `composer.json`, `composer.lock`, `.env.example`
- Este arquivo (`DEPLOY.md`)

### Excluído (propositalmente)
- `node_modules`, `resources/js`, `resources/css`
- **`.env`** — o pacote **não** traz `.env`; o do servidor é mantido
- `tests/`, `.git`, `.env.*` (backups e variantes locais)
- `database.sqlite`, factories, seeders
- `public/hot`, configs de dev (Vite, TypeScript, etc.)

---

## 2. Pré-requisitos no servidor

- PHP **8.3+** com extensões: `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`
- MySQL/PostgreSQL ou SQLite (conforme `.env`)
- Permissão de escrita em `storage/` e `bootstrap/cache/`

---

## 3. Upload e extração

1. Faça backup do site atual e do `.env` de produção.
2. Envie e extraia o zip na pasta pública do projeto.
3. O pacote **não** inclui `.env`: o `.env` do servidor continua valendo. Acrescente nele as variáveis novas da seção 4 (compare com `.env.example`).

---

## 4. Configuração do `.env` (produção)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.cambioautomaticodobrasil.com.br

CACHE_STORE=file
# ou, se Redis disponível: CACHE_STORE=redis

CAB_API_ENABLED=true
CAB_API_BASE_URL=https://crm.cambioautomaticodobrasil.com.br/api/site/

GOOGLE_TAG_MANAGER_ID=GTM-N3W9TK6

# Funcionalidades
OFICINAS_ENABLED=true          # true se /oficinas deve estar no ar
PREVIEW_ROUTES_ENABLED=false   # manter false em produção
BLOG_COLUMNISTS_ENABLED=false

QUEUE_CONNECTION=database      # ou redis
SESSION_DRIVER=database

# Parceria CAB + Raven (/cabraven) — vazio ou sem token = todo cadastro vai para o WhatsApp
CAB_API_CABRAVEN=https://crm.cambioautomaticodobrasil.com.br/api/v1/site/cabraven
CAB_API_SITE_TOKEN=            # mesmo valor do .env do CRM
```

> **`APP_URL` é crítico para SEO:** canonical, `og:url`, `robots.txt` (`Sitemap:`) e todas as `<loc>` do `sitemap.xml` usam esse valor. Nunca deixe `http://localhost` em produção.
>
> Após qualquer alteração no `.env`, rode `php artisan config:clear` e `php artisan cache:clear` antes de `config:cache`.

---

## 5. Comandos pós-deploy

```bash
cd /caminho/do/projeto

php artisan migrate --force
php artisan storage:link

php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Fila (formulários: suporte, newsletter, leads)

```bash
php artisan queue:work --tries=5
```

Configure Supervisor/systemd para manter o worker ativo.

### Cron (scheduler)

```cron
* * * * * cd /caminho/do/projeto && php artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Smoke test pós-deploy (10 min)

| Rota | Esperado |
|------|----------|
| `/` | 200 — home, hero, seções |
| `/sobre-nos`, `/blog`, `/academia-cab` | 200 |
| `/parceiros`, `/planos`, `/suporte` | 200 |
| `/oficinas` | 200 (se `OFICINAS_ENABLED=true`) |
| `/politica-de-privacidade`, `/termos-de-servico`, `/politica-de-cookies` | 200 |
| `/robots.txt`, `/sitemap.xml`, `/health` | 200 |
| URL inexistente | 404 customizado |
| `/sou-cab` | 301 → `/oficinas` |
| `/cabraven` | 200 — landing CAB + Raven (fora do menu) |
| `/cabraven/cnpj/33000167000101` | 200 — JSON com razão social |

### Funcional
- [ ] Busca em `/oficinas` e `/parceiros` responde sem travar
- [ ] Botão "Carregar mais" em listagens longas
- [ ] Formulário de suporte envia (verificar fila/worker)
- [ ] Newsletter/blog CTA envia
- [ ] Cookie notice aparece na primeira visita
- [ ] GTM carrega (DevTools → Network)

---

## 7. Novidades desta versão

- Landing `/cabraven` (parceria CAB + Raven), sem link no menu: escolha CPF/CNPJ, máscaras, CNPJ preenche a razão social via Receita Federal (BrasilAPI/ReceitaWS), um POST ao CRM decide: assinante ativo → WhatsApp 19 97165-9055, não assinante → lead criado no CRM

- Páginas legais (privacidade, termos, cookies)
- Página 404 customizada
- Integração Sou CAB / Oficinas via API de hotsites
- SEO: canonical, Open Graph, `lang=pt-BR`
- Google Tag Manager
- Cookie notice + créditos do rodapé (PDS / t4v)
- Proteção da marca "CAB" contra tradução automática
- Performance: debounce em buscas, paginação em grids, hero otimizado no mobile
- Academia: rotação de destaques a cada 5 min
- Planos: tabela de treinamentos via API CRM
- SEO: `APP_URL` canônico, `og:image` + Twitter cards, JSON-LD (Organization/WebSite/BlogPosting/Event/AutomotiveRepair/FAQPage)
- Segurança: headers HTTP (anti-clickjacking, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP, HSTS) + CSP ampliado (`CAB_CSP_ENABLED=true`)
- Mídia CRM via proxy `/media/{token}` (mascara `crm.../storage/...` no HTML; `CAB_MEDIA_PROXY_ENABLED`)

---

## 8. Hardening de infraestrutura (servidor / borda)

Controles que **não** ficam só no Laravel — configure no host ou na CDN.

### Ocultar versões / banners
- **PHP:** `expose_php = Off` no `php.ini`
- **Nginx:** `server_tokens off;`
- **Apache:** `ServerTokens Prod` e `ServerSignature Off`
- A app já remove `X-Powered-By` / tenta limpar `Server` nas respostas HTTP e no `.htaccess`

### WAF / DDoS
- Coloque um WAF na borda (Cloudflare, AWS WAF ou equivalente) na frente do site
- Recomendações mínimas: rate limit de bots, challenge em POSTs anômalos, proteção DDoS L3/L7, bloqueio de scanners conhecidos
- Mantenha `/health` restrito (IP allowlist no WAF/Nginx) se não for usado por monitor público

### Auditoria de dependências (CVE)
No ambiente de desenvolvimento/CI, rode periodicamente:

```bash
composer audit
npm run audit
```

### Sessão / proxy
- `APP_DEBUG=false` e `APP_ENV=production`
- A app confia em proxies (`trustProxies`) para HTTPS/HSTS corretos atrás de Nginx/Cloudflare
- Prefira `SESSION_SECURE_COOKIE=true` e cookie `SameSite=lax` (ou `strict` se compatível) em produção

### Observação — downloads da Academia
- A URL de download **não** vai mais no HTML da página; só é devolvida após o lead
- Os PDFs em `public/downloads/` ainda são arquivos estáticos: quem souber o caminho pode acessar. Para blindagem total, mover para storage privado + URL assinada

---

## 9. Rollback

1. Restaure backup anterior (arquivos + `.env` + banco se houve migration).
2. `php artisan config:clear && php artisan cache:clear`
3. Reinicie PHP-FPM / Apache se aplicável.

---

## 10. Suporte / logs

- Laravel: `storage/logs/laravel.log`
- API CAB: `storage/logs/cab-api.log` (se configurado)
- Health: `GET /health` (sem URL interna da API quando `APP_DEBUG=false`)
