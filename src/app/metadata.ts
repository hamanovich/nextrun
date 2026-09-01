import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextRun - Production-Ready Next.js Template & Telegram Bot",
  description:
    "Get your next web application and Telegram bot up and running in minutes with our production-ready Next.js template. Includes authentication, payments, and modern UI components.",
  keywords: [
    "Next.js",
    "template",
    "React",
    "TypeScript",
    "Telegram bot",
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
    title: "NextRun - Production-Ready Next.js Template & Telegram Bot",
    description:
      "Get your next web application and Telegram bot up and running in minutes with our production-ready Next.js template. Includes authentication, payments, and modern UI components.",
    url: "/",
    siteName: "NextRun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextRun - Production-Ready Next.js Template & Telegram Bot",
    description:
      "Get your next web application and Telegram bot up and running in minutes with our production-ready Next.js template.",
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
