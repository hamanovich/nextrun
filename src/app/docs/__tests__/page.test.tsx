import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DocsPage from "../page";

vi.mock("../metadata", () => ({
  metadata: { title: "Documentation" },
}));

describe("Docs Page", () => {
  describe("Intro", () => {
    it("renders the main heading", () => {
      render(<DocsPage />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("NextRun documentation");
    });
  });

  describe("Sections", () => {
    it("renders every documentation section heading", () => {
      render(<DocsPage />);

      for (const name of [
        "Overview",
        "Quick start",
        "Environment variables",
        "Project structure",
        "What is included",
        "Scripts",
        "Deployment",
      ]) {
        expect(screen.getByRole("heading", { name })).toBeInTheDocument();
      }
    });

    it("documents required environment variables", () => {
      render(<DocsPage />);

      expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
      expect(screen.getByText("STRIPE_SECRET_KEY")).toBeInTheDocument();
    });
  });

  describe("Table of contents", () => {
    it("links each section in the on-page navigation", () => {
      render(<DocsPage />);

      const toc = screen.getByRole("navigation", { name: /on this page/i });
      const overview = within(toc).getByRole("link", { name: "Overview" });
      expect(overview).toHaveAttribute("href", "#overview");
    });
  });

  describe("References", () => {
    it("links to the full README on GitHub", () => {
      render(<DocsPage />);

      const readme = screen.getByRole("link", { name: /open the readme/i });
      expect(readme).toHaveAttribute(
        "href",
        "https://github.com/hamanovich/nextrun#readme",
      );
    });
  });
});
