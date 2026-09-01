import { type ReactNode } from "react";
import Link from "next/link";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  description: string;
  sections: ReadonlyArray<{
    id: string;
    label: string;
  }>;
  children: ReactNode;
}

export const LegalPage = ({
  title,
  lastUpdated,
  description,
  sections,
  children,
}: LegalPageProps) => (
  <main className="bg-[#f7f8f7] text-[#1e2929] dark:bg-zinc-950 dark:text-zinc-100">
    <section className="border-b border-[#d8e1df] dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex min-h-[360px] max-w-2xl flex-col justify-center py-16 md:py-20">
          <p className="mb-6 text-xs font-semibold tracking-[0.16em] text-[#317d7d] uppercase">
            NextRun legal
          </p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.045em] text-balance md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#536360] md:text-lg dark:text-zinc-400">
            {description}
          </p>
          <p className="mt-8 text-sm text-[#647370] dark:text-zinc-500">
            Last updated {lastUpdated}
          </p>
          <nav
            aria-label="Legal pages"
            className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-sm"
          >
            <Link
              href="/privacy"
              className="font-medium text-[#317d7d] transition-colors hover:text-[#205e5f] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#317d7d] dark:hover:text-[#8ac5c2]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-medium text-[#317d7d] transition-colors hover:text-[#205e5f] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#317d7d] dark:hover:text-[#8ac5c2]"
            >
              Terms and Conditions
            </Link>
          </nav>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20 lg:px-8 lg:py-20">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-[#667774] uppercase dark:text-zinc-500">
          On this page
        </p>
        <nav aria-label={`${title} sections`}>
          <ol className="border-l border-[#cdd9d6] dark:border-zinc-800">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="-ml-px block border-l border-transparent py-2.5 pl-4 text-sm leading-snug text-[#647370] transition-colors hover:border-[#317d7d] hover:text-[#1e2929] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#317d7d] dark:text-zinc-500 dark:hover:text-zinc-100"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <article className="max-w-3xl min-w-0 [&_a]:font-medium [&_a]:text-[#317d7d] [&_a]:underline [&_a]:decoration-[#9dc9c6] [&_a]:underline-offset-4 hover:[&_a]:text-[#205e5f] dark:[&_a]:text-[#8ac5c2] dark:hover:[&_a]:text-[#b8e0dd] [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.025em] md:[&_h2]:text-3xl [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-[-0.015em] [&_li]:pl-1 [&_p]:leading-7 [&_p]:text-[#536360] dark:[&_p]:text-zinc-400 dark:[&_ul]:text-zinc-400">
        <div className="space-y-11 [&_section+section]:border-t [&_section+section]:border-[#d8e1df] [&_section+section]:pt-11 dark:[&_section+section]:border-zinc-800">
          {children}
        </div>
      </article>
    </section>
  </main>
);
