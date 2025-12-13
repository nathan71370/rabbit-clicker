/**
 * Achievement Sound Effects Utility
 * Manages sound playback for achievement unlocks
 */

import { playSound, preloadSounds } from './sounds';

// Sound file paths
const SOUND_PATHS = {
  achievementUnlock: '/assets/sounds/achievement-unlock.mp3',
} as const;

/**
 * Preload all achievement sounds for instant playback
 */
export async function preloadAchievementSounds(): Promise<void> {
  await preloadSounds(Object.values(SOUND_PATHS));
}

/**
 * Play achievement unlock sound
 * Should be played when an achievement toast is displayed
 *
 * Features:
 * - Satisfying and positive tone
 * - Not too loud or jarring
 * - Medium volume (0.65)
 * - Throttled to prevent sound spam
 */
export function playAchievementUnlockSound(): void {
  playSound(SOUND_PATHS.achievementUnlock, {
    volume: 0.65,
    throttle: 1000, // Prevent rapid-fire achievement sounds
  });
}
