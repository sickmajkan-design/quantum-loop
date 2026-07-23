"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n-context";

/**
 * A persistent "request a quote" bar for mobile only (desktop already has the
 * CTA in the header nav at all times). Appears once the visitor has scrolled
 * past the hero, so it doesn't duplicate the hero's own CTA buttons.
 */
export default function StickyMobileCta() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-gold/25 bg-black/95 p-3 backdrop-blur-md transition-transform duration-300 ease-in-out lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="#upit"
        className="block rounded bg-linear-to-br from-gold to-gold2 py-3 text-center font-bold text-black"
      >
        {t("nav_cta")}
      </a>
    </div>
  );
}
