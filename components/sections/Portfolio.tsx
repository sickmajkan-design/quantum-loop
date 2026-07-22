"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { portfolio, collectImages } from "@/content/portfolio";
import { business } from "@/lib/site";
import InstagramIcon from "@/components/ui/InstagramIcon";

export default function Portfolio() {
  const { t, d } = useI18n();
  const images = collectImages(d.tiles);
  const hasImages = images.length > 0;
  // Categories without a real photo yet still get a styled placeholder tile
  // in the grid, so all services stay represented once any category has
  // real photos (which otherwise fully replace the all-placeholder marquee).
  const emptyLabels = portfolio
    .filter((cat) => cat.images.length === 0)
    .map((cat) => d.tiles[cat.labelIndex] ?? cat.slug);
  const [active, setActive] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openAt = useCallback((i: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActive(i);
  }, []);
  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: number) =>
      setActive((i) =>
        i === null ? i : (i + dir + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (active === null) {
      // Return focus to whichever tile opened the lightbox once it closes,
      // so keyboard users land back where they were instead of at the top.
      triggerRef.current?.focus();
      triggerRef.current = null;
      return;
    }

    const focusables = () =>
      Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>("button") ?? []
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        const els = focusables();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  // Placeholder tiles reuse the localized category labels. Duplicated once so
  // the marquee can scroll seamlessly.
  const placeholders = [...d.tiles, ...d.tiles];

  return (
    <section
      id="portfolio"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <div className="mb-4 text-center text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase sm:text-left">
        {t("p_eyebrow")}
      </div>
      <h2 className="mb-6 text-center text-[clamp(2.2rem,6vw,4.5rem)] sm:text-left">
        {t("p_title")}
      </h2>

      {hasImages ? (
        <div className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              className="group relative h-[220px] overflow-hidden rounded-lg border border-gold/25 bg-black2"
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_60px_rgba(201,162,39,0.5)] transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-4 text-[0.85rem] font-semibold tracking-[0.08em] text-gold2 uppercase">
                {img.label}
              </span>
            </button>
          ))}
          {emptyLabels.map((label) => (
            <div
              key={label}
              className="relative flex h-[220px] flex-col items-start justify-end overflow-hidden rounded-lg border border-gold/25 bg-linear-to-br from-[#151515] to-[#0d0d0d] p-4"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,162,39,0.15),transparent_60%)]" />
              <span className="relative text-[0.85rem] font-semibold tracking-[0.08em] text-gold2 uppercase">
                {label}
              </span>
              <span className="relative mt-1 text-[0.78rem] normal-case text-grey">
                {t("p_soon")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="group/marquee relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
          aria-label={t("p_title")}
        >
          <div className="flex w-max gap-[18px] motion-safe:animate-[marquee_38s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
            {placeholders.map((tile, i) => (
              <div
                key={`${tile}-${i}`}
                className="relative flex h-[200px] w-[300px] shrink-0 flex-col items-start justify-end overflow-hidden rounded-lg border border-gold/25 bg-linear-to-br from-[#151515] to-[#0d0d0d] p-4"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,162,39,0.15),transparent_60%)]" />
                <span className="relative text-[0.85rem] font-semibold tracking-[0.08em] text-gold2 uppercase">
                  {tile}
                </span>
                <span className="relative mt-1 text-[0.78rem] normal-case text-grey">
                  {t("p_soon")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <a
        href={business.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-10 flex flex-col items-center gap-5 rounded-lg border border-gold/25 bg-linear-to-br from-[#151515] to-[#0d0d0d] p-8 text-center transition-colors hover:border-gold/60 sm:flex-row sm:items-center sm:justify-between sm:text-left"
      >
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold2">
            <InstagramIcon className="size-6" />
          </span>
          <div>
            <div className="text-[1.1rem] font-bold text-white">
              {t("p_insta_title")}
            </div>
            <p className="mx-auto mt-1 max-w-md text-[0.9rem] text-grey sm:mx-0">
              {t("p_insta_text")}
            </p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="flex -space-x-3">
            {images.slice(0, 4).map((img) => (
              <div
                key={img.src}
                className="relative size-13 shrink-0 overflow-hidden rounded-full border-2 border-[#151515] ring-1 ring-gold/40"
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <span className="inline-block shrink-0 rounded bg-linear-to-br from-gold to-gold2 px-5 py-2.5 font-bold whitespace-nowrap text-black transition-transform group-hover:scale-105">
          {t("p_insta_cta")}
        </span>
      </a>

      <AnimatePresence>
        {active !== null && images[active] && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/92 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={images[active].label}
          >
            <button
              type="button"
              aria-label="Zatvori"
              onClick={close}
              className="absolute top-5 right-6 text-white/70 hover:text-gold"
            >
              <X className="size-8" />
            </button>
            <button
              type="button"
              aria-label="Prethodna"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-4 text-white/60 hover:text-gold md:left-10"
            >
              <ChevronLeft className="size-10" />
            </button>
            <motion.div
              key={images[active].src}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[76vh] w-[86vw] max-w-[1100px]"
            >
              <Image
                src={images[active].src}
                alt={images[active].label}
                fill
                sizes="86vw"
                className="rounded-lg object-contain"
              />
              <span className="absolute -bottom-8 left-0 text-[0.85rem] tracking-[0.08em] text-gold2 uppercase">
                {images[active].label}
              </span>
            </motion.div>
            <button
              type="button"
              aria-label="Sljedeća"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-4 text-white/60 hover:text-gold md:right-10"
            >
              <ChevronRight className="size-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
