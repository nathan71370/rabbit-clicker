import type { OfflineEarnings } from '@/stores/gameStore';
import { formatNumber } from '@/utils';

interface WelcomeBackModalProps {
  /** Offline earnings data */
  earnings: OfflineEarnings;
  /** Callback when modal is closed */
  onClose: () => void;
}

/**
 * Format seconds into a human-readable time string
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2h 30m", "45m 20s", "30s")
 */
function formatTimeAway(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  }

  if (minutes > 0) {
    if (secs > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${minutes}m`;
  }

  return `${secs}s`;
}

/**
 * WelcomeBackModal Component
 * Shows offline earnings when player returns to the game
 */
export function WelcomeBackModal({ earnings, onClose }: WelcomeBackModalProps) {
  const { timeAway, carrotsEarned, potentialCarrots, carrotsPerSecond } = earnings;
  const timeAwayFormatted = formatTimeAway(timeAway);
  const efficiency = 50; // Current offline efficiency

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-gray-800 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">👋</span>
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
          </div>
          <p className="text-center text-green-100 text-sm">
            You've been away for {timeAwayFormatted}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Earnings Summary */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">While you were away, your rabbits earned:</p>
            <div className="card bg-carrot bg-opacity-10 border-2 border-carrot">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">🥕</span>
                <div>
                  <div className="text-4xl font-black text-carrot">
                    {formatNumber(Math.floor(carrotsEarned))}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">
                    Carrots ({efficiency}% efficiency)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Production Stats */}
          <div className="card border-2 border-gray-200 bg-gray-50">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Production Rate</span>
                <span className="font-bold text-gray-900">
                  {formatNumber(carrotsPerSecond)}/sec
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time Away</span>
                <span className="font-bold text-gray-900">{timeAwayFormatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Offline Efficiency</span>
                <span className="font-bold text-green-600">{efficiency}%</span>
              </div>
              <div className="h-px bg-gray-300"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">You Earned</span>
                <span className="font-bold text-carrot">
                  {formatNumber(Math.floor(carrotsEarned))} 🥕
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">
                  (Missed: {formatNumber(Math.floor(potentialCarrots - carrotsEarned))})
                </span>
                <span className="text-gray-400 text-xs">
                  {formatNumber(Math.floor(potentialCarrots))} at 100%
                </span>
              </div>
            </div>
          </div>

          {/* Ad Option (Stub) */}
          <div className="card border-2 border-purple-300 bg-purple-50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📺</span>
              <div className="flex-1">
                <h3 className="font-bold text-purple-900 mb-1">
                  Watch Ad for 100% Earnings
                </h3>
                <p className="text-xs text-purple-700">
                  Coming soon! Claim full offline earnings by watching a short ad.
                </p>
              </div>
            </div>
            <button
              disabled
              className="w-full mt-3 py-2 rounded-lg font-bold bg-gray-200 text-gray-400 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 hover:shadow-lg transition-all"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
}
