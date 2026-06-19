import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/og-image";

export const alt = "Terms and Conditions - NextRun Legal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const Image = async () =>
  renderOgImage({
    title: "Terms and Conditions",
    description:
      "The license, usage rights, and legal terms for using the NextRun open-source boilerplate and hosted service.",
    pills: [{ label: "License" }, { label: "Usage Rights" }],
  });

export default Image;
