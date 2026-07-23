"use client";

import { useEffect } from "react";

// Keeps <html lang> in sync with the active language for assistive tech. The
// root layout renders a static default; this corrects it per language route.
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang === "sr" ? "sr-Latn" : lang;
  }, [lang]);
  return null;
}
