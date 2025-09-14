import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - NextRun Next.js Template Plans",
  description:
    "Choose the perfect NextRun plan for your project. Affordable pricing for production-ready Next.js templates with authentication, payments, and modern UI components.",
  keywords: [
    "pricing",
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
    title: "Pricing - NextRun Next.js Template Plans",
    description:
      "Choose the perfect NextRun plan for your project. Affordable pricing for production-ready Next.js templates with authentication, payments, and modern UI components.",
    url: "https://nextrun.dev/pricing",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Pricing - NextRun Next.js Template Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - NextRun Next.js Template Plans",
    description:
      "Choose the perfect NextRun plan for your project. Affordable pricing for production-ready Next.js templates.",
    images: ["/logo.png"],
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
