import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useCrateStore } from '@/stores/crateStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { CRATE_TYPES } from '@/game/data/crates';
import { calculateDuplicateCompensation } from '@/game/systems/gacha';
import type { Crate } from '@/types/crate';
import type { Rabbit } from '@/types/rabbit';
import { formatNumber } from '@/utils';
import { CrateOpening } from './CrateOpening';

/**
 * CrateShop Component
 * Displays available crates for purchase and handles crate opening
 */
export function CrateShop() {
  const { carrots, spendCarrots } = useGameStore();
  const { ownedRabbits } = useRabbitStore();
  const {
    openCrate,
    cratesSinceEpic,
    cratesSinceLegendary,
    cratesSinceMythical,
    epicPityThreshold,
    legendaryPityThreshold,
    mythicalPityThreshold,
  } = useCrateStore();

  const [isOpening, setIsOpening] = useState(false);
  const [openedRabbit, setOpenedRabbit] = useState<Rabbit | null>(null);
  const [openedCrate, setOpenedCrate] = useState<Crate | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [xpAmount, setXpAmount] = useState<number>(0);

  /**
   * Handle crate purchase and opening
   */
  const handlePurchase = async (crate: Crate) => {
    // Check if player can afford
    if (!crate.cost.carrots || carrots < crate.cost.carrots) {
      return;
    }

    setIsOpening(true);
    try {
      // Deduct cost (returns false if failed)
      const didSpend = spendCarrots(crate.cost.carrots);
      if (didSpend === false) {
        return;
      }

      // Check if rabbit was already owned before opening
      const rabbitsBefore = new Set(ownedRabbits.keys());

      // Simulate opening delay for anticipation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Open the crate
      const rabbit = await openCrate(crate.type);

      // Check if this is a duplicate (rabbit was already owned before opening)
      const wasDuplicate = rabbitsBefore.has(rabbit.id);

      // Calculate XP amount for duplicates
      const duplicateXP = wasDuplicate ? calculateDuplicateCompensation(rabbit.rarity) : 0;

      setOpenedRabbit(rabbit);
      setOpenedCrate(crate);
      setIsDuplicate(wasDuplicate);
      setXpAmount(duplicateXP);
    } catch (error) {
      // Handle crate opening failure
      console.error('Failed to open crate:', error);
      // TODO: Refund carrots via addCarrots when error handling is implemented
    } finally {
      // Always reset opening state
      setIsOpening(false);
    }
  };

  /**
   * Check if player can afford a crate
   */
  const canAfford = (crate: Crate): boolean => {
    if (!crate.cost.carrots) return false;
    return carrots >= crate.cost.carrots;
  };

  /**
   * Close the animation modal
   */
  const closeResult = () => {
    setOpenedRabbit(null);
    setOpenedCrate(null);
    setIsDuplicate(false);
    setXpAmount(0);
  };

  /**
   * Get pity progress percentage
   */
  const getPityProgress = (
    counter: number,
    threshold: number
  ): { percentage: number; label: string } => {
    const percentage = Math.min((counter / threshold) * 100, 100);
    const remaining = Math.max(threshold - counter, 0);
    return {
      percentage,
      label: remaining === 0 ? 'Guaranteed!' : `${remaining} left`,
    };
  };

  const epicPity = getPityProgress(cratesSinceEpic, epicPityThreshold);
  const legendaryPity = getPityProgress(cratesSinceLegendary, legendaryPityThreshold);
  const mythicalPity = getPityProgress(cratesSinceMythical, mythicalPityThreshold);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="card bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-lg border-none">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎁</span>
          <h2 className="text-3xl font-bold">Crate Shop</h2>
        </div>
        <p className="text-purple-100 text-sm">
          Open crates to collect new rabbits! Better crates have higher odds for rare rabbits.
        </p>

        {/* Pity Progress */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wide opacity-90">Pity Progress</h3>

          {/* Epic Pity */}
          <div className="bg-white/10 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">Epic Guarantee</span>
              <span className="text-xs">{epicPity.label}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-300 h-full transition-all duration-300"
                style={{ width: `${epicPity.percentage}%` }}
              />
            </div>
          </div>

          {/* Legendary Pity */}
          <div className="bg-white/10 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">Legendary Guarantee</span>
              <span className="text-xs">{legendaryPity.label}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-300 h-full transition-all duration-300"
                style={{ width: `${legendaryPity.percentage}%` }}
              />
            </div>
          </div>

          {/* Mythical Pity */}
          <div className="bg-white/10 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">Mythical Guarantee</span>
              <span className="text-xs">{mythicalPity.label}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-pink-300 h-full transition-all duration-300"
                style={{ width: `${mythicalPity.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crate Cards */}
      <div className="flex flex-col gap-4">
        {CRATE_TYPES.map((crate) => {
          const affordable = canAfford(crate);

          return (
            <div
              key={crate.id}
              className={`card transition-all duration-200 ${
                affordable
                  ? 'hover:shadow-lg hover:border-purple-400 hover:-translate-y-0.5 border-2 border-transparent'
                  : 'opacity-70 border-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Icon and Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-5xl flex-shrink-0 p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                      {crate.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-1">
                        {crate.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-snug">
                        {crate.description}
                      </p>
                    </div>
                  </div>

                  {/* Drop Rates */}
                  <div className="mt-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Drop Rates
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(crate.dropRates)
                        .filter(([, rate]) => rate > 0)
                        .map(([rarity, rate]) => (
                          <span
                            key={rarity}
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${getRarityColor(
                              rarity
                            )}`}
                          >
                            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}: {(rate * 100).toFixed(0)}%
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Features */}
                  {crate.features && crate.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {crate.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full"
                        >
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Purchase Section */}
                <div className="flex flex-col items-end gap-2">
                  {/* Cost */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Cost
                    </div>
                    <div className="text-2xl font-bold text-carrot flex items-center gap-1">
                      <span>🥕</span>
                      <span>{formatNumber(crate.cost.carrots || 0)}</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handlePurchase(crate)}
                    disabled={!affordable || isOpening}
                    className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all ${
                      affordable && !isOpening
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg active:scale-95'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isOpening ? 'Opening...' : 'Open Crate'}
                  </button>

                  {!affordable && (
                    <span className="text-xs text-red-600 font-semibold">
                      Need {formatNumber((crate.cost.carrots || 0) - carrots)} more 🥕
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crate Opening Animation */}
      {openedRabbit && openedCrate && (
        <CrateOpening
          crate={openedCrate}
          rabbit={openedRabbit}
          isDuplicate={isDuplicate}
          xpAmount={xpAmount}
          onComplete={closeResult}
        />
      )}
    </div>
  );
}

/**
 * Get Tailwind color classes for rarity
 */
function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-200 text-gray-700';
    case 'uncommon':
      return 'bg-green-200 text-green-700';
    case 'rare':
      return 'bg-blue-200 text-blue-700';
    case 'epic':
      return 'bg-purple-200 text-purple-700';
    case 'legendary':
      return 'bg-yellow-200 text-yellow-700';
    case 'mythical':
      return 'bg-pink-200 text-pink-700';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}
