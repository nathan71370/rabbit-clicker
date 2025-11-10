import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from './gameStore';
import { getUpgradeById } from '@/game/data/upgrades';
import { getBuildingById, calculateBuildingCost } from '@/game/data/buildings';
import { playSound } from '@/utils/sounds';
import { updateProductionValues } from '@/game/mechanics/production';

/**
 * Upgrade Store State Interface
 * Manages upgrade purchases, building purchases, and multiplier calculations
 */
interface UpgradeState {
  // Purchased upgrades
  purchasedUpgrades: Set<string>;

  // Buildings (buildingId → count owned)
  buildings: Map<string, number>;

  // Multipliers
  clickMultiplier: number;
  productionMultiplier: number;

  // Upgrade Actions
  purchaseUpgrade: (upgradeId: string) => boolean;
  canAfford: (cost: number) => boolean;
  recalculateMultipliers: () => void;
  isPurchased: (upgradeId: string) => boolean;
  checkRequirements: (upgradeId: string) => boolean;

  // Building Actions
  purchaseBuilding: (buildingId: string) => boolean;
  getBuildingCount: (buildingId: string) => number;
  getTotalBuildingCount: () => number;
}

/**
 * Upgrade Store using Zustand
 * Handles upgrade purchases and multiplier calculations
 */
export const useUpgradeStore = create<UpgradeState>()(
  persist(
    (set, get) => ({
      // Initial state
      purchasedUpgrades: new Set<string>(),
      buildings: new Map<string, number>(),
      clickMultiplier: 1,
      productionMultiplier: 1,

      /**
       * Check if player can afford a cost
       * @param cost - Cost in carrots
       * @returns true if affordable, false otherwise
       */
      canAfford: (cost: number) => {
        const gameState = useGameStore.getState();
        return gameState.carrots >= cost;
      },

      /**
       * Check if an upgrade has been purchased
       * @param upgradeId - Upgrade identifier
       * @returns true if purchased, false otherwise
       */
      isPurchased: (upgradeId: string) => {
        return get().purchasedUpgrades.has(upgradeId);
      },

      /**
       * Check if upgrade requirements are met
       * @param upgradeId - Upgrade identifier
       * @returns true if requirements met, false otherwise
       */
      checkRequirements: (upgradeId: string) => {
        const upgrade = getUpgradeById(upgradeId);
        if (!upgrade || !upgrade.requirements) {
          return true; // No requirements or upgrade not found
        }

        const state = get();

        // Check all requirements
        return upgrade.requirements.every((requirement) => {
          switch (requirement.type) {
            case 'upgrade_purchased':
              return state.purchasedUpgrades.has(requirement.target as string);

            case 'carrot_total': {
              const gameState = useGameStore.getState();
              return gameState.lifetimeCarrots >= (requirement.target as number);
            }

            // Add more requirement types as needed
            default:
              return true;
          }
        });
      },

      /**
       * Purchase an upgrade
       * @param upgradeId - Upgrade identifier
       * @returns true if purchase successful, false otherwise
       */
      purchaseUpgrade: (upgradeId: string) => {
        const state = get();
        const upgrade = getUpgradeById(upgradeId);

        // Validate upgrade exists
        if (!upgrade) {
          console.error(`Upgrade not found: ${upgradeId}`);
          return false;
        }

        // Check if already purchased
        if (state.isPurchased(upgradeId)) {
          console.warn(`Upgrade already purchased: ${upgradeId}`);
          return false;
        }

        // Check if maxed out
        if (upgrade.maxPurchases !== null && upgrade.purchaseCount >= upgrade.maxPurchases) {
          console.warn(`Upgrade maxed out: ${upgradeId}`);
          return false;
        }

        // Check requirements
        if (!state.checkRequirements(upgradeId)) {
          console.warn(`Requirements not met for upgrade: ${upgradeId}`);
          return false;
        }

        // Check if affordable
        if (!state.canAfford(upgrade.currentCost)) {
          console.warn(`Cannot afford upgrade: ${upgradeId}`);
          return false;
        }

        // Spend carrots
        const gameState = useGameStore.getState();
        const purchaseSuccess = gameState.spendCarrots(upgrade.currentCost);

        if (!purchaseSuccess) {
          console.error(`Failed to spend carrots for upgrade: ${upgradeId}`);
          return false;
        }

        // Add to purchased upgrades
        const newPurchasedUpgrades = new Set(state.purchasedUpgrades);
        newPurchasedUpgrades.add(upgradeId);

        set({
          purchasedUpgrades: newPurchasedUpgrades,
        });

        // Recalculate multipliers
        get().recalculateMultipliers();

        // Play purchase sound effect
        playSound('/assets/sounds/purchase.mp3', { volume: 0.5 });

        return true;
      },

      /**
       * Recalculate multipliers based on purchased upgrades
       * Updates both click and production multipliers, and CPS
       * Now delegates to production.ts for comprehensive calculation including rabbits
       */
      recalculateMultipliers: () => {
        // Note: clickMultiplier and productionMultiplier are kept for backwards compatibility
        // but actual calculations are now done in production.ts
        const productionMultiplier = 1;

        // Update state (multipliers kept for reference but not used in calculations)
        set({
          clickMultiplier: 1, // Now calculated in production.ts
          productionMultiplier,
        });

        // Update all production values using centralized calculation
        // This now includes: auto-clickers, rabbits, click power, and total CPS
        updateProductionValues();
      },

      /**
       * Get building count by ID
       * @param buildingId - Building identifier
       * @returns Number of buildings owned (0 if none)
       */
      getBuildingCount: (buildingId: string) => {
        return get().buildings.get(buildingId) || 0;
      },

      /**
       * Get total count of all buildings owned
       * @returns Total building count across all types
       */
      getTotalBuildingCount: () => {
        const state = get();
        return Array.from(state.buildings.values()).reduce((sum, count) => sum + count, 0);
      },

      /**
       * Purchase a building
       * @param buildingId - Building identifier
       * @returns true if purchase successful, false otherwise
       */
      purchaseBuilding: (buildingId: string) => {
        const state = get();
        const buildingData = getBuildingById(buildingId);

        // Validate building exists
        if (!buildingData) {
          console.error(`Building not found: ${buildingId}`);
          return false;
        }

        // Get current count
        const currentCount = state.getBuildingCount(buildingId);

        // Calculate cost for next purchase
        const cost = calculateBuildingCost(buildingData, currentCount);

        // Check if affordable
        if (!state.canAfford(cost)) {
          console.warn(`Cannot afford building: ${buildingId} (cost: ${cost})`);
          return false;
        }

        // Spend carrots
        const gameState = useGameStore.getState();
        const purchaseSuccess = gameState.spendCarrots(cost);

        if (!purchaseSuccess) {
          console.error(`Failed to spend carrots for building: ${buildingId}`);
          return false;
        }

        // Update building count
        const newBuildings = new Map(state.buildings);
        newBuildings.set(buildingId, currentCount + 1);

        set({
          buildings: newBuildings,
        });

        // Update production values (buildings affect CPS)
        updateProductionValues();

        // Play purchase sound effect
        playSound('/assets/sounds/purchase.mp3', { volume: 0.5 });

        return true;
      },
    }),
    {
      name: 'rabbit-clicker-upgrade-storage',
      version: 2, // Bumped to clear incompatible buildings data structure
      // Migration function for version upgrades
      migrate: (persistedState: unknown, version: number) => {
        // If upgrading from version 1 to 2, ensure buildings is properly initialized
        if (version === 1) {
          const oldState = persistedState as {
            purchasedUpgrades?: string[];
            clickMultiplier?: number;
            productionMultiplier?: number;
          };

          return {
            purchasedUpgrades: oldState.purchasedUpgrades || [],
            buildings: {}, // Initialize as empty object (will be converted to Map in merge)
            clickMultiplier: oldState.clickMultiplier ?? 1,
            productionMultiplier: oldState.productionMultiplier ?? 1,
          };
        }

        return persistedState;
      },
      // Custom serialization for Set and Map
      partialize: (state) => ({
        purchasedUpgrades: Array.from(state.purchasedUpgrades),
        buildings: state.buildings instanceof Map ? Object.fromEntries(state.buildings) : {},
        clickMultiplier: state.clickMultiplier,
        productionMultiplier: state.productionMultiplier,
      }),
      // Custom deserialization for Set and Map
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as {
          purchasedUpgrades?: string[];
          buildings?: Record<string, number>;
          clickMultiplier?: number;
          productionMultiplier?: number;
        };

        return {
          ...currentState,
          purchasedUpgrades: new Set(persisted.purchasedUpgrades || []),
          buildings: new Map(Object.entries(persisted.buildings || {})),
          clickMultiplier: persisted.clickMultiplier ?? currentState.clickMultiplier,
          productionMultiplier:
            persisted.productionMultiplier ?? currentState.productionMultiplier,
        };
      },
    }
  )
);
