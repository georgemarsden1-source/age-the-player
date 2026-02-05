import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Setup() {
  const [numRounds, setNumRounds] = useState(10);
  const [, setLocation] = useLocation();
  const { gameMode, humanPlayers, addPlayer } = useGameStore();

  useEffect(() => {
    if (gameMode === 'single' && humanPlayers.length === 0) {
      addPlayer('Player');
    }
  }, [gameMode, humanPlayers.length, addPlayer]);

  const handleKickOff = () => {
    sessionStorage.setItem('numRounds', numRounds.toString());
    setLocation('/pack-select');
  };

  const backPath = gameMode === 'multi' ? '/players' : '/mode';

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
                onClick={() => setLocation(backPath)}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Back</span>
              </button>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Rounds
              </h2>
              <div className="w-16"></div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Number of Rounds
                </span>
                <span className="text-2xl font-display font-bold text-white">{numRounds}</span>
              </div>
              <Slider
                value={[numRounds]}
                onValueChange={(vals) => setNumRounds(vals[0])}
                min={1}
                max={20}
                step={1}
                className="py-2"
                data-testid="slider-rounds"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            <Button 
              onClick={handleKickOff}
              className="w-full text-xl py-6 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
              data-testid="button-start-game"
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
