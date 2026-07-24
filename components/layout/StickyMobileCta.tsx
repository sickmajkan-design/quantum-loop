"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

/**
 * A quiet "request a quote" prompt for mobile only (desktop keeps the CTA in
 * the header). A small glass chip — dark and translucent with a thin gold
 * outline and gold text, not a bright gold fill — so it's present without
 * grabbing attention. It appears after the hero and steps aside once the
 * contact section is in view.
 */
export default function StickyMobileCta() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    let pastHero = false;
    let atContact = false;
    const update = () => setVisible(pastHero && !atContact);

    const onScroll = () => {
      pastHero = window.scrollY > 500;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | null = null;
    if (contact) {
      io = new IntersectionObserver(
        ([e]) => {
          atContact = e.isIntersecting;
          update();
        },
        { rootMargin: "0px 0px -35% 0px" }
      );
      io.observe(contact);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center bg-linear-to-t from-black/85 via-black/45 to-transparent px-4 pt-8 pb-4 transition-all duration-300 ease-out lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <a
        href="#upit"
        tabIndex={visible ? 0 : -1}
        className={`group inline-flex items-center gap-2 rounded-full border border-gold/35 bg-black/55 py-2 pr-3.5 pl-4.5 text-[0.82rem] font-semibold tracking-[0.01em] text-gold2 shadow-md shadow-black/30 backdrop-blur-md transition active:scale-95 ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {t("nav_cta")}
        <ArrowRight className="size-3.5 opacity-75 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
