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
import { PityCounter } from './PityCounter';

/**
 * CrateShop Component
 * Displays available crates for purchase and handles crate opening
 */
export function CrateShop() {
  const { carrots, goldenCarrots, spendCarrots, spendGoldenCarrots } = useGameStore();
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
    // Determine currency type and check if player can afford
    const usesGoldenCarrots = crate.cost.goldenCarrots !== undefined;
    const usesCarrots = crate.cost.carrots !== undefined;

    if (usesGoldenCarrots && (!crate.cost.goldenCarrots || goldenCarrots < crate.cost.goldenCarrots)) {
      return;
    }

    if (usesCarrots && (!crate.cost.carrots || carrots < crate.cost.carrots)) {
      return;
    }

    setIsOpening(true);
    try {
      // Deduct cost based on currency type
      let didSpend = false;

      if (usesGoldenCarrots && crate.cost.goldenCarrots) {
        didSpend = spendGoldenCarrots(crate.cost.goldenCarrots);
      } else if (usesCarrots && crate.cost.carrots) {
        didSpend = spendCarrots(crate.cost.carrots);
      }

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
      // TODO: Refund currency when error handling is implemented
    } finally {
      // Always reset opening state
      setIsOpening(false);
    }
  };

  /**
   * Check if player can afford a crate
   */
  const canAfford = (crate: Crate): boolean => {
    if (crate.cost.goldenCarrots !== undefined) {
      return goldenCarrots >= crate.cost.goldenCarrots;
    }
    if (crate.cost.carrots !== undefined) {
      return carrots >= crate.cost.carrots;
    }
    return false;
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header - Clean design */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">🎁</span>
          <h2 className="text-4xl font-black text-accent">Crate Shop</h2>
        </div>
        <p className="text-base font-bold text-gray-700 mb-4">
          Open crates to collect new rabbits! Better crates have higher odds for rare rabbits.
        </p>

        {/* Pity Progress */}
        <PityCounter
          cratesSinceEpic={cratesSinceEpic}
          cratesSinceLegendary={cratesSinceLegendary}
          cratesSinceMythical={cratesSinceMythical}
          epicPityThreshold={epicPityThreshold}
          legendaryPityThreshold={legendaryPityThreshold}
          mythicalPityThreshold={mythicalPityThreshold}
        />
      </div>

      {/* Crate Cards */}
      <div className="flex flex-col gap-4">
        {CRATE_TYPES.map((crate) => {
          const affordable = canAfford(crate);

          return (
            <div
              key={crate.id}
              className={`bg-white rounded-2xl shadow-md transition-all duration-200 p-4 ${
                affordable
                  ? 'hover:shadow-lg hover:-translate-y-1'
                  : 'opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Icon and Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-5xl flex-shrink-0 p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-md">
                      {crate.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-accent mb-1">
                        {crate.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-700 leading-snug">
                        {crate.description}
                      </p>
                    </div>
                  </div>

                  {/* Drop Rates */}
                  <div className="mt-3">
                    <h4 className="text-xs font-black text-accent uppercase tracking-wide mb-2">
                      Drop Rates
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(crate.dropRates)
                        .filter(([, rate]) => rate > 0)
                        .map(([rarity, rate]) => (
                          <span
                            key={rarity}
                            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm ${getRarityColor(
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
                          className="inline-flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
                        >
                          <span className="text-sm">✓</span> {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Purchase Section */}
                <div className="flex flex-col items-end gap-3">
                  {/* Cost */}
                  <div className="text-right">
                    <div className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
                      Cost
                    </div>
                    {crate.cost.goldenCarrots !== undefined ? (
                      <div className="text-2xl font-black text-primary flex items-center gap-2">
                        <span className="text-xl">🥕✨</span>
                        <span>{formatNumber(crate.cost.goldenCarrots)}</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-black text-carrot flex items-center gap-2">
                        <span className="text-xl">🥕</span>
                        <span>{formatNumber(crate.cost.carrots || 0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handlePurchase(crate)}
                    disabled={!affordable || isOpening}
                    className={`px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                      affordable && !isOpening
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:scale-105'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isOpening ? 'OPENING...' : 'OPEN CRATE'}
                  </button>

                  {!affordable && (
                    <span className="text-xs text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-lg">
                      {crate.cost.goldenCarrots !== undefined ? (
                        <>Need {formatNumber(crate.cost.goldenCarrots - goldenCarrots)} more 🥕✨</>
                      ) : (
                        <>Need {formatNumber((crate.cost.carrots || 0) - carrots)} more 🥕</>
                      )}
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
