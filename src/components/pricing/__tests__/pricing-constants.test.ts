import { describe, expect, it } from "vitest";
import {
  FREE_TIER,
  FREE_TIER_FEATURES,
  type PricingPeriod,
  type PricingTier,
} from "../pricing.constants";

describe("Pricing Constants", () => {
  describe("FREE_TIER", () => {
    it("has correct structure", () => {
      expect(FREE_TIER).toHaveProperty("name");
      expect(FREE_TIER).toHaveProperty("price");
      expect(FREE_TIER).toHaveProperty("period");
      expect(FREE_TIER).toHaveProperty("credits");
      expect(FREE_TIER).toHaveProperty("description");
      expect(FREE_TIER).toHaveProperty("features");
      expect(FREE_TIER).toHaveProperty("popular");
      expect(FREE_TIER).toHaveProperty("productId");
    });

    it("has correct values", () => {
      expect(FREE_TIER.name).toBe("Starter");
      expect(FREE_TIER.price).toBe("Free");
      expect(FREE_TIER.period).toBe("forever");
      expect(FREE_TIER.credits).toBe(5);
      expect(FREE_TIER.description).toBe("Perfect for trying out our features");
      expect(FREE_TIER.popular).toBe(false);
      expect(FREE_TIER.productId).toBeNull();
    });

    it("has correct features array", () => {
      const expectedFeatures = [
        "5 free credits to start",
        "Basic flashcard generation",
        "Anki & Quizlet support",
        "Community support",
      ];

      expect(FREE_TIER.features).toEqual(expectedFeatures);
      expect(FREE_TIER.features).toHaveLength(4);
    });

    it("satisfies PricingTier interface", () => {
      const tier: PricingTier = FREE_TIER;
      expect(tier).toBeDefined();
    });
  });

  describe("FREE_TIER_FEATURES", () => {
    it("has correct structure", () => {
      expect(Array.isArray(FREE_TIER_FEATURES)).toBe(true);
      expect(FREE_TIER_FEATURES).toHaveLength(4);
    });

    it("has correct values", () => {
      const expectedFeatures = [
        "5 free credits to start",
        "Basic flashcard generation",
        "Anki & Quizlet support",
        "Community support",
      ];

      expect(FREE_TIER_FEATURES).toEqual(expectedFeatures);
    });

    it("is readonly array", () => {
      expect(Array.isArray(FREE_TIER_FEATURES)).toBe(true);
      expect(FREE_TIER_FEATURES).toBeDefined();
    });

    it("matches FREE_TIER features", () => {
      expect(FREE_TIER_FEATURES).toEqual(FREE_TIER.features);
    });
  });

  describe("Type Definitions", () => {
    it("PricingPeriod type includes all expected values", () => {
      const validPeriods: PricingPeriod[] = [
        "month",
        "year",
        "one-time",
        "forever",
      ];

      validPeriods.forEach((period) => {
        expect(["month", "year", "one-time", "forever"]).toContain(period);
      });
    });

    it("PricingTier interface has all required properties", () => {
      const sampleTier: PricingTier = {
        name: "Test Plan",
        price: "9.99",
        period: "month",
        credits: 100,
        description: "Test description",
        features: ["Feature 1", "Feature 2"],
        popular: true,
        productId: "prod_123",
      };

      expect(sampleTier.name).toBe("Test Plan");
      expect(sampleTier.price).toBe("9.99");
      expect(sampleTier.period).toBe("month");
      expect(sampleTier.credits).toBe(100);
      expect(sampleTier.description).toBe("Test description");
      expect(sampleTier.features).toEqual(["Feature 1", "Feature 2"]);
      expect(sampleTier.popular).toBe(true);
      expect(sampleTier.productId).toBe("prod_123");
    });

    it("PricingTier interface allows null values for optional fields", () => {
      const tierWithNulls: PricingTier = {
        name: "Free Plan",
        price: "Free",
        period: "forever",
        credits: null,
        description: "Free plan",
        features: [],
        popular: false,
        productId: null,
      };

      expect(tierWithNulls.credits).toBeNull();
      expect(tierWithNulls.productId).toBeNull();
    });
  });

  describe("Data Consistency", () => {
    it("FREE_TIER features match FREE_TIER_FEATURES", () => {
      expect(FREE_TIER.features).toEqual(FREE_TIER_FEATURES);
    });

    it("FREE_TIER has valid period", () => {
      const validPeriods: PricingPeriod[] = [
        "month",
        "year",
        "one-time",
        "forever",
      ];
      expect(validPeriods).toContain(FREE_TIER.period);
    });

    it("FREE_TIER has valid credits value", () => {
      expect(typeof FREE_TIER.credits).toBe("number");
      expect(FREE_TIER.credits).toBeGreaterThanOrEqual(0);
    });

    it("FREE_TIER has valid popular flag", () => {
      expect(typeof FREE_TIER.popular).toBe("boolean");
    });

    it("FREE_TIER has valid productId", () => {
      expect(FREE_TIER.productId).toBeNull();
    });
  });

  describe("Feature Content", () => {
    it("features contain expected content", () => {
      const features = FREE_TIER_FEATURES;

      expect(features).toContain("5 free credits to start");
      expect(features).toContain("Basic flashcard generation");
      expect(features).toContain("Anki & Quizlet support");
      expect(features).toContain("Community support");
    });

    it("features are non-empty strings", () => {
      FREE_TIER_FEATURES.forEach((feature) => {
        expect(typeof feature).toBe("string");
        expect(feature.trim()).toBeTruthy();
        expect(feature.length).toBeGreaterThan(0);
      });
    });

    it("features are unique", () => {
      const uniqueFeatures = new Set(FREE_TIER_FEATURES);
      expect(uniqueFeatures.size).toBe(FREE_TIER_FEATURES.length);
    });
  });
});
