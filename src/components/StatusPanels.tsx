export function LoadingPanel({ label = "Cargando telemetría" }: { label?: string }) {
  return (
    <div className="clip-panel relative mx-auto max-w-md overflow-hidden border border-white/10 bg-bg-panel px-10 py-12 text-center">
      <div className="relative mx-auto mb-5 h-1.5 w-40 overflow-hidden bg-white/5">
        <div className="animate-scan absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent-red to-transparent" />
      </div>
      <p className="font-display text-sm font-bold uppercase tracking-[0.4em] text-text-muted">
        {label}
      </p>
    </div>
  );
}

export function ErrorPanel({ title = "Ocurrió un error", message }: { title?: string; message: string }) {
  return (
    <div className="clip-panel mx-auto max-w-xl border border-accent-red/40 bg-accent-red/10 px-8 py-7 text-center">
      <p className="font-display mb-2 text-sm font-black uppercase tracking-[0.35em] text-accent-red">
        ⚠ {title}
      </p>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
