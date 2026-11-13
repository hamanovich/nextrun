import type { Metadata } from "next";
import { geistMono, literata, plexSans } from "@/lib/fonts";
import "./globals.css";
import type { ReactNode } from "react";
import Script from "next/script";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { Providers } from "@/components/providers/providers";

const SITE_DESCRIPTION =
  "Get your next web application and Telegram bot up and running in minutes with our production-ready Next.js template. Includes authentication, payments, and modern UI components.";

const SITE_URL = env.NEXT_PUBLIC_DOMAIN || "https://nextrun.hamanovich.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NextRun - Production-Ready Next.js Template & Telegram Bot",
  description: SITE_DESCRIPTION,
  applicationName: "NextRun",
  openGraph: {
    title: "NextRun",
    description: SITE_DESCRIPTION,
    siteName: "NextRun",
    type: "website",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "NextRun" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextRun",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: "NextRun" }],
  },
  manifest: "/manifest.json",
  authors: [
    {
      url: "https://www.linkedin.com/in/hamanovich/",
      name: "Siarhei Hamanovich",
    },
  ],
  keywords: [
    "nextrun",
    "nextjs",
    "typescript",
    "tailwind",
    "shadcn",
    "ui",
    "react",
    "javascript",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "NextRun",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      description: SITE_DESCRIPTION,
      founder: {
        "@type": "Person",
        name: "Siarhei Hamanovich",
        url: "https://www.linkedin.com/in/hamanovich/",
        email: "dev.hamanovich@gmail.com",
      },
      sameAs: ["https://github.com/hamanovich/nextrun"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "NextRun",
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "NextRun",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0",
        priceCurrency: "USD",
      },
      author: {
        "@id": `${SITE_URL}/#organization`,
      },
      keywords: [
        "nextrun",
        "nextjs",
        "typescript",
        "tailwind",
        "shadcn",
        "ui",
        "react",
        "javascript",
        "postgresql",
        "drizzle",
        "auth",
        "stripe",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "NextRun - Next.js Template",
      description: SITE_DESCRIPTION,
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#software`,
      },
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <link rel="dns-prefetch" href="//js.stripe.com" />
      </head>
      <body
        className={cn(
          plexSans.variable,
          literata.variable,
          geistMono.variable,
          "flex min-h-[100dvh] flex-col antialiased",
        )}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <div className="min-w-0 flex-1">{children}</div>
          <Footer />
          <Toaster />
        </Providers>
        {env.NEXT_PUBLIC_UMAMI_URL && env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={`${env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
            data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
