"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThanksPage() {
  const [english, setEnglish] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setEnglish(localStorage.getItem("hg-language") === "en");
      document.documentElement.dataset.theme = localStorage.getItem("hg-theme") || "dark";
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="thanks-page">
      <div className="thanks-grid" aria-hidden="true" />
      <section className="thanks-card">
        <span className="thanks-mark"><b>✓</b></span>
        <p className="section-kicker">REGISTRATION COMPLETE</p>
        <h1>{english ? "YOU’RE IN THE QUEUE." : "IHR SEID IN DER QUEUE."}</h1>
        <p>
          {english
            ? "Thanks for registering. We’ll review all solo applicants, build balanced teams and send your line-up through your chosen contact channel."
            : "Danke für deine Anmeldung. Wir prüfen alle Solo-Anmeldungen, stellen ausgeglichene Teams zusammen und schicken dir dein Line-up über den angegebenen Kontaktkanal."}
        </p>
        <Link className="button button-primary" href="/">
          {english ? "Back to the tournament page" : "Zurück zur Turnierseite"} <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
