# Stock / scene media

The four "process" scenes (Graphic design, Vehicle wrap, Flat surfaces, Window
tinting) each render a short **video** with a still **poster** as the fallback.
Both are swappable drop-ins under `public/stock/` — no code changes needed.

## How the scenes load media

Each scene (`components/sections/scenes/*Scene.tsx`) points at a fixed pair:

| Scene            | Video (`.mp4`)              | Poster / fallback (`.jpg`)   |
| ---------------- | --------------------------- | ---------------------------- |
| Graphic design   | `graphic-design.mp4`        | `graphic-design.jpg`         |
| Vehicle wrap     | `vehicle-wrap.mp4`          | `vehicle-wrap.jpg`           |
| Flat surfaces    | `flat-surface.mp4`          | `flat-surface.jpg`           |
| Window tinting   | `window-tint.mp4`           | `window-tint.jpg`            |

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
- Vehicle wrap — gloved hands squeegeeing vinyl onto a car panel.
  Image job `b9fd0502` → `vehicle-wrap.jpg`; video job `0cdc2aff` → `vehicle-wrap.mp4`.
- Flat surfaces — hands applying vinyl to a glass shop window.
  Image job `03d92970` → `flat-surface.jpg`; video job `4c0cb8e4` → `flat-surface.mp4`.
- Window tinting — hands squeegeeing tint film onto a car window (VLT counter
  overlays 70 → 15 in the scene).
  Image job `172ed0bb` → `window-tint.jpg`; video job `5d706e48` → `window-tint.mp4`.

The previous Pexels stock stills that `vehicle-wrap.jpg` / `flat-surface.jpg` /
`window-tint.jpg` used to hold are being replaced by the AI images above; swap
the files, keep the names.

## Don't want a video on a given scene?

Just don't add its `.mp4` — the poster `.jpg` shows on its own. (For a fancier
still-only treatment on a scene, ask and I'll re-add a CSS/GSAP animation.)
