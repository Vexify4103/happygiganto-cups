"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Language = "de" | "en";
type Theme = "light" | "dark";
type Kind = "terms" | "privacy";

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
};

type Document = {
  label: string;
  title: string;
  intro: string;
  notice: string;
  updated: string;
  sections: Section[];
};

const documents: Record<Kind, Record<Language, Document>> = {
  terms: {
    de: {
      label: "TEILNAHMEBEDINGUNGEN",
      title: "KLARE REGELN. GUTE GAMES.",
      intro: "Diese Bedingungen regeln die Teilnahme an den HappyGiganto Community Cups 2026 für League of Legends und Valorant.",
      notice: "Vor Veröffentlichung ergänzen: vollständiger Name, ladungsfähige Anschrift und Kontakt-E-Mail der Veranstalterin. Dieser Entwurf ersetzt keine individuelle Rechtsberatung.",
      updated: "Stand: 25. Juli 2026",
      sections: [
        {
          title: "1. Veranstalterin und Geltungsbereich",
          paragraphs: [
            "Veranstalterin: [VOLLSTÄNDIGER NAME / FIRMENNAME], [LADUNGSFÄHIGE ANSCHRIFT], E-Mail: [KONTAKT-E-MAIL].",
            "Die Bedingungen gelten für den League of Legends Community Cup am 12. September 2026 und den Valorant Community Cup am 26. September 2026, jeweils mit geplantem Start um 11:00 Uhr. Abweichende oder ergänzende Spielregeln, die vor Turnierbeginn veröffentlicht werden, sind Bestandteil dieser Bedingungen.",
          ],
        },
        {
          title: "2. Teilnahme und Anmeldung",
          bullets: [
            "Die Anmeldung erfolgt als Einzelspieler:in über das Onlineformular und setzt eine verifizierte Discord-Identität voraus.",
            "Teilnehmende benötigen einen gültigen Riot-Account und müssen auf den für das Turnier genannten EU-Servern spielen können.",
            "Minderjährige benötigen die Zustimmung ihrer gesetzlichen Vertretung, soweit dies rechtlich erforderlich ist.",
            "Die Anmeldung begründet keinen Anspruch auf Teilnahme. Kapazität, passende Rollenverteilung und organisatorische Gründe können die Auswahl begrenzen.",
            "Mehrfachanmeldungen, falsche Angaben sowie die Anmeldung unter fremder Identität können zum Ausschluss führen.",
          ],
        },
        {
          title: "3. Team-Zuteilung",
          paragraphs: [
            "Die Turnierleitung stellt Teams anhand der verfügbaren Anmeldungen zusammen. Dabei können insbesondere Spiel, Main Role, Secondary Role, aktueller und bisher höchster Rang sowie Sprache berücksichtigt werden. Ein Anspruch auf eine bestimmte Rolle, Teamzusammensetzung oder Mitspieler:innen besteht nicht.",
            "Die Team-Zuteilung wird über den angegebenen beziehungsweise verifizierten Kontaktkanal mitgeteilt. Kann ein vollständiges Team nicht gebildet werden, kann eine Anmeldung auf die Warteliste gesetzt oder das Teilnahmeangebot zurückgenommen werden.",
          ],
        },
        {
          title: "4. Ablauf und Spielregeln",
          bullets: [
            "Teilnehmende müssen zu den angekündigten Check-in- und Matchzeiten erreichbar und spielbereit sein.",
            "Gespielt wird mit den vorab veröffentlichten Einstellungen, Patches, Maps beziehungsweise Draft- und Matchformaten.",
            "Die Turnierleitung darf bei technischen Problemen Pausen, Wiederholungen, Wertungen oder Terminänderungen anordnen.",
            "Nachweise wie Screenshots oder Match-Historien können zur Klärung von Ergebnissen und Streitfällen verlangt werden.",
            "Entscheidungen der Turnierleitung dienen der zügigen Durchführung und sind innerhalb des Turniers grundsätzlich verbindlich.",
          ],
        },
        {
          title: "5. Fair Play und Verhalten",
          bullets: [
            "Cheats, unerlaubte Hilfsmittel, Exploits, Account-Sharing, absichtliches Verlieren und Ergebnisabsprachen sind untersagt.",
            "Beleidigungen, Belästigung, Diskriminierung, Hassrede, Doxxing und sonstiges erheblich störendes Verhalten werden nicht toleriert.",
            "Die Turnierleitung kann Verwarnungen, Spielverluste oder Ausschlüsse aussprechen. Bei schweren Verstößen ist ein sofortiger Ausschluss möglich.",
            "Sperren oder Sanktionen durch Riot Games können unabhängig davon zur Nichtteilnahme oder zum Ausschluss führen.",
          ],
        },
        {
          title: "6. Stream und öffentliche Darstellung",
          paragraphs: [
            "Turniermatches können live auf den Kanälen von HappyGiganto übertragen und anschließend als Video oder Clip verfügbar bleiben. Dabei können insbesondere Riot ID, Spielername, Team-Zugehörigkeit, Matchverlauf und Ingame-Kommunikation sichtbar oder hörbar werden.",
            "Eine Nutzung von Kameraaufnahmen, privaten Sprachaufnahmen oder Bildnissen außerhalb der für das Turnier erforderlichen Darstellung erfolgt nur auf einer gesonderten rechtlichen Grundlage oder mit einer erforderlichen Einwilligung.",
          ],
        },
        {
          title: "7. Preise, Änderungen und Absage",
          paragraphs: [
            "Art, Umfang und Bedingungen möglicher Preise werden gesondert bekanntgegeben. Ein Anspruch besteht nur, wenn ein Preis ausdrücklich zugesagt wurde und die Teilnahmebedingungen eingehalten sind.",
            "Die Veranstalterin darf Ablauf, Zeiten und Format aus sachlichem Grund ändern oder das Turnier absagen, insbesondere bei zu wenigen Anmeldungen, technischen Ausfällen, Sicherheitsproblemen oder höherer Gewalt. Teilnehmende werden möglichst früh informiert.",
          ],
        },
        {
          title: "8. Haftung",
          paragraphs: [
            "Die Veranstalterin haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit und in Fällen zwingender gesetzlicher Haftung.",
            "Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den typischerweise vorhersehbaren Schaden begrenzt. Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen, soweit gesetzlich zulässig.",
            "Für eigene Internetverbindung, Hardware, Software, Riot-Account und lokale technische Voraussetzungen sind die Teilnehmenden verantwortlich.",
          ],
        },
        {
          title: "9. Datenschutz und Schlussbestimmungen",
          paragraphs: [
            "Informationen zur Verarbeitung personenbezogener Daten enthält die Datenschutzerklärung. Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts, soweit zwingende Verbraucherschutzvorschriften nicht entgegenstehen.",
            "Sollte eine Bestimmung unwirksam sein, bleiben die übrigen Bestimmungen unberührt. Gesetzliche Regelungen treten an die Stelle einer unwirksamen Bestimmung.",
          ],
          links: [{ label: "Datenschutzerklärung öffnen", href: "/privacy/" }],
        },
      ],
    },
    en: {
      label: "TERMS OF PARTICIPATION",
      title: "CLEAR RULES. GOOD GAMES.",
      intro: "These terms govern participation in the HappyGiganto Community Cups 2026 for League of Legends and Valorant.",
      notice: "Complete before publication: organizer’s full legal name, service address and contact email. This draft is not a substitute for individual legal advice.",
      updated: "Last updated: July 25, 2026",
      sections: [
        {
          title: "1. Organizer and scope",
          paragraphs: [
            "Organizer: [FULL LEGAL NAME / COMPANY], [SERVICE ADDRESS], email: [CONTACT EMAIL].",
            "These terms apply to the League of Legends Community Cup on September 12, 2026 and the Valorant Community Cup on September 26, 2026, both scheduled to start at 11:00 CEST. Additional game rules published before the tournament form part of these terms.",
          ],
        },
        {
          title: "2. Eligibility and registration",
          bullets: [
            "Registration is for individual players through the online form and requires a verified Discord identity.",
            "Players need a valid Riot account and must be able to play on the designated EU servers.",
            "Minors require permission from their legal guardian where legally required.",
            "Registration does not guarantee participation. Capacity, role distribution and organizational requirements may limit selection.",
            "Duplicate registrations, false information or registration under another person’s identity may result in exclusion.",
          ],
        },
        {
          title: "3. Team assignment",
          paragraphs: [
            "Tournament admins assemble teams from available applicants. Game, main role, secondary role, current and peak rank, and language may be considered. Players have no right to a particular role, line-up or teammate.",
            "Assignments are communicated through the provided or verified contact channel. If a complete team cannot be formed, an applicant may be waitlisted or the participation offer may be withdrawn.",
          ],
        },
        {
          title: "4. Tournament operation",
          bullets: [
            "Players must be reachable and ready at the announced check-in and match times.",
            "Matches use the settings, patches, maps, draft and match formats published before the event.",
            "Admins may order pauses, rematches, rulings or schedule changes when technical issues occur.",
            "Evidence such as screenshots or match histories may be requested to resolve results and disputes.",
            "Admin decisions are generally final within the tournament to allow timely operation.",
          ],
        },
        {
          title: "5. Fair play and conduct",
          bullets: [
            "Cheats, unauthorized tools, exploits, account sharing, intentional losses and match fixing are prohibited.",
            "Insults, harassment, discrimination, hate speech, doxxing and materially disruptive conduct are not tolerated.",
            "Admins may issue warnings, match losses or exclusions. Serious violations may result in immediate exclusion.",
            "Riot Games bans or sanctions may independently prevent participation.",
          ],
        },
        {
          title: "6. Stream and public coverage",
          paragraphs: [
            "Tournament matches may be streamed live on HappyGiganto’s channels and may remain available as videos or clips. Riot IDs, player names, team assignments, gameplay and in-game communications may be visible or audible.",
            "Camera footage, private voice recordings or personal likenesses beyond what is necessary for the event will only be used with a separate legal basis or any required consent.",
          ],
        },
        {
          title: "7. Prizes, changes and cancellation",
          paragraphs: [
            "Any prizes and applicable conditions will be announced separately. A claim exists only where a prize has been expressly promised and these terms have been followed.",
            "The organizer may change schedules and formats or cancel the event for objective reasons, including insufficient registrations, technical failures, security issues or force majeure. Players will be informed as early as reasonably possible.",
          ],
        },
        {
          title: "8. Liability",
          paragraphs: [
            "The organizer remains fully liable for intent and gross negligence, injury to life, body or health and all cases of mandatory statutory liability.",
            "For slight negligence affecting essential contractual duties, liability is limited to typically foreseeable losses. Other liability for slight negligence is excluded where legally permissible.",
            "Players are responsible for their internet connection, hardware, software, Riot account and local technical setup.",
          ],
        },
        {
          title: "9. Privacy and final provisions",
          paragraphs: [
            "Details about personal-data processing are provided in the Privacy Policy. German law applies, subject to any mandatory consumer-protection rules.",
            "If a provision is invalid, the remaining provisions remain effective and the applicable statutory rule takes its place.",
          ],
          links: [{ label: "Open Privacy Policy", href: "/privacy/" }],
        },
      ],
    },
  },
  privacy: {
    de: {
      label: "DATENSCHUTZERKLÄRUNG",
      title: "DEINE DATEN. TRANSPARENT ERKLÄRT.",
      intro: "Hier erklären wir, welche personenbezogenen Daten beim Besuch, bei Discord-Anmeldung und Turnierbewerbung verarbeitet werden.",
      notice: "Vor Veröffentlichung ergänzen: verantwortliche Person, Anschrift, Datenschutz-E-Mail, konkrete Löschfrist und gegebenenfalls zuständige Aufsichtsbehörde. Dieser Entwurf ersetzt keine individuelle Rechtsberatung.",
      updated: "Stand: 25. Juli 2026",
      sections: [
        {
          title: "1. Verantwortliche Stelle",
          paragraphs: [
            "Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO): [VOLLSTÄNDIGER NAME / FIRMENNAME], [LADUNGSFÄHIGE ANSCHRIFT], E-Mail: [DATENSCHUTZ-KONTAKT].",
            "Ein:e Datenschutzbeauftragte:r ist [NICHT BESTELLT / KONTAKTDATEN ERGÄNZEN, FALLS ERFORDERLICH].",
          ],
        },
        {
          title: "2. Hosting und technische Zugriffsdaten",
          paragraphs: [
            "Die Website wird über Netlify bereitgestellt. Beim Aufruf können technisch erforderliche Daten wie IP-Adresse, Zeitpunkt, angeforderte Datei, Referrer, Browser- und Geräteinformationen in Server- und Sicherheitsprotokollen verarbeitet werden.",
            "Die Verarbeitung dient der sicheren und stabilen Bereitstellung der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt in Betrieb, Fehleranalyse und Schutz vor Missbrauch.",
          ],
          links: [{ label: "Datenschutzhinweise von Netlify", href: "https://www.netlify.com/privacy/" }],
        },
        {
          title: "3. Lokale Einstellungen",
          paragraphs: [
            "Sprache und Hell-/Dunkelmodus werden im Local Storage des Browsers gespeichert. Diese Informationen bleiben auf dem Gerät und ermöglichen die gewünschte Darstellung. Sie können durch Löschen der Website-Daten im Browser entfernt werden.",
            "Das Admin-Team-Board ruft Bewerbungsdaten aus einer MongoDB-Datenbank ab. Der Server liefert diese Daten nur nach Discord-Anmeldung und erfolgreicher Prüfung gegen eine feste Admin-ID-Liste aus. Team-Zuteilungen werden in derselben Datenbank gespeichert.",
          ],
        },
        {
          title: "4. Discord OAuth",
          paragraphs: [
            "Für die Bewerbung ist eine Anmeldung über Discord erforderlich. Dabei werden Discord-ID, Username, Display-Name und gegebenenfalls Avatar-Kennung verarbeitet. Ein OAuth-Zugriffstoken wird nur kurzfristig serverseitig genutzt, um die Identität bei Discord abzurufen, und nicht dauerhaft in der Website gespeichert.",
            "Eine signierte, technisch erforderliche HTTP-only Session wird für bis zu sieben Tage als Cookie gespeichert. Ein zusätzlicher kurzlebiger Cookie schützt den OAuth-Vorgang gegen Manipulation. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO zur Durchführung der Bewerbung sowie Art. 6 Abs. 1 lit. f DSGVO für die sichere Identitätsprüfung.",
            "Wenn ein Discord-Avatar angezeigt wird, wird dieser vom Discord-CDN geladen; dabei erhält Discord technisch bedingt die IP-Adresse des Browsers.",
          ],
          links: [{ label: "Datenschutzhinweise von Discord", href: "https://discord.com/privacy" }],
        },
        {
          title: "5. Turnierbewerbung",
          paragraphs: [
            "Bei der Bewerbung verarbeiten wir Turnierauswahl, Spielername, Riot ID, optionale E-Mail-Adresse, Main Role und Secondary Role beziehungsweise bevorzugte Rolle, aktuellen und bisher höchsten Rang, OP.GG-Profillink, Sprache, freiwillige Notizen sowie die verifizierten Discord-Daten.",
            "Die Daten werden zur Prüfung der Bewerbung, Bildung ausgeglichener Teams, Kontaktaufnahme, Organisation, Durchführung, Streitklärung und Missbrauchsprävention verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; Sicherheits- und Missbrauchsmaßnahmen beruhen ergänzend auf Art. 6 Abs. 1 lit. f DSGVO.",
            "Pflichtangaben sind erforderlich, um eine Bewerbung zu bearbeiten. Ohne diese Angaben ist eine Teilnahme nicht möglich. Die optionale E-Mail-Adresse und freiwillige Notizen sind nicht erforderlich.",
          ],
        },
        {
          title: "6. Empfänger und Drittlandtransfers",
          paragraphs: [
            "Zugriff erhalten nur Personen, die mit Organisation und Administration des Turniers betraut sind. Netlify verarbeitet Hosting- und Function-Daten als technischer Dienstleister. Bewerbungsdaten werden in einer MongoDB-Datenbank bei [MONGODB-HOSTER UND SPEICHERREGION ERGÄNZEN] gespeichert. Discord verarbeitet Daten im Rahmen des OAuth-Logins nach eigenen Bedingungen.",
            "Bei US-amerikanischen oder international tätigen Dienstleistern kann eine Verarbeitung außerhalb des Europäischen Wirtschaftsraums stattfinden. Die Anbieter informieren in ihren Datenschutzhinweisen über Angemessenheitsbeschlüsse, Standardvertragsklauseln oder andere eingesetzte Garantien.",
            "Die Social-Media-Links sind einfache externe Links. Eine Verbindung zu Twitch, YouTube, TikTok, Instagram oder Ko-fi wird über diese Links erst hergestellt, wenn sie angeklickt werden.",
          ],
        },
        {
          title: "7. Speicherdauer",
          paragraphs: [
            "Bewerbungs- und Organisationsdaten werden bis [KONKRETE FRIST, Z. B. 90 TAGE NACH DEM LETZTEN TURNIER] gespeichert und anschließend gelöscht, sofern keine gesetzlichen Pflichten oder die Abwehr beziehungsweise Durchsetzung von Ansprüchen eine längere Aufbewahrung erfordern.",
            "Nicht berücksichtigte Bewerbungen und Wartelistendaten werden bis [KONKRETE FRIST] gelöscht. Netlify-Protokolle sowie technische Daten und Sicherungskopien des MongoDB-Hosters unterliegen den jeweiligen betrieblichen Löschfristen der Dienstleister.",
          ],
        },
        {
          title: "8. Deine Rechte",
          bullets: [
            "Auskunft über verarbeitete personenbezogene Daten (Art. 15 DSGVO)",
            "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
            "Löschung oder Einschränkung der Verarbeitung, soweit die Voraussetzungen vorliegen (Art. 17 und 18 DSGVO)",
            "Datenübertragbarkeit bei Vorliegen der Voraussetzungen (Art. 20 DSGVO)",
            "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)",
            "Beschwerde bei einer zuständigen Datenschutzaufsichtsbehörde (Art. 77 DSGVO)",
          ],
          paragraphs: ["Zur Ausübung der Rechte genügt eine Nachricht an [DATENSCHUTZ-KONTAKT]."],
        },
        {
          title: "9. Automatisierte Entscheidungen und Sicherheit",
          paragraphs: [
            "Es findet keine ausschließlich automatisierte Entscheidung mit rechtlicher oder ähnlich erheblicher Wirkung statt. Teamvorschläge und Zuteilungen werden von der Turnierleitung vorgenommen.",
            "Wir setzen angemessene technische und organisatorische Maßnahmen ein. Dennoch kann keine Internetübertragung vollständig risikofrei garantiert werden.",
          ],
        },
        {
          title: "10. Änderungen",
          paragraphs: [
            "Diese Datenschutzerklärung kann angepasst werden, wenn sich Funktionen, Dienstleister oder rechtliche Anforderungen ändern. Die jeweils aktuelle Fassung wird auf dieser Seite veröffentlicht.",
          ],
        },
      ],
    },
    en: {
      label: "PRIVACY POLICY",
      title: "YOUR DATA. CLEARLY EXPLAINED.",
      intro: "This policy explains which personal data is processed when visiting the site, signing in with Discord and applying for a tournament.",
      notice: "Complete before publication: controller’s identity and address, privacy contact, exact retention periods and, where applicable, the competent authority. This draft is not a substitute for individual legal advice.",
      updated: "Last updated: July 25, 2026",
      sections: [
        {
          title: "1. Controller",
          paragraphs: [
            "Controller under the General Data Protection Regulation (GDPR): [FULL LEGAL NAME / COMPANY], [SERVICE ADDRESS], email: [PRIVACY CONTACT].",
            "Data protection officer: [NOT APPOINTED / ADD DETAILS IF REQUIRED].",
          ],
        },
        {
          title: "2. Hosting and access data",
          paragraphs: [
            "The website is provided through Netlify. Technical data such as IP address, access time, requested file, referrer, browser and device information may be processed in server and security logs.",
            "This processing provides a secure and stable website. Its legal basis is Article 6(1)(f) GDPR; the legitimate interest is operation, troubleshooting and abuse prevention.",
          ],
          links: [{ label: "Netlify Privacy Statement", href: "https://www.netlify.com/privacy/" }],
        },
        {
          title: "3. Local preferences",
          paragraphs: [
            "Language and light/dark mode are stored in the browser’s local storage. They remain on the device and can be removed by clearing website data.",
            "The admin team board retrieves applications from a MongoDB database. The server only provides this data after Discord sign-in and a successful check against a fixed admin-ID allowlist. Team assignments are stored in the same database.",
          ],
        },
        {
          title: "4. Discord OAuth",
          paragraphs: [
            "A Discord sign-in is required to apply. We process the Discord ID, username, display name and, where available, avatar identifier. An OAuth access token is used briefly on the server to retrieve the identity from Discord and is not stored permanently by the website.",
            "A signed, essential HTTP-only session cookie is stored for up to seven days. A separate short-lived cookie protects the OAuth transaction. The legal bases are Article 6(1)(b) GDPR for the application process and Article 6(1)(f) GDPR for secure identity verification.",
            "Where a Discord avatar is displayed, it is loaded from Discord’s CDN, which necessarily receives the browser’s IP address.",
          ],
          links: [{ label: "Discord Privacy Policy", href: "https://discord.com/privacy" }],
        },
        {
          title: "5. Tournament applications",
          paragraphs: [
            "We process tournament selection, player name, Riot ID, optional email, main and secondary role or preferred role, current and peak rank, OP.GG profile link, language, voluntary notes and verified Discord details.",
            "The purposes are application review, balanced team formation, communication, organization, tournament operation, dispute resolution and abuse prevention. The legal basis is Article 6(1)(b) GDPR, supplemented by Article 6(1)(f) GDPR for security and abuse prevention.",
            "Required fields are necessary to process an application. Participation is not possible without them. Email and notes are optional.",
          ],
        },
        {
          title: "6. Recipients and international transfers",
          paragraphs: [
            "Access is limited to people responsible for tournament organization and administration. Netlify processes hosting and function data as a technical provider. Application data is stored in a MongoDB database hosted by [ADD MONGODB PROVIDER AND STORAGE REGION]. Discord processes data for OAuth according to its own terms.",
            "US-based or international providers may process data outside the European Economic Area. Their privacy notices explain applicable adequacy decisions, standard contractual clauses or other safeguards.",
            "Social links are ordinary external links. Connections to Twitch, YouTube, TikTok, Instagram or Ko-fi are only established when a link is selected.",
          ],
        },
        {
          title: "7. Retention",
          paragraphs: [
            "Application and organizational data is kept until [SPECIFIC PERIOD, E.G. 90 DAYS AFTER THE FINAL TOURNAMENT] and then deleted unless legal duties or the establishment, exercise or defense of claims requires longer retention.",
            "Unsuccessful applications and waitlist data are deleted after [SPECIFIC PERIOD]. Netlify logs, and technical data and backups maintained by the MongoDB provider, follow the respective providers’ operational retention periods.",
          ],
        },
        {
          title: "8. Your rights",
          bullets: [
            "Access to personal data (Article 15 GDPR)",
            "Rectification of inaccurate data (Article 16 GDPR)",
            "Erasure or restriction where the conditions apply (Articles 17 and 18 GDPR)",
            "Data portability where the conditions apply (Article 20 GDPR)",
            "Objection to processing based on legitimate interests (Article 21 GDPR)",
            "Complaint to a competent data-protection supervisory authority (Article 77 GDPR)",
          ],
          paragraphs: ["Contact [PRIVACY CONTACT] to exercise these rights."],
        },
        {
          title: "9. Automated decisions and security",
          paragraphs: [
            "No solely automated decision with legal or similarly significant effects takes place. Tournament admins make team assignments.",
            "We use appropriate technical and organizational measures, but no internet transmission can be guaranteed completely risk-free.",
          ],
        },
        {
          title: "10. Changes",
          paragraphs: ["This policy may be updated when features, providers or legal requirements change. The current version will be published on this page."],
        },
      ],
    },
  },
};

export function LegalDocument({ kind }: { kind: Kind }) {
  const [language, setLanguage] = useState<Language>("de");
  const [theme, setTheme] = useState<Theme>("dark");
  const document = documents[kind][language];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedLanguage = localStorage.getItem("hg-language");
      const savedTheme = localStorage.getItem("hg-theme");
      if (savedLanguage === "de" || savedLanguage === "en") setLanguage(savedLanguage);
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    documentElement().dataset.theme = theme;
    documentElement().lang = language;
    localStorage.setItem("hg-theme", theme);
    localStorage.setItem("hg-language", language);
  }, [theme, language]);

  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="brand" href="/">
          <Image className="brand-logo" src="/happygiganto-logo.png" alt="" width={42} height={42} priority />
          <span className="brand-type">HAPPY<span>GIGANTO</span></span>
        </Link>
        <div className="legal-tools">
          <button className="language-toggle" type="button" onClick={() => setLanguage(language === "de" ? "en" : "de")}>
            <span className={language === "de" ? "active" : ""}>DE</span><i /><span className={language === "en" ? "active" : ""}>EN</span>
          </button>
          <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle color theme">
            {theme === "dark" ? "☼" : "◐"}
          </button>
          <Link className="legal-back" href="/">← {language === "de" ? "Zurück" : "Back"}</Link>
        </div>
      </header>

      <div className="legal-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container">
          <p className="section-kicker">{document.label}</p>
          <h1>{document.title}</h1>
          <p>{document.intro}</p>
          <span>{document.updated}</span>
        </div>
      </div>

      <div className="container legal-layout">
        <aside>
          <strong>{language === "de" ? "Inhalt" : "Contents"}</strong>
          {document.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.title}>{section.title}</a>)}
          <div className="legal-switches">
            <Link className={kind === "terms" ? "active" : ""} href="/terms/">{language === "de" ? "Teilnahmebedingungen" : "Terms"}</Link>
            <Link className={kind === "privacy" ? "active" : ""} href="/privacy/">{language === "de" ? "Datenschutz" : "Privacy"}</Link>
          </div>
        </aside>

        <article className="legal-content">
          <div className="legal-notice"><strong>{language === "de" ? "Vor dem Launch" : "Before launch"}</strong><p>{document.notice}</p></div>
          {document.sections.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              {section.links?.map((link) => (
                link.href.startsWith("http")
                  ? <a className="legal-source" href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} ↗</a>
                  : <Link className="legal-source" href={link.href} key={link.href}>{link.label} →</Link>
              ))}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

function documentElement() {
  return window.document.documentElement;
}
