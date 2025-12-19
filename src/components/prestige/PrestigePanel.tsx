import { useState, useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { usePrestigeStore } from '@/stores/prestigeStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { ACHIEVEMENTS } from '@/game/data/achievements';
import { formatNumber } from '@/utils';
import {
  canPrestige,
  calculatePrestigeReward,
  getPrestigeBonus,
  calculateMultiplierFromSeeds,
  performPrestige,
  PRESTIGE_UNLOCK_THRESHOLD,
} from '@/game/mechanics/prestige';
import { PrestigeConfirm } from './PrestigeConfirm';

interface PrestigePanelProps {
  onClose?: () => void;
}

/**
 * PrestigePanel Component
 * Shows prestige preview and allows player to perform prestige
 */
export function PrestigePanel({ onClose }: PrestigePanelProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPerformingPrestige, setIsPerformingPrestige] = useState(false);

  // Get state
  const lifetimeCarrots = useGameStore((state) => state.lifetimeCarrots);
  const goldenCarrots = useGameStore((state) => state.goldenCarrots);
  const { goldenSeeds, prestigeCount } = usePrestigeStore();
  const { getOwnedRabbitsArray } = useRabbitStore();
  const achievementStore = useAchievementStore();

  // Calculate achievement stats
  const achievementStats = useMemo(() => {
    const achievementsWithProgress = ACHIEVEMENTS.map((achievement) => {
      return achievementStore.getAchievementWithProgress(achievement.id);
    }).filter((a) => a !== null);

    const total = achievementsWithProgress.length;
    const completed = achievementsWithProgress.filter((a) => a.isUnlocked).length;

    return { total, completed };
  }, [achievementStore]);

  // Calculate prestige preview
  const canDoPrestige = canPrestige();
  const goldenSeedsToEarn = calculatePrestigeReward();
  const currentMultiplier = getPrestigeBonus();
  const newGoldenSeeds = goldenSeeds + goldenSeedsToEarn;
  const newMultiplier = calculateMultiplierFromSeeds(newGoldenSeeds);

  // Get what will be kept
  const allRabbits = getOwnedRabbitsArray();
  const keptRabbits = allRabbits.filter(
    (rabbit) => rabbit.rarity === 'legendary' || rabbit.rarity === 'mythical'
  );

  // Handle prestige
  const handlePrestige = async () => {
    if (!canDoPrestige || isPerformingPrestige) return;

    setIsPerformingPrestige(true);

    try {
      const result = performPrestige();

      if (result.success) {
        // Success! Close the panel
        console.log('Prestige successful!', result);
        if (onClose) {
          onClose();
        }
      } else {
        console.error('Prestige failed:', result.error);
        alert(result.error || 'Prestige failed');
      }
    } catch (error) {
      console.error('Error performing prestige:', error);
      alert('An error occurred during prestige');
    } finally {
      setIsPerformingPrestige(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-4xl">✨</span>
              Prestige
            </h2>
            <p className="text-purple-100 text-sm">
              Reset your progress for permanent bonuses
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              aria-label="Close prestige panel"
            >
              <span className="text-3xl">✕</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          {!canDoPrestige && (
            <div className="card bg-red-50 border-2 border-red-300">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔒</span>
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Prestige Locked</h3>
                  <p className="text-sm text-red-700">
                    You need {formatNumber(PRESTIGE_UNLOCK_THRESHOLD)} lifetime carrots to prestige.
                    <br />
                    Current: {formatNumber(lifetimeCarrots)} (
                    {((lifetimeCarrots / PRESTIGE_UNLOCK_THRESHOLD) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Stats */}
          <div className="card border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              Current Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Lifetime Carrots</div>
                <div className="text-2xl font-bold text-carrot">
                  {formatNumber(lifetimeCarrots)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Prestige Count</div>
                <div className="text-2xl font-bold text-purple-600">{prestigeCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Golden Seeds</div>
                <div className="text-2xl font-bold text-yellow-600">{goldenSeeds}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Production Multiplier</div>
                <div className="text-2xl font-bold text-green-600">
                  {currentMultiplier.toFixed(2)}x
                </div>
              </div>
            </div>
          </div>

          {/* Prestige Preview */}
          {canDoPrestige && (
            <div className="card border-2 border-purple-300 bg-purple-50">
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <span>⚡</span>
                Prestige Rewards
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Golden Seeds Earned</div>
                    <div className="text-xl font-bold text-yellow-600">
                      +{goldenSeedsToEarn}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">New Total</div>
                    <div className="text-xl font-bold text-yellow-600">{newGoldenSeeds}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Production Multiplier</div>
                    <div className="text-xl font-bold text-green-600">
                      {currentMultiplier.toFixed(2)}x → {newMultiplier.toFixed(2)}x
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-bold">
                      +{((newMultiplier - currentMultiplier) * 100).toFixed(0)}% Boost!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What You'll Keep */}
          <div className="card border-2 border-green-300 bg-green-50">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <span>✅</span>
              What You'll Keep
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <span>
                  <strong>Golden Seeds:</strong> All {newGoldenSeeds} Golden Seeds (
                  {newMultiplier.toFixed(2)}x multiplier)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🥇</span>
                <span>
                  <strong>Golden Carrots:</strong> All {formatNumber(goldenCarrots)} Golden
                  Carrots
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🐰</span>
                <span>
                  <strong>Rare Rabbits:</strong> {keptRabbits.length} Legendary/Mythical rabbits
                  (reset to level 1)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <span>
                  <strong>Achievements:</strong> All {achievementStats.completed} completed
                  achievements
                </span>
              </li>
            </ul>
          </div>

          {/* What You'll Lose */}
          <div className="card border-2 border-red-300 bg-red-50">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <span>❌</span>
              What You'll Lose
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-xl">🥕</span>
                <span>
                  <strong>All Regular Carrots</strong> (current run progress)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🐰</span>
                <span>
                  <strong>Common/Uncommon/Rare/Epic Rabbits</strong> (
                  {allRabbits.length - keptRabbits.length} rabbits)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span>
                  <strong>All Upgrades</strong> (click power, production boosts)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🏭</span>
                <span>
                  <strong>All Buildings</strong> (farms, factories, etc.)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <span>
                  <strong>Crate Pity Counters</strong> (resets for fresh start)
                </span>
              </li>
            </ul>
          </div>

          {/* Prestige Button */}
          <button
            onClick={() => setIsConfirming(true)}
            disabled={!canDoPrestige || isPerformingPrestige}
            className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
              canDoPrestige && !isPerformingPrestige
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 hover:shadow-lg active:scale-98'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPerformingPrestige ? 'Performing Prestige...' : 'Prestige Now'}
          </button>
        </div>
      </div>

      {/* Dramatic Confirmation Dialog */}
      {isConfirming && (
        <PrestigeConfirm
          goldenSeedsToEarn={goldenSeedsToEarn}
          newGoldenSeeds={newGoldenSeeds}
          newMultiplier={newMultiplier}
          keptRabbitsCount={keptRabbits.length}
          lostRabbitsCount={allRabbits.length - keptRabbits.length}
          goldenCarrots={goldenCarrots}
          achievementsCompleted={achievementStats.completed}
          onConfirm={handlePrestige}
          onCancel={() => setIsConfirming(false)}
          isPerforming={isPerformingPrestige}
        />
      )}
    </div>
  );
}
