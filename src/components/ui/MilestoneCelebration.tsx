import { motion, AnimatePresence } from 'framer-motion';
import { useMilestoneStore } from '@/stores/milestoneStore';
import { useEffect, useMemo } from 'react';

/**
 * MilestoneCelebration Component
 * Displays a full-screen celebration when a milestone is reached
 */
export function MilestoneCelebration() {
  const { activeCelebration, hideCelebration } = useMilestoneStore();

  // Generate confetti particles
  const confettiParticles = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        rotation: Math.random() * 720 - 360,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][
          Math.floor(Math.random() * 6)
        ],
      })),
    [activeCelebration]
  );

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (activeCelebration) {
      const timer = setTimeout(() => {
        hideCelebration();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [activeCelebration, hideCelebration]);

  return (
    <AnimatePresence>
      {activeCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Screen flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
            className="absolute inset-0 bg-yellow-300"
          />

          {/* Confetti */}
          {confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                top: '-10%',
                left: `${particle.x}%`,
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              animate={{
                top: '110%',
                opacity: [1, 1, 0],
                rotate: particle.rotation,
                scale: [1, 1.2, 0.8],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeIn',
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: particle.color }}
            />
          ))}

          {/* Central celebration card */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="relative pointer-events-auto bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 border-4 border-yellow-400"
            onClick={hideCelebration}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-200 to-orange-200 opacity-50 blur-xl -z-10" />

            {/* Icon with pulse */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-8xl text-center mb-4"
            >
              {activeCelebration.icon}
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl font-black text-center mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {activeCelebration.title}
            </h2>

            {/* Description */}
            <p className="text-center text-gray-700 text-lg mb-6">
              {activeCelebration.description}
            </p>

            {/* Close button */}
            <button
              onClick={hideCelebration}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Continue
            </button>

            {/* Sparkles */}
            <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">✨</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-spin-slow">🎉</div>
          </motion.div>

          {/* Particle burst from center */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const distance = 200;
            return (
              <motion.div
                key={`burst-${i}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0.5],
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                }}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-8px',
                  marginTop: '-8px',
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
