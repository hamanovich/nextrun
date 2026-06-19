import Link from "next/link";
import { createPaymentAction, listPricingProducts } from "@/actions/stripe";
import { getSessionUser } from "@/actions/user";
import { Check, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInButton } from "@/components/auth/sign-in-button";
import { FadeIn } from "@/components/motion/fade-in";
import {
  FREE_TIER,
  FREE_TIER_FEATURES,
  MOCK_TIERS,
} from "@/components/pricing/pricing.constants";
import { PricingCta } from "./pricing-cta";
import { PricingFaq } from "./pricing-faq";
import { PricingHero } from "./pricing-hero";

export const PricingContent = async ({
  isMocked = true,
}: {
  isMocked?: boolean;
}) => {
  const sessionUser = await getSessionUser();
  const products = isMocked ? [] : await listPricingProducts();

  const pricingPlans = isMocked
    ? MOCK_TIERS
    : products.map((product, index) => ({
        name: product.product?.name || `Plan ${index + 1}`,
        price: (product.amount! / 100).toFixed(0),
        period: product.interval ?? "one-time",
        credits:
          product.product?.credits != null
            ? Number(product.product.credits)
            : null,
        description: product.product?.description || "NextRun building credits",
        features:
          product.product?.marketing_features?.map(
            (feature: { name: string }) => feature.name,
          ) ?? FREE_TIER_FEATURES,
        popular: index === 0,
        productId: product.id,
      }));

  const allPlans = [FREE_TIER, ...pricingPlans];

  return (
    <>
      <PricingHero currentCredits={sessionUser?.user.stripeCredits} />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div
            className={`${allPlans.length === 1 ? "flex justify-center" : "grid gap-8 md:grid-cols-3 md:gap-4 lg:gap-12"}`}
          >
            {allPlans.map((plan, index) => (
              <FadeIn
                key={plan.name}
                delay={index * 0.08}
                className={allPlans.length === 1 ? "w-full max-w-sm" : ""}
              >
                <Card
                  className={`relative h-full ${plan.popular ? "border-primary shadow-lg md:scale-105" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-8 text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {plan.price === "Free" ? plan.price : `$${plan.price}`}
                      </span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {plan.credits != null ? `${plan.credits} credits` : "N/A"}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <Check className="text-foreground size-5 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.name === "Starter" ? (
                      <Button asChild className="w-full" variant="outline">
                        <Link href="/">Get Started Free</Link>
                      </Button>
                    ) : plan.productId?.startsWith("mock_") ? (
                      <Button asChild className="w-full">
                        <Link href="/auth/signin">Get started</Link>
                      </Button>
                    ) : plan.productId ? (
                      sessionUser ? (
                        <form action={createPaymentAction}>
                          <input
                            type="hidden"
                            name="priceId"
                            value={plan.productId}
                          />
                          <Button className="w-full">Purchase Credits</Button>
                        </form>
                      ) : (
                        <SignInButton className="w-full">
                          <KeyRound />
                          Sign in
                        </SignInButton>
                      )
                    ) : (
                      <Button className="w-full" variant="outline">
                        Contact Sales
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <PricingFaq />

      <PricingCta isLoggedIn={!!sessionUser} />
    </>
  );
};
