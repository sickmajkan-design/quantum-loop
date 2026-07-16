"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * A scroll-driven video scene. The clip plays (muted, looped) while the row is
 * pinned, with a gentle parallax zoom. The poster image shows until the video
 * plays — and stays put as the static fallback under reduced motion (the clip
 * never autoplays there) and until the video file is present, so the scene
 * never looks broken. Optional VLT counter overlay for the window-tint scene.
 *
 * Drop-in: place the clip at `videoSrc` and the still at `poster` (both under
 * public/stock/). See public/stock/SOURCES.md.
 */
export default function VideoScene({
  rowRef,
  videoSrc,
  poster,
  alt,
  vltCounter,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
  videoSrc: string;
  poster: string;
  alt: string;
  vltCounter?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vltRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (vltRef.current) vltRef.current.textContent = "15";
      return;
    }
    if (!rowRef.current) return;

    const ctx = gsap.context(() => {
      const vlt = { v: 70 };
      gsap.fromTo(
        wrapRef.current,
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top top+=90",
            end: "+=460",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onEnter: () => videoRef.current?.play().catch(() => {}),
            onEnterBack: () => videoRef.current?.play().catch(() => {}),
            onUpdate: vltCounter
              ? (self) => {
                  vlt.v = 70 - 55 * self.progress;
                  if (vltRef.current) {
                    vltRef.current.textContent = String(Math.round(vlt.v));
                  }
                }
              : undefined,
          },
        }
      );
    }, rowRef);

    return () => ctx.revert();
  }, [rowRef, vltCounter]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-black2">
      <div ref={wrapRef} className="absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      </div>

      {vltCounter && (
        <div className="pointer-events-none absolute right-4 bottom-4 rounded border border-gold/40 bg-black/60 px-3 py-1.5 font-display text-lg text-gold2">
          VLT <span ref={vltRef}>70</span>%
        </div>
      )}
    </div>
  );
}
