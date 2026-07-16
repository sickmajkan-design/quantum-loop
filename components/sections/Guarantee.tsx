"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n-context";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const points: {
  titleKey: "g1_t" | "g2_t" | "g3_t";
  textKey: "g1_p" | "g2_p" | "g3_p";
}[] = [
  { titleKey: "g1_t", textKey: "g1_p" },
  { titleKey: "g2_t", textKey: "g2_p" },
  { titleKey: "g3_t", textKey: "g3_p" },
];

const milestones: { yearKey: string; labelKey: "m1" | "m2" | "m3" }[] = [
  { yearKey: "01", labelKey: "m1" },
  { yearKey: "10", labelKey: "m2" },
  { yearKey: "20+", labelKey: "m3" },
];

const MILESTONE_LABEL: Record<string, Record<string, string>> = {
  sr: { m1: "Početak zanata", m2: "Rast i nova oprema", m3: "20+ godina, hiljade projekata" },
  de: { m1: "Handwerkliche Anfänge", m2: "Wachstum & neue Ausrüstung", m3: "20+ Jahre, tausende Projekte" },
  en: { m1: "Where the craft began", m2: "Growth & new equipment", m3: "20+ years, thousands of projects" },
};

export default function Guarantee() {
  const { t, lang } = useI18n();
  const pinRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (yearsRef.current) yearsRef.current.textContent = "20";
      return;
    }
    if (!pinRef.current) return;

    const ctx = gsap.context(() => {
      const counter = { v: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top+=90",
          end: "+=400",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(
        counter,
        {
          v: 20,
          ease: "none",
          onUpdate: () => {
            if (yearsRef.current) {
              yearsRef.current.textContent = String(Math.round(counter.v));
            }
          },
        },
        0
      )
        .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0)
        .from(".milestone-dot", { scale: 0, stagger: 0.5, ease: "back.out(2)" }, 0);
    }, pinRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      id="guarantee"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh] text-center"
    >
      <div className="mb-4 text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase">
        {t("g_eyebrow")}
      </div>

      <div ref={pinRef}>
        <div className="font-display text-[clamp(6rem,20vw,15rem)] leading-none text-gold">
          <span ref={yearsRef}>0</span>
          <small className="align-top text-[0.35em] text-gold2">+</small>
        </div>

        <div className="mx-auto mt-10 max-w-160">
          <div className="relative h-0.5 bg-white/10">
            <div
              ref={lineRef}
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-linear-to-r from-gold to-gold2 motion-reduce:scale-x-100"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {milestones.map((m) => (
              <div key={m.labelKey} className="flex flex-col items-center">
                <span className="milestone-dot mb-2 h-2.5 w-2.5 rounded-full bg-gold2 motion-reduce:scale-100" />
                <span className="font-display text-sm text-gold2">
                  {m.yearKey}
                </span>
                <span className="mt-1 text-xs text-grey">
                  {MILESTONE_LABEL[lang]?.[m.labelKey] ?? MILESTONE_LABEL.sr[m.labelKey]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mt-12 mb-6 text-[clamp(2.2rem,6vw,4.5rem)]">
        {t("g_title")}
      </h2>

      <div className="mt-12 grid gap-5 text-left [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {points.map((p) => (
          <div
            key={p.titleKey}
            className="rounded-lg border border-gold/20 bg-black2 p-6"
          >
            <b className="mb-2 block text-[1rem] tracking-[0.06em] text-gold2 uppercase">
              {t(p.titleKey)}
            </b>
            <span className="text-[0.92rem] text-[#bdb8aa]">
              {t(p.textKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
