"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    goatcounter?: { count?: (opts?: { path?: string }) => void };
  }
}

/**
 * Cookieless, GDPR-friendly visit stats via GoatCounter — no cookie banner
 * needed. count.js records the initial pageview itself; this also records later
 * client-side navigations (e.g. switching language between /, /de and /en) so
 * per-language traffic shows up. Dashboard: https://<code>.goatcounter.com
 */
export default function GoatCounter({ code }: { code: string }) {
  const pathname = usePathname();
  const firstRun = useRef(true);

  useEffect(() => {
    // Skip the first run — count.js already counted the initial load, so
    // counting here too would double it.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    window.goatcounter?.count?.({ path: pathname });
  }, [pathname]);

  return (
    <script
      data-goatcounter={`https://${code}.goatcounter.com/count`}
      async
      src="https://gc.zgo.at/count.js"
    />
  );
}
