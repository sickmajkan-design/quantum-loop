"use client";

import type { RefObject } from "react";
import VideoScene from "./VideoScene";

/**
 * Window tinting scene — installer applying tint film. Video + poster drop-in
 * (window-tint.mp4 / window-tint.jpg), with the VLT counter overlay falling
 * 70 → 15 as the row scrolls.
 */
export default function TintScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <VideoScene
      rowRef={rowRef}
      videoSrc="/stock/window-tint.mp4"
      poster="/stock/window-tint.jpg"
      alt="Ruke nanose zatamnjenu foliju na staklo vozila"
      vltCounter
    />
  );
}
