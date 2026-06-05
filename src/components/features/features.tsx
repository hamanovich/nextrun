import {
  Braces,
  CreditCard,
  Database,
  Palette,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
};

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Authentication",
    description:
      "Better Auth with Google OAuth, email and session management already wired into Server Actions.",
    className: "lg:col-span-7",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Stripe checkout, a credit system, and verified webhooks.",
    className: "lg:col-span-5",
  },
  {
    icon: Database,
    title: "Database",
    description: "Drizzle ORM on Neon Postgres with fully typed queries.",
    className: "lg:col-span-5",
  },
  {
    icon: Send,
    title: "Telegram bot",
    description:
      "A grammY bot with conversations, file handling and throttling, ready to deploy alongside the app.",
    className: "lg:col-span-7",
  },
  {
    icon: Palette,
    title: "UI kit",
    description: "shadcn/ui, Tailwind v4 and dark mode out of the box.",
    className: "lg:col-span-6",
  },
  {
    icon: Braces,
    title: "Type-safe end to end",
    description: "TypeScript strict mode and Zod validation on every input.",
    className: "lg:col-span-6",
  },
];

export const Features = () => (
  <section className="container mx-auto px-6 py-20 md:py-28">
    <div className="max-w-2xl">
      <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">
        Everything is already wired up
      </h2>
      <p className="text-muted-foreground mt-3 text-base leading-relaxed md:text-lg">
        The integrations you would spend the first week configuring, done and
        tested. Delete what you do not need.
      </p>
    </div>

    <div className="bg-border mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border md:grid-cols-2 lg:grid-cols-12">
      {features.map(({ icon: Icon, title, description, className }) => (
        <div
          key={title}
          className={cn(
            "bg-background flex flex-col gap-4 p-6 md:p-8",
            className,
          )}
        >
          <Icon
            className="size-5 shrink-0"
            aria-hidden={true}
            strokeWidth={1.5}
          />
          <div className="space-y-1.5">
            <h3 className="font-medium">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
