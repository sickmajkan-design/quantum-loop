"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

const items: {
  qKey: "faq1_q" | "faq2_q" | "faq3_q" | "faq4_q" | "faq5_q";
  aKey: "faq1_a" | "faq2_a" | "faq3_a" | "faq4_a" | "faq5_a";
}[] = [
  { qKey: "faq1_q", aKey: "faq1_a" },
  { qKey: "faq2_q", aKey: "faq2_a" },
  { qKey: "faq3_q", aKey: "faq3_a" },
  { qKey: "faq4_q", aKey: "faq4_a" },
  { qKey: "faq5_q", aKey: "faq5_a" },
];

export default function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <div className="mb-4 text-center text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase sm:text-left">
        {t("faq_eyebrow")}
      </div>
      <h2 className="mb-10 text-center text-[clamp(2.2rem,6vw,4.5rem)] sm:text-left">
        {t("faq_title")}
      </h2>

      <div className="mx-auto max-w-180 sm:mx-0">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.qKey} className="border-b border-gold/20">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-[1.05rem] font-semibold text-white"
              >
                {t(item.qKey)}
                <ChevronDown
                  className={`size-5 shrink-0 text-gold2 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0">
                  <p className="pb-5 text-[0.92rem] text-[#cfcabc]">
                    {t(item.aKey)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
