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
- **Contact form** — by default the form emails submissions to
  `quantumloopbih@gmail.com` via [FormSubmit](https://formsubmit.co) (no backend,
  no account). **One-time activation:** the first submission triggers a
  confirmation email from FormSubmit to that inbox — click its link once and all
  later submissions are delivered. To use a different provider, set
  **`NEXT_PUBLIC_FORM_ENDPOINT`** (or the legacy `NEXT_PUBLIC_FORMSPREE_ENDPOINT`)
  to that provider's endpoint URL; the address lives in `lib/site.ts`.

## SEO & AI discoverability

Per-page metadata, hreflang alternates, OpenGraph + Twitter tags (with the
`public/og.png` share card) and a rich `LocalBusiness` JSON-LD block (services,
geo, offer catalog, languages) are defined in `app/layout.tsx`. `app/sitemap.ts`
and `app/robots.ts` generate `sitemap.xml` / `robots.txt` at build time.

To be found and surfaced by **AI assistants / answer engines** as well as search
engines:

- `app/robots.ts` explicitly allows the major AI crawlers (GPTBot, OAI-SearchBot,
  ClaudeBot, PerplexityBot, Google-Extended, Applebot, Bingbot, …) in addition to
  `*`.
- `public/llms.txt` is a curated, trilingual summary of the business for LLMs
  (served at `/llms.txt`) — keep it in sync with the services/contact copy.
- The section copy is server-rendered into the static HTML, so crawlers that
  don't run JavaScript still read the full content.

**Set `NEXT_PUBLIC_SITE_URL` before the production build** — canonical, hreflang,
OG image, sitemap, robots and the JSON-LD `@id`/URLs all depend on it.

## Roadmap (after launch)

- **AI chat assistant** — a trilingual on-brand chat widget that answers
  questions about the services and guides visitors to request a quote. It needs
  a small serverless function to keep the Claude API key server-side (the site
  is a static export, so the key must never ship in the frontend). Planned for
  after the site is published and a host + API key are in place.

## Accessibility & motion

Every animation has a static fallback under `prefers-reduced-motion: reduce`
(scroll scenes, counters, the ribbon, magnetic buttons and Lenis all disable
themselves). Colors follow the fixed black/gold palette in `app/globals.css`.

## Deploy

The site is a static export (`output: "export"` in `next.config.ts`).
`npm run build` writes fully static files to `./out`, hostable on any static
host (Netlify, Vercel static, GitHub Pages, S3/CDN, plain nginx). Remember to set
`NEXT_PUBLIC_SITE_URL` for the target domain before building.
