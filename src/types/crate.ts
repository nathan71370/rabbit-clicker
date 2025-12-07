/**
 * Crate (gacha) system types
 */

import type { Rarity, Rabbit } from './rabbit';

/**
 * Crate type definitions
 */
export type CrateType = 'basic' | 'silver' | 'gold' | 'premium' | 'special_event';

/**
 * Crate definition
 */
export interface Crate {
  /** Unique crate identifier */
  id: string;
  /** Display name */
  name: string;
  /** Crate type */
  type: CrateType;
  /** Description */
  description: string;
  /** Cost to open */
  cost: {
    carrots?: number;
    goldenCarrots?: number;
  };
  /** Icon identifier or path */
  icon: string;
  /** Drop rate probabilities by rarity */
  dropRates: Record<Rarity, number>;
  /** Whether crate is available for purchase */
  isAvailable: boolean;
  /** Special features (guaranteed rare, bonus items, etc.) */
  features?: string[];
}

/**
 * Crate opening result
 */
export interface CrateReward {
  /** Reward type */
  type: 'rabbit' | 'carrots' | 'golden_carrots' | 'experience' | 'special';
  /** Rarity of reward (for rabbits) */
  rarity?: Rarity;
  /** Rabbit obtained (if type is 'rabbit') */
  rabbit?: Rabbit;
  /** Currency amount (if type is currency) */
  amount?: number;
  /** Whether this was a duplicate rabbit */
  isDuplicate?: boolean;
  /** Compensation for duplicate (carrots or experience) */
  duplicateCompensation?: {
    carrots?: number;
    experience?: number;
  };
}

/**
 * Crate opening animation state
 */
export interface CrateOpeningState {
  /** Whether crate is currently being opened */
  isOpening: boolean;
  /** Current crate being opened */
  crate: Crate | null;
  /** Result of opening (null until reveal) */
  result: CrateReward | null;
  /** Animation stage */
  stage: 'idle' | 'opening' | 'revealing' | 'complete';
}

/**
 * Pity system state (guarantees rare drops after X attempts)
 */
export interface PitySystem {
  /** Crates opened since last Epic drop */
  cratesSinceEpic: number;
  /** Crates opened since last Legendary drop */
  cratesSinceLegendary: number;
  /** Crates opened since last Mythical drop */
  cratesSinceMythical: number;
  /** Epic pity threshold (guaranteed epic every X crates) */
  epicPityThreshold: number;
  /** Legendary pity threshold */
  legendaryPityThreshold: number;
  /** Mythical pity threshold */
  mythicalPityThreshold: number;
}

/**
 * Crate purchase history
 */
export interface CratePurchase {
  /** Crate type purchased */
  crateType: CrateType;
  /** Timestamp of purchase */
  timestamp: number;
  /** Reward received */
  reward: CrateReward;
  /** Whether pity system was triggered */
  pityTriggered: boolean;
}
