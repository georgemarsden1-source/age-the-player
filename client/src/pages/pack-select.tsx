import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { getRandomPlayers } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Package, Star, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const packs = [
  {
    id: 'modern',
    name: 'Modern Era',
    description: '800+ current & recently retired players',
    icon: Star,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
  },
  {
    id: '80s',
    name: '80s Icons',
    description: 'Legends from the 1980s',
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  {
    id: '90s',
    name: '90s Icons',
    description: 'Legends from the 1990s',
    icon: Clock,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    id: '00s',
    name: '00s Icons',
    description: 'Legends from the 2000s',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'alltime',
    name: 'All-Time Icons',
    description: 'The greatest of all time',
    icon: Trophy,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
];

export default function PackSelect() {
  const [, setLocation] = useLocation();
  const { setSelectedPack, startGame, setFootballers, humanPlayers } = useGameStore();
  const numRounds = useGameStore((state) => state.footballers.length || 10);

  const handleSelectPack = async (packId: string) => {
    setSelectedPack(packId);
    startGame();
    setLocation('/loading');
    
    try {
      const storedRounds = sessionStorage.getItem('numRounds');
      const rounds = storedRounds ? parseInt(storedRounds) : 10;
      const players = await getRandomPlayers(rounds, packId);
      if (!players || players.length === 0) {
        throw new Error('No players available in this pack');
      }
      setFootballers(players);
    } catch (error: any) {
      const errorMsg = error?.message || error?.toString() || 'Unknown error';
      console.error('Failed to fetch players:', errorMsg);
      toast.error('Failed to load players. Please try again.');
      useGameStore.setState({ status: 'idle' });
      setLocation('/pack-select');
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
        <Card className="bg-card/90 backdrop-blur-md border-primary/20 p-6 shadow-2xl shadow-primary/10">
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-full flex items-center justify-between mb-2">
              <button
                onClick={() => setLocation('/setup')}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Back</span>
              </button>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Choose Pack
              </h2>
              <div className="w-16"></div>
            </div>

            <p className="text-muted-foreground">
              Select a player pack to play
            </p>

            <div className="w-full space-y-3">
              {packs.map((pack) => {
                const Icon = pack.icon;
                return (
                  <motion.div
                    key={pack.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleSelectPack(pack.id)}
                      variant="outline"
                      className={`w-full py-6 h-auto flex items-center justify-start gap-4 ${pack.borderColor} hover:${pack.bgColor} transition-all`}
                      data-testid={`button-pack-${pack.id}`}
                    >
                      <div className={`p-2 rounded-lg ${pack.bgColor}`}>
                        <Icon className={`w-6 h-6 ${pack.color}`} />
                      </div>
                      <div className="text-left">
                        <div className="font-display text-lg uppercase tracking-wide text-white">
                          {pack.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {pack.description}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
