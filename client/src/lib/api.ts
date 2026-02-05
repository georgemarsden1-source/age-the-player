import type { Player, Score } from '@shared/schema';

const API_BASE = '';

export async function getRandomPlayers(count: number = 10, pack: string = 'modern'): Promise<Player[]> {
  const url = `${API_BASE}/api/players/random?count=${count}&pack=${encodeURIComponent(pack)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (err: any) {
    const errInfo = {
      name: err?.name,
      message: err?.message,
      stack: err?.stack?.substring(0, 200)
    };
    throw new Error(`Fetch error: ${JSON.stringify(errInfo)}`);
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

export async function getPackAgeRange(pack: string): Promise<{ minAge: number; maxAge: number }> {
  const response = await fetch(`${API_BASE}/api/packs/${encodeURIComponent(pack)}/age-range`);
  if (!response.ok) throw new Error('Failed to fetch age range');
  return response.json();
}
