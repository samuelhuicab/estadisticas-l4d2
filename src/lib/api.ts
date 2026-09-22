import { fetch } from "@tauri-apps/plugin-http";
import type { PlayerPosition } from "../types";

export async function fetchPositions(): Promise<PlayerPosition[]> {
  const url = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!url || !apiKey) {
    throw new Error(
      "Faltan VITE_API_URL o VITE_API_KEY. Configura el archivo .env en la raíz del proyecto.",
    );
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { "X-API-Key": apiKey },
  });

  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`);
  }

  const data = (await response.json()) as PlayerPosition[];
  return [...data].sort((a, b) => a.rank_num - b.rank_num);
}
