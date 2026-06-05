/**
 * Input sanitization utilities to prevent XSS vulnerabilities
 *
 * This module provides isomorphic sanitization functions that work seamlessly
 * on both client and server side to ensure user input is safe before rendering or processing.
 */

/**
 * Sanitize plain text input by escaping HTML characters
 * This is the safest option for user-generated content that should be displayed as text
 */
export const sanitizeText = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

/**
 * Sanitize JSON-LD content to prevent XSS in structured data
 * This is specifically for JSON-LD scripts that use dangerouslySetInnerHTML
 */
export const sanitizeJsonLd = (jsonLd: unknown): string =>
  JSON.stringify(jsonLd)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

/**
 * Sanitize user input for form fields
 * Removes potentially dangerous characters while preserving basic formatting
 */
export const sanitizeFormInput = (input: string): string =>
  input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .slice(0, 500); // Limit length

/**
 * Sanitize URL input to prevent open redirects and XSS
 */
export const sanitizeUrl = (url: string): string => {
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
};

/**
 * Sanitize content for display in pre-formatted text areas
 * This is used for displaying generated or user-provided content
 */
export const sanitizePreContent = (content: string): string =>
  content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Validate and sanitize user input based on expected type
 */
export const validateAndSanitize = (
  input: string,
  type: "text" | "json-ld" | "form" | "url" | "pre",
): string => {
  if (!input || typeof input !== "string") {
    return "";
  }

  switch (type) {
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
};
