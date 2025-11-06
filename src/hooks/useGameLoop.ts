import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';

/**
 * Game Loop Hook using requestAnimationFrame
 *
 * Implements the main game tick system for idle production.
 * Runs continuously and updates game state based on elapsed time.
 *
 * Features:
 * - Uses requestAnimationFrame for smooth, efficient updates
 * - Calculates delta time between frames
 * - Caps delta time at 0.1s to prevent "spiral of death"
 * - Supports pause functionality
 * - Proper cleanup on unmount to prevent memory leaks
 *
 * @param isPaused - Whether the game loop should be paused (default: false)
 * @param isLoading - Whether the game is still loading (prevents race conditions)
 */
export function useGameLoop(isPaused?: boolean, isLoading?: boolean) {
  const tick = useGameStore((state) => state.tick);
  const calculateOfflineProgress = useGameStore((state) => state.calculateOfflineProgress);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(performance.now());
  const hasCalculatedOfflineProgress = useRef<boolean>(false);

  // Calculate offline progress on mount (only once) - skip if loading
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!hasCalculatedOfflineProgress.current) {
      calculateOfflineProgress();
      hasCalculatedOfflineProgress.current = true;
    }
  }, [calculateOfflineProgress, isLoading]);

  useEffect(() => {
    // Don't start loop if loading or paused
    if (isLoading || isPaused === true) {
      return;
    }

    /**
     * Game loop function called every frame
     * Calculates delta time and calls the game tick
     */
    const gameLoop = (currentTime: number) => {
      // Calculate time elapsed since last frame (in seconds)
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;

      // Cap delta time at 0.1 seconds (100ms) to prevent spiral of death
      // This prevents huge time jumps when tab is inactive or frame rate drops
      const cappedDeltaTime = Math.min(deltaTime, 0.1);

      // Update game state with capped delta time
      tick(cappedDeltaTime);

      // Store current time for next frame
      lastTimeRef.current = currentTime;

      // Schedule next frame
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    animationFrameId.current = requestAnimationFrame(gameLoop);

    // Cleanup: cancel animation frame on unmount or when paused/loading changes
    return () => {
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isLoading, isPaused, tick]);

  // Reset lastTime when unpausing or finishing load to prevent large delta time spike
  useEffect(() => {
    if (!isLoading && isPaused !== true) {
      lastTimeRef.current = performance.now();
    }
  }, [isLoading, isPaused]);

  // Handle tab visibility changes for offline progress - skip if loading
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible - calculate offline progress
        calculateOfflineProgress();
        // Reset lastTime to prevent delta spike
        lastTimeRef.current = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [calculateOfflineProgress, isLoading]);
}
