import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { getClickUpgrades, getAutoClickerUpgrades } from '@/game/data/upgrades';
import { getCommonRabbits } from '@/game/data/rabbits';
import { UpgradeCard } from './UpgradeCard';
import { RabbitCard } from './RabbitCard';
import { playSound } from '@/utils/sounds';
import { formatNumber } from '@/utils';
import type { RabbitData } from '@/game/data/rabbits';

interface ShopPanelProps {
  onPurchase?: () => void;
}

/**
 * ShopPanel Component
 * Displays available upgrades and handles purchases
 */
const RABBIT_PURCHASE_COST = 1000;

export function ShopPanel({ onPurchase }: ShopPanelProps) {
  const { carrots, spendCarrots } = useGameStore();
  const { purchaseUpgrade, canAfford, isPurchased, checkRequirements } =
    useUpgradeStore();
  const { addRabbit, ownedRabbits } = useRabbitStore();

  const clickUpgrades = getClickUpgrades();
  const autoClickerUpgrades = getAutoClickerUpgrades();
  const commonRabbits = getCommonRabbits();

  const handlePurchase = (upgradeId: string) => {
    const success = purchaseUpgrade(upgradeId);
    if (success) {
      // Play purchase sound
      playSound('/assets/sounds/purchase.mp3', { volume: 0.4 });

      // Trigger save after successful purchase
      onPurchase?.();
    }
  };

  /**
   * Handle rabbit purchase
   */
  const handleRabbitPurchase = (rabbitData: RabbitData) => {
    // Check if already owned
    if (ownedRabbits.has(rabbitData.id)) {
      return;
    }

    // Check if can afford
    if (carrots < RABBIT_PURCHASE_COST) {
      return;
    }

    // Deduct carrots
    const success = spendCarrots(RABBIT_PURCHASE_COST);
    if (!success) {
      return;
    }

    // Create rabbit instance from data
    const newRabbit = {
      ...rabbitData,
      level: 1,
      experience: 0,
      isActive: false,
      obtainedAt: Date.now(),
    };

    // Add rabbit to collection
    addRabbit(newRabbit);

    // Play purchase sound
    playSound('/assets/sounds/purchase.mp3', { volume: 0.4 });

    // Trigger save after successful purchase
    onPurchase?.();
  };

  return (
    <div className="flex flex-col gap-6">
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

      {/* Common Rabbits Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
            Common Rabbits
          </h3>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
        </div>
        <p className="text-xs text-gray-500 text-center mb-2">
          Purchase common rabbits directly! An alternative to crates for getting started.
        </p>

        {commonRabbits.map((rabbitData) => {
          const affordable = carrots >= RABBIT_PURCHASE_COST;
          const owned = ownedRabbits.has(rabbitData.id);

          return (
            <RabbitCard
              key={rabbitData.id}
              rabbit={rabbitData}
              isAffordable={affordable}
              isOwned={owned}
              onPurchase={() => handleRabbitPurchase(rabbitData)}
            />
          );
        })}
      </div>

      {/* Upgrades Container */}
      <div className="flex flex-col gap-6">
        {/* Click Power Upgrades Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-carrot to-transparent flex-1"></div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Click Power Upgrades
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-carrot to-transparent flex-1"></div>
          </div>

          {clickUpgrades.map((upgrade) => {
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

        {/* Auto-Clicker Upgrades Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Auto-Clicker Upgrades
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1"></div>
          </div>

          {autoClickerUpgrades.map((upgrade) => {
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
    </div>
  );
}
