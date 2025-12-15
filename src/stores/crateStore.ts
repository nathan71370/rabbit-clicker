import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CrateType } from '@/types/crate';
import type { Rabbit, Rarity } from '@/types/rabbit';
import {
  rollRarity,
  selectRabbit,
  isDuplicate,
  calculateDuplicateCompensation,
  createRabbitInstance,
  PITY_THRESHOLDS,
  type PityCounters,
} from '@/game/systems/gacha';
import { useRabbitStore } from './rabbitStore';

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
 * Initial crate store state values
 * Used for store creation and state reset
 */
const getInitialCrateState = () => ({
  cratesSinceEpic: 0,
  cratesSinceLegendary: 0,
  cratesSinceMythical: 0,
  recentDrops: [],
  epicPityThreshold: PITY_THRESHOLDS.epic,
  legendaryPityThreshold: PITY_THRESHOLDS.legendary,
  mythicalPityThreshold: PITY_THRESHOLDS.mythical,
});

/**
 * Crate store using Zustand
 * Manages gacha mechanics with pity system
 */
export const useCrateStore = create<CrateState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...getInitialCrateState(),

      /**
       * Open a crate and get a random rabbit
       * @param crateType - Type of crate to open
       * @returns Promise resolving to the rabbit obtained
       */
      openCrate: async (crateType: CrateType): Promise<Rabbit> => {
        const state = get();

        // Get owned rabbits from rabbit store
        const ownedRabbits = useRabbitStore.getState().ownedRabbits;

        // Build pity counters object
        const pityCounters: PityCounters = {
          cratesSinceEpic: state.cratesSinceEpic,
          cratesSinceLegendary: state.cratesSinceLegendary,
          cratesSinceMythical: state.cratesSinceMythical,
        };

        // Roll for rarity using gacha system (includes pity check)
        const rarity = rollRarity(crateType, pityCounters);

        // Select rabbit from pool (favors unowned)
        const rabbitData = selectRabbit(rarity, ownedRabbits);

        if (!rabbitData) {
          throw new Error(`No rabbits available for rarity: ${rarity}`);
        }

        // Check if this is a duplicate
        const isRabbitDuplicate = isDuplicate(rabbitData.id, ownedRabbits);

        // Create rabbit instance
        const rabbit = createRabbitInstance(rabbitData, isRabbitDuplicate);

        // If duplicate, award XP compensation
        if (isRabbitDuplicate) {
          const xpCompensation = calculateDuplicateCompensation(rarity);
          useRabbitStore.getState().addRabbitXP(xpCompensation);
          console.log(`Duplicate ${rabbit.name}! Awarded ${xpCompensation} XP`);
        } else {
          // Add new rabbit to collection
          useRabbitStore.getState().addRabbit(rabbit);
        }

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
 * Get initial state for crate store
 * Used by prestige system to reset crate state
 * @returns Initial state object (without actions)
 */
(useCrateStore as any).getInitialState = getInitialCrateState;
