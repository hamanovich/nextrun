import { describe, expect, it } from "vitest";
import {
  formatUserData,
  getCreditsStatus,
  getProviderFromEmail,
  hasStripeData,
} from "../user.utils";

describe("User Utils", () => {
  describe("getProviderFromEmail", () => {
    it("returns Google for Gmail addresses", () => {
      expect(getProviderFromEmail("user@gmail.com")).toBe("Google");
      expect(getProviderFromEmail("test.user@gmail.com")).toBe("Google");
    });

    it("returns Microsoft for Outlook addresses", () => {
      expect(getProviderFromEmail("user@outlook.com")).toBe("Microsoft");
      expect(getProviderFromEmail("test.user@outlook.com")).toBe("Microsoft");
    });

    it("returns Microsoft for Hotmail addresses", () => {
      expect(getProviderFromEmail("user@hotmail.com")).toBe("Microsoft");
      expect(getProviderFromEmail("test.user@hotmail.com")).toBe("Microsoft");
    });

    it("returns Yahoo for Yahoo addresses", () => {
      expect(getProviderFromEmail("user@yahoo.com")).toBe("Yahoo");
      expect(getProviderFromEmail("test.user@yahoo.com")).toBe("Yahoo");
    });

    it("returns Email for other addresses", () => {
      expect(getProviderFromEmail("user@example.com")).toBe("Email");
      expect(getProviderFromEmail("user@company.org")).toBe("Email");
      expect(getProviderFromEmail("user@domain.net")).toBe("Email");
    });

    it("returns Unknown for null email", () => {
      expect(getProviderFromEmail(null)).toBe("Unknown");
    });

    it("returns Unknown for undefined email", () => {
      expect(getProviderFromEmail(undefined)).toBe("Unknown");
    });

    it("returns Unknown for empty string", () => {
      expect(getProviderFromEmail("")).toBe("Unknown");
    });
  });

  describe("formatUserData", () => {
    it("formats data with default truncation", () => {
      expect(formatUserData("user_1234567890")).toBe("user_123…7890");
      expect(formatUserData("cus_abcdefghijklmnop")).toBe("cus_abcd…mnop");
    });

    it("formats data with custom noData message", () => {
      expect(formatUserData("user_1234567890", "Not available")).toBe(
        "user_123…7890",
      );
      expect(formatUserData(null, "Not available")).toBe("Not available");
      expect(formatUserData(undefined, "Not available")).toBe("Not available");
    });

    it("handles short data strings", () => {
      expect(formatUserData("short")).toBe("short…hort");
      expect(formatUserData("a")).toBe("a…a");
    });

    it("handles very short data strings", () => {
      expect(formatUserData("ab")).toBe("ab…ab");
      expect(formatUserData("abc")).toBe("abc…abc");
    });

    it("handles exactly 8 character strings", () => {
      expect(formatUserData("12345678")).toBe("12345678…5678");
    });

    it("handles exactly 9 character strings", () => {
      expect(formatUserData("123456789")).toBe("12345678…6789");
    });

    it("handles null and undefined", () => {
      expect(formatUserData(null)).toBe("Not available");
      expect(formatUserData(undefined)).toBe("Not available");
    });

    it("handles empty string", () => {
      expect(formatUserData("")).toBe("Not available");
    });
  });

  describe("getCreditsStatus", () => {
    it("returns empty status for zero credits", () => {
      const result = getCreditsStatus(0);
      expect(result.status).toBe("empty");
      expect(result.color).toBe("text-red-600");
      expect(result.bg).toBe("bg-red-50 dark:bg-red-950/20");
      expect(result.border).toBe("border-red-200 dark:border-red-800");
    });

    it("returns low status for credits less than 10", () => {
      const result = getCreditsStatus(5);
      expect(result.status).toBe("low");
      expect(result.color).toBe("text-yellow-600");
      expect(result.bg).toBe("bg-yellow-50 dark:bg-yellow-950/20");
      expect(result.border).toBe("border-yellow-200 dark:border-yellow-800");
    });

    it("returns low status for 9 credits", () => {
      const result = getCreditsStatus(9);
      expect(result.status).toBe("low");
      expect(result.color).toBe("text-yellow-600");
    });

    it("returns good status for 10 or more credits", () => {
      const result = getCreditsStatus(10);
      expect(result.status).toBe("good");
      expect(result.color).toBe("text-green-600");
      expect(result.bg).toBe("bg-green-50 dark:bg-green-950/20");
      expect(result.border).toBe("border-green-200 dark:border-green-800");
    });

    it("returns good status for high credit amounts", () => {
      const result = getCreditsStatus(100);
      expect(result.status).toBe("good");
      expect(result.color).toBe("text-green-600");
    });

    it("handles negative credits as low status", () => {
      const result = getCreditsStatus(-5);
      expect(result.status).toBe("low");
      expect(result.color).toBe("text-yellow-600");
    });

    it("handles very large credit amounts", () => {
      const result = getCreditsStatus(999999);
      expect(result.status).toBe("good");
      expect(result.color).toBe("text-green-600");
    });
  });

  describe("hasStripeData", () => {
    it("returns true for user with stripeCredits", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_123",
        stripeCheckoutSessionId: "cs_123",
      };
      expect(hasStripeData(user)).toBe(true);
    });

    it("returns true for user with zero stripeCredits", () => {
      const user = {
        stripeCredits: 0,
        stripeCustomerId: null,
        stripeCheckoutSessionId: null,
      };
      expect(hasStripeData(user)).toBe(true);
    });

    it("returns true for user with negative stripeCredits", () => {
      const user = {
        stripeCredits: -5,
        stripeCustomerId: "cus_123",
        stripeCheckoutSessionId: "cs_123",
      };
      expect(hasStripeData(user)).toBe(true);
    });

    it("returns false for user without stripeCredits", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
      };
      expect(hasStripeData(user)).toBe(false);
    });

    it("returns false for null user", () => {
      expect(hasStripeData(null)).toBe(false);
    });

    it("returns false for undefined user", () => {
      expect(hasStripeData(undefined)).toBe(false);
    });

    it("returns false for non-object user", () => {
      expect(hasStripeData("string")).toBe(false);
      expect(hasStripeData(123)).toBe(false);
      expect(hasStripeData(true)).toBe(false);
    });

    it("returns false for empty object", () => {
      expect(hasStripeData({})).toBe(false);
    });

    it("returns false for object with other properties but no stripeCredits", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        stripeCustomerId: "cus_123",
        stripeCheckoutSessionId: "cs_123",
      };
      expect(hasStripeData(user)).toBe(false);
    });

    it("returns true for object with stripeCredits and other properties", () => {
      const user = {
        id: "user_123",
        name: "John Doe",
        email: "john@example.com",
        stripeCredits: 50,
        stripeCustomerId: "cus_123",
        stripeCheckoutSessionId: "cs_123",
      };
      expect(hasStripeData(user)).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles very long email addresses", () => {
      const longEmail =
        "very.long.email.address.that.might.cause.issues@gmail.com";
      expect(getProviderFromEmail(longEmail)).toBe("Google");
    });

    it("handles email addresses with special characters", () => {
      expect(getProviderFromEmail("user+tag@gmail.com")).toBe("Google");
      expect(getProviderFromEmail("user.name@outlook.com")).toBe("Microsoft");
    });

    it("handles case sensitivity in email addresses", () => {
      expect(getProviderFromEmail("USER@GMAIL.COM")).toBe("Email");
      expect(getProviderFromEmail("User@Outlook.Com")).toBe("Email");
    });

    it("handles malformed email addresses", () => {
      expect(getProviderFromEmail("notanemail")).toBe("Email");
      expect(getProviderFromEmail("@gmail.com")).toBe("Google");
      expect(getProviderFromEmail("user@")).toBe("Email");
    });

    it("handles very long data strings in formatUserData", () => {
      const longString = "a".repeat(1000);
      const result = formatUserData(longString);
      expect(result).toBe("aaaaaaaa…aaaa");
    });

    it("handles special characters in formatUserData", () => {
      expect(formatUserData("user_123!@#$%^&*()")).toBe("user_123…&*()");
    });

    it("handles unicode characters in formatUserData", () => {
      expect(formatUserData("用户_1234567890")).toBe("用户_12345…7890");
    });
  });
});
