import type { MetadataRoute } from "next";
import { asset } from "@/lib/asset";

export const dynamic = "force-static";

// Web app manifest — lets the site be "added to home screen" as a standalone
// app on mobile, with the brand icon and dark theme. Paths go through asset()
// so they resolve under the deployment base path (e.g. the Pages subpath).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quantum Loop s.p.",
    short_name: "Quantum Loop",
    description:
      "Grafički dizajn, reklame, brendiranje vozila, folije i zatamnjivanje stakala. Derventa · uskoro Salzburg.",
    lang: "sr-Latn",
    start_url: asset("/"),
    scope: asset("/"),
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: asset("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: asset("/icon-512.png"), sizes: "512x512", type: "image/png" },
      {
        src: asset("/icon-maskable.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
