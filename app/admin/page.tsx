"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Applicant = {
  id: string;
  submittedAt: string;
  tournament: "league" | "valorant";
  playerName: string;
  riotId: string;
  contact: string;
  discordId: string;
  discordUsername: string;
  preferredRole: string;
  rank: string;
  language: string;
  flexRole: string;
  notes: string;
  team: string;
};

const STORAGE_KEY = "hg-admin-applicants-v1";
const teamOptions = ["", "Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8", "Waitlist"];

function parseCsv(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (character === "\"" && quoted && next === "\"") {
      cell += "\"";
      index += 1;
    } else if (character === "\"") {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function normalizeHeader(value: string) {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function csvValue(value: string | undefined) {
  return `"${String(value || "").replaceAll("\"", "\"\"")}"`;
}

export default function AdminPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [game, setGame] = useState<"league" | "valorant">("league");
  const [query, setQuery] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setApplicants(JSON.parse(saved) as Applicant[]);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      document.documentElement.dataset.theme = localStorage.getItem("hg-theme") || "dark";
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(applicants));
  }, [applicants, hydrated]);

  const visibleApplicants = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return applicants.filter((applicant) => {
      if (applicant.tournament !== game) return false;
      if (!needle) return true;
      return [applicant.playerName, applicant.riotId, applicant.preferredRole, applicant.rank, applicant.team]
        .some((value) => value.toLowerCase().includes(needle));
    });
  }, [applicants, game, query]);

  const gameApplicants = applicants.filter((applicant) => applicant.tournament === game);
  const assignedCount = gameApplicants.filter((applicant) => applicant.team && applicant.team !== "Waitlist").length;
  const teamCount = new Set(gameApplicants.map((applicant) => applicant.team).filter((team) => team.startsWith("Team "))).size;

  async function importCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const rows = parseCsv(await file.text());
    if (rows.length < 2) {
      setImportMessage("Keine verwertbaren Einträge gefunden.");
      return;
    }

    const headers = rows[0].map(normalizeHeader);
    const valueFrom = (row: string[], ...names: string[]) => {
      const index = headers.findIndex((header) => names.includes(header));
      return index >= 0 ? (row[index] || "").trim() : "";
    };
    const existingAssignments = new Map(applicants.map((applicant) => [`${applicant.riotId}|${applicant.contact}`, applicant.team]));

    const imported = rows.slice(1).map((row, index): Applicant => {
      const riotId = valueFrom(row, "riotid");
      const contact = valueFrom(row, "contact", "discordnameoderemail", "discordnameoremail");
      const rawTournament = valueFrom(row, "tournament", "turnier").toLowerCase();
      return {
        id: valueFrom(row, "id", "submissionid") || `${riotId || contact || "player"}-${index}`,
        submittedAt: valueFrom(row, "createdat", "submittedat", "date"),
        tournament: rawTournament.includes("valorant") ? "valorant" : "league",
        playerName: valueFrom(row, "playername", "spielername", "name"),
        riotId,
        contact,
        discordId: valueFrom(row, "discordid"),
        discordUsername: valueFrom(row, "discordusername"),
        preferredRole: valueFrom(row, "preferredrole", "bevorzugterolle", "role"),
        rank: valueFrom(row, "rank", "aktuellerang"),
        language: valueFrom(row, "language", "bevorzugtesprache"),
        flexRole: valueFrom(row, "flexrole"),
        notes: valueFrom(row, "notes", "nochetwasdaswirwissensollten"),
        team: existingAssignments.get(`${riotId}|${contact}`) || "",
      };
    }).filter((applicant) => applicant.playerName || applicant.riotId || applicant.contact);

    setApplicants(imported);
    setImportMessage(`${imported.length} Solo-Anmeldungen importiert.`);
    event.target.value = "";
  }

  function assignTeam(id: string, team: string) {
    setApplicants((current) => current.map((applicant) => applicant.id === id ? { ...applicant, team } : applicant));
  }

  function exportTeams() {
    const header = ["Tournament", "Team", "Player Name", "Riot ID", "Preferred Role", "Rank", "Language", "Discord Username", "Discord ID", "Contact Email", "Notes"];
    const lines = applicants.map((applicant) => [
      applicant.tournament,
      applicant.team || "Unassigned",
      applicant.playerName,
      applicant.riotId,
      applicant.preferredRole,
      applicant.rank,
      applicant.language,
      applicant.discordUsername,
      applicant.discordId,
      applicant.contact,
      applicant.notes,
    ].map(csvValue).join(","));
    const csv = `\uFEFF${header.map(csvValue).join(",")}\n${lines.join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "happygiganto-team-assignment.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearBoard() {
    if (!window.confirm("Alle lokal importierten Anmeldungen und Team-Zuteilungen löschen?")) return;
    setApplicants([]);
    setImportMessage("Lokales Board geleert.");
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link className="brand" href="/">
          <Image className="brand-logo" src="/happygiganto-logo.png" alt="" width={42} height={42} priority />
          <span className="brand-type">HAPPY<span>GIGANTO</span></span>
        </Link>
        <div>
          <span className="admin-private">LOCAL ADMIN BOARD</span>
          <Link href="/">← Zur Turnierseite</Link>
        </div>
      </header>

      <section className="admin-shell">
        <div className="admin-intro">
          <div>
            <p className="section-kicker">TEAM BUILDER</p>
            <h1>SOLO QUEUE<br />CONTROL ROOM</h1>
            <p>Exportiere die Einsendungen im privaten Netlify-Dashboard als CSV und importiere sie hier. Die Daten und Zuteilungen bleiben ausschließlich in diesem Browser.</p>
          </div>
          <div className="admin-actions">
            <input ref={fileInput} type="file" accept=".csv,text/csv" onChange={importCsv} />
            <button className="button button-primary" type="button" onClick={() => fileInput.current?.click()}>Netlify CSV importieren</button>
            <button className="button button-ghost" type="button" onClick={exportTeams} disabled={!applicants.length}>Team-CSV exportieren</button>
            {importMessage && <p>{importMessage}</p>}
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
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Spieler, Rolle, Rang oder Team suchen …" />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Player</th><th>Role</th><th>Rank</th><th>Language</th><th>Contact</th><th>Assignment</th></tr></thead>
            <tbody>
              {visibleApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td><strong>{applicant.playerName || "—"}</strong><small>{applicant.riotId || "No Riot ID"}</small></td>
                  <td>{applicant.preferredRole || "—"}{applicant.flexRole && <small>Flex ✓</small>}</td>
                  <td>{applicant.rank || "—"}</td>
                  <td>{applicant.language || "—"}</td>
                  <td><strong>{applicant.discordUsername ? `@${applicant.discordUsername}` : "—"}</strong><small>{applicant.contact || applicant.discordId || "No email"}</small></td>
                  <td>
                    <select value={applicant.team} onChange={(event) => assignTeam(applicant.id, event.target.value)}>
                      {teamOptions.map((team) => <option value={team} key={team}>{team || "Unassigned"}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleApplicants.length && (
            <div className="admin-empty">
              <span>↥</span>
              <strong>Noch keine Solo-Anmeldungen</strong>
              <p>CSV aus Netlify Forms exportieren und oben importieren.</p>
            </div>
          )}
        </div>

        <div className="admin-footnote">
          <p><strong>Datenschutz:</strong> Dieses Board lädt keine Bewerbungen vom Server. Importierte Kontaktdaten verbleiben im lokalen Browser-Speicher.</p>
          <button type="button" onClick={clearBoard} disabled={!applicants.length}>Lokales Board leeren</button>
        </div>
      </section>
    </main>
  );
}
