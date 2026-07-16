"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Window tinting scene. Keeps the installer photo and, as you scroll, the tint
 * film is "applied" top-to-bottom: a darkening layer wipes down behind a thin
 * squeegee edge while a soft sun glare dims and the VLT counter falls 70 → 15.
 * Deliberately restrained — one clear idea, no busy overlays.
 */
export default function TintScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const filmRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const vltRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (vltRef.current) vltRef.current.textContent = "15";
      if (filmRef.current) filmRef.current.style.transform = "scaleY(1)";
      return;
    }
    if (!rowRef.current) return;

    const ctx = gsap.context(() => {
      const vlt = { v: 70 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top top+=90",
          end: "+=460",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        filmRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none" },
        0
      )
        .fromTo(
          edgeRef.current,
          { top: "0%", opacity: 0 },
          { top: "100%", opacity: 1, ease: "none" },
          0
        )
        .to(edgeRef.current, { opacity: 0, duration: 0.08 }, 0.94)
        .to(glareRef.current, { opacity: 0, ease: "none" }, 0)
        .to(
          vlt,
          {
            v: 15,
            ease: "none",
            onUpdate: () => {
              if (vltRef.current) {
                vltRef.current.textContent = String(Math.round(vlt.v));
              }
            },
          },
          0
        );
    }, rowRef);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-black2">
      <Image
        src="/stock/window-tint.jpg"
        alt="Ruke sa alatom nanose zatamnjenu foliju na staklo vozila"
        fill
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover object-top"
      />

      {/* soft sun glare that dims as the film goes on */}
      <div
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 motion-reduce:opacity-0"
        style={{
          background:
            "radial-gradient(120% 90% at 22% 12%, rgba(255,240,200,0.38), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />

      {/* the tint film, wiping down from the top */}
      <div
        ref={filmRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-top motion-reduce:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,8,12,0.78), rgba(4,6,10,0.68))",
        }}
      />

      {/* thin squeegee edge riding the leading edge of the film */}
      <div
        ref={edgeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-[2px] opacity-0 motion-reduce:hidden"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(229,193,88,0.9), transparent)",
          boxShadow: "0 0 10px rgba(229,193,88,0.5)",
        }}
      />

      <div className="pointer-events-none absolute right-4 bottom-4 rounded border border-gold/40 bg-black/60 px-3 py-1.5 font-display text-lg text-gold2">
        VLT <span ref={vltRef}>70</span>%
      </div>
    </div>
  );
}
