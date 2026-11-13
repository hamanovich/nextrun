import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-in error - NextRun",
  description:
    "Review a sign-in problem and retry accessing your NextRun account.",
  openGraph: {
    title: "Sign-in error - NextRun",
    description:
      "Review a sign-in problem and retry accessing your NextRun account.",
    type: "website",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "NextRun" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign-in error - NextRun",
    description:
      "Review a sign-in problem and retry accessing your NextRun account.",
    images: [{ url: "/opengraph-image", alt: "NextRun" }],
  },
};
