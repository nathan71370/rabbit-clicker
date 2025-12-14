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
      {/* Shop Header - Clean design with yellow/black scheme */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">🏪</span>
          <h2 className="text-4xl font-black text-accent">Upgrade Shop</h2>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-br from-primary to-primary-dark rounded-2xl px-6 py-4 shadow-md">
          <span className="text-3xl">🥕</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-accent uppercase tracking-wide">
              Your Carrots
            </div>
            <div className="text-3xl font-black text-accent">
              {formatNumber(Math.floor(carrots))}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Clean pill-style buttons */}
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'upgrades'
                ? 'bg-accent text-white'
                : 'bg-white text-accent hover:bg-cream'
            }`}
          >
            ⚡ Upgrades
          </button>
          <button
            onClick={() => setActiveTab('buildings')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'buildings'
                ? 'bg-accent text-white'
                : 'bg-white text-accent hover:bg-cream'
            }`}
          >
            🏭 Buildings
          </button>
          <button
            onClick={() => setActiveTab('crates')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'crates'
                ? 'bg-accent text-white'
                : 'bg-white text-accent hover:bg-cream'
            }`}
          >
            📦 Crates
          </button>
          <button
            onClick={() => setActiveTab('rabbits')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'rabbits'
                ? 'bg-accent text-white'
                : 'bg-white text-accent hover:bg-cream'
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
            <div className="flex items-center gap-3">
              <div className="h-1 bg-gradient-to-r from-transparent via-carrot to-transparent flex-1 rounded-full"></div>
              <h3 className="text-base font-black text-accent uppercase tracking-wider px-4 py-2 bg-white rounded-2xl shadow-bold border-2 border-carrot">
                Click Power Upgrades
              </h3>
              <div className="h-1 bg-gradient-to-r from-transparent via-carrot to-transparent flex-1 rounded-full"></div>
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
            <div className="flex items-center gap-3">
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 rounded-full"></div>
              <h3 className="text-base font-black text-accent uppercase tracking-wider px-4 py-2 bg-white rounded-2xl shadow-bold border-2 border-purple-400">
                Auto-Clicker Upgrades
              </h3>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 rounded-full"></div>
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
            <div className="flex items-center gap-3">
              <div className="h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1 rounded-full"></div>
              <h3 className="text-base font-black text-accent uppercase tracking-wider px-4 py-2 bg-white rounded-2xl shadow-bold border-2 border-green-400">
                Production Multipliers
              </h3>
              <div className="h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1 rounded-full"></div>
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
            <div className="flex items-center gap-3">
              <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent flex-1 rounded-full"></div>
              <h3 className="text-base font-black text-accent uppercase tracking-wider px-4 py-2 bg-white rounded-2xl shadow-bold border-2 border-primary">
                Special Upgrades
              </h3>
              <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent flex-1 rounded-full"></div>
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
          <div className="flex items-center gap-3">
            <div className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1 rounded-full"></div>
            <h3 className="text-base font-black text-accent uppercase tracking-wider px-4 py-2 bg-white rounded-2xl shadow-bold border-2 border-blue-400">
              Buildings
            </h3>
            <div className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent flex-1 rounded-full"></div>
          </div>
          <p className="text-sm font-bold text-accent text-center mb-2 bg-white rounded-2xl px-4 py-3 shadow-md border-2 border-cream">
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
          <div className="flex items-center gap-3">
            <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 rounded-full"></div>
            <h3 className="text-base font-black text-accent uppercase tracking-wider px-4 py-2 bg-white rounded-2xl shadow-bold border-2 border-purple-400">
              Common Rabbits
            </h3>
            <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 rounded-full"></div>
          </div>
          <p className="text-sm font-bold text-accent text-center mb-2 bg-white rounded-2xl px-4 py-3 shadow-md border-2 border-cream">
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
