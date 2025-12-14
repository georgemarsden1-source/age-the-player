import type { Player, Score } from '@shared/schema';

export async function getRandomPlayers(count: number = 10): Promise<Player[]> {
  const response = await fetch(`/api/players/random?count=${count}`);
  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
}

export async function submitScore(playerName: string, totalScore: number): Promise<Score> {
  const response = await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName, totalScore }),
  });
  if (!response.ok) throw new Error('Failed to submit score');
  return response.json();
}

export async function getLeaderboard(limit: number = 10): Promise<Score[]> {
  const response = await fetch(`/api/scores/leaderboard?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
}
