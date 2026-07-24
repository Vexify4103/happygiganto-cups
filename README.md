# HappyGiganto Community Cups 2026

Zweisprachige Turnierseite für:

- League of Legends — 22.08.2026
- Valorant — 01.09.2026

Die Seite enthält Deutsch/Englisch, Light/Dark Mode, Regeln, Ablauf, Team-Slots,
Bracket-Platzhalter, alle Social-Links und eine Solo-Anmeldung mit verifizierter
Discord-Identität über Netlify Functions und Netlify Forms.

## Lokal starten

```bash
pnpm install
pnpm dev
```

Danach `http://localhost:3000` öffnen.

## Auf Netlify veröffentlichen

1. Projekt in ein GitHub-Repository pushen.
2. In Netlify „Add new site“ → „Import an existing project“ wählen.
3. Repository auswählen und deployen.

Die nötigen Build-Einstellungen stehen bereits in `netlify.toml`:

- Build command: `pnpm build`
- Publish directory: `out`
- Node.js: 22

Nach dem ersten Deployment erkennt Netlify das Formular
`solo-registration`. Einsendungen erscheinen im Netlify-Dashboard unter
„Forms“. Dort können auch E-Mail-Benachrichtigungen eingerichtet werden.

## Discord-Login einrichten

1. Im [Discord Developer Portal](https://discord.com/developers/applications)
   eine neue Application erstellen.
2. Unter OAuth2 diese Redirect-URL hinzufügen:

   ```text
   https://DEINE-DOMAIN/api/auth/discord/callback
   ```

   Für eine Netlify-Subdomain ist das beispielsweise
   `https://dein-projekt.netlify.app/api/auth/discord/callback`.
3. In Netlify unter „Project configuration“ → „Environment variables“ folgende
   Werte für Functions anlegen:

   - `DISCORD_CLIENT_ID` – Application ID aus Discord
   - `DISCORD_CLIENT_SECRET` – Secret aus Discord OAuth2
   - `SESSION_SECRET` – ein zufälliges, mindestens 32 Zeichen langes Secret
4. Neu deployen.

Der Client Secret und Discord Access Token werden niemals an den Browser
ausgeliefert. Die Function speichert nur eine signierte HTTP-only Session.
Mit der Bewerbung landen die verifizierte Discord-ID, der Username und der
Display-Name in Netlify Forms.

Zum lokalen Testen des vollständigen OAuth-Flows muss statt `pnpm dev` die
Netlify-Entwicklungsumgebung verwendet werden:

```bash
pnpm dlx netlify-cli dev
```

Die lokale Callback-URL muss zusätzlich im Discord Developer Portal eingetragen
werden, beispielsweise `http://localhost:8888/api/auth/discord/callback`.

## Spieler:innen Teams zuweisen

1. In Netlify unter „Forms“ → `solo-registration` die Einsendungen als CSV exportieren.
2. Die nicht öffentlich verlinkte Seite `/admin/` öffnen.
3. „Netlify CSV importieren“ auswählen.
4. Spieler:innen über das Auswahlfeld Team 1–8 oder der Waitlist zuweisen.
5. Mit „Team-CSV exportieren“ die fertige Einteilung herunterladen.

Die importierten Kontaktdaten und Team-Zuteilungen bleiben ausschließlich im
lokalen Browser-Speicher dieses Geräts. Die Admin-Seite lädt keine persönlichen
Daten vom Server und enthält ohne manuellen CSV-Import keine Bewerbungen.

## Vor dem öffentlichen Launch ergänzen

- genaue Start- und Check-in-Zeiten
- Anmeldeschluss und maximale Teamanzahl
- Preise, Patch, Matchformat und Map-Pool
- finale Turnierregeln
- bestätigte Teams
- Bracket-Link (z. B. Challonge, Toornament oder start.gg)
- weitere Social-Links
- Veranstaltername, ladungsfähige Anschrift und Kontakt-E-Mail in
  `app/legal/LegalDocument.tsx`
- konkrete Löschfristen in der Datenschutzerklärung
- Teilnahmebedingungen und Datenschutzerklärung juristisch prüfen lassen

Die zweisprachigen Rechtstexte liegen unter `/terms/` und `/privacy/`. Sie
enthalten bewusst sichtbare Platzhalter, solange die Pflichtangaben der
Veranstalterin noch nicht vorliegen.

Die sichtbaren Inhalte und Übersetzungen liegen in `app/page.tsx`. Das Design
liegt in `app/globals.css`.

## Prüfen

```bash
pnpm lint
pnpm build
```
