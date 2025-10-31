import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { playSound } from '@/utils/sounds';

/**
 * CarrotClicker Component
 * Main clicker button that increments carrot count when clicked
 * Features smooth animations using Framer Motion and click sound effects
 */
export function CarrotClicker() {
  const { carrots, clickPower, click } = useGameStore();

  /**
   * Handle click with sound effect
   */
  const handleClick = () => {
    // Play click sound (non-blocking)
    playSound('/assets/sounds/click.mp3', { volume: 0.3 });

    // Update game state
    click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Carrot Count Display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-carrot">
          {Math.floor(carrots).toLocaleString()}
        </div>
        <div className="text-xl text-gray-600 mt-2">Carrots</div>
      </div>

      {/* Click Button with Framer Motion animations */}
      <motion.button
        onClick={handleClick}
        className="relative group"
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

      {/* Click Power Display */}
      <div className="text-center">
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          Per Click
        </div>
        <div className="text-2xl font-semibold text-carrot">
          +{clickPower.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
