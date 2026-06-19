import { Code, Eye, ShieldCheck, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CallToAction } from "@/components/call-to-action/call-to-action";
import { MosaicGrid } from "@/components/mosaic-grid/mosaic-grid";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/page-hero/page-hero";

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
      <PageHero
        eyebrow="About NextRun"
        heading="A starter that gets out of your way"
        description="NextRun removes the tedious setup. Authentication, payments, database, and a Telegram bot integration come configured, so you can focus on the product instead of the plumbing."
      />

      <section className="container mx-auto px-6 py-12">
        <MosaicGrid className="grid-cols-1 md:grid-cols-2">
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
        </MosaicGrid>
      </section>

      <section className="container mx-auto px-6 py-12">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
            What we value
          </h2>
        </FadeIn>
        <MosaicGrid className="mt-8 grid-cols-1 sm:grid-cols-3">
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
        </MosaicGrid>
      </section>

      <FadeIn>
        <CallToAction />
      </FadeIn>
    </main>
  );
}
