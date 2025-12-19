import { useEffect, useState } from 'react';
import { useGameStore, type OfflineEarnings } from '@/stores/gameStore';

/**
 * Hook to handle offline earnings calculation
 * Calculates and applies offline progress when the game loads
 * @returns Offline earnings data if player was away, null otherwise
 */
export function useOfflineTime(): OfflineEarnings | null {
  const [offlineEarnings, setOfflineEarnings] = useState<OfflineEarnings | null>(null);
  const calculateOfflineProgress = useGameStore((state) => state.calculateOfflineProgress);

  useEffect(() => {
    // Calculate offline progress once on mount
    const earnings = calculateOfflineProgress();

    if (earnings) {
      setOfflineEarnings(earnings);
    }
  }, [calculateOfflineProgress]);

  return offlineEarnings;
}
