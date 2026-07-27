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
// Upisuje svaki upit kao red u aktivnu tabelu i šalje email obavještenje.

const NOTIFY_EMAIL = "quantumloopbih@gmail.com"; // <-- gdje stižu obavještenja
const SHEET_NAME = "Upiti";

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

    // Email obavještenje.
    const subject =
      "Novi upit sa sajta — " + (data.name || "nepoznato") + " (" + (data.service || "") + ")";
    const body = FIELDS.map((f) => f + ": " + (data[f] || "-")).join("\n");
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
      replyTo: data.email || NOTIFY_EMAIL,
    });

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
