import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CodeCopyButton } from "../code-copy-button";

describe("CodeCopyButton", () => {
  it("copies the exact source and announces success", async () => {
    const user = userEvent.setup();
    const write = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: write },
    });
    render(<CodeCopyButton code={"bun install\nbun dev"} />);
    await user.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    expect(write).toHaveBeenCalledWith("bun install\nbun dev");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
  it("keeps the code accessible when clipboard access is denied", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
    });
    render(<CodeCopyButton code="example" />);
    await user.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Could not copy. Select the code instead.",
    );
  });
});
