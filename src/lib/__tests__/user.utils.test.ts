import { describe, expect, it } from "vitest";
import {
  formatUserData,
  getCreditsStatus,
  getProviderFromEmail,
  hasStripeData,
} from "../user.utils";

describe("user.utils", () => {
  describe("getProviderFromEmail", () => {
    it("should return Google for Gmail addresses", () => {
      expect(getProviderFromEmail("user@gmail.com")).toBe("Google");
      expect(getProviderFromEmail("test.user@gmail.com")).toBe("Google");
    });

    it("should return Microsoft for Outlook and Hotmail addresses", () => {
      expect(getProviderFromEmail("user@outlook.com")).toBe("Microsoft");
      expect(getProviderFromEmail("user@hotmail.com")).toBe("Microsoft");
      expect(getProviderFromEmail("test@outlook.com")).toBe("Microsoft");
      expect(getProviderFromEmail("test@hotmail.com")).toBe("Microsoft");
    });

    it("should return Yahoo for Yahoo addresses", () => {
      expect(getProviderFromEmail("user@yahoo.com")).toBe("Yahoo");
      expect(getProviderFromEmail("test.user@yahoo.com")).toBe("Yahoo");
    });

    it("should return Email for other email providers", () => {
      expect(getProviderFromEmail("user@example.com")).toBe("Email");
      expect(getProviderFromEmail("user@company.org")).toBe("Email");
      expect(getProviderFromEmail("user@custom.domain")).toBe("Email");
    });

    it("should return Unknown for null/undefined/empty values", () => {
      expect(getProviderFromEmail(null)).toBe("Unknown");
      expect(getProviderFromEmail(undefined)).toBe("Unknown");
      expect(getProviderFromEmail("")).toBe("Unknown");
    });
  });

  describe("formatUserData", () => {
    it("should format data with ellipsis for long strings", () => {
      expect(formatUserData("12345678901234567890")).toBe("12345678…7890");
      expect(formatUserData("abcdefghijklmnopqrstuvwxyz")).toBe(
        "abcdefgh…wxyz",
      );
    });

    it("should handle short strings", () => {
      expect(formatUserData("12345678")).toBe("12345678…5678");
      expect(formatUserData("1234")).toBe("1234…1234");
    });

    it("should return default message for null/undefined/empty values", () => {
      expect(formatUserData(null)).toBe("Not available");
      expect(formatUserData(undefined)).toBe("Not available");
      expect(formatUserData("")).toBe("Not available");
    });

    it("should use custom noData message", () => {
      expect(formatUserData(null, "No data")).toBe("No data");
      expect(formatUserData(undefined, "Custom message")).toBe(
        "Custom message",
      );
      expect(formatUserData("", "Empty")).toBe("Empty");
    });
  });

  describe("getCreditsStatus", () => {
    it("should return empty status for 0 credits", () => {
      const result = getCreditsStatus(0);
      expect(result).toEqual({
        status: "empty",
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-950/20",
        border: "border-red-200 dark:border-red-800",
      });
    });

    it("should return low status for credits less than 10", () => {
      const result1 = getCreditsStatus(1);
      expect(result1).toEqual({
        status: "low",
        color: "text-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-200 dark:border-yellow-800",
      });

      const result2 = getCreditsStatus(9);
      expect(result2).toEqual({
        status: "low",
        color: "text-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-200 dark:border-yellow-800",
      });
    });

    it("should return good status for 10 or more credits", () => {
      const result1 = getCreditsStatus(10);
      expect(result1).toEqual({
        status: "good",
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950/20",
        border: "border-green-200 dark:border-green-800",
      });

      const result2 = getCreditsStatus(100);
      expect(result2).toEqual({
        status: "good",
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950/20",
        border: "border-green-200 dark:border-green-800",
      });
    });
  });

  describe("hasStripeData", () => {
    it("should return true for objects with stripeCredits property", () => {
      const userWithStripeData = {
        stripeCredits: 10,
        stripeCustomerId: "cus_123",
        stripeCheckoutSessionId: "cs_123",
      };
      expect(hasStripeData(userWithStripeData)).toBe(true);
    });

    it("should return true for objects with stripeCredits even if other properties are missing", () => {
      const userWithMinimalStripeData = {
        stripeCredits: 5,
      };
      expect(hasStripeData(userWithMinimalStripeData)).toBe(true);
    });

    it("should return false for null", () => {
      expect(hasStripeData(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(hasStripeData(undefined)).toBe(false);
    });

    it("should return false for objects without stripeCredits", () => {
      const userWithoutStripeData = {
        name: "John",
        email: "john@example.com",
      };
      expect(hasStripeData(userWithoutStripeData)).toBe(false);
    });

    it("should return false for primitive values", () => {
      expect(hasStripeData("string")).toBe(false);
      expect(hasStripeData(123)).toBe(false);
      expect(hasStripeData(true)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(hasStripeData([])).toBe(false);
      expect(hasStripeData([1, 2, 3])).toBe(false);
    });
  });
});
