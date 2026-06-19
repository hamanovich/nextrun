import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/auth/sign-in-button";
import { FadeIn } from "@/components/motion/fade-in";

interface PricingCtaProps {
  isLoggedIn?: boolean;
}

export const PricingCta = ({ isLoggedIn }: PricingCtaProps) => (
  <section className="container mx-auto px-6 pb-20 md:pb-28">
    <FadeIn className="bg-muted mx-auto max-w-5xl rounded-lg border px-6 py-12 text-center md:px-12">
      <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
        Ready to start building?
      </h2>
      <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-base leading-relaxed">
        Clone the template, add your credits, and ship. No subscription
        required.
      </p>
      <div className="mt-7 flex justify-center">
        {isLoggedIn ? (
          <Button asChild size="lg" className="h-11 px-6">
            <Link href="/">
              Get started <ArrowRight className="size-4" aria-hidden={true} />
            </Link>
          </Button>
        ) : (
          <SignInButton>
            <KeyRound />
            Sign in
          </SignInButton>
        )}
      </div>
    </FadeIn>
  </section>
);
