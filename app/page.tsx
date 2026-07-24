"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Language = "de" | "en";
type Theme = "light" | "dark";
type Game = "league" | "valorant";
type DiscordUser = {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
};

const copy = {
  de: {
    nav: { events: "Turniere", schedule: "Ablauf", rules: "Regeln", teams: "Teams", apply: "Anmelden" },
    eyebrow: "HAPPYGIGANTO PRESENTS",
    headlineA: "ZWEI GAMES.",
    headlineB: "EINE COMMUNITY.",
    intro: "Zwei Community-Turniere, ein Stream und jede Menge Plays. Melde dich solo an – wir bauen aus allen Anmeldungen faire Teams.",
    viewChannel: "Zum Twitch-Kanal",
    applyNow: "Solo anmelden",
    dates: "22. AUG — 01. SEP 2026",
    chooseEvent: "WÄHLE DEIN TURNIER",
    eventIntro: "Alle wichtigen Infos auf einen Blick. Die finalen Startzeiten, Preise und Check-in-Zeiten werden noch bekanntgegeben.",
    date: "Datum", format: "Format", platform: "Plattform", registration: "Anmeldung",
    open: "Offen", formatValue: "5 vs. 5", platformValue: "PC · EU",
    leagueTag: "Summoner’s Rift", valorantTag: "Competitive",
    leagueBlurb: "Versammelt eure fünf stärksten Champions und zeigt der Community, wer den Rift kontrolliert.",
    valorantBlurb: "Scharfe Calls, saubere Executes und fünf Spieler:innen, die auch unter Druck zusammenhalten.",
    timelineTitle: "SO LÄUFT ES AB",
    timelineIntro: "Von der Anmeldung bis zum großen Finale – wir halten es unkompliziert und transparent.",
    timeline: [
      ["01", "Solo anmelden", "Du schickst deine Rolle, deinen Rang und deine Riot ID ab."],
      ["02", "Team-Zuteilung", "Wir stellen möglichst ausgeglichene Teams zusammen und informieren dich."],
      ["03", "Check-in", "Dein vollständiges Team ist am Turniertag rechtzeitig online."],
      ["04", "Let’s play", "Bracket verfolgen, Matches spielen und den Stream einschalten."],
    ],
    rulesTitle: "FAIR PLAY. KLARE REGELN.",
    rulesIntro: "Die Kurzfassung für beide Turniere. Das vollständige Regelwerk wird vor dem Check-in veröffentlicht.",
    commonRules: "Für beide Turniere",
    commonRulesList: [
      "Respektvoller Umgang – kein Hate, keine Diskriminierung, kein toxisches Verhalten.",
      "Alle Spieler:innen müssen auf EU-Servern spielen können.",
      "Cheats, Exploits, Smurfing und Account-Sharing führen zum Ausschluss.",
      "Zugewiesene Teams müssen zum Check-in vollständig und pünktlich erscheinen.",
      "Entscheidungen der Turnierleitung sind im Streitfall verbindlich.",
    ],
    gameRules: "Game-spezifisch",
    leagueRules: ["Standard 5v5 auf Summoner’s Rift", "Turniermodus und Draft", "Teams werden von der Turnierleitung zusammengestellt", "Patch und Matchformat werden noch bestätigt"],
    valorantRules: ["Standard 5v5 Custom Game", "Tournament Mode aktiviert", "Teams werden von der Turnierleitung zusammengestellt", "Map-Pool und Matchformat werden noch bestätigt"],
    teamsTitle: "DAS LINE-UP",
    teamsIntro: "Wir stellen aus allen Solo-Anmeldungen ausgeglichene Teams zusammen. Bestätigte Line-ups erscheinen hier.",
    openSlot: "Offener Slot",
    bracketTitle: "BRACKET",
    bracketIntro: "Der Turnierbaum wird nach Anmeldeschluss veröffentlicht und während des Events live aktualisiert.",
    bracketPending: "Bracket folgt",
    bracketHint: "Link zu Challonge, Toornament oder start.gg kann hier eingesetzt werden.",
    formEyebrow: "BEREIT FÜR DEN QUEUE?",
    formTitle: "MELDE DICH SOLO AN.",
    formIntro: "Du brauchst noch kein Team. Verrate uns, was du spielst – wir übernehmen das Matchmaking.",
    tournament: "Turnier", playerName: "Spielername", riotId: "Riot ID",
    contact: "Kontakt-E-Mail (optional)", role: "Bevorzugte Rolle", rank: "Aktueller Rang",
    languageLabel: "Bevorzugte Sprache", flex: "Ich kann bei Bedarf auch eine andere Rolle spielen.",
    note: "Noch etwas, das wir wissen sollten?",
    consent: "Ich habe die Teilnahmebedingungen und Datenschutzerklärung gelesen und akzeptiere die Teilnahmebedingungen.",
    submit: "Anmeldung abschicken", submitting: "Wird gesendet …",
    formNote: "Deine verifizierte Discord-ID wird sicher mit der Anmeldung gespeichert.",
    discordRequired: "DISCORD-VERIFIZIERUNG",
    discordExplain: "Melde dich mit Discord an, damit wir deine Identität bestätigen und dir später dein Team schicken können.",
    loginDiscord: "Mit Discord anmelden",
    checkingDiscord: "Discord-Session wird geprüft …",
    verifiedAs: "Verifiziert als",
    logoutDiscord: "Abmelden",
    discordUnavailable: "Discord-Login funktioniert in der veröffentlichten Netlify-Version.",
    authError: "Discord-Anmeldung fehlgeschlagen. Bitte versuche es erneut.",
    submitError: "Die Anmeldung konnte nicht gespeichert werden. Bitte versuche es erneut.",
    playerPlaceholder: "Dein Ingame- oder Community-Name", riotPlaceholder: "RiotName#TAG",
    contactPlaceholder: "mail@beispiel.de",
    rankPlaceholder: "z. B. Gold 2",
    notePlaceholder: "Fragen, Verfügbarkeiten, Wünsche …",
    footerLine: "Community-Turniere von HappyGiganto.",
    madeFor: "Gemacht für gute Games und noch bessere Vibes.",
    terms: "Teilnahmebedingungen", privacy: "Datenschutz",
    themeLight: "Helles Design aktivieren", themeDark: "Dunkles Design aktivieren",
    language: "Switch to English", menu: "Menü öffnen", closeMenu: "Menü schließen",
  },
  en: {
    nav: { events: "Tournaments", schedule: "How it works", rules: "Rules", teams: "Teams", apply: "Register" },
    eyebrow: "HAPPYGIGANTO PRESENTS",
    headlineA: "TWO GAMES.",
    headlineB: "ONE COMMUNITY.",
    intro: "Two community tournaments, one stream and plenty of plays. Register solo – we’ll build balanced teams from all applicants.",
    viewChannel: "Visit Twitch channel",
    applyNow: "Register solo",
    dates: "AUG 22 — SEP 01, 2026",
    chooseEvent: "CHOOSE YOUR TOURNAMENT",
    eventIntro: "Everything you need at a glance. Final start times, prizes and check-in times will be announced soon.",
    date: "Date", format: "Format", platform: "Platform", registration: "Registration",
    open: "Open", formatValue: "5 vs. 5", platformValue: "PC · EU",
    leagueTag: "Summoner’s Rift", valorantTag: "Competitive",
    leagueBlurb: "Gather your five strongest champions and show the community who controls the Rift.",
    valorantBlurb: "Sharp comms, clean executes and five players who hold together under pressure.",
    timelineTitle: "HOW IT WORKS",
    timelineIntro: "From registration to the grand final – simple, clear and transparent.",
    timeline: [
      ["01", "Register solo", "Submit your role, rank and Riot ID."],
      ["02", "Team assignment", "We build balanced teams and contact you with your line-up."],
      ["03", "Check in", "Your complete assigned team must be online on time."],
      ["04", "Let’s play", "Follow the bracket, play your matches and tune into the stream."],
    ],
    rulesTitle: "FAIR PLAY. CLEAR RULES.",
    rulesIntro: "The short version for both tournaments. Full rules will be published before check-in.",
    commonRules: "Both tournaments",
    commonRulesList: [
      "Treat everyone with respect – no hate, discrimination or toxic behavior.",
      "All players must be able to play on EU servers.",
      "Cheats, exploits, smurfing and account sharing result in disqualification.",
      "Assigned teams must check in complete and on time.",
      "Tournament admin decisions are final in case of disputes.",
    ],
    gameRules: "Game-specific",
    leagueRules: ["Standard 5v5 on Summoner’s Rift", "Tournament mode and draft", "Teams are assembled by the tournament admins", "Patch and match format to be confirmed"],
    valorantRules: ["Standard 5v5 custom game", "Tournament Mode enabled", "Teams are assembled by the tournament admins", "Map pool and match format to be confirmed"],
    teamsTitle: "THE LINE-UP",
    teamsIntro: "We build balanced teams from all solo applicants. Confirmed line-ups will appear here.",
    openSlot: "Open slot",
    bracketTitle: "BRACKET",
    bracketIntro: "The tournament bracket will be published after registration closes and updated live during the event.",
    bracketPending: "Bracket coming soon",
    bracketHint: "Add a Challonge, Toornament or start.gg link here.",
    formEyebrow: "READY TO QUEUE?",
    formTitle: "REGISTER SOLO.",
    formIntro: "You don’t need a team yet. Tell us what you play and we’ll handle the matchmaking.",
    tournament: "Tournament", playerName: "Player name", riotId: "Riot ID",
    contact: "Contact email (optional)", role: "Preferred role", rank: "Current rank",
    languageLabel: "Preferred language", flex: "I can play another role if needed.",
    note: "Anything else we should know?",
    consent: "I have read the Terms of Participation and Privacy Policy and accept the Terms of Participation.",
    submit: "Submit registration", submitting: "Submitting …",
    formNote: "Your verified Discord ID is securely stored with the application.",
    discordRequired: "DISCORD VERIFICATION",
    discordExplain: "Sign in with Discord so we can verify your identity and send you your team assignment later.",
    loginDiscord: "Continue with Discord",
    checkingDiscord: "Checking Discord session …",
    verifiedAs: "Verified as",
    logoutDiscord: "Sign out",
    discordUnavailable: "Discord login works on the published Netlify version.",
    authError: "Discord sign-in failed. Please try again.",
    submitError: "Your application could not be saved. Please try again.",
    playerPlaceholder: "Your in-game or community name", riotPlaceholder: "RiotName#TAG",
    contactPlaceholder: "mail@example.com",
    rankPlaceholder: "e.g. Gold 2",
    notePlaceholder: "Questions, availability, requests …",
    footerLine: "Community tournaments by HappyGiganto.",
    madeFor: "Made for good games and even better vibes.",
    terms: "Terms", privacy: "Privacy",
    themeLight: "Switch to light theme", themeDark: "Switch to dark theme",
    language: "Auf Deutsch wechseln", menu: "Open menu", closeMenu: "Close menu",
  },
} as const;

const eventData = {
  league: { title: "LEAGUE OF LEGENDS", dateDe: "22. AUGUST 2026", dateEn: "AUGUST 22, 2026", mark: "L" },
  valorant: { title: "VALORANT", dateDe: "01. SEPTEMBER 2026", dateEn: "SEPTEMBER 01, 2026", mark: "V" },
} as const;

const roleOptions = {
  de: {
    league: ["Top", "Jungle", "Mid", "ADC", "Support", "Flex"],
    valorant: ["Duelist", "Initiator", "Controller", "Sentinel", "Flex"],
  },
  en: {
    league: ["Top", "Jungle", "Mid", "ADC", "Support", "Flex"],
    valorant: ["Duelist", "Initiator", "Controller", "Sentinel", "Flex"],
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("de");
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeGame, setActiveGame] = useState<Game>("league");
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const t = copy[language];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedLanguage = localStorage.getItem("hg-language") as Language | null;
      const savedTheme = localStorage.getItem("hg-theme") as Theme | null;
      if (savedLanguage === "de" || savedLanguage === "en") setLanguage(savedLanguage);
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
      else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    localStorage.setItem("hg-theme", theme);
    localStorage.setItem("hg-language", language);
  }, [theme, language]);

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("auth");
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (authError && !cancelled) setFormError(copy[language].authError);
    });

    fetch("/api/auth/discord/session", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Session endpoint unavailable");
        return response.json() as Promise<{ authenticated: boolean; user?: DiscordUser }>;
      })
      .then((result) => {
        if (!cancelled && result.authenticated && result.user) setDiscordUser(result.user);
      })
      .catch(() => {
        if (!cancelled && window.location.hostname === "localhost") setFormError(copy[language].discordUnavailable);
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [language]);

  const event = eventData[activeGame];
  const teamSlots = useMemo(() => Array.from({ length: 8 }), []);

  function toggleLanguage() {
    setLanguage((current) => (current === "de" ? "en" : "de"));
    setMenuOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!discordUser) {
      setFormError(t.authError);
      return;
    }

    setSubmitting(true);
    setFormError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    fetch("/api/apply", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    }).then(async (response) => {
      if (!response.ok) throw new Error((await response.json() as { error?: string }).error || "Submission failed");
      window.location.href = "/danke/";
    }).catch(() => {
      setSubmitting(false);
      setFormError(t.submitError);
    });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="HappyGiganto Tournament home">
          <Image className="brand-logo" src="/happygiganto-logo.png" alt="" width={42} height={42} priority />
          <span className="brand-type">HAPPY<span>GIGANTO</span></span>
        </a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <a href="#events" onClick={() => setMenuOpen(false)}>{t.nav.events}</a>
          <a href="#schedule" onClick={() => setMenuOpen(false)}>{t.nav.schedule}</a>
          <a href="#rules" onClick={() => setMenuOpen(false)}>{t.nav.rules}</a>
          <a href="#teams" onClick={() => setMenuOpen(false)}>{t.nav.teams}</a>
          <a className="nav-cta" href="#apply" onClick={() => setMenuOpen(false)}>{t.nav.apply}</a>
        </nav>
        <div className="header-tools">
          <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label={t.language}>
            <span className={language === "de" ? "active" : ""}>DE</span><i /><span className={language === "en" ? "active" : ""}>EN</span>
          </button>
          <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? t.themeLight : t.themeDark}>
            <span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span>
          </button>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t.closeMenu : t.menu} aria-expanded={menuOpen}>
            <span /><span />
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span />{t.eyebrow}</p>
            <h1><span>{t.headlineA}</span><strong>{t.headlineB}</strong></h1>
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#apply">{t.applyNow}<span>↗</span></a>
              <a className="button button-ghost" href="https://www.twitch.tv/happygiganto" target="_blank" rel="noreferrer"><span className="twitch-dot" />{t.viewChannel}</a>
            </div>
          </div>
          <div className="hero-stage" aria-label={t.dates}>
            <div className="stage-card stage-league"><span className="stage-index">01</span><span className="stage-game">LEAGUE</span><strong>22<span>AUG</span></strong></div>
            <div className="stage-vs">VS</div>
            <div className="stage-card stage-valorant"><span className="stage-index">02</span><span className="stage-game">VALORANT</span><strong>01<span>SEP</span></strong></div>
            <div className="stage-year">20<br />26</div>
          </div>
        </div>
        <div className="ticker" aria-hidden="true"><div><span>LEAGUE OF LEGENDS</span><i>✦</i><span>VALORANT</span><i>✦</i><span>COMMUNITY CUP</span><i>✦</i><span>LIVE ON TWITCH</span><i>✦</i><span>LEAGUE OF LEGENDS</span><i>✦</i><span>VALORANT</span><i>✦</i></div></div>
      </section>

      <section className="events section" id="events">
        <div className="container">
          <div className="section-heading"><p className="section-kicker">01 — EVENTS</p><h2>{t.chooseEvent}</h2><p>{t.eventIntro}</p></div>
          <div className="event-tabs" role="tablist" aria-label={t.chooseEvent}>
            {(Object.keys(eventData) as Game[]).map((game) => (
              <button key={game} role="tab" aria-selected={activeGame === game} className={`event-tab ${game} ${activeGame === game ? "active" : ""}`} onClick={() => setActiveGame(game)} type="button">
                <span className="game-mark">{eventData[game].mark}</span><span><small>TOURNAMENT</small>{eventData[game].title}</span><i>{activeGame === game ? "●" : "○"}</i>
              </button>
            ))}
          </div>
          <div className={`event-panel ${activeGame}`} role="tabpanel">
            <div className="event-visual"><div className="event-monogram">{event.mark}</div><div className="event-scanlines" /><span className="event-label">{activeGame === "league" ? t.leagueTag : t.valorantTag}</span></div>
            <div className="event-content">
              <p className="event-number">EVENT {activeGame === "league" ? "01" : "02"}</p>
              <h3>{event.title}</h3>
              <p className="event-blurb">{activeGame === "league" ? t.leagueBlurb : t.valorantBlurb}</p>
              <dl className="event-facts">
                <div><dt>{t.date}</dt><dd>{language === "de" ? event.dateDe : event.dateEn}</dd></div>
                <div><dt>{t.format}</dt><dd>{t.formatValue}</dd></div>
                <div><dt>{t.platform}</dt><dd>{t.platformValue}</dd></div>
                <div><dt>{t.registration}</dt><dd className="status-open"><span />{t.open}</dd></div>
              </dl>
              <a className="text-link" href="#apply">{t.applyNow}<span>↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline section" id="schedule">
        <div className="container">
          <div className="section-heading section-heading-wide"><div><p className="section-kicker">02 — FLOW</p><h2>{t.timelineTitle}</h2></div><p>{t.timelineIntro}</p></div>
          <div className="timeline-grid">{t.timeline.map(([number, title, description]) => (
            <article className="timeline-step" key={number}><div className="step-number">{number}</div><div className="step-line"><span /></div><h3>{title}</h3><p>{description}</p></article>
          ))}</div>
        </div>
      </section>

      <section className="rules section" id="rules">
        <div className="container">
          <div className="section-heading section-heading-wide"><div><p className="section-kicker">03 — RULEBOOK</p><h2>{t.rulesTitle}</h2></div><p>{t.rulesIntro}</p></div>
          <div className="rules-grid">
            <article className="rule-card common"><span className="rule-index">A</span><div><p className="rule-label">{t.commonRules}</p><h3>COMMUNITY<br />CODE</h3><ul>{t.commonRulesList.map((rule) => <li key={rule}><span>✓</span>{rule}</li>)}</ul></div></article>
            <article className="rule-card league"><span className="rule-index">B</span><div><p className="rule-label">{t.gameRules}</p><h3>LEAGUE OF<br />LEGENDS</h3><ul>{t.leagueRules.map((rule) => <li key={rule}><span>+</span>{rule}</li>)}</ul></div></article>
            <article className="rule-card valorant"><span className="rule-index">C</span><div><p className="rule-label">{t.gameRules}</p><h3>VALORANT</h3><ul>{t.valorantRules.map((rule) => <li key={rule}><span>+</span>{rule}</li>)}</ul></div></article>
          </div>
        </div>
      </section>

      <section className="teams section" id="teams">
        <div className="container">
          <div className="teams-header">
            <div className="section-heading"><p className="section-kicker">04 — ROSTER</p><h2>{t.teamsTitle}</h2><p>{t.teamsIntro}</p></div>
            <div className="teams-game-switch"><button className={activeGame === "league" ? "active" : ""} type="button" onClick={() => setActiveGame("league")}>LOL</button><button className={activeGame === "valorant" ? "active" : ""} type="button" onClick={() => setActiveGame("valorant")}>VAL</button></div>
          </div>
          <div className={`team-grid ${activeGame}`}>{teamSlots.map((_, index) => (
            <div className="team-slot" key={index}><span className="slot-number">{String(index + 1).padStart(2, "0")}</span><div className="slot-logo">?</div><div><strong>{t.openSlot}</strong><small>{event.title}</small></div><span className="slot-status" aria-label={t.open}>+</span></div>
          ))}</div>
          <div className={`bracket-card ${activeGame}`}>
            <div className="bracket-copy"><p className="section-kicker">LIVE BRACKET</p><h3>{t.bracketTitle}</h3><p>{t.bracketIntro}</p></div>
            <div className="bracket-visual" aria-hidden="true"><div className="bracket-round bracket-round-one"><i /><i /><i /><i /></div><div className="bracket-round bracket-round-two"><i /><i /></div><div className="bracket-round bracket-round-three"><i /></div></div>
            <div className="bracket-pending"><span>◎</span><strong>{t.bracketPending}</strong><small>{t.bracketHint}</small></div>
          </div>
        </div>
      </section>

      <section className="application section" id="apply">
        <div className="container application-grid">
          <div className="application-copy"><p className="section-kicker">{t.formEyebrow}</p><h2>{t.formTitle}</h2><p>{t.formIntro}</p><div className="application-dates"><div><span>22</span><div><strong>AUG</strong><small>LEAGUE OF LEGENDS</small></div></div><div><span>01</span><div><strong>SEP</strong><small>VALORANT</small></div></div></div></div>
          <form className="application-form" method="POST" action="/api/apply" onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value="solo-registration" />
            <input type="hidden" name="discord-id" value="" />
            <input type="hidden" name="discord-username" value="" />
            <input type="hidden" name="discord-display-name" value="" />
            <input type="hidden" name="discord-verified" value="" />
            <p className="hidden-field"><label>Don’t fill this out: <input name="bot-field" /></label></p>
            <div className={`discord-auth-card ${discordUser ? "is-verified" : ""}`}>
              <div
                className="discord-avatar"
                style={discordUser?.avatar ? {
                  backgroundImage: `url(https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=80)`,
                } : undefined}
                aria-hidden="true"
              >
                {!discordUser?.avatar && (discordUser?.globalName || discordUser?.username || "D").charAt(0).toUpperCase()}
              </div>
              <div className="discord-auth-copy">
                <span>{discordUser ? t.verifiedAs : t.discordRequired}</span>
                {authLoading ? (
                  <strong>{t.checkingDiscord}</strong>
                ) : discordUser ? (
                  <><strong>{discordUser.globalName || discordUser.username}</strong><small>@{discordUser.username} · ID {discordUser.id}</small></>
                ) : (
                  <><strong>{t.loginDiscord}</strong><small>{t.discordExplain}</small></>
                )}
              </div>
              {!authLoading && (discordUser ? (
                <a className="discord-login secondary" href="/api/auth/discord/logout">{t.logoutDiscord}</a>
              ) : (
                <a className="discord-login" href="/api/auth/discord/login">{t.loginDiscord}<span>↗</span></a>
              ))}
            </div>
            <fieldset className="application-fields" disabled={!discordUser || submitting}>
            <div className="form-row">
              <label><span>{t.tournament} *</span><select name="tournament" required value={activeGame} onChange={(e) => setActiveGame(e.target.value as Game)}><option value="league">League of Legends — 22.08.2026</option><option value="valorant">Valorant — 01.09.2026</option></select></label>
              <label><span>{t.playerName} *</span><input name="player-name" required placeholder={t.playerPlaceholder} autoComplete="nickname" /></label>
            </div>
            <div className="form-row">
              <label><span>{t.riotId} *</span><input name="riot-id" required placeholder={t.riotPlaceholder} /></label>
              <label><span>{t.contact}</span><input type="email" name="contact" placeholder={t.contactPlaceholder} autoComplete="email" /></label>
            </div>
            <div className="form-row">
              <label>
                <span>{t.role} *</span>
                <select name="preferred-role" required defaultValue="">
                  <option value="" disabled>—</option>
                  {roleOptions[language][activeGame].map((role) => <option value={role} key={role}>{role}</option>)}
                </select>
              </label>
              <label><span>{t.rank} *</span><input name="rank" required placeholder={t.rankPlaceholder} /></label>
            </div>
            <div className="form-row">
              <label>
                <span>{t.languageLabel} *</span>
                <select name="language" required defaultValue="both">
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                  <option value="both">Deutsch + English</option>
                </select>
              </label>
              <label className="flex-option"><input type="checkbox" name="flex-role" value="yes" /><span>{t.flex}</span></label>
            </div>
            <label><span>{t.note}</span><textarea name="notes" rows={3} placeholder={t.notePlaceholder} /></label>
            <label className="consent"><input type="checkbox" name="consent" required /><span>{t.consent}<br /><a href="/terms/" target="_blank">{t.terms} ↗</a> · <a href="/privacy/" target="_blank">{t.privacy} ↗</a></span></label>
            <button className="button button-submit" type="submit" disabled={submitting}>{submitting ? t.submitting : t.submit}<span>↗</span></button>
            </fieldset>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <p className="form-note"><span>✓</span>{t.formNote}</p>
          </form>
        </div>
      </section>

      <form className="netlify-detection-form" name="solo-registration" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" aria-hidden="true">
        <input type="hidden" name="form-name" value="solo-registration" />
        <input name="bot-field" />
        <input name="tournament" />
        <input name="player-name" />
        <input name="riot-id" />
        <input name="contact" />
        <input name="preferred-role" />
        <input name="rank" />
        <input name="language" />
        <input name="flex-role" />
        <input name="notes" />
        <input name="consent" />
        <input name="discord-id" />
        <input name="discord-username" />
        <input name="discord-display-name" />
        <input name="discord-verified" />
      </form>

      <footer>
        <div className="container footer-grid">
          <div><a className="brand footer-brand" href="#top"><Image className="brand-logo" src="/happygiganto-logo.png" alt="" width={46} height={46} /><span className="brand-type">HAPPY<span>GIGANTO</span></span></a><p>{t.footerLine}<br />{t.madeFor}</p></div>
          <div className="footer-links"><p>SOCIAL</p>
            <a href="https://www.twitch.tv/happygiganto" target="_blank" rel="noreferrer">Twitch <span>↗</span></a>
            <a href="https://www.youtube.com/@happygiganto" target="_blank" rel="noreferrer">YouTube <span>↗</span></a>
            <a href="https://discord.com/invite/SJxZPjfZwU" target="_blank" rel="noreferrer">Discord <span>↗</span></a>
            <a href="https://www.tiktok.com/@happygiganto_" target="_blank" rel="noreferrer">TikTok <span>↗</span></a>
            <a href="https://www.instagram.com/happygiganto" target="_blank" rel="noreferrer">Instagram <span>↗</span></a>
            <a href="https://ko-fi.com/therealhappygiganto" target="_blank" rel="noreferrer">Ko-fi <span>↗</span></a>
          </div>
          <div className="footer-links"><p>EVENTS</p><a href="#events" onClick={() => setActiveGame("league")}>League of Legends</a><a href="#events" onClick={() => setActiveGame("valorant")}>Valorant</a></div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 HappyGiganto</span>
          <span className="footer-legal-links"><a href="/terms/">{t.terms}</a><a href="/privacy/">{t.privacy}</a></span>
          <button type="button" onClick={toggleLanguage}>{language === "de" ? "English" : "Deutsch"}</button>
        </div>
      </footer>
    </main>
  );
}
