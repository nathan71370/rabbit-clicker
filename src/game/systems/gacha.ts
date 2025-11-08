import type { Rarity, Rabbit } from '@/types/rabbit';
import type { CrateType } from '@/types/crate';
import type { RabbitData } from '@/game/data/rabbits';
import { getCrateByType } from '@/game/data/crates';
import { getRabbitsByRarity } from '@/game/data/rabbits';

/**
 * Pity counter interface for tracking crates opened without specific rarities
 */
export interface PityCounters {
  cratesSinceEpic: number;
  cratesSinceLegendary: number;
  cratesSinceMythical: number;
}

/**
 * Pity thresholds (matches crateStore defaults)
 */
export const PITY_THRESHOLDS = {
  epic: 50,
  legendary: 200,
  mythical: 200,
} as const;

/**
 * Check if pity system should trigger a guaranteed drop
 * @param counters - Current pity counters
 * @returns Guaranteed rarity if pity triggered, null otherwise
 */
export function checkPity(counters: PityCounters): Rarity | null {
  // Check from highest to lowest rarity
  if (counters.cratesSinceMythical >= PITY_THRESHOLDS.mythical) {
    return 'mythical';
  }
  if (counters.cratesSinceLegendary >= PITY_THRESHOLDS.legendary) {
    return 'legendary';
  }
  if (counters.cratesSinceEpic >= PITY_THRESHOLDS.epic) {
    return 'epic';
  }
  return null;
}

/**
 * Roll for rarity based on crate type and pity system
 * @param crateType - Type of crate being opened
 * @param pityCounters - Current pity counters
 * @returns Rarity tier obtained
 */
export function rollRarity(crateType: CrateType, pityCounters: PityCounters): Rarity {
  // Get crate data
  const crate = getCrateByType(crateType);
  if (!crate) {
    throw new Error(`Crate type ${crateType} not found`);
  }

  // Check pity system first (guaranteed drops override probability)
  const guaranteedRarity = checkPity(pityCounters);
  if (guaranteedRarity) {
    return guaranteedRarity;
  }

  // Roll based on crate's drop rate probabilities
  const roll = Math.random();
  let cumulative = 0;

  const rarities: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];

  for (const rarity of rarities) {
    const rate = crate.dropRates[rarity] ?? 0;
    cumulative += rate;
    if (roll < cumulative) {
      return rarity;
    }
  }

  // Fallback to common (should never happen if drop rates sum to 1.0)
  return 'common';
}

/**
 * Select a rabbit from the pool of a given rarity
 * Favors unowned rabbits to prevent duplicates when possible
 * @param rarity - Rarity tier to select from
 * @param ownedRabbits - Map of currently owned rabbits (by ID)
 * @returns Selected rabbit data, or null if no rabbits exist for this rarity
 */
export function selectRabbit(
  rarity: Rarity,
  ownedRabbits: Map<string, Rabbit>
): RabbitData | null {
  // Get all rabbits of this rarity
  const rabbitPool = getRabbitsByRarity(rarity);

  if (rabbitPool.length === 0) {
    console.warn(`No rabbits available for rarity: ${rarity}`);
    return null;
  }

  // Separate unowned and owned rabbits
  const unownedRabbits = rabbitPool.filter((rabbit) => !ownedRabbits.has(rabbit.id));
  const ownedRabbitPool = rabbitPool.filter((rabbit) => ownedRabbits.has(rabbit.id));

  // Favor unowned rabbits (90% chance to select unowned if available)
  let selectedPool: RabbitData[];

  if (unownedRabbits.length > 0) {
    const favorUnowned = Math.random() < 0.9;
    selectedPool = favorUnowned ? unownedRabbits : rabbitPool;
  } else {
    // All rabbits owned, select from full pool (duplicate)
    selectedPool = ownedRabbitPool;
  }

  // Randomly select from chosen pool
  const randomIndex = Math.floor(Math.random() * selectedPool.length);
  return selectedPool[randomIndex];
}

/**
 * Check if a rabbit is a duplicate
 * @param rabbitId - ID of rabbit to check
 * @param ownedRabbits - Map of currently owned rabbits
 * @returns true if rabbit is already owned, false otherwise
 */
export function isDuplicate(rabbitId: string, ownedRabbits: Map<string, Rabbit>): boolean {
  return ownedRabbits.has(rabbitId);
}

/**
 * Calculate duplicate compensation (XP) based on rarity
 * @param rarity - Rarity of duplicate rabbit
 * @returns XP compensation amount
 */
export function calculateDuplicateCompensation(rarity: Rarity): number {
  const compensationTable: Record<Rarity, number> = {
    common: 50,
    uncommon: 150,
    rare: 500,
    epic: 2000,
    legendary: 10000,
    mythical: 50000,
  };

  return compensationTable[rarity];
}

/**
 * Convert RabbitData to Rabbit instance
 * @param rabbitData - Static rabbit data
 * @param isDuplicate - Whether this is a duplicate pull
 * @returns Rabbit instance ready to add to collection
 */
export function createRabbitInstance(rabbitData: RabbitData, isDuplicate = false): Rabbit {
  return {
    id: rabbitData.id,
    name: rabbitData.name,
    rarity: rabbitData.rarity,
    description: rabbitData.description,
    baseCPS: rabbitData.baseCPS,
    level: 1,
    experience: 0,
    ability: rabbitData.ability,
    favoriteFood: rabbitData.favoriteFood,
    image: rabbitData.image,
    isActive: false,
    obtainedAt: isDuplicate ? 0 : Date.now(), // Set to 0 for duplicates (not added to collection)
  };
}
