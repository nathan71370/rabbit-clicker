/**
 * Core game state and currency types
 */

/**
 * Main game state containing currencies and production stats
 */
export interface GameState {
  /** Regular currency earned through clicking and idle production */
  carrots: number;
  /** Premium currency (optional purchases, achievements, milestones) */
  goldenCarrots: number;
  /** Lifetime carrots earned (for achievements and milestones) */
  lifetimeCarrots: number;

  /** Current carrots per second from all sources */
  carrotsPerSecond: number;
  /** Current click power (carrots gained per click) */
  clickPower: number;

  /** Total number of clicks made */
  totalClicks: number;
  /** Timestamp of last update (for offline earnings) */
  lastUpdate: number;
  /** Current prestige level */
  prestigeLevel: number;
}

/**
 * Currency display information
 */
export interface Currency {
  /** Currency identifier */
  id: string;
  /** Display name */
  name: string;
  /** Current amount */
  amount: number;
  /** Icon identifier or path */
  icon: string;
  /** Currency color for UI */
  color: string;
}

/**
 * Production source breakdown
 */
export interface Production {
  /** Total carrots per second */
  total: number;
  /** CPS from rabbits */
  fromRabbits: number;
  /** CPS from buildings */
  fromBuildings: number;
  /** CPS from auto-clickers */
  fromAutoClickers: number;
  /** Multiplier from upgrades and bonuses */
  multiplier: number;
}

/**
 * Save data structure for persistence
 */
export interface SaveData {
  /** Save format version for migration handling */
  version: number;
  /** Timestamp when save was created */
  timestamp: number;
  /** Game state data */
  gameState: GameState;
  /** Serialized store data */
  stores: {
    rabbits: unknown;
    upgrades: unknown;
    achievements: unknown;
    crates: unknown;
    prestige: unknown;
  };
}
