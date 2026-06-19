import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/og-image";

export const alt = "About NextRun - Modern Next.js Template with Telegram Bot";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const Image = async () =>
  renderOgImage({
    title: "Accelerating Web Development",
    description:
      "NextRun's mission is to get your next web app and Telegram bot shipping in minutes - with a production-ready stack and modern developer experience.",
    pills: [
      { label: "Mission" },
      { label: "Tech Stack" },
      { label: "Developer Experience" },
    ],
  });

export default Image;
