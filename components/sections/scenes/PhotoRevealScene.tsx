"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function PhotoRevealScene({
  rowRef,
  src,
  alt,
  glassReflection,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
  glassReflection?: boolean;
}) {
  const wipeRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !rowRef.current) return;

    const ctx = gsap.context(() => {
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

      tl.fromTo(
        wipeRef.current,
        { scaleX: 1 },
        { scaleX: 0, ease: "power2.inOut" },
        0
      ).fromTo(
        shimmerRef.current,
        { xPercent: -130, opacity: 0 },
        { xPercent: 130, opacity: 1, ease: "power1.inOut" },
        0.7
      ).to(shimmerRef.current, { opacity: 0, duration: 0.08 }, 0.97);
    }, rowRef);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover"
      />

      <div
        ref={wipeRef}
        aria-hidden="true"
        className="absolute inset-0 origin-right motion-reduce:hidden"
        style={{
          background:
            "linear-gradient(105deg, #9a7c1c, #E5C158 45%, #C9A227 100%)",
        }}
      />

      <div
        ref={shimmerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 opacity-0 motion-reduce:hidden"
        style={{
          background:
            "linear-gradient(105deg, transparent, rgba(229,193,88,.55) 50%, transparent)",
        }}
      />

      {glassReflection && (
        <div
          aria-hidden="true"
          className="glass-sheen pointer-events-none absolute -inset-y-1/4 -inset-x-1/4 motion-reduce:hidden"
          style={{
            background:
              "linear-gradient(100deg, transparent 40%, rgba(255,255,255,.22) 50%, transparent 60%)",
          }}
        />
      )}
    </div>
  );
}
