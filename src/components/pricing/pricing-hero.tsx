import { CreditCard } from "lucide-react";

interface PricingHeroProps {
  currentCredits?: number;
}

export const PricingHero = ({ currentCredits }: PricingHeroProps) => (
  <section className="py-6 md:py-12 bg-gradient-to-b from-background to-muted/50">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-muted-foreground mb-2 flex items-center justify-center gap-3 text-sm">
          <span className="inline-block size-2 rounded bg-orange-500" />
          PRICING
        </p>
        <h1 className="mb-6 text-4xl font-semibold tracking-tighter md:text-5xl lg:text-6xl">
          Choose Your{" "}
          <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
            Learning Journey
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
          Start free and scale as you grow. Our credit-based system gives you
          complete control over your language learning investment.
        </p>

        {currentCredits !== undefined && (
          <div className="mt-8 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-lg">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium text-lg">
              Current Credits: {currentCredits}
            </span>
          </div>
        )}
      </div>
    </div>
  </section>
);
