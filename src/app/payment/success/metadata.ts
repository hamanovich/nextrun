import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful - NextRun",
  description:
    "Your payment has been processed successfully. Thank you for your purchase! Access your NextRun template and start building your next project.",
  keywords: [
    "payment success",
    "purchase confirmed",
    "NextRun",
    "payment complete",
    "thank you",
    "order confirmed",
  ],
  authors: [{ name: "NextRun Team" }],
  creator: "NextRun",
  publisher: "NextRun",
  alternates: {
    canonical: "/payment/success",
  },
  openGraph: {
    title: "Payment Successful - NextRun",
    description:
      "Your payment has been processed successfully. Thank you for your purchase! Access your NextRun template and start building your next project.",
    url: "https://nextrun.dev/payment/success",
    siteName: "NextRun",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Payment Successful - NextRun",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment Successful - NextRun",
    description:
      "Your payment has been processed successfully. Thank you for your purchase!",
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
