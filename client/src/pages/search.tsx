import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { searchPlayers } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ArrowLeft, User, MapPin, Shirt, Flag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '@shared/schema';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const players = await searchPlayers(query);
          setResults(players);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        }
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            className="text-white/60 hover:text-white"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-display font-bold text-white uppercase">
            Player Search
          </h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a player..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-background/50 border-white/10 focus-visible:ring-primary"
            data-testid="input-search-player"
            autoFocus
          />
        </div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-8">
            Searching...
          </div>
        )}

        {!isLoading && query.length >= 2 && results.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No players found for "{query}"
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedPlayer ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PlayerProfile 
                player={selectedPlayer} 
                onBack={() => setSelectedPlayer(null)} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {results.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    className="bg-card/80 border-white/10 p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedPlayer(player)}
                    data-testid={`player-result-${player.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                        {player.imageUrl ? (
                          <img 
                            src={player.imageUrl} 
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {player.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {player.team || 'Unknown Team'} • {player.position || 'Unknown Position'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{player.age}</div>
                        <div className="text-xs text-muted-foreground uppercase">years old</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!query && (
          <div className="text-center text-muted-foreground py-12">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Enter a player name to search</p>
            <p className="text-sm mt-1">Search through 850+ professional footballers</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function PlayerProfile({ player, onBack }: { player: Player; onBack: () => void }) {
  return (
    <Card className="bg-card/90 border-white/10 overflow-hidden">
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 text-white/60 hover:text-white -ml-2"
          data-testid="button-back-results"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to results
        </Button>
        
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-white/10 overflow-hidden flex-shrink-0 border-4 border-primary/30">
            {player.imageUrl ? (
              <img 
                src={player.imageUrl} 
                alt={player.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-white" data-testid="text-player-name">
              {player.name}
            </h2>
            <p className="text-lg text-muted-foreground mt-1">
              {player.team || 'Unknown Team'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ProfileItem 
            icon={<Calendar className="w-5 h-5" />} 
            label="Age" 
            value={`${player.age} years old`}
            testId="text-player-age"
          />
          <ProfileItem 
            icon={<Shirt className="w-5 h-5" />} 
            label="Position" 
            value={player.position || ''}
            testId="text-player-position"
          />
          <ProfileItem 
            icon={<Flag className="w-5 h-5" />} 
            label="Nationality" 
            value={player.nationality || ''}
            testId="text-player-nationality"
          />
          <ProfileItem 
            icon={<MapPin className="w-5 h-5" />} 
            label="Team" 
            value={player.team || ''}
            testId="text-player-team"
          />
        </div>

        {player.birthDate && (
          <div className="pt-4 border-t border-white/10">
            <span className="text-sm text-muted-foreground">Birth Date: </span>
            <span className="text-white" data-testid="text-player-birthdate">
              {new Date(player.birthDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

function ProfileItem({ 
  icon, 
  label, 
  value,
  testId 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  testId?: string;
}) {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
      <div className="text-primary mt-0.5">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-white font-medium" data-testid={testId}>{value}</div>
      </div>
    </div>
  );
}
