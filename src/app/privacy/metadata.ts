import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - NextRun Data Protection",
  description:
    "Read NextRun's privacy policy to understand how we collect, use, and protect your personal information. Learn about our data practices and your privacy rights.",
  keywords: [
    "privacy policy",
    "data protection",
    "NextRun",
    "privacy rights",
    "personal information",
    "GDPR",
    "data security",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy - NextRun Data Protection",
    description:
      "Read NextRun's privacy policy to understand how we collect, use, and protect your personal information. Learn about our data practices and your privacy rights.",
    url: "https://nextrun.dev/privacy",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - NextRun Data Protection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - NextRun Data Protection",
    description:
      "Read NextRun's privacy policy to understand how we collect, use, and protect your personal information.",
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
