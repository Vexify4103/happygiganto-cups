"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Applicant = {
  id: string;
  submittedAt: string;
  tournament: "league" | "valorant";
  playerName: string;
  riotId: string;
  contact: string;
  discordId: string;
  discordUsername: string;
  discordDisplayName: string;
  preferredRole: string;
  mainRole: string;
  secondaryRole: string;
  rank: string;
  opggUrl: string;
  peakRank: string;
  mostPlayedAgents: string[];
  language: string;
  flexRole: boolean;
  notes: string;
  team: string;
};

type AdminUser = {
  id: string;
  username: string;
  globalName: string | null;
};

type AccessState = "loading" | "signed-out" | "forbidden" | "ready" | "error";

const teamOptions = ["", "Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8", "Waitlist"];

function csvValue(value: string | undefined) {
  const normalized = String(value || "");
  const spreadsheetSafe = /^[=+\-@]/.test(normalized) ? `'${normalized}` : normalized;
  return `"${spreadsheetSafe.replaceAll("\"", "\"\"")}"`;
}

export default function AdminPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [game, setGame] = useState<"league" | "valorant">("league");
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");

  async function loadApplications() {
    setMessage("");
    setAccessState("loading");
    try {
      const response = await fetch("/api/admin/applications", {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      if (response.status === 401) {
        setAccessState("signed-out");
        return;
      }
      if (response.status === 403) {
        setAccessState("forbidden");
        return;
      }
      if (!response.ok) throw new Error("Admin endpoint unavailable");
      const result = await response.json() as { applications: Applicant[]; user: AdminUser };
      setApplicants(result.applications);
      setAdminUser(result.user);
      setAccessState("ready");
    } catch {
      setAccessState("error");
    }
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.documentElement.dataset.theme = localStorage.getItem("hg-theme") || "dark";
      void loadApplications();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const visibleApplicants = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return applicants.filter((applicant) => {
      if (applicant.tournament !== game) return false;
      if (!needle) return true;
      return [
        applicant.playerName,
        applicant.riotId,
        applicant.preferredRole,
        applicant.mainRole,
        applicant.secondaryRole,
        applicant.rank,
        applicant.peakRank,
        applicant.opggUrl,
        applicant.mostPlayedAgents.join(" "),
        applicant.team,
        applicant.discordUsername,
        applicant.contact,
      ].some((value) => value.toLowerCase().includes(needle));
    });
  }, [applicants, game, query]);

  const gameApplicants = applicants.filter((applicant) => applicant.tournament === game);
  const assignedCount = gameApplicants.filter((applicant) => applicant.team && applicant.team !== "Waitlist").length;
  const teamCount = new Set(gameApplicants.map((applicant) => applicant.team).filter((team) => team.startsWith("Team "))).size;

  async function assignTeam(id: string, team: string) {
    const previousTeam = applicants.find((applicant) => applicant.id === id)?.team || "";
    setApplicants((current) => current.map((applicant) => applicant.id === id ? { ...applicant, team } : applicant));
    setSavingId(id);
    setMessage("");
    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, team }),
      });
      if (!response.ok) throw new Error("Assignment failed");
    } catch {
      setApplicants((current) => current.map((applicant) => applicant.id === id ? { ...applicant, team: previousTeam } : applicant));
      setMessage("Die Team-Zuteilung konnte nicht gespeichert werden.");
    } finally {
      setSavingId("");
    }
  }

  function exportTeams() {
    const delimiter = ";";
    const header = ["Tournament", "Team", "Player Name", "Riot ID", "Main Role", "Secondary Role", "Most Played Agents", "Current Rank", "Peak Rank", "OP.GG", "Language", "Discord Display Name", "Discord Username", "Discord ID", "Contact Email", "Notes", "Submitted At"];
    const lines = applicants.map((applicant) => [
      applicant.tournament,
      applicant.team || "Unassigned",
      applicant.playerName,
      applicant.riotId,
      applicant.mainRole || applicant.preferredRole,
      applicant.secondaryRole,
      applicant.mostPlayedAgents.join(" | "),
      applicant.rank,
      applicant.peakRank,
      applicant.opggUrl,
      applicant.language,
      applicant.discordDisplayName,
      applicant.discordUsername,
      applicant.discordId,
      applicant.contact,
      applicant.notes,
      applicant.submittedAt,
    ].map(csvValue).join(delimiter));
    const csv = `\uFEFFsep=${delimiter}\r\n${header.map(csvValue).join(delimiter)}\r\n${lines.join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "happygiganto-team-assignment.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link className="brand" href="/">
          <Image className="brand-logo" src="/happygiganto-logo.png" alt="" width={42} height={42} priority />
          <span className="brand-type">HAPPY<span>GIGANTO</span></span>
        </Link>
        <div>
          <span className="admin-private">DISCORD PROTECTED</span>
          <Link href="/">← Zur Turnierseite</Link>
        </div>
      </header>

      {accessState !== "ready" ? (
        <section className="admin-gate">
          <p className="section-kicker">PRIVATE ADMIN AREA</p>
          <h1>
            {accessState === "loading" && "ZUGRIFF WIRD GEPRÜFT"}
            {accessState === "signed-out" && "DISCORD LOGIN REQUIRED"}
            {accessState === "forbidden" && "ACCESS DENIED"}
            {accessState === "error" && "VERBINDUNGSFEHLER"}
          </h1>
          <p>
            {accessState === "loading" && "Die Discord-Session und Admin-Berechtigung werden serverseitig geprüft."}
            {accessState === "signed-out" && "Melde dich mit einem freigeschalteten Discord-Konto an, um die Bewerbungen zu sehen."}
            {accessState === "forbidden" && "Dieses Discord-Konto steht nicht auf der Admin-Liste. Bewerbungsdaten wurden nicht übertragen."}
            {accessState === "error" && "Die Admin-Datenbank ist gerade nicht erreichbar. Prüfe die MongoDB-Konfiguration oder versuche es erneut."}
          </p>
          {accessState === "signed-out" && <a className="button button-primary" href="/api/auth/discord/login?returnTo=%2Fadmin%2F">Mit Discord anmelden</a>}
          {accessState === "forbidden" && <a className="button button-ghost" href="/api/auth/discord/logout?returnTo=%2Fadmin%2F">Abmelden</a>}
          {accessState === "error" && <button className="button button-primary" type="button" onClick={() => void loadApplications()}>Erneut versuchen</button>}
        </section>
      ) : (
        <section className="admin-shell">
          <div className="admin-intro">
            <div>
              <p className="section-kicker">MONGODB TEAM BUILDER</p>
              <h1>SOLO QUEUE<br />CONTROL ROOM</h1>
              <p>Alle Solo-Anmeldungen werden direkt aus der geschützten Datenbank geladen. Team-Zuteilungen werden sofort gespeichert und sind für beide Admins verfügbar.</p>
            </div>
            <div className="admin-actions">
              <span className="admin-account-label">ANGEMELDET ALS</span>
              <strong>{adminUser?.globalName || adminUser?.username}</strong>
              <small>@{adminUser?.username} · {adminUser?.id}</small>
              <button className="button button-primary" type="button" onClick={() => void loadApplications()}>Bewerbungen aktualisieren</button>
              <button className="button button-ghost" type="button" onClick={exportTeams} disabled={!applicants.length}>Team-CSV exportieren</button>
              <a className="admin-logout" href="/api/auth/discord/logout?returnTo=%2Fadmin%2F">Discord abmelden</a>
            </div>
          </div>

          <div className="admin-stats">
            <article><span>APPLICANTS</span><strong>{gameApplicants.length}</strong></article>
            <article><span>ASSIGNED</span><strong>{assignedCount}</strong></article>
            <article><span>TEAMS</span><strong>{teamCount}</strong></article>
            <article><span>OPEN</span><strong>{gameApplicants.filter((applicant) => !applicant.team).length}</strong></article>
          </div>

          <div className="admin-toolbar">
            <div className="teams-game-switch">
              <button className={game === "league" ? "active" : ""} type="button" onClick={() => setGame("league")}>LOL</button>
              <button className={game === "valorant" ? "active" : ""} type="button" onClick={() => setGame("valorant")}>VAL</button>
            </div>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Spieler, Discord, Rolle, Rang oder Team suchen …" />
          </div>

          {message && <p className="admin-error" role="alert">{message}</p>}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Player</th><th>Submitted</th><th>Role</th><th>Rank</th><th>Language</th><th>Discord / Contact</th><th>Notes</th><th>Assignment</th></tr></thead>
              <tbody>
                {visibleApplicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>
                      <strong>{applicant.playerName || "—"}</strong>
                      <small>{applicant.riotId || "No Riot ID"}</small>
                      {applicant.opggUrl && <a className="admin-profile-link" href={applicant.opggUrl} target="_blank" rel="noreferrer">OP.GG ↗</a>}
                    </td>
                    <td>{new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(applicant.submittedAt))}</td>
                    <td>
                      {applicant.mainRole || applicant.preferredRole || "—"}
                      {applicant.tournament === "league" && applicant.secondaryRole && <small>Secondary: {applicant.secondaryRole}</small>}
                      {applicant.tournament === "valorant" && applicant.secondaryRole && <small>Secondary: {applicant.secondaryRole}</small>}
                      {applicant.tournament === "valorant" && applicant.mostPlayedAgents.length > 0 && <small>Agents: {applicant.mostPlayedAgents.join(", ")}</small>}
                    </td>
                    <td>{applicant.rank || "—"}{applicant.peakRank && <small>Peak: {applicant.peakRank}</small>}</td>
                    <td>{applicant.language || "—"}</td>
                    <td><strong>{applicant.discordDisplayName || `@${applicant.discordUsername}`}</strong><small>@{applicant.discordUsername} · {applicant.discordId}</small><small>{applicant.contact || "Keine E-Mail"}</small></td>
                    <td className="admin-notes">{applicant.notes || "—"}</td>
                    <td>
                      <select value={applicant.team} disabled={savingId === applicant.id} onChange={(event) => void assignTeam(applicant.id, event.target.value)}>
                        {teamOptions.map((team) => <option value={team} key={team}>{team || "Unassigned"}</option>)}
                      </select>
                      {savingId === applicant.id && <small>Speichert …</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visibleApplicants.length && (
              <div className="admin-empty">
                <span>↥</span>
                <strong>Noch keine Solo-Anmeldungen</strong>
                <p>Neue Bewerbungen erscheinen nach dem Absenden automatisch in MongoDB.</p>
              </div>
            )}
          </div>

          <div className="admin-footnote">
            <p><strong>Datenschutz:</strong> Bewerbungsdaten werden nur nach serverseitiger Discord-ID-Prüfung ausgeliefert. Diese Seite enthält ohne erfolgreiche Admin-Autorisierung keine personenbezogenen Daten.</p>
          </div>
        </section>
      )}
    </main>
  );
}
