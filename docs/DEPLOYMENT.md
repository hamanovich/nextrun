---
title: Deploying NextRun to self-hosted Coolify (migration runbook)
paired_rule: CLAUDE.md
code_root: .
status: live
language: en
---

# Deploying NextRun to Coolify — runbook

A recipe for self-hosting a **Next.js 16 / React 19** app on a **VPS via Coolify** (a self-hosted,
Vercel-like PaaS), with the **build off-host in CI**. NextRun is the worked example; the platform (Part 1)
is set up once and reused by every project on the box.

**The model is a hybrid:** production runs on the VPS, `develop` stays on Vercel (free Hobby — an isolated
dev sandbox on a separate Neon branch). Prod builds never run on the VPS — GitHub Actions builds the image,
pushes it to GHCR, and Coolify only pulls + runs it.

```
                         GitHub
              ┌────────────┴────────────┐
        push main                  push develop
              │                          │
              ▼                          ▼
   CI builds image → GHCR           Vercel (Hobby, free)
   Coolify on VPS pulls + runs      your-app.vercel.app  (DEV)
   www.your-app.dev  (PROD)          dev Neon branch
```

```
VPS  (Coolify host)
└── Coolify (Docker engine + Traefik :80/:443)   ← dashboard: panel.example.com
    ├── (other apps)       ...                    ← one Coolify host can run many apps
    └── NextRun            www.your-app.dev        ← this project
        └── nextrun-bot    (grammY Telegram bot — separate resource, no domain)
```

> The same box may run other services. They coexist with Coolify as long as nothing else binds `80/443` —
> Traefik owns those.

---

## What is already done in the repo

The code-side migration (Part 2) is already committed — no need to repeat it:

- `next.config.ts` → `output: "standalone"` ✅
- `src/lib/env.ts` → short-circuit `if (process.env.SKIP_ENV_VALIDATION) return process.env as ...` ✅
- `src/lib/lazy.ts` + lazy clients in `src/db`, `src/lib/stripe.ts`, `src/lib/auth.ts` (see §2.4) ✅
- `Dockerfile` (multi-stage, bun builds / Node runs, sharp, no secrets in the build) ✅
- `Dockerfile.bot` (the grammY long-polling bot, run separately under bun) ✅
- `.dockerignore` (excludes `.env*`, `node_modules`, `.next`, `.git`, `docs`, `.claude`, `.husky`, …) ✅
- `.github/workflows/ci.yml` — `check` / `build` / `deploy` jobs ✅

**What remains is infrastructure:** configure the app in Coolify, populate the GitHub `Coolify` environment,
attach the domain and cut over from Vercel (Parts 4–5).

---

# Part 1 — Coolify platform (set up once per server)

> If Coolify already runs on this server (set up for another app), skip Part 1 entirely and go to Part 4.

## 1.1 Pre-flight

```bash
ssh deploy@<VPS_IP>
sudo ss -tlnp | grep -E ':80|:443'   # expected empty — nothing else may own 80/443
df -h /                               # a few GB free for images
free -h                               # keep a 2 GB swap file as OOM insurance
```

## 1.2 Install Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

Brings up Coolify's own Docker stack (Postgres, Redis, Traefik, realtime). Open `http://<VPS_IP>:8000` and
**create the admin account immediately** (registration is open until the first account exists).

## 1.3 Instance domain, firewall, and the Docker/UFW trap

**Two kinds of domain — don't confuse them:**

- **Instance domain** (one per Coolify install): the dashboard URL **and** where GitHub webhooks land. Shared
  by all projects — `panel.example.com`.
- **App domains** (one+ per app): each site's public URL (`www.your-app.dev`, …). Independent of the instance
  domain.

Set up the panel:

1. DNS: `A panel.example.com → <VPS_IP>`.
2. Open the proxy ports (only `22` is open by default):
   ```bash
   sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw status verbose
   ```
3. Coolify → Settings → **Instance Domain / FQDN** = `https://panel.example.com`. Traefik issues a Let's
   Encrypt cert and the dashboard moves to HTTPS behind the Coolify login.
4. The raw `:8000` is then only a break-glass fallback over an SSH tunnel
   (`ssh -L 8000:localhost:8000 deploy@<VPS_IP>`).

> **Docker bypasses UFW.** A container that _publishes_ a port is reachable from the internet even if UFW
> would block it. So: expose web apps **only through Traefik** (Coolify's "Domains" field) — never map a raw
> host port; bind any admin port to `127.0.0.1` and reach it over the SSH tunnel. The bot resource publishes
> no port at all (polling), so this does not apply to it.

## 1.4 HTTPS — Let's Encrypt via Traefik

Traefik issues and auto-renews certs. Set the Let's Encrypt **email** once in Coolify → Settings.

| Mode                   | When                                       | Notes                                                |
| ---------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **HTTP-01** (default)  | fresh subdomain, no HSTS history           | needs DNS already pointing at the box + port 80 open |
| **DNS-01 via Porkbun** | pre-provision the cert before the DNS flip | proves ownership via a DNS TXT record (Porkbun API)  |

> **Check whether your hostname is under HSTS before you attach it.** Two cases force HTTPS on the very first
> hit, so a missing or not-yet-issued cert becomes a hard error with no click-through — and browsers cache that
> failure:
>
> 1. **A preloaded TLD.** `.dev` and `.app` are on the HSTS preload list in their entirety — every domain under
>    them, in every browser, from the very first request.
> 2. **A parent zone with `includeSubDomains`.** If `example.com` serves
>    `Strict-Transport-Security: …; includeSubDomains`, then every browser that has visited it already enforces
>    HTTPS on `anything.example.com` — including a subdomain you are attaching right now.
>
> Check with `curl -sI https://<parent-domain> | grep -i strict-transport` and
> `https://hstspreload.org/api/v2/status?domain=<domain>`. If either applies, the cert must be green **before**
> a browser reaches the hostname: for a brand-new subdomain, point DNS at the box, let Traefik issue over
> HTTP-01, and only then open it. Use **DNS-01** when the hostname already resolves elsewhere and you cannot
> afford a gap. NextRun's own app sends `Strict-Transport-Security: …; includeSubDomains; preload`, so the
> second case applies to any sibling subdomain you add later.

DNS-01 (Porkbun): create an API key (Porkbun → Account → API Access; enable API on the domain), then in
Coolify → Servers → Proxy add to the `coolify-proxy` environment:

```
PORKBUN_API_KEY=pk1_...
PORKBUN_SECRET_API_KEY=sk1_...
```

## 1.5 GitHub App + GHCR pull access (reusable for every repo)

**a) GitHub App** (push-to-deploy source). Register **once, after** the instance domain exists: New Resource →
**Private Repository (with GitHub App)** → Automated Installation → endpoint `https://panel.example.com` →
create the App → grant it the repos. One App authorizes many repos.

**b) GHCR pull token** (for private images). Create a GitHub **PAT (classic)** with scope `read:packages`
only. Coolify → Keys & Tokens / Registries → add `ghcr.io`, username `<your-user>`, password = the PAT. One
token serves every private image across all projects.

## 1.6 Backups & capacity

- **Back up Coolify itself:** all project/app/env config lives in its own Postgres — enable scheduled backups
  (Postgres dump → S3-compatible bucket). Keep an off-box encrypted copy (1Password / GPG) of every `.env`.
  App _data_ lives in Neon (its own backups).
- **Capacity:** the web app at runtime is ~0.3–0.5 GB; the bot process is ~0.1–0.2 GB. When the box tightens,
  add a second VPS as a Coolify **destination**. Build memory is a non-issue (off-host).

---

# Part 2 — Prepare the app (in the repo, **already done for NextRun**)

All changes are safe on Vercel — it ignores `output: standalone` and never uses the Dockerfile.

## 2.1 `next.config.ts` — standalone output

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // …rest unchanged
};
```

> NextRun uses the default `next/image` optimizer (`images` configured, no custom loader) — it needs `sharp`
> at runtime. The standalone image copies it explicitly (§2.2). `sharp` is already pulled in (present in
> `bun.lock` and in `trustedDependencies`).

## 2.2 `Dockerfile` (multi-stage; bun builds, **Node runs**)

Key decisions for NextRun:

- **No server secret reaches the build.** Only `NEXT_PUBLIC_*` (see §2.4–2.6).
- **Runtime = Node (`node:24-slim`, `node server.js`).** The standalone `server.js` targets Node and matches
  Vercel. NextRun uses the **neon-HTTP** driver (`drizzle-orm/neon-http`), so the bun WebSocket caveat does
  not apply and bun would also work — but Node is chosen for Vercel parity.
- **`sharp` + `@img` copied explicitly** from the builder stage to guarantee the linux binaries in the runner.
- **`curl`** installed in slim — Coolify shells out to `curl` inside the container for the healthcheck.

Full file — `./Dockerfile` in the repo root. The bot has its own `./Dockerfile.bot` (§4.7).

## 2.3 `.dockerignore`

`.env*` is excluded deliberately — secrets never enter the build context. Also excluded: `node_modules`,
`.next`, `.git`, `.github`, `coverage`, `docs`, `.claude`, `.husky`.

## 2.4 Lazy clients — why the build needs no secrets

This is the key NextRun-specific point. The `neon()` and `new Stripe()` clients **throw on an empty value**,
and `next build` executes route modules during "Collecting page data". If they construct at module import,
the build fails without real values — which is why the old Dockerfile carried every secret into the build
(and into the Actions cache).

The fix is **lazy initialization** via `src/lib/lazy.ts`. The `lazyClient(factory)` helper returns a Proxy
with the same type, but the factory only runs on first property access (i.e. at runtime, during a request),
not at import:

```ts
export const lazyClient = <T extends object>(factory: () => T): T => {
  let instance: T | undefined;
  const resolve = (): T => (instance ??= factory());
  return new Proxy({} as T, {
    get: (_t, prop) => {
      const client = resolve();
      const value = Reflect.get(client, prop, client);
      return typeof value === "function" ? value.bind(client) : value;
    },
    has: (_t, prop) => prop in resolve(),
  });
};
```

Wrapped: `db` (`src/db/index.ts`), `stripe` (`src/lib/stripe.ts`), and `auth` (`src/lib/auth.ts`). The named
exports (`db`, `stripe`, `auth`) are unchanged — call sites were not touched.

The grammY bot constructs `new Bot(env.TELEGRAM_BOT_TOKEN)` at import, but it lives in `src/bot/index.ts`,
which **no route imports** — it is a separate process (§4.7), never executed by `next build`. So it needs no
lazy wrapper.

Verification (what CI/Docker does) — the build passes with no server vars:

```bash
mv .env .env.bak
env -u DATABASE_URL -u OPENAI_API_KEY -u STRIPE_SECRET_KEY -u STRIPE_WEBHOOK_SECRET \
    -u GOOGLE_CLIENT_ID -u GOOGLE_CLIENT_SECRET -u BETTER_AUTH_SECRET -u BETTER_AUTH_URL \
    -u TELEGRAM_BOT_TOKEN -u HEALTH_CHECK_SECRET \
  SKIP_ENV_VALIDATION=1 NEXT_PUBLIC_DOMAIN=https://www.your-app.dev bun run build
mv .env.bak .env
# → ✓ Compiled successfully, pages generated
```

## 2.5 `src/lib/env.ts` — skip strict validation at build only

```ts
const validateEnv = (): Env => {
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as Env;
  }
  // …existing strict Zod parse (runtime)
};
```

`SKIP_ENV_VALIDATION=1` is set **only** in the Dockerfile builder stage — never in the runner or in Coolify.
The running container still validates strictly and fails fast if a runtime var is missing.

## 2.6 The env contract — where each variable lives

The rule: **`NEXT_PUBLIC_*` (non-secret) → build-args; every secret → Coolify runtime only.** Secrets are
deliberately kept out of the build so they never land in the GitHub Actions build cache (Part 3).

| Variable                       | Build-arg (CI + Dockerfile) | Coolify runtime | Notes                                               |
| ------------------------------ | :-------------------------: | :-------------: | --------------------------------------------------- |
| `NEXT_PUBLIC_DOMAIN`           |             ✅              |       ✅        | inlined into client bundle; sitemap/robots at build |
| `NEXT_PUBLIC_UMAMI_URL`        |             ✅              |       ✅        | public Umami analytics origin; optional             |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` |             ✅              |       ✅        | public Umami site id; optional                      |
| `DATABASE_URL`                 |              —              |       ✅        | secret; Neon — lazy client, not needed at build     |
| `OPENAI_API_KEY`               |              —              |       ✅        | secret                                              |
| `GOOGLE_CLIENT_ID` / `_SECRET` |              —              |       ✅        | OAuth                                               |
| `BETTER_AUTH_URL`              |              —              |       ✅        | = the prod origin (`https://www.your-app.dev`)      |
| `BETTER_AUTH_SECRET`           |              —              |       ✅        | secret; min 32 chars                                |
| `STRIPE_SECRET_KEY`            |              —              |       ✅        | secret                                              |
| `STRIPE_WEBHOOK_SECRET`        |              —              |       ✅        | secret; depends on the webhook endpoint (see §5)    |
| `TELEGRAM_BOT_TOKEN`           |              —              |    ✅ (bot)     | secret; used by the bot resource (§4.7)             |
| `HEALTH_CHECK_SECRET`          |              —              |       ✅        | min 32 chars; gates `GET /api/health` (401 without) |

> `NEXT_PUBLIC_DOMAIN` is needed both as a build-arg and at runtime (env.ts's strict parse requires it). The
> `NEXT_PUBLIC_UMAMI_*` pair is optional — omit both to disable analytics.

## 2.7 Analytics

NextRun uses self-hosted **Umami** (`NEXT_PUBLIC_UMAMI_URL` / `NEXT_PUBLIC_UMAMI_WEBSITE_ID`); the CSP in
`next.config.ts` already allows the Umami origin dynamically. With both vars unset, no analytics script is
emitted and the app runs unchanged. No Coolify-specific config is required.

---

# Part 3 — CI/CD (in the repo, **already done**)

`.github/workflows/ci.yml` — three jobs:

```
push / PR                     →  check   : ts:check + lint + format:check + test       (gate)
PR → main                     →  build   : docker build (push:false)                   (validate before merge)
push main (after check)       →  deploy  : docker build → push GHCR → curl Coolify webhook
                                              └─ Coolify pulls the image + restarts (no build on VPS)
```

- **check** — runs on every push/PR (incl. `develop`). The code gate.
- **build** — runs on PRs into `main`: `docker build` with `push: false`. Catches `next build` and
  Dockerfile-assembly failures **before** merge. Uses `cache-from: type=gha`. Passes only `NEXT_PUBLIC_DOMAIN`
  (a literal — this image is never deployed).
- **deploy** — only on push to `main`: builds on GitHub's runner, pushes `latest` + `sha-<commit>` to GHCR,
  then `curl`s the Coolify deploy webhook. The VPS only pulls + runs — `next build` never runs there, so it
  can't OOM on deploy. Rollback = redeploy a previous `sha-<commit>` tag in Coolify.

**GitHub Secrets** — in a GitHub Actions **Environment** named `Coolify`, restricted to the `main` branch
(Settings → Environments → Coolify → _Environment secrets_). Only what the build/deploy actually needs:

```
NEXT_PUBLIC_DOMAIN   NEXT_PUBLIC_UMAMI_URL   NEXT_PUBLIC_UMAMI_WEBSITE_ID   (build-args)
COOLIFY_WEBHOOK_URL  COOLIFY_API_TOKEN                                      (deploy trigger)
```

> **No server secrets here.** They are NOT build-args and do not belong in GitHub — they live only in
> Coolify's runtime env (Part 4). GHCR push uses the built-in `GITHUB_TOKEN` (`packages: write`), no PAT.

The `deploy` job also prunes GHCR to the 5 most recent versions (`actions/delete-package-versions`).

---

# Part 4 — Coolify app configuration

## 4.1–4.6 The web app

1. New Resource → connect the repo (for metadata) → set source to **Docker Image** =
   `ghcr.io/<your-user>/nextrun:latest`. Coolify only pulls — it does not build.
2. **Disable** GitHub-App auto-deploy-on-push for this app (the CI webhook drives deploys — avoids a double
   trigger).
3. **Runtime env:** paste the full set of secrets from §2.6 (all server secrets + `HEALTH_CHECK_SECRET` +
   `NEXT_PUBLIC_DOMAIN` + the `NEXT_PUBLIC_UMAMI_*` pair if used). This is the only place secrets live.
   `BETTER_AUTH_URL = https://www.your-app.dev`.
4. **Domain:** start with the Coolify-generated URL for testing; attach the real domain at cutover (Part 5).
   If the TLD is preloaded or the parent zone sends HSTS with `includeSubDomains`, confirm HTTPS is green
   before any browser hits the hostname (§1.4).
5. **Health check** path `/api/health`. The route returns **401 without
   `Authorization: Bearer <HEALTH_CHECK_SECRET>`** — either give Coolify a custom check command with the
   header, or treat 401 as the expected liveness signal. It probes database, OpenAI status, and Stripe.
6. **Deploy webhook:** copy the app's `…/api/v1/deploy?uuid=…` URL into the `COOLIFY_WEBHOOK_URL` secret and an
   API token into `COOLIFY_API_TOKEN` (Part 3).

**Deploy = push to `main`.** Watch the GitHub Actions run, then the Coolify deployment log.

## 4.7 The Telegram bot (separate resource)

The grammY bot is a **long-polling** process (`bot.start()` in `src/bot/index.ts`) with graceful shutdown on
`SIGINT`/`SIGTERM`. It is **not** part of the Next.js container and needs **no inbound port or domain** —
polling dials out to Telegram.

1. New Resource → same repo → source **Dockerfile** = `Dockerfile.bot` (runs `bun run src/bot/index.ts`).
   Alternatively reuse the web image with a command override, but a dedicated `Dockerfile.bot` keeps it clean.
2. **No domain, no published port, no health check** (nothing listens). Coolify treats the running process as
   liveness.
3. **Runtime env:** `env.ts` validates the **full** schema at import, so give the bot container the **same
   runtime env set as the web app** (at minimum `TELEGRAM_BOT_TOKEN` + `DATABASE_URL` are exercised, but the
   strict parse requires every key). Reuse the same values.
4. Only **one** bot instance may poll a given token at a time — keep this to a single replica, and make sure
   no local `bun run bot:dev` is running against the prod token during deploys.

> The bot is not wired into the CI `deploy` job (which targets the web app). Deploy it from Coolify on push,
> or extend `ci.yml` with a second build/push for `Dockerfile.bot` + its own Coolify webhook if you want it
> fully automated.

---

# Part 5 — Cutover from Vercel

Run during a quiet window.

```
1. (Strongly advised for .dev) DNS-01 (Porkbun): pre-provision the cert for www + apex BEFORE touching DNS.
2. Lower the Porkbun TTL on the A records to 300s a day ahead (so caches expire).
3. Coolify: attach www.your-app.dev (+ apex); confirm HTTPS is green on the temp URL.
4. Flip the Porkbun A records: your-app.dev + www → <VPS_IP>.
5. Verify on the live domain (below).
6. Reconfigure Vercel.
```

**Verify on the live domain:**

- `GET /api/health` with the Bearer header → all services `healthy` (database, openai, stripe; no header →
  401; unhealthy → 503).
- HTTPS valid; `http://` and apex redirect to `https://www.…`.
- **Google sign-in** works: add the prod-origin redirect URI to the Google OAuth client; `BETTER_AUTH_URL`
  points at the prod origin.
- **Stripe webhook:** point the Stripe Dashboard endpoint at `https://www.your-app.dev/api/webhooks/stripe`,
  update `STRIPE_WEBHOOK_SECRET` in Coolify, send a test event (credit purchase → credits applied).
- **Telegram bot:** message the bot; confirm it responds and the bot resource log shows
  `Bot started as @…`.
- `next/image` optimization works (confirms `sharp` is in the runtime image).

**Reconfigure Vercel** (keep it serving prod ~1–2 days first as a rollback target):

1. Remove the custom domain from the Vercel project.
2. Set Vercel **production branch = `develop`** → Vercel becomes a pure dev sandbox (free Hobby).

**Rollback (until step 6):** revert the Porkbun A records to Vercel. Low TTL → fast. No data split-brain as
long as prod and dev use different Neon branches.

---

# Part 6 — Migrating another project (quick checklist)

The platform (Part 1) already exists. Per repo:

1. **Code:** `output: "standalone"`, the `Dockerfile` (copy it; adjust the `NEXT_PUBLIC_*` ARG list; keep
   `sharp` if you use the default optimizer), the `SKIP_ENV_VALIDATION` short-circuit, `.dockerignore`, the
   **lazy clients** (`src/lib/lazy.ts` + wrappers).
2. **CI:** copy `ci.yml` (image name auto-resolves via `ghcr.io/${{ github.repository }}`); add the GitHub
   `Coolify` Environment secrets (Part 3).
3. **Coolify:** new resource → Docker Image from GHCR → runtime env (all secrets) → health check → disable
   auto-deploy. Reuse the same GHCR pull PAT. Add any separate worker (e.g. a bot) as its own resource.
4. **DNS + cutover + verify + reconfigure Vercel** (Part 5).

---

# Troubleshooting

**`docker build` fails with a Zod "Missing or invalid environment variables" error.**
Confirm `SKIP_ENV_VALIDATION=1` is set in the builder stage, that `NEXT_PUBLIC_DOMAIN` is passed as a
`--build-arg`, and that any client executed at build is genuinely lazy (§2.4). If you add a new server client
constructed at import, wrap it in `lazyClient`.

**Images 500 / "sharp missing" at runtime.**
The default `next/image` optimizer needs `sharp`. Confirm the runner copies `node_modules/sharp` +
`node_modules/@img` (§2.2). Fallback: `images.unoptimized = true`.

**Site is up on the temp Coolify URL but Google sign-in fails.**
The temp URL isn't a registered OAuth redirect URI. Test auth only after attaching the real domain, or
temporarily add the temp URL to the Google OAuth client.

**HTTPS error / `ERR_SSL` on a freshly attached hostname.**
The hostname is under HSTS — either a preloaded TLD (`.dev`, `.app`) or a parent zone sending
`includeSubDomains` (§1.4). Browsers then force HTTPS and refuse a missing or invalid cert on first contact,
and cache the failure with no click-through. Attach the domain to Coolify and let Traefik finish issuing
**before** opening it in a browser, or pre-provision via DNS-01.

**A container is reachable from the internet despite UFW.**
Docker publishes ports via iptables, bypassing UFW. Route web apps through Traefik; bind admin ports to
`127.0.0.1` and use the SSH tunnel (§1.3).

**The bot replies twice / `409 Conflict: terminated by other getUpdates`.**
Two pollers share one token. Run a single bot replica and stop any local `bun run bot:dev` pointed at the prod
token (§4.7).

**Secrets ended up in the GitHub Actions build cache.**
Don't pass secrets as `--build-arg`s with `cache-to: mode=max` — cached builder layers are recoverable. Keep
secrets out of the build (§2.6 / Part 3). If it already happened: clear the Actions cache **and** rotate the
exposed secrets.

---

# Environment summary (NextRun)

| What         | Value                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| Platform     | Coolify (Docker + Traefik); dashboard `https://panel.example.com`; `:8000` SSH-tunnel fallback    |
| Prod         | `www.your-app.dev`, branch `main`; image built in CI → GHCR; Coolify pulls + runs                 |
| Dev          | Vercel Hobby — `your-app.vercel.app`, branch `develop` (separate Neon branch)                     |
| Runtime      | `node server.js` (Next.js standalone, `node:24-slim`), port 3000 behind Traefik; `sharp`          |
| Bot          | grammY long-polling, separate Coolify resource from `Dockerfile.bot` (`bun run src/bot/index.ts`) |
| App data     | Neon serverless Postgres (Drizzle, neon-http); `bun run db:push` for schema                       |
| Image        | `ghcr.io/<your-user>/nextrun:latest` (+ `sha-<commit>`)                                           |
| TLS          | Let's Encrypt via Traefik; check HSTS preload / parent `includeSubDomains` → cert green first hit |
| Secrets      | runtime-only in Coolify; build-args are `NEXT_PUBLIC_*`; off-box encrypted backup                 |
| Health check | `GET /api/health` (Bearer `HEALTH_CHECK_SECRET`; 401 otherwise) — database/openai/stripe          |
| CI/CD        | `.github/workflows/ci.yml` — check (all) · build (PR→main) · deploy (push main → GHCR → Coolify)  |
