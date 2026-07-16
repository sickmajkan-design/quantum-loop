"use client";

import type { RefObject } from "react";
import PhotoRevealScene from "./PhotoRevealScene";

/**
 * Graphic design scene — a photo of a designer at a multi-monitor workstation
 * building a logo. The image lives at /stock/graphic-design.jpg and is a
 * swappable drop-in (see public/stock/SOURCES.md).
 */
export default function DesignScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <PhotoRevealScene
      rowRef={rowRef}
      src="/stock/graphic-design.jpg"
      alt="Dizajner za više monitora izrađuje logo"
      priority
    />
  );
}
