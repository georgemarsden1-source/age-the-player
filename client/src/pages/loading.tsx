import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { motion } from 'framer-motion';
import soccerBall from '@/assets/soccer-ball.png';

const loadingMessages = [
  "Warming up the squad...",
  "Checking the team sheet...",
  "Lacing up the boots...",
  "Inflating the ball...",
  "Setting up the pitch...",
  "Calling the referee...",
  "Reviewing VAR footage...",
  "Stretching the hamstrings...",
];

export default function Loading() {
  const [, setLocation] = useLocation();
  const { status, footballers } = useGameStore();
  const [message] = useState(() => loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);

  useEffect(() => {
    if (status === 'playing' && footballers.length > 0) {
      setLocation('/game');
    }
  }, [status, footballers, setLocation]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-primary/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/20 rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <motion.img
          src={soccerBall}
          alt="Loading"
          className="w-20 h-20 drop-shadow-lg"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
            Loading
          </h2>
          <p className="text-muted-foreground text-lg">
            {message}
          </p>
        </motion.div>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
