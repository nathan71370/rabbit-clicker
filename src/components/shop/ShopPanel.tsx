import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { getClickUpgrades } from '@/game/data/upgrades';
import { UpgradeCard } from './UpgradeCard';
import { playSound } from '@/utils/sounds';

/**
 * ShopPanel Component
 * Displays available upgrades and handles purchases
 */
export function ShopPanel() {
  const { carrots } = useGameStore();
  const { purchaseUpgrade, canAfford, isPurchased, checkRequirements } =
    useUpgradeStore();

  const upgrades = getClickUpgrades();

  const handlePurchase = (upgradeId: string) => {
    const success = purchaseUpgrade(upgradeId);
    if (success) {
      // Play purchase sound
      playSound('/assets/sounds/purchase.mp3', { volume: 0.4 });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Shop Header */}
      <div className="card bg-gradient-to-r from-carrot to-carrot-dark text-white">
        <h2 className="text-2xl font-bold mb-2">Upgrade Shop</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-sm opacity-90">Your Carrots:</span>
          <span className="text-3xl font-bold">
            {Math.floor(carrots).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Upgrades List */}
      <div className="flex flex-col gap-3">
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

      {/* Empty State (if no upgrades available) */}
      {upgrades.length === 0 && (
        <div className="card text-center py-8 text-gray-500">
          <p>No upgrades available</p>
        </div>
      )}
    </div>
  );
}
