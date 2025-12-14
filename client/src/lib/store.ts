import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PLAYERS } from './game-data';

export type GameStatus = 'idle' | 'playing' | 'round-feedback' | 'finished';

export interface GuessResult {
  round: number;
  playerId: number;
  guess: number;
  actual: number;
  points: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface GameState {
  playerName: string;
  currentRound: number;
  totalScore: number;
  guesses: GuessResult[];
  status: GameStatus;
  leaderboard: LeaderboardEntry[];
  
  startGame: (name: string) => void;
  submitGuess: (age: number) => void;
  nextRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerName: '',
      currentRound: 0,
      totalScore: 0,
      guesses: [],
      status: 'idle',
      leaderboard: [],

      startGame: (name: string) => set({ 
        playerName: name, 
        currentRound: 0, 
        totalScore: 0, 
        guesses: [], 
        status: 'playing' 
      }),

      submitGuess: (age: number) => {
        const { currentRound, totalScore, guesses } = get();
        const currentPlayer = PLAYERS[currentRound];
        const diff = Math.abs(age - currentPlayer.age);
        const points = diff;
        
        set({
          guesses: [...guesses, {
            round: currentRound,
            playerId: currentPlayer.id,
            guess: age,
            actual: currentPlayer.age,
            points
          }],
          totalScore: totalScore + points,
          status: 'round-feedback'
        });
      },

      nextRound: () => {
        const { currentRound, totalScore, playerName } = get();
        if (currentRound >= PLAYERS.length - 1) {
          // Game Finished - Update Leaderboard
          const newEntry: LeaderboardEntry = {
            name: playerName,
            score: totalScore,
            date: new Date().toISOString()
          };
          
          const currentLeaderboard = get().leaderboard;
          const newLeaderboard = [...currentLeaderboard, newEntry]
            .sort((a, b) => a.score - b.score) // Sort by lowest score
            .slice(0, 10); // Keep top 10

          set({ 
            status: 'finished',
            leaderboard: newLeaderboard
          });
        } else {
          set({ 
            currentRound: currentRound + 1,
            status: 'playing'
          });
        }
      },

      resetGame: () => set({
        playerName: '',
        currentRound: 0,
        totalScore: 0,
        guesses: [],
        status: 'idle'
      })
    }),
    {
      name: 'football-quiz-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ leaderboard: state.leaderboard }), // Only persist leaderboard
    }
  )
);
