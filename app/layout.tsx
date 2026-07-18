import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";
import { SITE_URL, business } from "@/lib/site";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Ribbon from "@/components/layout/Ribbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  alternates: {
    canonical: "/",
    languages: {
      "sr-Latn": "/",
      de: "/",
      en: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Quantum Loop s.p.",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "sr_Latn",
    alternateLocale: ["de_DE", "en_US"],
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Quantum Loop — Dizajn koji se lijepi.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    addressLocality: business.city,
    postalCode: business.postalCode,
    addressCountry: business.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 44.9769,
    longitude: 17.9109,
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <I18nProvider>
          <SmoothScroll />
          <NoiseOverlay />
          <Ribbon />
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
