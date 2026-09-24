import { useState } from "react";
import { TitleBar } from "./components/TitleBar";
import { UpdateBanner } from "./components/UpdateBanner";
import { TabNav, type AppTab } from "./components/TabNav";
import { Leaderboard } from "./components/Leaderboard";
import { PlayerStatsScreen } from "./components/PlayerStats";
import { MatchesExplorer } from "./components/MatchesExplorer";
import type { PlayerPosition } from "./types";

interface Selection {
  player: PlayerPosition;
  allPlayers: PlayerPosition[];
}

function App() {
  const [tab, setTab] = useState<AppTab>("ranking");
  const [selection, setSelection] = useState<Selection | null>(null);

  function changeTab(next: AppTab) {
    setSelection(null);
    setTab(next);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <TitleBar />
      <TabNav active={tab} onChange={changeTab} />
      <UpdateBanner />
      <div className="flex-1 overflow-y-auto">
        {tab === "ranking" ? (
          selection ? (
            <PlayerStatsScreen
              player={selection.player}
              allPlayers={selection.allPlayers}
              onBack={() => setSelection(null)}
            />
          ) : (
            <Leaderboard
              onSelectPlayer={(player, allPlayers) => setSelection({ player, allPlayers })}
            />
          )
        ) : (
          <MatchesExplorer />
        )}
      </div>
    </div>
  );
}

export default App;
