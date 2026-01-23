import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Target, Trophy, Users, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Rules() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-card/90 backdrop-blur-md border-primary/20 p-8 shadow-2xl shadow-primary/10">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setLocation('/')}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Back</span>
              </button>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Game Rules
              </h2>
              <div className="w-16"></div>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Guess the Age</h3>
                  <p className="text-muted-foreground text-sm">
                    You'll see a famous footballer's photo and name. Guess their current age as accurately as possible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Scoring</h3>
                  <p className="text-muted-foreground text-sm">
                    Your score is based on how far off your guess is. The closer you are, the fewer points you get. <span className="text-primary font-medium">Lowest score wins!</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Multiplayer</h3>
                  <p className="text-muted-foreground text-sm">
                    Play with friends! Add multiple players and take turns guessing. Pass the phone between rounds.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Timer className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Rounds</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose between 1-20 rounds per game. Each round features a different footballer from our database of 830+ players.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setLocation('/setup')}
              className="w-full text-lg py-6 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] mt-4"
              data-testid="button-play-now"
            >
              Play Now
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
