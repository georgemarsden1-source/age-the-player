import { create } from 'zustand';
import type { Player } from '@shared/schema';

export type GameStatus = 'idle' | 'loading' | 'playing' | 'round-feedback' | 'finished';
export type GameMode = 'single' | 'multi';

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
  gameMode: GameMode;
  selectedPack: string;
  humanPlayers: string[];
  footballers: Player[];
  currentRound: number;
  currentPlayerIndex: number;
  roundResults: RoundResult[];
  currentRoundGuesses: { [humanPlayer: string]: number };
  playerScores: { [humanPlayer: string]: number };
  currentGuessValue: number;
  status: GameStatus;
  
  setGameMode: (mode: GameMode) => void;
  setSelectedPack: (pack: string) => void;
  addPlayer: (name: string) => boolean;
  removePlayer: (name: string) => void;
  setFootballers: (players: Player[]) => void;
  startGame: () => void;
  setCurrentGuess: (age: number) => void;
  submitCurrentPlayerGuess: () => void;
  nextRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameMode: 'single',
  selectedPack: 'modern',
  humanPlayers: [],
  footballers: [],
  currentRound: 0,
  currentPlayerIndex: 0,
  roundResults: [],
  currentRoundGuesses: {},
  playerScores: {},
  currentGuessValue: 25,
  status: 'idle',

  setGameMode: (mode: GameMode) => {
    set({ gameMode: mode });
  },

  setSelectedPack: (pack: string) => {
    set({ selectedPack: pack });
  },

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
    set({ 
      footballers: players, 
      currentRoundGuesses: {},
      currentPlayerIndex: 0,
      currentGuessValue: 25,
      status: 'playing' 
    });
  },

  startGame: () => {
    const { humanPlayers } = get();
    if (humanPlayers.length === 0) return;
    
    const initialScores: { [key: string]: number } = {};
    humanPlayers.forEach(p => {
      initialScores[p] = 0;
    });
    set({ 
      currentRound: 0, 
      currentPlayerIndex: 0,
      roundResults: [],
      currentRoundGuesses: {},
      playerScores: initialScores,
      currentGuessValue: 25,
      status: 'loading' 
    });
  },

  setCurrentGuess: (age: number) => {
    set({ currentGuessValue: age });
  },

  submitCurrentPlayerGuess: () => {
    const { 
      currentRound, currentPlayerIndex, currentRoundGuesses, 
      playerScores, footballers, humanPlayers, currentGuessValue,
      roundResults
    } = get();
    
    const currentFootballer = footballers[currentRound];
    if (!currentFootballer) return;
    
    const currentPlayer = humanPlayers[currentPlayerIndex];
    if (!currentPlayer) return;
    
    const newGuesses = { ...currentRoundGuesses, [currentPlayer]: currentGuessValue };
    
    if (currentPlayerIndex < humanPlayers.length - 1) {
      set({
        currentRoundGuesses: newGuesses,
        currentPlayerIndex: currentPlayerIndex + 1,
        currentGuessValue: 25
      });
    } else {
      const guesses: RoundGuess[] = [];
      const newScores = { ...playerScores };
      
      humanPlayers.forEach(player => {
        const guess = player === currentPlayer ? currentGuessValue : (newGuesses[player] ?? 25);
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
        currentRoundGuesses: newGuesses,
        roundResults: [...roundResults, roundResult],
        playerScores: newScores,
        status: 'round-feedback'
      });
    }
  },

  nextRound: () => {
    const { currentRound, footballers } = get();
    if (currentRound >= footballers.length - 1) {
      set({ status: 'finished' });
    } else {
      set({ 
        currentRound: currentRound + 1,
        currentPlayerIndex: 0,
        currentRoundGuesses: {},
        currentGuessValue: 25,
        status: 'playing'
      });
    }
  },

  resetGame: () => set({
    gameMode: 'single',
    selectedPack: 'modern',
    humanPlayers: [],
    footballers: [],
    currentRound: 0,
    currentPlayerIndex: 0,
    roundResults: [],
    currentRoundGuesses: {},
    playerScores: {},
    currentGuessValue: 25,
    status: 'idle'
  })
}));
