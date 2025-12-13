import { formatNumber } from '@/utils/formatNumber';
import { calculateProductionBreakdown } from '@/game/mechanics/production';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { CPS_MULTIPLIER_UPGRADES } from '@/game/data/upgrades';
import { getBuildingById } from '@/game/data/buildings';

/**
 * Calculate global production multiplier from buildings
 * Buildings with 'multiplier' special effect boost ALL production
 */
function calculateGlobalMultiplier(): number {
  const upgradeState = useUpgradeStore.getState();
  let multiplier = 1.0;

  upgradeState.buildings.forEach((count, buildingId) => {
    if (count === 0) return;

    const buildingData = getBuildingById(buildingId);
    if (!buildingData) return;

    if (buildingData.specialEffect?.type === 'multiplier') {
      multiplier += count * buildingData.specialEffect.value;
    }
  });

  return multiplier;
}

/**
 * Calculate CPS multiplier from purchased upgrades
 * CPS multiplier upgrades stack multiplicatively
 */
function calculateCPSMultiplier(): number {
  const upgradeState = useUpgradeStore.getState();
  let multiplier = 1.0;

  CPS_MULTIPLIER_UPGRADES.forEach((upgrade) => {
    if (upgradeState.purchasedUpgrades.has(upgrade.id)) {
      multiplier *= upgrade.effect;
    }
  });

  return multiplier;
}

/**
 * ProductionBreakdown Tooltip Component
 * Shows detailed CPS breakdown on hover
 * Displays breakdown by source: rabbits, buildings, auto-clickers, and multipliers
 */
export function ProductionBreakdown() {
  // Calculate breakdown and multipliers
  // These functions access the stores internally and will trigger re-renders when stores update
  const breakdown = calculateProductionBreakdown();
  const globalMultiplier = calculateGlobalMultiplier();
  const cpsMultiplier = calculateCPSMultiplier();
  const totalMultiplier = globalMultiplier * cpsMultiplier;

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-4 bg-gray-900 text-white rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
      {/* Arrow pointing down */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900" />
      </div>

      {/* Tooltip Content */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-green-400 mb-3 border-b border-gray-700 pb-2">
          Production Breakdown
        </h3>

        {/* Rabbit CPS */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">🐰 Rabbit CPS:</span>
          <span className="font-semibold text-green-300">
            {formatNumber(breakdown.rabbits)}
          </span>
        </div>

        {/* Building CPS */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">🏗️ Building CPS:</span>
          <span className="font-semibold text-blue-300">
            {formatNumber(breakdown.buildings)}
          </span>
        </div>

        {/* Auto-clicker CPS */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">🤖 Auto-clicker CPS:</span>
          <span className="font-semibold text-purple-300">
            {formatNumber(breakdown.autoClickers)}
          </span>
        </div>

        {/* Multipliers */}
        <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-700">
          <span className="text-gray-300">✨ Multipliers:</span>
          <span className="font-semibold text-yellow-300">
            {totalMultiplier.toFixed(2)}×
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center text-base font-bold pt-2 border-t-2 border-green-500">
          <span className="text-green-400">📊 Total CPS:</span>
          <span className="text-green-400">
            {formatNumber(breakdown.total)}
          </span>
        </div>

        {/* Formula explanation */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          <p className="italic">
            Total = (Rabbits + Buildings + Auto-clickers) × Multipliers
          </p>
        </div>
      </div>
    </div>
  );
}
