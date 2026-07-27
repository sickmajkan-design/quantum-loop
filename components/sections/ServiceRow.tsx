"use client";

import { forwardRef } from "react";

interface ServiceRowProps {
  id: string;
  num: string;
  title: string;
  text: string;
  reverse?: boolean;
  fullBleed?: boolean;
  children: React.ReactNode;
}

const ServiceRow = forwardRef<HTMLDivElement, ServiceRowProps>(
  function ServiceRow({ id, num, title, text, reverse, fullBleed, children }, ref) {
    return (
      <div
        ref={ref}
        id={id}
        className={`grid min-h-0 grid-cols-1 items-center gap-10 md:min-h-[70vh] md:grid-cols-2 md:gap-[6vw] ${
          reverse ? "md:[direction:rtl]" : ""
        }`}
      >
        <div
          className={`flex aspect-4/3 items-center justify-center overflow-hidden rounded-[10px] border border-gold/18 bg-black2 shadow-[0_30px_80px_rgba(0,0,0,0.5)] md:[direction:ltr] ${
            fullBleed ? "" : "p-[8%]"
          }`}
          aria-hidden="true"
        >
          {children}
        </div>
        <div className="text-center md:text-left md:[direction:ltr]">
          <div
            aria-hidden="true"
            className="mb-2.5 font-display text-[1.1rem] tracking-widest text-gold2/90"
          >
            {num}
          </div>
          <h3 className="mb-4 text-[clamp(1.8rem,4vw,3rem)]">{title}</h3>
          <p className="mx-auto max-w-120 text-[#cfcabc] md:mx-0">{text}</p>
        </div>
      </div>
    );
  }
);

export default ServiceRow;
