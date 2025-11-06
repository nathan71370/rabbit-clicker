import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { playSound } from '@/utils/sounds';
import { formatNumber } from '@/utils';
import { ClickParticles, type Particle } from './ClickParticles';

/**
 * CarrotClicker Component
 * Main clicker button that increments carrot count when clicked
 * Features smooth animations using Framer Motion and click sound effects
 */
export function CarrotClicker() {
  const { carrots, clickPower, carrotsPerSecond, click } = useGameStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Handle click with sound effect and particle spawning
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Play click sound (non-blocking)
    playSound('/assets/sounds/click.mp3', { volume: 0.3 });

    // Update game state
    click();

    // Spawn particles at click position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Spawn 3-5 particles
      const particleCount = 3 + Math.floor(Math.random() * 3);
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: performance.now() + i, // Microsecond precision + index for guaranteed uniqueness
          x: x + (Math.random() - 0.5) * 40, // Random spread
          y: y + (Math.random() - 0.5) * 40,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    }
  };

  /**
   * Remove particle after animation completes
   */
  const handleParticleComplete = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Carrot Count Display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-carrot">
          {formatNumber(Math.floor(carrots))}
        </div>
        <div className="text-xl text-gray-600 mt-2">Carrots</div>
      </div>

      {/* Click Button with Framer Motion animations */}
      <div className="relative">
        <motion.button
          ref={buttonRef}
          onClick={handleClick}
          className="group"
          aria-label="Click to earn carrots"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 17,
          }}
        >
          {/* Placeholder carrot button - will be replaced with actual image in RAB-40 */}
          <div className="w-48 h-48 bg-gradient-to-br from-carrot-light to-carrot-dark rounded-full shadow-lg flex items-center justify-center">
            <span className="text-6xl">🥕</span>
          </div>
        </motion.button>

        {/* Click Particles Overlay - outside button to prevent scaling */}
        <ClickParticles particles={particles} onParticleComplete={handleParticleComplete} />
      </div>

      {/* Production Stats Display */}
      <div className="flex gap-8">
        {/* Click Power Display */}
        <div className="text-center">
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Per Click
          </div>
          <div className="text-2xl font-semibold text-carrot">
            +{formatNumber(clickPower)}
          </div>
        </div>

        {/* CPS Display */}
        <div className="text-center">
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Per Second
          </div>
          <div className="text-2xl font-semibold text-carrot">
            +{formatNumber(carrotsPerSecond)}
          </div>
        </div>
      </div>
    </div>
  );
}
