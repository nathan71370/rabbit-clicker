import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Game Store State Interface
 * Manages core game state including currency, production, and player stats
 */
interface GameState {
  // Currency
  carrots: number;
  goldenCarrots: number;
  lifetimeCarrots: number;

  // Production
  carrotsPerSecond: number;
  clickPower: number;

  // Stats
  totalClicks: number;
  lastSaveTime: number;
  lastPlayTime: number;

  // Actions
  addCarrots: (amount: number) => void;
  spendCarrots: (amount: number) => boolean;
  click: () => void;
  tick: (deltaTime: number) => void;
}

/**
 * Main game store using Zustand
 * Handles all core game state and currency management
 */
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      carrots: 0,
      goldenCarrots: 0,
      lifetimeCarrots: 0,
      carrotsPerSecond: 0,
      clickPower: 1,
      totalClicks: 0,
      lastSaveTime: Date.now(),
      lastPlayTime: Date.now(),

      // Actions
      /**
       * Add carrots to the player's balance
       * @param amount - Number of carrots to add
       */
      addCarrots: (amount: number) => {
        set((state) => ({
          carrots: state.carrots + amount,
          lifetimeCarrots: state.lifetimeCarrots + amount,
        }));
      },

      /**
       * Spend carrots if the player has enough
       * @param amount - Number of carrots to spend
       * @returns true if successful, false if insufficient funds
       */
      spendCarrots: (amount: number) => {
        const state = get();
        if (state.carrots >= amount) {
          set({ carrots: state.carrots - amount });
          return true;
        }
        return false;
      },

      /**
       * Handle a manual click
       * Increments total clicks and adds carrots based on click power
       */
      click: () => {
        set((state) => ({
          totalClicks: state.totalClicks + 1,
          carrots: state.carrots + state.clickPower,
          lifetimeCarrots: state.lifetimeCarrots + state.clickPower,
        }));
      },

      /**
       * Game tick for idle production
       * Called every frame to update production and time-based mechanics
       * @param deltaTime - Time elapsed since last tick in seconds
       */
      tick: (deltaTime: number) => {
        set((state) => {
          // Calculate idle production based on CPS
          const idleProduction = state.carrotsPerSecond * deltaTime;

          return {
            carrots: state.carrots + idleProduction,
            lifetimeCarrots: state.lifetimeCarrots + idleProduction,
            lastPlayTime: Date.now(),
          };
        });
      },
    }),
    {
      name: 'rabbit-clicker-game-storage',
      version: 1,
    }
  )
);
