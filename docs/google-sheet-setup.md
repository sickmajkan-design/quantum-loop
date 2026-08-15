# Upiti u Google tabelu (Google Sheet)

Kontakt forma na sajtu svaki upit upiše kao red u Google tabelu **i** pošalje
ti email obavještenje — bez servera i bez ikakvog plaćenog naloga. Radi preko
**Google Apps Script Web App-a**: sajt pošalje podatke skripti, a skripta doda
red u tabelu i pošalje mejl vlasniku.

Kupcu se **ne** šalje nikakav email — potvrda mu se prikaže odmah na sajtu
("Zaprimili smo vaš upit i javićemo vam se u najkraćem roku."). Dok endpoint
nije podešen, forma i dalje radi preko običnog emaila (FormSubmit); kad ubaciš
URL skripte, upiti počinju da padaju i u tabelu.

## Šta se šalje iz forme

Svaki upit sadrži: `name`, `email`, `phone`, `service`, `dimensions`,
`quantity`, `deadline`, `install`, `message`, `lang` (jezik: sr/de/en),
`page` (sa koje stranice je poslato) i `_honey` (skriveno anti-spam polje).

## Korak 1 — napravi tabelu

1. Otvori <https://sheets.google.com> i napravi novu praznu tabelu.
2. Nazovi je npr. **Quantum Loop — Upiti**.
3. Ništa drugo ne treba — skripta sama upisuje zaglavlje pri prvom upitu.

## Korak 2 — dodaj skriptu

1. U tabeli: **Extensions → Apps Script** (Ekstenzije → Apps Script).
2. Obriši sav kod koji je tamo i nalijepi kod odozdo (`Code.gs`).
3. U vrhu koda po želji promijeni `NOTIFY_EMAIL` (gdje stižu obavještenja).
4. Klikni **Save** (💾).

```javascript
// === Quantum Loop — prijem upita sa sajta ===
// Upisuje svaki upit kao red u aktivnu tabelu i šalje obavještenje vlasniku.
// Kupcu se ne šalje email — njemu potvrdu prikazuje sam sajt.

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

    sheet.appendRow([new Date()].concat(FIELDS.map((f) => data[f] || "")));

    // Obavještenje vlasniku — naslov vodi sa uslugom, rokom i kontaktom.
    const contact = data.phone || data.email || "";
    const subject =
      "Upit: " +
      (data.service || "?") +
      " — " +
      (data.deadline || "?") +
      (contact ? " — " + contact : "");
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: FIELDS.map((f) => f + ": " + (data[f] || "-")).join("\n"),
      replyTo: data.email || NOTIFY_EMAIL,
    });

    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  }
}
```

## Korak 3 — objavi kao Web App

1. Gore desno: **Deploy → New deployment**.
2. Kraj **Select type** klikni zupčanik ⚙ i izaberi **Web app**.
3. Podesi:
   - **Execute as**: **Me**
   - **Who has access**: **Anyone** (mora ovako da bi sajt mogao da šalje)
4. **Deploy** → **Authorize access** → izaberi nalog → **Advanced → Go to … →
   Allow**.
5. Kopiraj **Web app URL**: `https://script.google.com/macros/s/AKfy.../exec`

## Korak 4 — javi mi URL

Pošalji mi taj `/exec` URL i ubaciću ga u sajt
(`NEXT_PUBLIC_SHEET_ENDPOINT`). Nakon toga svaki upit pada u tabelu i stiže ti
na mejl.

> Napomena: ako kasnije mijenjaš kod, ponovo objavi preko
> **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**
> (URL ostaje isti), inače se vrti stara verzija.
