"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";

/**
 * next/image with a shimmer skeleton behind it while the photo loads.
 *
 * The site is a static export with `unoptimized` images, so there's no built-in
 * blur placeholder — large photos would otherwise pop in from a blank box. The
 * image itself is never opacity-gated, so it can't get stuck hidden if the load
 * is missed; the skeleton just sits behind it and is removed once loaded.
 *
 * Load is detected by listening on the underlying <img> directly (via a callback
 * ref) rather than next/image's `onLoad`, which didn't fire reliably here. The
 * `complete` check covers images already cached before the ref attaches.
 * Requires a positioned parent (as `fill` images already need).
 */
export default function FadeImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (!node) return;
    if (node.complete) {
      setLoaded(true);
    } else {
      node.addEventListener("load", () => setLoaded(true), { once: true });
    }
  }, []);

  return (
    <>
      {!loaded && (
        <span
          aria-hidden="true"
          className="skeleton pointer-events-none absolute inset-0"
        />
      )}
      {/* alt is always supplied by callers via {...props} */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image {...props} ref={imgRef} />
    </>
  );
}
