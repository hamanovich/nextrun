import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/og-image";

export const alt = "Pricing - NextRun Next.js Template & Telegram Bot Plans";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const Image = async () =>
  renderOgImage({
    title: "Simple, Honest Pricing",
    description:
      "Pick the plan that fits your project. Production-ready Next.js templates and Telegram bots with auth, payments, and modern UI built in.",
    pills: [
      { label: "Credit System" },
      { label: "No Lock-in" },
      { label: "Cancel Anytime" },
    ],
  });

export default Image;
