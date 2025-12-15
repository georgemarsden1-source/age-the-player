import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { submitScore, getLeaderboard } from '@/lib/api';
import type { Score } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, RefreshCw, Medal, Crown, Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { triggerHaptic } from '@/lib/haptics';
import { toPng } from 'html-to-image';

export default function Results() {
  const [, setLocation] = useLocation();
  const { playerScores, roundResults, humanPlayers, resetGame, status } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const scoreCardRef = useRef<HTMLDivElement>(null);

  const rankedPlayers = [...humanPlayers].sort((a, b) => (playerScores[a] || 0) - (playerScores[b] || 0));
  const topScore = playerScores[rankedPlayers[0]] || 0;
  const winners = rankedPlayers.filter(player => (playerScores[player] || 0) === topScore);
  const isDraw = winners.length > 1;
  const winner = rankedPlayers[0];

  useEffect(() => {
    if (status === 'idle') {
      setLocation('/');
      return;
    }

    const saveAndLoadData = async () => {
      try {
        for (const player of humanPlayers) {
          await submitScore(player, playerScores[player] || 0);
        }
        const scores = await getLeaderboard(10);
        setLeaderboard(scores);
      } catch (error) {
        console.error('Failed to save/load data:', error);
        toast.error('Failed to save scores');
      } finally {
        setIsLoading(false);
      }
    };

    saveAndLoadData();
  }, [status, humanPlayers, playerScores, setLocation]);

  const handlePlayAgain = () => {
    triggerHaptic('medium');
    resetGame();
    setLocation('/');
  };

  const generateShareText = () => {
    const lines = [
      "🎮 AGE THE PLAYER",
      "",
      "📊 Results:",
      ...rankedPlayers.map((player, idx) => 
        `${idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  '} ${player}: ${playerScores[player] || 0} pts`
      ),
      "",
      `🎯 ${roundResults.length} rounds played`,
      "",
      "Can you beat my score? Play now!"
    ];
    return lines.join('\n');
  };

  const generateScoreCardImage = async (): Promise<Blob | null> => {
    if (!scoreCardRef.current) return null;
    
    try {
      const dataUrl = await toPng(scoreCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000'
      });
      
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      console.error('Failed to generate image:', error);
      return null;
    }
  };

  const canShareFiles = (): boolean => {
    if (!navigator.share || !navigator.canShare) return false;
    try {
      const testFile = new File(['test'], 'test.png', { type: 'image/png' });
      return navigator.canShare({ files: [testFile] });
    } catch {
      return false;
    }
  };

  const handleShare = async () => {
    triggerHaptic('medium');
    setIsGeneratingImage(true);
    
    try {
      const shareText = generateShareText();
      
      if (canShareFiles()) {
        const imageBlob = await generateScoreCardImage();
        if (imageBlob) {
          const file = new File([imageBlob], 'age-the-player-results.png', { type: 'image/png' });
          try {
            await navigator.share({ files: [file], title: 'Age The Player - My Results', text: shareText });
            toast.success('Shared successfully!');
            return;
          } catch (err) {
            if ((err as Error).name === 'AbortError') return;
          }
        }
      }
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Age The Player - My Results',
            text: shareText,
            url: window.location.origin
          });
          toast.success('Shared successfully!');
          toast.info('Tap the download button to save your score card image');
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
        }
      }
      
      await copyToClipboard(shareText);
      toast.info('Tap the download button to save your score card image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    triggerHaptic('medium');
    setIsGeneratingImage(true);
    
    try {
      const imageBlob = await generateScoreCardImage();
      if (imageBlob) {
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'age-the-player-results.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Image downloaded!');
      }
    } catch {
      toast.error('Failed to download image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text + '\n' + window.location.origin);
      toast.success('Results copied to clipboard!');
    } catch {
      toast.error('Failed to copy results');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-6"
      >
        <Card className="bg-card/95 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
          <div className="bg-primary/10 p-6 text-center border-b border-white/5">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-display font-bold text-white uppercase mb-1">
              Full Time!
            </h1>
            
            {humanPlayers.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-display font-bold text-yellow-500 uppercase">
                  {isDraw ? "It's a Draw!" : `${winner} Wins!`}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-display uppercase text-white mb-4">Final Standings</h3>
            
            <div className="space-y-3 mb-6">
              {rankedPlayers.map((player, idx) => (
                <motion.div
                  key={player}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                    idx === 0 ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'
                  }`}
                  data-testid={`result-player-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-display font-bold ${idx === 0 ? 'text-primary' : 'text-white/50'}`}>
                      #{idx + 1}
                    </span>
                    <span className={`font-medium ${idx === 0 ? 'text-white' : 'text-white/80'}`}>
                      {player}
                    </span>
                  </div>
                  <span className={`text-2xl font-display font-bold ${idx === 0 ? 'text-primary' : 'text-white'}`}>
                    {playerScores[player] || 0} pts
                  </span>
                </motion.div>
              ))}
            </div>

            <h3 className="text-lg font-display uppercase text-white mb-4">Round Breakdown</h3>
            <div className="flex-1 overflow-auto rounded-lg border border-white/10 bg-background/30 mb-6 max-h-[200px]">
              <Table>
                <TableHeader className="bg-white/5 sticky top-0 z-10">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-xs uppercase font-bold w-[60px]">Rnd</TableHead>
                    <TableHead className="text-xs uppercase font-bold">Footballer</TableHead>
                    <TableHead className="text-right text-xs uppercase font-bold">Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roundResults.map((result, idx) => (
                    <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium text-white">#{result.round + 1}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {result.footballerName}
                      </TableCell>
                      <TableCell className="text-right font-bold text-white">
                        {result.actualAge}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleDownloadImage} 
                variant="outline"
                disabled={isGeneratingImage}
                className="py-6 text-lg font-display uppercase tracking-widest border-white/20 hover:bg-white/10"
                data-testid="button-download"
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button 
                onClick={handleShare} 
                variant="outline"
                disabled={isGeneratingImage}
                className="flex-1 py-6 text-lg font-display uppercase tracking-widest border-white/20 hover:bg-white/10"
                data-testid="button-share"
              >
                <Share2 className="mr-2 w-5 h-5" /> {isGeneratingImage ? '...' : 'Share'}
              </Button>
              <Button 
                onClick={handlePlayAgain} 
                className="flex-1 py-6 text-lg font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-play-again"
              >
                <RefreshCw className="mr-2 w-5 h-5" /> Play Again
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
          <div className="bg-white/5 p-6 border-b border-white/5 flex items-center gap-3">
             <Medal className="w-8 h-8 text-yellow-500" />
             <div>
               <h2 className="text-2xl font-display font-bold text-white uppercase leading-none">Global Leaderboard</h2>
               <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Scouts</p>
             </div>
          </div>
          
          <div className="p-0 flex-1 overflow-auto">
             <Table>
                <TableHeader className="bg-transparent sticky top-0 z-10">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-center w-[50px] text-muted-foreground">#</TableHead>
                    <TableHead className="text-muted-foreground">Player</TableHead>
                    <TableHead className="text-right text-muted-foreground">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : leaderboard.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No scores yet. Be the first!
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaderboard.map((entry, idx) => (
                      <TableRow key={entry.id} className={`border-white/5 hover:bg-white/5 ${humanPlayers.includes(entry.playerName) ? 'bg-primary/10' : ''}`}>
                        <TableCell className="text-center font-display text-lg text-white/50">
                           {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-white">{entry.playerName}</div>
                          <div className="text-[10px] text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-white text-lg">
                          {entry.totalScore}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
          </div>
        </Card>
      </motion.div>

      <div 
        ref={scoreCardRef}
        className="fixed -left-[9999px] top-0 w-[400px] p-6 bg-black"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-white mb-1">AGE THE PLAYER</div>
          <div className="text-sm text-white/60">FULL TIME!</div>
        </div>
        
        {humanPlayers.length > 1 && (
          <div className="text-center mb-4">
            <div className="text-yellow-500 text-xl font-bold">
              {isDraw ? "IT'S A DRAW!" : `${winner} WINS!`}
            </div>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          {rankedPlayers.map((player, idx) => (
            <div 
              key={player}
              className={`flex items-center justify-between rounded-lg px-4 py-2 ${
                idx === 0 ? 'bg-[#1a44ed]/30 border border-[#1a44ed]/50' : 'bg-white/10 border border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xl font-bold ${idx === 0 ? 'text-[#1a44ed]' : 'text-white/50'}`}>
                  #{idx + 1}
                </span>
                <span className="text-white font-medium">{player}</span>
              </div>
              <span className={`text-xl font-bold ${idx === 0 ? 'text-[#1a44ed]' : 'text-white'}`}>
                {playerScores[player] || 0} pts
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <div className="text-xs text-white/50 uppercase mb-2">Round Summary</div>
          <div className="space-y-1">
            {roundResults.slice(0, 5).map((result, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-white/70">{result.footballerName}</span>
                <span className="text-white font-medium">{result.actualAge} yrs</span>
              </div>
            ))}
            {roundResults.length > 5 && (
              <div className="text-white/40 text-xs text-center mt-1">
                +{roundResults.length - 5} more rounds
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-white/40 text-sm">
          {roundResults.length} rounds played
        </div>
      </div>
    </div>
  );
}
