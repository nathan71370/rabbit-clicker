import type { Upgrade } from '@/types/upgrade';

/**
 * Click Power Upgrades
 * One-time upgrades that multiply the carrots earned per click
 */
export const CLICK_UPGRADES: Upgrade[] = [
  {
    id: 'better_claws',
    name: 'Better Claws',
    description: 'Sharpen your claws for more efficient carrot harvesting. Doubles click power.',
    type: 'click_power',
    baseCost: 100,
    currentCost: 100,
    effect: 2, // 2× multiplier
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '🦴',
    isAffordable: false,
    isMaxed: false,
  },
  {
    id: 'sharp_claws',
    name: 'Sharp Claws',
    description: 'Incredibly sharp claws that dig deeper into carrots. 5× click power.',
    type: 'click_power',
    baseCost: 500,
    currentCost: 500,
    effect: 5, // 5× multiplier
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '⚔️',
    isAffordable: false,
    isMaxed: false,
    requirements: [
      {
        type: 'upgrade_purchased',
        target: 'better_claws',
        progress: 0,
        isMet: false,
      },
    ],
  },
  {
    id: 'diamond_claws',
    name: 'Diamond Claws',
    description: 'Diamond-hard claws that never dull. 10× click power.',
    type: 'click_power',
    baseCost: 2500,
    currentCost: 2500,
    effect: 10, // 10× multiplier
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '💎',
    isAffordable: false,
    isMaxed: false,
    requirements: [
      {
        type: 'upgrade_purchased',
        target: 'sharp_claws',
        progress: 0,
        isMet: false,
      },
    ],
  },
  {
    id: 'cosmic_claws',
    name: 'Cosmic Claws',
    description: 'Claws infused with cosmic energy. 25× click power.',
    type: 'click_power',
    baseCost: 10000,
    currentCost: 10000,
    effect: 25, // 25× multiplier
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '⭐',
    isAffordable: false,
    isMaxed: false,
    requirements: [
      {
        type: 'upgrade_purchased',
        target: 'diamond_claws',
        progress: 0,
        isMet: false,
      },
    ],
  },
  {
    id: 'godly_claws',
    name: 'Godly Claws',
    description: 'Divine claws blessed by the carrot gods. 100× click power.',
    type: 'click_power',
    baseCost: 50000,
    currentCost: 50000,
    effect: 100, // 100× multiplier
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '👑',
    isAffordable: false,
    isMaxed: false,
    requirements: [
      {
        type: 'upgrade_purchased',
        target: 'cosmic_claws',
        progress: 0,
        isMet: false,
      },
    ],
  },
];

/**
 * Auto-Clicker Upgrades
 * One-time upgrades that provide idle production (auto-clicks per second)
 */
export const AUTO_CLICKER_UPGRADES: Upgrade[] = [
  {
    id: 'clicker_robot',
    name: 'Clicker Robot',
    description: 'A mechanical rabbit that clicks for you. Generates 1 auto-click per second.',
    type: 'auto_clicker',
    baseCost: 500,
    currentCost: 500,
    effect: 1, // 1 click per second
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '🤖',
    isAffordable: false,
    isMaxed: false,
  },
  {
    id: 'upgraded_clicker',
    name: 'Upgraded Clicker',
    description: 'An enhanced clicker robot with better efficiency. Generates 5 auto-clicks per second.',
    type: 'auto_clicker',
    baseCost: 2000,
    currentCost: 2000,
    effect: 5, // 5 clicks per second
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '🦾',
    isAffordable: false,
    isMaxed: false,
    requirements: [
      {
        type: 'upgrade_purchased',
        target: 'clicker_robot',
        progress: 0,
        isMet: false,
      },
    ],
  },
  {
    id: 'quantum_clicker',
    name: 'Quantum Clicker',
    description: 'A quantum-powered clicker that exists in multiple states. Generates 20 auto-clicks per second.',
    type: 'auto_clicker',
    baseCost: 10000,
    currentCost: 10000,
    effect: 20, // 20 clicks per second
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '⚛️',
    isAffordable: false,
    isMaxed: false,
    requirements: [
      {
        type: 'upgrade_purchased',
        target: 'upgraded_clicker',
        progress: 0,
        isMet: false,
      },
    ],
  },
  {
    id: 'infinite_clicker',
    name: 'Infinite Clicker',
    description: 'A reality-bending device that clicks across all timelines. Generates 100 auto-clicks per second.',
    type: 'auto_clicker',
    baseCost: 100000,
    currentCost: 100000,
    effect: 100, // 100 clicks per second
    maxPurchases: 1,
    purchaseCount: 0,
    costScaling: 1.0,
    icon: '♾️',
    isAffordable: false,
    isMaxed: false,
    requirements: [
      {
        type: 'upgrade_purchased',
        target: 'quantum_clicker',
        progress: 0,
        isMet: false,
      },
    ],
  },
];

/**
 * Get upgrade by ID
 * @param upgradeId - Unique upgrade identifier
 * @returns Upgrade object or undefined if not found
 */
export function getUpgradeById(upgradeId: string): Upgrade | undefined {
  const allUpgrades = [...CLICK_UPGRADES, ...AUTO_CLICKER_UPGRADES];
  return allUpgrades.find((upgrade) => upgrade.id === upgradeId);
}

/**
 * Get all click power upgrades
 * @returns Array of click power upgrades
 */
export function getClickUpgrades(): Upgrade[] {
  return CLICK_UPGRADES;
}

/**
 * Get all auto-clicker upgrades
 * @returns Array of auto-clicker upgrades
 */
export function getAutoClickerUpgrades(): Upgrade[] {
  return AUTO_CLICKER_UPGRADES;
}
