import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { getClickUpgrades, getAutoClickerUpgrades, getCPSMultiplierUpgrades, getSpecialUpgrades } from '@/game/data/upgrades';
import { getCommonRabbits } from '@/game/data/rabbits';
import { BUILDINGS, getUnlockedBuildings, calculateBuildingCost } from '@/game/data/buildings';
import { RABBIT_PURCHASE_COST } from '@/game/data/constants';
import { UpgradeCard } from './UpgradeCard';
import { RabbitCard } from './RabbitCard';
import { BuildingCard } from './BuildingCard';
import { CrateShop } from '@/components/crates';
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
  const { carrots, goldenCarrots, spendCarrots, lifetimeCarrots } = useGameStore();
  const {
    purchaseUpgrade,
    canAfford,
    isPurchased,
    checkRequirements,
    purchaseBuilding,
    getBuildingCount,
  } = useUpgradeStore();
  const { addRabbit, ownedRabbits } = useRabbitStore();

  // Tab state
  const [activeTab, setActiveTab] = useState<'upgrades' | 'buildings' | 'crates' | 'rabbits'>('upgrades');

  const clickUpgrades = getClickUpgrades();
  const autoClickerUpgrades = getAutoClickerUpgrades();
  const cpsMultiplierUpgrades = getCPSMultiplierUpgrades();
  const specialUpgrades = getSpecialUpgrades();
  const commonRabbits = getCommonRabbits();
  const unlockedBuildings = getUnlockedBuildings(lifetimeCarrots);

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
  const handleRabbitPurchase = (rabbitId: string) => {
    // Look up rabbit data
    const rabbitData = commonRabbits.find((r) => r.id === rabbitId);
    if (!rabbitData) {
      return;
    }

    // Check if already owned
    if (ownedRabbits.has(rabbitId)) {
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

  /**
   * Handle building purchase
   */
  const handleBuildingPurchase = (buildingId: string) => {
    const success = purchaseBuilding(buildingId);
    if (success) {
      // Trigger save after successful purchase
      onPurchase?.();
    }
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'upgrades'
                ? 'bg-white text-carrot shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ⚡ Upgrades
          </button>
          <button
            onClick={() => setActiveTab('buildings')}
            className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'buildings'
                ? 'bg-white text-carrot shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            🏭 Buildings
          </button>
          <button
            onClick={() => setActiveTab('crates')}
            className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'crates'
                ? 'bg-white text-carrot shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            📦 Crates
          </button>
          <button
            onClick={() => setActiveTab('rabbits')}
            className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'rabbits'
                ? 'bg-white text-carrot shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            🐰 Rabbits
          </button>
        </div>
      </div>

      {/* Upgrades Tab */}
      {activeTab === 'upgrades' && (
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

          {/* CPS Multiplier Upgrades Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Production Multipliers
              </h3>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
            </div>

            {cpsMultiplierUpgrades.map((upgrade) => {
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

          {/* Special Upgrades Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1"></div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Special Upgrades
              </h3>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-1"></div>
            </div>

            {specialUpgrades.map((upgrade) => {
              const affordable = upgrade.goldenCarrotCost
                ? goldenCarrots >= upgrade.goldenCarrotCost
                : canAfford(upgrade.currentCost);
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
      )}

      {/* Buildings Tab */}
      {activeTab === 'buildings' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Buildings
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1"></div>
          </div>
          <p className="text-xs text-gray-500 text-center mb-2">
            Automated carrot production facilities. Each building generates carrots per second!
          </p>

          {BUILDINGS.map((building) => {
            const ownedCount = getBuildingCount(building.id);
            const currentCost = calculateBuildingCost(building, ownedCount);
            const affordable = carrots >= currentCost;
            const isUnlocked = unlockedBuildings.some((b) => b.id === building.id);

            return (
              <BuildingCard
                key={building.id}
                building={building}
                ownedCount={ownedCount}
                currentCarrots={carrots}
                isAffordable={affordable}
                isUnlocked={isUnlocked}
                onPurchase={handleBuildingPurchase}
              />
            );
          })}
        </div>
      )}

      {/* Crates Tab */}
      {activeTab === 'crates' && <CrateShop />}

      {/* Rabbits Tab */}
      {activeTab === 'rabbits' && (
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
                onPurchase={handleRabbitPurchase}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
