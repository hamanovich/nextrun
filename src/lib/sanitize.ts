/**
 * Input sanitization utilities to prevent XSS vulnerabilities
 *
 * This module provides isomorphic sanitization functions that work seamlessly
 * on both client and server side to ensure user input is safe before rendering or processing.
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Isomorphic HTML sanitization using isomorphic-dompurify
 * Works seamlessly on both client and server side
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "span"],
    ALLOWED_ATTR: ["class"],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize plain text input by escaping HTML characters
 * This is the safest option for user-generated content that should be displayed as text
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitize JSON-LD content to prevent XSS in structured data
 * This is specifically for JSON-LD scripts that use dangerouslySetInnerHTML
 */
export function sanitizeJsonLd(jsonLd: unknown): string {
  return JSON.stringify(jsonLd)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Sanitize user input for form fields
 * Removes potentially dangerous characters while preserving basic formatting
 */
export function sanitizeFormInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .slice(0, 500); // Limit length
}

/**
 * Sanitize URL input to prevent open redirects and XSS
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return "";
    }

    // Block javascript: and data: URLs
    if (
      url.toLowerCase().includes("javascript:") ||
      url.toLowerCase().includes("data:")
    ) {
      return "";
    }

    return parsedUrl.toString();
  } catch {
    return "";
  }
}

/**
 * Sanitize content for display in pre-formatted text areas
 * This is used for displaying generated content like Anki/Quizlet data
 */
export function sanitizePreContent(content: string): string {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Configuration for different sanitization levels
 */
export const SANITIZE_CONFIG = {
  // For user-generated content that will be displayed as HTML
  HTML: {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "span"],
    ALLOWED_ATTR: ["class"],
    KEEP_CONTENT: true,
  },
  // For content that should be plain text only
  TEXT: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  // For JSON-LD structured data
  JSON_LD: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
} as const;

/**
 * Validate and sanitize user input based on expected type
 */
export function validateAndSanitize(
  input: string,
  type: "html" | "text" | "json-ld" | "form" | "url" | "pre",
): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  switch (type) {
    case "html":
      return sanitizeHtml(input);
    case "text":
      return sanitizeText(input);
    case "json-ld":
      return sanitizeJsonLd(input);
    case "form":
      return sanitizeFormInput(input);
    case "url":
      return sanitizeUrl(input);
    case "pre":
      return sanitizePreContent(input);
    default:
      return sanitizeText(input);
  }
}
