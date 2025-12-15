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
      case 'special':
        // Special upgrades have various effects
        if (upgrade.id.startsWith('extra_team_slot')) {
          return `+${upgrade.effect} Team Slot`;
        } else if (upgrade.id === 'offline_boost') {
          return `${upgrade.effect * 100}% Offline Production`;
        } else if (upgrade.id === 'crate_luck') {
          return `+${upgrade.effect * 100}% Crate Luck`;
        } else if (upgrade.id === 'golden_touch') {
          return `${upgrade.effect * 100}% Spent → CPS`;
        }
        return `${upgrade.effect}× Effect`;
      default:
        return `${upgrade.effect}× Effect`;
    }
  };

  return (
    <div
      className={`card transition-all duration-200 ${
        isPurchased
          ? 'opacity-80 bg-green-50 border-2 border-green-500'
          : !requirementsMet
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
            <div className="text-5xl flex-shrink-0 p-3 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-md">
              {upgrade.icon}
            </div>
            <div>
              <h3 className="font-black text-xl text-accent mb-1">
                {upgrade.name}
              </h3>
              <p className="text-sm font-medium text-gray-700 leading-snug">
                {upgrade.description}
              </p>
            </div>
          </div>

          {/* Effect Badge */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-carrot to-carrot-dark text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm">
              <span className="text-lg">⚡</span>
              <span>{getEffectLabel()}</span>
            </span>
          </div>

          {/* Requirements Warning */}
          {!requirementsMet && upgrade.requirements && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 font-bold bg-red-50 px-3 py-2 rounded-xl border-2 border-red-300">
              <span className="text-lg">🔒</span>
              <span>Requirements not met</span>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-accent uppercase tracking-wide mb-1">
              Cost
            </div>
            <div
              className={`font-black text-2xl flex items-center gap-2 ${
                isAffordable ? (upgrade.goldenCarrotCost ? 'text-primary' : 'text-carrot') : 'text-gray-400'
              }`}
            >
              {upgrade.goldenCarrotCost && upgrade.goldenCarrotCost > 0 ? (
                <>
                  <span className="text-xl">🥇</span>
                  <span>{formatNumber(upgrade.goldenCarrotCost)}</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🥕</span>
                  <span>{formatNumber(upgrade.currentCost)}</span>
                </>
              )}
            </div>
          </div>

          {isPurchased ? (
            <div className="px-5 py-3 bg-green-500 text-white rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>OWNED</span>
            </div>
          ) : (
            <button
              onClick={() => onPurchase(upgrade.id)}
              disabled={!canPurchase}
              className={`btn-primary text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 ${
                canPurchase
                  ? 'hover:shadow-lg hover:scale-105'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              BUY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
