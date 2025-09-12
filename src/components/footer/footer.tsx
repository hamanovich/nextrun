import React from "react";
import Link from "next/link";
import { Logo } from "@/components/navbar/logo";
import { footerLegalLinks, footerSections } from "./footer.constants";

export const Footer = () => (
  <section className="py-8 px-4 md:px-6">
    <div className="container mx-auto max-w-screen-2xl gap-4">
      <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
        <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
          <div className="flex items-center gap-2 lg:justify-start">
            <Link href="/">
              <Logo />
            </Link>
            <h2 className="text-xl font-semibold">NextRun.dev</h2>
          </div>
          <p className="text-muted-foreground max-w-[70%] text-sm">
            A powerful Next.js template that comes pre-configured with modern
            authentication, payment processing, and beautiful UI components.
            Skip the setup headaches and focus on building your next big idea.
            Everything you need to launch faster.
          </p>
        </div>
        <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
          {footerSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 font-bold">{section.title}</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {section.links.map((link) => (
                  <li
                    key={link.href}
                    className="hover:text-primary font-medium"
                  >
                    {link.href.startsWith("/") ? (
                      <Link href={link.href}>{link.name}</Link>
                    ) : (
                      <a
                        href={link.href}
                        {...(link.href.startsWith("mailto:")
                          ? {}
                          : { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
        <p className="order-2 lg:order-1">
          © {new Date().getFullYear()} NextRun.dev. All rights reserved.
        </p>
        <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
          {footerLegalLinks.map((link) => (
            <li key={link.href || link.name} className="hover:text-primary">
              {link.href.startsWith("/") ? (
                <Link href={link.href}>{link.name}</Link>
              ) : (
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
