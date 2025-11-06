import { useEffect, useRef, useState } from 'react';
import { saveGame } from '@/services';

/**
 * Auto-save interval in milliseconds (30 seconds)
 */
const AUTO_SAVE_INTERVAL = 30000;

/**
 * Duration to show "Saving..." indicator in milliseconds
 */
const SAVING_INDICATOR_DURATION = 1000;

/**
 * useAutoSave Hook
 * Automatically saves game state periodically and on page unload
 *
 * @param isLoading - Whether the game is still loading (prevents race conditions)
 * @returns Object containing saving state and manual save trigger function
 */
export function useAutoSave(isLoading?: boolean) {
  const [isSaving, setIsSaving] = useState(false);
  const savingTimeoutRef = useRef<number | null>(null);

  /**
   * Perform save operation with indicator
   */
  const performSave = () => {
    try {
      const success = saveGame();

      if (success) {
        // Show saving indicator
        setIsSaving(true);

        // Clear existing timeout if any
        if (savingTimeoutRef.current) {
          clearTimeout(savingTimeoutRef.current);
        }

        // Hide indicator after duration
        savingTimeoutRef.current = window.setTimeout(() => {
          setIsSaving(false);
        }, SAVING_INDICATOR_DURATION);
      }

      return success;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  };

  /**
   * Manual save trigger for significant actions (e.g., upgrade purchases)
   */
  const triggerSave = () => {
    performSave();
  };

  useEffect(() => {
    // Skip auto-save initialization while loading
    if (isLoading) {
      return;
    }

    // Set up auto-save timer (every 30 seconds)
    const intervalId = setInterval(() => {
      performSave();
    }, AUTO_SAVE_INTERVAL);

    // Set up beforeunload handler to save on page close/refresh
    const handleBeforeUnload = () => {
      // Synchronous save without indicator on page unload
      saveGame();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      if (savingTimeoutRef.current) {
        clearTimeout(savingTimeoutRef.current);
      }
    };
  }, [isLoading]);

  return {
    isSaving,
    triggerSave,
  };
}
