"use client";

import type { RefObject } from "react";
import VideoScene from "./VideoScene";

export default function FlatSurfaceScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <VideoScene
      rowRef={rowRef}
      videoSrc="/stock/flat-surface.mp4"
      poster="/stock/flat-surface.jpg"
      alt="Ruke nanose foliju na staklenu površinu"
    />
  );
}
