import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - NextRun Next.js Template & Telegram Bot Plans",
  description:
    "Choose the perfect NextRun plan for your project. Affordable pricing for production-ready Next.js templates and Telegram bots with authentication, payments, and modern UI components.",
  keywords: [
    "pricing",
    "Telegram Bot",
    "NextRun",
    "Next.js template",
    "plans",
    "subscription",
    "cost",
    "value",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing - NextRun Next.js Template & Telegram Bot Plans",
    description:
      "Choose the perfect NextRun plan for your project. Affordable pricing for production-ready Next.js templates and Telegram bots.",
    url: "/pricing",
    siteName: "NextRun",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/pricing/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NextRun - Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/pricing/opengraph-image", alt: "NextRun - Pricing" }],
    title: "Pricing - NextRun Next.js Template & Telegram Bot Plans",
    description:
      "Choose the perfect NextRun plan for your project. Affordable pricing for production-ready Next.js templates and Telegram bots.",
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
