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

// A preview deployment (e.g. the GitHub Pages staging URL) must not be indexed
// by search engines or AI crawlers — only the real production domain should.
// The Pages workflow sets NEXT_PUBLIC_PREVIEW=1 for staging builds.
export const IS_PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

export const business = {
  name: "Quantum Loop s.p.",
  street: "Vojvode Stepe Stepanovića 56",
  city: "Derventa",
  postalCode: "74400",
  countryCode: "BA",
  email: "quantumloopbih@gmail.com",
  instagram: "https://www.instagram.com/quantumloopbih/",
  // Display label + tel: URL (E.164, no spaces) per region.
  phones: [
    { region: "BiH", display: "+387 65 577 672", tel: "+38765577672" },
    { region: "AT", display: "+43 667 336 1966", tel: "+436673361966" },
  ],
  // Exact coordinates from the verified Google Business listing (see the CID
  // pin wired into the contact map), not an approximate address geocode.
  geo: { lat: 44.9842752, lng: 17.8894742 },
} as const;
