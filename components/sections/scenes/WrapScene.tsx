"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { useI18n } from "@/lib/i18n-context";

/**
 * Vehicle-wrap scene — a "before → after" reveal that sells the transformation.
 * There is only one source photo (the finished branded wrap), so the "before"
 * is that same image rendered desaturated + dimmed (reads as a raw, unbranded
 * vehicle) while the "after" is the full-colour branded result. A wipe sweeps
 * the colour in on scroll, then rests slightly open so the divider handle
 * invites the visitor to drag it (mouse) and scrub the reveal themselves.
 *
 * The reveal is driven by a single `--reveal` CSS variable (0 = all "before",
 * 1 = all "after") set imperatively, so dragging never re-renders React.
 * Touch devices get the scroll-in sweep only (no drag) to avoid hijacking the
 * page scroll; reduced-motion shows the finished result outright.
 */
const REST = 0.8; // where the sweep settles: mostly branded, a sliver of "before"

export default function WrapScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const touchedRef = useRef(false);
  const [showHint, setShowHint] = useState(true);

  const setReveal = (v: number) => {
    const clamped = Math.max(0.04, Math.min(1, v));
    cardRef.current?.style.setProperty("--reveal", String(clamped));
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (prefersReducedMotion()) {
      setReveal(1);
      return;
    }

    setReveal(0);
    const proxy = { v: 0 };
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: rowRef.current ?? card, start: "top 82%", once: true },
          onUpdate: () => {
            if (!touchedRef.current) setReveal(proxy.v);
          },
        })
        .to(proxy, { v: 1, duration: 1.1, ease: "power2.inOut" })
        .to(proxy, { v: REST, duration: 0.5, ease: "power2.out" });
    }, card);

    return () => ctx.revert();
  }, [rowRef]);

  // Mouse-only scrubbing: hovering across the card wipes the reveal. Touch is
  // intentionally excluded so vertical page scrolling over the image still works.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !cardRef.current) return;
    if (!touchedRef.current) {
      touchedRef.current = true;
      setShowHint(false);
    }
    const rect = cardRef.current.getBoundingClientRect();
    setReveal(1 - (e.clientX - rect.left) / rect.width);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      style={{ ["--reveal" as string]: 0 } as React.CSSProperties}
      className="group relative h-full w-full overflow-hidden rounded-md bg-black2"
    >
      {/* BEFORE — same photo, desaturated + dimmed (raw / unbranded look). */}
      <Image
        src={asset("/stock/vehicle-wrap.jpg")}
        alt=""
        fill
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover [filter:grayscale(1)_brightness(0.5)_contrast(1.05)]"
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
      <span className="absolute top-2.5 left-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-white/80 uppercase backdrop-blur-sm">
        {t("s2_before")}
      </span>
      <span className="absolute top-2.5 right-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-gold2 uppercase backdrop-blur-sm">
        {t("s2_after")}
      </span>

      {/* Divider + handle, riding the reveal edge. */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-gold2/80 shadow-[0_0_12px_rgba(229,193,88,0.5)]"
        style={{ left: "calc((1 - var(--reveal)) * 100%)" }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold2/70 bg-black/70 text-gold2 backdrop-blur-sm">
          <MoveHorizontal className="size-4" />
        </span>
      </div>

      {/* Drag hint — only meaningful on hover-capable (mouse) devices. */}
      <span
        className={`pointer-events-none absolute bottom-2.5 left-1/2 hidden -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-white/75 uppercase backdrop-blur-sm transition-opacity duration-500 [@media(hover:hover)]:block ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
      >
        ⟷ {t("s2_hint")}
      </span>
    </div>
  );
}
