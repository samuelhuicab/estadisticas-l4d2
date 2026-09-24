import { useCallback, useEffect, useState } from "react";
import { fetchPositions } from "../lib/api";
import { PodiumCard } from "./PodiumCard";
import { RankRow } from "./RankRow";
import { LoadingPanel, ErrorPanel } from "./StatusPanels";
import type { PlayerPosition } from "../types";

interface LeaderboardProps {
  onSelectPlayer: (player: PlayerPosition, allPlayers: PlayerPosition[]) => void;
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
  const leaderPoints = players[0]?.total_points ?? 0;
  const selectPlayer = (player: PlayerPosition) => onSelectPlayer(player, players);

  return (
    <main className="relative min-h-full overflow-hidden bg-bg-base px-8 py-8 text-text-primary md:px-14 md:py-10">
      {/* background telemetry accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(242,90,42,0.14),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[420px] -skew-x-12 bg-gradient-to-b from-accent-red/10 to-transparent"
      />

      <div className="relative z-10">
        <header className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-accent-red">
              Temporada 2026 · Jugadores
            </p>
            <h1 className="font-display text-5xl font-extrabold uppercase italic leading-none tracking-tight md:text-7xl">
              Ranking
            </h1>
          </div>
          <button
            onClick={loadPositions}
            disabled={status === "loading"}
            className="font-mono clip-tag border border-accent-red/50 bg-accent-red/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.3em] text-accent-red transition-colors hover:bg-accent-red/20 disabled:opacity-40"
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
                  <PodiumCard
                    key={player.rank_num}
                    player={player}
                    leaderPoints={leaderPoints}
                    onSelect={selectPlayer}
                  />
                ))}
              </section>
            )}

            {rest.length > 0 && (
              <section>
                <div className="font-mono hidden grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_4.5rem_4.5rem] gap-4 border-b border-white/10 px-2 pb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-text-muted sm:grid">
                  <span>Pos</span>
                  <span>Jugador</span>
                  <span>Vs líder</span>
                  <span className="text-right">Gap</span>
                  <span className="text-right">Pts</span>
                </div>
                {rest.map((player) => (
                  <RankRow
                    key={player.rank_num}
                    player={player}
                    leaderPoints={leaderPoints}
                    onSelect={selectPlayer}
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
