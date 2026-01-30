import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Gamepad2, Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-card/90 backdrop-blur-md border-primary/20 p-8 shadow-2xl shadow-primary/10">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Trophy className="w-14 h-14 text-primary" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-5xl font-display font-bold tracking-tighter text-white uppercase drop-shadow-md">
                Age The Player
              </h1>
              <p className="text-muted-foreground text-lg">
                Can you guess the footballer's age?
              </p>
            </div>

            <div className="w-full space-y-4 pt-4">
              <Button 
                onClick={() => setLocation('/setup')}
                className="w-full text-xl py-7 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
                data-testid="button-classic-game"
              >
                <Gamepad2 className="mr-3 w-8 h-8" /> Classic Game
              </Button>

              <Button 
                onClick={() => setLocation('/search')}
                variant="outline"
                className="w-full py-6 border-white/20 text-white/90 hover:text-white hover:bg-white/10 font-display uppercase tracking-wider text-lg"
                data-testid="button-search-players"
              >
                <Search className="mr-3 w-7 h-7" /> Search Players
              </Button>

              <Button 
                onClick={() => setLocation('/rules')}
                variant="outline"
                className="w-full py-6 border-white/20 text-white/90 hover:text-white hover:bg-white/10 font-display uppercase tracking-wider text-lg"
                data-testid="button-game-rules"
              >
                <BookOpen className="mr-3 w-7 h-7" /> Game Rules
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="mt-8 text-center text-xs text-muted-foreground/60 uppercase tracking-widest">
          830+ Players • Global Leaderboard
        </div>
      </motion.div>
    </div>
  );
}
