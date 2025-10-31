/**
 * Upgrade and building system types
 */

/**
 * Upgrade category types
 */
export type UpgradeType = 'click_power' | 'cps_multiplier' | 'building' | 'automation' | 'quality_of_life' | 'special';

/**
 * Upgrade definition
 */
export interface Upgrade {
  /** Unique upgrade identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of what the upgrade does */
  description: string;
  /** Upgrade category */
  type: UpgradeType;
  /** Base cost in carrots */
  baseCost: number;
  /** Current cost (may increase with purchases) */
  currentCost: number;
  /** Effect value (multiplier, flat bonus, etc.) */
  effect: number;
  /** Maximum purchase count (null for unlimited) */
  maxPurchases: number | null;
  /** Current purchase count */
  purchaseCount: number;
  /** Cost scaling factor for repeated purchases */
  costScaling: number;
  /** Icon identifier or path */
  icon: string;
  /** Whether upgrade is currently affordable */
  isAffordable: boolean;
  /** Whether upgrade is maxed out */
  isMaxed: boolean;
  /** Requirements to unlock this upgrade */
  requirements?: UpgradeRequirement[];
}

/**
 * Requirement for unlocking an upgrade
 */
export interface UpgradeRequirement {
  /** Requirement type */
  type: 'carrot_total' | 'rabbit_count' | 'prestige_level' | 'upgrade_purchased' | 'achievement';
  /** Target value or ID */
  target: string | number;
  /** Current progress toward requirement */
  progress: number;
  /** Whether requirement is met */
  isMet: boolean;
}

/**
 * Building definition (automated production structures)
 */
export interface Building {
  /** Unique building identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Base cost for first purchase */
  baseCost: number;
  /** Current cost for next purchase */
  currentCost: number;
  /** Base CPS per building */
  baseCPS: number;
  /** Current CPS per building (after upgrades) */
  currentCPS: number;
  /** Number of this building owned */
  count: number;
  /** Cost multiplier per purchase (typically 1.15-1.25) */
  costMultiplier: number;
  /** Icon identifier or path */
  icon: string;
  /** Unlock requirement (lifetime carrots, prestige level, etc.) */
  unlockRequirement: {
    type: 'lifetime_carrots' | 'prestige_level' | 'building_count';
    value: number;
  };
  /** Whether building is unlocked */
  isUnlocked: boolean;
  /** Whether building is affordable */
  isAffordable: boolean;
}

/**
 * Automation upgrade (auto-clickers, auto-buyers, etc.)
 */
export interface Automation {
  /** Unique automation identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Cost in carrots or golden carrots */
  cost: {
    carrots?: number;
    goldenCarrots?: number;
  };
  /** What this automation does */
  effect: {
    type: 'auto_click' | 'auto_buy_upgrade' | 'auto_buy_building' | 'auto_open_crate';
    value: number;
    interval: number; // milliseconds between actions
  };
  /** Whether automation is purchased */
  isPurchased: boolean;
  /** Whether automation is enabled */
  isEnabled: boolean;
}
