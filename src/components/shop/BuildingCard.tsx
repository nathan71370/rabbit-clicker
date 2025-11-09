import type { BuildingData } from '@/game/data/buildings';
import { calculateBuildingCost } from '@/game/data/buildings';
import { formatNumber } from '@/utils';

interface BuildingCardProps {
  building: BuildingData;
  ownedCount: number;
  currentCarrots: number;
  isAffordable: boolean;
  isUnlocked: boolean;
  onPurchase: (buildingId: string) => void;
}

/**
 * BuildingCard Component
 * Displays individual building with purchase button and stats
 */
export function BuildingCard({
  building,
  ownedCount,
  currentCarrots,
  isAffordable,
  isUnlocked,
  onPurchase,
}: BuildingCardProps) {
  const canPurchase = isAffordable && isUnlocked;
  const currentCost = calculateBuildingCost(building, ownedCount);
  const totalCPS = building.baseCPS * ownedCount;
  const carrotDeficit = currentCost - currentCarrots;

  return (
    <div
      className={`card transition-all duration-200 ${
        !isUnlocked
          ? 'opacity-50 bg-gray-50 border-2 border-gray-300'
          : isAffordable
          ? 'hover:shadow-lg hover:border-blue-400 hover:-translate-y-0.5 border-2 border-transparent'
          : 'border-2 border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon and Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl flex-shrink-0 p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
              {building.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-0.5">
                {building.name}
              </h3>
              <p className="text-sm text-gray-600 leading-snug">
                {building.description}
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* CPS Badge */}
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              <span>⚡</span>
              <span>+{formatNumber(building.baseCPS)}/s CPS each</span>
            </span>

            {/* Total CPS if owned */}
            {ownedCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                <span>📊</span>
                <span>Total: +{formatNumber(totalCPS)}/s</span>
              </span>
            )}

            {/* Special Effect Badge */}
            {building.specialEffect && (
              <span
                className="inline-flex items-center gap-1 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                title={building.specialEffect.description}
              >
                <span>✨</span>
                <span>{building.specialEffect.description}</span>
              </span>
            )}
          </div>

          {/* Unlock Warning */}
          {!isUnlocked && (
            <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-semibold">
              <span>🔒</span>
              <span>
                Requires{' '}
                {building.unlockRequirement.type === 'lifetime_carrots'
                  ? `${formatNumber(building.unlockRequirement.value)} lifetime carrots`
                  : building.unlockRequirement.type === 'prestige_level'
                  ? `prestige level ${building.unlockRequirement.value}`
                  : `${formatNumber(building.unlockRequirement.value)} buildings`}
              </span>
            </div>
          )}
        </div>

        {/* Purchase Section */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Owned Count */}
          {ownedCount > 0 && (
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Owned
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatNumber(ownedCount)}
              </div>
            </div>
          )}

          {/* Cost */}
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Cost
            </div>
            <div
              className={`font-bold text-xl flex items-center gap-1 ${
                isAffordable ? 'text-carrot' : 'text-gray-400'
              }`}
            >
              <span className="text-base">🥕</span>
              <span>{formatNumber(currentCost)}</span>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={() => onPurchase(building.id)}
            disabled={!canPurchase}
            className={`px-5 py-2.5 rounded-lg font-bold text-white shadow-md transition-all ${
              canPurchase
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg active:scale-95'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Buy
          </button>

          {!isAffordable && isUnlocked && (
            <span className="text-xs text-red-600 font-semibold">
              Need {formatNumber(carrotDeficit)} more 🥕
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
