"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { dict, defaultLang, type Dictionary, type Lang } from "@/content";

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof Dictionary) => string;
  d: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(defaultLang);

  const t = useCallback(
    (key: keyof Dictionary) => {
      const value = dict[lang][key];
      return typeof value === "string" ? value : String(value);
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, d: dict[lang] }),
    [lang, t]
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
