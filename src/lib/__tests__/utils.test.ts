import { describe, expect, it, vi } from "vitest";
import { cn, formatMoney } from "../utils";

// Helper function to create a mock NumberFormat constructor
const createMockNumberFormat = (shouldThrow = false) => {
  const mockConstructor = vi.fn().mockImplementation(() => {
    if (shouldThrow) {
      throw new Error("Invalid currency");
    }
    return {
      format: vi.fn().mockReturnValue("$10.00"),
    };
  });

  // Add the required static method
  Object.assign(mockConstructor, {
    supportedLocalesOf: vi.fn(),
  });

  return mockConstructor as unknown as typeof Intl.NumberFormat;
};

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });

    it("should handle conditional classes", () => {
      expect(cn("px-2", true && "py-1", false && "bg-red-500")).toBe(
        "px-2 py-1",
      );
    });

    it("should handle undefined and null values", () => {
      expect(cn("px-2", undefined, null, "py-1")).toBe("px-2 py-1");
    });

    it("should handle empty strings", () => {
      expect(cn("px-2", "", "py-1")).toBe("px-2 py-1");
    });

    it("should handle arrays of classes", () => {
      expect(cn(["px-2", "py-1"], "bg-blue-500")).toBe("px-2 py-1 bg-blue-500");
    });

    it("should handle objects with boolean values", () => {
      expect(
        cn({
          "px-2": true,
          "py-1": false,
          "bg-red-500": true,
        }),
      ).toBe("px-2 bg-red-500");
    });

    it("should handle mixed input types", () => {
      expect(
        cn(
          "px-2",
          ["py-1", "text-sm"],
          {
            "bg-blue-500": true,
            "bg-red-500": false,
          },
          "font-bold",
        ),
      ).toBe("px-2 py-1 text-sm bg-blue-500 font-bold");
    });

    it("should handle no arguments", () => {
      expect(cn()).toBe("");
    });

    it("should handle only falsy values", () => {
      expect(cn(false, null, undefined, "")).toBe("");
    });

    it("should merge conflicting Tailwind classes correctly", () => {
      // Test that tailwind-merge works correctly
      expect(cn("px-2 px-4")).toBe("px-4");
      expect(cn("text-sm text-lg")).toBe("text-lg");
      expect(cn("bg-red-500 bg-blue-500")).toBe("bg-blue-500");
    });
  });

  describe("formatMoney", () => {
    it("should format USD currency correctly", () => {
      expect(formatMoney(1000, "usd")).toBe("$10.00");
      expect(formatMoney(2500, "USD")).toBe("$25.00");
      expect(formatMoney(0, "usd")).toBe("$0.00");
    });

    it("should format EUR currency correctly", () => {
      expect(formatMoney(1000, "eur")).toBe("€10.00");
      expect(formatMoney(2500, "EUR")).toBe("€25.00");
    });

    it("should format GBP currency correctly", () => {
      expect(formatMoney(1000, "gbp")).toBe("£10.00");
      expect(formatMoney(2500, "GBP")).toBe("£25.00");
    });

    it("should handle decimal amounts correctly", () => {
      expect(formatMoney(1234, "usd")).toBe("$12.34");
      expect(formatMoney(999, "usd")).toBe("$9.99");
      expect(formatMoney(1, "usd")).toBe("$0.01");
    });

    it("should handle large amounts", () => {
      expect(formatMoney(100000, "usd")).toBe("$1,000.00");
      expect(formatMoney(1000000, "usd")).toBe("$10,000.00");
    });

    it("should return '—' when amount is null", () => {
      expect(formatMoney(null, "usd")).toBe("—");
    });

    it("should return '—' when amount is undefined", () => {
      expect(formatMoney(undefined, "usd")).toBe("—");
    });

    it("should return '—' when currency is null", () => {
      expect(formatMoney(1000, null)).toBe("—");
    });

    it("should return '—' when currency is undefined", () => {
      expect(formatMoney(1000, undefined)).toBe("—");
    });

    it("should return '—' when both amount and currency are null", () => {
      expect(formatMoney(null, null)).toBe("—");
    });

    it("should return '—' when both amount and currency are undefined", () => {
      expect(formatMoney(undefined, undefined)).toBe("—");
    });

    it("should handle invalid currency codes gracefully", () => {
      // Mock Intl.NumberFormat to throw an error
      const originalIntl = global.Intl;
      global.Intl = {
        ...originalIntl,
        NumberFormat: createMockNumberFormat(true),
      };

      expect(formatMoney(1000, "invalid")).toBe("10.00 INVALID");

      // Restore original Intl
      global.Intl = originalIntl;
    });

    it("should fallback to simple format when Intl.NumberFormat fails", () => {
      // Mock Intl.NumberFormat to throw an error
      const originalIntl = global.Intl;
      global.Intl = {
        ...originalIntl,
        NumberFormat: createMockNumberFormat(true),
      };

      expect(formatMoney(1234, "xyz")).toBe("12.34 XYZ");
      expect(formatMoney(0, "abc")).toBe("0.00 ABC");

      // Restore original Intl
      global.Intl = originalIntl;
    });

    it("should handle zero amount", () => {
      expect(formatMoney(0, "usd")).toBe("$0.00");
    });

    it("should handle negative amounts", () => {
      expect(formatMoney(-1000, "usd")).toBe("-$10.00");
      expect(formatMoney(-2500, "usd")).toBe("-$25.00");
    });

    it("should convert currency to uppercase in fallback", () => {
      // Mock Intl.NumberFormat to throw an error
      const originalIntl = global.Intl;
      global.Intl = {
        ...originalIntl,
        NumberFormat: createMockNumberFormat(true),
      };

      expect(formatMoney(1000, "usd")).toBe("10.00 USD");
      expect(formatMoney(1000, "eur")).toBe("10.00 EUR");

      // Restore original Intl
      global.Intl = originalIntl;
    });

    it("should handle empty string currency", () => {
      expect(formatMoney(1000, "")).toBe("—");
    });

    it("should handle various international currencies", () => {
      // Test with different locales/currencies that might be supported
      expect(formatMoney(1000, "jpy")).toBe("¥10");
      expect(formatMoney(1000, "cad")).toBe("CA$10.00");
    });
  });
});
