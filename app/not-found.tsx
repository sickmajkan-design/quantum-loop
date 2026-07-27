import type { Metadata } from "next";
import Link from "next/link";

// Branded 404. Under static export this is emitted as 404.html, which GitHub
// Pages serves for unknown paths. It renders inside the root layout, so the
// header, footer and background come along for free. Copy is Serbian (the
// site's default) with a short DE/EN line, since there's no language context
// on an error route.
export const metadata: Metadata = {
  title: "Stranica nije pronađena",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative z-2 mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center justify-center px-[5vw] py-[16vh] text-center">
      <div className="font-display text-[clamp(5rem,20vw,12rem)] leading-none text-gold">
        404
      </div>
      <h1 className="mt-4 text-[clamp(1.6rem,5vw,2.6rem)]">
        Stranica nije pronađena
      </h1>
      <p className="mt-4 max-w-[440px] text-[#cfcabc]">
        Stranica koju tražite ne postoji ili je premještena.
        <br />
        <span className="text-grey">
          Seite nicht gefunden · Page not found
        </span>
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded bg-linear-to-br from-gold to-gold2 px-[30px] py-[15px] text-[0.95rem] font-bold tracking-[0.04em] text-black transition-[filter] hover:brightness-110"
      >
        Nazad na početnu
      </Link>
    </section>
  );
}
