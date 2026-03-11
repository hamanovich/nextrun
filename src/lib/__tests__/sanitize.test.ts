import { describe, expect, it } from "vitest";
import {
  sanitizeFormInput,
  sanitizeJsonLd,
  sanitizePreContent,
  sanitizeText,
  sanitizeUrl,
  validateAndSanitize,
} from "../sanitize";

describe("sanitize", () => {
  describe("sanitizeText", () => {
    it("should escape HTML characters", () => {
      const input = "<script>alert('xss')</script>";
      const result = sanitizeText(input);
      expect(result).toBe(
        "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;",
      );
    });

    it("should escape all dangerous characters", () => {
      const input = "&<>\"'/";
      const result = sanitizeText(input);
      expect(result).toBe("&amp;&lt;&gt;&quot;&#x27;&#x2F;");
    });

    it("should handle empty string", () => {
      expect(sanitizeText("")).toBe("");
    });

    it("should preserve safe text", () => {
      const input = "Hello world!";
      const result = sanitizeText(input);
      expect(result).toBe("Hello world!");
    });
  });

  describe("sanitizeJsonLd", () => {
    it("should escape angle brackets in JSON-LD", () => {
      const input = { content: "<script>alert('xss')</script>" };
      const result = sanitizeJsonLd(input);
      expect(result).toContain("\\u003cscript>");
      expect(result).toContain("\\u003c/script>");
    });

    it("should escape line separators", () => {
      const input = { content: "Line 1\u2028Line 2\u2029Line 3" };
      const result = sanitizeJsonLd(input);
      expect(result).toContain("\\u2028");
      expect(result).toContain("\\u2029");
    });

    it("should handle simple objects", () => {
      const input = { name: "Test", value: 123 };
      const result = sanitizeJsonLd(input);
      expect(result).toBe('{"name":"Test","value":123}');
    });

    it("should handle arrays", () => {
      const input = [1, 2, 3];
      const result = sanitizeJsonLd(input);
      expect(result).toBe("[1,2,3]");
    });
  });

  describe("sanitizeFormInput", () => {
    it("should remove angle brackets", () => {
      const input = "<script>alert('xss')</script>";
      const result = sanitizeFormInput(input);
      expect(result).toBe("scriptalert('xss')/script");
    });

    it("should remove javascript: protocol", () => {
      const input = "javascript:alert('xss')";
      const result = sanitizeFormInput(input);
      expect(result).toBe("alert('xss')");
    });

    it("should remove event handlers", () => {
      const input = "onclick=alert('xss') onload=malicious()";
      const result = sanitizeFormInput(input);
      expect(result).toBe("alert('xss') malicious()");
    });

    it("should trim whitespace", () => {
      const input = "  hello world  ";
      const result = sanitizeFormInput(input);
      expect(result).toBe("hello world");
    });

    it("should limit length to 500 characters", () => {
      const input = "a".repeat(600);
      const result = sanitizeFormInput(input);
      expect(result).toHaveLength(500);
    });

    it("should handle empty string", () => {
      expect(sanitizeFormInput("")).toBe("");
    });
  });

  describe("sanitizeUrl", () => {
    it("should allow valid HTTP URLs", () => {
      const input = "https://example.com";
      const result = sanitizeUrl(input);
      expect(result).toBe("https://example.com/");
    });

    it("should allow valid HTTPS URLs", () => {
      const input = "https://example.com/path?query=value";
      const result = sanitizeUrl(input);
      expect(result).toBe("https://example.com/path?query=value");
    });

    it("should reject javascript: URLs", () => {
      const input = "javascript:alert('xss')";
      const result = sanitizeUrl(input);
      expect(result).toBe("");
    });

    it("should reject data: URLs", () => {
      const input = "data:text/html,<script>alert('xss')</script>";
      const result = sanitizeUrl(input);
      expect(result).toBe("");
    });

    it("should reject non-HTTP protocols", () => {
      const input = "ftp://example.com";
      const result = sanitizeUrl(input);
      expect(result).toBe("");
    });

    it("should handle invalid URLs", () => {
      const input = "not-a-url";
      const result = sanitizeUrl(input);
      expect(result).toBe("");
    });

    it("should handle empty string", () => {
      expect(sanitizeUrl("")).toBe("");
    });
  });

  describe("sanitizePreContent", () => {
    it("should escape HTML characters for pre content", () => {
      const input = "<script>alert('xss')</script>";
      const result = sanitizePreContent(input);
      expect(result).toBe("&lt;script&gt;alert('xss')&lt;/script&gt;");
    });

    it("should escape ampersands", () => {
      const input = "A & B";
      const result = sanitizePreContent(input);
      expect(result).toBe("A &amp; B");
    });

    it("should handle empty string", () => {
      expect(sanitizePreContent("")).toBe("");
    });
  });

  describe("validateAndSanitize", () => {
    it("should return empty string for null/undefined input", () => {
      expect(validateAndSanitize(null as unknown as string, "text")).toBe("");
      expect(validateAndSanitize(undefined as unknown as string, "text")).toBe(
        "",
      );
    });

    it("should return empty string for non-string input", () => {
      expect(validateAndSanitize(123 as unknown as string, "text")).toBe("");
      expect(validateAndSanitize({} as unknown as string, "text")).toBe("");
    });

    it("should sanitize text type", () => {
      const input = "<script>alert('xss')</script>";
      const result = validateAndSanitize(input, "text");
      expect(result).toBe(
        "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;",
      );
    });

    it("should sanitize json-ld type", () => {
      const input = '{"content": "<script>alert(\'xss\')</script>"}';
      const result = validateAndSanitize(input, "json-ld");
      expect(result).toContain("\\u003cscript>");
      expect(result).toContain("\\u003c/script>");
    });

    it("should sanitize form type", () => {
      const input = "<script>alert('xss')</script>";
      const result = validateAndSanitize(input, "form");
      expect(result).toBe("scriptalert('xss')/script");
    });

    it("should sanitize url type", () => {
      const input = "https://example.com";
      const result = validateAndSanitize(input, "url");
      expect(result).toBe("https://example.com/");
    });

    it("should sanitize pre type", () => {
      const input = "<script>alert('xss')</script>";
      const result = validateAndSanitize(input, "pre");
      expect(result).toBe("&lt;script&gt;alert('xss')&lt;/script&gt;");
    });

    it("should default to text sanitization for unknown type", () => {
      const input = "<script>alert('xss')</script>";
      const result = validateAndSanitize(input, "unknown" as "text");
      expect(result).toBe(
        "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;",
      );
    });
  });
});
