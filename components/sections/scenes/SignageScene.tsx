"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useI18n } from "@/lib/i18n-context";

const SIGN_WORD: Record<string, string> = {
  sr: "REKLAMA",
  de: "WERBUNG",
  en: "SIGNAGE",
};

export default function SignageScene() {
  const sceneRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const { lang } = useI18n();

  useEffect(() => {
    if (prefersReducedMotion() || !textRef.current || !sceneRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        opacity: 1,
        duration: 1,
        scrollTrigger: { trigger: sceneRef.current, start: "top 65%" },
        onComplete: () => {
          gsap.to(textRef.current, {
            opacity: 0.55,
            repeat: -1,
            yoyo: true,
            duration: 1.4,
            ease: "sine.inOut",
          });
        },
      });
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={sceneRef}
      viewBox="0 0 400 300"
      aria-hidden="true"
      className="block h-auto w-full"
    >
      <rect
        x="70"
        y="80"
        width="260"
        height="90"
        rx="8"
        fill="#141414"
        stroke="#C9A227"
        strokeOpacity=".5"
      />
      <text
        ref={textRef}
        x="200"
        y="140"
        textAnchor="middle"
        fontFamily="Anton"
        fontSize="40"
        fill="#E5C158"
        className="opacity-15 motion-reduce:opacity-100"
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(229,193,88,.8)) drop-shadow(0 0 20px rgba(201,162,39,.5))",
        }}
      >
        {SIGN_WORD[lang] ?? SIGN_WORD.sr}
      </text>
      <rect x="188" y="170" width="24" height="80" fill="#191919" />
    </svg>
  );
}
