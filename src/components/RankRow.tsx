import type { PlayerPosition } from "../types";
import { formatNumber } from "../lib/format";
import { PlayerAvatar } from "./PlayerAvatar";

interface RankRowProps {
  player: PlayerPosition;
  maxPoints: number;
  onSelect: (player: PlayerPosition) => void;
}

export function RankRow({ player, maxPoints, onSelect }: RankRowProps) {
  const fillPct = maxPoints > 0 ? Math.max(4, (player.total_points / maxPoints) * 100) : 4;
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
      className={`clip-row group relative flex items-center gap-3 overflow-hidden border border-white/5 bg-bg-panel px-4 py-3 transition-colors hover:bg-bg-panel-alt ${clickable ? "cursor-pointer" : ""}`}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1 bg-accent-red/70 transition-colors group-hover:bg-accent-red"
      />

      <span className="font-display w-7 shrink-0 pl-2 text-xl font-black text-text-muted group-hover:text-accent-red">
        {player.rank_num}
      </span>

      <PlayerAvatar
        name={player.last_known_alias}
        avatarUrl={player.avatar_url}
        accent="neutral"
        size="sm"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold uppercase tracking-wide text-text-primary">
          {player.last_known_alias}
        </p>
        <div className="mt-1.5 h-[3px] w-full overflow-hidden bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-accent-red to-accent-red-2"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="font-display text-2xl font-extrabold leading-none text-text-primary">
          {formatNumber(player.total_points)}
        </span>
        <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted">
          pts
        </span>
      </div>
    </div>
  );
}
