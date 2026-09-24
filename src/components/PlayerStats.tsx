import { useEffect, useState } from "react";
import { fetchPlayerStats } from "../lib/api";
import { formatNumber } from "../lib/format";
import { humanizeKey, formatValue } from "../lib/adaptive";
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

function isDuplicateName(value: PlayerStatsData[string], alias: string): boolean {
  if (typeof value !== "string") return false;
  return value.trim().toLowerCase() === alias.trim().toLowerCase();
}

interface PlayerStatsScreenProps {
  player: PlayerPosition;
  allPlayers: PlayerPosition[];
  onBack: () => void;
}

export function PlayerStatsScreen({ player, allPlayers, onBack }: PlayerStatsScreenProps) {
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

  const leaderPoints = allPlayers[0]?.total_points ?? player.total_points;
  const pctOfLeader = leaderPoints > 0 ? Math.round((player.total_points / leaderPoints) * 100) : 100;
  const ahead = allPlayers.find((p) => p.rank_num === player.rank_num - 1);
  const behind = allPlayers.find((p) => p.rank_num === player.rank_num + 1);

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
        <button
          onClick={onBack}
          className="font-mono clip-tag mb-8 inline-flex items-center gap-2 border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
        >
          ← Volver al ranking
        </button>

        <section className="relative mb-8 flex flex-col gap-6 overflow-hidden sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono mb-1 text-xs font-semibold uppercase tracking-[0.35em] text-accent-red">
              Perfil del jugador
            </p>
            <h2
              className={`font-display text-6xl font-bold leading-none md:text-8xl ${
                player.rank_num === 1
                  ? "text-accent-gold"
                  : player.rank_num === 2
                    ? "text-accent-silver"
                    : player.rank_num === 3
                      ? "text-accent-bronze"
                      : "text-white/20"
              }`}
            >
              {String(player.rank_num).padStart(2, "0")}
            </h2>
            <h1 className="font-display truncate text-4xl font-extrabold italic uppercase leading-none tracking-tight text-text-primary md:text-5xl">
              {player.last_known_alias}
            </h1>
            <p className="font-mono mt-2 text-xs text-text-muted">
              STEAM · {player.steam_id ?? "sin steam id"}
            </p>
          </div>

          <PlayerAvatar
            name={player.last_known_alias}
            avatarUrl={player.avatar_url}
            accent={accentForRank(player.rank_num)}
            size="lg"
            shape="square"
          />
        </section>

        <section className="mb-10 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">
          <KpiTile
            label="Posición"
            value={`P${player.rank_num}`}
            hint={`de ${allPlayers.length || 1} jugadores`}
            accent="text-accent-gold"
          />
          <KpiTile
            label="Puntos"
            value={formatNumber(player.total_points)}
            hint={`${pctOfLeader}% del líder`}
          />
          <KpiTile
            label="Intervalo · Adelante"
            value={ahead ? `+${formatNumber(ahead.total_points - player.total_points)}` : "—"}
            hint={ahead ? `P${ahead.rank_num} ${ahead.last_known_alias}` : "Lidera el campeonato"}
          />
          <KpiTile
            label="Intervalo · Atrás"
            value={behind ? `+${formatNumber(player.total_points - behind.total_points)}` : "—"}
            hint={behind ? `P${behind.rank_num} ${behind.last_known_alias}` : "Último lugar"}
          />
        </section>

        {status === "loading" && <LoadingPanel label="Cargando estadísticas" />}
        {status === "error" && (
          <ErrorPanel title="No se pudieron cargar las estadísticas" message={errorMessage} />
        )}

        {status === "ready" &&
          (statEntries.length > 0 ? (
            <StatsBreakdown entries={statEntries} />
          ) : (
            <p className="font-mono text-center text-sm font-semibold uppercase tracking-widest text-text-muted">
              No hay estadísticas adicionales disponibles.
            </p>
          ))}
      </div>
    </main>
  );
}

function KpiTile({
  label,
  value,
  hint,
  accent = "text-text-primary",
}: {
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <div className="bg-bg-panel px-5 py-5">
      <p className="font-mono mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-text-muted">
        {label}
      </p>
      <p className={`font-display text-3xl font-bold leading-none ${accent}`}>{value}</p>
      <p className="mt-1.5 truncate text-xs text-text-muted">{hint}</p>
    </div>
  );
}

function StatsBreakdown({ entries }: { entries: [string, PlayerStatsData[string]][] }) {
  const HERO_COUNT = Math.min(3, entries.length);
  const heroEntries = entries.slice(0, HERO_COUNT);
  const restEntries = entries.slice(HERO_COUNT);

  const leftColumn = restEntries.filter((_, i) => i % 2 === 0);
  const rightColumn = restEntries.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex flex-col gap-10">
      {heroEntries.length > 0 && (
        <section>
          <h2 className="font-display mb-4 text-3xl font-extrabold italic uppercase leading-none text-text-primary">
            Resumen
          </h2>
          <div
            className={`grid grid-cols-1 gap-x-8 ${
              heroEntries.length === 3
                ? "sm:grid-cols-3"
                : heroEntries.length === 2
                  ? "sm:grid-cols-2"
                  : ""
            }`}
          >
            {heroEntries.map(([key, value], i) => (
              <HeroStat key={key} label={humanizeKey(key)} value={formatValue(value)} accented={i === 0} />
            ))}
          </div>
        </section>
      )}

      {restEntries.length > 0 && (
        <section>
          <h2 className="font-display mb-2 text-3xl font-extrabold italic uppercase leading-none text-text-primary">
            Telemetría
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-14">
            <StatList entries={leftColumn} />
            <StatList entries={rightColumn} />
          </div>
        </section>
      )}
    </div>
  );
}

function HeroStat({ label, value, accented }: { label: string; value: string; accented: boolean }) {
  return (
    <div className={`flex flex-col gap-2.5 border-t-[3px] py-5 ${accented ? "border-accent-red" : "border-white/15"}`}>
      <span className="font-display truncate text-6xl font-bold leading-none tabular-nums text-text-primary">
        {value}
      </span>
      <span className="font-mono truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-text-muted">
        {label}
      </span>
    </div>
  );
}

function StatList({ entries }: { entries: [string, PlayerStatsData[string]][] }) {
  if (entries.length === 0) return null;

  return (
    <div>
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-baseline justify-between gap-6 border-b border-white/5 py-4">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            {humanizeKey(key)}
          </span>
          <span className="font-display shrink-0 text-2xl font-bold tabular-nums text-text-primary">
            {formatValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
}
