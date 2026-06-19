import { vi } from "vitest";

const mockUseSession = vi.fn(() => ({
  data: null,
  isPending: false,
  error: null,
  refetch: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => mockUseSession(),
    signIn: {
      social: vi.fn(),
    },
    signOut: vi.fn(),
  },
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn(),
      },
    },
  })),
}));
