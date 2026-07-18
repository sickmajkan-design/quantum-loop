/**
 * Site-wide constants for metadata, sitemap, robots and structured data.
 *
 * `SITE_URL` must point at the production origin for canonical/OG/sitemap URLs
 * to be correct. Set `NEXT_PUBLIC_SITE_URL` at build time (e.g. in the deploy
 * environment); it falls back to localhost for local development. No public
 * domain is hard-coded here because none has been confirmed for the business.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const business = {
  name: "Quantum Loop s.p.",
  street: "Vojvode Stepe Stepanovića 55",
  city: "Derventa",
  postalCode: "74400",
  countryCode: "BA",
  // Phone/email are intentionally omitted — they remain [TODO] until confirmed.
} as const;
