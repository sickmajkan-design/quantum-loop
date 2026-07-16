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
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: business.name,
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/favicon.ico`,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    addressLocality: business.city,
    postalCode: business.postalCode,
    addressCountry: business.countryCode,
  },
  areaServed: ["Derventa", "Bosnia and Herzegovina", "Salzburg", "Austria"],
  slogan: "Dizajn koji se lijepi.",
  knowsLanguage: ["sr", "de", "en"],
  makesOffer: [
    "Grafički dizajn",
    "Reklame i svjetleće reklame",
    "Brendiranje vozila",
    "Folije na sve površine",
    "Zatamnjivanje stakala",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
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
