"use client";

import { useEffect } from "react";
import { langs, type Lang } from "@/content";

const STORAGE_KEY = "ql_lang";

const HREF: Record<Lang, string> = { sr: "/", de: "/de", en: "/en" };

/**
 * First-visit language guess from the browser's own language list — German
 * for de/at/ch visitors (relevant now that the business is expanding to
 * Salzburg), Serbian for sr/bs/hr (the home market), English as the
 * catch-all otherwise.
 */
function detectLang(): Lang {
  const browserLangs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const raw of browserLangs) {
    const code = raw.toLowerCase().slice(0, 2);
    if (code === "de") return "de";
    if (code === "sr" || code === "bs" || code === "hr") return "sr";
  }
  return "en";
}

function isLang(value: string | null): value is Lang {
  return !!value && (langs as string[]).includes(value);
}

/**
 * Every time a visitor lands on the root route (Serbian, the ambiguous
 * "no language chosen yet" entry point), redirects them to their remembered
 * language if they have one (from a past visit or an explicit LangSwitcher
 * pick), or guesses from the browser on a first-ever visit and remembers
 * that guess. Reaching /de or /en directly — a shared link, a bookmark — is
 * always treated as deliberate and left alone, never redirected elsewhere.
 */
export default function LangAutoRedirect({ lang }: { lang: Lang }) {
  useEffect(() => {
    if (lang !== "sr") {
      window.localStorage.setItem(STORAGE_KEY, lang);
      return;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    const target = isLang(saved) ? saved : detectLang();
    if (!isLang(saved)) window.localStorage.setItem(STORAGE_KEY, target);
    // A hard navigation (not the client router) so the target language loads as
    // a fresh document: no client-side focus management landing on the skip
    // link and flashing it over the logo for de/en visitors.
    if (target !== "sr") window.location.replace(HREF[target]);
  }, [lang]);

  return null;
}
