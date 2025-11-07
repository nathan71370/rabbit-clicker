import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rabbit } from '@/types/rabbit';
import { updateProductionValues } from '@/game/mechanics/production';

/**
 * Rabbit Store State Interface
 * Manages rabbit collection, team composition, and rabbit-related stats
 */
interface RabbitState {
  // Collection
  ownedRabbits: Map<string, Rabbit>;

  // Team Management
  activeTeam: string[]; // Array of rabbit IDs in active team
  maxTeamSize: number; // Maximum rabbits that can be in active team

  // Experience & Progression
  rabbitXP: number; // Global XP for unlocking team slots

  // Actions
  addRabbit: (rabbit: Rabbit) => void;
  removeRabbit: (rabbitId: string) => void;
  updateRabbit: (rabbitId: string, updates: Partial<Rabbit>) => void;
  getRabbit: (rabbitId: string) => Rabbit | undefined;

  // Team Management
  setActiveTeam: (rabbitIds: string[]) => boolean;
  addToTeam: (rabbitId: string) => boolean;
  removeFromTeam: (rabbitId: string) => void;
  getActiveRabbits: () => Rabbit[];
  isInActiveTeam: (rabbitId: string) => boolean;

  // Calculations
  getTotalCPS: () => number;
  getTeamCPS: () => number;

  // Utility
  getOwnedRabbitsArray: () => Rabbit[];
  getCollectionStats: () => {
    totalOwned: number;
    byRarity: Record<string, number>;
  };
}

/**
 * Rabbit store using Zustand
 * Manages rabbit ownership, team composition, and CPS calculations
 */
export const useRabbitStore = create<RabbitState>()(
  persist(
    (set, get) => ({
      // Initial state
      ownedRabbits: new Map<string, Rabbit>(),
      activeTeam: [],
      maxTeamSize: 3,
      rabbitXP: 0,

      // CRUD Operations
      /**
       * Add a rabbit to the player's collection
       * @param rabbit - Rabbit to add
       */
      addRabbit: (rabbit: Rabbit) => {
        if (!rabbit || !rabbit.id) {
          console.error('Invalid rabbit:', rabbit);
          return;
        }

        set((state) => {
          const newOwned = new Map(state.ownedRabbits);

          // Set obtained timestamp if not already set
          const rabbitWithTimestamp = {
            ...rabbit,
            obtainedAt: rabbit.obtainedAt || Date.now(),
            isActive: false,
            level: rabbit.level || 1,
            experience: rabbit.experience || 0,
          };

          newOwned.set(rabbit.id, rabbitWithTimestamp);

          return { ownedRabbits: newOwned };
        });
      },

      /**
       * Remove a rabbit from the collection
       * @param rabbitId - ID of rabbit to remove
       */
      removeRabbit: (rabbitId: string) => {
        set((state) => {
          const newOwned = new Map(state.ownedRabbits);
          newOwned.delete(rabbitId);

          // Remove from active team if present
          const newActiveTeam = state.activeTeam.filter((id) => id !== rabbitId);

          return {
            ownedRabbits: newOwned,
            activeTeam: newActiveTeam,
          };
        });
      },

      /**
       * Update a rabbit's properties
       * @param rabbitId - ID of rabbit to update
       * @param updates - Partial rabbit data to merge
       */
      updateRabbit: (rabbitId: string, updates: Partial<Rabbit>) => {
        const state = get();
        const rabbit = state.ownedRabbits.get(rabbitId);

        if (!rabbit) {
          console.error(`Rabbit ${rabbitId} not found`);
          return;
        }

        // Check if production-affecting fields are being updated
        const productionFieldsChanged =
          updates.level !== undefined ||
          updates.baseCPS !== undefined ||
          updates.ability !== undefined;

        // Check if this rabbit is in the active team
        const isInActiveTeam = state.activeTeam.includes(rabbitId);

        // Apply updates
        const newOwned = new Map(state.ownedRabbits);
        newOwned.set(rabbitId, { ...rabbit, ...updates });

        set({ ownedRabbits: newOwned });

        // Update production if necessary
        // Only recalculate if production-affecting fields changed AND rabbit is active
        if (productionFieldsChanged && isInActiveTeam) {
          updateProductionValues();
        }
      },

      /**
       * Get a rabbit by ID
       * @param rabbitId - ID of rabbit to retrieve
       * @returns Rabbit or undefined if not found
       */
      getRabbit: (rabbitId: string) => {
        return get().ownedRabbits.get(rabbitId);
      },

      // Team Management
      /**
       * Set the active team (replace entire team)
       * @param rabbitIds - Array of rabbit IDs to set as active team
       * @returns true if successful, false if invalid
       */
      setActiveTeam: (rabbitIds: string[]) => {
        const state = get();

        // Validate team size
        if (rabbitIds.length > state.maxTeamSize) {
          console.error(`Team size ${rabbitIds.length} exceeds max ${state.maxTeamSize}`);
          return false;
        }

        // Validate all rabbits exist and are owned
        const allExist = rabbitIds.every((id) => state.ownedRabbits.has(id));
        if (!allExist) {
          console.error('Some rabbits in team are not owned');
          return false;
        }

        // Update isActive flag on all rabbits
        const newOwned = new Map(state.ownedRabbits);
        newOwned.forEach((rabbit) => {
          newOwned.set(rabbit.id, {
            ...rabbit,
            isActive: rabbitIds.includes(rabbit.id),
          });
        });

        set({
          activeTeam: [...rabbitIds],
          ownedRabbits: newOwned,
        });

        // Update production values to reflect new team composition
        updateProductionValues();

        return true;
      },

      /**
       * Add a rabbit to the active team
       * @param rabbitId - ID of rabbit to add to team
       * @returns true if successful, false if team is full or rabbit not owned
       */
      addToTeam: (rabbitId: string) => {
        const state = get();

        // Check if team is full
        if (state.activeTeam.length >= state.maxTeamSize) {
          console.error('Team is full');
          return false;
        }

        // Check if rabbit exists
        if (!state.ownedRabbits.has(rabbitId)) {
          console.error(`Rabbit ${rabbitId} not owned`);
          return false;
        }

        // Check if already in team
        if (state.activeTeam.includes(rabbitId)) {
          console.warn(`Rabbit ${rabbitId} already in team`);
          return false;
        }

        // Add to team
        const newTeam = [...state.activeTeam, rabbitId];
        return get().setActiveTeam(newTeam);
      },

      /**
       * Remove a rabbit from the active team
       * @param rabbitId - ID of rabbit to remove from team
       */
      removeFromTeam: (rabbitId: string) => {
        const state = get();
        const newTeam = state.activeTeam.filter((id) => id !== rabbitId);
        get().setActiveTeam(newTeam);
      },

      /**
       * Get all rabbits in the active team
       * @returns Array of Rabbit objects
       */
      getActiveRabbits: () => {
        const state = get();
        return state.activeTeam
          .map((id) => state.ownedRabbits.get(id))
          .filter((rabbit): rabbit is Rabbit => rabbit !== undefined);
      },

      /**
       * Check if a rabbit is in the active team
       * @param rabbitId - ID of rabbit to check
       * @returns true if rabbit is in active team
       */
      isInActiveTeam: (rabbitId: string) => {
        return get().activeTeam.includes(rabbitId);
      },

      // Calculations
      /**
       * Get total CPS from all active rabbits
       * @returns Total carrots per second
       */
      getTotalCPS: () => {
        return get().getTeamCPS();
      },

      /**
       * Calculate CPS from active team
       * @returns Carrots per second from active rabbits
       */
      getTeamCPS: () => {
        const activeRabbits = get().getActiveRabbits();

        return activeRabbits.reduce((total, rabbit) => {
          // Base CPS from rabbit
          let cps = rabbit.baseCPS;

          // Apply level scaling (example: +10% per level)
          const levelMultiplier = 1 + (rabbit.level - 1) * 0.1;
          cps *= levelMultiplier;

          // Apply ability bonuses if applicable
          if (rabbit.ability && rabbit.ability.target === 'cps') {
            cps *= (1 + rabbit.ability.value / 100);
          }

          return total + cps;
        }, 0);
      },

      // Utility
      /**
       * Get all owned rabbits as an array
       * @returns Array of all owned rabbits
       */
      getOwnedRabbitsArray: () => {
        return Array.from(get().ownedRabbits.values());
      },

      /**
       * Get collection statistics
       * @returns Object with total owned and count by rarity
       */
      getCollectionStats: () => {
        const rabbits = get().getOwnedRabbitsArray();

        const byRarity: Record<string, number> = {
          common: 0,
          uncommon: 0,
          rare: 0,
          epic: 0,
          legendary: 0,
          mythical: 0,
        };

        rabbits.forEach((rabbit) => {
          byRarity[rabbit.rarity] = (byRarity[rabbit.rarity] || 0) + 1;
        });

        return {
          totalOwned: rabbits.length,
          byRarity,
        };
      },
    }),
    {
      name: 'rabbit-clicker-rabbit-storage',
      version: 1,
      // Custom storage to handle Map serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          const { state } = JSON.parse(str);

          // Reconstruct Map from array
          if (state.ownedRabbits) {
            state.ownedRabbits = new Map(Object.entries(state.ownedRabbits));
          }

          return { state };
        },
        setItem: (name, value) => {
          const { state } = value;

          // Convert Map to object for storage
          const storageState = {
            ...state,
            ownedRabbits: Object.fromEntries(state.ownedRabbits),
          };

          localStorage.setItem(name, JSON.stringify({ state: storageState }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
