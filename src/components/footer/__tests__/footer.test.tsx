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
  describe("Basic Rendering", () => {
    it("should render the footer section", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("section");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("py-8", "px-4", "md:px-6");
    });

    it("should render the logo and brand name", () => {
      render(<Footer />);

      expect(screen.getByTestId("logo")).toBeInTheDocument();
      expect(screen.getByText("NextRun.dev")).toBeInTheDocument();
    });

    it("should render the description text", () => {
      render(<Footer />);

      const description = screen.getByText(
        /A powerful Next.js template that comes pre-configured/,
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });
  });

  describe("Footer Sections", () => {
    it("should render all footer sections", () => {
      render(<Footer />);

      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(screen.getByText("Company")).toBeInTheDocument();
      expect(screen.getByText("Support")).toBeInTheDocument();
    });

    it("should render section links", () => {
      render(<Footer />);

      expect(screen.getByText("Pricing")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Help Center")).toBeInTheDocument();
    });

    it("should render internal links with Next.js Link component", () => {
      render(<Footer />);

      const pricingLink = screen.getByText("Pricing");
      expect(pricingLink.closest("a")).toHaveAttribute("href", "/pricing");

      const aboutLink = screen.getByText("About");
      expect(aboutLink.closest("a")).toHaveAttribute("href", "/about");
    });

    it("should render external links with proper attributes", () => {
      render(<Footer />);

      const helpCenterLink = screen.getByText("Help Center");
      expect(helpCenterLink.closest("a")).toHaveAttribute("href", "#");
    });
  });

  describe("Legal Links", () => {
    it("should render copyright notice with current year", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      const copyrightText = screen.getByText(
        `© ${currentYear} NextRun.dev. All rights reserved.`,
      );
      expect(copyrightText).toBeInTheDocument();
    });

    it("should render legal links", () => {
      render(<Footer />);

      expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });

    it("should render legal links with correct href attributes", () => {
      render(<Footer />);

      const termsLink = screen.getByText("Terms and Conditions");
      expect(termsLink.closest("a")).toHaveAttribute("href", "/terms");

      const privacyLink = screen.getByText("Privacy Policy");
      expect(privacyLink.closest("a")).toHaveAttribute("href", "/privacy");
    });
  });

  describe("Link Behavior", () => {
    it("should handle internal links correctly", () => {
      render(<Footer />);

      const internalLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href")?.startsWith("/"));

      internalLinks.forEach((link) => {
        expect(link).not.toHaveAttribute("target");
        expect(link).not.toHaveAttribute("rel");
      });
    });

    it("should handle external links with proper security attributes", () => {
      render(<Footer />);

      const externalLinks = screen.getAllByRole("link").filter((link) => {
        const href = link.getAttribute("href");
        return href && (href.startsWith("http") || href.startsWith("mailto:"));
      });

      externalLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("mailto:")) {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
      });
    });

    it("should handle mailto links without target and rel attributes", () => {
      render(<Footer />);

      const mailtoLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href")?.startsWith("mailto:"));

      mailtoLinks.forEach((link) => {
        expect(link).not.toHaveAttribute("target");
        expect(link).not.toHaveAttribute("rel");
      });
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should apply correct CSS classes to main container", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("section");
      expect(footer).toHaveClass("py-8", "px-4", "md:px-6");

      const innerContainer = footer?.querySelector(".container");
      expect(innerContainer).toHaveClass(
        "mx-auto",
        "max-w-screen-2xl",
        "gap-4",
      );
    });

    it("should apply correct CSS classes to brand section", () => {
      render(<Footer />);

      const brandSection = screen.getByText("NextRun.dev").closest("div");
      expect(brandSection).toHaveClass("flex", "items-center", "gap-2");

      const description = screen.getByText(
        /A powerful Next.js template that comes pre-configured/,
      );
      expect(description).toHaveClass(
        "text-muted-foreground",
        "max-w-[70%]",
        "text-sm",
      );
    });

    it("should apply correct CSS classes to footer sections", () => {
      render(<Footer />);

      const sectionTitles = screen.getAllByRole("heading", { level: 3 });
      sectionTitles.forEach((title) => {
        expect(title).toHaveClass("mb-4", "font-bold");
      });

      const sectionLists = screen
        .getAllByRole("list")
        .filter((list) =>
          list.className.includes("text-muted-foreground space-y-3 text-sm"),
        );
      sectionLists.forEach((list) => {
        expect(list).toHaveClass(
          "text-muted-foreground",
          "space-y-3",
          "text-sm",
        );
      });
    });

    it("should apply correct CSS classes to legal section", () => {
      render(<Footer />);

      const legalSection = screen
        .getByText(/© \d{4} NextRun.dev. All rights reserved./)
        .closest("div");

      expect(legalSection).toHaveClass(
        "text-muted-foreground",
        "mt-8",
        "flex",
        "flex-col",
        "justify-between",
        "gap-4",
        "border-t",
        "py-8",
        "text-xs",
        "font-medium",
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Footer />);

      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading).toHaveTextContent("NextRun.dev");

      const sectionHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(sectionHeadings).toHaveLength(3);
      expect(sectionHeadings[0]).toHaveTextContent("Product");
      expect(sectionHeadings[1]).toHaveTextContent("Company");
      expect(sectionHeadings[2]).toHaveTextContent("Support");
    });

    it("should have proper list structure", () => {
      render(<Footer />);

      const lists = screen.getAllByRole("list");
      expect(lists).toHaveLength(4);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });

    it("should have accessible link text", () => {
      render(<Footer />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.textContent?.trim()).not.toBe("");
        expect(link.textContent?.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive CSS classes", () => {
      render(<Footer />);

      const mainFlex = screen.getByText("NextRun.dev").closest("div")
        ?.parentElement?.parentElement;
      expect(mainFlex).toHaveClass(
        "flex",
        "w-full",
        "flex-col",
        "justify-between",
        "gap-10",
        "lg:flex-row",
        "lg:items-start",
        "lg:text-left",
      );

      const grid = screen.getByText("Product").closest("div")?.parentElement;
      expect(grid).toHaveClass(
        "grid",
        "w-full",
        "gap-6",
        "md:grid-cols-3",
        "lg:gap-20",
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty footer sections gracefully", () => {
      vi.doMock("../footer.constants", () => ({
        footerSections: [],
        footerLegalLinks: [],
      }));

      render(<Footer />);

      expect(screen.getByTestId("logo")).toBeInTheDocument();
      expect(screen.getByText("NextRun.dev")).toBeInTheDocument();
    });

    it("should handle special characters in link text", () => {
      render(<Footer />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.textContent).toBeTruthy();
      });
    });

    it("should handle long text content", () => {
      render(<Footer />);

      const description = screen.getByText(
        /A powerful Next.js template that comes pre-configured/,
      );
      expect(description).toBeInTheDocument();
      expect(description.textContent?.length).toBeGreaterThan(50);
    });
  });

  describe("Dynamic Content", () => {
    it("should display current year in copyright", () => {
      const mockDate = new Date("2024-01-01");
      vi.spyOn(global, "Date").mockImplementation(
        () => mockDate as unknown as Date,
      );

      render(<Footer />);

      expect(
        screen.getByText("© 2024 NextRun.dev. All rights reserved."),
      ).toBeInTheDocument();

      vi.restoreAllMocks();
    });

    it("should update year when component re-renders", () => {
      const { rerender } = render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(`© ${currentYear} NextRun.dev. All rights reserved.`),
      ).toBeInTheDocument();

      rerender(<Footer />);

      expect(
        screen.getByText(`© ${currentYear} NextRun.dev. All rights reserved.`),
      ).toBeInTheDocument();
    });
  });
});
