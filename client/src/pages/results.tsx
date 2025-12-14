import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, RefreshCw, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import bgImage from '@assets/generated_images/dark_atmospheric_football_stadium_background.png';

export default function Results() {
  const [, setLocation] = useLocation();
  const { totalScore, guesses, playerName, resetGame, status, leaderboard } = useGameStore();

  useEffect(() => {
    if (status === 'idle') {
      setLocation('/');
    }
  }, [status, setLocation]);

  const handlePlayAgain = () => {
    resetGame();
    setLocation('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-background via-background/90 to-transparent" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-6"
      >
        {/* Match Report Card */}
        <Card className="bg-card/95 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
          <div className="bg-primary/10 p-6 text-center border-b border-white/5">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-display font-bold text-white uppercase mb-1">
              Full Time!
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">
              {playerName}'s Score
            </p>
            
            <div className="inline-flex flex-col items-center bg-background/50 border border-white/10 rounded-xl px-8 py-4">
              <span className="text-5xl font-display font-bold text-white">{totalScore}</span>
              <span className="text-[10px] text-primary mt-1 uppercase tracking-wider">Penalty Points</span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-display uppercase text-white mb-4">Round Breakdown</h3>
            <ScrollArea className="flex-1 h-[200px] rounded-lg border border-white/10 bg-background/30 mb-6">
              <Table>
                <TableHeader className="bg-white/5 sticky top-0 z-10">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-xs uppercase font-bold w-[60px]">Rnd</TableHead>
                    <TableHead className="text-xs uppercase font-bold">Player</TableHead>
                    <TableHead className="text-right text-xs uppercase font-bold">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guesses.map((guess, idx) => (
                    <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium text-white">#{guess.round + 1}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{guess.actual}y (Guess: {guess.guess})</TableCell>
                      <TableCell className={`text-right font-bold ${guess.points === 0 ? 'text-primary' : 'text-destructive'}`}>
                        +{guess.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <Button 
              onClick={handlePlayAgain} 
              className="w-full py-6 text-lg font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 w-5 h-5" /> Play Again
            </Button>
          </div>
        </Card>

        {/* Leaderboard Card */}
        <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
          <div className="bg-white/5 p-6 border-b border-white/5 flex items-center gap-3">
             <Medal className="w-8 h-8 text-yellow-500" />
             <div>
               <h2 className="text-2xl font-display font-bold text-white uppercase leading-none">Leaderboard</h2>
               <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Scouts</p>
             </div>
          </div>
          
          <div className="p-0 flex-1">
             <Table>
                <TableHeader className="bg-transparent">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-center w-[50px] text-muted-foreground">#</TableHead>
                    <TableHead className="text-muted-foreground">Player</TableHead>
                    <TableHead className="text-right text-muted-foreground">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No scores yet. Be the first!
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaderboard.map((entry, idx) => (
                      <TableRow key={idx} className={`border-white/5 hover:bg-white/5 ${entry.name === playerName && entry.score === totalScore ? 'bg-primary/10' : ''}`}>
                        <TableCell className="text-center font-display text-lg text-white/50">
                           {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-white">{entry.name}</div>
                          <div className="text-[10px] text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-white text-lg">
                          {entry.score}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
