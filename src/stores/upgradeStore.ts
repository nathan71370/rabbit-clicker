import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from './gameStore';
import { CLICK_UPGRADES, getUpgradeById } from '@/game/data/upgrades';

/**
 * Upgrade Store State Interface
 * Manages upgrade purchases and multiplier calculations
 */
interface UpgradeState {
  // Purchased upgrades
  purchasedUpgrades: Set<string>;

  // Multipliers
  clickMultiplier: number;
  productionMultiplier: number;

  // Actions
  purchaseUpgrade: (upgradeId: string) => boolean;
  canAfford: (cost: number) => boolean;
  recalculateMultipliers: () => void;
  isPurchased: (upgradeId: string) => boolean;
  checkRequirements: (upgradeId: string) => boolean;
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

        return true;
      },

      /**
       * Recalculate multipliers based on purchased upgrades
       * Updates both click and production multipliers
       */
      recalculateMultipliers: () => {
        const state = get();
        let clickMultiplier = 1;
        let productionMultiplier = 1;

        // Calculate click multiplier from purchased click upgrades
        CLICK_UPGRADES.forEach((upgrade) => {
          if (state.purchasedUpgrades.has(upgrade.id)) {
            clickMultiplier *= upgrade.effect;
          }
        });

        // Update state
        set({
          clickMultiplier,
          productionMultiplier,
        });

        // Update gameStore clickPower
        // Base click power is 1, multiplied by all click upgrades
        const newClickPower = 1 * clickMultiplier;

        // Update gameStore using setState
        useGameStore.setState({ clickPower: newClickPower });
      },
    }),
    {
      name: 'rabbit-clicker-upgrade-storage',
      version: 1,
      // Custom serialization for Set
      partialize: (state) => ({
        purchasedUpgrades: Array.from(state.purchasedUpgrades),
        clickMultiplier: state.clickMultiplier,
        productionMultiplier: state.productionMultiplier,
      }),
      // Custom deserialization for Set
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        purchasedUpgrades: new Set(persistedState.purchasedUpgrades || []),
      }),
    }
  )
);
