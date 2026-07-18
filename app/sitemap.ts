import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "sr-Latn": `${SITE_URL}/`,
          de: `${SITE_URL}/`,
          en: `${SITE_URL}/`,
        },
      },
    },
  ];
}
