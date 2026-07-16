"use client";

import { useI18n } from "@/lib/i18n-context";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-2 flex flex-wrap justify-between gap-5 border-t border-gold/25 px-[5vw] py-10 text-[0.85rem] text-grey">
      <div>
        © {year} Quantum Loop s.p. — Derventa, BiH
      </div>
      <div>{t("f_tag")}</div>
    </footer>
  );
}
