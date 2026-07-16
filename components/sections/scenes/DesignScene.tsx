"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const PEN_PATH_D = "M90 160 C 130 60, 200 60, 230 130 S 320 200, 340 110";

export default function DesignScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const penPathRef = useRef<SVGPathElement>(null);
  const penDotRef = useRef<SVGCircleElement>(null);
  const penTipRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !rowRef.current || !penPathRef.current) return;

    const pathEl = penPathRef.current;
    const len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = String(len);
    pathEl.style.strokeDashoffset = String(len);

    const ctx = gsap.context(() => {
      const progress = { v: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top top+=90",
          end: "+=450",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.to(
        progress,
        {
          v: 1,
          ease: "none",
          onUpdate: () => {
            pathEl.style.strokeDashoffset = String(len * (1 - progress.v));
            const p = pathEl.getPointAtLength(len * progress.v);
            const pAhead = pathEl.getPointAtLength(
              Math.min(len, len * progress.v + 1)
            );
            const angle =
              Math.atan2(pAhead.y - p.y, pAhead.x - p.x) * (180 / Math.PI);
            penDotRef.current?.setAttribute("cx", String(p.x));
            penDotRef.current?.setAttribute("cy", String(p.y));
            penTipRef.current?.setAttribute(
              "transform",
              `translate(${p.x} ${p.y}) rotate(${angle})`
            );
          },
        },
        0
      ).from(
        ".design-bit",
        {
          scale: 0,
          opacity: 0,
          transformOrigin: "center",
          stagger: 0.2,
          ease: "back.out(1.7)",
        },
        0.25
      );
    }, rowRef);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" className="block h-auto w-full">
      <rect
        x="40"
        y="30"
        width="320"
        height="200"
        rx="8"
        fill="#161616"
        stroke="#C9A227"
        strokeOpacity=".4"
      />
      <rect x="40" y="230" width="320" height="12" rx="4" fill="#1d1d1d" />

      <path
        ref={penPathRef}
        d={PEN_PATH_D}
        fill="none"
        stroke="#E5C158"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <g>
        <rect
          className="design-bit"
          x="120"
          y="90"
          width="34"
          height="34"
          fill="#C9A227"
        />
        <circle
          className="design-bit"
          cx="200"
          cy="107"
          r="19"
          fill="none"
          stroke="#E5C158"
          strokeWidth="4"
        />
        <polygon
          className="design-bit"
          points="250,124 270,90 290,124"
          fill="#F5F2EA"
        />
      </g>

      <g ref={penTipRef} className="motion-reduce:hidden">
        <path
          d="M0,0 L-14,-4 L-19,0 L-14,4 Z"
          fill="#F5F2EA"
          stroke="#0A0A0A"
          strokeWidth="0.5"
        />
      </g>
      <circle
        ref={penDotRef}
        r="4"
        fill="#E5C158"
        className="motion-reduce:hidden"
      />
    </svg>
  );
}
