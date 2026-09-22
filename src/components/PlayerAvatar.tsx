import { useState } from "react";

type Accent = "gold" | "silver" | "bronze" | "neutral";

const ACCENT_STYLES: Record<Accent, { ring: string; plate: string; text: string }> = {
  gold: { ring: "ring-accent-gold", plate: "bg-accent-gold/15", text: "text-accent-gold" },
  silver: { ring: "ring-accent-silver", plate: "bg-accent-silver/15", text: "text-accent-silver" },
  bronze: { ring: "ring-accent-bronze", plate: "bg-accent-bronze/15", text: "text-accent-bronze" },
  neutral: { ring: "ring-white/15", plate: "bg-white/5", text: "text-text-muted" },
};

interface PlayerAvatarProps {
  name: string;
  avatarUrl?: string;
  accent: Accent;
  size: "lg" | "md" | "sm";
}

const SIZE_CLASSES: Record<PlayerAvatarProps["size"], { box: string; text: string; plate: string }> = {
  lg: { box: "h-24 w-24 md:h-28 md:w-28", text: "text-4xl", plate: "-inset-2" },
  md: { box: "h-16 w-16", text: "text-2xl", plate: "-inset-1.5" },
  sm: { box: "h-11 w-11", text: "text-base", plate: "-inset-1" },
};

export function PlayerAvatar({ name, avatarUrl, accent, size }: PlayerAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(avatarUrl) && !failed;
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const accentStyle = ACCENT_STYLES[accent];
  const sizeStyle = SIZE_CLASSES[size];

  return (
    <div className={`relative shrink-0 ${sizeStyle.box}`}>
      <div
        aria-hidden
        className={`clip-tag absolute ${sizeStyle.plate} ${accentStyle.plate}`}
      />
      <div
        className={`relative h-full w-full overflow-hidden rounded-full bg-bg-panel-alt ring-2 ${accentStyle.ring}`}
      >
        {showImage ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className={`font-display flex h-full w-full items-center justify-center font-black ${sizeStyle.text} ${accentStyle.text}`}
          >
            {initial}
          </div>
        )}
      </div>
    </div>
  );
}
