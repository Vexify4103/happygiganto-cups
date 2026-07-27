"use client";

import Image from "next/image";
import { useState } from "react";

type Language = "en" | "de";

const copy = {
  en: {
    eyebrow: "NEW HOME · SAME COMMUNITY",
    title: "WE MOVED.",
    accent: "NEW HOME.",
    body: "HappyGiganto now has a new home for streams, community tournaments, clips and everything still to come.",
    button: "Visit the new website",
    applicationTitle: "Already applied to a tournament?",
    applicationBody:
      "Please do not apply again yet. Existing registrations will be transferred, and we will only ask you to complete information or verification that the new platform needs.",
    language: "Auf Deutsch wechseln",
    footer: "This former tournament page is now read-only.",
  },
  de: {
    eyebrow: "NEUES ZUHAUSE · GLEICHE COMMUNITY",
    title: "WIR SIND",
    accent: "UMGEZOGEN.",
    body: "HappyGiganto hat jetzt ein neues Zuhause für Streams, Community-Turniere, Clips und alles, was noch kommt.",
    button: "Zur neuen Website",
    applicationTitle: "Schon für ein Turnier angemeldet?",
    applicationBody:
      "Bitte melde dich vorerst nicht erneut an. Bestehende Anmeldungen werden übertragen und wir fragen nur Informationen oder Verifizierungen nach, die auf der neuen Plattform noch fehlen.",
    language: "Switch to English",
    footer: "Diese ehemalige Turnierseite ist jetzt schreibgeschützt.",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const text = copy[language];

  return (
    <main className="moved-page">
      <div className="moved-grid" aria-hidden="true" />
      <div className="moved-glow moved-glow-one" aria-hidden="true" />
      <div className="moved-glow moved-glow-two" aria-hidden="true" />

      <header className="moved-header">
        <a
          className="moved-brand"
          href="https://happygiganto.de"
          aria-label="HappyGiganto"
        >
          <Image
            src="/happygiganto-logo.png"
            alt=""
            width={52}
            height={52}
            priority
          />
          <span>
            HAPPY<strong>GIGANTO</strong>
          </span>
        </a>
        <button
          className="moved-language"
          type="button"
          onClick={() => setLanguage(language === "en" ? "de" : "en")}
          aria-label={text.language}
        >
          <span className={language === "en" ? "active" : ""}>EN</span>
          <i />
          <span className={language === "de" ? "active" : ""}>DE</span>
        </button>
      </header>

      <section className="moved-content">
        <div className="moved-copy">
          <p className="moved-eyebrow">
            <span /> {text.eyebrow}
          </p>
          <h1>
            {text.title}
            <strong>{text.accent}</strong>
          </h1>
          <p className="moved-intro">{text.body}</p>
          <a className="moved-button" href="https://happygiganto.de">
            {text.button} <span>↗</span>
          </a>
          <a className="moved-url" href="https://happygiganto.de">
            happygiganto.de
          </a>
        </div>

        <aside className="moved-application-note">
          <span>APPLICATIONS · ANMELDUNGEN</span>
          <h2>{text.applicationTitle}</h2>
          <p>{text.applicationBody}</p>
        </aside>
      </section>

      <footer className="moved-footer">
        <span>© 2026 HappyGiganto</span>
        <span>{text.footer}</span>
      </footer>
    </main>
  );
}
