import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import Script from "next/script";
import { env } from "@/lib/env";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { Providers } from "@/components/providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "Get your next web application and Telegram bot up and running in minutes with our production-ready Next.js template. Includes authentication, payments, and modern UI components.";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN || "https://nextrun.dev"),
  title: "NextRun - Production-Ready Next.js Template & Telegram Bot",
  description: SITE_DESCRIPTION,
  applicationName: "NextRun",
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
      "@id": "https://nextrun.dev/#organization",
      name: "NextRun",
      url: "https://nextrun.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://nextrun.dev/logo.png",
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
      "@id": "https://nextrun.dev/#website",
      url: "https://nextrun.dev",
      name: "NextRun",
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": "https://nextrun.dev/#organization",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://nextrun.dev/#software",
      name: "NextRun",
      description: SITE_DESCRIPTION,
      url: "https://nextrun.dev",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0",
        priceCurrency: "USD",
      },
      author: {
        "@id": "https://nextrun.dev/#organization",
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
      "@id": "https://nextrun.dev/#webpage",
      url: "https://nextrun.dev",
      name: "NextRun - Next.js Template",
      description: SITE_DESCRIPTION,
      isPartOf: {
        "@id": "https://nextrun.dev/#website",
      },
      about: {
        "@id": "https://nextrun.dev/#software",
      },
      publisher: {
        "@id": "https://nextrun.dev/#organization",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          {children}
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
