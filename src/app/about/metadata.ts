import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About NextRun - Making Web Development Effortless",
  description:
    "Learn about NextRun's mission to accelerate web development with production-ready Next.js templates. Discover our values, technology stack, and commitment to developer experience.",
  keywords: [
    "NextRun",
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
    title: "About NextRun - Making Web Development Effortless",
    description:
      "Learn about NextRun's mission to accelerate web development with production-ready Next.js templates. Discover our values, technology stack, and commitment to developer experience.",
    url: "https://nextrun.dev/about",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "About NextRun - Making Web Development Effortless",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About NextRun - Making Web Development Effortless",
    description:
      "Learn about NextRun's mission to accelerate web development with production-ready Next.js templates.",
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
