import type { PlayerPosition } from "../types";

const PLACE_STYLES = {
  1: {
    order: "md:order-2",
    height: "md:h-[340px]",
    ring: "ring-2 ring-[#ffd166] shadow-[0_0_45px_-5px_rgba(255,209,102,0.55)]",
    badge: "bg-[#ffd166] text-[#1a1a1a]",
    medal: "text-[#ffd166]",
    scale: "md:scale-105",
    label: "CAMPEÓN",
  },
  2: {
    order: "md:order-1",
    height: "md:h-[290px]",
    ring: "ring-1 ring-[#cbd5e1]/70 shadow-[0_0_30px_-8px_rgba(203,213,225,0.35)]",
    badge: "bg-[#cbd5e1] text-[#1a1a1a]",
    medal: "text-[#cbd5e1]",
    scale: "",
    label: "SUBCAMPEÓN",
  },
  3: {
    order: "md:order-3",
    height: "md:h-[260px]",
    ring: "ring-1 ring-[#e0995e]/70 shadow-[0_0_30px_-8px_rgba(224,153,94,0.35)]",
    badge: "bg-[#e0995e] text-[#1a1a1a]",
    medal: "text-[#e0995e]",
    scale: "",
    label: "TERCER LUGAR",
  },
} as const;

interface PodiumCardProps {
  player: PlayerPosition;
}

export function PodiumCard({ player }: PodiumCardProps) {
  const style = PLACE_STYLES[player.rank_num as 1 | 2 | 3];

  return (
    <div
      className={`clip-card relative flex ${style.height} ${style.order} ${style.scale} w-full flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 ${style.ring}`}
    >
      {player.rank_num === 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-glow bg-gradient-to-b from-[#ffd166]/25 to-transparent" />
      )}

      <div className="flex items-start justify-between">
        <span
          className={`font-display clip-tag ${style.badge} px-3 py-1 text-2xl font-bold leading-none`}
        >
          #{player.rank_num}
        </span>
        <span className={`font-display text-4xl font-bold ${style.medal}`}>
          {player.rank_num === 1 ? "★" : player.rank_num === 2 ? "◆" : "▲"}
        </span>
      </div>

      <div className="relative z-10">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
          {style.label}
        </p>
        <h2 className="font-display truncate text-3xl font-semibold uppercase leading-none text-white md:text-4xl">
          {player.last_known_alias}
        </h2>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-display text-5xl font-bold text-[#ff4655] md:text-6xl">
            {player.total_points}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
            pts
          </span>
        </div>
      </div>
    </div>
  );
}
