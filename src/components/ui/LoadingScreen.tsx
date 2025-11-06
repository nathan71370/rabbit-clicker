import { motion } from 'framer-motion';

/**
 * LoadingScreen Component
 * Displays loading screen while game data is being restored
 */
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Loading Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="text-6xl mb-4"
        >
          🥕
        </motion.div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Loading Game...
        </h2>
        <p className="text-gray-600">Restoring your rabbit empire</p>
      </motion.div>
    </div>
  );
}
