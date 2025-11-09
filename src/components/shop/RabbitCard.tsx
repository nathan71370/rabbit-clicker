import type { RabbitData } from '@/game/data/rabbits';
import { formatNumber } from '@/utils';
import { RABBIT_PURCHASE_COST } from '@/game/data/constants';

interface RabbitCardProps {
  rabbit: RabbitData;
  isAffordable: boolean;
  isOwned: boolean;
  onPurchase: (rabbitId: string) => void;
}

/**
 * RabbitCard Component
 * Displays individual rabbit with purchase button
 */
export function RabbitCard({
  rabbit,
  isAffordable,
  isOwned,
  onPurchase,
}: RabbitCardProps) {
  const canPurchase = isAffordable && !isOwned;

  return (
    <div
      className={`card transition-all duration-200 ${
        isOwned
          ? 'opacity-70 bg-green-50 border-green-400 border-2'
          : isAffordable
          ? 'hover:shadow-lg hover:border-purple-400 hover:-translate-y-0.5 border-2 border-transparent'
          : 'border-2 border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon and Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl flex-shrink-0 p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
              {rabbit.image}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-0.5">
                {rabbit.name}
              </h3>
              <p className="text-sm text-gray-600 leading-snug">
                {rabbit.description}
              </p>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              <span>⚡</span>
              <span>+{formatNumber(rabbit.baseCPS)}/s CPS</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
              {rabbit.rarity.charAt(0).toUpperCase() + rabbit.rarity.slice(1)}
            </span>
          </div>
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
              <span>{formatNumber(RABBIT_PURCHASE_COST)}</span>
            </div>
          </div>

          {isOwned ? (
            <div className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-1">
              <span>✓</span>
              <span>Owned</span>
            </div>
          ) : (
            <button
              onClick={() => onPurchase(rabbit.id)}
              disabled={!canPurchase}
              className={`px-5 py-2.5 rounded-lg font-bold text-white shadow-md transition-all ${
                canPurchase
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
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
