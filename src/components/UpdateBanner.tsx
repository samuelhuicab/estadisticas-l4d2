import { useEffect, useState } from "react";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

type UpdateState =
  | { phase: "idle" }
  | { phase: "available"; update: Update }
  | { phase: "downloading"; progress: number }
  | { phase: "ready" }
  | { phase: "error"; message: string };

function isTauriContext(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function UpdateBanner() {
  const [state, setState] = useState<UpdateState>({ phase: "idle" });

  useEffect(() => {
    if (!isTauriContext()) return;

    check()
      .then((update) => {
        if (update) setState({ phase: "available", update });
      })
      .catch(() => {
        // Silent: a failed update check should never interrupt the app.
      });
  }, []);

  if (state.phase === "idle" || state.phase === "error") return null;

  async function handleInstall() {
    if (state.phase !== "available") return;
    const update = state.update;

    try {
      let downloaded = 0;
      let total = 0;

      await update.downloadAndInstall((event) => {
        if (event.event === "Started") {
          total = event.data.contentLength ?? 0;
          setState({ phase: "downloading", progress: 0 });
        } else if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
          setState({
            phase: "downloading",
            progress: total > 0 ? Math.min(100, Math.round((downloaded / total) * 100)) : 0,
          });
        } else if (event.event === "Finished") {
          setState({ phase: "ready" });
        }
      });

      await relaunch();
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof Error ? err.message : "Error desconocido",
      });
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-center gap-4 border-b border-accent-gold/30 bg-accent-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-gold">
      {state.phase === "available" && (
        <>
          <span>Actualización {state.update.version} disponible</span>
          <button
            onClick={handleInstall}
            className="clip-tag border border-accent-gold/60 bg-accent-gold/15 px-4 py-1 transition-colors hover:bg-accent-gold/25"
          >
            Instalar y reiniciar
          </button>
        </>
      )}
      {state.phase === "downloading" && <span>Descargando actualización… {state.progress}%</span>}
      {state.phase === "ready" && <span>Reiniciando…</span>}
    </div>
  );
}
