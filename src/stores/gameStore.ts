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
  gameSessionStartTime: number;

  // Actions
  addCarrots: (amount: number) => void;
  spendCarrots: (amount: number) => boolean;
  addGoldenCarrots: (amount: number) => void;
  spendGoldenCarrots: (amount: number) => boolean;
  click: () => void;
  tick: (deltaTime: number) => void;
  calculateOfflineProgress: () => void;
  resetSessionStartTime: () => void;
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
      gameSessionStartTime: Date.now(),

      // Actions
      /**
       * Add carrots to the player's balance
       * @param amount - Number of carrots to add (must be positive and finite)
       */
      addCarrots: (amount: number) => {
        if (!Number.isFinite(amount) || amount < 0) {
          console.error('Invalid amount for addCarrots:', amount);
          return;
        }
        set((state) => ({
          carrots: state.carrots + amount,
          lifetimeCarrots: state.lifetimeCarrots + amount,
        }));
      },

      /**
       * Spend carrots if the player has enough
       * @param amount - Number of carrots to spend (must be positive and finite)
       * @returns true if successful, false if insufficient funds or invalid amount
       */
      spendCarrots: (amount: number) => {
        if (!Number.isFinite(amount) || amount < 0) {
          console.error('Invalid amount for spendCarrots:', amount);
          return false;
        }
        const state = get();
        if (state.carrots >= amount) {
          set({ carrots: state.carrots - amount });
          return true;
        }
        return false;
      },

      /**
       * Add golden carrots to the player's balance
       * @param amount - Number of golden carrots to add (must be positive and finite)
       */
      addGoldenCarrots: (amount: number) => {
        if (!Number.isFinite(amount) || amount < 0) {
          console.error('Invalid amount for addGoldenCarrots:', amount);
          return;
        }
        set((state) => ({
          goldenCarrots: state.goldenCarrots + amount,
        }));
      },

      /**
       * Spend golden carrots if the player has enough
       * @param amount - Number of golden carrots to spend (must be positive and finite)
       * @returns true if successful, false if insufficient funds or invalid amount
       */
      spendGoldenCarrots: (amount: number) => {
        if (!Number.isFinite(amount) || amount < 0) {
          console.error('Invalid amount for spendGoldenCarrots:', amount);
          return false;
        }
        const state = get();
        if (state.goldenCarrots >= amount) {
          set({ goldenCarrots: state.goldenCarrots - amount });
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
       * @param deltaTime - Time elapsed since last tick in seconds (must be positive and finite)
       */
      tick: (deltaTime: number) => {
        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
          console.error('Invalid deltaTime for tick:', deltaTime);
          return;
        }
        // Cap deltaTime to prevent huge idle gains (max 1 hour)
        const cappedDeltaTime = Math.min(deltaTime, 3600);

        set((state) => {
          // Calculate idle production based on CPS
          const idleProduction = state.carrotsPerSecond * cappedDeltaTime;

          return {
            carrots: state.carrots + idleProduction,
            lifetimeCarrots: state.lifetimeCarrots + idleProduction,
            lastPlayTime: Date.now(),
          };
        });
      },

      /**
       * Calculate and apply offline progress
       * Called when the player returns to the game after being away
       * Grants production based on time away (capped at 1 hour)
       */
      calculateOfflineProgress: () => {
        const state = get();
        const now = Date.now();
        const timeAwayMs = now - state.lastPlayTime;
        const timeAwaySec = timeAwayMs / 1000;

        // Only apply offline progress if away for more than 1 second
        if (timeAwaySec < 1) {
          return;
        }

        // Cap offline time at 1 hour (3600 seconds)
        const cappedTimeAway = Math.min(timeAwaySec, 3600);

        // Calculate offline production
        const offlineProduction = state.carrotsPerSecond * cappedTimeAway;

        if (offlineProduction > 0) {
          set({
            carrots: state.carrots + offlineProduction,
            lifetimeCarrots: state.lifetimeCarrots + offlineProduction,
            lastPlayTime: now,
          });

          console.log(
            `Offline progress: +${offlineProduction.toFixed(2)} carrots from ${cappedTimeAway.toFixed(1)}s away`
          );
        } else {
          // Update lastPlayTime even if no production
          set({ lastPlayTime: now });
        }
      },

      /**
       * Reset the session start time
       * Called when starting a new game session (e.g., after prestige)
       */
      resetSessionStartTime: () => {
        set({ gameSessionStartTime: Date.now() });
      },
    }),
    {
      name: 'rabbit-clicker-game-storage',
      version: 1,
    }
  )
);
