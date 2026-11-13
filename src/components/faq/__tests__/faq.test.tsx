import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from "../faq";
import {
  customProps,
  emptyFaqs,
  faqsWithReactNode,
  longFaqs,
  mockFaqs,
  reactNodeProps,
  specialFaqs,
} from "./faq.mock";

describe("FAQ", () => {
  it("renders a named section with closed, keyboard-operable questions", async () => {
    const user = userEvent.setup();
    render(<Faq faqs={mockFaqs} />);
    expect(
      screen.getByRole("region", { name: "Frequently Asked Questions" }),
    ).toBeInTheDocument();
    const question = screen.getByRole("button", { name: mockFaqs[0].question });
    expect(question).toHaveAttribute("aria-expanded", "false");
    question.focus();
    await user.keyboard("{Enter}");
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(String(mockFaqs[0].answer))).toBeVisible();
    await user.keyboard("{Enter}");
    expect(question).toHaveAttribute("aria-expanded", "false");
  });
  it("allows multiple answers to remain open", async () => {
    const user = userEvent.setup();
    render(<Faq faqs={mockFaqs} />);
    for (const faq of mockFaqs.slice(0, 2))
      await user.click(screen.getByRole("button", { name: faq.question }));
    for (const faq of mockFaqs.slice(0, 2))
      expect(screen.getByText(String(faq.answer))).toBeVisible();
  });
  it("preserves links in rich answers", async () => {
    const user = userEvent.setup();
    render(<Faq faqs={faqsWithReactNode} />);
    await user.click(
      screen.getByRole("button", { name: faqsWithReactNode[0].question }),
    );
    expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute(
      "href",
      "/docs",
    );
  });
  it("keeps structured answers available without opening a row", () => {
    const { container } = render(<Faq faqs={mockFaqs} />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!
        .textContent!,
    );
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(mockFaqs.length);
    expect(data.mainEntity[0].acceptedAnswer.text).toBe(mockFaqs[0].answer);
  });
  it("supports an empty collection", () => {
    render(<Faq faqs={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it.each([{ faqs: specialFaqs }, { faqs: longFaqs }])(
    "preserves long and special-character answers",
    async ({ faqs }) => {
      const user = userEvent.setup();
      const { container } = render(<Faq faqs={faqs} />);
      await user.click(screen.getByRole("button", { name: faqs[0].question }));
      expect(container).toHaveTextContent(String(faqs[0].answer));
    },
  );
  it("supports custom text headings", () => {
    render(<Faq {...customProps} />);
    expect(
      screen.getByRole("region", { name: customProps.heading }),
    ).toBeInTheDocument();
  });
  it("supports rich heading content", () => {
    render(<Faq {...reactNodeProps} />);
    expect(screen.getByTestId("custom-heading")).toBeInTheDocument();
    expect(screen.getByTestId("custom-description")).toBeInTheDocument();
  });
  it("renders valid questions alongside empty content", () => {
    render(<Faq faqs={emptyFaqs} />);
    expect(
      screen.getByRole("button", { name: "Valid question" }),
    ).toBeInTheDocument();
  });
});
