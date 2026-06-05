import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "../footer";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/navbar/logo", () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

describe("Footer Component", () => {
  describe("Branding", () => {
    it("renders the footer landmark", () => {
      render(<Footer />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the logo and brand name", () => {
      render(<Footer />);

      expect(screen.getByTestId("logo")).toBeInTheDocument();
      expect(screen.getByText("NextRun.dev")).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      render(<Footer />);

      expect(
        screen.getByText(/A production-ready Next.js starter/),
      ).toBeInTheDocument();
    });
  });

  describe("Sections and links", () => {
    it("renders all section titles", () => {
      render(<Footer />);

      expect(
        screen.getByRole("heading", { name: "Product" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Company" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Resources" }),
      ).toBeInTheDocument();
    });

    it("renders internal links without target/rel", () => {
      render(<Footer />);

      const pricing = screen.getByRole("link", { name: "Pricing" });
      expect(pricing).toHaveAttribute("href", "/pricing");
      expect(pricing).not.toHaveAttribute("target");
      expect(pricing).not.toHaveAttribute("rel");

      const about = screen.getByRole("link", { name: "About" });
      expect(about).toHaveAttribute("href", "/about");
    });

    it("renders external links with security attributes", () => {
      render(<Footer />);

      const github = screen.getByRole("link", { name: "GitHub" });
      expect(github).toHaveAttribute(
        "href",
        "https://github.com/hamanovich/nextrun",
      );
      expect(github).toHaveAttribute("target", "_blank");
      expect(github).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Legal", () => {
    it("renders the copyright with the current year", () => {
      render(<Footer />);

      const year = new Date().getFullYear();
      expect(
        screen.getByText(`© ${year} NextRun.dev. All rights reserved.`),
      ).toBeInTheDocument();
    });

    it("renders legal links with correct hrefs", () => {
      render(<Footer />);

      expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
        "href",
        "/terms",
      );
      expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
        "href",
        "/privacy",
      );
    });
  });

  describe("Accessibility", () => {
    it("gives every link non-empty text", () => {
      render(<Footer />);

      screen.getAllByRole("link").forEach((link) => {
        expect(link.textContent?.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
