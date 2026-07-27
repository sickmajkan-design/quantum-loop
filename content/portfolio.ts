import { asset } from "@/lib/asset";

/**
 * Portfolio drop-in manifest.
 *
 * The site is a static export, so it can't scan the filesystem at build time.
 * To add real work: drop image files into `public/portfolio/<slug>/` and list
 * their filenames in the matching category's `images` array below. Any category
 * with images renders real, clickable tiles (opening the lightbox); empty
 * categories fall back to styled placeholder tiles.
 *
 * `labelIndex` maps each category to its localized name in every language's
 * `tiles` array (content/{sr,de,en}.ts), so labels stay translated with no
 * extra copy to maintain.
 */
/**
 * An image is either a bare filename, or a filename plus a `title` — the real
 * client/location shown in that photo (e.g. "KORT Caffe"). The title is a
 * factual caption, never invented; leave it off when there's nothing verifiable
 * to name and the tile falls back to just the category label.
 */
export type PortfolioEntry = string | { file: string; title: string };

export interface PortfolioCategory {
  slug: string;
  labelIndex: number;
  images: PortfolioEntry[];
}

export const portfolio: PortfolioCategory[] = [
  {
    slug: "vehicle-wrap",
    labelIndex: 0,
    images: [
      { file: "01-tehpro-van-side.jpg", title: "TEHPRO CNC-Proizvodnja" },
      { file: "02-tehpro-van-rear.jpg", title: "TEHPRO CNC-Proizvodnja" },
    ],
  },
  {
    slug: "signage",
    labelIndex: 1,
    images: [
      { file: "01-3p-service-cafe-signage.jpg", title: "3P Service Café" },
      { file: "02-3p-service-install.jpg", title: "3P Service Café" },
    ],
  },
  {
    slug: "window-vinyl",
    labelIndex: 2,
    images: [
      { file: "01-hm-lacoste-orsay-storefront.jpg", title: "H&M · Lacoste · Orsay" },
      { file: "02-magic-star-wide.jpg", title: "Magic Star" },
      { file: "03-lacoste-closeup.jpg", title: "Lacoste" },
    ],
  },
  {
    slug: "tinting",
    labelIndex: 3,
    images: [
      "01-restaurant-window-tint-install.jpg",
      { file: "02-kort-caffe-restaurant-tinted.jpg", title: "KORT Caffe" },
    ],
  },
  { slug: "logo", labelIndex: 4, images: [] },
  {
    slug: "letters-3d",
    labelIndex: 5,
    images: [{ file: "01-limitless-wall-letters.jpg", title: "Limitless" }],
  },
];

export interface PortfolioImage {
  src: string;
  /** Localized category name, e.g. "Zatamnjivanje". */
  label: string;
  /** Optional real client/location shown in the photo, e.g. "KORT Caffe". */
  title?: string;
  slug: string;
}

/** Flattened list of every real image across categories, in display order. */
export function collectImages(labels: string[]): PortfolioImage[] {
  const out: PortfolioImage[] = [];
  for (const cat of portfolio) {
    for (const entry of cat.images) {
      const file = typeof entry === "string" ? entry : entry.file;
      const title = typeof entry === "string" ? undefined : entry.title;
      out.push({
        src: asset(`/portfolio/${cat.slug}/${file}`),
        label: labels[cat.labelIndex] ?? cat.slug,
        title,
        slug: cat.slug,
      });
    }
  }
  return out;
}
