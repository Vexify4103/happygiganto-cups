"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Language = "de" | "en";
type DiscordUser = {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
};

type SessionResponse = {
  authenticated: boolean;
  isAdmin?: boolean;
  user?: DiscordUser;
};

const copy = {
  de: {
    kicker: "DEIN ACCOUNT",
    title: "DISCORD VERBUNDEN.",
    intro: "Hier siehst du, welcher Discord-Account für deine Turnieranmeldung verwendet wird.",
    loading: "Discord-Session wird geprüft …",
    signedOutTitle: "Noch nicht angemeldet",
    signedOutText: "Melde dich mit Discord an, um deine Identität zu bestätigen und dich für ein Turnier anzumelden.",
    login: "Mit Discord anmelden",
    verified: "Verifizierter Discord-Account",
    username: "Benutzername",
    discordId: "Discord-ID",
    access: "Zugriff",
    admin: "Turnier-Admin",
    player: "Teilnehmer:in",
    dashboard: "Admin-Dashboard",
    logout: "Abmelden",
    home: "Zur Startseite",
    error: "Die Discord-Session konnte nicht geladen werden. Starte die Seite lokal über Netlify Dev oder versuche es erneut.",
    authError: "Die Discord-Anmeldung ist fehlgeschlagen. Bitte versuche es erneut.",
    language: "Switch to English",
  },
  en: {
    kicker: "YOUR ACCOUNT",
    title: "DISCORD CONNECTED.",
    intro: "This is the Discord account used for your tournament registration.",
    loading: "Checking Discord session …",
    signedOutTitle: "Not signed in yet",
    signedOutText: "Sign in with Discord to verify your identity and register for a tournament.",
    login: "Continue with Discord",
    verified: "Verified Discord account",
    username: "Username",
    discordId: "Discord ID",
    access: "Access",
    admin: "Tournament admin",
    player: "Participant",
    dashboard: "Admin dashboard",
    logout: "Sign out",
    home: "Back to home",
    error: "The Discord session could not be loaded. Run the site locally through Netlify Dev or try again.",
    authError: "Discord sign-in failed. Please try again.",
    language: "Auf Deutsch wechseln",
  },
} as const;

export default function AccountPage() {
  const [language, setLanguage] = useState<Language>("de");
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [error, setError] = useState("");
  const t = copy[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("hg-language");
    const authError = new URLSearchParams(window.location.search).get("auth");
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      if (savedLanguage === "de" || savedLanguage === "en") setLanguage(savedLanguage);
      if (authError) setError(copy[savedLanguage === "en" ? "en" : "de"].authError);
    });

    fetch("/api/auth/discord/session", {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Session endpoint unavailable");
        return response.json() as Promise<SessionResponse>;
      })
      .then((result) => {
        if (!cancelled) setSession(result);
      })
      .catch(() => {
        if (!cancelled) setError(copy[savedLanguage === "en" ? "en" : "de"].error);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("hg-language", language);
  }, [language]);

  const avatarUrl = session?.user?.avatar
    ? `https://cdn.discordapp.com/avatars/${session.user.id}/${session.user.avatar}.png?size=256`
    : "";

  return (
    <main className="account-page">
      <header className="account-header">
        <Link className="brand" href="/" aria-label="HappyGiganto Community Cups">
          <Image className="brand-logo" src="/happygiganto-logo.png" alt="" width={42} height={42} priority />
          <span className="brand-type">HAPPY<span>GIGANTO</span></span>
        </Link>
        <div className="account-header-tools">
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLanguage((current) => current === "de" ? "en" : "de")}
            aria-label={t.language}
          >
            <span className={language === "de" ? "active" : ""}>DE</span><i /><span className={language === "en" ? "active" : ""}>EN</span>
          </button>
          <Link href="/">{t.home}</Link>
        </div>
      </header>

      <section className="account-shell">
        <div className="account-intro">
          <p className="section-kicker">{t.kicker}</p>
          <h1>{session?.authenticated ? t.title : t.signedOutTitle}</h1>
          <p>{session?.authenticated ? t.intro : t.signedOutText}</p>
        </div>

        {!session && !error && (
          <div className="account-loading">
            <span />
            <p>{t.loading}</p>
          </div>
        )}

        {error && <p className="account-error">{error}</p>}

        {session && !session.authenticated && (
          <a className="discord-connect-button" href="/api/auth/discord/login?returnTo=%2Fme%2F">
            <Image src="/discord-symbol.svg" alt="" width={25} height={19} />
            <span>{t.login}</span>
          </a>
        )}

        {session?.authenticated && session.user && (
          <article className="account-card">
            <div
              className="account-avatar"
              style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : undefined}
              aria-hidden="true"
            >
              {!avatarUrl && session.user.username.slice(0, 1).toUpperCase()}
            </div>
            <div className="account-identity">
              <span>{t.verified}</span>
              <strong>{session.user.globalName || session.user.username}</strong>
              <small>@{session.user.username}</small>
            </div>
            <dl className="account-details">
              <div><dt>{t.username}</dt><dd>@{session.user.username}</dd></div>
              <div><dt>{t.discordId}</dt><dd>{session.user.id}</dd></div>
              <div><dt>{t.access}</dt><dd>{session.isAdmin ? t.admin : t.player}</dd></div>
            </dl>
            <div className="account-actions">
              {session.isAdmin && <a className="button button-primary" href="/admin/">{t.dashboard}<span>↗</span></a>}
              <a className="button button-ghost" href="/api/auth/discord/logout?returnTo=%2Fme%2F">{t.logout}</a>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
