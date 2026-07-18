"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * The signature "vinyl ribbon": a single gold foil strip that runs the full
 * height of the page and weaves left/right as it descends, drawing itself in
 * sync with scroll progress. It visually threads the sections together the way
 * a strip of vinyl peels off its roll.
 *
 * Implemented as an absolutely-positioned SVG whose viewBox height tracks the
 * document height, so the path is authored in absolute page coordinates and
 * simply revealed via stroke-dashoffset as the user scrolls.
 */
export default function Ribbon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const glow = glowRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    let st: ScrollTrigger | null = null;

    const build = () => {
      const docH = document.documentElement.scrollHeight;
      const W = 100;
      svg.setAttribute("viewBox", `0 0 ${W} ${docH}`);
      svg.style.height = `${docH}px`;

      // Weave the ribbon around the centre line as it descends, sampled at a
      // handful of anchors and joined with smooth cubic segments.
      const cx = W / 2;
      const amp = W * 0.32;
      const steps = 10;
      let dd = `M ${cx} 0`;
      for (let i = 1; i <= steps; i++) {
        const y = (docH / steps) * i;
        const yPrev = (docH / steps) * (i - 1);
        const xPrev = cx + amp * Math.sin((i - 1) * 1.15);
        const x = cx + amp * Math.sin(i * 1.15);
        const cy = (yPrev + y) / 2;
        dd += ` C ${xPrev} ${cy}, ${x} ${cy}, ${x} ${y}`;
      }
      path.setAttribute("d", dd);
      glow?.setAttribute("d", dd);

      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      if (glow) {
        glow.style.strokeDasharray = String(len);
        glow.style.strokeDashoffset = String(len);
      }

      if (prefersReducedMotion()) {
        path.style.strokeDashoffset = "0";
        if (glow) glow.style.strokeDashoffset = "0";
        return;
      }

      st?.kill();
      st = ScrollTrigger.create({
        start: 0,
        end: "max",
        scrub: 0.6,
        onUpdate: (self) => {
          const drawn = len * self.progress;
          path.style.strokeDashoffset = String(len - drawn);
          if (glow) glow.style.strokeDashoffset = String(len - drawn);
          if (headRef.current) {
            const p = path.getPointAtLength(drawn);
            headRef.current.setAttribute("cx", String(p.x));
            headRef.current.setAttribute("cy", String(p.y));
            headRef.current.style.opacity =
              self.progress > 0.002 && self.progress < 0.998 ? "1" : "0";
          }
        },
      });
    };

    build();
    // Rebuild on resize and once fonts/images settle the layout height.
    const onResize = () => {
      build();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    const t = window.setTimeout(build, 600);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      st?.kill();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      id="ribbon"
      aria-hidden="true"
      preserveAspectRatio="none"
      className="pointer-events-none absolute top-0 left-0 z-1 hidden w-full opacity-70 md:block"
    >
      <defs>
        <linearGradient id="ribbon-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-gold)" stopOpacity="0" />
          <stop offset="0.12" stopColor="var(--color-gold)" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="var(--color-gold2)" />
          <stop offset="0.88" stopColor="var(--color-gold)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        ref={glowRef}
        fill="none"
        stroke="var(--color-gold2)"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.18"
        style={{ filter: "blur(6px)" }}
      />
      <path
        ref={pathRef}
        fill="none"
        stroke="url(#ribbon-grad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        ref={headRef}
        r="4.5"
        fill="var(--color-gold2)"
        opacity="0"
        style={{ filter: "drop-shadow(0 0 6px var(--color-gold))" }}
      />
    </svg>
  );
}
