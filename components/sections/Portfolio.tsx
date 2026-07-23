"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Car,
  PanelTop,
  AppWindow,
  SunDim,
  PenTool,
  Type,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { portfolio, collectImages } from "@/content/portfolio";
import { business } from "@/lib/site";
import InstagramIcon from "@/components/ui/InstagramIcon";
import FadeImage from "@/components/ui/FadeImage";
import Reveal from "@/components/ui/Reveal";

// A quiet line icon per service, shown on the "coming soon" tiles so an empty
// category still reads as a real, intentional part of the set.
const CATEGORY_ICON: Record<string, LucideIcon> = {
  "vehicle-wrap": Car,
  signage: PanelTop,
  "window-vinyl": AppWindow,
  tinting: SunDim,
  logo: PenTool,
  "letters-3d": Type,
};

export default function Portfolio() {
  const { t, d } = useI18n();
  const images = collectImages(d.tiles);
  const hasImages = images.length > 0;
  // Categories without a real photo yet still get a styled placeholder tile
  // in the grid, so all services stay represented once any category has
  // real photos (which otherwise fully replace the all-placeholder marquee).
  const emptyCats = portfolio
    .filter((cat) => cat.images.length === 0)
    .map((cat) => ({
      slug: cat.slug,
      label: d.tiles[cat.labelIndex] ?? cat.slug,
    }));
  const [active, setActive] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Plain handlers — the React Compiler memoizes them; manual useCallback here
  // conflicted with its inference (stable setActive) and disabled optimization.
  const openAt = (i: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActive(i);
  };
  const close = () => setActive(null);
  const step = (dir: number) =>
    setActive((i) =>
      i === null ? i : (i + dir + images.length) % images.length
    );

  // Horizontal swipe navigates prev/next in the lightbox (mobile).
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

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

    const len = images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight")
        setActive((i) => (i === null ? i : (i + 1) % len));
      if (e.key === "ArrowLeft")
        setActive((i) => (i === null ? i : (i - 1 + len) % len));
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
  }, [active, images.length]);

  // Placeholder tiles reuse the localized category labels. Duplicated once so
  // the marquee can scroll seamlessly.
  const placeholders = [...d.tiles, ...d.tiles];

  return (
    <section
      id="portfolio"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <Reveal>
        <div className="mb-4 text-center text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase sm:text-left">
          {t("p_eyebrow")}
        </div>
        <h2 className="mb-6 text-center text-[clamp(2.2rem,6vw,4.5rem)] sm:text-left">
          {t("p_title")}
        </h2>
      </Reveal>

      {hasImages ? (
        <div className="mt-10 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              className="group relative h-[220px] overflow-hidden rounded-lg border border-gold/25 bg-black2"
            >
              <FadeImage
                src={img.src}
                alt={img.label}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_60px_rgba(201,162,39,0.5)] transition-opacity duration-500 group-hover:opacity-100" />
              {/* scrim keeps the caption legible over any photo */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-4 bottom-3">
                {img.title ? (
                  <>
                    <span className="block text-[0.62rem] font-semibold tracking-[0.16em] text-gold2/90 uppercase">
                      {img.label}
                    </span>
                    <span className="mt-0.5 block text-[0.98rem] font-semibold text-white">
                      {img.title}
                    </span>
                  </>
                ) : (
                  <span className="block text-[0.85rem] font-semibold tracking-[0.08em] text-gold2 uppercase">
                    {img.label}
                  </span>
                )}
              </div>
            </button>
          ))}
          {emptyCats.map(({ slug, label }) => {
            const Icon = CATEGORY_ICON[slug] ?? AppWindow;
            return (
              <div
                key={slug}
                className="relative flex h-[220px] flex-col justify-between overflow-hidden rounded-lg border border-gold/20 bg-black2"
              >
                {/* diagonal gold hairlines — a nod to the site's gold thread */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, transparent 0 13px, var(--color-gold) 13px 14px)",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="relative flex items-start justify-between p-4">
                  <Icon className="size-6 text-gold/45" aria-hidden="true" />
                  <span className="rounded-full border border-gold/35 px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.16em] text-gold2/80 uppercase">
                    {t("p_soon_short")}
                  </span>
                </div>
                <div className="relative p-4">
                  <span className="text-[0.85rem] font-semibold tracking-[0.08em] text-gold2 uppercase">
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
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

      {/* Portalled to <body> so the fixed overlay escapes this section's
          `z-2` stacking context — otherwise the z-100 header would paint over
          the lightbox (incl. its close button). Guarded on `document` for the
          static-export/SSR pass; the modal is always closed on first render,
          so nothing is portalled during hydration. */}
      {typeof document !== "undefined" &&
        createPortal(
          active !== null && images[active] ? (
            <div
              ref={modalRef}
                onClick={close}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="fixed inset-0 z-200 flex animate-[lightbox-in_0.2s_ease] flex-col bg-black/92 p-4 backdrop-blur-sm sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-label={images[active].label}
              >
                {/* top bar: position counter + close */}
                <div
                  className="flex shrink-0 items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm font-semibold tracking-[0.1em] text-white/55">
                    <span className="text-gold2">
                      {String(active + 1).padStart(2, "0")}
                    </span>{" "}
                    / {String(images.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    aria-label="Zatvori"
                    onClick={close}
                    className="text-white/70 hover:text-gold"
                  >
                    <X className="size-8" />
                  </button>
                </div>

                {/* image area — arrows + the current photo */}
                <div className="relative flex min-h-0 flex-1 items-center justify-center">
                  <button
                    type="button"
                    aria-label="Prethodna"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(-1);
                    }}
                    className="absolute left-0 z-10 text-white/60 hover:text-gold md:left-4"
                  >
                    <ChevronLeft className="size-10" />
                  </button>
                  <div
                    key={images[active].src}
                    onClick={(e) => e.stopPropagation()}
                    className="relative h-full w-[78vw] max-w-[1100px] animate-[lightbox-pop_0.25s_ease]"
                  >
                    <FadeImage
                      src={images[active].src}
                      alt={images[active].label}
                      fill
                      sizes="86vw"
                      className="rounded-lg object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Sljedeća"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(1);
                    }}
                    className="absolute right-0 z-10 text-white/60 hover:text-gold md:right-4"
                  >
                    <ChevronRight className="size-10" />
                  </button>
                </div>

                {/* caption + thumbnail strip */}
                <div
                  className="mt-3 flex shrink-0 flex-col items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-wrap items-baseline justify-center gap-x-2">
                    {images[active].title && (
                      <span className="text-[1rem] font-semibold text-white">
                        {images[active].title}
                      </span>
                    )}
                    <span className="text-[0.8rem] tracking-[0.08em] text-gold2 uppercase">
                      {images[active].label}
                    </span>
                  </div>
                  {images.length > 1 && (
                    <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button
                          key={img.src}
                          type="button"
                          aria-label={img.title ?? img.label}
                          aria-current={i === active}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActive(i);
                          }}
                          className={`relative h-11 w-16 shrink-0 overflow-hidden rounded border transition ${
                            i === active
                              ? "border-gold2 opacity-100"
                              : "border-white/15 opacity-50 hover:opacity-90"
                          }`}
                        >
                          <Image
                            src={img.src}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null,
          document.body
        )}
    </section>
  );
}
