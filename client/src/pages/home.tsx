import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { getRandomPlayers } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import bgImage from '@assets/generated_images/dark_atmospheric_football_stadium_background.png';
import { toast } from 'sonner';

export default function Home() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { startGame, setPlayers } = useGameStore();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      setIsLoading(true);
      try {
        startGame(name);
        const players = await getRandomPlayers(10);
        setPlayers(players);
        setLocation('/game');
      } catch (error) {
        console.error('Failed to fetch players:', error);
        toast.error('Failed to load players. Please try again.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

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

            <form onSubmit={handleStart} className="w-full space-y-4 pt-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                  Player Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-white/10 text-lg py-6 focus-visible:ring-primary"
                  data-testid="input-player-name"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full text-xl py-6 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
                disabled={!name.trim() || isLoading}
                data-testid="button-start-game"
              >
                {isLoading ? 'Loading...' : 'Kick Off'} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </Card>
        
        <div className="mt-8 text-center text-xs text-muted-foreground/60 uppercase tracking-widest">
          200+ Players • Global Leaderboard
        </div>
      </motion.div>
    </div>
  );
}
