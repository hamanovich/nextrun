import { describe, expect, it } from "vitest";
import { secretEquals } from "@/lib/secret-equals";

describe("secretEquals", () => {
  it("accepts an identical secret", () => {
    expect(secretEquals("Bearer abc", "Bearer abc")).toBe(true);
  });

  it("rejects a different secret of any length", () => {
    expect(secretEquals("Bearer abd", "Bearer abc")).toBe(false);
    expect(secretEquals("Bearer abcdef", "Bearer abc")).toBe(false);
  });

  it("rejects a missing header", () => {
    expect(secretEquals(null, "Bearer abc")).toBe(false);
  });
});
