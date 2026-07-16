"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import PhotoRevealScene from "./PhotoRevealScene";

/**
 * Graphic design scene — a designer at a multi-monitor workstation building a
 * logo.
 *
 * Video drop-in: when the animated clip is ready, drop it at
 * `public/stock/graphic-design.mp4` and set VIDEO_SRC below. The still image
 * (`graphic-design.jpg`) is used as the poster and as the full fallback until
 * then, and also whenever the user prefers reduced motion.
 */
const VIDEO_SRC: string | null = null; // e.g. "/stock/graphic-design.mp4"
const POSTER = "/stock/graphic-design.jpg";
const ALT = "Dizajner za više monitora izrađuje logo";

export default function DesignScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!VIDEO_SRC || prefersReducedMotion() || !rowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top top+=90",
            end: "+=420",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onEnter: () => videoRef.current?.play().catch(() => {}),
            onEnterBack: () => videoRef.current?.play().catch(() => {}),
          },
        }
      );
    }, rowRef);

    return () => ctx.revert();
  }, [rowRef]);

  if (!VIDEO_SRC) {
    return (
      <PhotoRevealScene rowRef={rowRef} src={POSTER} alt={ALT} priority />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-black2">
      <div ref={wrapRef} className="absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={ALT}
        />
      </div>
    </div>
  );
}
