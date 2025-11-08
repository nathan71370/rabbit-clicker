import { useState } from 'react';
import { motion } from 'framer-motion';
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
    addToTeam,
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
   */
  const handleSlotClick = (slotIndex: number) => {
    setSelectingSlot(slotIndex);
  };

  /**
   * Handle selecting a rabbit from the modal
   */
  const handleRabbitSelect = (rabbit: Rabbit) => {
    if (selectingSlot === null) return;

    // Remove current rabbit in this slot if exists
    if (activeRabbits[selectingSlot]) {
      removeFromTeam(activeRabbits[selectingSlot].id);
    }

    // Add selected rabbit
    addToTeam(rabbit.id);
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
            <div className="text-sm text-gray-600">Team CPS</div>
            <div className="text-2xl font-bold text-carrot">
              +{formatNumber(teamCPS)}/s
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
                  <motion.button
                    onClick={() => handleSlotClick(slotIndex)}
                    className="w-full h-full min-h-[280px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all flex flex-col items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-6xl text-gray-300">+</div>
                    <div className="text-gray-500 font-semibold">
                      Click to Add Rabbit
                    </div>
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rabbit Selector Modal */}
      {selectingSlot !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectingSlot(null)}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Select a Rabbit</h3>
              <button
                onClick={() => setSelectingSlot(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
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
    </div>
  );
}
