"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n-context";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function Salzburg() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const routeRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const route = routeRef.current;
    if (!route || !sectionRef.current) return;

    const len = route.getTotalLength();
    route.style.strokeDasharray = `${len}`;

    if (prefersReducedMotion()) {
      route.style.strokeDashoffset = "0";
      return;
    }
    route.style.strokeDashoffset = `${len}`;

    const ctx = gsap.context(() => {
      gsap.to(route, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "center center",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="salzburg"
      ref={sectionRef}
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <div className="grid min-h-0 grid-cols-1 items-center gap-10 md:min-h-[70vh] md:grid-cols-2 md:gap-[6vw]">
        <div
          className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-[10px] border border-gold/18 bg-black2 p-[6%] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 400 300" className="block h-auto w-full">
            {/* stylized map hint: mountain ridges + a river winding through */}
            <g stroke="#C9A227" strokeOpacity="0.18" fill="none" strokeWidth="2">
              <path d="M0 205 L70 140 L120 185 L190 110 L250 175 L320 120 L400 185" />
              <path
                d="M40 240 L95 195 L150 235 L215 170"
                strokeOpacity="0.12"
              />
            </g>
            <path
              d="M30 60 C 120 90, 90 150, 180 170 S 300 210, 360 265"
              stroke="#3a4a5a"
              strokeOpacity="0.5"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />

            {/* the animated route Derventa -> Salzburg */}
            <path
              ref={routeRef}
              d="M320 240 C 260 200, 220 160, 170 120 S 90 70, 70 55"
              fill="none"
              stroke="#C9A227"
              strokeWidth="3"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />

            {/* origin: Derventa */}
            <circle cx="320" cy="240" r="7" fill="#F5F2EA" />
            <text
              x="320"
              y="268"
              textAnchor="middle"
              fill="#cfcabc"
              fontSize="14"
              fontFamily="var(--font-inter)"
            >
              Derventa
            </text>

            {/* destination: Salzburg, pulsing */}
            <circle cx="70" cy="55" r="9" fill="#E5C158" className="sz-pulse" />
            <circle
              cx="70"
              cy="55"
              r="9"
              fill="none"
              stroke="#E5C158"
              strokeWidth="2"
              className="sz-ring"
            />
            <text
              x="70"
              y="90"
              textAnchor="middle"
              fill="#E5C158"
              fontSize="15"
              fontWeight="700"
              fontFamily="var(--font-inter)"
            >
              Salzburg
            </text>
          </svg>
        </div>

        <div>
          <div className="mb-4 text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase">
            {t("sz_eyebrow")}
          </div>
          <h3 className="text-[clamp(2rem,5vw,3.4rem)]">{t("sz_title")}</h3>
          <p className="mt-3.5 max-w-[460px] text-[#cfcabc]">{t("sz_p")}</p>
        </div>
      </div>
    </section>
  );
}
