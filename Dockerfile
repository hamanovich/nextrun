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

# This app instantiates clients at MODULE IMPORT — `new Stripe(env.STRIPE_SECRET_KEY)`
# in src/lib/stripe.ts (throws on a falsy key), the Neon Drizzle client in src/db, and
# Better Auth in src/lib/auth.ts — and `next build` executes route modules during
# "Collecting page data". So the full server env must be present at build, exactly like
# on Vercel. SKIP_ENV_VALIDATION still skips env.ts's strict zod parse at build
# (runtime stays strict). Only NEXT_PUBLIC_DOMAIN is inlined into the client bundle.
ARG NEXT_PUBLIC_DOMAIN
ARG DATABASE_URL
ARG OPENAI_API_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG TELEGRAM_BOT_TOKEN
ARG HEALTH_CHECK_SECRET

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN \
    DATABASE_URL=$DATABASE_URL \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
    GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
    BETTER_AUTH_URL=$BETTER_AUTH_URL \
    BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
    STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY \
    STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET \
    TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN \
    HEALTH_CHECK_SECRET=$HEALTH_CHECK_SECRET

RUN bun run build

# ---- runner ----
# No SKIP_ENV_VALIDATION here — at runtime env.ts validates strictly (fail-fast).
FROM oven/bun:1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# oven/bun images already ship a non-root `bun` user — reuse it
# (debian-slim has no `addgroup`/`adduser`).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

USER bun
EXPOSE 3000
CMD ["bun", "server.js"]
