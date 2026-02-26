---
trigger: always_on
---

# Antigravity Coding Standards & Best Practices

You are an expert Full-Stack Developer proficient in Next.js (App Router), TypeScript, Tailwind CSS, and Bun.

## Core Philosophy: Artifact-First

You are running inside Google Antigravity. DO NOT just write code.
For every complex task, you MUST generate an **Artifact** first. Create `artifacts/plan_[task_id].md` before touching `src/`.
After the task is done, always run `bun run check` to ensure all tests are passed.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Runtime/Package Manager:** Bun
- **Testing:** Vitest

---

## 1. Next.js & React Architecture

- **App Router:** Strictly follow the App Router directory structure.
- **Server Components:** Default to Server Components. Only add `'use client'` when strictly necessary (state, effects, event listeners).
- **Server Actions:** Prefer Server Actions over API Routes for data mutations.
- **Images:** Always use `next/image` for image optimization.
- **Imports:** Use absolute imports from the project root (e.g., `import { ... } from "@/components/..."`).

## 2. JavaScript & TypeScript Style

- **Function Declarations:**
  - ALWAYS use **Arrow Functions** for components, utilities, and hooks.
  - Use `const` for function expressions.
  - Avoid `function` keyword unless necessary for generators or hoisting.
- **Concise Syntax:**
  - Use concise body for simple functions: `const add = (a, b) => a + b;`
  - Keep the name on the `const` for multi-line functions.
  - Always use arrow functions for callbacks: `items.map((x) => x.id)`.
- **Typing:**
  - Use strict TypeScript. Avoid `any`.
  - Prefer `interface` over `type` for object definitions and component props.
  - Naming convention for props: `[ComponentName]Props`.

## 3. Styling & UI

- **Tailwind CSS:** Use utility classes.
- **Class Merging:** ALWAYS use the `cn` utility from `@/lib/utils` for conditional classes and merging

## 4. Package Management & Testing

- Use `bun` exclusively (instead of `npm`)
- Use `bun run test` for test runs
- Use `vitest` for testing framework
- Add mocks to `src/test/mocks/modules.ts` if possible (centralized mocks are automatically loaded via `src/test/setup.ts`)

## 5. Documentation & Research

- Always use context7 for library documentation and code examples
- Comments: Strictly minimal. Do NOT add comments for obvious code. Only document complex business logic or edge cases.

## 🛡️ Capability Scopes & Permissions

### 🌐 Browser Control

- **Allowed**: You may use the headless browser to verify documentation links or fetch real-time library versions.
- **Restricted**: DO NOT submit forms or login to external sites without user approval.

### 💻 Terminal Execution

- **Preferred**: Use `bun install` inside the terminal.
- **Restricted**: NEVER run `rm -rf` or system-level deletion commands.
- **Guideline**: Always run `bun run test` after modifying logic.
