# syntax=docker/dockerfile:1

# ---- deps ----
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- builder ----
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Only NEXT_PUBLIC_* (non-secret) values reach the build as args. SKIP_ENV_VALIDATION=1
# skips env.ts's strict Zod parse during `next build` (runtime stays strict), and all
# server clients (Neon/Drizzle, Stripe, Better Auth) construct lazily on first use
# (see src/lib/lazy.ts) — so `next build` needs no server secrets. Passing secrets here
# would bake them into the builder layer and leak into the GHA build cache
# (cache-to: mode=max); they are injected only at runtime via Coolify.
#
# NEXT_PUBLIC_DOMAIN must be real at build (inlined into the client bundle and used by
# static sitemap/robots generation). NEXT_PUBLIC_UMAMI_* are the public, non-secret
# analytics identifiers.
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_UMAMI_URL
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN \
    NEXT_PUBLIC_UMAMI_URL=$NEXT_PUBLIC_UMAMI_URL \
    NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID

RUN bun run build

# ---- runner ----
# No SKIP_ENV_VALIDATION here — at runtime env.ts validates strictly (fail-fast), so the
# container won't start if any real var is missing in Coolify.
# Runs under Node, not bun: Next's standalone server.js targets Node and matches Vercel.
# NextRun uses the neon-HTTP driver (drizzle-orm/neon-http), so the bun WebSocket caveat
# does not apply — Node is chosen for Vercel parity.
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Coolify's HTTP healthcheck shells out to curl INSIDE the container; slim ships none.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# node:slim ships a non-root `node` user — reuse it.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# next/image uses the default optimizer, which needs sharp at runtime. Standalone tracing
# usually bundles it, but copy explicitly to guarantee the linux binary and its @img/*
# native deps are present.
COPY --from=builder --chown=node:node /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=node:node /app/node_modules/@img ./node_modules/@img

USER node
EXPOSE 3000
CMD ["node", "server.js"]
