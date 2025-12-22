import type { Player, Score } from '@shared/schema';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

const API_BASE = import.meta.env.PROD 
  ? 'https://football-age--georgemarsden.replit.app' 
  : '';

async function nativeGet<T>(url: string): Promise<T> {
  if (Capacitor.isNativePlatform()) {
    console.log('Using native HTTP for:', url);
    const response = await CapacitorHttp.get({
      url,
      headers: { 'Accept': 'application/json' }
    });
    if (response.status >= 400) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.data as T;
  } else {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  }
}

async function nativePost<T>(url: string, data: any): Promise<T> {
  if (Capacitor.isNativePlatform()) {
    console.log('Using native HTTP POST for:', url);
    const response = await CapacitorHttp.post({
      url,
      headers: { 'Content-Type': 'application/json' },
      data
    });
    if (response.status >= 400) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.data as T;
  } else {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  }
}

export async function getRandomPlayers(count: number = 10): Promise<Player[]> {
  const url = `${API_BASE}/api/players/random?count=${count}`;
  console.log('Fetching players from:', url);
  return nativeGet<Player[]>(url);
}

export async function submitScore(playerName: string, totalScore: number): Promise<Score> {
  const url = `${API_BASE}/api/scores`;
  return nativePost<Score>(url, { playerName, totalScore });
}

export async function getLeaderboard(limit: number = 10): Promise<Score[]> {
  const url = `${API_BASE}/api/scores/leaderboard?limit=${limit}`;
  return nativeGet<Score[]>(url);
}

export async function searchPlayers(query: string, limit: number = 20): Promise<Player[]> {
  const url = `${API_BASE}/api/players/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  return nativeGet<Player[]>(url);
}

export async function getPlayerById(id: number): Promise<Player> {
  const url = `${API_BASE}/api/players/${id}`;
  return nativeGet<Player>(url);
}
