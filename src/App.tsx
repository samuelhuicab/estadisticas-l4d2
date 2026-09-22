import { useCallback, useEffect, useState } from "react";
import { fetchPositions } from "./lib/api";
import { PodiumCard } from "./components/PodiumCard";
import { RankRow } from "./components/RankRow";
import type { PlayerPosition } from "./types";

function App() {
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
    <main className="min-h-screen bg-[#0f1115] bg-[radial-gradient(circle_at_50%_-10%,rgba(255,70,85,0.12),transparent_55%)] px-6 py-10 text-white md:px-12">
      <header className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#ff4655]">
            Left 4 Dead 2
          </p>
          <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-wide md:text-6xl">
            Ranking de Jugadores
          </h1>
        </div>
        <button
          onClick={loadPositions}
          disabled={status === "loading"}
          className="clip-tag border border-[#ff4655]/50 bg-[#ff4655]/10 px-5 py-2 text-sm font-bold uppercase tracking-widest text-[#ff4655] transition-colors hover:bg-[#ff4655]/20 disabled:opacity-40"
        >
          {status === "loading" ? "Actualizando..." : "Actualizar"}
        </button>
      </header>

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/50">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#ff4655]" />
          <p className="text-sm font-semibold uppercase tracking-widest">
            Cargando posiciones...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="clip-card mx-auto max-w-xl border border-[#ff4655]/40 bg-[#ff4655]/10 p-6 text-center">
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-[#ff4655]">
            No se pudo cargar el ranking
          </p>
          <p className="text-sm text-white/70">{errorMessage}</p>
        </div>
      )}

      {status === "ready" && (
        <div className="mx-auto max-w-5xl">
          {top3.length > 0 && (
            <section className="mb-12 grid grid-cols-1 items-end gap-4 md:grid-cols-3">
              {top3.map((player) => (
                <PodiumCard key={player.rank_num} player={player} />
              ))}
            </section>
          )}

          {rest.length > 0 && (
            <section className="flex flex-col gap-2.5">
              {rest.map((player) => (
                <RankRow key={player.rank_num} player={player} maxPoints={maxPoints} />
              ))}
            </section>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
