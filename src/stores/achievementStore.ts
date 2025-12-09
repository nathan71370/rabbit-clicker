import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGameStore } from './gameStore';
import { ACHIEVEMENTS, getAchievementById } from '@/game/data/achievements';
import type { Achievement } from '@/types/achievement';

/**
 * Achievement with runtime tracking data
 * Extends base Achievement with isUnlocked and unlockedAt fields
 */
export interface AchievementWithProgress extends Achievement {
  /** Whether achievement is unlocked (overrides base type) */
  isUnlocked: boolean;
  /** Timestamp when achievement was unlocked (overrides base type) */
  unlockedAt: number | null;
}

/**
 * Achievement Store State Interface
 * Manages achievement tracking, progress, and rewards
 */
interface AchievementState {
  // State
  /** Set of unlocked achievement IDs */
  unlockedAchievements: Set<string>;
  /** Map of achievement ID to current progress value */
  achievementProgress: Map<string, number>;
  /** Map of achievement ID to unlock timestamp */
  unlockTimestamps: Map<string, number>;
  /** Timestamp of last achievement check */
  lastCheckTime: number;

  // Actions
  /** Check all achievements for completion based on current game state */
  checkAchievements: () => void;
  /** Unlock a specific achievement and award rewards */
  unlockAchievement: (achievementId: string) => boolean;
  /** Get progress for a specific achievement */
  getProgress: (achievementId: string) => number;
  /** Update progress for a specific achievement */
  updateProgress: (achievementId: string, value: number) => void;
  /** Award rewards for an achievement */
  awardReward: (achievementId: string) => boolean;
  /** Check if an achievement is unlocked */
  isUnlocked: (achievementId: string) => boolean;
  /** Get all unlocked achievement IDs */
  getUnlockedIds: () => string[];
  /** Get achievement with current progress */
  getAchievementWithProgress: (achievementId: string) => AchievementWithProgress | null;
}

/**
 * Achievement Store using Zustand
 * Handles achievement tracking, progress updates, and reward distribution
 */
export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      // Initial state
      unlockedAchievements: new Set<string>(),
      achievementProgress: new Map<string, number>(),
      unlockTimestamps: new Map<string, number>(),
      lastCheckTime: Date.now(),

      /**
       * Check if an achievement is unlocked
       * @param achievementId - Achievement identifier
       * @returns true if unlocked, false otherwise
       */
      isUnlocked: (achievementId: string) => {
        return get().unlockedAchievements.has(achievementId);
      },

      /**
       * Get all unlocked achievement IDs
       * @returns Array of unlocked achievement IDs
       */
      getUnlockedIds: () => {
        return Array.from(get().unlockedAchievements);
      },

      /**
       * Get progress for a specific achievement
       * @param achievementId - Achievement identifier
       * @returns Current progress value (0 if not tracked)
       */
      getProgress: (achievementId: string) => {
        return get().achievementProgress.get(achievementId) || 0;
      },

      /**
       * Update progress for a specific achievement
       * Automatically checks if achievement should be unlocked
       * @param achievementId - Achievement identifier
       * @param value - New progress value
       */
      updateProgress: (achievementId: string, value: number) => {
        const state = get();

        // Don't update if already unlocked
        if (state.isUnlocked(achievementId)) {
          return;
        }

        const achievement = getAchievementById(achievementId);
        if (!achievement) {
          console.error(`Achievement not found: ${achievementId}`);
          return;
        }

        // Update progress
        const newProgress = new Map(state.achievementProgress);
        newProgress.set(achievementId, value);

        set({
          achievementProgress: newProgress,
        });

        // Check if achievement should be unlocked
        if (value >= achievement.progress.target) {
          get().unlockAchievement(achievementId);
        }
      },

      /**
       * Unlock a specific achievement and award rewards
       * @param achievementId - Achievement identifier
       * @returns true if successful, false if already unlocked or not found
       */
      unlockAchievement: (achievementId: string) => {
        const state = get();

        // Check if already unlocked
        if (state.isUnlocked(achievementId)) {
          console.warn(`Achievement already unlocked: ${achievementId}`);
          return false;
        }

        // Validate achievement exists
        const achievement = getAchievementById(achievementId);
        if (!achievement) {
          console.error(`Achievement not found: ${achievementId}`);
          return false;
        }

        // Add to unlocked achievements and record timestamp
        const newUnlockedAchievements = new Set(state.unlockedAchievements);
        newUnlockedAchievements.add(achievementId);

        const newUnlockTimestamps = new Map(state.unlockTimestamps);
        newUnlockTimestamps.set(achievementId, Date.now());

        set({
          unlockedAchievements: newUnlockedAchievements,
          unlockTimestamps: newUnlockTimestamps,
        });

        // Award rewards
        state.awardReward(achievementId);

        console.log(`Achievement unlocked: ${achievement.name}`);

        // Show toast notification
        if (typeof window !== 'undefined' && (window as any).showAchievementToast) {
          (window as any).showAchievementToast(achievement);
        }

        return true;
      },

      /**
       * Award rewards for an achievement
       * Currently awards Golden Carrots
       * @param achievementId - Achievement identifier
       * @returns true if rewards awarded, false if achievement not found
       */
      awardReward: (achievementId: string) => {
        const achievement = getAchievementById(achievementId);
        if (!achievement) {
          console.error(`Achievement not found: ${achievementId}`);
          return false;
        }

        const gameStore = useGameStore.getState();

        // Award Golden Carrots
        if (achievement.reward.goldenCarrots > 0) {
          gameStore.addGoldenCarrots(achievement.reward.goldenCarrots);
          console.log(
            `Awarded ${achievement.reward.goldenCarrots} Golden Carrots for ${achievement.name}`
          );
        }

        // Award regular Carrots (if any)
        if (achievement.reward.carrots && achievement.reward.carrots > 0) {
          gameStore.addCarrots(achievement.reward.carrots);
          console.log(`Awarded ${achievement.reward.carrots} Carrots for ${achievement.name}`);
        }

        return true;
      },

      /**
       * Check all achievements for completion based on current game state
       * This should be called periodically or when relevant game state changes
       */
      checkAchievements: () => {
        const state = get();
        const gameStore = useGameStore.getState();

        // Update lastCheckTime
        set({ lastCheckTime: Date.now() });

        // Check each achievement
        ACHIEVEMENTS.forEach((achievement) => {
          // Skip if already unlocked
          if (state.isUnlocked(achievement.id)) {
            return;
          }

          let currentValue = 0;

          // Determine current progress based on achievement category
          switch (achievement.category) {
            case 'production': {
              // Check if it's a CPS achievement or total carrots achievement
              if (achievement.id.includes('production_')) {
                // CPS-based achievement
                currentValue = gameStore.carrotsPerSecond;
              } else {
                // Total carrots earned achievement
                currentValue = gameStore.lifetimeCarrots;
              }
              break;
            }

            case 'clicking': {
              currentValue = gameStore.totalClicks;
              break;
            }

            case 'collection': {
              // Collection achievements need to be updated from rabbitStore
              // This will be handled when rabbits are collected
              currentValue = state.getProgress(achievement.id);
              break;
            }

            case 'crates': {
              // Crate achievements need to be updated when crates are opened
              // This will be handled in the crate opening logic
              currentValue = state.getProgress(achievement.id);
              break;
            }

            case 'special': {
              // Special achievements have custom tracking
              // This will be handled in specific game events
              currentValue = state.getProgress(achievement.id);
              break;
            }

            default:
              // Unknown category
              currentValue = state.getProgress(achievement.id);
          }

          // Update progress (this will auto-unlock if target is met)
          if (currentValue > 0) {
            state.updateProgress(achievement.id, currentValue);
          }
        });
      },

      /**
       * Get achievement with current progress data
       * @param achievementId - Achievement identifier
       * @returns Achievement object with current progress, or null if not found
       */
      getAchievementWithProgress: (achievementId: string): AchievementWithProgress | null => {
        const achievement = getAchievementById(achievementId);
        if (!achievement) {
          return null;
        }

        const state = get();
        const currentProgress = state.getProgress(achievementId);
        const isUnlocked = state.isUnlocked(achievementId);
        const unlockedAt = state.unlockTimestamps.get(achievementId) || null;

        // Return achievement with updated progress
        return {
          ...achievement,
          progress: {
            current: currentProgress,
            target: achievement.progress.target,
            percentage: Math.min((currentProgress / achievement.progress.target) * 100, 100),
          },
          isUnlocked,
          unlockedAt,
        };
      },
    }),
    {
      name: 'rabbit-clicker-achievement-storage',
      version: 1,
      // Custom serialization for Set and Map
      partialize: (state) => ({
        unlockedAchievements: Array.from(state.unlockedAchievements),
        achievementProgress:
          state.achievementProgress instanceof Map
            ? Object.fromEntries(state.achievementProgress)
            : {},
        unlockTimestamps:
          state.unlockTimestamps instanceof Map ? Object.fromEntries(state.unlockTimestamps) : {},
        lastCheckTime: state.lastCheckTime,
      }),
      // Custom deserialization for Set and Map
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as {
          unlockedAchievements?: string[];
          achievementProgress?: Record<string, number>;
          unlockTimestamps?: Record<string, number>;
          lastCheckTime?: number;
        };

        return {
          ...currentState,
          unlockedAchievements: new Set(persisted.unlockedAchievements || []),
          achievementProgress: new Map(Object.entries(persisted.achievementProgress || {})),
          unlockTimestamps: new Map(Object.entries(persisted.unlockTimestamps || {})),
          lastCheckTime: persisted.lastCheckTime ?? currentState.lastCheckTime,
        };
      },
    }
  )
);
