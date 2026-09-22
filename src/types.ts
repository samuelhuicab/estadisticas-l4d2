export interface PlayerPosition {
  last_known_alias: string;
  rank_num: number;
  total_points: number;
  avatar_url?: string;
  steam_id?: string;
}

/**
 * The shape of `/api/jugador/{steam_id}` isn't documented — treat it as a flat
 * bag of stat values and render whatever keys come back.
 */
export type PlayerStats = Record<string, string | number | boolean | null>;
