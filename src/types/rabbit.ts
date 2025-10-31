/**
 * Rabbit character system types
 */

/**
 * Rabbit rarity tiers (affects drop rates and power)
 */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical';

/**
 * Rabbit special ability
 */
export interface RabbitAbility {
  /** Ability unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Ability description */
  description: string;
  /** Ability type (passive, active, etc.) */
  type: 'passive' | 'active' | 'conditional';
  /** Ability effect value (percentage, flat bonus, etc.) */
  value: number;
  /** What the ability affects */
  target: 'cps' | 'click_power' | 'cost_reduction' | 'drop_rate' | 'offline_earnings' | 'all';
}

/**
 * Rabbit character definition
 */
export interface Rabbit {
  /** Unique rabbit identifier */
  id: string;
  /** Display name */
  name: string;
  /** Rarity tier */
  rarity: Rarity;
  /** Description/bio text */
  description: string;
  /** Base carrots per second at level 1 */
  baseCPS: number;
  /** Current level (1-based) */
  level: number;
  /** Experience points toward next level */
  experience: number;
  /** Special ability (optional) */
  ability?: RabbitAbility;
  /** Favorite food (flavor text) */
  favoriteFood: string;
  /** Image asset path or identifier */
  image: string;
  /** Whether this rabbit is in the active team */
  isActive: boolean;
  /** Timestamp when rabbit was obtained */
  obtainedAt: number;
}

/**
 * Rabbit team slot
 */
export interface RabbitTeamSlot {
  /** Slot index (0-based) */
  index: number;
  /** Rabbit ID assigned to this slot (null if empty) */
  rabbitId: string | null;
  /** Whether this slot is unlocked */
  unlocked: boolean;
}

/**
 * Rabbit collection statistics
 */
export interface RabbitCollection {
  /** Total unique rabbits owned */
  totalOwned: number;
  /** Total unique rabbits in game */
  totalAvailable: number;
  /** Count by rarity */
  byRarity: Record<Rarity, number>;
}
