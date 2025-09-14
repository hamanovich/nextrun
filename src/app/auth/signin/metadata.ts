import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - NextRun Authentication",
  description:
    "Sign in to your NextRun account to access your dashboard, manage your profile, and use our Next.js template services. Secure authentication with Google OAuth.",
  keywords: [
    "sign in",
    "login",
    "authentication",
    "NextRun",
    "Google OAuth",
    "account access",
    "secure login",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/auth/signin",
  },
  openGraph: {
    title: "Sign In - NextRun Authentication",
    description:
      "Sign in to your NextRun account to access your dashboard, manage your profile, and use our Next.js template services. Secure authentication with Google OAuth.",
    url: "https://nextrun.dev/auth/signin",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Sign In - NextRun Authentication",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In - NextRun Authentication",
    description:
      "Sign in to your NextRun account to access your dashboard and manage your profile.",
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
