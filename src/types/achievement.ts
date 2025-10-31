/**
 * Achievement system types
 */

/**
 * Achievement categories for organization
 */
export type AchievementCategory =
  | 'clicking'
  | 'production'
  | 'collection'
  | 'spending'
  | 'prestige'
  | 'crates'
  | 'special'
  | 'hidden';

/**
 * Achievement tier for rewards and difficulty
 */
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/**
 * Achievement definition
 */
export interface Achievement {
  /** Unique achievement identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of what needs to be done */
  description: string;
  /** Achievement category */
  category: AchievementCategory;
  /** Achievement tier (affects rewards) */
  tier: AchievementTier;
  /** Icon identifier or path */
  icon: string;
  /** Reward for completing */
  reward: AchievementReward;
  /** Progress tracking */
  progress: {
    /** Current progress value */
    current: number;
    /** Target value to complete */
    target: number;
    /** Progress percentage (0-100) */
    percentage: number;
  };
  /** Whether achievement is unlocked/completed */
  isUnlocked: boolean;
  /** Whether achievement is hidden until unlocked */
  isHidden: boolean;
  /** Timestamp when achievement was unlocked (null if not unlocked) */
  unlockedAt: number | null;
  /** Sort order for display */
  sortOrder: number;
}

/**
 * Achievement reward
 */
export interface AchievementReward {
  /** Golden carrots awarded */
  goldenCarrots: number;
  /** Regular carrots awarded (optional) */
  carrots?: number;
  /** Permanent click power bonus (optional) */
  clickPowerBonus?: number;
  /** Permanent CPS multiplier (optional) */
  cpsMultiplier?: number;
  /** Special reward description (optional) */
  special?: string;
}

/**
 * Achievement notification
 */
export interface AchievementNotification {
  /** Achievement that was just unlocked */
  achievement: Achievement;
  /** Timestamp when notification was created */
  timestamp: number;
  /** Whether notification has been seen */
  seen: boolean;
}

/**
 * Achievement progress tracking
 */
export interface AchievementProgress {
  /** Achievement ID */
  achievementId: string;
  /** Previous progress value */
  previousValue: number;
  /** New progress value */
  newValue: number;
  /** Whether this update completed the achievement */
  completed: boolean;
}
