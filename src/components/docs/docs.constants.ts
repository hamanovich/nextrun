export const docsSections = [
  { id: "overview", title: "Overview" },
  { id: "quick-start", title: "Quick start" },
  { id: "environment", title: "Environment variables" },
  { id: "project-structure", title: "Project structure" },
  { id: "whats-included", title: "What is included" },
  { id: "scripts", title: "Scripts" },
  { id: "deployment", title: "Deployment" },
] as const;

export const quickStartCommands = [
  "git clone https://github.com/hamanovich/nextrun",
  "cd nextrun",
  "bun install",
  "cp .env.example .env",
  "bun run db:push",
  "bun run dev",
];

export const envVars = [
  {
    name: "DATABASE_URL",
    required: true,
    description: "Neon or PostgreSQL connection string.",
  },
  {
    name: "NEXT_PUBLIC_DOMAIN",
    required: true,
    description: "Absolute site URL, for example http://localhost:3000.",
  },
  {
    name: "BETTER_AUTH_SECRET",
    required: true,
    description: "Session secret for Better Auth (min 32 characters).",
  },
  {
    name: "BETTER_AUTH_URL",
    required: true,
    description: "Base URL Better Auth runs on.",
  },
  {
    name: "GOOGLE_CLIENT_ID",
    required: true,
    description: "Google OAuth client ID.",
  },
  {
    name: "GOOGLE_CLIENT_SECRET",
    required: true,
    description: "Google OAuth client secret.",
  },
  {
    name: "STRIPE_SECRET_KEY",
    required: true,
    description: "Stripe API secret key.",
  },
  {
    name: "STRIPE_WEBHOOK_SECRET",
    required: true,
    description: "Signing secret for the Stripe webhook.",
  },
  {
    name: "TELEGRAM_BOT_TOKEN",
    required: true,
    description: "Token for the grammY Telegram bot.",
  },
  {
    name: "OPENAI_API_KEY",
    required: true,
    description: "Used by the health-check endpoint.",
  },
  {
    name: "HEALTH_CHECK_SECRET",
    required: true,
    description: "Guards the health endpoint (min 32 characters).",
  },
  {
    name: "NEXT_PUBLIC_UMAMI_URL",
    required: false,
    description: "Umami instance URL. Leave empty to disable analytics.",
  },
  {
    name: "NEXT_PUBLIC_UMAMI_WEBSITE_ID",
    required: false,
    description: "Umami website ID (UUID).",
  },
] as const;

export const projectTree = `src/
  actions/      Server Actions: Drizzle queries, auth, Stripe
  app/          App Router routes, layouts and API handlers
  bot/          grammY Telegram bot
  components/   UI and feature components
  db/           Drizzle schema and client
  hooks/        TanStack Query hooks
  lib/          env, auth, stripe and utils
  test/         Vitest setup and mocks`;

export const includedFeatures = [
  {
    title: "Authentication",
    description:
      "Better Auth with Google OAuth and sessions, read server-side through Server Actions.",
  },
  {
    title: "Payments",
    description:
      "Stripe checkout, a credit system, and signature-verified webhooks.",
  },
  {
    title: "Database",
    description: "Drizzle ORM on Neon Postgres with fully typed queries.",
  },
  {
    title: "Telegram bot",
    description:
      "A grammY bot with conversations, file handling and throttling.",
  },
  {
    title: "UI kit",
    description: "shadcn/ui, Tailwind v4 and dark mode, wired and themeable.",
  },
  {
    title: "Type safety",
    description: "TypeScript strict mode and Zod validation on every input.",
  },
] as const;

export const scripts = [
  {
    command: "bun run dev",
    description: "Start the dev server with Turbopack.",
  },
  { command: "bun run build", description: "Create a production build." },
  {
    command: "bun run check",
    description: "Run ts:check, lint, format and tests.",
  },
  {
    command: "bun run db:push",
    description: "Push the Drizzle schema to the database.",
  },
  {
    command: "bun run stripe:listen",
    description: "Forward Stripe webhooks to localhost.",
  },
  {
    command: "bun run bot:dev",
    description: "Run the Telegram bot in watch mode.",
  },
] as const;

export const dockerBuildExample = `docker build \\
  --build-arg NEXT_PUBLIC_DOMAIN=https://your-domain.com \\
  --build-arg NEXT_PUBLIC_UMAMI_URL=https://analytics.your-domain.com \\
  -t nextrun .`;
