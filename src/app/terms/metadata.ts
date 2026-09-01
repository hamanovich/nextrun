import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - NextRun Legal",
  description:
    "Read NextRun's terms and conditions to understand the license, usage rights, and legal terms for using the NextRun open-source boilerplate and hosted service.",
  keywords: [
    "terms and conditions",
    "legal",
    "NextRun",
    "license",
    "usage rights",
    "terms of service",
    "agreement",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms and Conditions - NextRun Legal",
    description:
      "Read NextRun's terms and conditions to understand the license, usage rights, and legal terms for using the NextRun open-source boilerplate and hosted service.",
    url: "/terms",
    siteName: "NextRun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions - NextRun Legal",
    description:
      "Read NextRun's terms and conditions to understand the license, usage rights, and legal terms.",
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
