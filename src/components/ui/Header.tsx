import { useGameStore } from '@/stores/gameStore';
import { formatNumber } from '@/utils';
import { XPDisplay } from './XPDisplay';

interface HeaderProps {
  onSettingsClick: () => void;
  onAchievementsClick?: () => void;
}

/**
 * Header Component
 * Top header bar showing currencies and action buttons
 */
export function Header({ onSettingsClick, onAchievementsClick }: HeaderProps) {
  const { carrots, goldenCarrots } = useGameStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Game Title (hidden on mobile) */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-800">Rabbit Clicker</h1>
        </div>

        {/* Center: Currencies */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Carrots */}
          <div className="flex items-center gap-2 bg-carrot-light bg-opacity-20 px-3 py-2 rounded-lg">
            <span className="text-2xl" aria-hidden="true">🥕</span>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 hidden sm:block">Carrots</span>
              <span className="font-bold text-carrot-dark">
                {formatNumber(Math.floor(carrots))}
              </span>
            </div>
          </div>

          {/* Golden Carrots */}
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg">
            <span className="text-2xl" aria-hidden="true">🥇</span>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 hidden sm:block">Golden</span>
              <span className="font-bold text-yellow-600">
                {formatNumber(Math.floor(goldenCarrots))}
              </span>
            </div>
          </div>

          {/* Rabbit XP */}
          <XPDisplay />
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Achievements Button (placeholder) */}
          {onAchievementsClick && (
            <button
              onClick={onAchievementsClick}
              aria-label="View achievements"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Achievements (Coming Soon)"
            >
              <span className="text-2xl">🏆</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onSettingsClick}
            aria-label="Open settings"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}
