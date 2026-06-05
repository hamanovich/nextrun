import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import About from "../page";

vi.mock("lucide-react", () => ({
  ArrowRight: () => <span data-testid="arrow-icon" />,
  Check: () => <span data-testid="check-icon" />,
  Code: () => <span data-testid="code-icon" />,
  Eye: () => <span data-testid="eye-icon" />,
  ShieldCheck: () => <span data-testid="shield-icon" />,
  Target: () => <span data-testid="target-icon" />,
  Zap: () => <span data-testid="zap-icon" />,
}));

vi.mock("../metadata", () => ({
  metadata: { title: "About" },
}));

describe("About Page", () => {
  describe("Intro", () => {
    it("renders the main heading", () => {
      render(<About />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("A starter that gets out of your way");
    });

    it("mentions the Telegram bot integration", () => {
      render(<About />);

      expect(screen.getByText(/Telegram bot/i)).toBeInTheDocument();
    });
  });

  describe("Mission & Vision", () => {
    it("renders the mission and vision headings", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "Our mission" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Our vision" }),
      ).toBeInTheDocument();
    });
  });

  describe("Values", () => {
    it("renders the values heading and all three values", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", { name: "What we value" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Speed" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Developer experience" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Security" }),
      ).toBeInTheDocument();
    });
  });

  describe("Call to action", () => {
    it("renders the shared CallToAction with a primary link to pricing", () => {
      render(<About />);

      expect(
        screen.getByRole("heading", {
          name: /ready to launch your next project/i,
        }),
      ).toBeInTheDocument();

      const cta = screen.getByRole("link", { name: /get started/i });
      expect(cta).toHaveAttribute("href", "/pricing");
    });
  });
});
