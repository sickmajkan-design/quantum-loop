"use client";

import { useEffect } from "react";
import type { Lang } from "@/content";

const STORAGE_KEY = "ql_lang";

/**
 * Remembers the visitor's language when they're on a non-default page (/de,
 * /en) — whether they got there by the first-visit guess, a shared link or a
 * bookmark — so future visits to the root send them back to it. The actual
 * first-visit redirect happens in an inline script in the document head (see
 * app/layout.tsx) so it fires before render; this only persists the choice.
 */
export default function LangAutoRedirect({ lang }: { lang: Lang }) {
  useEffect(() => {
    if (lang !== "sr") window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return null;
}
