import type { AchievementWithProgress } from '@/stores/achievementStore';

interface AchievementCardProps {
  achievement: AchievementWithProgress;
}

/**
 * AchievementCard Component
 * Displays individual achievement with progress and reward
 */
export function AchievementCard({ achievement }: AchievementCardProps) {
  const {
    name,
    description,
    icon,
    tier,
    isUnlocked,
    progress,
    reward,
    unlockedAt,
  } = achievement;

  // Get tier color
  const getTierColor = () => {
    switch (tier) {
      case 'bronze':
        return 'from-amber-700 to-amber-900';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'platinum':
        return 'from-cyan-400 to-cyan-600';
      case 'diamond':
        return 'from-blue-400 to-purple-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  // Get tier name for display
  const getTierName = () => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // Format unlock date
  const getUnlockDateString = () => {
    if (!unlockedAt) return '';
    const date = new Date(unlockedAt);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`card transition-all duration-200 relative overflow-hidden ${
        isUnlocked
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-400 border-2'
          : 'border-2 border-gray-200'
      }`}
    >
      {/* Tier Badge */}
      <div className="absolute top-2 right-2">
        <div
          className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getTierColor()} shadow-sm`}
        >
          {getTierName()}
        </div>
      </div>

      {/* Icon and Info */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`text-5xl flex-shrink-0 p-3 rounded-lg ${
            isUnlocked ? 'bg-green-200' : 'bg-gray-100'
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 pr-16">
          <h3 className={`font-bold text-lg mb-1 ${isUnlocked ? 'text-green-800' : 'text-gray-800'}`}>
            {name}
            {isUnlocked && (
              <span className="ml-2 text-green-600">
                ✓
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600 leading-snug">{description}</p>
        </div>
      </div>

      {/* Progress Bar (for incomplete achievements) */}
      {!isUnlocked && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-bold">
              {Math.floor(progress.current).toLocaleString()} / {progress.target.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-carrot-light to-carrot h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-0.5 text-right">
            {progress.percentage.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Unlock Date (for completed achievements) */}
      {isUnlocked && unlockedAt && (
        <div className="mb-3 text-xs text-green-700 font-medium">
          Unlocked {getUnlockDateString()}
        </div>
      )}

      {/* Reward */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
          Reward
        </span>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            isUnlocked ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          <span className="text-lg">🥇</span>
          <span className="font-bold text-base">{reward.goldenCarrots}</span>
          {isUnlocked && (
            <span className="ml-1 text-xs text-green-600">✓ Claimed</span>
          )}
        </div>
      </div>
    </div>
  );
}
