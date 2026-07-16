"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";

// TODO: set NEXT_PUBLIC_FORMSPREE_ENDPOINT (e.g. https://formspree.io/f/xxxxxxx) once a form ID exists.
// Until then, submissions are not sent anywhere and the form only shows the confirmation message.
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

const MAP_SRC =
  "https://www.google.com/maps?q=Vojvode+Stepe+Stepanovi%C4%87a+56%2C+74400+Derventa%2C+Bosnia+and+Herzegovina&output=embed";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const { t, d } = useI18n();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!FORM_ENDPOINT) {
      setStatus("success");
      form.reset();
      return;
    }

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
      <div className="mb-4 text-[0.8rem] font-bold tracking-[0.25em] text-gold uppercase">
        {t("c_eyebrow")}
      </div>
      <h2 className="mb-6 text-[clamp(2.2rem,6vw,4.5rem)]">{t("c_title")}</h2>

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
            <br />
            <br />
            📞 <span className="text-gold2">[TODO: telefon]</span>
            <br />
            ✉️ <span className="text-gold2">[TODO: email]</span>
          </p>

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
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3.5">
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
