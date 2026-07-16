"use client";

import type { RefObject } from "react";
import PhotoRevealScene from "./PhotoRevealScene";

export default function FlatSurfaceScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <PhotoRevealScene
      rowRef={rowRef}
      src="/stock/flat-surface.jpg"
      alt="Ruke nanose foliju na staklenu površinu vozila"
      glassReflection
    />
  );
}
