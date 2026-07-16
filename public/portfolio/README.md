# Portfolio drop-in

Add real Quantum Loop photos here — no code changes to the layout needed.

1. Drop image files into the matching category folder:
   - `vehicle-wrap/`  — vehicle wraps
   - `signage/`       — illuminated signs / signage
   - `window-vinyl/`  — shop window & flat-surface vinyl
   - `tinting/`       — window tinting
   - `logo/`          — logo & graphic design
   - `letters-3d/`    — 3D letters
2. List each filename in `content/portfolio.ts` under that category's `images`
   array, e.g.:
   ```ts
   { slug: "vehicle-wrap", labelIndex: 0, images: ["golf-gold.jpg", "van-side.jpg"] },
   ```

As soon as any category has images, the Portfolio section swaps from the
placeholder marquee to a real tile grid with a full-screen lightbox
(click a tile; arrow keys / ‹ › to navigate; Esc to close).

Recommended: JPG/WebP, ~1600px on the long edge, compressed (keeps Lighthouse
Performance ≥ 90). Filenames become part of the URL, so use lowercase-with-dashes.
