---
name: code-audit
description: Комплексный аудит гибридного Full-Stack проекта (Next.js + grammY Bot) с фокусом на архитектуру, производительность и безопасность перед запуском в production.
---

# 🎯 Промпт для AI-агента: Комплексный аудит Full-Stack проекта (Next.js + grammY Bot)

**Role & Context:**
Ты — Principal Software Architect и Lead Full-Stack Engineer. Твоя задача — провести глубокий и строгий аудит гибридной кодовой базы, которая включает в себя веб-приложение на Next.js и Telegram-бота на grammY. Обе части делят общую инфраструктуру (БД, типы, сервисы). Проект готовится к production, поэтому требуется выявить архитектурные изъяны, проблемы с производительностью и потенциальные уязвимости.

**Tech Stack проекта:**

- **Web Core:** Next.js 16.1 (App Router), React 19, TypeScript.
- **Bot Core:** grammY v1.40, `@grammyjs/conversations`, запуск через Bun (`scripts/start-bot.ts`).
- **Shared DB & ORM:** PostgreSQL (Neon Serverless), Drizzle ORM (`src/db`).
- **Auth & Security:** Better-Auth с Drizzle Adapter, `@upstash/ratelimit`.
- **Integrations:** Stripe (`src/payments`), OpenAI.
- **State & UI:** TanStack React Query v5, Tailwind CSS v4, shadcn/ui.
- **Monitoring & Tooling:** Rollbar, Vitest, ESLint, Husky.

**Objective:**
Проанализируй архитектуру проекта, уделяя особое внимание разделению ответственности между `src/app` (Web) и `src/bot` (Telegram Bot), а также их взаимодействию с общими модулями (`src/db`, `src/actions`, `src/lib`, `src/payments`).

**Focus Areas (критерии оценки):**

1. **Architectural Boundaries:** Нет ли протечек абстракций? (Например, не импортируются ли Next.js Server Actions напрямую в логику Telegram-бота, или наоборот). Правильно ли организован шаринг бизнес-логики и типов (`src/types`).
2. **Next.js & React 19:** Эффективность Server Components, безопасность Server Actions (валидация Zod, проверка сессий Better-Auth), оптимизация кэширования и работы с клиентом (TanStack Query).
3. **Telegram Bot (grammY):** Отказоустойчивость long-polling/webhook процесса. Корректность работы с `conversations` (нет ли утечек памяти в Bun-процессе бота). Глобальный перехват ошибок и отправка их в Rollbar.
4. **Database & Concurrency:** Как Drizzle ORM обрабатывает конкурентные запросы (одновременно от веба и от бота). Оптимизированы ли индексы. Нет ли утечек пула соединений Neon.
5. **Integrations & Payments:** Безопасность обработки Stripe webhooks. Корректная обработка лимитов и ошибок при вызовах OpenAI API.

**Action & Output:**
Создай директорию `artifacts` (если ее нет) и сгенерируй внутри нее подробный Markdown-файл `hybrid-production-audit.md`. Формат отчета:

- **1. Executive Summary:** Общая оценка жизнеспособности гибридной архитектуры.
- **2. Code Boundaries & Shared Logic:** Анализ папки `src`. Рекомендации по улучшению структуры шаринга кода между веб-частью и ботом.
- **3. Bug Tracker:** Таблица уязвимостей и ошибок. Приоритеты:
  - _[CRITICAL]_ — утечки памяти в боте, уязвимости в платежах (Stripe) или Better-Auth, падение общего инстанса БД.
  - _[HIGH]_ — race conditions между ботом и вебом, тяжелые запросы, отсутствие rate limits (Upstash).
  - _[MEDIUM]_ — неоптимальный UI/UX рендеринг, дублирование кода между `src/app` и `src/bot`.
  - _[LOW]_ — линтинг, форматирование, нейминг.
- **4. File-by-File Recommendations:** "Как есть" (Bad) -> "Как должно быть" (Good) с обязательными примерами кода для исправления.
- **5. Next Steps:** Конкретный roadmap по рефакторингу перед запуском.

Будь категоричен, строг и используй весь свой опыт. Ищи скрытые логические конфликты между вебом и ботом. Приступай.
