"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { useI18n } from "@/lib/i18n-context";

/**
 * Vehicle-wrap scene — a "before → after" reveal that sells the transformation.
 * Two matched photos of the same vehicle at the same angle: `vehicle-wrap-before`
 * is the plain, un-branded car and `vehicle-wrap` is the finished branded wrap.
 *
 * Like the tinting scene, the split is tied to scroll position (a scrubbed
 * ScrollTrigger): the branded wrap sweeps in from the right as the row passes
 * through the viewport, so the graphics appear on an otherwise identical car —
 * consistent on desktop and mobile alike. Reduced motion shows the finished
 * result. Driven by a single `--reveal` CSS variable (0 = all "before",
 * 1 = all "after") so updating it never re-renders React.
 */
const R_MIN = 0.1; // mostly the plain car, a sliver of branding at the right
const R_MAX = 0.9; // mostly the finished branded wrap

export default function WrapScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);

  const setReveal = (v: number) => {
    cardRef.current?.style.setProperty("--reveal", String(v));
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (prefersReducedMotion()) {
      setReveal(R_MAX);
      return;
    }

    const trigger = rowRef.current ?? card;
    setReveal(R_MIN);

    const ctx = gsap.context(() => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger, start: "top 82%", once: true },
      });

      // Scrub the reveal as the row passes through the viewport.
      ScrollTrigger.create({
        trigger,
        start: "top 78%",
        end: "center 38%",
        scrub: 1,
        onUpdate: (self) => setReveal(R_MIN + (R_MAX - R_MIN) * self.progress),
      });
    }, card);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <div
      ref={cardRef}
      style={{ ["--reveal" as string]: R_MIN } as React.CSSProperties}
      className="relative h-full w-full overflow-hidden rounded-md bg-black2"
    >
      {/* BEFORE — the plain, un-branded vehicle. */}
      <Image
        src={asset("/stock/vehicle-wrap-before.jpg")}
        alt=""
        fill
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover"
      />

      {/* AFTER — full colour, clipped to the revealed (right-hand) portion. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0 0 calc((1 - var(--reveal)) * 100%))" }}
      >
        <Image
          src={asset("/stock/vehicle-wrap.jpg")}
          alt="Bok vozila sa crno-zlatnim brendiranim wrap dizajnom"
          fill
          sizes="(max-width: 768px) 90vw, 45vw"
          className="object-cover"
        />
      </div>

      {/* Corner labels */}
      <span className="pointer-events-none absolute top-3 left-3 rounded bg-black/45 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-white/85 uppercase">
        {t("s2_before")}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded bg-black/45 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-gold2 uppercase">
        {t("s2_after")}
      </span>

      {/* Dividing edge between plain and branded, riding the reveal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-[2px] bg-gold2/80"
        style={{
          left: "calc((1 - var(--reveal)) * 100%)",
          boxShadow: "0 0 10px rgba(229,193,88,0.55)",
        }}
      />
    </div>
  );
}
