import { CreditCard } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

interface PricingHeroProps {
  currentCredits?: number;
}

export const PricingHero = ({ currentCredits }: PricingHeroProps) => (
  <section className="container mx-auto px-6 pt-16 pb-10 text-center md:pt-24">
    <div className="mx-auto max-w-3xl">
      <FadeIn delay={0}>
        <h1 className="text-4xl font-semibold tracking-tighter text-balance md:text-5xl lg:text-6xl">
          Simple, credit-based pricing
        </h1>
      </FadeIn>
      <FadeIn delay={0.08}>
        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
          Start free and scale as you grow. Buy credits when you need them, with
          no subscription to cancel.
        </p>
      </FadeIn>

      {currentCredits !== undefined && (
        <FadeIn delay={0.16} className="flex justify-center">
          <div className="bg-muted text-foreground mt-8 inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium">
            <CreditCard className="size-4" aria-hidden={true} />
            {currentCredits.toLocaleString()} credits available
          </div>
        </FadeIn>
      )}
    </div>
  </section>
);
