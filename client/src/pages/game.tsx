import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '@assets/generated_images/dark_atmospheric_football_stadium_background.png';
import defaultPlayerImg from '@assets/stock_images/professional_soccer__d8d58f8f.jpg';

export default function Game() {
  const [, setLocation] = useLocation();
  const { 
    currentRound, 
    status, 
    submitGuess, 
    nextRound, 
    guesses,
    players 
  } = useGameStore();

  const [age, setAge] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const player = players[currentRound];
  const lastGuess = guesses[guesses.length - 1];

  useEffect(() => {
    if (status === 'idle' || status === 'loading' || players.length === 0) {
      setLocation('/');
    } else if (status === 'finished') {
      setLocation('/results');
    }
  }, [status, players, setLocation]);

  useEffect(() => {
    setAge(25);
  }, [currentRound]);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    submitGuess(age);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleNext = () => {
    nextRound();
  };

  if (!player) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-background to-transparent">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg py-1 px-3 border-white/30 text-white bg-white/10">
            Round {currentRound + 1}/{players.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
           <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Score</div>
           <div className="text-2xl font-display font-bold text-white">
             {guesses.reduce((acc, curr) => acc + curr.points, 0)} pts
           </div>
        </div>
      </div>

      <Progress value={((currentRound) / players.length) * 100} className="absolute top-0 left-0 right-0 h-1 z-30 rounded-none bg-white/10" />

      <div className="w-full max-w-lg z-10 flex flex-col items-center gap-6 mt-12 md:mt-0">
        
        <motion.div 
          key={player.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full aspect-[3/4] md:aspect-[4/5] max-h-[50vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 group"
        >
           <img 
            src={player.imageUrl || defaultPlayerImg} 
            alt={player.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-sm">
                 {player.team || player.nationality}
               </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase leading-none drop-shadow-lg">
              {player.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{player.position}</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === 'playing' ? (
            <motion.div 
              key="controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full bg-card/80 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Guess Age
                  </label>
                  <span className="text-4xl font-display font-bold text-primary">
                    {age} <span className="text-lg text-muted-foreground font-sans font-normal">years</span>
                  </span>
                </div>
                
                <Slider
                  value={[age]}
                  onValueChange={(vals) => setAge(vals[0])}
                  min={16}
                  max={45}
                  step={1}
                  className="py-4"
                  data-testid="slider-age"
                />

                <Button 
                  onClick={handleSubmit} 
                  className="w-full text-xl py-6 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  data-testid="button-submit-guess"
                >
                  Submit Guess
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-card/95 backdrop-blur-xl border border-primary/20 rounded-xl p-6 shadow-2xl relative overflow-hidden"
            >
               <div className="text-center space-y-4 relative z-10">
                 <div className="flex flex-col items-center">
                    {lastGuess?.points === 0 ? (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                        <AlertCircle className="w-10 h-10 text-orange-500" />
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-display uppercase tracking-wider text-white">
                      {lastGuess?.points === 0 ? 'Spot On!' : 'Close Call!'}
                    </h3>
                 </div>

                 <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Your Guess</div>
                      <div className="text-2xl font-bold text-white">{lastGuess?.guess}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Actual Age</div>
                      <div className="text-2xl font-bold text-primary">{lastGuess?.actual}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Penalty</div>
                      <div className="text-2xl font-bold text-destructive">+{lastGuess?.points}</div>
                    </div>
                 </div>

                 <Button 
                  onClick={handleNext} 
                  className="w-full text-lg py-5 font-display uppercase tracking-widest"
                  variant="outline"
                  data-testid="button-next-round"
                >
                  Next Player <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
