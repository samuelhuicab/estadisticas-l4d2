import { TitleBar } from "./components/TitleBar";
import { Leaderboard } from "./components/Leaderboard";

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <TitleBar />
      <div className="flex-1 overflow-y-auto">
        <Leaderboard />
      </div>
    </div>
  );
}

export default App;
