import { describe, expect, it } from "vitest";
import { cn } from "../utils";

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
      expect(cn("px-2 px-4")).toBe("px-4");
      expect(cn("text-sm text-lg")).toBe("text-lg");
      expect(cn("bg-red-500 bg-blue-500")).toBe("bg-blue-500");
    });
  });
});
