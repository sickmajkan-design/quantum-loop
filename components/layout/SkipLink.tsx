"use client";

import { useI18n } from "@/lib/i18n-context";

// Visually hidden until focused — lets keyboard users jump straight past the
// header to the main content. All the visible styling lives under `focus:` so
// it never overrides `sr-only`'s 1px sizing while hidden (padding/bg would
// otherwise inflate it and make it peek out over the logo).
export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-black focus:no-underline"
    >
      {t("skip")}
    </a>
  );
}
