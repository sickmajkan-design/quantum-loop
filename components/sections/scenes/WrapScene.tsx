"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Vehicle-wrap scene — still image showing the finished result: a black/gold
 * branded wrap design on a vehicle's side panel. Self-hosted drop-in at
 * `public/stock/vehicle-wrap.jpg` (see public/stock/SOURCES.md).
 */
export default function WrapScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: rowRef.current ?? card, start: "top 82%", once: true },
      });
    }, card);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <div
      ref={cardRef}
      className="relative h-full w-full overflow-hidden rounded-md bg-black2"
    >
      <Image
        src="/stock/vehicle-wrap.jpg"
        alt="Bok vozila sa crno-zlatnim brendiranim wrap dizajnom"
        fill
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover"
      />
    </div>
  );
}
