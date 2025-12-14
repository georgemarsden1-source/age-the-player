import { create } from 'zustand';
import type { Player } from '@shared/schema';

export type GameStatus = 'idle' | 'loading' | 'playing' | 'round-feedback' | 'finished';

export interface RoundGuess {
  humanPlayerName: string;
  guess: number;
  points: number;
}

export interface RoundResult {
  round: number;
  footballerId: number;
  footballerName: string;
  actualAge: number;
  guesses: RoundGuess[];
}

interface GameState {
  humanPlayers: string[];
  footballers: Player[];
  currentRound: number;
  roundResults: RoundResult[];
  currentRoundGuesses: { [humanPlayer: string]: number };
  playerScores: { [humanPlayer: string]: number };
  status: GameStatus;
  
  addPlayer: (name: string) => boolean;
  removePlayer: (name: string) => void;
  setFootballers: (players: Player[]) => void;
  startGame: () => void;
  setGuess: (humanPlayer: string, age: number) => void;
  submitAllGuesses: () => void;
  nextRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  humanPlayers: [],
  footballers: [],
  currentRound: 0,
  roundResults: [],
  currentRoundGuesses: {},
  playerScores: {},
  status: 'idle',

  addPlayer: (name: string) => {
    const { humanPlayers } = get();
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    if (humanPlayers.some(p => p.toLowerCase() === trimmedName.toLowerCase())) return false;
    
    set({ 
      humanPlayers: [...humanPlayers, trimmedName],
      playerScores: { ...get().playerScores, [trimmedName]: 0 }
    });
    return true;
  },

  removePlayer: (name: string) => {
    const { humanPlayers, playerScores } = get();
    const newPlayers = humanPlayers.filter(p => p !== name);
    const newScores = { ...playerScores };
    delete newScores[name];
    set({ humanPlayers: newPlayers, playerScores: newScores });
  },

  setFootballers: (players: Player[]) => {
    const { humanPlayers } = get();
    const initialGuesses: { [key: string]: number } = {};
    humanPlayers.forEach(p => {
      initialGuesses[p] = 25;
    });
    set({ 
      footballers: players, 
      currentRoundGuesses: initialGuesses,
      status: 'playing' 
    });
  },

  startGame: () => {
    const { humanPlayers } = get();
    if (humanPlayers.length === 0) return;
    
    const initialScores: { [key: string]: number } = {};
    const initialGuesses: { [key: string]: number } = {};
    humanPlayers.forEach(p => {
      initialScores[p] = 0;
      initialGuesses[p] = 25;
    });
    set({ 
      currentRound: 0, 
      roundResults: [],
      currentRoundGuesses: initialGuesses,
      playerScores: initialScores,
      status: 'loading' 
    });
  },

  setGuess: (humanPlayer: string, age: number) => {
    const { currentRoundGuesses } = get();
    set({ currentRoundGuesses: { ...currentRoundGuesses, [humanPlayer]: age } });
  },

  submitAllGuesses: () => {
    const { currentRound, roundResults, currentRoundGuesses, playerScores, footballers, humanPlayers } = get();
    const currentFootballer = footballers[currentRound];
    if (!currentFootballer) return;
    
    const guesses: RoundGuess[] = [];
    const newScores = { ...playerScores };
    
    humanPlayers.forEach(player => {
      const guess = currentRoundGuesses[player] ?? 25;
      const diff = Math.abs(guess - currentFootballer.age);
      guesses.push({
        humanPlayerName: player,
        guess,
        points: diff
      });
      newScores[player] = (newScores[player] || 0) + diff;
    });
    
    const roundResult: RoundResult = {
      round: currentRound,
      footballerId: currentFootballer.id,
      footballerName: currentFootballer.name,
      actualAge: currentFootballer.age,
      guesses
    };
    
    set({
      roundResults: [...roundResults, roundResult],
      playerScores: newScores,
      status: 'round-feedback'
    });
  },

  nextRound: () => {
    const { currentRound, footballers, humanPlayers } = get();
    if (currentRound >= footballers.length - 1) {
      set({ status: 'finished' });
    } else {
      const initialGuesses: { [key: string]: number } = {};
      humanPlayers.forEach(p => {
        initialGuesses[p] = 25;
      });
      set({ 
        currentRound: currentRound + 1,
        currentRoundGuesses: initialGuesses,
        status: 'playing'
      });
    }
  },

  resetGame: () => set({
    humanPlayers: [],
    footballers: [],
    currentRound: 0,
    roundResults: [],
    currentRoundGuesses: {},
    playerScores: {},
    status: 'idle'
  })
}));
