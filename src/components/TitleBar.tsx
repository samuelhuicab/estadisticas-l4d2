import { useEffect, useState } from "react";
import { getCurrentWindow, type Window as TauriWindow } from "@tauri-apps/api/window";

function getAppWindow(): TauriWindow | null {
  if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) {
    return null;
  }
  try {
    return getCurrentWindow();
  } catch {
    return null;
  }
}

export function TitleBar() {
  const [appWindow] = useState<TauriWindow | null>(getAppWindow);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!appWindow) return;

    let unlisten: (() => void) | undefined;
    appWindow.isMaximized().then(setIsMaximized);
    appWindow
      .onResized(() => {
        appWindow.isMaximized().then(setIsMaximized);
      })
      .then((fn) => {
        unlisten = fn;
      });

    return () => unlisten?.();
  }, [appWindow]);

  return (
    <div
      data-tauri-drag-region
      onDoubleClick={() => appWindow?.toggleMaximize()}
      className="flex h-9 shrink-0 select-none items-stretch justify-between border-b border-white/10 bg-bg-panel"
    >
      <div
        data-tauri-drag-region
        className="font-mono flex flex-1 items-center gap-2 pl-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-text-muted"
      >
        <span className="h-2 w-2 bg-accent-red" aria-hidden />
        <span className="font-display italic">L4D2 · Ranking</span>
      </div>

      <div className="flex items-stretch">
        <TitleBarButton label="Minimizar" onClick={() => appWindow?.minimize()}>
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
            <rect x="0" y="4.5" width="10" height="1" fill="currentColor" />
          </svg>
        </TitleBarButton>

        <TitleBarButton
          label={isMaximized ? "Restaurar" : "Maximizar"}
          onClick={() => appWindow?.toggleMaximize()}
        >
          {isMaximized ? (
            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
              <rect x="2.5" y="0" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect
                x="0"
                y="2.5"
                width="7"
                height="7"
                fill="var(--color-bg-panel)"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
              <rect x="0" y="0" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </TitleBarButton>

        <TitleBarButton label="Cerrar" danger onClick={() => appWindow?.close()}>
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" />
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </TitleBarButton>
      </div>
    </div>
  );
}

interface TitleBarButtonProps {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}

function TitleBarButton({ label, onClick, danger, children }: TitleBarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex w-12 items-center justify-center text-text-muted transition-colors ${
        danger ? "hover:bg-accent-red hover:text-white" : "hover:bg-white/10 hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}
