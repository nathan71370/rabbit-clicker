import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Milestone types
 */
export type MilestoneType = 'carrots' | 'prestige';

/**
 * Milestone definition
 */
export interface Milestone {
  id: string;
  type: MilestoneType;
  value: number;
  title: string;
  description: string;
  icon: string;
}

/**
 * All available milestones
 */
export const MILESTONES: Milestone[] = [
  {
    id: 'carrots_1k',
    type: 'carrots',
    value: 1000,
    title: '1,000 Carrots!',
    description: 'You collected your first thousand carrots!',
    icon: '🥕',
  },
  {
    id: 'carrots_10k',
    type: 'carrots',
    value: 10000,
    title: '10,000 Carrots!',
    description: 'Ten thousand carrots harvested!',
    icon: '🥕✨',
  },
  {
    id: 'carrots_100k',
    type: 'carrots',
    value: 100000,
    title: '100,000 Carrots!',
    description: 'A hundred thousand carrots!',
    icon: '🥕🎉',
  },
  {
    id: 'carrots_1m',
    type: 'carrots',
    value: 1000000,
    title: '1 Million Carrots!',
    description: 'One million carrots achieved!',
    icon: '🥕💫',
  },
  {
    id: 'carrots_1b',
    type: 'carrots',
    value: 1000000000,
    title: '1 Billion Carrots!',
    description: 'An incredible billion carrots!',
    icon: '🥕🌟',
  },
  {
    id: 'prestige_first',
    type: 'prestige',
    value: 1,
    title: 'First Prestige!',
    description: 'You ascended for the first time!',
    icon: '✨',
  },
];

/**
 * Milestone Store State
 */
interface MilestoneState {
  /** Milestones that have been achieved */
  completedMilestones: Set<string>;

  /** Current milestone being celebrated (if any) */
  activeCelebration: Milestone | null;

  /** Check and trigger milestone for carrots */
  checkCarrotMilestone: (totalCarrots: number) => void;

  /** Check and trigger milestone for prestige */
  checkPrestigeMilestone: (prestigeCount: number) => void;

  /** Mark a milestone as completed */
  completeMilestone: (milestoneId: string) => void;

  /** Show celebration for a milestone */
  showCelebration: (milestone: Milestone) => void;

  /** Hide active celebration */
  hideCelebration: () => void;

  /** Check if a milestone has been completed */
  isMilestoneCompleted: (milestoneId: string) => boolean;
}

/**
 * Milestone Store
 * Tracks milestone progress and triggers celebrations
 */
export const useMilestoneStore = create<MilestoneState>()(
  persist(
    (set, get) => ({
      completedMilestones: new Set<string>(),
      activeCelebration: null,

      checkCarrotMilestone: (totalCarrots: number) => {
        const { completedMilestones, showCelebration, completeMilestone } = get();

        // Find the highest milestone that should be triggered
        const eligibleMilestone = MILESTONES.filter(
          (m) =>
            m.type === 'carrots' &&
            totalCarrots >= m.value &&
            !completedMilestones.has(m.id)
        ).sort((a, b) => b.value - a.value)[0];

        if (eligibleMilestone) {
          completeMilestone(eligibleMilestone.id);
          showCelebration(eligibleMilestone);
        }
      },

      checkPrestigeMilestone: (prestigeCount: number) => {
        const { completedMilestones, showCelebration, completeMilestone } = get();

        const eligibleMilestone = MILESTONES.filter(
          (m) =>
            m.type === 'prestige' &&
            prestigeCount >= m.value &&
            !completedMilestones.has(m.id)
        ).sort((a, b) => b.value - a.value)[0];

        if (eligibleMilestone) {
          completeMilestone(eligibleMilestone.id);
          showCelebration(eligibleMilestone);
        }
      },

      completeMilestone: (milestoneId: string) => {
        set((state) => ({
          completedMilestones: new Set([...state.completedMilestones, milestoneId]),
        }));
      },

      showCelebration: (milestone: Milestone) => {
        set({ activeCelebration: milestone });
      },

      hideCelebration: () => {
        set({ activeCelebration: null });
      },

      isMilestoneCompleted: (milestoneId: string) => {
        return get().completedMilestones.has(milestoneId);
      },
    }),
    {
      name: 'rabbit-clicker-milestones',
      // Convert Set to Array for serialization
      partialize: (state) => ({
        completedMilestones: Array.from(state.completedMilestones),
      }),
      // Restore Set from Array
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.completedMilestones = new Set(
            Array.isArray(state.completedMilestones)
              ? state.completedMilestones
              : []
          );
        }
      },
    }
  )
);
