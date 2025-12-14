import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import defaultPlayerImg from '@assets/stock_images/professional_soccer__d8d58f8f.jpg';

export default function Game() {
  const [, setLocation] = useLocation();
  const { 
    currentRound, 
    status, 
    submitAllGuesses, 
    nextRound, 
    roundResults,
    footballers,
    humanPlayers,
    currentRoundGuesses,
    setGuess,
    playerScores
  } = useGameStore();

  const footballer = footballers[currentRound];
  const lastRoundResult = roundResults[roundResults.length - 1];

  useEffect(() => {
    if (status === 'idle' || status === 'loading' || footballers.length === 0) {
      setLocation('/');
    } else if (status === 'finished') {
      setLocation('/results');
    }
  }, [status, footballers, setLocation]);

  const handleSubmit = () => {
    submitAllGuesses();
  };

  const handleNext = () => {
    nextRound();
  };

  if (!footballer) return null;

  const totalScore = Object.values(playerScores).reduce((sum, s) => sum + s, 0);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black text-foreground">
      
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center gap-1">
          <span className="text-sm text-white/70 uppercase tracking-wider font-semibold">Round</span>
          <span className="text-2xl font-display font-bold text-white">
            {currentRound + 1}/{footballers.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {humanPlayers.map(player => (
            <div key={player} className="text-center">
              <span className="text-xs text-white/50 block">{player}</span>
              <span className="text-lg font-display font-bold text-white">
                {playerScores[player] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Progress value={((currentRound) / footballers.length) * 100} className="absolute top-0 left-0 right-0 h-1 z-30 rounded-none bg-white/10" />

      <div className="w-full max-w-lg z-10 flex flex-col items-center gap-6 mt-16 md:mt-0">
        
        <motion.div 
          key={footballer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-3 border-white/20 shadow-xl">
                <img 
                  src={footballer.imageUrl || defaultPlayerImg} 
                  alt={footballer.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded">
                  {footballer.team && footballer.team !== 'Unknown' ? footballer.team : footballer.nationality}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase leading-tight truncate">
                {footballer.name}
              </h2>
              <p className="text-white/60 text-sm mt-1">{footballer.position}</p>
            </div>
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
                {humanPlayers.map((player, idx) => (
                  <div key={player} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-semibold text-white uppercase tracking-widest">
                        {player}
                      </label>
                      <span className="text-3xl font-display font-bold text-white">
                        {currentRoundGuesses[player] ?? 25} <span className="text-sm text-white/60 font-sans font-normal">years</span>
                      </span>
                    </div>
                    
                    <Slider
                      value={[currentRoundGuesses[player] ?? 25]}
                      onValueChange={(vals) => setGuess(player, vals[0])}
                      min={16}
                      max={45}
                      step={1}
                      className="py-4"
                      data-testid={`slider-age-${idx}`}
                    />
                  </div>
                ))}

                <Button 
                  onClick={handleSubmit} 
                  className="w-full text-xl py-6 font-display uppercase tracking-widest bg-secondary text-white hover:bg-secondary/90 transition-all border-2 border-white/20"
                  data-testid="button-submit-guess"
                >
                  Submit Guesses
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
                 <div className="flex flex-col items-center mb-4">
                    <h3 className="text-2xl font-display uppercase tracking-wider text-white">
                      {footballer.name} is {lastRoundResult?.actualAge} years old!
                    </h3>
                 </div>

                 <div className="space-y-3 py-4 border-y border-white/5">
                   {lastRoundResult?.guesses.map((guess, idx) => (
                     <div key={guess.humanPlayerName} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3" data-testid={`feedback-player-${idx}`}>
                       <div className="flex items-center gap-3">
                         {guess.points === 0 ? (
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                         ) : (
                           <AlertCircle className="w-5 h-5 text-orange-500" />
                         )}
                         <span className="text-white font-medium">{guess.humanPlayerName}</span>
                       </div>
                       <div className="flex items-center gap-4">
                         <span className="text-white/60 text-sm">Guessed: {guess.guess}</span>
                         <span className={`font-bold ${guess.points === 0 ? 'text-green-500' : 'text-destructive'}`}>
                           +{guess.points}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>

                 <Button 
                  onClick={handleNext} 
                  className="w-full text-lg py-5 font-display uppercase tracking-widest"
                  variant="outline"
                  data-testid="button-next-round"
                >
                  {currentRound >= footballers.length - 1 ? 'See Results' : 'Next Player'} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
