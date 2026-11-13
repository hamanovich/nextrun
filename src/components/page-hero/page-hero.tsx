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
      "site-container px-6 pt-16 pb-12 md:pt-24",
      align === "center" && "text-center",
      className,
    )}
  >
    <div className={cn("max-w-2xl", align === "center" && "mx-auto max-w-3xl")}>
      {eyebrow && (
        <FadeIn>
          <p className="text-muted-foreground mb-5 text-sm font-medium">
            {eyebrow}
          </p>
        </FadeIn>
      )}
      <FadeIn>
        <h1
          className={cn("brand-public-title", align === "center" && "mx-auto")}
        >
          {heading}
        </h1>
      </FadeIn>
      {description && (
        <FadeIn>
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
