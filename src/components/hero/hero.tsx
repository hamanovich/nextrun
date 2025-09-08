import Link from "next/link";
import { Code, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <div className="container border-b border-t border-dashed m-auto">
    <div className="relative flex w-full max-w-5xl flex-col justify-start border border-t-0 border-dashed px-5 py-12 md:items-center md:justify-center lg:mx-auto">
      <p className="text-muted-foreground flex items-center gap-3 text-sm">
        <span className="inline-block size-2 rounded bg-green-500" />
        NEXT.JS TEMPLATE • READY TO DEPLOY
      </p>
      <div className="mb-7 mt-3 w-full max-w-4xl text-5xl font-semibold tracking-tighter md:mb-10 text-center md:text-6xl lg:relative lg:mb-0 lg:text-7xl">
        <h1 className="relative z-10 inline md:mr-3">
          <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
            NextRun
          </span>{" "}
          - Build Modern Web Apps <br className="block md:hidden" /> in Minutes,
          Not Hours
        </h1>
      </div>
    </div>
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center border border-b-0 border-t-0 border-dashed py-12">
      <div className="w-full max-w-3xl space-y-5 md:text-center">
        <p className="text-muted-foreground px-5 lg:text-lg">
          A powerful Next.js template that comes pre-configured with modern
          authentication, payment processing, and beautiful UI components. Skip
          the setup headaches and focus on building your next big idea.
          Everything you need to launch faster.
        </p>
        <div className="flex flex-col space-y-3 sm:-mx-2 sm:flex-row sm:justify-center sm:space-y-0">
          <Button size="lg" asChild className="sm:mx-2">
            <Link href="/pricing">View Pricing</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="sm:mx-2">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
    <ul className="md:h-36 mx-auto grid h-44 w-full max-w-5xl grid-cols-1 border border-b-0 border-dashed md:grid-cols-2 lg:h-24 lg:grid-cols-3">
      <li className="flex h-full items-center justify-between gap-10 px-5 md:gap-3 lg:justify-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
          <Code className="text-muted-foreground size-6" />
        </div>
        <p className="text-muted-foreground text-lg">Next.js 15 + TypeScript</p>
      </li>
      <li className="flex h-full items-center justify-between gap-10 border-l border-t border-dashed px-5 md:gap-3 lg:justify-center lg:border-t-0">
        <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
          <Shield className="text-muted-foreground size-6" />
        </div>
        <p className="text-muted-foreground text-lg">Auth.js + Google OAuth</p>
      </li>
      <li className="col-span-1 flex h-full items-center justify-between gap-10 border-l border-t border-dashed px-5 md:col-span-2 md:justify-center md:gap-3 lg:col-span-1 lg:border-t-0">
        <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
          <CreditCard className="text-muted-foreground size-6" />
        </div>
        <p className="text-muted-foreground text-lg">Stripe Payments Ready</p>
      </li>
    </ul>
  </div>
);
