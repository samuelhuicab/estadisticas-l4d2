import { useCallback, useEffect, useState } from "react";
import { fetchPositions } from "../lib/api";
import { PodiumCard } from "./PodiumCard";
import { RankRow } from "./RankRow";
import { LoadingPanel, ErrorPanel } from "./StatusPanels";
import type { PlayerPosition } from "../types";

interface LeaderboardProps {
  onSelectPlayer: (player: PlayerPosition) => void;
}

export function Leaderboard({ onSelectPlayer }: LeaderboardProps) {
  const [players, setPlayers] = useState<PlayerPosition[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadPositions = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await fetchPositions();
      setPlayers(data);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  const top3 = players.filter((p) => p.rank_num <= 3);
  const rest = players.filter((p) => p.rank_num > 3);
  const maxPoints = players[0]?.total_points ?? 0;

  return (
    <main className="relative min-h-full overflow-hidden bg-bg-base px-8 py-8 text-text-primary md:px-14 md:py-10">
      {/* background telemetry accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(228,0,43,0.14),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[420px] -skew-x-12 bg-gradient-to-b from-accent-red/10 to-transparent"
      />

      <div className="relative z-10">
        <header className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.5em] text-accent-red">
              Temporada 2026
            </p>
            <h1 className="font-display text-5xl font-black uppercase italic leading-none tracking-tight md:text-7xl">
              Ranking
            </h1>
          </div>
          <button
            onClick={loadPositions}
            disabled={status === "loading"}
            className="clip-tag border border-accent-red/50 bg-accent-red/10 px-6 py-2.5 text-sm font-bold uppercase tracking-[0.3em] text-accent-red transition-colors hover:bg-accent-red/20 disabled:opacity-40"
          >
            {status === "loading" ? "Actualizando" : "Actualizar"}
          </button>
        </header>

        {status === "loading" && <LoadingPanel />}
        {status === "error" && <ErrorPanel title="No se pudo cargar el ranking" message={errorMessage} />}

        {status === "ready" && (
          <div className="mx-auto max-w-6xl">
            {top3.length > 0 && (
              <section className="mb-14 grid grid-cols-1 items-end gap-5 md:grid-cols-3">
                {top3.map((player) => (
                  <PodiumCard key={player.rank_num} player={player} onSelect={onSelectPlayer} />
                ))}
              </section>
            )}

            {rest.length > 0 && (
              <section className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                {rest.map((player) => (
                  <RankRow
                    key={player.rank_num}
                    player={player}
                    maxPoints={maxPoints}
                    onSelect={onSelectPlayer}
                  />
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
