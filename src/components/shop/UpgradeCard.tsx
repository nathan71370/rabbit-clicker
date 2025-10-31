import type { Upgrade } from '@/types/upgrade';

interface UpgradeCardProps {
  upgrade: Upgrade;
  isAffordable: boolean;
  isPurchased: boolean;
  onPurchase: (upgradeId: string) => void;
  requirementsMet: boolean;
}

/**
 * UpgradeCard Component
 * Displays individual upgrade with purchase button
 */
export function UpgradeCard({
  upgrade,
  isAffordable,
  isPurchased,
  onPurchase,
  requirementsMet,
}: UpgradeCardProps) {
  const canPurchase = isAffordable && !isPurchased && requirementsMet;

  return (
    <div
      className={`card transition-all ${
        isPurchased
          ? 'opacity-60 border-green-500'
          : !requirementsMet
          ? 'opacity-40'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon and Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{upgrade.icon}</span>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {upgrade.name}
              </h3>
              <p className="text-sm text-gray-600">{upgrade.description}</p>
            </div>
          </div>

          {/* Effect */}
          <div className="mt-2">
            <span className="inline-block bg-carrot-light text-white text-xs font-semibold px-2 py-1 rounded">
              {upgrade.effect}× Click Power
            </span>
          </div>

          {/* Requirements */}
          {!requirementsMet && upgrade.requirements && (
            <div className="mt-2 text-xs text-red-600">
              Requirements not met
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-sm text-gray-500">Cost</div>
            <div
              className={`font-bold text-lg ${
                isAffordable ? 'text-carrot' : 'text-gray-400'
              }`}
            >
              {upgrade.currentCost.toLocaleString()}
            </div>
          </div>

          {isPurchased ? (
            <div className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold">
              Purchased ✓
            </div>
          ) : (
            <button
              onClick={() => onPurchase(upgrade.id)}
              disabled={!canPurchase}
              className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
