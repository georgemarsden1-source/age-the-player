import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '@/lib/store';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    if (status === 'playing' && footballers.length > 0) {
      setLocation('/game');
    }
  }, [status, footballers, setLocation]);

  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-primary/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/20 rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <motion.div
          className="relative"
          animate={{ 
            y: [0, -30, 0],
            rotateX: [0, 360]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 100 100" 
            className="drop-shadow-lg"
          >
            <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="2"/>
            <path
              d="M50 2 L50 20 M50 80 L50 98 M2 50 L20 50 M80 50 L98 50"
              stroke="#333"
              strokeWidth="2"
            />
            <polygon
              points="50,15 62,35 58,55 42,55 38,35"
              fill="#333"
            />
            <polygon
              points="15,45 35,38 42,55 35,72 15,65"
              fill="#333"
            />
            <polygon
              points="85,45 65,38 58,55 65,72 85,65"
              fill="#333"
            />
            <polygon
              points="25,80 42,68 58,68 75,80 60,95 40,95"
              fill="#333"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
            Loading
          </h2>
          <motion.p 
            key={randomMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground text-lg"
          >
            {randomMessage}
          </motion.p>
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
