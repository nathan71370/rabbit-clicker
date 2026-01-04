import type { Crate, CrateType } from '@/types/crate';
import type { Rarity } from '@/types/rabbit';

/**
 * Crate Types and Probability Tables
 * Defines purchasable crates with drop rate probabilities
 */

/**
 * Basic Crate
 * Cost: 5 Golden Carrots
 * Drop rates: 60% Common, 30% Uncommon, 10% Rare
 */
export const BASIC_CRATE: Crate = {
  id: 'basic_crate',
  name: 'Basic Crate',
  type: 'basic' as CrateType,
  description: 'A simple crate containing common rabbits. Great for starting your collection!',
  cost: {
    goldenCarrots: 5,
  },
  icon: '📦',
  dropRates: {
    common: 0.6,      // 60%
    uncommon: 0.3,    // 30%
    rare: 0.1,        // 10%
    epic: 0,          // 0%
    legendary: 0,     // 0%
    mythical: 0,      // 0%
  } as Record<Rarity, number>,
  isAvailable: true,
  features: ['Guaranteed rabbit', 'Entry level'],
};

/**
 * Silver Crate
 * Cost: 25 Golden Carrots
 * Drop rates: 40% Common, 35% Uncommon, 20% Rare, 5% Epic
 */
export const SILVER_CRATE: Crate = {
  id: 'silver_crate',
  name: 'Silver Crate',
  type: 'silver' as CrateType,
  description: 'A premium crate with better odds. Increased chance for rare rabbits!',
  cost: {
    goldenCarrots: 25,
  },
  icon: '🎁',
  dropRates: {
    common: 0.4,      // 40%
    uncommon: 0.35,   // 35%
    rare: 0.2,        // 20%
    epic: 0.05,       // 5%
    legendary: 0,     // 0%
    mythical: 0,      // 0%
  } as Record<Rarity, number>,
  isAvailable: true,
  features: ['Guaranteed rabbit', 'Epic chance', 'Better rates'],
};

/**
 * Gold Crate
 * Cost: 75 Golden Carrots
 * Drop rates: 0% Common, 45% Uncommon, 35% Rare, 18% Epic, 2% Legendary
 */
export const GOLD_CRATE: Crate = {
  id: 'gold_crate',
  name: 'Gold Crate',
  type: 'gold' as CrateType,
  description: 'The ultimate crate with the best odds! No common rabbits guaranteed!',
  cost: {
    goldenCarrots: 75,
  },
  icon: '✨',
  dropRates: {
    common: 0,        // 0%
    uncommon: 0.45,   // 45%
    rare: 0.35,       // 35%
    epic: 0.18,       // 18%
    legendary: 0.02,  // 2%
    mythical: 0,      // 0%
  } as Record<Rarity, number>,
  isAvailable: true,
  features: ['Guaranteed rabbit', 'No commons', 'Legendary chance', 'Premium quality'],
};

/**
 * Premium Crate
 * Cost: 100 Golden Carrots
 * Drop rates: 0% Common, 0% Uncommon, 50% Rare, 35% Epic, 14% Legendary, 1% Mythical
 */
export const PREMIUM_CRATE: Crate = {
  id: 'premium_crate',
  name: 'Premium Crate',
  type: 'premium' as CrateType,
  description: 'The best crate available! Uses Golden Carrots for the highest rarity odds!',
  cost: {
    goldenCarrots: 100,
  },
  icon: '💎',
  dropRates: {
    common: 0,        // 0%
    uncommon: 0,      // 0%
    rare: 0.5,        // 50%
    epic: 0.35,       // 35%
    legendary: 0.14,  // 14%
    mythical: 0.01,   // 1%
  } as Record<Rarity, number>,
  isAvailable: true,
  features: ['Guaranteed rare+', 'Mythical chance', 'Best odds', 'Golden Carrot exclusive'],
};

/**
 * All available crate types
 */
export const CRATE_TYPES: Crate[] = [
  BASIC_CRATE,
  SILVER_CRATE,
  GOLD_CRATE,
  PREMIUM_CRATE,
];

/**
 * Get crate by ID
 * @param crateId - Crate identifier
 * @returns Crate or undefined if not found
 */
export function getCrateById(crateId: string): Crate | undefined {
  return CRATE_TYPES.find(crate => crate.id === crateId);
}

/**
 * Get crate by type
 * @param crateType - Crate type
 * @returns Crate or undefined if not found
 */
export function getCrateByType(crateType: CrateType): Crate | undefined {
  return CRATE_TYPES.find(crate => crate.type === crateType);
}

/**
 * Validate drop rates sum to 100% (1.0)
 * Used for testing and validation
 */
export function validateDropRates(crate: Crate): boolean {
  const total = Object.values(crate.dropRates).reduce((sum, rate) => sum + rate, 0);
  // Allow small floating point error margin
  return Math.abs(total - 1.0) < 0.0001;
}

/**
 * Get all available crates (filters by isAvailable flag)
 * @returns Array of available crates
 */
export function getAvailableCrates(): Crate[] {
  return CRATE_TYPES.filter(crate => crate.isAvailable);
}
