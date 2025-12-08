import type { Achievement } from '@/types/achievement';

/**
 * Collection Achievements
 * Track rabbit collection progress
 */
const COLLECTION_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'bunny_collector',
    name: 'Bunny Collector',
    description: 'Collect 10 different rabbits',
    category: 'collection',
    tier: 'bronze',
    icon: '🐰',
    reward: { goldenCarrots: 5 },
    progress: { current: 0, target: 10, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 1,
  },
  {
    id: 'rabbit_enthusiast',
    name: 'Rabbit Enthusiast',
    description: 'Collect 20 different rabbits',
    category: 'collection',
    tier: 'silver',
    icon: '🐇',
    reward: { goldenCarrots: 15 },
    progress: { current: 0, target: 20, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 2,
  },
  {
    id: 'master_collector',
    name: 'Master Collector',
    description: 'Collect all 30 rabbits',
    category: 'collection',
    tier: 'diamond',
    icon: '👑',
    reward: { goldenCarrots: 100 },
    progress: { current: 0, target: 30, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 3,
  },
  {
    id: 'rare_breeder',
    name: 'Rare Breeder',
    description: 'Collect all Rare rabbits',
    category: 'collection',
    tier: 'gold',
    icon: '💎',
    reward: { goldenCarrots: 25 },
    progress: { current: 0, target: 5, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 4,
  },
  {
    id: 'legendary_hunter',
    name: 'Legendary Hunter',
    description: 'Collect your first Legendary rabbit',
    category: 'collection',
    tier: 'gold',
    icon: '🌟',
    reward: { goldenCarrots: 50 },
    progress: { current: 0, target: 1, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 5,
  },
  {
    id: 'epic_collector',
    name: 'Epic Collector',
    description: 'Collect both Epic rabbits',
    category: 'collection',
    tier: 'platinum',
    icon: '🔮',
    reward: { goldenCarrots: 60 },
    progress: { current: 0, target: 2, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 6,
  },
];

/**
 * Production Achievements
 * Track carrot production milestones
 */
const PRODUCTION_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'carrot_novice',
    name: 'Carrot Novice',
    description: 'Earn 1,000 total carrots',
    category: 'production',
    tier: 'bronze',
    icon: '🥕',
    reward: { goldenCarrots: 5 },
    progress: { current: 0, target: 1000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 7,
  },
  {
    id: 'carrot_farmer',
    name: 'Carrot Farmer',
    description: 'Earn 100,000 total carrots',
    category: 'production',
    tier: 'silver',
    icon: '🌾',
    reward: { goldenCarrots: 10 },
    progress: { current: 0, target: 100000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 8,
  },
  {
    id: 'carrot_magnate',
    name: 'Carrot Magnate',
    description: 'Earn 10 million total carrots',
    category: 'production',
    tier: 'gold',
    icon: '💰',
    reward: { goldenCarrots: 25 },
    progress: { current: 0, target: 10000000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 9,
  },
  {
    id: 'carrot_tycoon',
    name: 'Carrot Tycoon',
    description: 'Earn 1 billion total carrots',
    category: 'production',
    tier: 'platinum',
    icon: '🏦',
    reward: { goldenCarrots: 50 },
    progress: { current: 0, target: 1000000000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 10,
  },
  {
    id: 'carrot_god',
    name: 'Carrot God',
    description: 'Earn 1 trillion total carrots',
    category: 'production',
    tier: 'diamond',
    icon: '⚡',
    reward: { goldenCarrots: 100 },
    progress: { current: 0, target: 1000000000000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 11,
  },
  {
    id: 'production_starter',
    name: 'Production Starter',
    description: 'Reach 100 CPS',
    category: 'production',
    tier: 'bronze',
    icon: '⏱️',
    reward: { goldenCarrots: 5 },
    progress: { current: 0, target: 100, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 12,
  },
  {
    id: 'production_master',
    name: 'Production Master',
    description: 'Reach 10,000 CPS',
    category: 'production',
    tier: 'silver',
    icon: '🚀',
    reward: { goldenCarrots: 20 },
    progress: { current: 0, target: 10000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 13,
  },
  {
    id: 'production_legend',
    name: 'Production Legend',
    description: 'Reach 1,000,000 CPS',
    category: 'production',
    tier: 'gold',
    icon: '🌌',
    reward: { goldenCarrots: 40 },
    progress: { current: 0, target: 1000000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 14,
  },
];

/**
 * Clicking Achievements
 * Track manual clicking progress
 */
const CLICKING_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'click_beginner',
    name: 'Click Beginner',
    description: 'Perform 100 manual clicks',
    category: 'clicking',
    tier: 'bronze',
    icon: '👆',
    reward: { goldenCarrots: 5 },
    progress: { current: 0, target: 100, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 15,
  },
  {
    id: 'click_enthusiast',
    name: 'Click Enthusiast',
    description: 'Perform 1,000 manual clicks',
    category: 'clicking',
    tier: 'silver',
    icon: '👇',
    reward: { goldenCarrots: 10 },
    progress: { current: 0, target: 1000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 16,
  },
  {
    id: 'click_veteran',
    name: 'Click Veteran',
    description: 'Perform 10,000 manual clicks',
    category: 'clicking',
    tier: 'gold',
    icon: '✋',
    reward: { goldenCarrots: 25 },
    progress: { current: 0, target: 10000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 17,
  },
  {
    id: 'click_master',
    name: 'Click Master',
    description: 'Perform 100,000 manual clicks',
    category: 'clicking',
    tier: 'platinum',
    icon: '💪',
    reward: { goldenCarrots: 50 },
    progress: { current: 0, target: 100000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 18,
  },
  {
    id: 'click_god',
    name: 'Click God',
    description: 'Perform 1,000,000 manual clicks',
    category: 'clicking',
    tier: 'diamond',
    icon: '🔥',
    reward: { goldenCarrots: 80 },
    progress: { current: 0, target: 1000000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 19,
  },
];

/**
 * Crate Achievements
 * Track crate opening progress
 */
const CRATE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'lucky_rabbit',
    name: 'Lucky Rabbit',
    description: 'Open 10 crates',
    category: 'crates',
    tier: 'bronze',
    icon: '📦',
    reward: { goldenCarrots: 10 },
    progress: { current: 0, target: 10, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 20,
  },
  {
    id: 'crate_opener',
    name: 'Crate Opener',
    description: 'Open 50 crates',
    category: 'crates',
    tier: 'silver',
    icon: '🎁',
    reward: { goldenCarrots: 15 },
    progress: { current: 0, target: 50, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 21,
  },
  {
    id: 'crate_addict',
    name: 'Crate Addict',
    description: 'Open 100 crates',
    category: 'crates',
    tier: 'gold',
    icon: '🎰',
    reward: { goldenCarrots: 25 },
    progress: { current: 0, target: 100, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 22,
  },
  {
    id: 'crate_collector',
    name: 'Crate Collector',
    description: 'Open 500 crates',
    category: 'crates',
    tier: 'platinum',
    icon: '🏆',
    reward: { goldenCarrots: 50 },
    progress: { current: 0, target: 500, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 23,
  },
  {
    id: 'gacha_king',
    name: 'Gacha King',
    description: 'Open 1,000 crates',
    category: 'crates',
    tier: 'diamond',
    icon: '👑',
    reward: { goldenCarrots: 100 },
    progress: { current: 0, target: 1000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 24,
  },
  {
    id: 'premium_patron',
    name: 'Premium Patron',
    description: 'Open your first Premium Crate',
    category: 'crates',
    tier: 'gold',
    icon: '💎',
    reward: { goldenCarrots: 30 },
    progress: { current: 0, target: 1, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 25,
  },
];

/**
 * Special Achievements
 * Track special accomplishments and milestones
 */
const SPECIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_prestige',
    name: 'First Prestige',
    description: 'Perform your first prestige',
    category: 'special',
    tier: 'platinum',
    icon: '✨',
    reward: { goldenCarrots: 50 },
    progress: { current: 0, target: 1, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 26,
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Reach 1 million carrots within 1 hour of starting a new game',
    category: 'special',
    tier: 'platinum',
    icon: '⚡',
    reward: { goldenCarrots: 75 },
    progress: { current: 0, target: 1000000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 27,
  },
  {
    id: 'idle_master',
    name: 'Idle Master',
    description: 'Earn 1 million carrots while offline',
    category: 'special',
    tier: 'gold',
    icon: '😴',
    reward: { goldenCarrots: 50 },
    progress: { current: 0, target: 1000000, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 28,
  },
  {
    id: 'max_level',
    name: 'Max Level',
    description: 'Level a rabbit to max level 100',
    category: 'special',
    tier: 'diamond',
    icon: '🎯',
    reward: { goldenCarrots: 80 },
    progress: { current: 0, target: 100, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 29,
  },
  {
    id: 'building_empire',
    name: 'Building Empire',
    description: 'Own 100 total buildings',
    category: 'special',
    tier: 'gold',
    icon: '🏗️',
    reward: { goldenCarrots: 35 },
    progress: { current: 0, target: 100, percentage: 0 },
    isUnlocked: false,
    isHidden: false,
    unlockedAt: null,
    sortOrder: 30,
  },
];

/**
 * All Achievements
 * Combined array of all achievement definitions
 */
export const ACHIEVEMENTS: Achievement[] = [
  ...COLLECTION_ACHIEVEMENTS,
  ...PRODUCTION_ACHIEVEMENTS,
  ...CLICKING_ACHIEVEMENTS,
  ...CRATE_ACHIEVEMENTS,
  ...SPECIAL_ACHIEVEMENTS,
];

/**
 * Helper Functions
 */

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.category === category);
}

/**
 * Get achievements by tier
 */
export function getAchievementsByTier(tier: Achievement['tier']): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.tier === tier);
}

/**
 * Get unlocked achievements
 */
export function getUnlockedAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.isUnlocked);
}

/**
 * Get locked achievements
 */
export function getLockedAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => !achievement.isUnlocked);
}

/**
 * Calculate total golden carrots from achievements
 */
export function getTotalAchievementGoldenCarrots(): number {
  return ACHIEVEMENTS.reduce(
    (total, achievement) => total + (achievement.isUnlocked ? achievement.reward.goldenCarrots : 0),
    0
  );
}

/**
 * Get achievement completion percentage
 */
export function getAchievementCompletionPercentage(): number {
  const unlockedCount = getUnlockedAchievements().length;
  const totalCount = ACHIEVEMENTS.length;
  return (unlockedCount / totalCount) * 100;
}
