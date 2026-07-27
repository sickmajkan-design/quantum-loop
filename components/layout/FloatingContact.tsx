"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { business } from "@/lib/site";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import ViberIcon from "@/components/ui/ViberIcon";

// WhatsApp/Viber are only active on the BiH number — the AT number doesn't
// have either app, so both buttons deliberately use phones[0] regardless of
// which country a visitor is browsing from.
const GREETING: Record<string, string> = {
  sr: "Zdravo! Zanima me ponuda za...",
  de: "Hallo! Ich interessiere mich für ein Angebot für...",
  en: "Hi! I'm interested in a quote for...",
};

export default function FloatingContact() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const phone = business.phones[0].tel;
  const whatsappHref = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(
    GREETING[lang] ?? GREETING.sr
  )}`;
  // Unlike wa.me's officially supported `text` param, Viber's `chat` URI
  // scheme has no documented pre-fill support — `text` here is a best-effort
  // add-on some app versions honor; if not, it's silently ignored and the
  // chat still opens normally.
  const viberHref = `viber://chat?number=${encodeURIComponent(phone)}&text=${encodeURIComponent(
    GREETING[lang] ?? GREETING.sr
  )}`;

  return (
    <div className="fixed right-5 bottom-21 z-40 flex flex-col items-end gap-3 lg:bottom-6">
      {/* Collapsed by default to one small launcher — two always-on circles
          were tall enough to sit over section text/buttons on mobile (FAQ
          questions, hero CTA). Only expand on demand. */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-200 ease-out ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <a
          href={viberHref}
          aria-label="Viber"
          title="Viber"
          tabIndex={open ? 0 : -1}
          className="flex size-13 items-center justify-center rounded-full bg-[#7360F2] text-white shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition-transform hover:scale-110"
        >
          <ViberIcon className="size-6" />
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          title="WhatsApp"
          tabIndex={open ? 0 : -1}
          className="flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition-transform hover:scale-110"
        >
          <WhatsAppIcon className="size-6" />
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Zatvori" : "Kontakt"}
        aria-expanded={open}
        className="flex size-13 items-center justify-center rounded-full bg-linear-to-br from-gold to-gold2 text-black shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition-transform hover:scale-110"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
