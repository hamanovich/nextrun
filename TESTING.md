# Testing Setup with Vitest

This project uses [Vitest](https://vitest.dev/) as the testing framework, providing fast unit testing with excellent TypeScript support and React Testing Library integration.

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests once
bun run test:run

# Run tests in watch mode
bun run test:watch

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage
```

## 📁 Project Structure

```
src/
├── test/
│   ├── setup.ts          # Global test setup
│   └── sample.test.tsx   # Example test file
├── components/           # Component tests go here
├── lib/                  # Utility function tests
└── actions/              # Server action tests
```

## ⚙️ Configuration

### Vitest Config (`vitest.config.ts`)

- **Environment**: jsdom (for DOM testing)
- **Setup Files**: `src/test/setup.ts`
- **Coverage**: v8 provider with HTML reports
- **Path Aliases**: Configured for `@/` imports
- **Test Patterns**: `**/*.{test,spec}.{js,ts,jsx,tsx}`

### Test Setup (`src/test/setup.ts`)

- Jest-DOM matchers for better assertions
- React Testing Library cleanup
- Next.js router mocking
- Next.js Image component mocking
- Environment variable setup

## 🧪 Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Component Name', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### Testing Async Functions

```typescript
import { describe, expect, it } from "vitest";

describe("Async Functions", () => {
  it("should handle async operations", async () => {
    const asyncFunction = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve("success"), 100);
      });
    };

    const result = await asyncFunction();
    expect(result).toBe("success");
  });
});
```

### Testing Server Actions

```typescript
import { myServerAction } from "@/actions/my-action";
import { describe, expect, it, vi } from "vitest";

// Mock external dependencies
vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      create: vi.fn(),
    },
  },
}));

describe("Server Actions", () => {
  it("should create a customer", async () => {
    const result = await myServerAction({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });
});
```

## 🎯 Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Component Testing

- Test user interactions, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility features

### 3. Mocking

- Mock external dependencies
- Use `vi.mock()` for module mocking
- Mock Next.js specific features (router, image, etc.)

### 4. Coverage

- Aim for meaningful coverage, not 100%
- Focus on critical business logic
- Test edge cases and error conditions

## 🔧 Available Scripts

| Script                  | Description             |
| ----------------------- | ----------------------- |
| `bun run test`          | Run tests once          |
| `bun run test:ui`       | Open Vitest UI          |
| `bun run test:coverage` | Run tests with coverage |

## 📊 Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/index.html`
- **JSON Report**: `coverage/coverage-final.json`
- **Text Report**: Console output

## 🛠️ Troubleshooting

### Common Issues

1. **Module not found errors**: Check path aliases in `vitest.config.ts`
2. **JSX errors**: Ensure `@vitejs/plugin-react` is installed
3. **Next.js mocking issues**: Update mocks in `src/test/setup.ts`

### Debug Mode

Run tests with debug output:

```bash
bun run test:run --reporter=verbose
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event](https://testing-library.com/docs/user-event/intro/)

Happy testing! 🧪✨
