import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/og-image";

export const alt = "Privacy Policy - NextRun Data Protection";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const Image = async () =>
  renderOgImage({
    title: "Privacy Policy",
    description:
      "How NextRun collects, uses, and protects your personal information - and the privacy rights you have over your data.",
    pills: [{ label: "Data Protection" }, { label: "Your Rights" }],
  });

export default Image;
