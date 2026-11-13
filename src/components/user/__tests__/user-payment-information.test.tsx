import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UserPaymentInformation } from "../user-payment-information";

const user = {
  stripeCredits: 25,
  stripeCustomerId: "cus_synthetic_example",
  stripeCheckoutSessionId: "cs_synthetic_example",
};

describe("UserPaymentInformation", () => {
  it("does not invent billing data for an account without it", () => {
    const { container } = render(<UserPaymentInformation user={{}} />);
    expect(container).toBeEmptyDOMElement();
  });
  it.each([
    [25, "Credits available for use"],
    [5, "Low credit balance"],
    [0, "No credits remaining"],
  ])("shows the supplied balance %s and its status", (credits, description) => {
    render(
      <UserPaymentInformation user={{ ...user, stripeCredits: credits }} />,
    );
    expect(screen.getByText(String(credits))).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buy credits" })).toHaveAttribute(
      "href",
      "/pricing",
    );
  });
  it("keeps billing references behind an accessible disclosure", async () => {
    const interaction = userEvent.setup();
    render(<UserPaymentInformation user={user} />);
    const trigger = screen.getByRole("button", { name: "Billing details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(user.stripeCustomerId)).not.toBeInTheDocument();
    await interaction.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(user.stripeCustomerId)).toBeInTheDocument();
    expect(screen.getByText(user.stripeCheckoutSessionId)).toBeInTheDocument();
    await interaction.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("explains missing billing references without fake identifiers", async () => {
    const interaction = userEvent.setup();
    render(<UserPaymentInformation user={{ stripeCredits: 0 }} />);
    await interaction.click(
      screen.getByRole("button", { name: "Billing details" }),
    );
    expect(screen.getByText("Not created")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
  });
});
