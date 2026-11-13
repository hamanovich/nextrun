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
  <main className="public-page bg-background text-foreground">
    <section className="border-border border-b">
      <div className="site-container">
        <div className="flex min-h-[360px] max-w-2xl flex-col justify-center py-16 md:py-20">
          <p className="text-muted-foreground mb-6 text-sm font-medium">
            NextRun legal
          </p>
          <h1 className="brand-public-title">{title}</h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7">
            {description}
          </p>
          <p className="text-muted-foreground mt-8 text-sm">
            Last updated {lastUpdated}
          </p>
          <nav
            aria-label="Legal pages"
            className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-sm"
          >
            <Link href="/privacy" className="brand-nav-link font-medium">
              Privacy Policy
            </Link>
            <Link href="/terms" className="brand-nav-link font-medium">
              Terms and Conditions
            </Link>
          </nav>
        </div>
      </div>
    </section>

    <section className="site-container grid gap-12 py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20 lg:py-20">
      <aside className="brand-toc lg:sticky lg:top-20 lg:self-start">
        <p className="text-muted-foreground mb-4 text-sm font-medium">
          On this page
        </p>
        <nav aria-label={`${title} sections`}>
          <ol className="border-border border-l">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="brand-nav-link block px-3 py-2 text-sm leading-5"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <article className="brand-prose min-w-0">
        <div className="space-y-11 [&_section+section]:border-t [&_section+section]:pt-11">
          {children}
        </div>
      </article>
    </section>
  </main>
);
