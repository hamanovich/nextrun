import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserInformation } from "../user-information";

vi.mock("@/lib/user.utils", () => ({
  formatUserData: vi.fn((data?: string | null, noData = "Not available") =>
    data ? `${data.slice(0, 8)}…${data.slice(-4)}` : noData,
  ),
  getProviderFromEmail: vi.fn((email?: string | null) => {
    if (!email) return "Unknown";
    if (email.includes("@gmail.com")) return "Google";
    if (email.includes("@outlook.com") || email.includes("@hotmail.com"))
      return "Microsoft";
    if (email.includes("@yahoo.com")) return "Yahoo";
    return "Email";
  }),
}));

describe("UserInformation", () => {
  describe("Default Rendering", () => {
    it("renders with complete user data", () => {
      const user = {
        id: "user_1234567890",
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://example.com/avatar.jpg",
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("User Information")).toBeInTheDocument();
      expect(
        screen.getByText("Your account details and authentication status"),
      ).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });

    it("renders with minimal user data", () => {
      const user = {
        id: "user_123",
        name: null,
        email: null,
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Anonymous User")).toBeInTheDocument();
      expect(screen.getByText("No email provided")).toBeInTheDocument();
    });

    it("renders with partial user data", () => {
      const user = {
        id: "user_456",
        name: "Jane Smith",
        email: "jane@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });
  });

  describe("Authentication Status", () => {
    it("renders authentication badges", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@gmail.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Authenticated")).toBeInTheDocument();
      expect(screen.getByText("Google")).toBeInTheDocument();
    });

    it("renders authentication status with correct styling", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      const authBadge = screen.getByText("Authenticated").closest("span");
      expect(authBadge).toHaveClass("flex", "items-center", "gap-1");
    });
  });

  describe("Account Details", () => {
    it("renders user ID with formatting", () => {
      const user = {
        id: "user_1234567890",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("User ID")).toBeInTheDocument();
      expect(screen.getByText("user_123…7890")).toBeInTheDocument();
    });

    it("renders account status as active", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Account Status")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders account status with correct styling", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      const statusContainer = screen
        .getByText("Active")
        .closest("div")?.parentElement;
      expect(statusContainer).toHaveClass(
        "p-3",
        "bg-muted/50",
        "rounded-lg",
        "border",
      );
    });
  });

  describe("Email Provider Detection", () => {
    it("detects Gmail provider", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@gmail.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Google")).toBeInTheDocument();
    });

    it("detects Microsoft provider", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@outlook.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Microsoft")).toBeInTheDocument();
    });

    it("detects Yahoo provider", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@yahoo.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Yahoo")).toBeInTheDocument();
    });

    it("detects generic email provider", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("handles unknown provider for null email", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: null,
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("applies responsive grid classes", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      const gridContainer = screen.getByText("User ID").closest(".grid");
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "gap-4",
      );
    });

    it("applies responsive flex classes", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      const flexContainer = screen.getByText("John Doe").closest(".flex");
      expect(flexContainer).toHaveClass("flex", "items-start", "gap-4");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("John Doe");
    });

    it("has proper card structure", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      const card = screen
        .getByText("User Information")
        .closest(".overflow-hidden");
      expect(card).toBeInTheDocument();
    });

    it("has proper labels for form elements", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("User ID")).toBeInTheDocument();
      expect(screen.getByText("Account Status")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty user object", () => {
      const user = {};

      render(<UserInformation user={user} />);

      expect(screen.getByText("Anonymous User")).toBeInTheDocument();
      expect(screen.getByText("No email provided")).toBeInTheDocument();
    });

    it("handles undefined user properties", () => {
      const user = {
        id: undefined,
        name: undefined,
        email: undefined,
        image: undefined,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Anonymous User")).toBeInTheDocument();
      expect(screen.getByText("No email provided")).toBeInTheDocument();
    });

    it("handles very long user ID", () => {
      const user = {
        id: "user_123456789012345678901234567890",
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("user_123…7890")).toBeInTheDocument();
    });

    it("handles empty string values", () => {
      const user = {
        id: "",
        name: "",
        email: "",
        image: "",
      };

      render(<UserInformation user={user} />);

      expect(screen.getByText("Anonymous User")).toBeInTheDocument();
      expect(screen.getByText("No email provided")).toBeInTheDocument();
    });
  });
});
