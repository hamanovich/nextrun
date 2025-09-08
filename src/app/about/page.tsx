import Link from "next/link";
import { Code, CreditCard, Shield, Target, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <section className="h-full w-screen overflow-hidden py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground mb-4 flex items-center justify-center gap-3 text-sm">
            <span className="inline-block size-2 rounded bg-green-500" />
            ABOUT NEXTRUN
          </p>
          <h1 className="mb-6 text-4xl font-semibold tracking-tighter md:text-5xl lg:text-6xl">
            Making Web Development{" "}
            <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
              Effortless
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            NextRun is a production-ready Next.js template that eliminates the
            tedious setup process. Get your next web application up and running
            in minutes with pre-configured authentication, payments, and modern
            UI components.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-dashed">
              <CardContent className="p-8">
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-accent">
                  <Target className="size-6" />
                </div>
                <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To accelerate web development by providing developers with a
                  production-ready Next.js template that includes all the
                  essential features they need. We believe every developer
                  should focus on building their unique ideas, not reinventing
                  authentication and payment systems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-8">
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-accent">
                  <Code className="size-6" />
                </div>
                <h2 className="mb-4 text-2xl font-semibold">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A world where developers can launch their ideas faster than
                  ever. Where the barrier between concept and production is
                  minimal. We envision NextRun as the foundation that empowers
                  developers to build the next generation of web applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-semibold">Our Values</h2>
            <p className="text-muted-foreground mb-12 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-dashed p-6 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-accent">
                <Zap className="size-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Speed</h3>
              <p className="text-muted-foreground text-sm">
                We believe in rapid development and deployment. Get your ideas
                to market faster with our pre-configured solutions.
              </p>
            </div>

            <div className="rounded-lg border border-dashed p-6 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-accent">
                <Users className="size-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Developer Experience
              </h3>
              <p className="text-muted-foreground text-sm">
                Every feature is designed with developers in mind. Clean code,
                great documentation, and intuitive APIs.
              </p>
            </div>

            <div className="rounded-lg border border-dashed p-6 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-accent">
                <Shield className="size-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Security</h3>
              <p className="text-muted-foreground text-sm">
                Production-ready security from day one. Authentication,
                authorization, and data protection built-in.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-semibold">
              Built with Modern Technology
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Production-ready stack with the latest tools and best practices
            </p>
          </div>

          <Card className="border-dashed">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-accent">
                    <Code className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Next.js 15 + TypeScript
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Built on the latest Next.js framework with full TypeScript
                    support, App Router, Server Components, and all the modern
                    React features you need for scalable applications.
                  </p>
                </div>
                <div>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-accent">
                    <Shield className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Auth.js + Google OAuth
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Secure authentication system with Google OAuth integration.
                    Session management, protected routes, and user management
                    all configured and ready to use.
                  </p>
                </div>
                <div>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-accent">
                    <CreditCard className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Stripe Payments
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Complete payment processing with Stripe integration.
                    Subscription management, webhooks, and secure payment flows
                    all pre-configured for immediate use.
                  </p>
                </div>
                <div>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-accent">
                    <Zap className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">UI Components</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Beautiful, accessible UI components built with Radix UI and
                    styled with Tailwind CSS. Dark mode support, responsive
                    design, and consistent design system included.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-semibold">
            Ready to Start Building?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of developers who are already building amazing
            applications with NextRun.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Pricing
            </Link>
            <Link
              href="/user"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
