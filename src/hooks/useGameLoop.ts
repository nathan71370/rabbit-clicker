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
 */
export function useGameLoop(isPaused?: boolean) {
  const tick = useGameStore((state) => state.tick);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    // Don't start loop if paused
    if (isPaused === true) {
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

    // Cleanup: cancel animation frame on unmount or when paused changes
    return () => {
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPaused, tick]);

  // Reset lastTime when unpausing to prevent large delta time spike
  useEffect(() => {
    if (isPaused !== true) {
      lastTimeRef.current = performance.now();
    }
  }, [isPaused]);
}
