import { CreditCard } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/page-hero/page-hero";

interface PricingHeroProps {
  currentCredits?: number;
}

export const PricingHero = ({ currentCredits }: PricingHeroProps) => (
  <PageHero
    align="center"
    className="pb-10"
    heading="Simple, credit-based pricing"
    description="Start free and scale as you grow. Buy credits when you need them, with no subscription to cancel."
  >
    {currentCredits !== undefined && (
      <FadeIn delay={0.16} className="flex justify-center">
        <div className="bg-muted text-foreground mt-8 inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium">
          <CreditCard className="size-4" aria-hidden={true} />
          {currentCredits.toLocaleString()} credits available
        </div>
      </FadeIn>
    )}
  </PageHero>
);
