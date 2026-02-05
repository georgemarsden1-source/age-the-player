import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModeSelect() {
  const [, setLocation] = useLocation();
  const { setGameMode } = useGameStore();

  const handleSelectMode = (mode: 'single' | 'multi') => {
    setGameMode(mode);
    setLocation('/setup');
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
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-full flex items-center justify-between mb-2">
              <button
                onClick={() => setLocation('/')}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Back</span>
              </button>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Select Mode
              </h2>
              <div className="w-16"></div>
            </div>

            <p className="text-muted-foreground text-lg">
              How do you want to play?
            </p>

            <div className="w-full space-y-4">
              <Button 
                onClick={() => handleSelectMode('single')}
                className="w-full text-xl py-8 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
                data-testid="button-single-player"
              >
                <User className="mr-3 w-8 h-8" /> Single Player
              </Button>

              <Button 
                onClick={() => handleSelectMode('multi')}
                variant="outline"
                className="w-full py-7 border-white/20 text-white/90 hover:text-white hover:bg-white/10 font-display uppercase tracking-wider text-xl"
                data-testid="button-multiplayer"
              >
                <Users className="mr-3 w-7 h-7" /> Multiplayer
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
