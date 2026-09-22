import type { PlayerPosition } from "../types";

interface RankRowProps {
  player: PlayerPosition;
  maxPoints: number;
}

export function RankRow({ player, maxPoints }: RankRowProps) {
  const fillPct = maxPoints > 0 ? Math.max(4, (player.total_points / maxPoints) * 100) : 4;

  return (
    <div className="clip-card group flex items-center gap-4 border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]">
      <span className="font-display w-10 shrink-0 text-2xl font-bold text-white/35 group-hover:text-[#ff4655]">
        {player.rank_num}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold uppercase tracking-wide text-white/90">
          {player.last_known_alias}
        </p>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff4655] to-[#ff8a94]"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="font-display text-2xl font-bold text-white">
          {player.total_points}
        </span>
        <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">
          pts
        </span>
      </div>
    </div>
  );
}
