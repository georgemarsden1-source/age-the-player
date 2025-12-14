import { create } from 'zustand';
import type { Player } from '@shared/schema';

export type GameStatus = 'idle' | 'loading' | 'playing' | 'round-feedback' | 'finished';

export interface GuessResult {
  round: number;
  playerId: number;
  playerName: string;
  guess: number;
  actual: number;
  points: number;
}

interface GameState {
  playerName: string;
  players: Player[];
  currentRound: number;
  totalScore: number;
  guesses: GuessResult[];
  status: GameStatus;
  
  setPlayers: (players: Player[]) => void;
  startGame: (name: string) => void;
  submitGuess: (age: number) => void;
  nextRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: '',
  players: [],
  currentRound: 0,
  totalScore: 0,
  guesses: [],
  status: 'idle',

  setPlayers: (players: Player[]) => set({ players, status: 'playing' }),

  startGame: (name: string) => set({ 
    playerName: name, 
    currentRound: 0, 
    totalScore: 0, 
    guesses: [], 
    status: 'loading' 
  }),

  submitGuess: (age: number) => {
    const { currentRound, totalScore, guesses, players } = get();
    const currentPlayer = players[currentRound];
    if (!currentPlayer) return;
    
    const diff = Math.abs(age - currentPlayer.age);
    const points = diff;
    
    set({
      guesses: [...guesses, {
        round: currentRound,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        guess: age,
        actual: currentPlayer.age,
        points
      }],
      totalScore: totalScore + points,
      status: 'round-feedback'
    });
  },

  nextRound: () => {
    const { currentRound, players } = get();
    if (currentRound >= players.length - 1) {
      set({ status: 'finished' });
    } else {
      set({ 
        currentRound: currentRound + 1,
        status: 'playing'
      });
    }
  },

  resetGame: () => set({
    playerName: '',
    players: [],
    currentRound: 0,
    totalScore: 0,
    guesses: [],
    status: 'idle'
  })
}));
