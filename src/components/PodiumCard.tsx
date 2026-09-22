import type { PlayerPosition } from "../types";
import { formatNumber } from "../lib/format";
import { PlayerAvatar } from "./PlayerAvatar";

const PLACE_CONFIG = {
  1: {
    order: "md:order-2",
    height: "md:h-[380px]",
    lift: "md:-translate-y-5",
    accentVar: "var(--color-accent-gold)",
    accentText: "text-accent-gold",
    accentBg: "bg-accent-gold",
    glow: "shadow-[0_0_70px_-12px_rgba(242,183,5,0.5)]",
    ring: "ring-1 ring-accent-gold/40",
    label: "CAMPEÓN",
    scoreSize: "text-7xl md:text-8xl",
    avatarAccent: "gold",
    avatarSize: "lg",
  },
  2: {
    order: "md:order-1",
    height: "md:h-[320px]",
    lift: "",
    accentVar: "var(--color-accent-silver)",
    accentText: "text-accent-silver",
    accentBg: "bg-accent-silver",
    glow: "shadow-[0_0_45px_-14px_rgba(196,201,212,0.35)]",
    ring: "ring-1 ring-white/10",
    label: "SUBCAMPEÓN",
    scoreSize: "text-6xl md:text-7xl",
    avatarAccent: "silver",
    avatarSize: "md",
  },
  3: {
    order: "md:order-3",
    height: "md:h-[300px]",
    lift: "",
    accentVar: "var(--color-accent-bronze)",
    accentText: "text-accent-bronze",
    accentBg: "bg-accent-bronze",
    glow: "shadow-[0_0_45px_-14px_rgba(201,119,46,0.35)]",
    ring: "ring-1 ring-white/10",
    label: "TERCER LUGAR",
    scoreSize: "text-6xl md:text-7xl",
    avatarAccent: "bronze",
    avatarSize: "md",
  },
} as const satisfies Record<
  1 | 2 | 3,
  {
    order: string;
    height: string;
    lift: string;
    accentVar: string;
    accentText: string;
    accentBg: string;
    glow: string;
    ring: string;
    label: string;
    scoreSize: string;
    avatarAccent: "gold" | "silver" | "bronze";
    avatarSize: "lg" | "md";
  }
>;

interface PodiumCardProps {
  player: PlayerPosition;
  onSelect: (player: PlayerPosition) => void;
}

export function PodiumCard({ player, onSelect }: PodiumCardProps) {
  const cfg = PLACE_CONFIG[player.rank_num as 1 | 2 | 3];
  const clickable = Boolean(player.steam_id);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onSelect(player) : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(player);
            }
          : undefined
      }
      className={`clip-panel relative flex w-full flex-col justify-between overflow-hidden border border-white/10 bg-bg-panel p-6 ${cfg.height} ${cfg.order} ${cfg.lift} ${cfg.glow} ${cfg.ring} ${clickable ? "cursor-pointer transition-colors hover:bg-bg-panel-alt" : ""}`}
    >
      {/* giant watermark rank numeral */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-3 -top-6 select-none text-[9rem] font-black leading-none text-white/5"
      >
        {player.rank_num}
      </span>

      {/* diagonal telemetry stripe */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-0 h-full w-40 -skew-x-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${cfg.accentVar}22 45%, transparent 90%)`,
        }}
      />

      {player.rank_num === 1 && (
        <div
          aria-hidden
          className="animate-glow pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{
            background: `linear-gradient(to bottom, ${cfg.accentVar}33, transparent)`,
          }}
        />
      )}

      <div className="relative z-10 flex items-start justify-between">
        <span
          className={`clip-tag font-display ${cfg.accentBg} px-3.5 py-1.5 text-2xl font-black leading-none text-bg-base`}
        >
          #{player.rank_num}
        </span>
        <PlayerAvatar
          name={player.last_known_alias}
          avatarUrl={player.avatar_url}
          accent={cfg.avatarAccent}
          size={cfg.avatarSize}
        />
      </div>

      <div className="relative z-10">
        <p
          className={`mb-1.5 text-[11px] font-bold uppercase tracking-[0.35em] ${cfg.accentText}`}
        >
          {cfg.label}
        </p>
        <h2 className="font-display truncate text-3xl font-extrabold uppercase leading-[1.05] tracking-wide text-text-primary md:text-4xl">
          {player.last_known_alias}
        </h2>

        <div className="mt-4 flex items-baseline gap-2 border-t border-white/10 pt-3">
          <span
            className={`font-display ${cfg.scoreSize} font-black leading-none text-text-primary`}
          >
            {formatNumber(player.total_points)}
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted">
            pts
          </span>
        </div>
      </div>
    </div>
  );
}
