export type AppTab = "ranking" | "matches";

const TABS: { id: AppTab; label: string }[] = [
  { id: "ranking", label: "Ranking" },
  { id: "matches", label: "Partidas" },
];

interface TabNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="font-mono flex h-10 shrink-0 items-stretch gap-6 border-b border-white/10 bg-bg-panel px-6 text-xs font-semibold uppercase tracking-[0.25em]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`border-b-2 transition-colors ${
            active === tab.id
              ? "border-accent-red text-text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
