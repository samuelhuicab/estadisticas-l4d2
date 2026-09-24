import { useCallback, useEffect, useState } from "react";
import { fetchMatches, fetchRounds, fetchRoundPlayers } from "../lib/api";
import { detectTeamKey, groupByTeam, type DataRecord } from "../lib/adaptive";
import { LoadingPanel, ErrorPanel } from "./StatusPanels";
import { RecordRow, RecordCard, recordId, recordTitle } from "./AdaptiveRecord";

type Level =
  | { kind: "matches" }
  | { kind: "rounds"; match: DataRecord }
  | { kind: "players"; match: DataRecord; round: DataRecord };

export function MatchesExplorer() {
  const [level, setLevel] = useState<Level>({ kind: "matches" });

  return (
    <main className="relative min-h-full overflow-hidden bg-bg-base px-8 py-8 text-text-primary md:px-14 md:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(242,90,42,0.14),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[420px] -skew-x-12 bg-gradient-to-b from-accent-red/10 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {level.kind === "matches" && (
          <MatchesList onSelect={(match) => setLevel({ kind: "rounds", match })} />
        )}
        {level.kind === "rounds" && (
          <RoundsList
            match={level.match}
            onBack={() => setLevel({ kind: "matches" })}
            onSelect={(round) => setLevel({ kind: "players", match: level.match, round })}
          />
        )}
        {level.kind === "players" && (
          <PlayersList
            match={level.match}
            round={level.round}
            onBack={() => setLevel({ kind: "rounds", match: level.match })}
          />
        )}
      </div>
    </main>
  );
}

function ExplorerHeader({
  eyebrow,
  title,
  onBack,
  onRefresh,
  refreshing,
}: {
  eyebrow: string;
  title: string;
  onBack?: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <header className="mb-8 flex flex-col items-start justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="font-mono clip-tag mb-4 inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
          >
            ← Volver
          </button>
        )}
        <p className="font-mono mb-1 text-xs font-semibold uppercase tracking-[0.4em] text-accent-red">
          {eyebrow}
        </p>
        <h1 className="font-display text-5xl font-extrabold uppercase italic leading-none tracking-tight md:text-6xl">
          {title}
        </h1>
      </div>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="font-mono clip-tag border border-accent-red/50 bg-accent-red/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.3em] text-accent-red transition-colors hover:bg-accent-red/20 disabled:opacity-40"
      >
        {refreshing ? "Actualizando" : "Actualizar"}
      </button>
    </header>
  );
}

function MatchesList({ onSelect }: { onSelect: (match: DataRecord) => void }) {
  const [matches, setMatches] = useState<DataRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setMatches(await fetchMatches());
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <ExplorerHeader
        eyebrow="Historial"
        title="Partidas"
        onRefresh={load}
        refreshing={status === "loading"}
      />

      {status === "loading" && <LoadingPanel label="Cargando partidas" />}
      {status === "error" && <ErrorPanel title="No se pudieron cargar las partidas" message={errorMessage} />}
      {status === "ready" &&
        (matches.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {matches.map((match) => (
              <RecordRow key={String(recordId(match))} record={match} onClick={() => onSelect(match)} />
            ))}
          </div>
        ) : (
          <p className="font-mono text-center text-sm font-semibold uppercase tracking-widest text-text-muted">
            No hay partidas registradas.
          </p>
        ))}
    </div>
  );
}

function RoundsList({
  match,
  onBack,
  onSelect,
}: {
  match: DataRecord;
  onBack: () => void;
  onSelect: (round: DataRecord) => void;
}) {
  const [rounds, setRounds] = useState<DataRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const matchId = recordId(match);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setRounds(await fetchRounds(matchId));
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <ExplorerHeader
        eyebrow={`Partida #${matchId || "—"}`}
        title="Rondas"
        onBack={onBack}
        onRefresh={load}
        refreshing={status === "loading"}
      />

      <div className="mb-8">
        <RecordCard record={match} title="Detalle de la partida" />
      </div>

      {status === "loading" && <LoadingPanel label="Cargando rondas" />}
      {status === "error" && <ErrorPanel title="No se pudieron cargar las rondas" message={errorMessage} />}
      {status === "ready" &&
        (rounds.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {rounds.map((round) => (
              <RecordRow key={String(recordId(round))} record={round} onClick={() => onSelect(round)} />
            ))}
          </div>
        ) : (
          <p className="font-mono text-center text-sm font-semibold uppercase tracking-widest text-text-muted">
            Esta partida no tiene rondas registradas.
          </p>
        ))}
    </div>
  );
}

function PlayersList({
  match,
  round,
  onBack,
}: {
  match: DataRecord;
  round: DataRecord;
  onBack: () => void;
}) {
  const [players, setPlayers] = useState<DataRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const roundId = recordId(round);
  const matchId = recordId(match);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setPlayers(await fetchRoundPlayers(roundId));
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }, [roundId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <ExplorerHeader
        eyebrow={`Partida #${matchId || "—"} · Ronda #${roundId || "—"}`}
        title="Jugadores"
        onBack={onBack}
        onRefresh={load}
        refreshing={status === "loading"}
      />

      <div className="mb-8">
        <RecordCard record={round} title="Detalle de la ronda" />
      </div>

      {status === "loading" && <LoadingPanel label="Cargando jugadores" />}
      {status === "error" && <ErrorPanel title="No se pudieron cargar los jugadores" message={errorMessage} />}
      {status === "ready" &&
        (players.length > 0 ? <RoundRoster players={players} /> : (
          <p className="font-mono text-center text-sm font-semibold uppercase tracking-widest text-text-muted">
            No hay jugadores registrados en esta ronda.
          </p>
        ))}
    </div>
  );
}

function RoundRoster({ players }: { players: DataRecord[] }) {
  const teamKey = detectTeamKey(players);

  if (!teamKey) {
    // Couldn't confidently detect two teams — fall back to a flat list.
    return (
      <div className="flex flex-col gap-4">
        {players.map((player, i) => (
          <RecordCard key={String(recordId(player)) || i} record={player} />
        ))}
      </div>
    );
  }

  const teams = groupByTeam(players, teamKey);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {teams.map(([teamName, members]) => (
        <TeamPanel key={teamName} teamName={teamName} members={members} teamKey={teamKey} />
      ))}
    </div>
  );
}

function TeamPanel({
  teamName,
  members,
  teamKey,
}: {
  teamName: string;
  members: DataRecord[];
  teamKey: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="clip-panel-sm border border-white/10 bg-bg-panel px-5 py-5">
      <p className="font-mono mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent-red">
        {teamName} <span className="text-text-muted">· {members.length}/4</span>
      </p>

      <div className="flex flex-col gap-2">
        {members.map((member, i) => {
          const { title, usedKey } = recordTitle(member);
          const isOpen = expanded === i;

          return (
            <div key={i}>
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="clip-row flex w-full items-center justify-between bg-bg-panel-alt px-4 py-2.5 text-left transition-colors hover:bg-white/10"
              >
                <span className="truncate text-sm font-semibold uppercase tracking-wide text-text-primary">
                  {title}
                </span>
                <span className="font-mono shrink-0 text-text-muted">{isOpen ? "−" : "→"}</span>
              </button>

              {isOpen && (
                <div className="mt-2">
                  <RecordCard
                    record={member}
                    title={title}
                    excludeKeys={usedKey ? [teamKey, usedKey] : [teamKey]}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
