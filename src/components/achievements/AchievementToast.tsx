import { useState, useEffect, useCallback, useRef } from 'react';
import type { Achievement } from '@/types/achievement';
import { playAchievementUnlockSound } from '@/utils/achievementSounds';

interface ToastData {
  id: string;
  achievement: Achievement;
  timestamp: number;
}

/**
 * AchievementToast Component
 * Displays toast notifications when achievements are unlocked
 *
 * Features:
 * - Slides in from top-right
 * - Auto-dismisses after 5 seconds
 * - Click to dismiss early
 * - Queues multiple achievements
 * - Smooth animations
 */
export function AchievementToast() {
  const [toastQueue, setToastQueue] = useState<ToastData[]>([]);
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

  /**
   * Show a new achievement toast
   * Adds to queue if toast is already showing
   * Plays achievement unlock sound
   */
  const showToast = useCallback((achievement: Achievement) => {
    const newToast: ToastData = {
      id: `${achievement.id}-${Date.now()}`,
      achievement,
      timestamp: Date.now(),
    };

    // Play achievement unlock sound
    playAchievementUnlockSound();

    setToastQueue((prev) => [...prev, newToast]);
  }, []);

  /**
   * Dismiss the current toast
   */
  const dismissToast = useCallback(() => {
    setIsExiting(true);

    if (exitTimeoutRef.current !== null) {
      clearTimeout(exitTimeoutRef.current);
    }

    exitTimeoutRef.current = window.setTimeout(() => {
      setCurrentToast(null);
      setIsExiting(false);
      exitTimeoutRef.current = null;
    }, 300); // Match animation duration
  }, []);

  /**
   * Process toast queue
   * When there is no current toast, show the next one in the queue (if any)
   */
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      const [nextToast] = toastQueue;
      setCurrentToast(nextToast);
      setToastQueue((prev) => prev.slice(1));
    }
  }, [currentToast, toastQueue]);

  /**
   * Auto-dismiss the currently visible toast after 5 seconds
   */
  useEffect(() => {
    if (!currentToast) return;

    const timer = setTimeout(() => {
      dismissToast();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentToast, dismissToast]);

  /**
   * Cleanup exit timer on unmount
   */
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Expose showToast globally for achievement system
   */
  useEffect(() => {
    // Attach to window for global access
    window.showAchievementToast = showToast;

    return () => {
      delete window.showAchievementToast;
    };
  }, [showToast]);

  if (!currentToast) {
    return null;
  }

  const { achievement } = currentToast;

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ease-out ${
        isExiting
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100'
      }`}
      style={{
        animation: isExiting ? undefined : 'slideInFromRight 0.3s ease-out',
      }}
    >
      <button
        onClick={dismissToast}
        className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 text-white rounded-lg shadow-2xl p-4 pr-6 flex items-center gap-3 min-w-[280px] max-w-[400px] hover:shadow-3xl transition-shadow cursor-pointer border-2 border-yellow-300"
      >
        {/* Achievement Icon */}
        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex-shrink-0">
          <span className="text-4xl">{achievement.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 text-left">
          <div className="text-xs font-bold uppercase tracking-wider mb-1 text-yellow-100">
            Achievement Unlocked!
          </div>
          <div className="font-bold text-base mb-1 text-white leading-tight">
            {achievement.name}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-lg">🥇</span>
            <span className="font-bold text-yellow-100">
              +{achievement.reward.goldenCarrots} Golden Carrots
            </span>
          </div>
        </div>

        {/* Close indicator */}
        <div className="absolute top-2 right-2 text-white text-opacity-60 text-xs">
          ✕
        </div>
      </button>

      {/* Queue indicator - show if more toasts are waiting */}
      {toastQueue.length > 0 && (
        <div className="mt-2 text-center text-xs text-gray-600 bg-white bg-opacity-90 rounded-full px-3 py-1 shadow">
          +{toastQueue.length} more
        </div>
      )}

      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
