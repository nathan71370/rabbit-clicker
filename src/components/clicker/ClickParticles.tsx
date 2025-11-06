import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Particle {
  id: number;
  x: number;
  y: number;
}

interface ClickParticlesProps {
  particles: Particle[];
  onParticleComplete: (id: number) => void;
}

/**
 * ClickParticles Component
 * Renders animated particles at specified positions for visual feedback
 */
export function ClickParticles({ particles, onParticleComplete }: ClickParticlesProps) {
  const handleAnimationComplete = useCallback(
    (id: number) => {
      onParticleComplete(id);
    },
    [onParticleComplete]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 1,
              scale: 1,
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              opacity: 0,
              scale: 0.5,
              y: particle.y - 80, // Float upward
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => handleAnimationComplete(particle.id)}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: 0,
              top: 0,
            }}
          >
            🥕
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
