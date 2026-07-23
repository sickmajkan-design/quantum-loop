"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n-context";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Magnetic from "@/components/ui/Magnetic";

const PARTICLE_COUNT = 22;

function renderWords(text: string, gold: boolean) {
  return text
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w, i) => (
      <span
        key={`${gold ? "g" : "w"}-${i}-${w}`}
        className={`hero-word inline-block overflow-hidden align-top ${gold ? "text-gold" : ""}`}
      >
        <i className="inline-block translate-y-[110%] not-italic motion-reduce:translate-y-0">
          {w}
        </i>
        &nbsp;
      </span>
    ));
}

export default function Hero() {
  const { t, lang } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const peelRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const [before, after] = t("hero_title").split("|");

  useEffect(() => {
    if (prefersReducedMotion() || !particlesRef.current) return;
    const nodes =
      particlesRef.current.querySelectorAll<HTMLSpanElement>(".dust-particle");
    nodes.forEach((el) => {
      const size = 2 + Math.random() * 3;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.animation = `dust-float ${6 + Math.random() * 6}s ease-in-out ${
        Math.random() * 6
      }s infinite`;
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".hero-word i", {
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.15,
      });
      gsap.to(peelRef.current, {
        xPercent: 200,
        duration: 1.6,
        ease: "power2.inOut",
        delay: 0.3,
      });
      gsap.to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.8,
      });
      gsap.to(ctasRef.current, { opacity: 1, duration: 0.8, delay: 1.05 });

      gsap.to(innerRef.current, {
        yPercent: 18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative z-2 flex min-h-dvh max-w-none flex-col justify-center pt-[20vh] pb-[10vh]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      >
        <div
          ref={peelRef}
          className="absolute top-0 left-[-20%] h-full w-[140%] -translate-x-full"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(229,193,88,.16) 45%, rgba(201,162,39,.35) 50%, rgba(229,193,88,.16) 55%, transparent 70%)",
          }}
        />

        <div ref={particlesRef} className="absolute inset-0">
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <span
              key={i}
              className="dust-particle absolute rounded-full bg-gold2 opacity-0"
            />
          ))}
        </div>
      </div>

      <div
        ref={innerRef}
        className="relative mx-auto w-full max-w-[1300px] px-[5vw]"
      >
        <div className="mb-[30px] inline-flex items-center gap-2.5 rounded-full border border-gold/50 px-[18px] py-2 text-[0.8rem] font-semibold tracking-[0.12em] text-gold2 uppercase before:h-2 before:w-2 before:rounded-full before:bg-gold before:shadow-[0_0_12px_var(--color-gold)] before:content-['']">
          {t("badge")}
        </div>

        <h1 className="text-[clamp(3rem,11vw,9.5rem)] overflow-hidden">
          {renderWords(before, false)}
          {renderWords(after, true)}
        </h1>

        <p
          ref={subRef}
          className="mt-[26px] max-w-[520px] translate-y-2 text-[1.1rem] text-[#cfcabc] opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
        >
          {t("hero_sub")}
        </p>

        <div
          ref={ctasRef}
          className="mt-[38px] flex flex-wrap gap-4 opacity-0 motion-reduce:opacity-100"
        >
          <Magnetic>
            <a
              href="#upit"
              className="inline-block rounded bg-linear-to-br from-gold to-gold2 px-[30px] py-[15px] text-[0.95rem] font-bold tracking-[0.04em] text-black transition-[filter] hover:brightness-110"
            >
              {t("hero_cta1")}
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#services"
              className="inline-block rounded border border-white/35 px-[30px] py-[15px] text-[0.95rem] font-bold tracking-[0.04em] text-white transition-colors hover:border-gold"
            >
              {t("hero_cta2")}
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue — a thin gold line that reads as the start of the gold
          thread threading the page. Desktop only (mobile scrolls naturally);
          reduced motion keeps a static line without the travelling highlight. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 opacity-0 [animation:cue-in_0.6s_ease_1.4s_forwards] motion-reduce:opacity-100 motion-reduce:[animation:none] sm:block"
      >
        <span className="relative block h-14 w-px overflow-hidden bg-linear-to-b from-transparent via-gold/40 to-gold/70">
          <span className="absolute inset-x-0 top-0 h-4 bg-gold2 [animation:scroll-cue_1.9s_ease-in-out_infinite] motion-reduce:hidden" />
        </span>
      </div>
    </section>
  );
}
