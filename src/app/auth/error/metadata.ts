import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error - NextRun",
  description:
    "There was an error with your authentication. Please try signing in again or contact support if the problem persists.",
  keywords: [
    "authentication error",
    "login error",
    "NextRun",
    "sign in error",
    "auth error",
    "troubleshooting",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/auth/error",
  },
  openGraph: {
    title: "Authentication Error - NextRun",
    description:
      "There was an error with your authentication. Please try signing in again or contact support if the problem persists.",
    url: "https://nextrun.dev/auth/error",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Authentication Error - NextRun",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Authentication Error - NextRun",
    description:
      "There was an error with your authentication. Please try signing in again.",
    images: ["/logo.png"],
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
