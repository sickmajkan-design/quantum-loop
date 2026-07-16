"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function TintScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const darkenRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const vltRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (vltRef.current) vltRef.current.textContent = "15";
      return;
    }
    if (!rowRef.current) return;

    const ctx = gsap.context(() => {
      const vlt = { v: 70 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top top+=90",
          end: "+=450",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(darkenRef.current, { opacity: 0.72, ease: "none" }, 0)
        .to(raysRef.current, { opacity: 0.05, ease: "none" }, 0)
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
    <div className="relative h-full w-full overflow-hidden rounded-md">
      <Image
        src="/stock/window-tint.jpg"
        alt="Ruke sa alatom nanose zatamnjenu foliju na staklo vozila"
        fill
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover object-top"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full motion-reduce:hidden"
        style={{ mixBlendMode: "overlay" }}
      >
        <g ref={raysRef} stroke="#fff8dc" strokeWidth="10" strokeLinecap="round" opacity="0.4">
          <line x1="-20" y1="0" x2="140" y2="300" />
          <line x1="30" y1="0" x2="190" y2="300" />
          <line x1="80" y1="0" x2="240" y2="300" />
          <line x1="130" y1="0" x2="290" y2="300" />
          <line x1="180" y1="0" x2="340" y2="300" />
        </g>
      </svg>

      <div
        ref={darkenRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black opacity-0 motion-reduce:opacity-70"
      />

      <div className="pointer-events-none absolute right-4 bottom-4 rounded border border-gold/40 bg-black/60 px-3 py-1.5 font-display text-lg text-gold2">
        VLT <span ref={vltRef}>70</span>%
      </div>
    </div>
  );
}
