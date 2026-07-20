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
export interface PortfolioCategory {
  slug: string;
  labelIndex: number;
  images: string[];
}

export const portfolio: PortfolioCategory[] = [
  { slug: "vehicle-wrap", labelIndex: 0, images: [] },
  {
    slug: "signage",
    labelIndex: 1,
    images: ["01-kort-caffe-restaurant.jpg"],
  },
  {
    slug: "window-vinyl",
    labelIndex: 2,
    images: [
      "01-hm-lacoste-orsay-storefront.jpg",
      "02-magic-star-wide.jpg",
      "03-lacoste-closeup.jpg",
    ],
  },
  {
    slug: "tinting",
    labelIndex: 3,
    images: [
      "01-restaurant-window-tint-install.jpg",
      "02-restaurant-window-tint-install-2.jpg",
    ],
  },
  { slug: "logo", labelIndex: 4, images: [] },
  {
    slug: "letters-3d",
    labelIndex: 5,
    images: ["01-limitless-wall-letters.jpg"],
  },
];

export interface PortfolioImage {
  src: string;
  label: string;
  slug: string;
}

/** Flattened list of every real image across categories, in display order. */
export function collectImages(labels: string[]): PortfolioImage[] {
  const out: PortfolioImage[] = [];
  for (const cat of portfolio) {
    for (const file of cat.images) {
      out.push({
        src: `/portfolio/${cat.slug}/${file}`,
        label: labels[cat.labelIndex] ?? cat.slug,
        slug: cat.slug,
      });
    }
  }
  return out;
}
