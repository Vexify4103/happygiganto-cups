# HappyGiganto Community Cups 2026

Zweisprachige Turnierseite für:

- League of Legends — 12.09.2026, 11:00 Uhr
- Valorant — 26.09.2026, 11:00 Uhr

Die Seite enthält Deutsch/Englisch, Light/Dark Mode, Regeln, Ablauf, Team-Slots,
Bracket-Platzhalter, alle Social-Links und eine Solo-Anmeldung mit verifizierter
Discord-Identität über Netlify Functions. Bewerbungen und Team-Zuteilungen
werden in MongoDB gespeichert.

## Lokal starten

Für die komplette Seite inklusive Discord, MongoDB und Admin-API:

```bash
pnpm install
npm install -g netlify-cli
netlify dev
```

Danach `http://localhost:8889` öffnen. Netlify Dev startet Next.js intern auf
Port 3001 und stellt die komplette Website samt Functions auf Port 8889 bereit.

## Auf Netlify veröffentlichen

1. Projekt in ein GitHub-Repository pushen.
2. In Netlify „Add new site“ → „Import an existing project“ wählen.
3. Repository auswählen und deployen.

Die nötigen Build-Einstellungen stehen bereits in `netlify.toml`:

- Build command: `pnpm build`
- Publish directory: `out`
- Node.js: 22

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
   - `MONGODB_URI` – vollständiger MongoDB Connection String
   - `MONGODB_DB_NAME` – Datenbankname, standardmäßig `happygiganto_cups`
   - `ADMIN_DISCORD_IDS` – kommaseparierte Admin-IDs
4. Neu deployen.

Der Client Secret und Discord Access Token werden niemals an den Browser
ausgeliefert. Die Function speichert nur eine signierte HTTP-only Session.
Mit der Bewerbung landen die verifizierte Discord-ID, der Username und der
Display-Name zusammen mit den Turnierangaben in MongoDB.

Zum lokalen Testen des vollständigen OAuth-Flows muss statt `pnpm dev` die
Netlify-Entwicklungsumgebung verwendet werden:

```bash
netlify dev
```

Die lokale Callback-URL muss zusätzlich im Discord Developer Portal eingetragen
werden:

```text
http://localhost:8889/api/auth/discord/callback
```

## MongoDB einrichten

Für die Website einen eigenen MongoDB-Datenbankbenutzer mit Zugriff nur auf die
Turnierdatenbank anlegen. Den Connection String ausschließlich als
`MONGODB_URI` in Netlify speichern und niemals in Git committen.

Wenn MongoDB Atlas verwendet wird, muss die Netzwerkfreigabe Verbindungen der
Netlify Functions zulassen. Kostenlose Netlify-Functions haben keine feste
ausgehende IP-Adresse. Eine breite Netzwerkfreigabe sollte deshalb nur zusammen
mit TLS, einem langen zufälligen Datenbankpasswort und minimalen
Datenbankberechtigungen verwendet werden.

## Spieler:innen Teams zuweisen

1. `/admin/` öffnen.
2. Mit einem freigeschalteten Discord-Konto anmelden.
3. Spieler:innen über das Auswahlfeld Team 1–8 oder der Waitlist zuweisen.
4. Mit „Team-CSV exportieren“ bei Bedarf die fertige Einteilung herunterladen.

Die API prüft die signierte Discord-Session und die Discord-ID serverseitig.
Nicht autorisierte Konten erhalten weder Bewerbungs- noch Kontaktdaten. Die
Team-Zuteilungen werden direkt in MongoDB gespeichert und stehen beiden Admins
zur Verfügung.

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
