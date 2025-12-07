import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { CLICK_UPGRADES, AUTO_CLICKER_UPGRADES } from '@/game/data/upgrades';
import { getBuildingById } from '@/game/data/buildings';

/**
 * Production breakdown by source
 */
export interface ProductionBreakdown {
  /** CPS from auto-clicker upgrades × click power */
  autoClickers: number;
  /** CPS from active rabbits in team */
  rabbits: number;
  /** CPS from buildings (future) */
  buildings: number;
  /** Total CPS from all sources */
  total: number;
}

/**
 * Calculate building CPS with special effects and synergies
 *
 * @param rabbitCount - Total number of owned rabbits
 * @returns Total building CPS
 */
function calculateBuildingCPS(rabbitCount: number): number {
  const upgradeState = useUpgradeStore.getState();
  let totalBuildingCPS = 0;

  // Iterate through all owned buildings
  upgradeState.buildings.forEach((count, buildingId) => {
    if (count === 0) return;

    const buildingData = getBuildingById(buildingId);
    if (!buildingData) return;

    // Base CPS: baseCPS * count
    let buildingCPS = buildingData.baseCPS * count;

    // Apply special effects that affect the building's own CPS
    if (buildingData.specialEffect) {
      switch (buildingData.specialEffect.type) {
        case 'per_rabbit_boost':
          // Carrot Farm: +1% CPS per rabbit owned
          // This applies to the farm's own CPS
          buildingCPS *= 1 + rabbitCount * buildingData.specialEffect.value;
          break;

        case 'rabbit_cps_boost':
          // Rabbit Burrow: +5% rabbit CPS per burrow
          // This is applied elsewhere (in calculateProductionBreakdown)
          // Not applied to building's own CPS
          break;

        case 'multiplier':
          // Global multipliers (Processing Plant, Genetic Lab, Space Station)
          // Applied to total production, not building's own CPS
          // Handled in calculateProductionBreakdown
          break;
      }
    }

    totalBuildingCPS += buildingCPS;
  });

  return totalBuildingCPS;
}

/**
 * Calculate global production multiplier from buildings
 * Buildings with 'multiplier' special effect boost ALL production
 *
 * @returns Total multiplier (1.0 = no bonus, 2.0 = double production)
 */
function calculateGlobalMultiplier(): number {
  const upgradeState = useUpgradeStore.getState();
  let multiplier = 1.0;

  // Iterate through all owned buildings
  upgradeState.buildings.forEach((count, buildingId) => {
    if (count === 0) return;

    const buildingData = getBuildingById(buildingId);
    if (!buildingData) return;

    // Apply global multiplier effects
    if (buildingData.specialEffect?.type === 'multiplier') {
      // Each building adds its multiplier value
      // Example: Processing Plant with value 0.10 means +10% per plant
      // If you own 3 plants: 1 + (3 * 0.10) = 1.30 = 130% = +30% total
      multiplier += count * buildingData.specialEffect.value;
    }
  });

  return multiplier;
}

/**
 * Calculate total carrots per second from all production sources
 *
 * Sources:
 * - Auto-clicker upgrades (multiplied by click power)
 * - Active rabbits in team (with level scaling and abilities)
 * - Buildings (with special effects and synergies)
 *
 * @returns Total CPS
 */
export function calculateTotalCPS(): number {
  const breakdown = calculateProductionBreakdown();
  return breakdown.total;
}

/**
 * Calculate detailed production breakdown by source
 * Useful for UI to show where CPS comes from
 *
 * @returns ProductionBreakdown object with all sources
 */
export function calculateProductionBreakdown(): ProductionBreakdown {
  const upgradeState = useUpgradeStore.getState();
  const rabbitState = useRabbitStore.getState();

  // 1. Calculate auto-clicker CPS
  let autoClicksPerSecond = 0;
  AUTO_CLICKER_UPGRADES.forEach((upgrade) => {
    if (upgradeState.purchasedUpgrades.has(upgrade.id)) {
      autoClicksPerSecond += upgrade.effect;
    }
  });

  // Auto-clickers are affected by click power
  const clickPower = calculateClickPower();
  let autoClickerCPS = autoClicksPerSecond * clickPower;

  // 2. Calculate rabbit CPS (base, before building synergies)
  let rabbitCPS = rabbitState.getTeamCPS();

  // 3. Calculate building CPS with special effects
  let buildingCPS = calculateBuildingCPS(rabbitState.ownedRabbits.size);

  // 4. Apply building synergies to rabbit CPS
  // Rabbit Burrow: +5% rabbit CPS per burrow
  const burrowCount = upgradeState.getBuildingCount('rabbit_burrow');
  const burrowBuilding = getBuildingById('rabbit_burrow');
  if (burrowCount > 0 && burrowBuilding?.specialEffect?.type === 'rabbit_cps_boost') {
    rabbitCPS *= 1 + burrowCount * burrowBuilding.specialEffect.value;
  }

  // 5. Apply global multipliers from buildings
  // Processing Plant, Genetic Lab, Space Station boost ALL production
  const globalMultiplier = calculateGlobalMultiplier();
  autoClickerCPS *= globalMultiplier;
  rabbitCPS *= globalMultiplier;
  buildingCPS *= globalMultiplier;

  // 6. Total
  const totalCPS = autoClickerCPS + rabbitCPS + buildingCPS;

  return {
    autoClickers: autoClickerCPS,
    rabbits: rabbitCPS,
    buildings: buildingCPS,
    total: totalCPS,
  };
}

/**
 * Calculate click power from all multiplier sources
 *
 * Sources:
 * - Click power upgrades
 * - Rabbit abilities (if they affect click power)
 * - Other bonuses (future)
 *
 * @returns Total click power multiplier
 */
export function calculateClickPower(): number {
  const upgradeState = useUpgradeStore.getState();
  const rabbitState = useRabbitStore.getState();

  // Base click power
  let clickPower = 1;

  // 1. Click power upgrades (multiplicative)
  CLICK_UPGRADES.forEach((upgrade) => {
    if (upgradeState.purchasedUpgrades.has(upgrade.id)) {
      clickPower *= upgrade.effect;
    }
  });

  // 2. Rabbit abilities that affect click power
  const activeRabbits = rabbitState.getActiveRabbits();
  activeRabbits.forEach((rabbit) => {
    if (rabbit.ability && rabbit.ability.target === 'click_power') {
      clickPower *= (1 + rabbit.ability.value / 100);
    }
  });

  return clickPower;
}

/**
 * Update all production values in game store
 * Should be called whenever:
 * - An upgrade is purchased
 * - A rabbit is added/removed from team
 * - Rabbit levels up
 * - Any production-affecting change occurs
 */
export function updateProductionValues(): void {
  const breakdown = calculateProductionBreakdown();
  const clickPower = calculateClickPower();

  // Update gameStore with new values
  useGameStore.setState({
    carrotsPerSecond: breakdown.total,
    clickPower: clickPower,
  });
}
