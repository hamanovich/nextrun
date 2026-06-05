import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
}

export const CallToAction = ({
  title = "Ready to launch your next project?",
  description = "Clone the template, point it at your database, and deploy. Authentication, payments, and UI are already in place.",
  buttonText = "Get started",
  buttonUrl = "/pricing",
  items = [
    "Next.js 16 + TypeScript",
    "Better Auth",
    "Stripe Payments",
    "shadcn/ui components",
    "Tailwind CSS v4",
  ],
}: CallToActionProps) => (
  <section className="container mx-auto px-6 pt-6 pb-24 md:pb-32">
    <div className="bg-muted mx-auto flex max-w-5xl flex-col justify-between gap-10 rounded-lg border px-6 py-12 md:flex-row md:items-center md:px-12 lg:px-16">
      <div className="max-w-md">
        <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
          {title}
        </h2>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed">
          {description}
        </p>
        <Button className="mt-7 h-11 px-6" size="lg" asChild>
          <Link href={buttonUrl}>
            {buttonText} <ArrowRight className="size-4" aria-hidden={true} />
          </Link>
        </Button>
      </div>
      <ul className="flex flex-col gap-3 text-sm font-medium">
        {items.map((item) => (
          <li className="flex items-center gap-3" key={item}>
            <Check className="size-4 shrink-0" aria-hidden={true} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);
