import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "../hero";

describe("Hero", () => {
  describe("Content", () => {
    it("renders the heading and subtext", () => {
      render(<Hero />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Skip the setup. Ship the product.",
      );
      expect(
        screen.getByText(/Clone NextRun and build the part that matters/),
      ).toBeInTheDocument();
    });
  });

  describe("Calls to action", () => {
    it("renders the primary and secondary links with correct hrefs", () => {
      render(<Hero />);

      expect(
        screen.getByRole("link", { name: /get started/i }),
      ).toHaveAttribute("href", "/pricing");
      expect(screen.getByRole("link", { name: /learn more/i })).toHaveAttribute(
        "href",
        "/about",
      );
    });

    it("gives every link non-empty text", () => {
      render(<Hero />);

      screen.getAllByRole("link").forEach((link) => {
        expect(link.textContent?.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe("Install commands", () => {
    it("renders the clone and install commands", () => {
      render(<Hero />);

      expect(
        screen.getByText("git clone https://github.com/hamanovich/nextrun"),
      ).toBeInTheDocument();
      expect(screen.getByText("bun install")).toBeInTheDocument();
    });

    it("exposes a copy button for the commands", () => {
      render(<Hero />);

      expect(
        screen.getByRole("button", { name: /copy commands/i }),
      ).toBeInTheDocument();
    });
  });
});
