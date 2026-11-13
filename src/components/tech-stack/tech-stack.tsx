import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";

type Tech = {
  slug: string;
  name: string;
};

const stack: Tech[] = [
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "react", name: "React" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "tailwindcss", name: "Tailwind CSS" },
  { slug: "drizzle", name: "Drizzle ORM" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "stripe", name: "Stripe" },
  { slug: "telegram", name: "Telegram" },
  { slug: "bun", name: "Bun" },
];

const iconUrl = (slug: string) => `/tech/${slug}.svg`;

export const TechStack = () => (
  <section className="site-container px-6 py-12 md:py-16">
    <div className="border-y py-12">
      <FadeIn>
        <p className="text-muted-foreground text-center text-sm">
          Built on a modern, boring stack
        </p>
      </FadeIn>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
        {stack.map(({ slug, name }) => (
          <li key={slug}>
            <FadeIn>
              <Image
                src={iconUrl(slug)}
                alt={name}
                width={28}
                height={28}
                unoptimized
                className="h-6 w-auto opacity-60 grayscale dark:invert"
              />
            </FadeIn>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
