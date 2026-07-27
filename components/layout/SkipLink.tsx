"use client";

import { useI18n } from "@/lib/i18n-context";

// Visually hidden until *keyboard* focus. It uses focus-visible (not focus) so
// the programmatic focus Next puts here after a client navigation — e.g.
// switching language — doesn't reveal it for mouse users; only keyboard Tab
// does. All visible styling lives under the variant so it never overrides
// sr-only's 1px sizing while hidden (padding/bg would inflate it over the logo).
export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[300] focus-visible:rounded focus-visible:bg-gold focus-visible:px-4 focus-visible:py-2 focus-visible:font-semibold focus-visible:text-black focus-visible:no-underline"
    >
      {t("skip")}
    </a>
  );
}
