import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsCode } from "@/components/docs/docs-code";
import { DocsToc } from "@/components/docs/docs-toc";
import {
  dockerBuildExample,
  docsSections,
  envVars,
  includedFeatures,
  projectTree,
  quickStartCommands,
  scripts,
} from "@/components/docs/docs.constants";
import { InlineCode } from "@/components/docs/inline-code";
import { CopyCommand } from "@/components/hero/copy-command";
import { MosaicGrid } from "@/components/mosaic-grid/mosaic-grid";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/page-hero/page-hero";

export { metadata } from "./metadata";
export const revalidate = 3600;

export default function DocsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Documentation"
        heading="NextRun documentation"
        description="Everything you need to clone NextRun, configure the integrations, and ship. Pick a section, or read top to bottom."
        className="pb-10"
      />

      <div className="container mx-auto px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          <DocsToc sections={docsSections} />

          <div className="max-w-3xl min-w-0 space-y-16">
            <FadeIn>
              <section id="overview" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
                  Overview
                </h2>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  NextRun is a production-ready Next.js 16 starter.
                  Authentication, payments, a Postgres database, and a Telegram
                  bot come configured, typed, and tested, so you can delete what
                  you do not need and build the part that matters. The marketing
                  surface follows a strict monochrome design language meant to
                  be reused as a starting point for other projects.
                </p>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="quick-start" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
                  Quick start
                </h2>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  You need Bun 1.x and a PostgreSQL database. Neon works out of
                  the box. Clone the repository, install dependencies, set your
                  environment variables, and start the dev server.
                </p>
                <div className="mt-6">
                  <CopyCommand commands={quickStartCommands} label="terminal" />
                </div>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  Then open http://localhost:3000.
                </p>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="environment" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
                  Environment variables
                </h2>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  All configuration is validated at startup by{" "}
                  <InlineCode>src/lib/env.ts</InlineCode>. Copy{" "}
                  <InlineCode>.env.example</InlineCode> to{" "}
                  <InlineCode>.env</InlineCode> and fill in the values below.
                  Variables prefixed with <InlineCode>NEXT_PUBLIC</InlineCode>{" "}
                  are exposed to the browser.
                </p>
                <div className="mt-6 overflow-x-auto rounded-lg border">
                  <table className="w-full text-left text-sm">
                    <thead className="text-muted-foreground border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium">Variable</th>
                        <th className="px-4 py-3 font-medium">Required</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {envVars.map((variable) => (
                        <tr key={variable.name}>
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                            {variable.name}
                          </td>
                          <td className="text-muted-foreground px-4 py-3">
                            {variable.required ? "Yes" : "Optional"}
                          </td>
                          <td className="text-muted-foreground px-4 py-3">
                            {variable.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="project-structure" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
                  Project structure
                </h2>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  Database access goes through Drizzle inside Server Actions.
                  There is intentionally no service layer and no raw client
                  calls from components.
                </p>
                <div className="mt-6">
                  <DocsCode code={projectTree} label="src" />
                </div>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="whats-included" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
                  What is included
                </h2>
                <MosaicGrid className="mt-6 grid-cols-1 sm:grid-cols-2">
                  {includedFeatures.map((feature) => (
                    <div
                      key={feature.title}
                      className="bg-background flex flex-col gap-2 p-6"
                    >
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </MosaicGrid>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="scripts" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
                  Scripts
                </h2>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  Run <InlineCode>bun run check</InlineCode> before declaring
                  work done. It covers types, linting, formatting, and tests.
                </p>
                <div className="mt-6 divide-y rounded-lg border">
                  {scripts.map((script) => (
                    <div
                      key={script.command}
                      className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <code className="shrink-0 font-mono text-xs sm:w-44">
                        {script.command}
                      </code>
                      <span className="text-muted-foreground text-sm">
                        {script.description}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="deployment" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tighter md:text-3xl">
                  Deployment
                </h2>
                <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                  NextRun ships with a multi-stage Dockerfile and a standalone
                  build. Server clients initialize lazily, so the build needs no
                  server secrets, only <InlineCode>NEXT_PUBLIC</InlineCode>{" "}
                  variables are passed as build arguments so they are inlined
                  into the client and the Content-Security-Policy. Every secret
                  is injected at runtime.
                </p>
                <div className="mt-6">
                  <DocsCode code={dockerBuildExample} label="shell" />
                </div>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  The runner stage adds curl so Coolify and similar platforms
                  can run an in-container HTTP health check. The full
                  self-hosted runbook lives in{" "}
                  <InlineCode>docs/DEPLOYMENT.md</InlineCode>.
                </p>
              </section>
            </FadeIn>

            <FadeIn>
              <div className="bg-muted rounded-lg border px-6 py-8">
                <h2 className="text-xl font-semibold tracking-tighter">
                  Need the full reference?
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
                  The README on GitHub covers every script, integration, and
                  deployment detail in depth.
                </p>
                <div className="mt-5">
                  <Button asChild className="h-11 px-6">
                    <Link
                      href="https://github.com/hamanovich/nextrun#readme"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open the README{" "}
                      <ArrowRight className="size-4" aria-hidden={true} />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
