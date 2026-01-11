# Agent Rules – JS/TS Style

## Function Declarations

- Prefer arrow functions over function declarations in JavaScript/TypeScript.
- Use `const` for function expressions unless reassignment is necessary.
- Prefer concise expression bodies when possible:
  ```typescript
  const add = (a, b) => a + b;
  ```
- For multi-line implementations, keep the name on the const:
  ```typescript
  const doThing = (args) => {
    // ...
  };
  ```
- Avoid `function foo() {}` unless required for:
  - Hoisting (API requires top-level hoisted function), or
  - Dynamic `this` binding (arrow functions lexically bind `this`).
- For callbacks, prefer arrow functions:
  ```typescript
  items.map((x) => x.id);
  ```

## Code Style

- Do not add comments
- Use the `cn` utility function from `@/lib/utils` for cleaner className handling:
  ```typescript
  import { cn } from "@/lib/utils"
  className={cn("base-class", condition && "conditional-class", className)}
  ```

## Package Management & Testing

- Use bun instead of npm
- Use `bun run test` for test runs
- Use vitest for testing framework
- Add mocks to `src/test/mocks/modules.ts` if possible (centralized mocks are automatically loaded via `src/test/setup.ts`)

## Documentation & Research

- Always use context7 for library documentation and code examples
