import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";

interface PageHeroProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export const PageHero = ({
  eyebrow,
  heading,
  description,
  align = "left",
  className,
  children,
}: PageHeroProps) => (
  <section
    className={cn(
      "container mx-auto px-6 pt-16 pb-12 md:pt-24",
      align === "center" && "text-center",
      className,
    )}
  >
    <div className={cn("max-w-2xl", align === "center" && "mx-auto max-w-3xl")}>
      {eyebrow && (
        <FadeIn delay={0}>
          <p className="text-muted-foreground mb-5 text-sm font-medium">
            {eyebrow}
          </p>
        </FadeIn>
      )}
      <FadeIn delay={eyebrow ? 0.08 : 0}>
        <h1 className="text-4xl font-semibold tracking-tighter text-balance md:text-5xl lg:text-6xl">
          {heading}
        </h1>
      </FadeIn>
      {description && (
        <FadeIn delay={eyebrow ? 0.16 : 0.08}>
          <p
            className={cn(
              "text-muted-foreground mt-6 text-base leading-relaxed md:text-lg",
              align === "center" ? "mx-auto max-w-2xl" : "max-w-xl",
            )}
          >
            {description}
          </p>
        </FadeIn>
      )}
      {children}
    </div>
  </section>
);
