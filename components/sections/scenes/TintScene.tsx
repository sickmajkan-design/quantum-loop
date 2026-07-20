"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";

/**
 * Window tinting scene — a "before / after" split over the installer clip.
 *
 * The video stays clearly visible (its playback is capped to the lighter early
 * part of the clip so it never sinks into full darkness). A translucent tint
 * film covers the right portion of the glass and sweeps further left as the row
 * scrolls in, so you read the difference between clear glass and tinted glass
 * while the footage keeps playing. The VLT counter ticks 70 → 15.
 *
 * Loading: preload="none"; desktop plays only on screen (paused off screen),
 * mobile loads/plays the clip only on tap. Reduced motion shows a static split.
 */
const VIDEO_SRC = "/stock/window-tint.mp4";
const POSTER = "/stock/window-tint.jpg";
const ALT = "Ruke nanose zatamnjenu foliju na staklo vozila";
// Loop only the lighter early segment so the clip doesn't go fully dark.
const LOOP_START = 0.15;
const LOOP_CAP = 2.9;
// Tinted portion width (% of the card), from clear-ish to mostly tinted.
const MIN_TINT = 16;
const MAX_TINT = 62;

export default function TintScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const vltRef = useRef<HTMLSpanElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video) return;

    const setSplit = (tintPct: number) => {
      if (filmRef.current) filmRef.current.style.width = `${tintPct}%`;
      if (dividerRef.current) dividerRef.current.style.right = `${tintPct}%`;
    };
    const setVlt = (v: number) => {
      if (vltRef.current) vltRef.current.textContent = String(Math.round(v));
    };

    // Keep the clip in its lighter early window.
    const onTime = () => {
      if (video.currentTime >= LOOP_CAP) video.currentTime = LOOP_START;
    };
    video.addEventListener("timeupdate", onTime);

    if (prefersReducedMotion()) {
      setSplit(48);
      setVlt(15);
      if (playBtnRef.current) playBtnRef.current.style.display = "none";
      return () => video.removeEventListener("timeupdate", onTime);
    }

    const trigger = rowRef.current ?? card;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    setSplit(MIN_TINT);

    const ctx = gsap.context(() => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger, start: "top 82%", once: true },
      });

      // Scrub the split + VLT as the row passes through the viewport.
      ScrollTrigger.create({
        trigger,
        start: "top 78%",
        end: "center 38%",
        scrub: 1,
        onUpdate: (self) => {
          setSplit(MIN_TINT + (MAX_TINT - MIN_TINT) * self.progress);
          setVlt(70 - 55 * self.progress);
        },
      });

      if (isDesktop) {
        ScrollTrigger.create({
          trigger,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => video.play().catch(() => {}),
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
      onTap = () => {
        video.play().catch(() => {});
        btn.style.display = "none";
      };
      btn.addEventListener("click", onTap);
    }

    return () => {
      ctx.revert();
      video.removeEventListener("timeupdate", onTime);
      if (btn && onTap) btn.removeEventListener("click", onTap);
    };
  }, [rowRef]);

  return (
    <div
      ref={cardRef}
      className="relative h-full w-full overflow-hidden rounded-md bg-black2"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={asset(VIDEO_SRC)}
        poster={asset(POSTER)}
        muted
        loop
        playsInline
        preload="none"
        aria-label={ALT}
      />

      {/* tint film over the right (after) portion of the glass */}
      <div
        ref={filmRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,16,26,0.35), rgba(6,10,18,0.82))",
          mixBlendMode: "multiply",
        }}
      />
      {/* dividing edge between clear and tinted */}
      <div
        ref={dividerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-1/2 w-[2px] bg-gold2/80"
        style={{ boxShadow: "0 0 10px rgba(229,193,88,0.55)" }}
      />

      {/* before / after labels */}
      <span className="pointer-events-none absolute top-3 left-3 rounded bg-black/45 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-white/85 uppercase">
        Čisto
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded bg-black/45 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-gold2 uppercase">
        Zatamnjeno
      </span>

      {/* mobile-only tap-to-play affordance */}
      <button
        ref={playBtnRef}
        type="button"
        aria-label="Pusti video"
        className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-black/45 backdrop-blur-sm md:hidden"
      >
        <span className="ml-1 block h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-gold2" />
      </button>

      <div className="pointer-events-none absolute right-4 bottom-4 rounded border border-gold/40 bg-black/60 px-3 py-1.5 font-display text-lg text-gold2">
        VLT <span ref={vltRef}>70</span>%
      </div>
    </div>
  );
}
