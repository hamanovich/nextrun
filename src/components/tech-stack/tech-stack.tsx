import Image from "next/image";

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
  { slug: "openai", name: "OpenAI" },
];

const iconUrl = (slug: string) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg`;

export const TechStack = () => (
  <section className="container mx-auto px-6 py-20 md:py-24">
    <div className="border-y py-12">
      <p className="text-muted-foreground text-center text-sm">
        Built on a modern, boring stack
      </p>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
        {stack.map(({ slug, name }) => (
          <li key={slug}>
            <Image
              src={iconUrl(slug)}
              alt={name}
              width={28}
              height={28}
              unoptimized
              className="h-6 w-auto opacity-60 grayscale transition-opacity hover:opacity-100 dark:invert"
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
