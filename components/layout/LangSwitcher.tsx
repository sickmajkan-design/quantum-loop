"use client";

import Link from "next/link";
import { langs, type Lang } from "@/content";
import { useI18n } from "@/lib/i18n-context";

// Each language is its own page, so switching is a navigation, not a toggle.
const HREF: Record<Lang, string> = { sr: "/", de: "/de", en: "/en" };

// Shared with LangAutoRedirect — a manual pick here always wins over the
// first-visit browser-language guess on future visits.
const STORAGE_KEY = "ql_lang";

export default function LangSwitcher({ className }: { className?: string }) {
  const { lang } = useI18n();

  return (
    <div
      role="group"
      aria-label="Jezik"
      className={`flex gap-0.5 overflow-hidden rounded border border-white/25 ${className ?? ""}`}
    >
      {langs.map((l) => (
        <Link
          key={l}
          href={HREF[l]}
          hrefLang={l}
          onClick={() => window.localStorage.setItem(STORAGE_KEY, l)}
          aria-current={l === lang ? "true" : undefined}
          className={`px-2.5 py-1.5 text-xs font-semibold uppercase transition-opacity ${
            l === lang
              ? "bg-gold text-black opacity-100"
              : "text-white opacity-60 hover:opacity-100"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
