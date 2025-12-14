import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { formatNumber } from '@/utils/formatNumber';
import { ProductionBreakdown } from '@/components/clicker/ProductionBreakdown';

/**
 * ProductionDisplay Component
 * Displays the current carrots-per-second (CPS) production rate prominently
 * Features animated updates when the value changes
 * Shows detailed breakdown tooltip on hover
 */
export function ProductionDisplay() {
  const carrotsPerSecond = useGameStore((state) => state.carrotsPerSecond);

  return (
    <div className="bg-white rounded-3xl shadow-md border border-green-500 overflow-hidden">
      <div className="bg-gradient-to-br from-green-400 to-green-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📊</span>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-wide">
              Production
            </h3>
            <p className="text-sm font-bold text-green-100">Carrots per Second</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* CPS Value with Animation and Tooltip */}
        <div className="relative group">
          <motion.div
            key={carrotsPerSecond}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 25,
            }}
            className="text-center cursor-help"
          >
            <div className="text-6xl font-black text-green-600">
              {formatNumber(carrotsPerSecond)}
            </div>
            <div className="text-lg font-bold text-accent mt-2 uppercase tracking-wider">
              per second
            </div>
          </motion.div>

          {/* Tooltip - appears on hover */}
          <ProductionBreakdown />
        </div>
      </div>
    </div>
  );
}
