import { useState } from "react";
import { TitleBar } from "./components/TitleBar";
import { UpdateBanner } from "./components/UpdateBanner";
import { Leaderboard } from "./components/Leaderboard";
import { PlayerStatsScreen } from "./components/PlayerStats";
import type { PlayerPosition } from "./types";

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerPosition | null>(null);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <TitleBar />
      <UpdateBanner />
      <div className="flex-1 overflow-y-auto">
        {selectedPlayer ? (
          <PlayerStatsScreen player={selectedPlayer} onBack={() => setSelectedPlayer(null)} />
        ) : (
          <Leaderboard onSelectPlayer={setSelectedPlayer} />
        )}
      </div>
    </div>
  );
}

export default App;
