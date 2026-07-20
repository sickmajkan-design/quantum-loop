"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Vehicle-wrap scene — TEMPORARY still image.
 *
 * The AI clip we had misrepresented the technique (wrinkled film "ironed" flat
 * by the tool), so the scene shows a corrected still (hands tensioning smooth,
 * taut vinyl) until we regenerate the video. When the new clip is ready, switch
 * this back to <VideoScene videoSrc="/stock/vehicle-wrap.mp4" poster=... />.
 *
 * `WRAP_IMAGE` currently points at the Higgsfield render (chosen "Slika 2").
 * Replace it with a self-hosted `/stock/vehicle-wrap.jpg` once the file is saved
 * into the repo (drop-in), so the scene no longer depends on the CDN URL.
 */
const WRAP_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3GVVomhXupEJajP4RfHe3boPeER/hf_20260718_211234_e49491cc-2e17-421d-9c20-dfe4e713aac9.png";

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
        src={WRAP_IMAGE}
        alt="Ruke zatežu i izravnavaju foliju prije lijepljenja na vozilo"
        fill
        unoptimized
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover"
      />
    </div>
  );
}
