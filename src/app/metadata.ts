import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextRun - Production-Ready Next.js Template",
  description:
    "Get your next web application up and running in minutes with our production-ready Next.js template. Includes authentication, payments, and modern UI components.",
  keywords: [
    "Next.js",
    "template",
    "React",
    "TypeScript",
    "authentication",
    "payments",
    "Stripe",
    "production-ready",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NextRun - Production-Ready Next.js Template",
    description:
      "Get your next web application up and running in minutes with our production-ready Next.js template. Includes authentication, payments, and modern UI components.",
    url: "https://nextrun.dev",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "NextRun - Production-Ready Next.js Template",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextRun - Production-Ready Next.js Template",
    description:
      "Get your next web application up and running in minutes with our production-ready Next.js template.",
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
