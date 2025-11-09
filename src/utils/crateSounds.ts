/**
 * Crate Sound Effects Utility
 * Manages sound playback for crate opening animations
 */

import { playSound, preloadSounds } from './sounds';
import type { Rarity } from '@/types/rabbit';

// Sound file paths
const SOUND_PATHS = {
  crateOpen: '/assets/sounds/crate-open.mp3',
  rareDrop: '/assets/sounds/rare-drop.mp3',
  duplicate: '/assets/sounds/duplicate.mp3',
} as const;

/**
 * Preload all crate sounds for instant playback
 */
export async function preloadCrateSounds(): Promise<void> {
  await preloadSounds(Object.values(SOUND_PATHS));
}

/**
 * Play crate opening sound
 * Should be played when the crate animation starts (shake/opening stages)
 */
export function playCrateOpenSound(): void {
  playSound(SOUND_PATHS.crateOpen, {
    volume: 0.6,
    throttle: 1000, // Prevent rapid-fire opens
  });
}

/**
 * Play rare drop fanfare sound
 * Should be played when revealing Rare, Epic, Legendary, or Mythical rabbits
 * @param rarity - The rarity of the rabbit
 */
export function playRareDropSound(rarity: Rarity): void {
  // Only play for rare+ rabbits
  if (!shouldPlayRareSound(rarity)) {
    return;
  }

  playSound(SOUND_PATHS.rareDrop, {
    volume: 0.7,
    throttle: 500, // Allow multiple in sequence but not instantly
  });
}

/**
 * Play duplicate notification sound
 * Should be played when the revealed rabbit is a duplicate
 */
export function playDuplicateSound(): void {
  playSound(SOUND_PATHS.duplicate, {
    volume: 0.5,
    throttle: 500,
  });
}

/**
 * Check if a rarity should trigger the rare drop sound
 * @param rarity - The rarity to check
 * @returns True if rare drop sound should play
 */
function shouldPlayRareSound(rarity: Rarity): boolean {
  const rareRarities: Rarity[] = ['rare', 'epic', 'legendary', 'mythical'];
  return rareRarities.includes(rarity);
}

/**
 * Play appropriate sounds for crate reveal based on rabbit properties
 * Handles timing to prevent awkward overlaps
 * @param rarity - Rabbit rarity
 * @param isDuplicate - Whether the rabbit is a duplicate
 */
export function playCrateRevealSounds(rarity: Rarity, isDuplicate: boolean): void {
  // Always play rare drop sound first if applicable (at reveal time)
  if (shouldPlayRareSound(rarity)) {
    playRareDropSound(rarity);
  }

  // Play duplicate sound slightly delayed if needed
  if (isDuplicate) {
    setTimeout(() => {
      playDuplicateSound();
    }, 300); // Small delay to not overlap with rare sound
  }
}
