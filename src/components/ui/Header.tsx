import { useGameStore } from '@/stores/gameStore';
import { formatNumber } from '@/utils';
import { XPDisplay } from './XPDisplay';
import { canPrestige } from '@/game/mechanics/prestige';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';

interface HeaderProps {
  onSettingsClick: () => void;
  onAchievementsClick?: () => void;
  onPrestigeClick?: () => void;
}

/**
 * Header Component
 * Top header bar showing currencies and action buttons
 */
export function Header({ onSettingsClick, onAchievementsClick, onPrestigeClick }: HeaderProps) {
  const { carrots, goldenCarrots } = useGameStore();
  const canDoPrestige = canPrestige();

  // Animate number transitions for smooth updates
  const animatedCarrots = useAnimatedNumber(Math.floor(carrots), { duration: 600 });
  const animatedGoldenCarrots = useAnimatedNumber(Math.floor(goldenCarrots), { duration: 600 });

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-20 shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Game Title (hidden on mobile) */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">
            Rabbit Clicker
          </h1>
        </div>

        {/* Center: Currencies */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Carrots */}
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl">
            <span className="text-xl" aria-hidden="true">🥕</span>
            <span className="font-bold text-gray-900 text-sm">
              {formatNumber(animatedCarrots)}
            </span>
          </div>

          {/* Golden Carrots */}
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-xl">
            <span className="text-xl" aria-hidden="true">⭐</span>
            <span className="font-bold text-gray-900 text-sm">
              {formatNumber(animatedGoldenCarrots)}
            </span>
          </div>

          {/* Rabbit XP */}
          <XPDisplay />
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Prestige Button (only show when available) */}
          {canDoPrestige && onPrestigeClick && (
            <button
              onClick={onPrestigeClick}
              aria-label="View prestige"
              className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-all relative"
              title="Prestige Available!"
            >
              <span className="text-xl">✨</span>
              {/* Pulse animation to draw attention */}
              <span className="absolute top-0 right-0 h-3 w-3 bg-purple-500 rounded-full animate-ping"></span>
            </button>
          )}

          {/* Achievements Button */}
          {onAchievementsClick && (
            <button
              onClick={onAchievementsClick}
              aria-label="View achievements"
              className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all"
              title="Achievements"
            >
              <span className="text-xl">🏆</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onSettingsClick}
            aria-label="Open settings"
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}
