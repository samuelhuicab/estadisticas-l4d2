import { useState } from "react";

type Accent = "gold" | "silver" | "bronze" | "neutral";

const ACCENT_STYLES: Record<Accent, { ring: string; text: string }> = {
  gold: { ring: "ring-accent-gold", text: "text-accent-gold" },
  silver: { ring: "ring-accent-silver", text: "text-accent-silver" },
  bronze: { ring: "ring-accent-bronze", text: "text-accent-bronze" },
  neutral: { ring: "ring-white/20", text: "text-text-muted" },
};

interface PlayerAvatarProps {
  name: string;
  avatarUrl?: string;
  accent: Accent;
  size: "lg" | "md" | "sm";
  shape?: "circle" | "square";
}

const SIZE_CLASSES: Record<PlayerAvatarProps["size"], { box: string; text: string }> = {
  lg: { box: "h-24 w-24 md:h-28 md:w-28", text: "text-4xl" },
  md: { box: "h-16 w-16", text: "text-2xl" },
  sm: { box: "h-10 w-10", text: "text-base" },
};

export function PlayerAvatar({ name, avatarUrl, accent, size, shape = "circle" }: PlayerAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(avatarUrl) && !failed;
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const accentStyle = ACCENT_STYLES[accent];
  const sizeStyle = SIZE_CLASSES[size];
  const shapeClass = shape === "circle" ? "rounded-full" : "";

  return (
    <div
      className={`shrink-0 overflow-hidden bg-bg-panel-alt ring-2 ${shapeClass} ${accentStyle.ring} ${sizeStyle.box}`}
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
          className={`font-display flex h-full w-full items-center justify-center font-bold ${sizeStyle.text} ${accentStyle.text}`}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
