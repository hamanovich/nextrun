import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in - NextRun",
  description: "Sign in to your NextRun account.",
  openGraph: {
    title: "Sign in - NextRun",
    description: "Sign in to your NextRun account.",
    type: "website",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "NextRun" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign in - NextRun",
    description: "Sign in to your NextRun account.",
    images: [{ url: "/opengraph-image", alt: "NextRun" }],
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <main className="product-compact">{children}</main>
);

export default AuthLayout;
