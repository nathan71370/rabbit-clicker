import { motion, AnimatePresence } from 'framer-motion';

interface SavingIndicatorProps {
  isSaving: boolean;
}

/**
 * SavingIndicator Component
 * Displays a subtle "Saving..." indicator when auto-save is active
 */
export function SavingIndicator({ isSaving }: SavingIndicatorProps) {
  return (
    <AnimatePresence>
      {isSaving && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold z-[60]"
        >
          Saving...
        </motion.div>
      )}
    </AnimatePresence>
  );
}
