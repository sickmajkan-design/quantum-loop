"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { Sun, ShieldCheck } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";

/**
 * "Folije na sve površine" scene — a collage of the surface types this
 * service actually covers, not an installation close-up. Left panel is the
 * existing shop-window/glass shot (self-hosted); the right two panels are
 * placeholders awaiting Higgsfield renders for building sun-protection film
 * and vehicle paint-protection film (PPF — distinct from the decorative wrap
 * design shown in the vehicle-wrap scene). Drop the finished images in at
 * `/stock/sun-protection.jpg` and `/stock/ppf.jpg` and swap the placeholder
 * blocks below for <Image> tags (see public/stock/SOURCES.md).
 */
export default function FlatSurfaceScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: rowRef.current ?? card, start: "top 82%", once: true },
      });
    }, card);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <div
      ref={cardRef}
      className="grid h-full w-full grid-cols-2 gap-1 overflow-hidden rounded-md bg-black2"
    >
      <div className="relative row-span-2 overflow-hidden">
        <Image
          src={asset("/stock/flat-surface.jpg")}
          alt="Ruke nanose foliju na staklenu izlog površinu"
          fill
          sizes="(max-width: 768px) 45vw, 23vw"
          className="object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[0.7rem] tracking-[0.06em] text-gold2 uppercase">
          Izlozi &amp; staklo
        </span>
      </div>

      {[
        { Icon: Sun, label: "Sun protection — fasade" },
        { Icon: ShieldCheck, label: "PPF zaštita vozila" },
      ].map(({ Icon, label }) => (
        <div
          key={label}
          className="relative flex flex-col items-center justify-center gap-2 overflow-hidden border border-gold/15 bg-black2/60 text-center"
        >
          {/* matching gold hairline texture so the panels read as intentional */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0 11px, var(--color-gold) 11px 12px)",
            }}
          />
          <Icon className="relative size-6 text-gold/50" aria-hidden="true" />
          <span className="relative px-2 text-[0.7rem] tracking-[0.06em] text-grey uppercase">
            {label}
          </span>
          <span className="relative mt-0.5 rounded-full border border-gold/30 px-2 py-[1px] text-[0.55rem] font-semibold tracking-[0.16em] text-gold2/70 uppercase">
            Uskoro
          </span>
        </div>
      ))}
    </div>
  );
}
