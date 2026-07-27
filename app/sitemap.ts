import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// One entry per language page, each advertising all language versions so search
// engines index and serve the right one. SITE_URL already carries the base path
// on the preview deployment.
// Trailing slashes to match the canonical URLs (next.config trailingSlash).
const languages = {
  "sr-Latn": `${SITE_URL}/`,
  de: `${SITE_URL}/de/`,
  en: `${SITE_URL}/en/`,
};

const PAGES: { url: string; priority: number }[] = [
  { url: `${SITE_URL}/`, priority: 1 },
  { url: `${SITE_URL}/de/`, priority: 0.9 },
  { url: `${SITE_URL}/en/`, priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(({ url, priority }) => ({
    url,
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: { languages },
  }));
}
