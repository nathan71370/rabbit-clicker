import { useState } from 'react';

interface PityCounterProps {
  cratesSinceEpic: number;
  cratesSinceLegendary: number;
  cratesSinceMythical: number;
  epicPityThreshold: number;
  legendaryPityThreshold: number;
  mythicalPityThreshold: number;
}

/**
 * PityCounter Component
 * Displays pity system progress with visual progress bars
 * Shows how many crates until guaranteed rare drops
 */
export function PityCounter({
  cratesSinceEpic,
  cratesSinceLegendary,
  cratesSinceMythical,
  epicPityThreshold,
  legendaryPityThreshold,
  mythicalPityThreshold,
}: PityCounterProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  /**
   * Calculate pity progress percentage and label
   */
  const getPityProgress = (
    counter: number,
    threshold: number
  ): { percentage: number; label: string } => {
    const percentage = Math.min((counter / threshold) * 100, 100);
    const remaining = Math.max(threshold - counter, 0);
    return {
      percentage,
      label: remaining === 0 ? 'Guaranteed!' : `${remaining} left`,
    };
  };

  const epicPity = getPityProgress(cratesSinceEpic, epicPityThreshold);
  const legendaryPity = getPityProgress(cratesSinceLegendary, legendaryPityThreshold);
  const mythicalPity = getPityProgress(cratesSinceMythical, mythicalPityThreshold);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide opacity-90">Pity Progress</h3>
        <div className="group relative">
          <button
            type="button"
            aria-label="Pity system information"
            aria-expanded={tooltipOpen}
            onClick={() => setTooltipOpen(!tooltipOpen)}
            onBlur={() => setTooltipOpen(false)}
            className="text-xs opacity-70 cursor-help focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
          >
            ℹ️
          </button>
          <div
            role="tooltip"
            className={`absolute left-0 top-6 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl ${
              tooltipOpen ? 'block' : 'hidden group-hover:block group-focus-within:block'
            }`}
          >
            <p className="font-bold mb-2">What is the Pity System?</p>
            <p className="mb-2">
              The pity system guarantees you'll get rare rabbits after opening a certain number of crates without getting one.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Epic: Guaranteed after {epicPityThreshold} crates</li>
              <li>Legendary: Guaranteed after {legendaryPityThreshold} crates</li>
              <li>Mythical: Guaranteed after {mythicalPityThreshold} crates</li>
            </ul>
            <p className="mt-2 text-gray-300">
              Higher rarity drops reset lower tier counters too!
            </p>
          </div>
        </div>
      </div>

      {/* Epic Pity */}
      <div className="bg-white/10 rounded-lg p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">Epic Guarantee</span>
          <span className="text-xs">{epicPity.label}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple-300 h-full transition-all duration-300"
            style={{ width: `${epicPity.percentage}%` }}
          />
        </div>
      </div>

      {/* Legendary Pity */}
      <div className="bg-white/10 rounded-lg p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">Legendary Guarantee</span>
          <span className="text-xs">{legendaryPity.label}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-yellow-300 h-full transition-all duration-300"
            style={{ width: `${legendaryPity.percentage}%` }}
          />
        </div>
      </div>

      {/* Mythical Pity */}
      <div className="bg-white/10 rounded-lg p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">Mythical Guarantee</span>
          <span className="text-xs">{mythicalPity.label}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-pink-300 h-full transition-all duration-300"
            style={{ width: `${mythicalPity.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
