import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DOMAIN || "https://nextrun.dev",
  ),
  title: "NextRun",
  description: "NextRun - Next.js template",
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
      description: "NextRun - Next.js template",
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
      description: "NextRun - Next.js template",
      publisher: {
        "@id": "https://nextrun.dev/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://nextrun.dev/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://nextrun.dev/#software",
      name: "NextRun",
      description:
        "NextRun - Next.js template with TypeScript, Tailwind CSS, and modern development tools",
      url: "https://nextrun.dev",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
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
      description:
        "NextRun - Next.js template with TypeScript, Tailwind CSS, and modern development tools",
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
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
