import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile - NextRun Dashboard",
  description:
    "Manage your NextRun account, view payment information, and access your user dashboard. Secure profile management with authentication and payment details.",
  keywords: [
    "profile",
    "dashboard",
    "account",
    "user",
    "NextRun",
    "settings",
    "payment",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/profile",
  },
  openGraph: {
    title: "User Profile - NextRun Dashboard",
    description:
      "Manage your NextRun account, view payment information, and access your user dashboard. Secure profile management with authentication and payment details.",
    url: "https://nextrun.dev/profile",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "User Profile - NextRun Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "User Profile - NextRun Dashboard",
    description:
      "Manage your NextRun account, view payment information, and access your user dashboard.",
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
