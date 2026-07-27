import type { Metadata } from "next";
import { IS_PREVIEW } from "@/lib/site";
import type { Lang } from "@/content";

// Each language is its own indexable page. Serbian is the default at the root;
// German and English live at /de and /en. Paths are relative — Next resolves
// them against metadataBase (and the deployment base path).
const PATH: Record<Lang, string> = { sr: "/", de: "/de", en: "/en" };
const OG_LOCALE: Record<Lang, string> = {
  sr: "sr_Latn",
  de: "de_DE",
  en: "en_US",
};

const META: Record<Lang, { title: string; description: string }> = {
  sr: {
    title: "Quantum Loop — Dizajn koji se lijepi",
    description:
      "Grafički dizajn, reklame, brendiranje vozila, folije i zatamnjivanje stakala. 20+ godina iskustva. Derventa · uskoro Salzburg.",
  },
  de: {
    title: "Quantum Loop — Design, das haftet",
    description:
      "Grafikdesign, Werbetechnik, Fahrzeugbeschriftung, Folien und Scheibentönung. 20+ Jahre Erfahrung. Derventa · bald Salzburg.",
  },
  en: {
    title: "Quantum Loop — Design that sticks",
    description:
      "Graphic design, signage, vehicle wrapping, surface films and window tinting. 20+ years of experience. Derventa · Salzburg soon.",
  },
};

// Every page advertises all language versions (+ x-default) so search engines
// serve the right one per user.
const languageAlternates: Record<string, string> = {
  "sr-Latn": PATH.sr,
  de: PATH.de,
  en: PATH.en,
  "x-default": PATH.sr,
};

export function buildMetadata(lang: Lang): Metadata {
  const { title, description } = META[lang];
  const path = PATH[lang];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      siteName: "Quantum Loop s.p.",
      title,
      description,
      url: path,
      locale: OG_LOCALE[lang],
      alternateLocale: (["sr", "de", "en"] as Lang[])
        .filter((l) => l !== lang)
        .map((l) => OG_LOCALE[l]),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    robots: IS_PREVIEW
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
