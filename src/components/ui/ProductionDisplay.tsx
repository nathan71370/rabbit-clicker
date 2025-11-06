import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { formatNumber } from '@/utils/formatNumber';

/**
 * ProductionDisplay Component
 * Displays the current carrots-per-second (CPS) production rate prominently
 * Features animated updates when the value changes
 */
export function ProductionDisplay() {
  const carrotsPerSecond = useGameStore((state) => state.carrotsPerSecond);

  return (
    <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300">
      <div className="flex items-center justify-between p-6">
        {/* Label */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Production
          </span>
          <span className="text-xs text-gray-500">Carrots per Second</span>
        </div>

        {/* CPS Value with Animation */}
        <motion.div
          key={carrotsPerSecond}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
          className="text-right"
        >
          <div className="text-4xl font-bold text-green-700">
            {formatNumber(carrotsPerSecond)}
          </div>
          <div className="text-sm text-gray-500 mt-1">per second</div>
        </motion.div>
      </div>
    </div>
  );
}
