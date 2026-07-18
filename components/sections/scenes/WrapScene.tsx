"use client";

import type { RefObject } from "react";
import VideoScene from "./VideoScene";

export default function WrapScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <VideoScene
      rowRef={rowRef}
      videoSrc="/stock/vehicle-wrap.mp4"
      poster="/stock/vehicle-wrap.jpg"
      alt="Ruke nanose foliju na karoseriju vozila"
    />
  );
}
