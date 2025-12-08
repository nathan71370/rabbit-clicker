/**
 * Achievement Checking System
 * Handles detection and unlocking of achievements based on game state
 */

import { useGameStore } from '@/stores/gameStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { getRareRabbits, getEpicRabbits, getLegendaryRabbits } from '@/game/data/rabbits';

/**
 * Throttle configuration
 * Prevents excessive achievement checking
 */
const ACHIEVEMENT_CHECK_INTERVAL = 1000; // Check every 1 second
let lastCheckTime = 0;

/**
 * Check all achievements and update progress
 * This is the main entry point called from the game tick
 * Throttled to run at most once per second for performance
 */
export function checkAllAchievements(): void {
  const now = Date.now();

  // Throttle: only check once per interval
  if (now - lastCheckTime < ACHIEVEMENT_CHECK_INTERVAL) {
    return;
  }

  lastCheckTime = now;

  // Get all store states
  const gameState = useGameStore.getState();
  const rabbitState = useRabbitStore.getState();
  const achievementState = useAchievementStore.getState();
  const upgradeState = useUpgradeStore.getState();

  // Check each category of achievements
  checkProductionAchievements(gameState, achievementState);
  checkClickingAchievements(gameState, achievementState);
  checkCollectionAchievements(rabbitState, achievementState);
  checkCrateAchievements();
  checkSpecialAchievements(rabbitState, upgradeState, achievementState);
}

/**
 * Check production-related achievements
 * Tracks lifetime carrots earned and CPS milestones
 */
function checkProductionAchievements(
  gameState: ReturnType<typeof useGameStore.getState>,
  achievementState: ReturnType<typeof useAchievementStore.getState>
): void {
  const { lifetimeCarrots, carrotsPerSecond } = gameState;

  // Total carrots earned achievements
  const carrotAchievements = [
    { id: 'carrot_novice', target: 1000 },
    { id: 'carrot_farmer', target: 100000 },
    { id: 'carrot_magnate', target: 10000000 },
    { id: 'carrot_tycoon', target: 1000000000 },
    { id: 'carrot_god', target: 1000000000000 },
  ];

  carrotAchievements.forEach(({ id, target }) => {
    if (!achievementState.isUnlocked(id) && lifetimeCarrots >= target) {
      achievementState.updateProgress(id, lifetimeCarrots);
    }
  });

  // CPS milestone achievements
  const cpsAchievements = [
    { id: 'production_starter', target: 100 },
    { id: 'production_master', target: 10000 },
    { id: 'production_legend', target: 1000000 },
  ];

  cpsAchievements.forEach(({ id, target }) => {
    if (!achievementState.isUnlocked(id) && carrotsPerSecond >= target) {
      achievementState.updateProgress(id, carrotsPerSecond);
    }
  });
}

/**
 * Check clicking-related achievements
 * Tracks total manual clicks performed
 */
function checkClickingAchievements(
  gameState: ReturnType<typeof useGameStore.getState>,
  achievementState: ReturnType<typeof useAchievementStore.getState>
): void {
  const { totalClicks } = gameState;

  const clickAchievements = [
    { id: 'click_beginner', target: 100 },
    { id: 'click_enthusiast', target: 1000 },
    { id: 'click_veteran', target: 10000 },
    { id: 'click_master', target: 100000 },
    { id: 'click_god', target: 1000000 },
  ];

  clickAchievements.forEach(({ id, target }) => {
    if (!achievementState.isUnlocked(id) && totalClicks >= target) {
      achievementState.updateProgress(id, totalClicks);
    }
  });
}

/**
 * Check collection-related achievements
 * Tracks rabbit collection progress and specific rarity collections
 */
function checkCollectionAchievements(
  rabbitState: ReturnType<typeof useRabbitStore.getState>,
  achievementState: ReturnType<typeof useAchievementStore.getState>
): void {
  const { ownedRabbits } = rabbitState;

  // Total unique rabbits collected
  const uniqueRabbitsCount = ownedRabbits.size;

  const collectionAchievements = [
    { id: 'bunny_collector', target: 10 },
    { id: 'rabbit_enthusiast', target: 20 },
    { id: 'master_collector', target: 30 },
  ];

  collectionAchievements.forEach(({ id, target }) => {
    if (!achievementState.isUnlocked(id) && uniqueRabbitsCount >= target) {
      achievementState.updateProgress(id, uniqueRabbitsCount);
    }
  });

  // Count rare rabbits owned
  const rareRabbits = getRareRabbits();
  const ownedRareCount = rareRabbits.filter((rabbit) => ownedRabbits.has(rabbit.id)).length;

  if (!achievementState.isUnlocked('rare_breeder') && ownedRareCount >= 5) {
    achievementState.updateProgress('rare_breeder', ownedRareCount);
  }

  // Count legendary rabbits owned
  const legendaryRabbits = getLegendaryRabbits();
  const ownedLegendaryCount = legendaryRabbits.filter((rabbit) => ownedRabbits.has(rabbit.id))
    .length;

  if (!achievementState.isUnlocked('legendary_hunter') && ownedLegendaryCount >= 1) {
    achievementState.updateProgress('legendary_hunter', ownedLegendaryCount);
  }

  // Count epic rabbits owned
  const epicRabbits = getEpicRabbits();
  const ownedEpicCount = epicRabbits.filter((rabbit) => ownedRabbits.has(rabbit.id)).length;

  if (!achievementState.isUnlocked('epic_collector') && ownedEpicCount >= 2) {
    achievementState.updateProgress('epic_collector', ownedEpicCount);
  }
}

/**
 * Check crate-related achievements
 * Tracks total crates opened (including premium crates)
 * Note: Progress for these achievements should be updated when crates are opened
 * This function is here for completeness and future integration
 */
function checkCrateAchievements(): void {
  // Crate achievements are tracked manually when crates are opened
  // Progress is updated via achievementState.updateProgress() in the crate opening logic
  // This function can be used for any additional crate-related checks in the future

  // Example achievements:
  // - lucky_rabbit: Open 10 crates
  // - crate_opener: Open 50 crates
  // - crate_addict: Open 100 crates
  // - crate_collector: Open 500 crates
  // - gacha_king: Open 1,000 crates
  // - premium_patron: Open first Premium Crate

  // These are tracked externally in the crate opening system
}

/**
 * Check special achievements
 * Tracks prestige, buildings, speed runs, and other unique conditions
 */
function checkSpecialAchievements(
  rabbitState: ReturnType<typeof useRabbitStore.getState>,
  upgradeState: ReturnType<typeof useUpgradeStore.getState>,
  achievementState: ReturnType<typeof useAchievementStore.getState>
): void {
  // Building count achievement
  const totalBuildings = upgradeState.getTotalBuildingCount();

  if (!achievementState.isUnlocked('building_empire') && totalBuildings >= 100) {
    achievementState.updateProgress('building_empire', totalBuildings);
  }

  // Max level rabbit achievement
  // Check if any rabbit has reached level 100
  const rabbits = Array.from(rabbitState.ownedRabbits.values());
  const maxRabbitLevel = rabbits.reduce((max, rabbit) => Math.max(max, rabbit.level), 0);

  if (!achievementState.isUnlocked('max_level') && maxRabbitLevel >= 100) {
    achievementState.updateProgress('max_level', maxRabbitLevel);
  }

  // Speed run achievement - automatically checked here
  checkSpeedRunAchievement();

  // Note: Other special achievements require manual triggering:
  // - first_prestige: Call updatePrestigeAchievement() when prestige() is performed
  // - idle_master: Call checkIdleMasterAchievement() when calculateOfflineProgress() runs
}

/**
 * Update crate achievement progress
 * Call this when a crate is opened
 * @param crateType - The type of crate opened (for premium crate tracking)
 */
export function updateCrateAchievementProgress(crateType?: string): void {
  const achievementState = useAchievementStore.getState();

  // Get current total crates opened from progress
  const currentCratesOpened = achievementState.getProgress('lucky_rabbit');
  const newCratesOpened = currentCratesOpened + 1;

  // Update all crate-count achievements
  const crateAchievements = [
    { id: 'lucky_rabbit', target: 10 },
    { id: 'crate_opener', target: 50 },
    { id: 'crate_addict', target: 100 },
    { id: 'crate_collector', target: 500 },
    { id: 'gacha_king', target: 1000 },
  ];

  crateAchievements.forEach(({ id, target }) => {
    if (!achievementState.isUnlocked(id)) {
      achievementState.updateProgress(id, newCratesOpened);
    }
  });

  // Check premium crate achievement
  if (crateType === 'premium' && !achievementState.isUnlocked('premium_patron')) {
    achievementState.updateProgress('premium_patron', 1);
  }
}

/**
 * Update prestige achievement
 * Call this when prestige() is performed
 */
export function updatePrestigeAchievement(): void {
  const achievementState = useAchievementStore.getState();

  if (!achievementState.isUnlocked('first_prestige')) {
    achievementState.updateProgress('first_prestige', 1);
  }
}

/**
 * Check speed run achievement
 * Automatically reads session start time from game store, or accepts optional override
 * @param gameStartTime - Optional timestamp override (falls back to store value)
 */
export function checkSpeedRunAchievement(gameStartTime?: number): void {
  const achievementState = useAchievementStore.getState();
  const gameState = useGameStore.getState();

  if (achievementState.isUnlocked('speed_runner')) {
    return;
  }

  // Use provided gameStartTime or fall back to store value
  const sessionStartTime = gameStartTime ?? gameState.gameSessionStartTime;

  // Guard: if no valid start time, cannot check speed run
  if (!sessionStartTime || !Number.isFinite(sessionStartTime)) {
    return;
  }

  const { lifetimeCarrots } = gameState;

  // Only check if player has reached 1M carrots
  if (lifetimeCarrots >= 1000000) {
    const elapsedTime = Date.now() - sessionStartTime;
    const oneHourMs = 60 * 60 * 1000;

    if (elapsedTime <= oneHourMs) {
      achievementState.updateProgress('speed_runner', lifetimeCarrots);
    }
  }
}

/**
 * Check idle master achievement
 * Call this when offline progress is calculated
 * @param offlineEarnings - Amount of carrots earned while offline
 */
export function checkIdleMasterAchievement(offlineEarnings: number): void {
  const achievementState = useAchievementStore.getState();

  if (!achievementState.isUnlocked('idle_master') && offlineEarnings >= 1000000) {
    achievementState.updateProgress('idle_master', offlineEarnings);
  }
}
