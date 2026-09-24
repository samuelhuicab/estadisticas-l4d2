import { formatNumber } from "./format";

/** A row from an endpoint whose exact shape isn't documented — render whatever keys come back. */
export type DataRecord = Record<string, string | number | boolean | null>;

export function humanizeKey(key: string): string {
  return key.replace(/_/g, " ").replace(/danio/gi, "daño");
}

export function formatValue(value: DataRecord[string]): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "number") return formatNumber(value);

  // Some endpoints send numeric values as strings (e.g. "4821") — format those too.
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return formatNumber(Number(value));
  }

  return String(value);
}

const TEAM_KEY_CANDIDATES = ["equipo", "team", "bando", "side", "rol_equipo", "equipo_nombre"];

/**
 * L4D2 versus rounds always split players into two teams (survivors/infected,
 * max 4 each). Finds whichever field encodes that — by common name first,
 * falling back to any field with exactly two distinct values across the roster.
 */
export function detectTeamKey(records: DataRecord[]): string | null {
  if (records.length === 0) return null;

  for (const key of TEAM_KEY_CANDIDATES) {
    if (records.every((r) => key in r && r[key] !== null && r[key] !== "")) return key;
  }

  const keys = Object.keys(records[0]);
  for (const key of keys) {
    if (key.toLowerCase() === "id") continue;
    const values = new Set(records.map((r) => String(r[key])));
    if (values.size === 2) return key;
  }

  return null;
}

export function groupByTeam(records: DataRecord[], teamKey: string): [string, DataRecord[]][] {
  const groups = new Map<string, DataRecord[]>();
  for (const record of records) {
    const teamValue = String(record[teamKey] ?? "—");
    const bucket = groups.get(teamValue);
    if (bucket) bucket.push(record);
    else groups.set(teamValue, [record]);
  }
  return [...groups.entries()];
}
