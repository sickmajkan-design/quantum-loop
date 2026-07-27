# Upiti u Google tabelu (Google Sheet konfigurator)

Kontakt forma na sajtu može svaki upit da upiše kao red u Google tabelu **i**
da ti pošalje email obavještenje — bez servera i bez ikakvog naloga na
plaćenim servisima. Radi preko **Google Apps Script Web App-a**: sajt pošalje
podatke na tvoj skript, skript doda red u tabelu i pošalje mejl.

Dok endpoint nije podešen, forma i dalje radi — samo šalje običan email (preko
FormSubmit-a). Kad ubaciš URL skripte, upiti počinju da padaju i u tabelu.

## Šta se šalje iz forme

Svaki upit sadrži ova polja: `name`, `email`, `phone`, `service`,
`dimensions`, `quantity`, `deadline`, `install`, `message`, `lang`
(jezik: sr/de/en), `page` (sa koje stranice je poslato) i `_honey`
(skriveno anti-spam polje — ljudi ga nikad ne popune).

## Korak 1 — napravi tabelu

1. Otvori <https://sheets.google.com> i napravi novu praznu tabelu.
2. Nazovi je npr. **Quantum Loop — Upiti**.
3. Ništa drugo ne treba — skript sam upisuje zaglavlje pri prvom upitu.

## Korak 2 — dodaj skriptu

1. U tabeli: **Extensions → Apps Script** (Ekstenzije → Apps Script).
2. Obriši sav kod koji je tamo i nalijepi kod odozdo (`Code.gs`).
3. U vrhu koda promijeni `NOTIFY_EMAIL` na email na koji želiš obavještenja.
4. Klikni **Save** (ikonica diskete).

```javascript
// === Quantum Loop — prijem upita sa sajta ===
// Upisuje svaki upit kao red u aktivnu tabelu, šalje obavještenje vlasniku i
// automatsku potvrdu klijentu (na jeziku sa kojeg je upit poslat).

const NOTIFY_EMAIL = "quantumloopbih@gmail.com"; // <-- gdje stižu obavještenja
const SHEET_NAME = "Upiti";
const COMPANY = "Quantum Loop s.p.";
// Adresa sa koje mejlovi izlaze. Da bi ovo radilo, mora biti dodana kao
// verifikovan "Send mail as" alias u nalogu pod kojim je skripta objavljena
// (vidi uputstvo iznad). Ako alias nije podešen, skripta i dalje radi — samo
// šalje sa podrazumijevane adrese naloga.
const SENDER = "quantumloopbih@gmail.com";

// Vrati alias samo ako je stvarno verifikovan u nalogu, inače Google baci
// grešku pri slanju. Rezultat spajamo u opcije za MailApp.sendEmail.
function fromAlias() {
  try {
    return GmailApp.getAliases().indexOf(SENDER) !== -1 ? { from: SENDER } : {};
  } catch (err) {
    return {};
  }
}

// Redoslijed kolona u tabeli (mora se poklapati sa imenima polja iz forme).
const FIELDS = [
  "name",
  "email",
  "phone",
  "service",
  "dimensions",
  "quantity",
  "deadline",
  "install",
  "message",
  "lang",
  "page",
];

// Automatska potvrda klijentu — tekst po jeziku (sr/de/en).
// Zamjene: %NAME% %SERVICE% %DEADLINE% %MESSAGE%
const CONFIRM = {
  sr: {
    subject: "Primili smo vaš upit — Quantum Loop",
    body:
      "Poštovani/a %NAME%,\n\n" +
      "Hvala na upitu! Primili smo vaše podatke i javićemo vam se u najkraćem roku sa ponudom.\n\n" +
      "Usluga: %SERVICE%\nRok: %DEADLINE%\nVaša poruka: %MESSAGE%\n\n" +
      "Srdačan pozdrav,\nQuantum Loop s.p.\n+387 65 577 672",
  },
  de: {
    subject: "Wir haben Ihre Anfrage erhalten — Quantum Loop",
    body:
      "Sehr geehrte/r %NAME%,\n\n" +
      "vielen Dank für Ihre Anfrage! Wir haben Ihre Angaben erhalten und melden uns schnellstmöglich mit einem Angebot.\n\n" +
      "Leistung: %SERVICE%\nFrist: %DEADLINE%\nIhre Nachricht: %MESSAGE%\n\n" +
      "Mit freundlichen Grüßen,\nQuantum Loop s.p.\n+43 667 336 1966",
  },
  en: {
    subject: "We received your request — Quantum Loop",
    body:
      "Dear %NAME%,\n\n" +
      "Thank you for your request! We've received your details and will get back to you shortly with a quote.\n\n" +
      "Service: %SERVICE%\nDeadline: %DEADLINE%\nYour message: %MESSAGE%\n\n" +
      "Best regards,\nQuantum Loop s.p.\n+387 65 577 672",
  },
};

function doPost(e) {
  try {
    const data = (e && e.parameter) || {};

    // Anti-spam: botovi popune skriveno "_honey" polje, ljudi ne. Tiho odbaci.
    if (data._honey) {
      return ContentService.createTextOutput("ok");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Prvi upit: upiši zaglavlje.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Datum"].concat(FIELDS));
    }

    const row = [new Date()].concat(FIELDS.map((f) => data[f] || ""));
    sheet.appendRow(row);

    // --- Obavještenje vlasniku ---
    // Naslov odmah pokazuje uslugu, rok i kontakt (telefon ili email).
    const contact = data.phone || data.email || "";
    const subject =
      "Upit: " +
      (data.service || "?") +
      " — " +
      (data.deadline || "?") +
      (contact ? " — " + contact : "");
    const ownerBody = FIELDS.map((f) => f + ": " + (data[f] || "-")).join("\n");
    MailApp.sendEmail(
      Object.assign(
        {
          to: NOTIFY_EMAIL,
          subject: subject,
          body: ownerBody,
          name: COMPANY,
          replyTo: data.email || NOTIFY_EMAIL,
        },
        fromAlias()
      )
    );

    // --- Automatska potvrda klijentu (ako je ostavio ispravan email) ---
    if (data.email && /^\S+@\S+\.\S+$/.test(data.email)) {
      const c = CONFIRM[data.lang] || CONFIRM.sr;
      const clientBody = c.body
        .replace("%NAME%", data.name || "")
        .replace("%SERVICE%", data.service || "-")
        .replace("%DEADLINE%", data.deadline || "-")
        .replace("%MESSAGE%", data.message || "-");
      MailApp.sendEmail(
        Object.assign(
          {
            to: data.email,
            subject: c.subject,
            body: clientBody,
            name: COMPANY,
            replyTo: NOTIFY_EMAIL,
          },
          fromAlias()
        )
      );
    }

    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  }
}
```

## Korak 3 — objavi kao Web App

1. Gore desno klikni **Deploy → New deployment**.
2. Kraj **Select type** klikni zupčanik i izaberi **Web app**.
3. Podesi:
   - **Description**: `Quantum Loop upiti`
   - **Execute as**: **Me** (tvoj nalog)
   - **Who has access**: **Anyone** (mora ovako da bi sajt mogao da šalje)
4. Klikni **Deploy**.
5. Google će tražiti dozvolu — klikni **Authorize access**, izaberi svoj
   nalog, pa **Advanced → Go to … (unsafe)** → **Allow**. (Skript je tvoj,
   pa je bezbjedno.)
6. Kopiraj **Web app URL** — izgleda ovako:
   `https://script.google.com/macros/s/AKfy.../exec`

## Korak 4 — javi mi URL

Pošalji mi taj `/exec` URL i ja ću ga ubaciti u sajt (u
`NEXT_PUBLIC_SHEET_ENDPOINT` u GitHub Actions workflow-u). Nakon toga svaki
upit sa forme automatski pada u tabelu i stiže ti na mejl.

> Napomena: ako kasnije mijenjaš kod skripte, mora se ponovo objaviti preko
> **Deploy → Manage deployments → (olovka) → Version: New version → Deploy**,
> inače URL i dalje vrti staru verziju.

## Da mejlovi izlaze sa firminog naloga (alias)

Apps Script šalje mejlove **sa naloga pod kojim je objavljen**. Ako je skripta
napravljena na ličnom nalogu, i obavještenje i potvrda klijentu izlaze sa te
lične adrese. Da bi izlazili sa `quantumloopbih@gmail.com` bez prebacivanja
cijelog projekta, dodaj tu adresu kao **„Send mail as" alias** u nalogu koji
pokreće skriptu:

1. U Gmailu tog naloga: **⚙ → See all settings → Accounts and Import**.
2. Kod **Send mail as** → **Add another email address**.
3. Upiši `quantumloopbih@gmail.com`, ostavi **Treat as an alias** čekirano →
   **Next → Send verification**.
4. Otvori inbox naloga `quantumloopbih@gmail.com`, nađi Google-ov verifikacioni
   mejl i klikni link (ili prekopiraj kod). Sad je alias verifikovan.
5. Kod skripte već ima `SENDER = "quantumloopbih@gmail.com"` i `fromAlias()` —
   čim je alias verifikovan, mejlovi automatski izlaze sa te adrese. (Ako alias
   nije podešen, `fromAlias()` ga preskače pa skripta ne puca.)
6. Ponovo objavi: **Deploy → Manage deployments → (olovka) → Version: New
   version → Deploy** (URL ostaje isti). Pri prvom pokretanju Google traži
   dodatnu dozvolu za Gmail — odobri je.
