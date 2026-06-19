import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - NextRun Next.js Starter",
  description:
    "Clone, configure, and ship with NextRun. Quick start, environment variables, project structure, scripts, and deployment for the production-ready Next.js 16 starter.",
  keywords: [
    "NextRun",
    "documentation",
    "docs",
    "Next.js starter",
    "quick start",
    "environment variables",
    "deployment",
    "Drizzle",
    "Better Auth",
    "Stripe",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Documentation - NextRun Next.js Starter",
    description:
      "Quick start, environment variables, project structure, scripts, and deployment for the NextRun Next.js 16 starter.",
    url: "https://nextrun.dev/docs",
    siteName: "NextRun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation - NextRun Next.js Starter",
    description:
      "Quick start, environment variables, project structure, scripts, and deployment for the NextRun Next.js 16 starter.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
