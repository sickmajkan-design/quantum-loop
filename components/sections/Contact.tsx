"use client";

import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { business } from "@/lib/site";
import InstagramIcon from "@/components/ui/InstagramIcon";
import Reveal from "@/components/ui/Reveal";

// The form posts to a no-backend email service. By default it uses FormSubmit
// (https://formsubmit.co) targeting the business email — no account needed; the
// address just has to confirm once via the activation email FormSubmit sends on
// the first submission. To switch providers (Formspree, Web3Forms, …) set
// NEXT_PUBLIC_FORM_ENDPOINT to that provider's endpoint URL.
const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORM_ENDPOINT ??
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ??
  `https://formsubmit.co/ajax/${business.email}`;

// Pinned to the real "Quantum loop" Google Business listing (CID, decoded from
// its maps.google.com place URL) rather than a geocoded address string — the
// address-text embed kept drifting to the wrong building (see git history).
const MAPS_CID = "11305872248226432655";
const MAP_SRC = `https://www.google.com/maps?cid=${MAPS_CID}&z=17&output=embed`;
const MAPS_VIEW_URL = `https://maps.google.com/?cid=${MAPS_CID}`;

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const { t, d } = useI18n();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative z-2 mx-auto max-w-[1300px] px-[5vw] py-[14vh]"
    >
      <Reveal>
        <div className="mb-4 text-center text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase sm:text-left">
          {t("c_eyebrow")}
        </div>
        <h2 className="mb-6 text-center text-[clamp(2.2rem,6vw,4.5rem)] sm:text-left">
          {t("c_title")}
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-[6vw]">
        <div>
          <p className="my-5 leading-[2] text-[#cfcabc]">
            <b className="text-gold2">Quantum Loop s.p.</b>
            <br />
            Vojvode Stepe Stepanovića 56
            <br />
            74400 Derventa, BiH
            <br />
            <span>{t("c_soon")}</span>
          </p>

          <div className="my-5 grid gap-2.5 text-[#cfcabc]">
            {business.phones.map((p) => (
              <div key={p.tel} className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-gold2" aria-hidden="true" />
                <a
                  href={`tel:${p.tel}`}
                  className="text-gold2 underline-offset-2 hover:underline"
                >
                  {p.display}
                </a>
                <span className="text-grey">({p.region})</span>
              </div>
            ))}
            <div className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-gold2" aria-hidden="true" />
              <a
                href={`mailto:${business.email}`}
                className="text-gold2 underline-offset-2 hover:underline"
              >
                {business.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <InstagramIcon className="size-4 shrink-0 text-gold2" />
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold2 underline-offset-2 hover:underline"
              >
                @quantumloopbih
              </a>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-gold/20">
            <iframe
              title="Karta — Quantum Loop, Derventa"
              src={MAP_SRC}
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={MAPS_VIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-gold2 underline-offset-2 hover:underline"
          >
            Otvori u Google Maps →
          </a>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3.5">
          {/* FormSubmit control fields */}
          <input
            type="hidden"
            name="_subject"
            value="Novi upit sa sajta — Quantum Loop"
          />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          {/* honeypot — bots fill it, humans never see it */}
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <input
            required
            type="text"
            name="name"
            placeholder={t("f_name")}
            aria-label={t("f_name")}
            className="rounded-md border border-white/20 bg-black2 p-3.5 font-sans text-[0.95rem] text-white focus:border-transparent focus:outline focus:outline-2 focus:outline-gold"
          />
          <input
            required
            type="email"
            name="email"
            placeholder={t("f_email")}
            aria-label={t("f_email")}
            className="rounded-md border border-white/20 bg-black2 p-3.5 font-sans text-[0.95rem] text-white focus:border-transparent focus:outline focus:outline-2 focus:outline-gold"
          />
          <select
            name="service"
            aria-label={t("f_name")}
            className="rounded-md border border-white/20 bg-black2 p-3.5 font-sans text-[0.95rem] text-white focus:border-transparent focus:outline focus:outline-2 focus:outline-gold"
          >
            {d.svc.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <textarea
            name="message"
            placeholder={t("f_msg")}
            aria-label={t("f_msg")}
            className="min-h-[120px] resize-y rounded-md border border-white/20 bg-black2 p-3.5 font-sans text-[0.95rem] text-white focus:border-transparent focus:outline focus:outline-2 focus:outline-gold"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="justify-self-start rounded bg-linear-to-br from-gold to-gold2 px-[30px] py-[15px] text-[0.95rem] font-bold tracking-[0.04em] text-black disabled:opacity-60"
          >
            {t("f_send")}
          </button>

          {status === "success" && (
            <p role="status" className="text-sm text-gold2">
              {t("form_ok")}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-sm text-red-400">
              Greška — pokušajte ponovo kasnije.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
