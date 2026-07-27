"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals its children with a subtle fade + rise the first time they scroll
 * into view. Distance/easing match the scenes' existing gsap entrance so every
 * section enters the page the same way. Reduced motion shows content instantly
 * (handled in CSS). State is only set from the observer callback, never
 * synchronously in the effect.
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}
