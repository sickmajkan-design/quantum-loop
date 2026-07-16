"use client";

import { useI18n } from "@/lib/i18n-context";

export default function Portfolio() {
  const { t, d } = useI18n();

  return (
    <section
      id="portfolio"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <div className="mb-4 text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase">
        {t("p_eyebrow")}
      </div>
      <h2 className="mb-6 text-[clamp(2.2rem,6vw,4.5rem)]">{t("p_title")}</h2>

      <div className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {d.tiles.map((tile) => (
          <div
            key={tile}
            className="relative flex h-[190px] items-end overflow-hidden rounded-lg border border-gold/25 bg-linear-to-br from-[#151515] to-[#0d0d0d] p-4 text-[0.85rem] font-semibold tracking-[0.08em] text-gold2 uppercase"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,162,39,0.15),transparent_60%)]" />
            <span className="relative">{tile}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
