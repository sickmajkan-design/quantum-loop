"use client";

import { useRef } from "react";
import { useI18n } from "@/lib/i18n-context";
import ServiceRow from "./ServiceRow";
import DesignScene from "./scenes/DesignScene";
import WrapScene from "./scenes/WrapScene";
import FlatSurfaceScene from "./scenes/FlatSurfaceScene";
import TintScene from "./scenes/TintScene";
import SignageScene from "./scenes/SignageScene";

export default function Services() {
  const { t } = useI18n();
  const designRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const flatRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="services"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <div className="mb-4 text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase">
        {t("s_eyebrow")}
      </div>
      <h2 className="mb-6 text-[clamp(2.2rem,6vw,4.5rem)]">{t("s_title")}</h2>

      <div className="mt-16 grid grid-cols-1 gap-24">
        <ServiceRow
          ref={designRef}
          id="sc-design"
          num="01"
          title={t("s1_t")}
          text={t("s1_p")}
        >
          <DesignScene rowRef={designRef} />
        </ServiceRow>

        <ServiceRow
          ref={wrapRef}
          id="sc-wrap"
          num="02"
          title={t("s2_t")}
          text={t("s2_p")}
          reverse
          fullBleed
        >
          <WrapScene rowRef={wrapRef} />
        </ServiceRow>

        <ServiceRow
          ref={flatRef}
          id="sc-flat"
          num="03"
          title={t("s3_t")}
          text={t("s3_p")}
          fullBleed
        >
          <FlatSurfaceScene rowRef={flatRef} />
        </ServiceRow>

        <ServiceRow
          ref={tintRef}
          id="sc-tint"
          num="04"
          title={t("s4_t")}
          text={t("s4_p")}
          reverse
          fullBleed
        >
          <TintScene rowRef={tintRef} />
        </ServiceRow>

        <ServiceRow id="sc-sign" num="05" title={t("s5_t")} text={t("s5_p")}>
          <SignageScene />
        </ServiceRow>
      </div>
    </section>
  );
}
