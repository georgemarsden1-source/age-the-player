import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, UserPlus, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function PlayersSetup() {
  const [name, setName] = useState('');
  const [, setLocation] = useLocation();
  const { humanPlayers, addPlayer, removePlayer } = useGameStore();

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

  const handleNext = () => {
    if (humanPlayers.length >= 2) {
      setLocation('/setup');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-card/90 backdrop-blur-md border-primary/20 p-8 shadow-2xl shadow-primary/10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-full flex items-center justify-between mb-2">
              <button
                onClick={() => setLocation('/mode')}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Back</span>
              </button>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Add Players
              </h2>
              <div className="w-16"></div>
            </div>

            <form onSubmit={handleAddPlayer} className="w-full space-y-4">
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter player name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-white/10 text-lg py-6 focus-visible:ring-primary w-full"
                  data-testid="input-player-name"
                />
                <Button 
                  type="submit" 
                  className="w-full py-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display uppercase tracking-wider"
                  disabled={!name.trim()}
                  data-testid="button-add-player"
                >
                  <UserPlus className="w-5 h-5 mr-2" /> Add to Game
                </Button>
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
              onClick={handleNext}
              className="w-full text-xl py-6 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
              disabled={humanPlayers.length < 2}
              data-testid="button-next"
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {humanPlayers.length < 2 && (
              <p className="text-muted-foreground text-sm">
                Add at least 2 players to continue
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
