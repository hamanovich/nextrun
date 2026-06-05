import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About NextRun - Modern Next.js Template with Telegram Bot",
  description:
    "Learn about NextRun's mission to accelerate web development with production-ready Next.js templates and integrated Telegram bots. Discover our values and technology stack.",
  keywords: [
    "NextRun",
    "Telegram Bot",
    "about",
    "mission",
    "vision",
    "values",
    "Next.js",
    "web development",
    "developer experience",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About NextRun - Modern Next.js Template with Telegram Bot",
    description:
      "Learn about NextRun's mission to accelerate web development with production-ready Next.js templates and integrated Telegram bots.",
    url: "https://nextrun.dev/about",
    siteName: "NextRun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About NextRun - Modern Next.js Template with Telegram Bot",
    description:
      "Learn about NextRun's mission to accelerate web development with production-ready Next.js templates and Telegram bots.",
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
