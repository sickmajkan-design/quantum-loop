# Quantum Loop s.p. — Website

Premium, trilingual (SR · DE · EN) marketing site for Quantum Loop s.p. —
graphic design, signage, vehicle wrapping, vinyl application and window tinting.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, with
**GSAP + ScrollTrigger** scroll scenes, **Lenis** smooth scrolling and
**Framer Motion** micro-interactions. Ships as a fully static export.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # static export -> ./out
npm run lint
```

## Edit content (copy & translations)

All text lives in TypeScript — no CMS. Each language has its own file, and they
share the shape defined in `content/types.ts`:

- `content/sr.ts` — Serbian (ijekavica, Latin script) — **default**
- `content/de.ts` — German
- `content/en.ts` — English

Rules:

- Keep all three files in sync — the `Dictionary` type will fail the build if a
  key is missing.
- Serbian copy must use **ijekavica** forms (lijepi, cijena, uvijek, vrijeme).
- Phone/email are deliberate `[TODO]` placeholders (in `components/sections/Contact.tsx`)
  — replace them only with confirmed real values.

The language switcher (SR | DE | EN) is client-side; the default language is set
in `content/index.ts`.

## Add portfolio photos

The Portfolio section auto-detects real work via a small manifest — no layout
changes needed. Full instructions live in `public/portfolio/README.md`. In short:

1. Drop images into `public/portfolio/<category>/` (e.g. `vehicle-wrap/`).
2. List the filenames in `content/portfolio.ts` under that category's `images`.

As soon as any category has images, the placeholder marquee is replaced by a
real tile grid with a full-screen lightbox (click a tile; ← → / ‹ › to navigate;
Esc to close).

The physical-process scene photos (vehicle wrap, flat surface, window tint) are
stock placeholders in `public/stock/` (see `public/stock/SOURCES.md`) and are
swapped the same way — replace the file, keep the name.

## Configuration

- **`NEXT_PUBLIC_SITE_URL`** — production origin (no trailing slash), used for
  canonical URLs, OpenGraph, `sitemap.xml`, `robots.txt` and JSON-LD. Set it in
  the deploy environment; it defaults to `http://localhost:3000` for local dev.
- **`NEXT_PUBLIC_FORMSPREE_ENDPOINT`** — optional. When set, the contact form
  POSTs to it (e.g. a Formspree form URL). Until then the form shows the
  confirmation message without sending anywhere.

## SEO

Per-page metadata, hreflang alternates, OpenGraph + Twitter tags and a
`LocalBusiness` JSON-LD block are defined in `app/layout.tsx`. `app/sitemap.ts`
and `app/robots.ts` generate `sitemap.xml` / `robots.txt` at build time.

## Accessibility & motion

Every animation has a static fallback under `prefers-reduced-motion: reduce`
(scroll scenes, counters, the ribbon, magnetic buttons and Lenis all disable
themselves). Colors follow the fixed black/gold palette in `app/globals.css`.

## Deploy

The site is a static export (`output: "export"` in `next.config.ts`).
`npm run build` writes fully static files to `./out`, hostable on any static
host (Netlify, Vercel static, GitHub Pages, S3/CDN, plain nginx). Remember to set
`NEXT_PUBLIC_SITE_URL` for the target domain before building.
