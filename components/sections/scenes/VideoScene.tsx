"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * A video scene. The clip carries its own motion, so the scene itself keeps its
 * animation minimal and meaningful: the card reveals with a soft fade-and-rise
 * as it scrolls in, the video plays only while it's on screen (and pauses off
 * screen to save resources), and — for the tint scene — the VLT counter ticks
 * 70 → 15 once on entry. No scroll pin and no zoom competing with the footage.
 *
 * Under reduced motion the poster stays put, the video never autoplays, and the
 * VLT value is shown at its final 15.
 *
 * Drop-in media: `videoSrc` (.mp4) + `poster` (.jpg) under public/stock/.
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
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vltRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (prefersReducedMotion()) {
      if (vltRef.current) vltRef.current.textContent = "15";
      return;
    }

    const video = videoRef.current;
    const trigger = rowRef.current ?? card;
    let counted = false;

    const runVlt = () => {
      if (!vltCounter || counted || !vltRef.current) return;
      counted = true;
      const o = { v: 70 };
      gsap.to(o, {
        v: 15,
        duration: 2.6,
        ease: "power1.inOut",
        onUpdate: () => {
          if (vltRef.current) vltRef.current.textContent = String(Math.round(o.v));
        },
      });
    };

    const ctx = gsap.context(() => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger, start: "top 82%", once: true },
      });

      ScrollTrigger.create({
        trigger,
        start: "top 78%",
        end: "bottom 22%",
        onEnter: () => {
          video?.play().catch(() => {});
          runVlt();
        },
        onEnterBack: () => video?.play().catch(() => {}),
        onLeave: () => video?.pause(),
        onLeaveBack: () => video?.pause(),
      });
    }, card);

    return () => ctx.revert();
  }, [rowRef, vltCounter]);

  return (
    <div
      ref={cardRef}
      className="relative h-full w-full overflow-hidden rounded-md bg-black2"
    >
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

      {vltCounter && (
        <div className="pointer-events-none absolute right-4 bottom-4 rounded border border-gold/40 bg-black/60 px-3 py-1.5 font-display text-lg text-gold2">
          VLT <span ref={vltRef}>70</span>%
        </div>
      )}
    </div>
  );
}
