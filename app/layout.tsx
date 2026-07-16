import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
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

export const metadata: Metadata = {
  title: "Quantum Loop — Dizajn koji se lijepi",
  description:
    "Grafički dizajn, reklame, brendiranje vozila, folije i zatamnjivanje stakala. 20+ godina iskustva. Derventa · uskoro Salzburg.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <I18nProvider>
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
