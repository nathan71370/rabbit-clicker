import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Prestige Store State Interface
 * Manages prestige system state including Golden Seeds and lifetime stats
 * This data persists across all runs and is never reset by prestige
 */
interface PrestigeState {
  // State
  /** Number of Golden Seeds earned from all prestiges */
  goldenSeeds: number;
  /** Total number of times player has prestiged */
  prestigeCount: number;
  /** Total carrots earned across all runs (lifetime) */
  totalLifetimeCarrots: number;

  // Actions
  /** Calculate how many Golden Seeds would be earned from current run */
  calculateGoldenSeeds: (currentRunCarrots: number) => number;
  /** Perform prestige and award Golden Seeds */
  performPrestige: (currentRunCarrots: number) => number;
  /** Get the total prestige bonus multiplier from Golden Seeds */
  getPrestigeBonus: () => number;
  /** Check if player can prestige (has 1 billion+ lifetime carrots in current run) */
  canPrestige: (currentRunCarrots: number) => boolean;
  /** Add carrots to total lifetime counter (for special cases only - see performPrestige) */
  addLifetimeCarrots: (amount: number) => void;
}

/**
 * Prestige unlock threshold
 * Player must earn this many carrots in current run to unlock prestige
 */
const PRESTIGE_UNLOCK_THRESHOLD = 1000000000; // 1 billion

/**
 * Golden Seed bonus per seed
 * Each Golden Seed provides +10% to all carrot production
 */
const GOLDEN_SEED_BONUS_PERCENT = 10;

/**
 * Prestige Store using Zustand
 * Handles prestige system, Golden Seeds, and lifetime progression
 * This store persists separately from run data (gameStore) and is never reset
 */
export const usePrestigeStore = create<PrestigeState>()(
  persist(
    (set, get) => ({
      // Initial state
      goldenSeeds: 0,
      prestigeCount: 0,
      totalLifetimeCarrots: 0,

      /**
       * Calculate how many Golden Seeds would be earned from prestiging
       * Formula: sqrt(currentRunCarrots / 1,000,000,000)
       * @param currentRunCarrots - Total carrots earned in current run
       * @returns Number of Golden Seeds that would be earned (floored)
       */
      calculateGoldenSeeds: (currentRunCarrots: number) => {
        if (!Number.isFinite(currentRunCarrots) || currentRunCarrots < PRESTIGE_UNLOCK_THRESHOLD) {
          return 0;
        }

        // Formula from GAME_DESIGN.md: sqrt(Lifetime Carrots / 1,000,000,000)
        const goldenSeeds = Math.sqrt(currentRunCarrots / PRESTIGE_UNLOCK_THRESHOLD);
        return Math.floor(goldenSeeds);
      },

      /**
       * Perform prestige and award Golden Seeds
       * This adds Golden Seeds to the player's total and increments prestige count
       * Note: This function does NOT reset game state - that should be handled by the caller
       * @param currentRunCarrots - Total carrots earned in current run
       * @returns Number of Golden Seeds earned from this prestige
       */
      performPrestige: (currentRunCarrots: number) => {
        const state = get();

        // Calculate Golden Seeds for this prestige
        const newGoldenSeeds = state.calculateGoldenSeeds(currentRunCarrots);

        if (newGoldenSeeds === 0) {
          console.warn('Cannot prestige: insufficient carrots');
          return 0;
        }

        // Update prestige stats
        set({
          goldenSeeds: state.goldenSeeds + newGoldenSeeds,
          prestigeCount: state.prestigeCount + 1,
          totalLifetimeCarrots: state.totalLifetimeCarrots + currentRunCarrots,
        });

        console.log(
          `Prestige performed! Earned ${newGoldenSeeds} Golden Seeds (Total: ${state.goldenSeeds + newGoldenSeeds})`
        );

        return newGoldenSeeds;
      },

      /**
       * Get the total prestige bonus multiplier from Golden Seeds
       * Each Golden Seed provides +10% bonus (multiplicative)
       * @returns Multiplier to apply to all carrot production (e.g., 1.3 = +30%)
       */
      getPrestigeBonus: () => {
        const state = get();
        // Each Golden Seed adds 10% bonus
        // Formula: 1 + (goldenSeeds * 0.10)
        // Example: 3 Golden Seeds = 1 + (3 * 0.10) = 1.30 = +30%
        return 1 + state.goldenSeeds * (GOLDEN_SEED_BONUS_PERCENT / 100);
      },

      /**
       * Check if player can prestige
       * Requires earning at least 1 billion carrots in current run
       * @param currentRunCarrots - Total carrots earned in current run
       * @returns true if player can prestige, false otherwise
       */
      canPrestige: (currentRunCarrots: number) => {
        return (
          Number.isFinite(currentRunCarrots) && currentRunCarrots >= PRESTIGE_UNLOCK_THRESHOLD
        );
      },

      /**
       * Add carrots to total lifetime counter
       *
       * ⚠️ WARNING: This method should NOT be called during normal gameplay!
       *
       * The totalLifetimeCarrots counter is automatically updated by performPrestige()
       * when a prestige occurs (see line 94). Calling this method during normal gameplay
       * will cause double-counting of carrots.
       *
       * This method is reserved for special cases only:
       * - Admin/debug commands to manually adjust lifetime totals
       * - Data corrections or migrations
       * - Future features that grant bonus lifetime carrots outside of prestige
       *
       * During a run, carrots are tracked in gameStore.lifetimeCarrots (current run only).
       * When prestiging, performPrestige() adds the run's total to this global counter.
       *
       * @param amount - Number of carrots to add to lifetime total
       * @see performPrestige - Line 94 where totalLifetimeCarrots is normally updated
       */
      addLifetimeCarrots: (amount: number) => {
        if (!Number.isFinite(amount) || amount < 0) {
          console.error('Invalid amount for addLifetimeCarrots:', amount);
          return;
        }

        set((state) => ({
          totalLifetimeCarrots: state.totalLifetimeCarrots + amount,
        }));
      },
    }),
    {
      name: 'rabbit-clicker-prestige-storage',
      version: 1,
    }
  )
);
