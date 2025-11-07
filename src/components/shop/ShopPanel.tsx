import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { getClickUpgrades } from '@/game/data/upgrades';
import { UpgradeCard } from './UpgradeCard';
import { playSound } from '@/utils/sounds';
import { formatNumber } from '@/utils';

interface ShopPanelProps {
  onPurchase?: () => void;
}

/**
 * ShopPanel Component
 * Displays available upgrades and handles purchases
 */
export function ShopPanel({ onPurchase }: ShopPanelProps) {
  const { carrots } = useGameStore();
  const { purchaseUpgrade, canAfford, isPurchased, checkRequirements } =
    useUpgradeStore();

  const upgrades = getClickUpgrades();

  const handlePurchase = (upgradeId: string) => {
    const success = purchaseUpgrade(upgradeId);
    if (success) {
      // Play purchase sound
      playSound('/assets/sounds/purchase.mp3', { volume: 0.4 });

      // Trigger save after successful purchase
      onPurchase?.();
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Shop Header */}
      <div className="card bg-gradient-to-br from-carrot via-carrot to-carrot-dark text-white shadow-lg border-none">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🏪</span>
          <h2 className="text-3xl font-bold">Upgrade Shop</h2>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-3 backdrop-blur-sm">
          <span className="text-2xl">🥕</span>
          <div className="flex-1">
            <div className="text-xs opacity-90 uppercase tracking-wide font-semibold">
              Your Carrots
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(Math.floor(carrots))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-carrot to-transparent flex-1"></div>
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
          Click Power Upgrades
        </h3>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-carrot to-transparent flex-1"></div>
      </div>

      {/* Upgrades List */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-2 -mr-2">
        {upgrades.map((upgrade) => {
          const affordable = canAfford(upgrade.currentCost);
          const purchased = isPurchased(upgrade.id);
          const requirementsMet = checkRequirements(upgrade.id);

          return (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              isAffordable={affordable}
              isPurchased={purchased}
              onPurchase={handlePurchase}
              requirementsMet={requirementsMet}
            />
          );
        })}
      </div>
    </div>
  );
}
