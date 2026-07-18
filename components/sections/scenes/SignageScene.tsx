"use client";

import type { RefObject } from "react";
import VideoScene from "./VideoScene";

/**
 * Signage scene — a realistic large outdoor illuminated advertising sign whose
 * lights turn on and which then rotates to reveal its aluminium side and back.
 * Video + poster are swappable drop-ins (signage.mp4 / signage.jpg); see
 * public/stock/SOURCES.md.
 *
 * The previous CSS 3D lightbox lives in SignageScene3D.tsx as a revert option.
 */
export default function SignageScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <VideoScene
      rowRef={rowRef}
      videoSrc="/stock/signage.mp4"
      poster="/stock/signage.jpg"
      alt="Velika svjetleća reklama — Quantum Loop"
    />
  );
}
