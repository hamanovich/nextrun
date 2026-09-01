# NextRun — Product Overview

> **A production-ready Next.js 16 starter that ships the boring 80% for you.**
> NextRun is the foundation you'd otherwise spend two weeks rebuilding by hand:
> Google authentication, Stripe payments with a credit system, a Postgres database,
> a Telegram bot, and a polished UI kit — all configured, typed end to end, and wired
> together. Clone it, point it at your database, and build the part that actually
> makes your product yours.

This document describes everything NextRun gives you, grouped by capability. It is a
product reference — what the starter _is_ and _delivers_ — not a technical manual.

> **Living document.** `PRODUCT.md` is kept in sync with the shipped product. Any change
> that adds, removes, or materially alters a user-facing feature — an integration, a page,
> a credit rule, a bot command, a pricing tier — must update this file in the _same change_.
> Keep it marketing-accurate: describe what the product _does_ and why it matters, never
> code, schemas, or file paths.

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [What NextRun Does](#2-what-nextrun-does)
3. [How It Works](#3-how-it-works)
4. [Authentication](#4-authentication)
5. [Payments & the Credit System](#5-payments--the-credit-system)
6. [Pricing Surface](#6-pricing-surface)
7. [The Telegram Bot](#7-the-telegram-bot)
8. [Database & Server Actions](#8-database--server-actions)
9. [The UI Kit & Design Language](#9-the-ui-kit--design-language)
10. [The Demo App](#10-the-demo-app)
11. [Production-Ready by Default](#11-production-ready-by-default)
12. [Security & Privacy](#12-security--privacy)
13. [Deployment](#13-deployment)
14. [Who It's For](#14-who-its-for)
15. [Why NextRun](#15-why-nextrun)

---

## 1. The Problem

Every new product starts the same way — and it has nothing to do with the idea. Before you
write a single line of the thing you actually want to build, you rebuild the same plumbing
you've built a dozen times: wire up authentication, integrate a payment provider, stand up
a database, validate every input, build a settings page, set up a UI system, configure the
build, and get it all to deploy. Days pass. The interesting part hasn't started yet.

And it isn't just slow — it's where bugs and security holes are born. Auth wired up in a
hurry leaks sessions. Payment webhooks that aren't verified or idempotent double-charge or
silently drop. Inputs that skip validation become the vulnerability. Most starters either
give you a bare framework with none of this, or a bloated kitchen sink you spend a week
ripping apart. The gap is a foundation that is **complete, correct, and small enough to
read.**

**NextRun removes the setup.** Authentication, payments, database, and a Telegram bot come
configured, typed, and wired into each other — secure flows from the first commit. The
distance between an idea and a deployed product becomes about as short as a single
`git clone`. The only thing left to build is the part that matters.

---

## 2. What NextRun Does

NextRun is a **production-ready Next.js 16 starter** — a complete, typed foundation for a
modern web product, with the integrations every SaaS needs already in place.

- **Authenticate** users with Google OAuth and managed sessions, wired into Server Actions.
- **Charge** for usage with Stripe checkout, verified webhooks, and a built-in credit system.
- **Persist** data through a fully typed Postgres layer — no untyped queries, no service-layer boilerplate.
- **Engage** users on Telegram with a ready-to-deploy bot that ships alongside the app.
- **Ship** a polished, accessible, dark-mode UI on day one instead of building one.

It is built for **developers and small teams** who want to start from a foundation they can
trust and read, not a blank canvas and not a bloated template. The whole stack is **typed
end to end** with TypeScript strict mode and Zod validation on every input.

The promise is deliberately simple:

- **Skip the setup.** The boring 80% — auth, billing, data, UI — is already done.
- **Typed end to end.** Strict TypeScript and Zod from the database to the form field.
- **Yours to read and extend.** Code you can trust, linted and documented, not a black box.
- **Deploy from the first commit.** A build that needs no server secrets and an image that runs anywhere.

The home page says it in five words: **"Skip the setup. Ship the product."**

---

## 3. How It Works

Four steps from clone to deployed product:

1. **Clone the template.** Pull NextRun from GitHub and install with Bun (or npm/yarn/pnpm).
2. **Point it at your services.** Copy the example environment file and fill in your database
   URL, Google OAuth credentials, and Stripe keys — every required value is validated at
   startup, so a missing or malformed setting fails loudly and immediately, not in production.
3. **Push the schema.** One command pushes the typed database schema to your Postgres
   instance. You're ready to store users, sessions, and credits.
4. **Run and build.** Start the dev server and the Telegram bot; when you're ready, build a
   container image and deploy it anywhere.

From there you build _your_ product on top — the authentication, billing, data access, and
UI are already in place and out of your way.

---

## 4. Authentication

NextRun ships authentication that is secure, managed, and already connected to the rest of
the app.

- **Sign in with Google.** One-click Google OAuth — no passwords to store, no signup form to
  build, no reset-email flow to maintain. Offline access and account selection are configured
  out of the box.
- **Managed sessions.** Persistent, secure sessions read on the server inside Server Actions,
  and on the client through a typed auth client — the session boundary is handled for you.
- **Protected routes.** Route protection is wired in at the middleware layer: the signed-in
  area redirects anonymous visitors to the sign-in page automatically. Add your own protected
  routes the same way.
- **A complete user model.** Each session carries the user's identity (name, email, avatar)
  alongside their credit balance and payment identifiers — the auth and billing systems share
  one source of truth.

**Why it matters:** authentication is the single most reimplemented and most error-prone
part of any product. NextRun gets it right once so you never rebuild it.

---

## 5. Payments & the Credit System

NextRun includes a complete, webhook-driven **credit system** — the monetization model most
modern SaaS products actually use.

- **Credits, not subscriptions.** Users buy credits in one-off purchases; there's no recurring
  billing to manage and nothing for customers to cancel. One credit covers one paid action
  (for example, a generation request).
- **Five free credits to start.** Every new account begins with **5 credits** and no credit
  card — users can try the product before paying.
- **Stripe checkout, end to end.** A purchase opens Stripe Checkout; on success the user lands
  on a confirmation page that reflects the real payment status.
- **Verified, idempotent webhooks.** Credits are granted by a signed Stripe webhook, not by
  the browser — so the grant can't be forged or replayed. Duplicate events are ignored, and
  the balance is updated atomically.
- **Atomic spend and refund.** Consuming a credit decrements the balance only if one is
  available, and a failed action can refund it — no negative balances, no lost credits.
- **Credits that don't expire.** Balances are non-expiring and roll over indefinitely;
  there's no monthly reset to explain to customers.

**Why it matters:** billing is where a starter is most likely to be either missing or subtly
broken. NextRun's credit flow is the secure, idempotent version you'd eventually have to
build anyway.

---

## 6. Pricing Surface

NextRun ships a working pricing page so you can sell from day one — wired to Stripe, with
sensible demo tiers until you connect your own products.

- **Three demo tiers**, ready to rename and reprice:
  - **Starter — Free.** 5 free credits to start, essential components, basic deployment
    support, community support.
  - **Pro — $19 one-time** _(most popular)_. 100 building credits, all integrations included,
    Stripe and Telegram bot ready, email support.
  - **Scale — $49 one-time.** 300 building credits, everything in Pro, priority support, and
    early access to new modules.
- **Live tiers from Stripe.** In production the page reads your real Stripe products and
  prices — including how many credits each one grants — so updating a price is a Stripe change,
  not a code change.
- **One-time or recurring.** The pricing surface understands both one-off and recurring billing
  periods, so you can adapt it to whichever model you choose.
- **A built-in FAQ.** The page answers the questions every buyer asks — what a credit is,
  whether there's a subscription, the free tier, the money-back guarantee — so you don't write
  that copy from scratch.

---

## 7. The Telegram Bot

NextRun bundles a **Telegram bot** that deploys alongside the web app — a second surface for
your product without a second project.

- **A typed grammY bot** with `/start` and `/help` commands in place and a clear structure for
  adding your own.
- **Stateful conversations.** Multi-step flows are supported out of the box, so the bot can
  hold a conversation rather than answer one message at a time.
- **File handling** for receiving and sending documents and media.
- **Built-in throttling.** API rate limiting is wired in so the bot stays within Telegram's
  limits under load.
- **Graceful lifecycle.** Clean startup and shutdown handling, ready to run as its own
  container in production.

**Why it matters:** a Telegram presence is a proven distribution and engagement channel.
NextRun gives you the wiring so the bot is an extension of your product, not a side quest.

---

## 8. Database & Server Actions

NextRun's data layer is typed from the schema to the call site, with a deliberately simple
shape.

- **A typed Postgres database** on serverless infrastructure — fast cold starts, no connection
  pool to babysit. Queries are fully typed against your schema, so a wrong column name is a
  build error, not a runtime surprise.
- **Server Actions, not a service maze.** Data access lives in server-side actions called
  directly from components — there's intentionally no extra service layer to thread logic
  through. Less indirection, less to read.
- **Validated inputs everywhere.** Every user-supplied value entering an action is validated
  with Zod before it touches the database.
- **Typed client data fetching.** On the client, data is fetched and cached through a typed
  query layer, so loading, caching, and refetching are handled for you.

**Why it matters:** the data layer is where most apps accumulate the most boilerplate and the
most bugs. NextRun keeps it flat, typed, and safe.

---

## 9. The UI Kit & Design Language

NextRun looks finished the moment it runs — a coherent, accessible interface you extend rather
than design from zero.

- **An accessible component kit** built on battle-tested primitives, styled with a modern,
  utility-first CSS system and a crisp icon set.
- **Dark mode out of the box.** Theme switching is wired in and respected across the app.
- **A strict monochrome design language.** A neutral palette with a single accent keeps the
  surface calm and professional — and makes it easy to rebrand by changing one accent rather
  than untangling a rainbow.
- **Subtle motion.** Tasteful fade-in animations give the marketing pages polish without
  noise.
- **A real marketing surface.** Home, about, pricing, privacy, and terms pages ship ready to
  edit, with SEO metadata and social-share images already in place — including dynamically
  rendered Open Graph images.

**Why it matters:** a half-built UI makes a product feel half-built. NextRun starts you at a
polished baseline so your first deploy looks like a real product.

---

## 10. The Demo App

NextRun isn't just code — it runs at **nextrun.hamanovich.com** as a live demonstration of itself, so you
can see every integration working before you clone.

- **A working sign-in** with Google.
- **A real profile dashboard** for the signed-in user — their identity and avatar, their auth
  provider, their account status, and a live **credit balance** that flags when it runs low or
  empty, alongside their Stripe details and a direct path to buy more.
- **A live pricing and checkout flow** you can click through end to end.
- **The Telegram bot**, reachable and responding.

The demo _is_ the product: what you try is exactly what you clone.

---

## 11. Production-Ready by Default

The details that separate a demo from a deployable product are already handled.

- **A validated environment contract.** Every required setting is checked at startup against a
  strict schema — the app refuses to run misconfigured instead of failing deep in a request.
- **No server secrets at build time.** Server clients construct on first use, not at import, so
  the production build and the container image need no database or API secrets to compile.
- **A health-check endpoint.** A secured endpoint reports overall status plus the live state of
  the database, payment, and AI integrations — ready to wire into uptime monitoring and
  orchestration health probes.
- **Typed, linted, tested.** Strict TypeScript, linting, formatting, and a test suite ship in
  the box, with a single command that runs them all before you call work done.

**Why it matters:** "works on my machine" isn't shipping. NextRun is built to run in
production, monitored, from the first deploy.

---

## 12. Security & Privacy

- **Google sign-in.** Authentication runs through Google — no passwords for the app to store.
- **Forged-request-proof billing.** Credits are granted only by signed, idempotent Stripe
  webhooks, never by the client, so balances can't be inflated by a crafted request or a
  replayed event.
- **Validated input by default.** User input is validated with Zod before it's trusted —
  the secure path is the default path, not an add-on.
- **Secrets stay out of the repo.** Only placeholder configuration is tracked; real secrets are
  runtime-only and never built into the image.
- **Clear terms.** Dedicated Privacy Policy and Terms pages ship with the product, ready to
  adapt to your business.

**Why it matters:** security wired in from the first commit is far cheaper than security bolted
on after launch. NextRun starts you on the safe path.

---

## 13. Deployment

NextRun is built to be **self-hosted and portable** — it runs wherever containers run.

- **Container-first.** The web app and the Telegram bot each build into their own image, ready
  to ship independently.
- **A CI pipeline included.** Continuous integration builds, checks, and publishes the images on
  every change.
- **Runtime-only secrets.** Only public configuration is needed at build time; every secret is
  injected at runtime — so the same image is safe to build, store, and promote across
  environments.
- **A documented runbook.** A full deployment guide ships with the project, covering the path
  from a container registry to a running host.

**Why it matters:** you own your deployment. No vendor lock-in, no platform you can't leave —
just a portable image and a clear path to production.

---

## 14. Who It's For

- **Indie hackers and solo founders** who want to validate an idea this week, not next month.
- **Small teams** standing up a new SaaS who'd rather start from a trustworthy foundation than a
  blank repo.
- **Agencies and freelancers** who build similar products repeatedly and want a consistent,
  secure starting point each time.
- **Developers learning the modern stack** who want a real, working reference for how auth,
  payments, a database, and a bot fit together — not a toy.

It is _not_ a no-code builder and not a bloated everything-template. It's a focused, readable
foundation for people who write code.

---

## 15. Why NextRun

What sets NextRun apart from a bare framework or a generic boilerplate:

- **Complete where it counts.** Auth, payments, database, bot, and UI are all present and wired
  to each other — not a checklist of empty folders.
- **Small enough to read.** A flat, typed architecture with no needless layers; you can
  understand the whole thing and extend it with confidence.
- **Secure from the first commit.** Verified webhooks, validated input, managed sessions, and
  secrets kept out of the build are the defaults, not the homework.
- **Typed end to end.** From the database schema to the form field, the compiler has your back.
- **Yours to deploy anywhere.** Container-first and self-hostable, with no platform lock-in.
- **A live demo that is the product.** What you try at nextrun.hamanovich.com is exactly what you clone.

> **NextRun is the production-ready foundation that turns "I have an idea" into a deployed
> product in days, not weeks — so you never rebuild authentication and billing from scratch
> again.**
