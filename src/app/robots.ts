import { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_DOMAIN;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/profile/", "/payment/success", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
