import Link from "next/link";
import { version } from "@app";
import { Logo } from "@/components/navbar/logo";
import { footerLegalLinks, footerSections } from "./footer.constants";

export const Footer = () => (
  <footer className="product-compact border-t">
    <div className="site-container px-6 py-12">
      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-foreground flex items-center gap-2">
              <Logo />
              <span className="text-lg font-semibold">NextRun</span>
            </Link>
            <span className="text-muted-foreground text-xs font-normal">
              v{version}
            </span>
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            A production-ready Next.js starter with authentication, payments,
            and a Telegram bot. Clone it and build the part that matters.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-16">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="text-muted-foreground mt-4 flex flex-col gap-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className="brand-nav-link">
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="brand-nav-link"
                        {...(link.href.startsWith("mailto:")
                          ? {}
                          : { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {link.name}{" "}
                        {!link.href.startsWith("mailto:") && (
                          <span className="sr-only"> (opens in a new tab)</span>
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row">
        <p>
          © {new Date().getFullYear()} NextRun. All rights reserved.{" "}
          <a
            href="https://www.hamanovich.com/"
            className="brand-nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            by Hamanovich <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        <ul className="flex gap-6">
          {footerLegalLinks.map((link) => (
            <li key={link.href || link.name}>
              {link.href.startsWith("/") ? (
                <Link href={link.href} className="brand-nav-link">
                  {link.name}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="brand-nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}{" "}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);
