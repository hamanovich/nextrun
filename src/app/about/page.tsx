import { Code, Eye, ShieldCheck, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CallToAction } from "@/components/call-to-action/call-to-action";
import { FadeIn } from "@/components/motion/fade-in";

export { metadata } from "./metadata";

type Pillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const purpose: Pillar[] = [
  {
    icon: Target,
    title: "Our mission",
    description:
      "Give developers a production-ready foundation so shipping an idea takes days, not weeks. You should never rebuild authentication and billing from scratch again.",
  },
  {
    icon: Eye,
    title: "Our vision",
    description:
      "A world where the distance between an idea and a deployed product is as short as a single git clone.",
  },
];

const values: Pillar[] = [
  {
    icon: Zap,
    title: "Speed",
    description:
      "Pre-configured integrations and sensible defaults so you reach your first deploy fast.",
  },
  {
    icon: Code,
    title: "Developer experience",
    description:
      "Typed end to end, linted, and documented. Code you can read, trust, and extend.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description:
      "Authentication, validated inputs, and secure payment flows wired in from the first commit.",
  },
];

export default function About() {
  return (
    <main>
      <section className="container mx-auto px-6 pt-16 pb-12 md:pt-24">
        <div className="max-w-2xl">
          <FadeIn delay={0}>
            <p className="text-muted-foreground mb-5 text-sm font-medium">
              About NextRun
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="text-4xl font-semibold tracking-tighter text-balance md:text-5xl lg:text-6xl">
              A starter that gets out of your way
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed md:text-lg">
              NextRun removes the tedious setup. Authentication, payments,
              database, and a Telegram bot integration come configured, so you
              can focus on the product instead of the plumbing.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="bg-border grid grid-cols-1 gap-px overflow-hidden rounded-lg border md:grid-cols-2">
          {purpose.map(({ icon: Icon, title, description }, index) => (
            <FadeIn
              key={title}
              y={0}
              delay={index * 0.1}
              className="bg-background flex flex-col gap-4 p-8"
            >
              <Icon
                className="size-5 shrink-0"
                aria-hidden={true}
                strokeWidth={1.5}
              />
              <div className="space-y-2">
                <h2 className="text-xl font-medium">{title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
            What we value
          </h2>
        </FadeIn>
        <div className="bg-border mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border sm:grid-cols-3">
          {values.map(({ icon: Icon, title, description }, index) => (
            <FadeIn
              key={title}
              y={0}
              delay={index * 0.08}
              className="bg-background flex flex-col gap-4 p-8"
            >
              <Icon
                className="size-5 shrink-0"
                aria-hidden={true}
                strokeWidth={1.5}
              />
              <div className="space-y-2">
                <h3 className="font-medium">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <FadeIn>
        <CallToAction />
      </FadeIn>
    </main>
  );
}
