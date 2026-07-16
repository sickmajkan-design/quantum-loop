"use client";

import type { RefObject } from "react";
import PhotoRevealScene from "./PhotoRevealScene";

export default function WrapScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <PhotoRevealScene
      rowRef={rowRef}
      src="/stock/vehicle-wrap.jpg"
      alt="Ruke u rukavicama nanose zlatnu foliju na haubu vozila"
    />
  );
}
