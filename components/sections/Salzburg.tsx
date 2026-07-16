"use client";

import { useI18n } from "@/lib/i18n-context";

export default function Salzburg() {
  const { t } = useI18n();

  return (
    <section
      id="salzburg"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <div className="grid min-h-0 grid-cols-1 items-center gap-10 md:min-h-[70vh] md:grid-cols-2 md:gap-[6vw]">
        <div
          className="flex aspect-4/3 items-center justify-center rounded-[10px] border border-gold/18 bg-black2 p-[8%] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          aria-hidden="true"
        >
          <span className="text-sm tracking-[0.1em] text-grey uppercase">
            Derventa → Salzburg
          </span>
        </div>
        <div>
          <div className="mb-4 text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase">
            {t("sz_eyebrow")}
          </div>
          <h3 className="text-[clamp(2rem,5vw,3.4rem)]">{t("sz_title")}</h3>
          <p className="mt-3.5 max-w-[460px] text-[#cfcabc]">{t("sz_p")}</p>
        </div>
      </div>
    </section>
  );
}
