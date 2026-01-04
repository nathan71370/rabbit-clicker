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
          ? 'opacity-50 border-2 border-gray-300'
          : isAffordable
          ? 'hover:shadow-lg hover:-translate-y-1 border-2 border-gray-200'
          : 'border-2 border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon and Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl flex-shrink-0 p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-md">
              {building.icon}
            </div>
            <div>
              <h3 className="font-black text-xl text-accent mb-1">
                {building.name}
              </h3>
              <p className="text-sm font-medium text-gray-700 leading-snug">
                {building.description}
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* CPS Badge */}
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm">
              <span className="text-lg">⚡</span>
              <span>+{formatNumber(building.baseCPS)}/s each</span>
            </span>

            {/* Total CPS if owned */}
            {ownedCount > 0 && (
              <span className="inline-flex items-center gap-2 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm">
                <span className="text-lg">📊</span>
                <span>Total: +{formatNumber(totalCPS)}/s</span>
              </span>
            )}

            {/* Special Effect Badge */}
            {building.specialEffect && (
              <span
                className="inline-flex items-center gap-2 bg-purple-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm"
                title={building.specialEffect.description}
              >
                <span className="text-lg">✨</span>
                <span>{building.specialEffect.description}</span>
              </span>
            )}
          </div>

          {/* Unlock Warning */}
          {!isUnlocked && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 font-bold bg-red-50 px-3 py-2 rounded-xl border-2 border-red-300">
              <span className="text-lg">🔒</span>
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
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          {/* Owned Count */}
          {ownedCount > 0 && (
            <div className="text-right">
              <div className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
                Owned
              </div>
              <div className="text-2xl font-black text-blue-600">
                {formatNumber(ownedCount)}
              </div>
            </div>
          )}

          {/* Cost */}
          <div className="text-right">
            <div className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
              Cost
            </div>
            <div
              className={`font-black text-2xl flex items-center gap-2 ${
                isAffordable ? 'text-carrot' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">🥕</span>
              <span>{formatNumber(currentCost)}</span>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={() => onPurchase(building.id)}
            disabled={!canPurchase}
            className={`btn-primary px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
              canPurchase
                ? 'hover:shadow-lg hover:scale-105'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            BUY
          </button>

          {!isAffordable && isUnlocked && (
            <span className="text-xs text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-lg">
              Need {formatNumber(carrotDeficit)} more 🥕
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
