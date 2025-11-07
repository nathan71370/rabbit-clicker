import type { Upgrade } from '@/types/upgrade';
import { formatNumber } from '@/utils';

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

  // Get effect label based on upgrade type
  const getEffectLabel = () => {
    switch (upgrade.type) {
      case 'click_power':
        return `${upgrade.effect}× Click Power`;
      case 'auto_clicker':
        return `${upgrade.effect} clicks/sec`;
      case 'cps_multiplier':
        return `${upgrade.effect}× Production`;
      case 'building':
        return `${upgrade.effect}× Building Power`;
      default:
        return `${upgrade.effect}× Effect`;
    }
  };

  return (
    <div
      className={`card transition-all duration-200 ${
        isPurchased
          ? 'opacity-70 bg-green-50 border-green-400 border-2'
          : !requirementsMet
          ? 'opacity-50 bg-gray-50'
          : isAffordable
          ? 'hover:shadow-lg hover:border-carrot-light hover:-translate-y-0.5 border-2 border-transparent'
          : 'border-2 border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon and Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl flex-shrink-0 p-2 bg-gradient-to-br from-carrot-light/20 to-carrot/20 rounded-lg">
              {upgrade.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-0.5">
                {upgrade.name}
              </h3>
              <p className="text-sm text-gray-600 leading-snug">
                {upgrade.description}
              </p>
            </div>
          </div>

          {/* Effect Badge */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-carrot-light to-carrot text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              <span>⚡</span>
              <span>{getEffectLabel()}</span>
            </span>
          </div>

          {/* Requirements Warning */}
          {!requirementsMet && upgrade.requirements && (
            <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-semibold">
              <span>🔒</span>
              <span>Requirements not met</span>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
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
              <span>{formatNumber(upgrade.currentCost)}</span>
            </div>
          </div>

          {isPurchased ? (
            <div className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-1">
              <span>✓</span>
              <span>Owned</span>
            </div>
          ) : (
            <button
              onClick={() => onPurchase(upgrade.id)}
              disabled={!canPurchase}
              className={`btn-primary text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 ${
                canPurchase
                  ? 'hover:shadow-md hover:scale-105'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
