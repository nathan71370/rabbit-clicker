import type { Building } from '@/types/upgrade';

/**
 * Building Data Definitions
 * Contains all building types available in the game
 *
 * Buildings provide automated carrot production (CPS)
 * Each building can be purchased multiple times
 * Costs increase exponentially with each purchase
 */

/**
 * Building Data Interface (static definitions)
 * This is the base template for creating Building instances
 */
export interface BuildingData {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseCPS: number;
  costMultiplier: number;
  icon: string;
  unlockRequirement: {
    type: 'lifetime_carrots' | 'prestige_level' | 'building_count';
    value: number;
  };
  specialEffect?: {
    type: 'rabbit_cps_boost' | 'per_rabbit_boost' | 'multiplier';
    value: number;
    description: string;
  };
}

/**
 * BUILDING DEFINITIONS
 */

/**
 * Carrot Garden
 * The first basic building - small plot for growing carrots
 */
const CARROT_GARDEN: BuildingData = {
  id: 'carrot_garden',
  name: 'Carrot Garden',
  description: 'A small garden plot that automatically grows carrots. Perfect for starting your carrot empire!',
  baseCost: 1000,
  baseCPS: 10,
  costMultiplier: 1.15,
  icon: '🌱',
  unlockRequirement: {
    type: 'lifetime_carrots',
    value: 0, // Available from start
  },
};

/**
 * Rabbit Burrow
 * Housing for rabbits - boosts rabbit productivity
 * Special: +5% rabbit CPS per burrow owned
 */
const RABBIT_BURROW: BuildingData = {
  id: 'rabbit_burrow',
  name: 'Rabbit Burrow',
  description: 'A cozy underground home for rabbits. Each burrow increases rabbit productivity by 5%!',
  baseCost: 10000,
  baseCPS: 50,
  costMultiplier: 1.15,
  icon: '🏠',
  unlockRequirement: {
    type: 'lifetime_carrots',
    value: 5000, // Unlock after earning 5k lifetime carrots
  },
  specialEffect: {
    type: 'rabbit_cps_boost',
    value: 0.05, // +5% per burrow
    description: '+5% rabbit CPS per burrow',
  },
};

/**
 * Carrot Farm
 * Large-scale carrot production facility
 * Special: +1% CPS per rabbit owned
 */
const CARROT_FARM: BuildingData = {
  id: 'carrot_farm',
  name: 'Carrot Farm',
  description: 'An industrial carrot farm with advanced irrigation. Gains +1% CPS for each rabbit you own!',
  baseCost: 100000,
  baseCPS: 250,
  costMultiplier: 1.15,
  icon: '🚜',
  unlockRequirement: {
    type: 'lifetime_carrots',
    value: 50000, // Unlock after earning 50k lifetime carrots
  },
  specialEffect: {
    type: 'per_rabbit_boost',
    value: 0.01, // +1% per rabbit
    description: '+1% CPS per rabbit owned',
  },
};

/**
 * Greenhouse
 * High-tech controlled environment for maximum carrot yield
 */
const GREENHOUSE: BuildingData = {
  id: 'greenhouse',
  name: 'Greenhouse',
  description: 'A state-of-the-art greenhouse with climate control and automated systems. Maximum carrot production!',
  baseCost: 1000000,
  baseCPS: 1000,
  costMultiplier: 1.15,
  icon: '🏭',
  unlockRequirement: {
    type: 'lifetime_carrots',
    value: 500000, // Unlock after earning 500k lifetime carrots
  },
};

/**
 * All buildings array
 * Export this for use throughout the game
 */
export const BUILDINGS: BuildingData[] = [
  CARROT_GARDEN,
  RABBIT_BURROW,
  CARROT_FARM,
  GREENHOUSE,
];

/**
 * Get building by ID
 * @param buildingId - Unique building identifier
 * @returns Building data or undefined if not found
 */
export function getBuildingById(buildingId: string): BuildingData | undefined {
  return BUILDINGS.find((building) => building.id === buildingId);
}

/**
 * Get unlocked buildings based on game progression
 * @param lifetimeCarrots - Total carrots earned
 * @param prestigeLevel - Current prestige level (default: 0)
 * @param buildingCounts - Map of building IDs to owned counts (default: empty)
 * @returns Array of unlocked building data
 */
export function getUnlockedBuildings(
  lifetimeCarrots: number,
  prestigeLevel: number = 0,
  buildingCounts: Map<string, number> = new Map()
): BuildingData[] {
  return BUILDINGS.filter((building) => {
    const req = building.unlockRequirement;

    switch (req.type) {
      case 'lifetime_carrots':
        return lifetimeCarrots >= req.value;

      case 'prestige_level':
        return prestigeLevel >= req.value;

      case 'building_count':
        {
          // Total buildings owned across all types
          const totalBuildings = Array.from(buildingCounts.values()).reduce(
            (sum, count) => sum + count,
            0
          );
          return totalBuildings >= req.value;
        }

      default:
        // Unknown requirement type - defensive: don't unlock
        return false;
    }
  });
}

/**
 * Calculate building cost for next purchase
 * Uses exponential scaling: baseCost * (costMultiplier ^ count)
 * @param building - Building data
 * @param currentCount - Number already owned
 * @returns Cost for next purchase
 */
export function calculateBuildingCost(building: BuildingData, currentCount: number): number {
  return Math.floor(building.baseCost * Math.pow(building.costMultiplier, currentCount));
}

/**
 * Create a Building instance from BuildingData
 * Used when initializing building state
 * @param data - Building template data
 * @param count - Initial count (default 0)
 * @returns Building instance
 */
export function createBuildingInstance(data: BuildingData, count: number = 0): Building {
  const currentCost = calculateBuildingCost(data, count);

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    baseCost: data.baseCost,
    currentCost,
    baseCPS: data.baseCPS,
    currentCPS: data.baseCPS, // Will be modified by upgrades
    count,
    costMultiplier: data.costMultiplier,
    icon: data.icon,
    unlockRequirement: data.unlockRequirement,
    isUnlocked: false, // Set by game logic
    isAffordable: false, // Set by game logic
  };
}
