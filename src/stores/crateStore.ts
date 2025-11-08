import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CrateType } from '@/types/crate';
import type { Rabbit, Rarity } from '@/types/rabbit';
import { getCrateByType } from '@/game/data/crates';

/**
 * Crate Store State Interface
 * Manages crate opening, pity system, and gacha mechanics
 */
interface CrateState {
  // Pity System Tracking
  cratesSinceEpic: number;
  cratesSinceLegendary: number;
  cratesSinceMythical: number;

  // Recent Drops History (last 10)
  recentDrops: Rabbit[];

  // Pity Thresholds (guaranteed drops)
  epicPityThreshold: number;
  legendaryPityThreshold: number;
  mythicalPityThreshold: number;

  // Actions
  openCrate: (crateType: CrateType) => Promise<Rabbit>;
  updatePity: (rarity: Rarity) => void;
  addToRecentDrops: (rabbit: Rabbit) => void;
  resetPityCounters: () => void;
}

/**
 * Crate store using Zustand
 * Manages gacha mechanics with pity system
 */
export const useCrateStore = create<CrateState>()(
  persist(
    (set, get) => ({
      // Initial state
      cratesSinceEpic: 0,
      cratesSinceLegendary: 0,
      cratesSinceMythical: 0,
      recentDrops: [],

      // Pity thresholds (guaranteed drops after X attempts without that rarity)
      epicPityThreshold: 50, // Guaranteed epic every 50 crates without epic
      legendaryPityThreshold: 100, // Guaranteed legendary every 100 crates without legendary
      mythicalPityThreshold: 200, // Guaranteed mythical every 200 crates without mythical

      /**
       * Open a crate and get a random rabbit
       * @param crateType - Type of crate to open
       * @returns Promise resolving to the rabbit obtained
       */
      openCrate: async (crateType: CrateType): Promise<Rabbit> => {
        const crate = getCrateByType(crateType);
        if (!crate) {
          throw new Error(`Crate type ${crateType} not found`);
        }

        const state = get();

        // Check pity system first
        let guaranteedRarity: Rarity | null = null;

        if (state.cratesSinceMythical >= state.mythicalPityThreshold) {
          guaranteedRarity = 'mythical';
        } else if (state.cratesSinceLegendary >= state.legendaryPityThreshold) {
          guaranteedRarity = 'legendary';
        } else if (state.cratesSinceEpic >= state.epicPityThreshold) {
          guaranteedRarity = 'epic';
        }

        // Determine rarity
        let rarity: Rarity;
        if (guaranteedRarity) {
          rarity = guaranteedRarity;
        } else {
          // Roll for rarity based on crate drop rates
          rarity = rollRarity(crate.dropRates);
        }

        // TODO: Once rabbit pool is implemented, select a random rabbit of the rolled rarity
        // For now, create a placeholder rabbit
        const rabbit: Rabbit = {
          id: `rabbit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Rabbit`,
          rarity,
          description: `A ${rarity} rabbit from ${crate.name}`,
          baseCPS: getRarityBaseCPS(rarity),
          level: 1,
          experience: 0,
          isActive: false,
          obtainedAt: Date.now(),
          favoriteFood: 'Carrots',
          image: '🐰',
        };

        // Update pity counters
        get().updatePity(rarity);

        // Add to recent drops
        get().addToRecentDrops(rabbit);

        return rabbit;
      },

      /**
       * Update pity counters based on obtained rarity
       * @param rarity - Rarity of rabbit obtained
       */
      updatePity: (rarity: Rarity) => {
        set((state) => {
          const updates: Partial<CrateState> = {};

          // Increment all pity counters
          updates.cratesSinceEpic = state.cratesSinceEpic + 1;
          updates.cratesSinceLegendary = state.cratesSinceLegendary + 1;
          updates.cratesSinceMythical = state.cratesSinceMythical + 1;

          // Reset counters for rarities at or above what was obtained
          if (rarity === 'mythical') {
            updates.cratesSinceMythical = 0;
            updates.cratesSinceLegendary = 0;
            updates.cratesSinceEpic = 0;
          } else if (rarity === 'legendary') {
            updates.cratesSinceLegendary = 0;
            updates.cratesSinceEpic = 0;
          } else if (rarity === 'epic') {
            updates.cratesSinceEpic = 0;
          }

          return updates as Partial<CrateState>;
        });
      },

      /**
       * Add a rabbit to recent drops history (keeps last 10)
       * @param rabbit - Rabbit to add to history
       */
      addToRecentDrops: (rabbit: Rabbit) => {
        set((state) => {
          const newRecentDrops = [rabbit, ...state.recentDrops].slice(0, 10);
          return { recentDrops: newRecentDrops };
        });
      },

      /**
       * Reset all pity counters (for testing or special events)
       */
      resetPityCounters: () => {
        set({
          cratesSinceEpic: 0,
          cratesSinceLegendary: 0,
          cratesSinceMythical: 0,
        });
      },
    }),
    {
      name: 'rabbit-clicker-crate-storage',
      version: 1,
    }
  )
);

/**
 * Helper: Roll for rarity based on drop rate probabilities
 * @param dropRates - Drop rate table from crate
 * @returns Rolled rarity
 */
function rollRarity(dropRates: Record<Rarity, number>): Rarity {
  const roll = Math.random();
  let cumulative = 0;

  const rarities: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];

  for (const rarity of rarities) {
    const rate = dropRates[rarity] ?? 0;
    cumulative += rate;
    if (rate > 0 && roll < cumulative) {
      return rarity;
    }
  }
  // Fallback to common (should never happen if drop rates sum to 1.0)
  return 'common';
}

/**
 * Helper: Get base CPS for a rarity tier
 * @param rarity - Rabbit rarity
 * @returns Base CPS value
 */
function getRarityBaseCPS(rarity: Rarity): number {
  const rarityBaseCPS: Record<Rarity, number> = {
    common: 1,
    uncommon: 3,
    rare: 10,
    epic: 30,
    legendary: 100,
    mythical: 500,
  };

  return rarityBaseCPS[rarity];
}
