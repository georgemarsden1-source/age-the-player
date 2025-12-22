import type { Player, Score } from '@shared/schema';
import { Capacitor } from '@capacitor/core';

const API_BASE = import.meta.env.PROD 
  ? 'https://football-age--georgemarsden.replit.app' 
  : '';

function nativeLog(message: string) {
  console.log(message);
  if (Capacitor.isNativePlatform()) {
    (window as any).webkit?.messageHandlers?.bridge?.postMessage?.({
      type: 'log',
      message: message
    });
  }
}

export async function getRandomPlayers(count: number = 10): Promise<Player[]> {
  const url = `${API_BASE}/api/players/random?count=${count}`;
  nativeLog(`API: Fetching from ${url}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    clearTimeout(timeoutId);
    
    nativeLog(`API: Response status ${response.status}`);
    
    if (!response.ok) {
      const text = await response.text();
      nativeLog(`API: Error body ${text}`);
      throw new Error(`Failed to fetch players: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    nativeLog(`API: Players loaded ${data.length}`);
    return data;
  } catch (error: any) {
    nativeLog(`API: Error ${error.name} - ${error.message}`);
    throw error;
  }
}

export async function submitScore(playerName: string, totalScore: number): Promise<Score> {
  const response = await fetch(`${API_BASE}/api/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName, totalScore }),
  });
  if (!response.ok) throw new Error('Failed to submit score');
  return response.json();
}

export async function getLeaderboard(limit: number = 10): Promise<Score[]> {
  const response = await fetch(`${API_BASE}/api/scores/leaderboard?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
}

export async function searchPlayers(query: string, limit: number = 20): Promise<Player[]> {
  const response = await fetch(`${API_BASE}/api/players/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to search players');
  return response.json();
}

export async function getPlayerById(id: number): Promise<Player> {
  const response = await fetch(`${API_BASE}/api/players/${id}`);
  if (!response.ok) throw new Error('Failed to fetch player');
  return response.json();
}
