"use client";

import { langs } from "@/content";
import { useI18n } from "@/lib/i18n-context";

export default function LangSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      role="group"
      aria-label="Jezik"
      className={`flex gap-0.5 overflow-hidden rounded border border-white/25 ${className ?? ""}`}
    >
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2.5 py-1.5 text-xs font-semibold uppercase transition-opacity ${
            l === lang
              ? "bg-gold text-black opacity-100"
              : "text-white opacity-60 hover:opacity-100"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
