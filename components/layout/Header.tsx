"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";
import LangSwitcher from "./LangSwitcher";

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
        className="z-101 block text-2xl text-white lg:hidden"
      >
        {open ? "✕" : "☰"}
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
        <a
          href="#contact"
          className="rounded bg-linear-to-br from-gold to-gold2 px-5 py-2.5 font-bold text-black whitespace-nowrap opacity-100 hover:brightness-110"
        >
          {t("nav_cta")}
        </a>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 bg-black/97 lg:hidden"
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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
