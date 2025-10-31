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
 * Get upgrade by ID
 * @param upgradeId - Unique upgrade identifier
 * @returns Upgrade object or undefined if not found
 */
export function getUpgradeById(upgradeId: string): Upgrade | undefined {
  return CLICK_UPGRADES.find((upgrade) => upgrade.id === upgradeId);
}

/**
 * Get all click power upgrades
 * @returns Array of click power upgrades
 */
export function getClickUpgrades(): Upgrade[] {
  return CLICK_UPGRADES;
}
