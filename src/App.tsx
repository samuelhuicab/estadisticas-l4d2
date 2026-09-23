import { useState } from "react";
import { TitleBar } from "./components/TitleBar";
import { UpdateBanner } from "./components/UpdateBanner";
import { Leaderboard } from "./components/Leaderboard";
import { PlayerStatsScreen } from "./components/PlayerStats";
import type { PlayerPosition } from "./types";

interface Selection {
  player: PlayerPosition;
  allPlayers: PlayerPosition[];
}

function App() {
  const [selection, setSelection] = useState<Selection | null>(null);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <TitleBar />
      <UpdateBanner />
      <div className="flex-1 overflow-y-auto">
        {selection ? (
          <PlayerStatsScreen
            player={selection.player}
            allPlayers={selection.allPlayers}
            onBack={() => setSelection(null)}
          />
        ) : (
          <Leaderboard
            onSelectPlayer={(player, allPlayers) => setSelection({ player, allPlayers })}
          />
        )}
      </div>
    </div>
  );
}

export default App;
