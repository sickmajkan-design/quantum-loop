# BRIEF.md — Quantum Loop s.p. Website

> Instructions for Claude Code. Read this entire file before writing any code.
> A working prototype exists in this folder: `quantum-loop-website.html`. Your job is to migrate it to Next.js and elevate it to premium agency quality (~€20,000 production value). Do NOT start from scratch — preserve everything that works in the prototype.

---

## 1. COMPANY FACTS (use exactly, do not invent others)

- **Name:** Quantum Loop s.p.
- **Services:**
  1. Graphic design (logos, branding, visual identity, print-ready artwork)
  2. Advertising production — all types of indoor & outdoor signage (lightboxes, 3D letters, banners, boards, interior company branding)
  3. Vehicle wrapping — full and partial vinyl wraps on cars, vans, trucks
  4. Vinyl/foil application on any flat surface (shop windows, glass, walls, facades)
  5. Window tinting (vehicles and buildings)
- **Experience:** 20+ years in the trade
- **Guarantee:** Written warranty on all completed work — always emphasize this
- **Location:** Vojvode Stepe Stepanovića 56, 74400 Derventa, Bosnia and Herzegovina
- **Expansion:** Opening soon in Salzburg, Austria — prominent "Uskoro u Salzburgu / Bald in Salzburg / Coming soon to Salzburg" section
- **Contact:** phone and email are `[TODO]` placeholders — never invent them

## 2. LANGUAGES

Trilingual: **Serbian (ijekavica, Latin script) default + German + English**, switcher SR | DE | EN in header.
- All copy already exists in all three languages inside the prototype's `dict` object — reuse it, move to `/content/sr.ts`, `/content/de.ts`, `/content/en.ts`.
- Any NEW Serbian copy MUST use ijekavica forms (lijepi, cijena, uvijek, vrijeme) — never ekavica.
- No lorem ipsum anywhere.

## 3. TECH STACK

- Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- GSAP + ScrollTrigger (core of the experience) + Lenis smooth scroll
- Framer Motion for micro-interactions and page transitions
- `output: 'export'` — must build to static files hostable anywhere
- No CMS — content in TS files
- Fully responsive (mobile-first — most local traffic is mobile)
- `prefers-reduced-motion` respected: static fallback for every animation
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95

## 4. VISUAL DIRECTION (already established in prototype — keep it)

- **Palette:** #0A0A0A base, #111111 surfaces, gold #C9A227 → #E5C158 (single accent), warm white #F5F2EA, muted #8a8578. No other accent colors.
- **Typography:** Anton (display, uppercase, huge — 10–14vw hero) + Inter (body). Keep the pairing.
- **Feel:** dark, cinematic, matte-black-vinyl-with-gold-foil. Sign-shop meets design studio.
- **Grain/noise overlay** across the whole site (exists in prototype — keep).
- **Signature element:** the gold "vinyl ribbon". In the prototype it's a simple vertical progress strip — UPGRADE it into an SVG ribbon that visually "wraps" around section edges as the user scrolls, connecting all services. This is the one bold device; keep everything else disciplined.

## 5. SCROLL SCENES — migrate from prototype, then elevate

Each scene must PIN (ScrollTrigger pin) while its animation plays, then release. Keep pinned durations short — the page must never feel stuck.

> **UPDATE (decided 2026-07-02, overrides the original "custom SVG only" rule below):** Client wants the physical-process scenes (vehicle wrap, flat surfaces, window tinting) to use **real stock photos/video** of hands applying vinyl/foil, not abstract SVG icons — client explicitly wants realism over iconography here and accepted the risk that generic stock imagery may not perfectly match the brand until real Quantum Loop footage/photos replace it. Source: royalty-free stock (Pexels/Unsplash or similar), self-hosted in `/public/stock/`, swappable later for the client's own photos/video the same way the Portfolio drop-in system works. Hero and the Graphic Design scene (abstract, not a physical gluing process) stay custom SVG/vector as originally specified — those are unaffected. Keep an eye on Lighthouse Performance ≥90 when adding photo/video weight (compress, lazy-load, avoid autoplay video where a still + CSS/GSAP treatment achieves the same feel).
>
> Original rule (still applies to Hero, Graphic Design, 20-years counter, Salzburg): all scenes are custom SVG in the black/gold style (no stock photos for scenes).

1. **Hero:** headline builds word-by-word (exists); gold foil "peel" sweep (exists). ADD: ambient gold dust particles, subtle parallax on scroll-out. *(custom SVG/CSS — done)*
2. **Graphic design:** pen path draws itself + logo assembles from geometric pieces (exists). ADD: cursor/pen tool detail, smoother easing. *(custom SVG — done)*
3. **Vehicle wrap:** real photo/video of hands applying gold vinyl wrap to a vehicle, scroll-scrubbed reveal/parallax, squeegee motion. ELEVATE: foil "settle" shimmer overlay at the end (CSS/GSAP over the photo).
4. **Flat surfaces:** real photo/video of hands applying vinyl to a shop window/glass surface, bubbles squeegeed out. ADD: glass reflection highlight overlay.
5. **Window tinting:** real photo/video of window tinting installation with live VLT counter 70% → 15% overlay. ADD: sun rays that visibly dim as tint applies.
6. **20 years counter:** 0 → 20+ count-up (exists) + ADD a short milestone timeline strip. *(custom SVG/CSS — unaffected)*
7. **Salzburg:** gold dashed route animates Derventa → Salzburg, pulsing marker (exists). ADD: stylized map hint (river/mountains outline). *(custom SVG — unaffected)*

## 6. PAGE STRUCTURE (same order as prototype)

1. Sticky header: transparent → solid on scroll; logo QUANTUM**LOOP** (LOOP in gold); anchor nav; SR|DE|EN switcher; gold CTA "Zatraži ponudu"; mobile slide-in menu.
2. Hero (scene 1) — badge "20+ godina iskustva", headline "Dizajn koji se lijepi.", sub, two CTAs.
3. Services — 5 blocks with scenes 2–5 + signage block (sign "lights up" flicker).
4. Guarantee — counter (scene 6), three points: Garancija / Iskustvo / Kompletna usluga.
5. Portfolio — marquee of placeholder tiles NOW; build drop-in system `/public/portfolio/{category}/` with lightbox for when real photos arrive.
6. Salzburg announcement (scene 7).
7. Contact — Derventa address, `[TODO]` phone/email, form (name, email, service dropdown, message) wired to a placeholder endpoint; embedded map of Derventa.
8. Footer — gold hairline, company info, © year.

## 7. MICRO-INTERACTIONS

- Magnetic hover on CTA buttons
- Link underline sweeps in gold
- Page/anchor transitions via Framer Motion
- Tile hover: slow zoom + gold glow
- 60fps only: animate transforms/opacity, `will-change` sparingly

## 8. SEO & META

- Per-language title/description; hreflang tags (sr, de, en)
- OpenGraph + Twitter card tags
- JSON-LD LocalBusiness: Quantum Loop s.p., Vojvode Stepe Stepanovića 56, 74400 Derventa, BA
- Favicon placeholder; sitemap; robots.txt

## 9. PROCESS — WORK ITERATIVELY

1. First output a short migration plan (file structure, component list, which prototype pieces map where). Wait for approval.
2. Build skeleton (layout, header, i18n, content files). Show it running.
3. Migrate + elevate scenes ONE AT A TIME. After each scene, stop and wait for feedback before the next.
4. Take screenshots at 375px, 768px, 1440px (Playwright) and self-review against this brief before presenting.
5. Finish with README: how to run, edit content, add portfolio images, deploy.

## 10. WHAT NOT TO DO

- No generic template look (no purple gradients, no default shadcn hero, no stock-photo hero with dark overlay) — hero itself stays custom SVG, this rule is unaffected by the section 5 stock-photo update
- No heavy video backgrounds — if video is used for a process scene (section 5 update), keep it short, muted, compressed, and scroll-triggered rather than an autoplaying background
- No second accent color
- No invented phone numbers, emails, prices, or client names — clearly marked placeholders only
- No ekavica in Serbian copy
- Do not discard prototype copy, palette, or scene concepts — elevate them (exception: vehicle wrap / flat surfaces / window tinting scene *visuals* are replaced with real stock photo per the section 5 update; copy/palette are unaffected)
