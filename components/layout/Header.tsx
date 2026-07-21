"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import LangSwitcher from "./LangSwitcher";
import Magnetic from "@/components/ui/Magnetic";

const navItems = [
  { href: "#services", key: "nav_services" as const },
  { href: "#portfolio", key: "nav_work" as const },
  { href: "#guarantee", key: "nav_about" as const },
  { href: "#contact", key: "nav_contact" as const },
];

export default function Header() {
  const { t } = useI18n();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-100 flex items-center justify-between px-[5vw] py-[18px] transition-[background,box-shadow] duration-400 ${
          solid
            ? "bg-black/92 shadow-[0_1px_0_rgba(201,162,39,0.25)] backdrop-blur-md"
            : ""
        }`}
      >
        <a href="#hero" className="font-display text-[1.35rem] tracking-[0.05em] text-white">
          QUANTUM<span className="text-gold">LOOP</span>
        </a>

        <button
          aria-label="Meni"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="z-101 -m-2.5 block p-2.5 text-white lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-[0.85rem] font-medium tracking-[0.06em] text-white uppercase opacity-80 transition-colors hover:text-gold2 hover:opacity-100 whitespace-nowrap"
            >
              {t(item.key)}
            </a>
          ))}
          <LangSwitcher />
          <Magnetic strength={0.5}>
            <a
              href="#contact"
              className="inline-block rounded bg-linear-to-br from-gold to-gold2 px-5 py-2.5 font-bold text-black whitespace-nowrap opacity-100 hover:brightness-110"
            >
              {t("nav_cta")}
            </a>
          </Magnetic>
        </nav>
      </header>

      {/* Rendered outside <header> so scroll-triggered backdrop-blur on the
          header (a backdrop-filter, like transform, creates a new containing
          block) never re-anchors this fixed overlay to the header's small
          box instead of the viewport. */}
      <nav
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 bg-black/97 transition-transform duration-350 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        {navItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            onClick={() => setOpen(false)}
            className="text-xl text-white uppercase tracking-[0.06em]"
          >
            {t(item.key)}
          </a>
        ))}
        <LangSwitcher />
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="rounded bg-linear-to-br from-gold to-gold2 px-6 py-3 font-bold text-black"
        >
          {t("nav_cta")}
        </a>
      </nav>
    </>
  );
}
