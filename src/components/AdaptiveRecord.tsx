import { humanizeKey, formatValue, type DataRecord } from "../lib/adaptive";

export function recordId(record: DataRecord): string | number {
  const id = record.id ?? record.ID ?? record.Id;
  return (id as string | number) ?? "";
}

const NAME_LIKE_KEYS = ["alias", "last_known_alias", "nombre", "name", "jugador"];

// Fields that are useful for identification internally but not worth showing on screen.
const ALWAYS_HIDDEN_KEYS = new Set(["id", "steam_id"]);

/**
 * Picks a title for a record: a human-readable name if the record has one,
 * otherwise its `id`. Returns the key that was used (if any), so it can be
 * hidden from the detail grid instead of repeating it.
 */
export function recordTitle(record: DataRecord): { title: string; usedKey?: string } {
  for (const key of NAME_LIKE_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") return { title: value, usedKey: key };
  }

  const id = recordId(record);
  if (id) return { title: `#${id}` };

  return { title: "—" };
}

function previewEntries(record: DataRecord, limit = 4): [string, DataRecord[string]][] {
  return Object.entries(record)
    .filter(([key]) => !ALWAYS_HIDDEN_KEYS.has(key.toLowerCase()))
    .slice(0, limit);
}

interface RecordRowProps {
  record: DataRecord;
  onClick?: () => void;
}

/** A compact, single-line preview of a record's first few fields — for lists. */
export function RecordRow({ record, onClick }: RecordRowProps) {
  const clickable = Boolean(onClick);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick?.();
            }
          : undefined
      }
      className={`clip-row group flex flex-col gap-2 border border-white/5 bg-bg-panel px-4 py-3.5 transition-colors sm:flex-row sm:items-center sm:gap-6 ${
        clickable ? "cursor-pointer hover:bg-bg-panel-alt" : ""
      }`}
    >
      <span className="font-display shrink-0 text-lg font-bold text-text-muted group-hover:text-accent-red">
        #{recordId(record) || "—"}
      </span>

      <div className="flex min-w-0 flex-1 flex-wrap gap-x-6 gap-y-1">
        {previewEntries(record).map(([key, value]) => (
          <div key={key} className="min-w-0">
            <span className="font-mono mr-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              {humanizeKey(key)}
            </span>
            <span className="text-sm font-semibold text-text-primary">{formatValue(value)}</span>
          </div>
        ))}
      </div>

      {clickable && <span className="font-mono shrink-0 text-text-muted group-hover:text-accent-red">→</span>}
    </div>
  );
}

interface RecordCardProps {
  record: DataRecord;
  title?: string;
  excludeKeys?: string[];
}

/** A full key/value breakdown of a single record — for detail views. */
export function RecordCard({ record, title, excludeKeys = [] }: RecordCardProps) {
  const resolved = recordTitle(record);
  const hiddenKey = title ? undefined : resolved.usedKey;
  const entries = Object.entries(record).filter(
    ([key]) =>
      !ALWAYS_HIDDEN_KEYS.has(key.toLowerCase()) && key !== hiddenKey && !excludeKeys.includes(key),
  );

  return (
    <div className="clip-panel-sm border border-white/10 bg-bg-panel px-6 py-5">
      <p className="font-mono mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-red">
        {title ?? resolved.title}
      </p>
      {entries.length === 0 ? (
        <p className="text-sm text-text-muted">Sin datos adicionales.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-baseline justify-between gap-6 border-b border-white/5 py-2.5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                {humanizeKey(key)}
              </span>
              <span className="font-display shrink-0 text-lg font-bold tabular-nums text-text-primary">
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
