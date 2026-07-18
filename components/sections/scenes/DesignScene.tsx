"use client";

import type { RefObject } from "react";
import VideoScene from "./VideoScene";

/**
 * Graphic design scene — a designer at a multi-monitor workstation building a
 * logo. Video + still poster are swappable drop-ins under public/stock/
 * (graphic-design.mp4 / graphic-design.jpg). See public/stock/SOURCES.md.
 */
export default function DesignScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <VideoScene
      rowRef={rowRef}
      videoSrc="/stock/graphic-design.mp4"
      poster="/stock/graphic-design.jpg"
      alt="Dizajner za više monitora izrađuje logo"
    />
  );
}
