import type { Player, Score } from '@shared/schema';

const API_BASE = import.meta.env.PROD 
  ? 'https://football-age--georgemarsden.replit.app' 
  : '';

export async function getRandomPlayers(count: number = 10): Promise<Player[]> {
  const url = `${API_BASE}/api/players/random?count=${count}`;
  console.log('🎮 Fetching random players from:', url);
  try {
    const response = await fetch(url);
    console.log('✅ Response status:', response.status, response.statusText);
    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Response body:', text);
      throw new Error(`Failed to fetch players: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Players loaded:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Network error fetching players:', error);
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
