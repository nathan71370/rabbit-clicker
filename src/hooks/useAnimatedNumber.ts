import { useEffect, useRef, useState } from 'react';

export interface UseAnimatedNumberOptions {
  /**
   * Duration of the animation in milliseconds
   * @default 500
   */
  duration?: number;

  /**
   * Enable spring animation for more natural motion
   * @default true
   */
  useSpring?: boolean;

  /**
   * Spring stiffness (higher = faster, snappier)
   * @default 100
   */
  stiffness?: number;

  /**
   * Spring damping (higher = less oscillation)
   * @default 20
   */
  damping?: number;
}

/**
 * Hook that smoothly animates number transitions with optional spring physics.
 *
 * @param target - The target number to animate to
 * @param options - Animation configuration options
 * @returns The current animated value
 *
 * @example
 * ```tsx
 * const animatedValue = useAnimatedNumber(carrots, { duration: 800 });
 * return <div>{formatNumber(animatedValue)}</div>;
 * ```
 */
export function useAnimatedNumber(
  target: number,
  options: UseAnimatedNumberOptions = {}
): number {
  const {
    duration = 500,
    useSpring = true,
    stiffness = 100,
    damping = 20,
  } = options;

  const [displayValue, setDisplayValue] = useState(target);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = undefined;
    const startValue = displayValue;

    // Track current value and velocity locally within animation loop
    let currentValue = displayValue;
    let velocity = 0;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      let newValue: number;

      if (useSpring) {
        // Spring physics animation with duration enforcement
        const delta = target - currentValue;
        const springForce = delta * (stiffness / 1000);
        const dampingForce = velocity * (damping / 1000);
        const acceleration = springForce - dampingForce;

        velocity += acceleration;
        newValue = currentValue + velocity;

        // Apply time-based envelope to respect duration
        // Mix spring result toward target based on progress
        newValue = currentValue + (newValue - currentValue) * (1 - progress * 0.3);

        // Force completion when duration elapsed
        if (progress >= 1) {
          newValue = target;
          velocity = 0;
        } else if (Math.abs(delta) < 0.01 && Math.abs(velocity) < 0.01) {
          // Stop when close enough to target with low velocity
          newValue = target;
          velocity = 0;
        }

        currentValue = newValue;
      } else {
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        newValue = startValue + (target - startValue) * easeOut;
        currentValue = newValue;
      }

      setDisplayValue(newValue);

      // Continue animation if not complete
      if (newValue !== target) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration, useSpring, stiffness, damping]);

  return Math.round(displayValue);
}
