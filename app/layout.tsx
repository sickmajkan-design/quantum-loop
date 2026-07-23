import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, IS_PREVIEW, business } from "@/lib/site";
import { asset } from "@/lib/asset";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Ribbon from "@/components/layout/Ribbon";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Cookieless, GDPR-friendly visit counter (no banner needed). Free at
// goatcounter.com — sign up, pick a site code, then set
// NEXT_PUBLIC_GOATCOUNTER_CODE to it (e.g. in the Pages workflow's env
// block). Left unset by default, so nothing loads until configured.
const GOATCOUNTER_CODE = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

const TITLE = "Quantum Loop — Dizajn koji se lijepi";
const DESCRIPTION =
  "Grafički dizajn, reklame, brendiranje vozila, folije i zatamnjivanje stakala. 20+ godina iskustva. Derventa · uskoro Salzburg.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Quantum Loop",
  },
  description: DESCRIPTION,
  applicationName: "Quantum Loop",
  keywords: [
    "grafički dizajn",
    "reklame",
    "svjetleće reklame",
    "3D slova",
    "brendiranje vozila",
    "auto folije",
    "zatamnjivanje stakala",
    "folije",
    "Derventa",
    "Salzburg",
    "Fahrzeugbeschriftung",
    "Werbetechnik",
    "Scheibentönung",
    "vehicle wrapping",
    "window tinting",
    "signage",
  ],
  // Per-language title/description/canonical/hreflang/OG are set on each page
  // via buildMetadata() (lib/seo.ts), since every language is its own route.
  robots: IS_PREVIEW
    ? { index: false, follow: false }
    : { index: true, follow: true },
  icons: {
    // asset() prefixes the base path — Next does NOT auto-prefix these icon
    // hrefs (unlike the manifest link), so on the Pages subpath they'd 404.
    icon: [
      { url: asset("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { url: asset("/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: asset("/apple-icon.png"), sizes: "180x180" }],
  },
};

// Matches the body background — colors the mobile browser's UI chrome
// (address bar / status bar) to match the site instead of default white/grey.
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const SERVICES: { name: string; description: string }[] = [
  {
    name: "Grafički dizajn",
    description:
      "Logotipi, vizuelni identiteti i pripreme za štampu — dizajn koji brend čini prepoznatljivim.",
  },
  {
    name: "Reklame i svjetleće reklame",
    description:
      "Svijetleće reklame, 3D slova, baneri, table i unutrašnje brendiranje kompanija — od proizvodnje do montaže.",
  },
  {
    name: "Brendiranje vozila",
    description:
      "Kompletno i djelimično oblaganje vozila folijom — automobili, kombiji, kamioni.",
  },
  {
    name: "Folije na sve površine",
    description:
      "Nanošenje folije na izloge, staklene površine, zidove i fasade — precizna montaža bez mjehurića.",
  },
  {
    name: "Zatamnjivanje stakala",
    description:
      "Profesionalno zatamnjivanje stakala vozila i objekata — atestirane folije.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: business.name,
  legalName: business.name,
  description: DESCRIPTION,
  slogan: "Dizajn koji se lijepi.",
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  logo: `${SITE_URL}/og.png`,
  priceRange: "$$",
  currenciesAccepted: "BAM, EUR",
  telephone: business.phones[0].display,
  email: business.email,
  sameAs: [business.instagram],
  contactPoint: business.phones.map((p) => ({
    "@type": "ContactPoint",
    telephone: p.display,
    contactType: "customer service",
    areaServed: p.region === "AT" ? "AT" : "BA",
    availableLanguage: ["sr", "de", "en"],
  })),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    addressLocality: business.city,
    postalCode: business.postalCode,
    addressCountry: business.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: business.geo.lat,
    longitude: business.geo.lng,
  },
  areaServed: [
    { "@type": "City", name: "Derventa" },
    { "@type": "Country", name: "Bosna i Hercegovina" },
    { "@type": "City", name: "Salzburg" },
    { "@type": "Country", name: "Austrija" },
  ],
  knowsLanguage: ["sr", "de", "en"],
  knowsAbout: [
    "grafički dizajn",
    "svjetleće reklame",
    "3D slova",
    "brendiranje vozila",
    "auto folije",
    "zatamnjivanje stakala",
    "folije na staklo",
    "vizuelni identitet",
  ],
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: s.name,
      description: s.description,
      areaServed: ["Derventa", "Bosna i Hercegovina", "Salzburg", "Austrija"],
      provider: { "@id": `${SITE_URL}/#business` },
    },
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Usluge — Quantum Loop",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.description },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${anton.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GOATCOUNTER_CODE && (
          <script
            data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
            async
            src="https://gc.zgo.at/count.js"
          />
        )}
        {/* Language-independent chrome. The translated header/footer/floating
            chrome and the I18nProvider live in each page's SiteChrome, so the
            per-language routes (/, /de, /en) render server-side in their own
            language. */}
        <SmoothScroll />
        <NoiseOverlay />
        <Ribbon />
        {children}
      </body>
    </html>
  );
}
