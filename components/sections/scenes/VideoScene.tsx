"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * A video scene. The clip carries its own motion, so the scene keeps its own
 * animation minimal and meaningful: the card fades-and-rises in as it scrolls
 * into view.
 *
 * Loading strategy (Performance): the video is never preloaded. On desktop it
 * loads and plays only while on screen, and pauses off screen. On mobile — where
 * most traffic is and data/battery matter — nothing but the poster loads until
 * the visitor taps the play button, at which point the clip loads and plays.
 *
 * Under reduced motion the poster stays put and nothing autoplays.
 *
 * Drop-in media: `videoSrc` (.mp4) + `poster` (.jpg) under public/stock/.
 */
export default function VideoScene({
  rowRef,
  videoSrc,
  poster,
  alt,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
  videoSrc: string;
  poster: string;
  alt: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video) return;

    if (prefersReducedMotion()) {
      if (playBtnRef.current) playBtnRef.current.style.display = "none";
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
    </div>
  );
}
