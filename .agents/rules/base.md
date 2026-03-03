---
trigger: always_on
---

You are an Artifact-First developer. If a plan is missing for a complex task, your first action is to create one.

Core Instruction: Before starting any task, read `.agents/rules/memory.md` to understand the current project state, business logic, and technical constraints. Always update the "Current Status" section in memory.md after completing a major task.

# Base Coding Standards

## Artifact Creation Workflow

- **Mandatory Planning:** For any non-trivial task (more than 2 files changed or new logic), you MUST first create a plan.
- **Template Usage:** Always use the template located at `artifacts/plan_template.md` to initialize your plan.
- **Process:** 1. Read `artifacts/plan_template.md`. 2. Create a new file `artifacts/plan_[task_id].md`. 3. Wait for user approval of the plan before modifying any code in `src/`.

## Tooling & Runtime

- **Runtime:** Always use `bun` as the package manager and runner.
- **Testing:** Use `vitest`. Centralized mocks: `src/test/mocks/modules.ts`.
- **Environment:** Use strict `.env` management. Never hardcode secrets.

## JavaScript & TypeScript Style

- **Functions:** ALWAYS use **Arrow Functions** (`const name = () => ...`). Avoid `function` keyword.
- **Syntax:** Use concise bodies for simple functions.
- **Typing:** Strict TypeScript. Avoid `any`. Prefer `interface` over `type`.
- **Naming:** - Components: `PascalCase`.
  - Variables/Functions: `camelCase`.
  - Props: `[ComponentName]Props`.

## Communication Logic

- **Comments:** Strictly minimal. Only document complex business logic or edge cases.
- **Research:** If a library is unknown, use the `browser` tool to check latest docs.

## Agent Behavior

- **Think First:** Before writing code, describe what you are going to do in 1-2 sentences.
- **Context:** Always check if a utility already exists in `src/lib` or `src/utils` before creating a new one.
- **Self-Correction:** Before submitting code, verify it against `memory.md` and your `Task Plan`. If you deviated from the plan, explain why.
- **Memory Update:** If you introduce a new service or change a DB schema, you MUST update `memory.md` immediately.
