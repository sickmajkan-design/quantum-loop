"use client";

import { useI18n } from "@/lib/i18n-context";
import { business } from "@/lib/site";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-2 flex flex-wrap justify-between gap-5 border-t border-gold/25 px-[5vw] py-10 text-[0.85rem] text-grey">
      <div>
        © {year} Quantum Loop s.p. — Derventa, BiH
      </div>
      <div className="flex items-center gap-5">
        <a
          href={business.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-grey hover:text-gold2"
        >
          Instagram
        </a>
        <span>{t("f_tag")}</span>
      </div>
    </footer>
  );
}
