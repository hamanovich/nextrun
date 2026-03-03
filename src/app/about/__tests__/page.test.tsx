import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import About from "../page";

vi.mock("lucide-react", () => ({
  Bot: () => <div data-testid="bot-icon">Bot Icon</div>,
  Code: () => <div data-testid="code-icon">Code Icon</div>,
  CreditCard: () => <div data-testid="credit-card-icon">CreditCard Icon</div>,
  Shield: () => <div data-testid="shield-icon">Shield Icon</div>,
  Target: () => <div data-testid="target-icon">Target Icon</div>,
  Users: () => <div data-testid="users-icon">Users Icon</div>,
  Zap: () => <div data-testid="zap-icon">Zap Icon</div>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

vi.mock("../metadata", () => ({
  metadata: { title: "About" },
}));

describe("About Page", () => {
  describe("Hero Section", () => {
    it("renders the page badge", () => {
      render(<About />);

      expect(screen.getByText("ABOUT NEXTRUN")).toBeInTheDocument();
    });

    it("renders the main heading", () => {
      render(<About />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Making Web Development");
      expect(heading).toHaveTextContent("Effortless");
    });

    it("renders the gradient text on the heading", () => {
      const { container } = render(<About />);

      const gradientSpan = container.querySelector(
        ".text-transparent.bg-clip-text",
      );
      expect(gradientSpan).toBeInTheDocument();
      expect(gradientSpan).toHaveTextContent("Effortless");
      expect(gradientSpan).toHaveClass(
        "from-teal-500",
        "via-indigo-500",
        "to-sky-500",
      );
    });

    it("renders the description mentioning Telegram bot integration", () => {
      render(<About />);

      const description = screen.getByText(/Telegram bot integration/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe("Mission & Vision", () => {
    it("renders the Our Mission heading", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Our Mission" }),
      ).toBeInTheDocument();
    });

    it("renders the Our Vision heading", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Our Vision" }),
      ).toBeInTheDocument();
    });

    it("renders Target icon for Mission", () => {
      render(<About />);

      expect(screen.getByTestId("target-icon")).toBeInTheDocument();
    });

    it("renders teal background on Mission icon", () => {
      const { container } = render(<About />);

      expect(container.querySelector(".bg-teal-500\\/10")).toBeInTheDocument();
    });
  });

  describe("Values Section", () => {
    it("renders the Our Values heading", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Our Values" }),
      ).toBeInTheDocument();
    });

    it("renders all three value headings", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Speed" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Developer Experience" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Security" }),
      ).toBeInTheDocument();
    });

    it("renders value icons", () => {
      render(<About />);

      expect(screen.getByTestId("zap-icon")).toBeInTheDocument();
      expect(screen.getByTestId("users-icon")).toBeInTheDocument();
      expect(screen.getAllByTestId("shield-icon").length).toBeGreaterThan(0);
    });

    it("renders colored icon backgrounds in values", () => {
      const { container } = render(<About />);

      expect(container.querySelector(".bg-amber-500\\/10")).toBeInTheDocument();
      expect(
        container.querySelector(".bg-violet-500\\/10"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".bg-indigo-500\\/10"),
      ).toBeInTheDocument();
    });
  });

  describe("Tech Stack Section", () => {
    it("renders the Built with Modern Technology heading", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Built with Modern Technology" }),
      ).toBeInTheDocument();
    });

    it("renders all tech stack items", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Next.js 16 + TypeScript" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Better Auth + Google OAuth" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Stripe Payments" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Telegram Bot & Automation" }),
      ).toBeInTheDocument();
    });

    it("renders the Telegram Bot description", () => {
      render(<About />);

      expect(screen.getByText(/Grammy/i)).toBeInTheDocument();
      expect(screen.getByText(/whitelist middleware/i)).toBeInTheDocument();
    });

    it("renders the bot icon", () => {
      render(<About />);

      expect(screen.getByTestId("bot-icon")).toBeInTheDocument();
    });

    it("renders sky-colored background on Telegram Bot icon", () => {
      const { container } = render(<About />);

      expect(container.querySelector(".bg-sky-500\\/10")).toBeInTheDocument();
    });
  });

  describe("CTA Section", () => {
    it("renders the Ready to Start Building heading", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Ready to Start Building?" }),
      ).toBeInTheDocument();
    });

    it("renders the View Pricing link with correct href", () => {
      render(<About />);

      const link = screen.getByRole("link", { name: /view pricing/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/pricing");
    });

    it("renders the Get Started link", () => {
      render(<About />);

      const link = screen.getByRole("link", { name: /get started/i });
      expect(link).toBeInTheDocument();
    });
  });
});
