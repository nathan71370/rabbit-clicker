import type { Achievement } from '@/types/achievement';

declare global {
  interface Window {
    showAchievementToast?: (achievement: Achievement) => void;
  }
}

export {};
