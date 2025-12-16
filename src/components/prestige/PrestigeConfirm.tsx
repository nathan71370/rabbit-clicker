import { useState } from 'react';
import { formatNumber } from '@/utils';

interface PrestigeConfirmProps {
  /** Number of Golden Seeds that will be earned */
  goldenSeedsToEarn: number;
  /** New total Golden Seeds after prestige */
  newGoldenSeeds: number;
  /** New multiplier after prestige */
  newMultiplier: number;
  /** Number of Legendary/Mythical rabbits that will be kept */
  keptRabbitsCount: number;
  /** Number of rabbits that will be lost */
  lostRabbitsCount: number;
  /** Golden Carrots that will be kept */
  goldenCarrots: number;
  /** Number of achievements completed */
  achievementsCompleted: number;
  /** Callback when confirmation is confirmed */
  onConfirm: () => void;
  /** Callback when confirmation is cancelled */
  onCancel: () => void;
  /** Whether prestige is in progress */
  isPerforming?: boolean;
}

/**
 * PrestigeConfirm Component
 * Dramatic confirmation dialog for prestige action
 * Requires typing "PRESTIGE" to confirm
 */
export function PrestigeConfirm({
  goldenSeedsToEarn,
  newGoldenSeeds,
  newMultiplier,
  keptRabbitsCount,
  lostRabbitsCount,
  goldenCarrots,
  achievementsCompleted,
  onConfirm,
  onCancel,
  isPerforming = false,
}: PrestigeConfirmProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmValid = confirmText.toUpperCase() === 'PRESTIGE';

  const handleConfirm = () => {
    if (isConfirmValid && !isPerforming) {
      onConfirm();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isConfirmValid && !isPerforming) {
      handleConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        {/* Dramatic Warning Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl animate-pulse">⚠️</span>
            <h2 className="text-3xl font-black uppercase tracking-wide">Warning!</h2>
            <span className="text-5xl animate-pulse">⚠️</span>
          </div>
          <p className="text-center text-red-100 text-lg font-bold">
            You are about to reset your progress!
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Consequences */}
          <div className="space-y-4">
            {/* What You'll Get */}
            <div className="card border-2 border-green-400 bg-green-50">
              <h3 className="font-black text-green-900 mb-3 flex items-center gap-2 text-lg">
                <span className="text-2xl">✨</span>
                PERMANENT GAINS
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="font-bold text-gray-700">Golden Seeds</span>
                  <span className="text-yellow-600 font-black text-lg">
                    +{goldenSeedsToEarn} (Total: {newGoldenSeeds})
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="font-bold text-gray-700">Production Multiplier</span>
                  <span className="text-green-600 font-black text-lg">
                    {newMultiplier.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            {/* What You'll Keep */}
            <div className="card border-2 border-blue-400 bg-blue-50">
              <h3 className="font-black text-blue-900 mb-3 flex items-center gap-2 text-lg">
                <span className="text-2xl">💎</span>
                KEEPING
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-lg">🥇</span>
                  <span className="font-semibold">
                    {formatNumber(goldenCarrots)} Golden Carrots
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">🐰</span>
                  <span className="font-semibold">
                    {keptRabbitsCount} Legendary/Mythical Rabbits (level 1)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <span className="font-semibold">{achievementsCompleted} Achievements</span>
                </li>
              </ul>
            </div>

            {/* What You'll Lose */}
            <div className="card border-2 border-red-400 bg-red-50">
              <h3 className="font-black text-red-900 mb-3 flex items-center gap-2 text-lg">
                <span className="text-2xl">💥</span>
                LOSING (PERMANENT!)
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-lg">🥕</span>
                  <span className="font-semibold text-red-800">ALL Regular Carrots</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">🐰</span>
                  <span className="font-semibold text-red-800">
                    {lostRabbitsCount} Common-Epic Rabbits
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="font-semibold text-red-800">ALL Upgrades</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">🏭</span>
                  <span className="font-semibold text-red-800">ALL Buildings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <span className="font-semibold text-red-800">Crate Pity Progress</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="card border-2 border-purple-400 bg-purple-50">
            <label className="block">
              <div className="mb-2">
                <p className="font-black text-purple-900 text-center mb-1">
                  Type <span className="text-red-600">PRESTIGE</span> to confirm:
                </p>
                <p className="text-xs text-purple-700 text-center">
                  (This action cannot be undone!)
                </p>
              </div>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type PRESTIGE here..."
                disabled={isPerforming}
                className="w-full px-4 py-3 text-center text-xl font-bold uppercase border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                autoFocus
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onCancel}
              disabled={isPerforming}
              className="py-4 px-6 rounded-xl font-black text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isConfirmValid || isPerforming}
              className={`py-4 px-6 rounded-xl font-black text-lg transition-all ${
                isConfirmValid && !isPerforming
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPerforming ? 'PRESTIGING...' : 'CONFIRM PRESTIGE'}
            </button>
          </div>

          {/* Visual Hint */}
          {!isConfirmValid && confirmText.length > 0 && (
            <p className="text-center text-sm text-red-600 font-semibold animate-pulse">
              ✗ Must type exactly "PRESTIGE"
            </p>
          )}
          {isConfirmValid && (
            <p className="text-center text-sm text-green-600 font-semibold">
              ✓ Ready to confirm
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
