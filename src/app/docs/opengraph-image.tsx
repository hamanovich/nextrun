import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/og-image";

export const alt = "Documentation - NextRun Next.js Starter";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const Image = async () =>
  renderOgImage({
    title: "Clone, Configure, and Ship",
    description:
      "Quick start, environment variables, project structure, scripts, and deployment for the production-ready NextRun Next.js 16 starter.",
    pills: [
      { label: "Quick Start" },
      { label: "Environment" },
      { label: "Deployment" },
    ],
  });

export default Image;
