import type { Player, Score } from '@shared/schema';

const API_BASE = import.meta.env.PROD 
  ? 'https://football-age--georgemarsden.replit.app' 
  : '';

export async function getRandomPlayers(count: number = 10): Promise<Player[]> {
  const response = await fetch(`${API_BASE}/api/players/random?count=${count}`);
  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
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
