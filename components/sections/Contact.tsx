"use client";

import { useState } from "react";
import { Phone, Mail, Loader2 } from "lucide-react";
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

// Preferred path when set: a Google Apps Script Web App that appends each
// request as a row in a Google Sheet and emails the owner. It doesn't return
// CORS headers, so we post no-cors (fire-and-forget) and can't read the
// response — a completed request is treated as success. When unset, the form
// falls back to the plain email endpoint above.
const SHEET_ENDPOINT = process.env.NEXT_PUBLIC_SHEET_ENDPOINT;

// Pinned to the real "Quantum loop" Google Business listing (CID, decoded from
// its maps.google.com place URL) rather than a geocoded address string — the
// address-text embed kept drifting to the wrong building (see git history).
const MAPS_CID = "11305872248226432655";
const MAP_SRC = `https://www.google.com/maps?cid=${MAPS_CID}&z=17&output=embed`;
const MAPS_VIEW_URL = `https://maps.google.com/?cid=${MAPS_CID}`;

type Status = "idle" | "sending" | "success" | "error";

// Floating-label fields: the label sits over an empty field like a placeholder,
// then shrinks up to the top edge once the field is focused or filled — so the
// label never disappears (accessible) and the form stays uncluttered.
const FIELD =
  "peer w-full rounded-md border border-white/20 bg-black2 px-3.5 pt-6 pb-2 font-sans text-[0.95rem] text-white focus:border-transparent focus:outline focus:outline-2 focus:outline-gold";
const FLOAT =
  "pointer-events-none absolute left-3.5 top-4 text-[0.95rem] text-grey transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[0.62rem] peer-focus:font-semibold peer-focus:tracking-[0.12em] peer-focus:text-gold2 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[0.62rem] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-[0.12em] peer-[:not(:placeholder-shown)]:uppercase";
// A <select> always has a value, so its label stays in the floated position.
const FLOAT_STATIC =
  "pointer-events-none absolute left-3.5 top-1.5 text-[0.62rem] font-semibold tracking-[0.12em] text-grey uppercase";

export default function Contact() {
  const { t, d, lang } = useI18n();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");

    // Google Sheet path (Apps Script Web App): post the request no-cors so it
    // lands as a row in the Sheet and triggers the owner's email. We can't read
    // an opaque no-cors response, so a request that completes without throwing
    // counts as success.
    if (SHEET_ENDPOINT) {
      try {
        const body = new URLSearchParams();
        formData.forEach((value, key) => {
          if (typeof value === "string") body.append(key, value);
        });
        body.append("page", window.location.pathname);
        await fetch(SHEET_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        setStatus("success");
        form.reset();
      } catch {
        setStatus("error");
      }
      return;
    }

    // Fallback: plain email endpoint (FormSubmit / Formspree), no Sheet.
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

        <form
          id="upit"
          onSubmit={handleSubmit}
          className="contact-form grid scroll-mt-24 gap-3.5"
        >
          {/* FormSubmit control fields */}
          <input
            type="hidden"
            name="_subject"
            value="Novi upit sa sajta — Quantum Loop"
          />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          {/* language the request was submitted in (helps triage in the Sheet) */}
          <input type="hidden" name="lang" value={lang} />
          {/* honeypot — bots fill it, humans never see it */}
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div className="relative">
            <input
              required
              type="text"
              id="cf-name"
              name="name"
              autoComplete="name"
              placeholder=" "
              className={FIELD}
            />
            <label htmlFor="cf-name" className={FLOAT}>
              {t("f_name")}
            </label>
          </div>

          <div className="relative">
            <input
              required
              type="email"
              id="cf-email"
              name="email"
              autoComplete="email"
              placeholder=" "
              className={FIELD}
            />
            <label htmlFor="cf-email" className={FLOAT}>
              {t("f_email")}
            </label>
          </div>

          <div className="relative">
            <input
              type="tel"
              id="cf-phone"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder=" "
              className={FIELD}
            />
            <label htmlFor="cf-phone" className={FLOAT}>
              {t("f_phone")}
            </label>
          </div>

          <div className="relative">
            <select id="cf-service" name="service" className={FIELD}>
              {d.svc.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <label htmlFor="cf-service" className={FLOAT_STATIC}>
              {t("f_service")}
            </label>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                id="cf-dimensions"
                name="dimensions"
                placeholder=" "
                className={FIELD}
              />
              <label htmlFor="cf-dimensions" className={FLOAT}>
                {t("f_dimensions")}
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                id="cf-quantity"
                name="quantity"
                placeholder=" "
                className={FIELD}
              />
              <label htmlFor="cf-quantity" className={FLOAT}>
                {t("f_quantity")}
              </label>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="relative">
              <select id="cf-deadline" name="deadline" className={FIELD}>
                <option>{t("f_dl_flexible")}</option>
                <option>{t("f_dl_2w")}</option>
                <option>{t("f_dl_1w")}</option>
                <option>{t("f_dl_asap")}</option>
              </select>
              <label htmlFor="cf-deadline" className={FLOAT_STATIC}>
                {t("f_deadline")}
              </label>
            </div>
            <div className="relative">
              <select id="cf-install" name="install" className={FIELD}>
                <option>{t("f_install_yes")}</option>
                <option>{t("f_install_no")}</option>
                <option>{t("f_install_unsure")}</option>
              </select>
              <label htmlFor="cf-install" className={FLOAT_STATIC}>
                {t("f_install")}
              </label>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="cf-message"
              name="message"
              placeholder=" "
              className={`${FIELD} min-h-[130px] resize-y`}
            />
            <label htmlFor="cf-message" className={FLOAT}>
              {t("f_message")}
            </label>
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 justify-self-start rounded bg-linear-to-br from-gold to-gold2 px-[30px] py-[15px] text-[0.95rem] font-bold tracking-[0.04em] text-black disabled:opacity-70"
          >
            {status === "sending" && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {status === "sending" ? t("f_sending") : t("f_send")}
          </button>

          {status === "success" && (
            <p role="status" className="text-sm text-gold2">
              {t("form_ok")}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-sm text-red-400">
              {t("form_err")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
