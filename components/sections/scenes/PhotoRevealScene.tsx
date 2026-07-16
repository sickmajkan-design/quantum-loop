"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * A clean photo scene: the image gets a gentle scroll-scrubbed parallax
 * zoom-out plus a single restrained light sweep (a "foil settle" highlight),
 * with an optional glass sheen. No opaque gold wipe over the photo — the
 * imagery stays visible and the motion is subtle.
 */
export default function PhotoRevealScene({
  rowRef,
  src,
  alt,
  glassReflection,
  priority,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
  glassReflection?: boolean;
  priority?: boolean;
}) {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !rowRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top top+=90",
          end: "+=420",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        imgWrapRef.current,
        { scale: 1.14 },
        { scale: 1, ease: "none" },
        0
      )
        .fromTo(
          sweepRef.current,
          { xPercent: -150, opacity: 0 },
          { xPercent: 150, opacity: 0.32, ease: "power1.inOut" },
          0.15
        )
        .to(sweepRef.current, { opacity: 0, duration: 0.15 }, 0.55);
    }, rowRef);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-black2">
      <div ref={imgWrapRef} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 90vw, 45vw"
          className="object-cover"
        />
      </div>

      {/* subtle settle highlight */}
      <div
        ref={sweepRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 opacity-0 motion-reduce:hidden"
        style={{
          background:
            "linear-gradient(105deg, transparent, rgba(255,255,255,0.16) 50%, transparent)",
        }}
      />

      {glassReflection && (
        <div
          aria-hidden="true"
          className="glass-sheen pointer-events-none absolute -inset-x-1/4 -inset-y-1/4 motion-reduce:hidden"
          style={{
            background:
              "linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.14) 50%, transparent 58%)",
          }}
        />
      )}
    </div>
  );
}
