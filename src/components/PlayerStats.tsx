import { useEffect, useState } from "react";
import { fetchPlayerStats } from "../lib/api";
import { formatNumber } from "../lib/format";
import { PlayerAvatar } from "./PlayerAvatar";
import { LoadingPanel, ErrorPanel } from "./StatusPanels";
import type { PlayerPosition, PlayerStats as PlayerStatsData } from "../types";

const EXCLUDED_KEYS = new Set([
  "avatar_url",
  "last_known_alias",
  "rank_num",
  "total_points",
  "steam_id",
  "nombre",
  "alias",
  "name",
  "player_name",
  "username",
  "jugador",
]);

function accentForRank(rank: number): "gold" | "silver" | "bronze" | "neutral" {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return "neutral";
}

function humanizeKey(key: string): string {
  return key.replace(/_/g, " ").replace(/danio/gi, "daño");
}

function isDuplicateName(value: PlayerStatsData[string], alias: string): boolean {
  if (typeof value !== "string") return false;
  return value.trim().toLowerCase() === alias.trim().toLowerCase();
}

function formatValue(value: PlayerStatsData[string]): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "number") return formatNumber(value);

  // The API sometimes sends numeric stats as strings (e.g. "4821") — format those too.
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return formatNumber(Number(value));
  }

  return String(value);
}

interface PlayerStatsScreenProps {
  player: PlayerPosition;
  onBack: () => void;
}

export function PlayerStatsScreen({ player, onBack }: PlayerStatsScreenProps) {
  const [stats, setStats] = useState<PlayerStatsData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!player.steam_id) {
      setStatus("error");
      setErrorMessage("Este jugador no tiene un Steam ID asociado.");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    fetchPlayerStats(player.steam_id)
      .then((data) => {
        if (cancelled) return;
        setStats(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [player.steam_id]);

  const statEntries = stats
    ? Object.entries(stats).filter(
        ([key, value]) =>
          !EXCLUDED_KEYS.has(key.toLowerCase()) && !isDuplicateName(value, player.last_known_alias),
      )
    : [];

  return (
    <main className="relative min-h-full overflow-hidden bg-bg-base px-8 py-8 text-text-primary md:px-14 md:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(228,0,43,0.14),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[420px] -skew-x-12 bg-gradient-to-b from-accent-red/10 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <button
          onClick={onBack}
          className="clip-tag mb-8 inline-flex items-center gap-2 border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
        >
          ← Volver al ranking
        </button>

        <section className="clip-panel relative mb-10 flex flex-col gap-6 overflow-hidden border border-white/10 bg-bg-panel p-8 sm:flex-row sm:items-center">
          <span
            aria-hidden
            className="font-display pointer-events-none absolute -right-4 -top-10 select-none text-[11rem] font-black leading-none text-white/5"
          >
            {player.rank_num}
          </span>

          <PlayerAvatar
            name={player.last_known_alias}
            avatarUrl={player.avatar_url}
            accent={accentForRank(player.rank_num)}
            size="lg"
          />

          <div className="relative z-10 min-w-0">
            <p className="mb-1 truncate text-[11px] font-bold uppercase tracking-[0.35em] text-accent-red">
              #{player.rank_num} · {player.steam_id ?? "sin steam id"}
            </p>
            <h1 className="font-display truncate text-4xl font-black uppercase italic leading-none tracking-tight md:text-5xl">
              {player.last_known_alias}
            </h1>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-black leading-none text-text-primary">
                {formatNumber(player.total_points)}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted">
                pts totales
              </span>
            </div>
          </div>
        </section>

        {status === "loading" && <LoadingPanel label="Cargando estadísticas" />}
        {status === "error" && (
          <ErrorPanel title="No se pudieron cargar las estadísticas" message={errorMessage} />
        )}

        {status === "ready" &&
          (statEntries.length > 0 ? (
            <StatsBreakdown entries={statEntries} />
          ) : (
            <p className="text-center text-sm font-bold uppercase tracking-widest text-text-muted">
              No hay estadísticas adicionales disponibles.
            </p>
          ))}
      </div>
    </main>
  );
}

function StatsBreakdown({ entries }: { entries: [string, PlayerStatsData[string]][] }) {
  const HERO_COUNT = Math.min(3, entries.length);
  const heroEntries = entries.slice(0, HERO_COUNT);
  const restEntries = entries.slice(HERO_COUNT);

  const leftColumn = restEntries.filter((_, i) => i % 2 === 0);
  const rightColumn = restEntries.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex flex-col gap-8">
      {heroEntries.length > 0 && (
        <section
          className={`grid grid-cols-1 gap-4 ${
            heroEntries.length === 3
              ? "sm:grid-cols-3"
              : heroEntries.length === 2
                ? "sm:grid-cols-2"
                : ""
          }`}
        >
          {heroEntries.map(([key, value]) => (
            <HeroStat key={key} label={humanizeKey(key)} value={formatValue(value)} />
          ))}
        </section>
      )}

      {restEntries.length > 0 && (
        <section className="clip-panel border border-white/10 bg-bg-panel px-6 py-2 sm:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
            <StatList entries={leftColumn} />
            <StatList entries={rightColumn} />
          </div>
        </section>
      )}
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="clip-panel-sm relative overflow-hidden border border-white/10 bg-bg-panel px-6 py-6">
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-accent-red" />
      <p className="mb-2 truncate text-xs font-bold uppercase leading-snug tracking-[0.25em] text-text-muted">
        {label}
      </p>
      <p className="font-display truncate text-5xl font-black uppercase leading-none text-text-primary">
        {value}
      </p>
    </div>
  );
}

function StatList({ entries }: { entries: [string, PlayerStatsData[string]][] }) {
  if (entries.length === 0) return null;

  return (
    <div className="divide-y divide-white/10">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-baseline justify-between gap-6 py-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
            {humanizeKey(key)}
          </span>
          <span className="font-display shrink-0 text-2xl font-black tabular-nums text-text-primary">
            {formatValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
}
