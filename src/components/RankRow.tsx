import type { PlayerPosition } from "../types";
import { formatNumber } from "../lib/format";
import { PlayerAvatar } from "./PlayerAvatar";

interface RankRowProps {
  player: PlayerPosition;
  leaderPoints: number;
  onSelect: (player: PlayerPosition) => void;
}

export function RankRow({ player, leaderPoints, onSelect }: RankRowProps) {
  const pct = leaderPoints > 0 ? Math.max(3, (player.total_points / leaderPoints) * 100) : 100;
  const gap = player.total_points - leaderPoints;
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
      className={`group grid grid-cols-[2.5rem_minmax(0,1.4fr)_minmax(0,1fr)_4.5rem_4.5rem] items-center gap-4 border-b border-white/5 px-2 py-3 transition-colors hover:bg-bg-panel-alt ${clickable ? "cursor-pointer" : ""}`}
    >
      <span className="font-display text-lg font-bold text-text-muted group-hover:text-accent-red">
        {player.rank_num}
      </span>

      <div className="flex min-w-0 items-center gap-3">
        <PlayerAvatar name={player.last_known_alias} avatarUrl={player.avatar_url} accent="neutral" size="sm" />
        <span className="truncate text-sm font-semibold uppercase tracking-wide text-text-primary">
          {player.last_known_alias}
        </span>
      </div>

      <div className="hidden h-[3px] w-full overflow-hidden rounded-full bg-white/10 sm:block">
        <div className="h-full bg-accent-red/70" style={{ width: `${pct}%` }} />
      </div>

      <span className="font-mono text-right text-xs font-semibold text-text-muted">
        {formatNumber(gap)}
      </span>

      <span className="font-display text-right text-xl font-bold text-text-primary">
        {formatNumber(player.total_points)}
      </span>
    </div>
  );
}
