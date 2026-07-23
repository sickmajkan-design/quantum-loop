"use client";

import { useI18n } from "@/lib/i18n-context";

// Visually hidden until focused — lets keyboard users jump straight past the
// header to the main content.
export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only rounded bg-gold px-4 py-2 font-semibold text-black focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-300"
    >
      {t("skip")}
    </a>
  );
}
