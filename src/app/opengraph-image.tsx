import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/og-image";

export const alt = "NextRun - Production-Ready Next.js Template & Telegram Bot";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const Image = async () =>
  renderOgImage({
    title: "Build Modern Web Apps in Minutes, Not Hours",
    description:
      "A production-ready Next.js 16 starter with authentication, Stripe payments, and a Telegram bot - wired up and ready to ship.",
    pills: [
      { label: "Better Auth" },
      { label: "Stripe Payments" },
      { label: "Telegram Bot" },
    ],
  });

export default Image;
