import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number; // Horizontal velocity
  vy: number; // Vertical velocity
  rotation: number; // Initial rotation
  color: string; // Particle color
  size: number; // Particle size variation
}

interface ClickParticlesProps {
  particles: Particle[];
  onParticleComplete: (id: number) => void;
}

/**
 * ClickParticles Component
 * Renders polished animated particles with physics-based movement,
 * rotation, color variation, and smooth fading
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
        {particles.map((particle) => {
          // Calculate final position based on physics (velocity + gravity)
          const gravity = 120; // Pixels of downward acceleration
          const finalX = particle.x + particle.vx;
          const finalY = particle.y + particle.vy + gravity;

          return (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 1,
                scale: particle.size,
                x: particle.x,
                y: particle.y,
                rotate: particle.rotation,
              }}
              animate={{
                opacity: 0,
                scale: 0.3,
                x: finalX,
                y: finalY,
                rotate: particle.rotation + (particle.vx > 0 ? 360 : -360), // Rotate based on direction
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth arc
                opacity: {
                  duration: 0.7,
                  ease: 'easeOut',
                },
              }}
              onAnimationComplete={() => handleAnimationComplete(particle.id)}
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: 0,
                fontSize: `${particle.size * 24}px`,
                filter: `hue-rotate(${particle.color === 'light' ? '10deg' : particle.color === 'dark' ? '-10deg' : '0deg'})`,
              }}
            >
              🥕
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
