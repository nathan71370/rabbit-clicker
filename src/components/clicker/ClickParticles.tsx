import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Physics constant: pixels of downward acceleration
const GRAVITY = 120;

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
 * Helper function to get hue-rotate filter value based on particle color
 */
function getHueRotate(color: string): string {
  if (color === 'light') return 'hue-rotate(10deg)';
  if (color === 'dark') return 'hue-rotate(-10deg)';
  return 'hue-rotate(0deg)';
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
          // Calculate parabolic trajectory using physics: y(t) = y + vy*t + 0.5*g*t²
          // Keyframes at t=0, t=0.5, t=1 for true parabolic motion
          const midX = particle.x + particle.vx * 0.5;
          const midY = particle.y + particle.vy * 0.5 + GRAVITY * 0.125; // 0.5 * GRAVITY * (0.5^2)
          const finalX = particle.x + particle.vx;
          const finalY = particle.y + particle.vy + 0.5 * GRAVITY; // 0.5 * GRAVITY * (1^2)

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
                x: [particle.x, midX, finalX], // Keyframes for parabolic x-motion
                y: [particle.y, midY, finalY], // Keyframes for parabolic y-motion
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
                filter: getHueRotate(particle.color),
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
