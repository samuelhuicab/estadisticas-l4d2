import { fetch } from "@tauri-apps/plugin-http";
import type { PlayerPosition, PlayerStats } from "../types";
import type { DataRecord } from "./adaptive";

function requireEnv() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Faltan VITE_API_BASE_URL o VITE_API_KEY. Configura el archivo .env en la raíz del proyecto.",
    );
  }

  return { baseUrl, apiKey };
}

async function authorizedGet<T>(path: string): Promise<T> {
  const { baseUrl, apiKey } = requireEnv();

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: { "X-API-Key": apiKey },
  });

  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}`);
  }

  return (await response.json()) as T;
}

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

export async function fetchPlayerStats(steamId: string): Promise<PlayerStats> {
  return authorizedGet<PlayerStats>(`/api/jugador/${steamId}`);
}

export async function fetchMatches(): Promise<DataRecord[]> {
  return authorizedGet<DataRecord[]>("/api/sesiones");
}

export async function fetchRounds(matchId: string | number): Promise<DataRecord[]> {
  return authorizedGet<DataRecord[]>(`/api/sesiones/${matchId}/rondas`);
}

export async function fetchRoundPlayers(roundId: string | number): Promise<DataRecord[]> {
  return authorizedGet<DataRecord[]>(`/api/rondas/${roundId}/jugadores`);
}
