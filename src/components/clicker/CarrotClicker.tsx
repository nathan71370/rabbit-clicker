import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
// import { playSound } from '@/utils/sounds'; // TODO: Re-enable when click sound is fixed
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
    // TODO: Re-enable click sound with better audio pooling/limiting system
    // Current issue: Even with throttling, rapid clicking causes freeze and audio playback queue
    // playSound('/assets/sounds/click.mp3', { volume: 0.3, throttle: 150 });

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
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Carrot Count Display - Clean and prominent */}
      <div className="text-center bg-white rounded-3xl px-8 py-6 shadow-md">
        <div className="text-7xl font-black text-carrot tracking-tight">
          {formatNumber(Math.floor(carrots))}
        </div>
        <div className="text-2xl font-bold text-accent mt-2 uppercase tracking-wider">
          Carrots
        </div>
      </div>

      {/* Click Button with Framer Motion animations */}
      <div className="relative">
        <motion.button
          ref={buttonRef}
          onClick={handleClick}
          className="group"
          aria-label="Click to earn carrots"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 17,
          }}
        >
          {/* Carrot button with clean shadow */}
          <div className="w-56 h-56 bg-gradient-to-br from-carrot-light via-carrot to-carrot-dark rounded-full shadow-xl flex items-center justify-center p-10 transition-all group-hover:shadow-2xl">
            <img
              src="/assets/images/icons/carrot.svg"
              alt="Carrot"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </motion.button>

        {/* Click Particles Overlay - outside button to prevent scaling */}
        <ClickParticles particles={particles} onParticleComplete={handleParticleComplete} />
      </div>

      {/* Production Stats Display - Bold cards */}
      <div className="flex gap-6">
        {/* Click Power Display */}
        <div className="text-center bg-white rounded-2xl px-6 py-4 shadow-bold border-3 border-primary min-w-[140px]">
          <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
            Per Click
          </div>
          <div className="text-3xl font-black text-carrot">
            +{formatNumber(clickPower)}
          </div>
        </div>

        {/* CPS Display */}
        <div className="text-center bg-white rounded-2xl px-6 py-4 shadow-bold border-3 border-primary min-w-[140px]">
          <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
            Per Second
          </div>
          <div className="text-3xl font-black text-carrot">
            +{formatNumber(carrotsPerSecond)}
          </div>
        </div>
      </div>
    </div>
  );
}
