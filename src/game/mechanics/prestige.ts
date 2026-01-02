import { useGameStore } from '@/stores/gameStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { usePrestigeStore } from '@/stores/prestigeStore';
import { useCrateStore } from '@/stores/crateStore';
import type { Rabbit } from '@/types/rabbit';

/**
 * Prestige milestone rewards
 * Awards Golden Carrots at specific prestige milestones
 */
const PRESTIGE_MILESTONE_REWARDS: Record<number, number> = {
  1: 25, // First prestige: 25 Golden Carrots
  5: 50, // 5th prestige: 50 Golden Carrots
  10: 75, // 10th prestige: 75 Golden Carrots
  25: 100, // 25th prestige: 100 Golden Carrots
  50: 150, // 50th prestige: 150 Golden Carrots
  100: 250, // 100th prestige: 250 Golden Carrots
};

/**
 * Minimum carrots required to unlock prestige
 * From GAME_DESIGN.md: 1 billion lifetime carrots
 */
export const PRESTIGE_UNLOCK_THRESHOLD = 1000000000;

/**
 * Result of a prestige operation
 */
export interface PrestigeResult {
  /** Whether prestige was successful */
  success: boolean;
  /** Number of Golden Seeds earned from this prestige */
  goldenSeeds: number;
  /** Number of Golden Carrots earned from milestone rewards */
  milestoneGoldenCarrots: number;
  /** New total Golden Seed count */
  totalGoldenSeeds: number;
  /** New prestige count */
  prestigeCount: number;
  /** Array of Legendary/Mythical rabbits that were kept */
  keptRabbits: Rabbit[];
  /** Error message if prestige failed */
  error?: string;
}

/**
 * Check if player can prestige
 * Requires earning at least 1 billion carrots in current run
 * @returns true if player can prestige, false otherwise
 */
export function canPrestige(): boolean {
  const gameStore = useGameStore.getState();
  const prestigeStore = usePrestigeStore.getState();

  return prestigeStore.canPrestige(gameStore.lifetimeCarrots);
}

/**
 * Calculate how many Golden Seeds would be earned from prestiging
 * Does not perform the actual prestige
 * @returns Number of Golden Seeds that would be earned
 */
export function calculatePrestigeReward(): number {
  const gameStore = useGameStore.getState();
  const prestigeStore = usePrestigeStore.getState();

  return prestigeStore.calculateGoldenSeeds(gameStore.lifetimeCarrots);
}

/**
 * Get the current prestige bonus multiplier
 * Each Golden Seed provides +10% to all carrot production
 * @returns Current multiplier (e.g., 1.3 = +30% from 3 Golden Seeds)
 */
export function getPrestigeBonus(): number {
  const prestigeStore = usePrestigeStore.getState();
  return prestigeStore.getPrestigeBonus();
}

/**
 * Calculate multiplier from a given number of Golden Seeds
 * Each Golden Seed provides +10% to all carrot production
 * @param seeds - Number of Golden Seeds
 * @returns Multiplier value (e.g., 3 seeds = 1.3x = +30%)
 */
export function calculateMultiplierFromSeeds(seeds: number): number {
  return 1 + seeds * 0.1;
}

/**
 * Perform prestige and reset game state
 *
 * Keeps:
 * - Legendary and Mythical rabbits
 * - Golden Carrots
 * - Achievements
 * - Golden Seeds
 * - Prestige count
 * - Total lifetime carrots (across all runs)
 *
 * Resets:
 * - All other rabbits (Common, Uncommon, Rare, Epic)
 * - Regular carrots
 * - Lifetime carrots (current run only)
 * - All upgrades
 * - All buildings
 * - Active team
 * - Rabbit XP
 * - Click power
 * - Carrots per second
 * - Total clicks
 * - Pity counters (crates since epic/legendary/mythical)
 * - Recent crate drops history
 *
 * @returns PrestigeResult with details of the prestige operation
 */
export function performPrestige(): PrestigeResult {
  const gameStore = useGameStore.getState();
  const rabbitStore = useRabbitStore.getState();
  const prestigeStore = usePrestigeStore.getState();

  // Check if player can prestige
  if (!canPrestige()) {
    return {
      success: false,
      goldenSeeds: 0,
      milestoneGoldenCarrots: 0,
      totalGoldenSeeds: prestigeStore.goldenSeeds,
      prestigeCount: prestigeStore.prestigeCount,
      keptRabbits: [],
      error: `Need ${PRESTIGE_UNLOCK_THRESHOLD.toLocaleString()} lifetime carrots to prestige`,
    };
  }

  // Calculate rewards
  const goldenSeedsEarned = prestigeStore.calculateGoldenSeeds(gameStore.lifetimeCarrots);
  const newPrestigeCount = prestigeStore.prestigeCount + 1;

  // Check for milestone rewards
  let milestoneGoldenCarrots = 0;
  if (PRESTIGE_MILESTONE_REWARDS[newPrestigeCount]) {
    milestoneGoldenCarrots = PRESTIGE_MILESTONE_REWARDS[newPrestigeCount];
  }

  // Perform prestige in prestige store (awards Golden Seeds)
  prestigeStore.performPrestige(gameStore.lifetimeCarrots);

  // Re-fetch updated prestige state after mutation
  const updatedPrestigeStore = usePrestigeStore.getState();

  // Award milestone Golden Carrots if applicable
  if (milestoneGoldenCarrots > 0) {
    gameStore.addGoldenCarrots(milestoneGoldenCarrots);
    console.log(`Milestone reward: +${milestoneGoldenCarrots} Golden Carrots for prestige #${newPrestigeCount}`);
  }

  // Filter rabbits: keep only Legendary and Mythical
  const allRabbits = rabbitStore.getOwnedRabbitsArray();
  const keptRabbits = allRabbits.filter(
    (rabbit) => rabbit.rarity === 'legendary' || rabbit.rarity === 'mythical'
  );
  const removedRabbits = allRabbits.filter(
    (rabbit) => rabbit.rarity !== 'legendary' && rabbit.rarity !== 'mythical'
  );

  // Reset game state
  resetGameState(keptRabbits);

  console.log(`Prestige complete!`);
  console.log(`- Earned ${goldenSeedsEarned} Golden Seeds`);
  console.log(`- Total Golden Seeds: ${updatedPrestigeStore.goldenSeeds}`);
  console.log(`- Prestige count: ${newPrestigeCount}`);
  console.log(`- Kept ${keptRabbits.length} Legendary/Mythical rabbits`);
  console.log(`- Removed ${removedRabbits.length} other rabbits`);
  if (milestoneGoldenCarrots > 0) {
    console.log(`- Milestone bonus: ${milestoneGoldenCarrots} Golden Carrots`);
  }

  return {
    success: true,
    goldenSeeds: goldenSeedsEarned,
    milestoneGoldenCarrots,
    totalGoldenSeeds: updatedPrestigeStore.goldenSeeds,
    prestigeCount: newPrestigeCount,
    keptRabbits,
  };
}

/**
 * Reset game state for prestige
 * Keeps only the specified rabbits (Legendary/Mythical)
 * Resets all other game progress
 *
 * Uses getInitialState() with replace flag to ensure complete state reset,
 * preventing unintentional field persistence from Zustand's shallow merge
 *
 * @param keptRabbits - Array of Legendary/Mythical rabbits to keep
 */
function resetGameState(keptRabbits: Rabbit[]): void {
  const gameStore = useGameStore.getState();

  // Get initial states for complete reset
  const initialGameState = useGameStore.getInitialState();
  const initialRabbitState = useRabbitStore.getInitialState();
  const initialUpgradeState = useUpgradeStore.getInitialState();
  const initialCrateState = useCrateStore.getInitialState();

  // Reset gameStore (keep Golden Carrots, reset everything else)
  const currentGoldenCarrots = gameStore.goldenCarrots;

  // Full state replacement to prevent any fields from persisting
  useGameStore.setState(
    {
      ...initialGameState,
      goldenCarrots: currentGoldenCarrots, // Keep Golden Carrots
    },
    true // Replace entire state instead of merging
  );

  // Reset rabbitStore (keep only Legendary/Mythical rabbits)
  const newOwnedRabbits = new Map<string, Rabbit>();
  keptRabbits.forEach((rabbit) => {
    // Reset rabbit to base state but keep them
    newOwnedRabbits.set(rabbit.id, {
      ...rabbit,
      isActive: false, // Remove from active team
      level: 1, // Reset level
      experience: 0, // Reset experience
    });
  });

  useRabbitStore.setState(
    {
      ...initialRabbitState,
      ownedRabbits: newOwnedRabbits, // Keep Legendary/Mythical rabbits
    },
    true // Replace entire state instead of merging
  );

  // Reset upgradeStore (clear all upgrades and buildings)
  useUpgradeStore.setState(
    {
      ...initialUpgradeState,
    },
    true // Replace entire state instead of merging
  );

  // Reset crateStore (reset pity counters and thresholds)
  useCrateStore.setState(
    {
      ...initialCrateState,
    },
    true // Replace entire state instead of merging
  );

  // Note: achievementStore is NOT reset - achievements are permanent
  // Note: prestigeStore is NOT reset - Golden Seeds and prestige count are permanent

  console.log('Game state reset for prestige');
}

/**
 * Get information about the next prestige milestone reward
 * @returns Object with milestone prestige count and Golden Carrot reward, or null if no more milestones
 */
export function getNextPrestigeMilestone(): { prestigeCount: number; reward: number } | null {
  const prestigeStore = usePrestigeStore.getState();
  const currentPrestigeCount = prestigeStore.prestigeCount;

  // Find the next milestone
  const milestones = Object.keys(PRESTIGE_MILESTONE_REWARDS)
    .map(Number)
    .sort((a, b) => a - b);

  for (const milestone of milestones) {
    if (milestone > currentPrestigeCount) {
      return {
        prestigeCount: milestone,
        reward: PRESTIGE_MILESTONE_REWARDS[milestone],
      };
    }
  }

  return null; // No more milestones
}
