import { useState, useEffect, useCallback } from 'react';
import type { Achievement } from '@/types/achievement';

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

  /**
   * Show a new achievement toast
   * Adds to queue if toast is already showing
   */
  const showToast = useCallback((achievement: Achievement) => {
    const newToast: ToastData = {
      id: `${achievement.id}-${Date.now()}`,
      achievement,
      timestamp: Date.now(),
    };

    setToastQueue((prev) => [...prev, newToast]);
  }, []);

  /**
   * Dismiss the current toast
   */
  const dismissToast = useCallback(() => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setCurrentToast(null);
      setIsExiting(false);
    }, 300); // Match animation duration
  }, []);

  /**
   * Process toast queue
   * Shows next toast when current one is dismissed
   */
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      // Show next toast in queue
      const [nextToast, ...remainingQueue] = toastQueue;
      setCurrentToast(nextToast);
      setToastQueue(remainingQueue);

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentToast, toastQueue, dismissToast]);

  /**
   * Expose showToast globally for achievement system
   */
  useEffect(() => {
    // Attach to window for global access
    (window as any).showAchievementToast = showToast;

    return () => {
      delete (window as any).showAchievementToast;
    };
  }, [showToast]);

  if (!currentToast) {
    return null;
  }

  const { achievement } = currentToast;

  return (
    <div
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
        aria-label="Dismiss achievement notification"
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
