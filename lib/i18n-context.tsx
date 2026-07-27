"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { dict, type Dictionary, type Lang } from "@/content";

interface I18nContextValue {
  lang: Lang;
  t: (key: keyof Dictionary) => string;
  d: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// The language is fixed per route (each language is its own static page), so it
// arrives as a prop rather than client state — the server-rendered HTML is
// already in the right language, which is what search engines and AI crawlers
// index. Switching language is a navigation between /, /de and /en.
export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const t = useCallback(
    (key: keyof Dictionary) => {
      const value = dict[lang][key];
      return typeof value === "string" ? value : String(value);
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, t, d: dict[lang] }), [lang, t]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
