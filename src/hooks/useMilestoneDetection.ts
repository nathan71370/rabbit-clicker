import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { usePrestigeStore } from '@/stores/prestigeStore';
import { useMilestoneStore } from '@/stores/milestoneStore';

/**
 * Hook to automatically detect and trigger milestone celebrations
 *
 * Monitors lifetime carrots and prestige count to trigger celebrations
 * when milestones are reached
 */
export function useMilestoneDetection() {
  const lifetimeCarrots = useGameStore((state) => state.lifetimeCarrots);
  const prestigeCount = usePrestigeStore((state) => state.prestigeCount);
  const checkCarrotMilestone = useMilestoneStore((state) => state.checkCarrotMilestone);
  const checkPrestigeMilestone = useMilestoneStore((state) => state.checkPrestigeMilestone);

  // Track previous values to detect increases
  const prevLifetimeCarrots = useRef(lifetimeCarrots);
  const prevPrestigeCount = useRef(prestigeCount);

  useEffect(() => {
    // Check carrot milestones when lifetime carrots increase
    if (lifetimeCarrots > prevLifetimeCarrots.current) {
      checkCarrotMilestone(lifetimeCarrots);
      prevLifetimeCarrots.current = lifetimeCarrots;
    }
  }, [lifetimeCarrots, checkCarrotMilestone]);

  useEffect(() => {
    // Check prestige milestones when prestige count increases
    if (prestigeCount > prevPrestigeCount.current) {
      checkPrestigeMilestone(prestigeCount);
      prevPrestigeCount.current = prestigeCount;
    }
  }, [prestigeCount, checkPrestigeMilestone]);
}
