# Stock / scene media

The four "process" scenes (Graphic design, Vehicle wrap, Flat surfaces, Window
tinting) each render a short **video** with a still **poster** as the fallback.
Both are swappable drop-ins under `public/stock/` — no code changes needed.

## How the scenes load media

Each scene (`components/sections/scenes/*Scene.tsx`) points at a fixed pair:

| Scene            | Video (`.mp4`)              | Poster / fallback (`.jpg`)   |
| ---------------- | --------------------------- | ---------------------------- |
| Graphic design   | `graphic-design.mp4`        | `graphic-design.jpg`         |
| Vehicle wrap     | *(still only, see below)*   | `vehicle-wrap.jpg`           |
| Flat surfaces    | *(collage, see below)*      | `flat-surface.jpg`           |
| Window tinting   | `window-tint.mp4`           | `window-tint.jpg`            |
| Signage          | `signage.mp4`               | `signage.jpg`                |

- The `.jpg` shows immediately and stays as the static fallback under
  `prefers-reduced-motion` and until the matching `.mp4` is present, so a
  missing video never breaks the layout.
- Keep clips short, **muted**, and compressed (they play muted+looped, poster
  ~1600px wide) to hold Lighthouse Performance ≥ 90.

## Current media (2026-07-16)

AI-generated with Higgsfield to match the black/gold brand (client couldn't use
generic stock, and the session's egress policy blocks pulling the renders into
the repo automatically — so they are saved in from the Higgsfield panel).

Images — model `z_image`; videos — image-to-video `seedance_2_0_mini`, 720p, 5s,
4:3, silent, subtle "cinemagraph" motion. Save each render from the panel to the
path below (overwrite any placeholder) and commit:

- Graphic design — designer at a multi-monitor workstation building a logo.
  Image job `8ad3f62b` → `graphic-design.jpg`; video job `e58dacb2` → `graphic-design.mp4`.
  (`graphic-design.jpg` currently holds a temporary locally-generated placeholder.)
- Vehicle wrap — no video. The install-technique clip and the close-up
  installer stills both read poorly (wrinkled film, no sense of the finished
  product), so the scene now shows the *result* instead: a car's side profile
  with a black/gold branded wrap graphic. `WrapScene.tsx` renders this as a
  plain fading-in still (no `VideoScene`). `vehicle-wrap.jpg` — z_image,
  regenerated 2026-07-20.
- Flat surfaces — no video. The client does high volume in surface film work
  that a single install close-up doesn't represent, so `FlatSurfaceScene.tsx`
  is now a 3-panel collage: shop windows/glass (existing `flat-surface.jpg`),
  building sun-protection film, and vehicle PPF (paint-protection film — the
  clear protective kind, distinct from the decorative wrap graphic in the
  vehicle-wrap scene). The latter two are placeholder panels (icon + label)
  pending Higgsfield renders — generation was unavailable when this was built.
  When ready: generate a building-facade shot with gold/bronze-tinted windows
  → save as `sun-protection.jpg`, and a car body with clear PPF film →
  `ppf.jpg`, then swap the two placeholder `<div>` blocks in
  `FlatSurfaceScene.tsx` for `<Image>` tags pointing at them.
- Window tinting — hands squeegeeing tint film onto a car window (VLT counter
  overlays 70 → 15 in the scene).
  Image job `172ed0bb` → `window-tint.jpg`; video job `5d706e48` → `window-tint.mp4`.

- Signage — large outdoor illuminated pylon sign that lights up then rotates to
  reveal its aluminium side/back. Image job `32c9b14c` → `signage.jpg`; video job
  `8790ba9a` → `signage.mp4`. (`signage.jpg` currently holds a temporary
  locally-generated placeholder.) The earlier CSS 3D lightbox is preserved in
  `components/sections/scenes/SignageScene3D.tsx` — import it from Services to
  revert.

The previous Pexels stock stills that `vehicle-wrap.jpg` / `flat-surface.jpg` /
`window-tint.jpg` used to hold are being replaced by the AI images above; swap
the files, keep the names.

## Don't want a video on a given scene?

Just don't add its `.mp4` — the poster `.jpg` shows on its own. (For a fancier
still-only treatment on a scene, ask and I'll re-add a CSS/GSAP animation.)
