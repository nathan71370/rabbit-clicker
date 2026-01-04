import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRabbitStore } from '@/stores/rabbitStore';
import { RabbitCard } from './RabbitCard';
import { formatNumber } from '@/utils';
import type { Rabbit } from '@/types/rabbit';

/**
 * RabbitTeam Component
 * Displays and manages the active rabbit team
 * Shows team slots, allows adding/removing rabbits, and displays team CPS
 */
export function RabbitTeam() {
  const {
    activeTeam,
    maxTeamSize,
    ownedRabbits,
    getActiveRabbits,
    getTeamCPS,
    setActiveTeam,
    removeFromTeam,
  } = useRabbitStore();

  const [selectingSlot, setSelectingSlot] = useState<number | null>(null);

  const activeRabbits = getActiveRabbits();
  const teamCPS = getTeamCPS();

  // Get available rabbits (owned but not in team)
  const availableRabbits = Array.from(ownedRabbits.values()).filter(
    (rabbit) => !activeTeam.includes(rabbit.id)
  );

  /**
   * Handle clicking a team slot (empty or filled)
   * Only allow clicking filled slots or the first empty slot to prevent gaps
   */
  const handleSlotClick = (slotIndex: number) => {
    // Only allow clicking filled slots (for replacement) or the first empty slot
    if (slotIndex > activeTeam.length) {
      return; // Can't fill gaps - team is compact
    }
    setSelectingSlot(slotIndex);
  };

  /**
   * Handle selecting a rabbit from the modal
   */
  const handleRabbitSelect = (rabbit: Rabbit) => {
    if (selectingSlot === null) return;

    // Build new team array with in-place replacement
    const newTeam = [...activeTeam];

    // If slot is filled, replace the ID at that index
    // If slot is empty, we need to fill gaps first
    if (selectingSlot < newTeam.length) {
      // Replace existing rabbit at this slot
      newTeam[selectingSlot] = rabbit.id;
    } else {
      // Filling an empty slot - append to end
      newTeam.push(rabbit.id);
    }

    // Update team using setActiveTeam for in-place replacement
    setActiveTeam(newTeam);
    setSelectingSlot(null);
  };

  /**
   * Handle removing a rabbit from a slot
   */
  const handleRemove = (rabbit: Rabbit, event: React.MouseEvent) => {
    event.stopPropagation();
    removeFromTeam(rabbit.id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Active Team</h2>
            <p className="text-lg text-gray-600 mt-1">
              {activeTeam.length}/{maxTeamSize} Slots Filled
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Team Carrots/s</div>
            <div className="text-2xl font-bold text-carrot">
              +{formatNumber(teamCPS)}
            </div>
          </div>
        </div>

        {/* Team Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: maxTeamSize }).map((_, slotIndex) => {
            const rabbit = activeRabbits[slotIndex];

            return (
              <div key={slotIndex} className="relative">
                {rabbit ? (
                  // Filled slot
                  <div className="relative">
                    <RabbitCard
                      rabbit={rabbit}
                      isOwned={true}
                      isActive={true}
                      onClick={() => handleSlotClick(slotIndex)}
                      className="cursor-pointer"
                    />
                    {/* Remove button */}
                    <button
                      onClick={(e) => handleRemove(rabbit, e)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors z-10"
                      aria-label="Remove rabbit from team"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  // Empty slot
                  (() => {
                    const isGapSlot = slotIndex > activeTeam.length;
                    return (
                      <motion.button
                        onClick={() => handleSlotClick(slotIndex)}
                        disabled={isGapSlot}
                        className={`w-full h-full min-h-[280px] border-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-4 shadow-lg ${
                          isGapSlot
                            ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                            : 'border-gray-800 btn-primary cursor-pointer'
                        }`}
                        whileHover={isGapSlot ? {} : { scale: 1.02 }}
                        whileTap={isGapSlot ? {} : { scale: 0.98 }}
                        aria-disabled={isGapSlot}
                        title={isGapSlot ? 'Fill previous slots first' : 'Click to Add Rabbit'}
                      >
                        <div className={`text-7xl ${isGapSlot ? 'text-gray-400' : 'text-accent'}`}>+</div>
                        <div className={`font-bold text-base text-center px-4 ${isGapSlot ? 'text-gray-500' : 'text-accent'}`}>
                          {isGapSlot ? 'Fill previous slots first' : 'Click to Add Rabbit'}
                        </div>
                      </motion.button>
                    );
                  })()
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rabbit Selector Modal */}
      <AnimatePresence>
        {selectingSlot !== null && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: '#FFF4E6' }}
            onClick={() => setSelectingSlot(null)}
          >
            <motion.div
              key="rabbit-selector"
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border-4 border-gray-800"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-gray-800">Select a Rabbit</h3>
              <button
                onClick={() => setSelectingSlot(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-2xl font-bold transition-all"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {availableRabbits.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableRabbits.map((rabbit) => (
                  <RabbitCard
                    key={rabbit.id}
                    rabbit={rabbit}
                    isOwned={true}
                    isActive={false}
                    onClick={() => handleRabbitSelect(rabbit)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🐰</div>
                <p className="text-xl text-gray-600">No rabbits available</p>
                <p className="text-sm text-gray-500 mt-2">
                  All your rabbits are already in the team!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
