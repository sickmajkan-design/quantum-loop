"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * A video scene. The clip carries its own motion, so the scene keeps its own
 * animation minimal and meaningful: the card fades-and-rises in as it scrolls
 * into view, and — for the tint scene — the VLT counter ticks 70 → 15 once,
 * with the glass darkening and its sun-ray glare fading out in lockstep.
 *
 * Loading strategy (Performance): the video is never preloaded. On desktop it
 * loads and plays only while on screen, and pauses off screen. On mobile — where
 * most traffic is and data/battery matter — nothing but the poster loads until
 * the visitor taps the play button, at which point the clip loads and plays.
 *
 * Under reduced motion the poster stays put and nothing autoplays (VLT shows 15,
 * glass shown at its final darkened state).
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
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video) return;

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
          const progress = (70 - o.v) / 55;
          if (vltRef.current) vltRef.current.textContent = String(Math.round(o.v));
          if (darkenRef.current) darkenRef.current.style.opacity = String(0.72 * progress);
          if (raysRef.current) raysRef.current.style.opacity = String(0.5 * (1 - progress));
        },
      });
    };

    if (prefersReducedMotion()) {
      if (vltRef.current) vltRef.current.textContent = "15";
      if (playBtnRef.current) playBtnRef.current.style.display = "none";
      if (darkenRef.current) darkenRef.current.style.opacity = "0.72";
      if (raysRef.current) raysRef.current.style.opacity = "0";
      return;
    }

    const trigger = rowRef.current ?? card;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger, start: "top 82%", once: true },
      });

      if (isDesktop) {
        ScrollTrigger.create({
          trigger,
          start: "top 78%",
          end: "bottom 22%",
          onEnter: () => {
            video.play().catch(() => {});
            runVlt();
          },
          onEnterBack: () => video.play().catch(() => {}),
          onLeave: () => video.pause(),
          onLeaveBack: () => video.pause(),
        });
      }
    }, card);

    // Mobile: load + play only on an explicit tap.
    let onTap: (() => void) | null = null;
    const btn = !isDesktop ? playBtnRef.current : null;
    if (btn) {
      if (vltCounter && vltRef.current) vltRef.current.textContent = "15";
      onTap = () => {
        video.play().catch(() => {});
        runVlt();
        btn.style.display = "none";
      };
      btn.addEventListener("click", onTap);
    }

    return () => {
      ctx.revert();
      if (btn && onTap) btn.removeEventListener("click", onTap);
    };
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
        preload="none"
        aria-label={alt}
      />

      {/* mobile-only tap-to-play affordance */}
      <button
        ref={playBtnRef}
        type="button"
        aria-label="Pusti video"
        className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-black/45 backdrop-blur-sm md:hidden"
      >
        <span className="ml-1 block h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-gold2" />
      </button>

      {vltCounter && (
        <>
          <div
            ref={raysRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ mixBlendMode: "overlay" }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <g stroke="#fff" strokeOpacity="0.35" strokeWidth="18">
                <line x1="-10%" y1="0" x2="30%" y2="100%" />
                <line x1="15%" y1="0" x2="55%" y2="100%" />
                <line x1="60%" y1="0" x2="100%" y2="100%" />
                <line x1="85%" y1="0" x2="125%" y2="100%" />
              </g>
            </svg>
          </div>
          <div
            ref={darkenRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black opacity-0"
          />
          <div className="pointer-events-none absolute right-4 bottom-4 rounded border border-gold/40 bg-black/60 px-3 py-1.5 font-display text-lg text-gold2">
            VLT <span ref={vltRef}>70</span>%
          </div>
        </>
      )}
    </div>
  );
}
