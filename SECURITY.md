# Security Policy

NextRun is a boilerplate that ships real security-sensitive surfaces - authentication (Better Auth + Google OAuth), payments and a credit system (Stripe + webhooks), a Telegram bot, and a typed environment contract. We take reports against these seriously.

## Supported versions

This is an actively developed template; security fixes land on the latest `main`. Always base new work on the current `main` and keep dependencies up to date.

| Version            | Supported               |
| ------------------ | ----------------------- |
| latest `main`      | ✅                      |
| older tags / forks | ❌ (rebase onto `main`) |

## Reporting a vulnerability

**Do not open a public issue for security problems.**

Report privately via either channel:

- **Email:** [nextrun@hamanovich.com](mailto:nextrun@hamanovich.com) - put `SECURITY` in the subject.
- **GitHub:** Security → **Report a vulnerability** (private advisory) on the repository.

Please include:

- A description of the issue and its impact.
- Steps to reproduce (a minimal PoC if possible).
- Affected area (auth, Stripe/credits, webhooks, bot, env handling, etc.) and any relevant version/commit.

We aim to acknowledge within a few business days and to coordinate a fix and disclosure timeline with you. Please give us reasonable time to ship a fix before any public disclosure.

## Scope

Especially interested in:

- **Auth bypass / session handling** - Better Auth config, `getSessionUser()`, the `src/proxy.ts` route guard.
- **Payment & credit integrity** - the Stripe checkout/webhook path (`src/app/api/webhooks/stripe`), webhook signature verification, credit accounting.
- **Server Action gaps** - missing session checks or missing Zod validation on user input.
- **Secret exposure** - secrets reaching the client bundle, the build, or the CI cache (the build is designed to carry **no** server secrets; only `NEXT_PUBLIC_*` are build args).
- **Bot trust boundary** - untrusted Telegram input reaching privileged operations.

## Out of scope

- Vulnerabilities only present in **your** deployment due to misconfiguration (weak `BETTER_AUTH_SECRET`, leaked `.env`, exposed admin ports, etc.) - see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for hardening guidance.
- Issues in third-party dependencies without a demonstrated impact on this project (report those upstream).
- Generic best-practice notes with no concrete exploit.

## Handling secrets

Never commit real secrets. Only `.env.example` (placeholders) is tracked; `.gitignore` ignores `.env` and `.env.*`. All required variables are validated at startup by `src/lib/env.ts`. If you believe a secret was committed, rotate it immediately and report it.
