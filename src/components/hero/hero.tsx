import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyCommand } from "@/components/hero/copy-command";
import { FadeIn } from "@/components/motion/fade-in";

const commands = [
  "git clone https://github.com/hamanovich/nextrun",
  "cd nextrun",
  "bun install",
  "bun dev",
];

export const Hero = () => (
  <section className="container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="max-w-xl">
        <FadeIn delay={0}>
          <p className="text-muted-foreground mb-5 text-sm font-medium">
            Next.js 16 starter
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h1 className="text-4xl font-semibold tracking-tighter text-balance md:text-5xl lg:text-6xl">
            Skip the setup. Ship the product.
          </h1>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed md:text-lg">
            Auth, payments, database, and a Telegram bot, configured and typed.
            Clone NextRun and build the part that matters.
          </p>
        </FadeIn>
        <FadeIn delay={0.24}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="h-11 px-6">
              <Link href="/pricing">
                Get started <ArrowRight className="size-4" aria-hidden={true} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 px-6">
              <Link href="/about">Learn more</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
      <FadeIn delay={0.2}>
        <CopyCommand commands={commands} />
      </FadeIn>
    </div>
  </section>
);
