import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { getRandomPlayers } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trophy, ArrowRight, UserPlus, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Home() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { humanPlayers, addPlayer, removePlayer, startGame, setFootballers } = useGameStore();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const success = addPlayer(name);
      if (success) {
        setName('');
      } else {
        toast.error('Player already added or invalid name');
      }
    }
  };

  const handleKickOff = async () => {
    if (humanPlayers.length === 0 || isLoading) return;
    setIsLoading(true);
    try {
      startGame();
      const players = await getRandomPlayers(10);
      setFootballers(players);
      setLocation('/game');
    } catch (error) {
      console.error('Failed to fetch players:', error);
      toast.error('Failed to load players. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-card/90 backdrop-blur-md border-primary/20 p-8 shadow-2xl shadow-primary/10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Trophy className="w-12 h-12 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-5xl font-display font-bold tracking-tighter text-white uppercase drop-shadow-md">
                Pitch Perfect
              </h1>
              <p className="text-muted-foreground text-lg">
                Guess the footballer's age. <br/>
                <span className="text-primary font-medium">Lowest score wins.</span>
              </p>
            </div>

            <form onSubmit={handleAddPlayer} className="w-full space-y-4 pt-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                  Add Player
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter player name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50 border-white/10 text-lg py-6 focus-visible:ring-primary flex-1"
                    data-testid="input-player-name"
                    autoFocus
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className="py-6 px-4 bg-white/10 hover:bg-white/20 border border-white/20"
                    disabled={!name.trim() || isLoading}
                    data-testid="button-add-player"
                  >
                    <UserPlus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </form>

            {humanPlayers.length > 0 && (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 text-left">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Players ({humanPlayers.length})
                  </span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {humanPlayers.map((player, idx) => (
                      <motion.div
                        key={player}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3"
                        data-testid={`player-item-${idx}`}
                      >
                        <span className="text-white font-medium">{player}</span>
                        <button
                          onClick={() => removePlayer(player)}
                          className="text-white/40 hover:text-destructive transition-colors"
                          data-testid={`button-remove-player-${idx}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <Button 
              onClick={handleKickOff}
              className="w-full text-xl py-6 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
              disabled={humanPlayers.length === 0 || isLoading}
              data-testid="button-start-game"
            >
              {isLoading ? 'Loading...' : 'Kick Off'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </Card>
        
        <div className="mt-8 text-center text-xs text-muted-foreground/60 uppercase tracking-widest">
          200+ Players • Global Leaderboard
        </div>
      </motion.div>
    </div>
  );
}
