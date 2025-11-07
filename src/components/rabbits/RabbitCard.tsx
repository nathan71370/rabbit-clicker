import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Rabbit, Rarity } from '@/types/rabbit';
import { formatNumber } from '@/utils';

interface RabbitCardProps {
  rabbit: Rabbit;
  /** Whether the rabbit is owned by the player */
  isOwned?: boolean;
  /** Whether the rabbit is in the active team */
  isActive?: boolean;
  /** Click handler for card interaction */
  onClick?: () => void;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Get Tailwind border color class based on rarity
 */
function getRarityBorderColor(rarity: Rarity): string {
  const rarityColors: Record<Rarity, string> = {
    common: 'border-rarity-common',
    uncommon: 'border-rarity-uncommon',
    rare: 'border-rarity-rare',
    epic: 'border-rarity-epic',
    legendary: 'border-rarity-legendary',
    mythical: 'border-rarity-mythical',
  };
  return rarityColors[rarity];
}

/**
 * Get Tailwind text color class based on rarity
 */
function getRarityTextColor(rarity: Rarity): string {
  const rarityColors: Record<Rarity, string> = {
    common: 'text-rarity-common',
    uncommon: 'text-rarity-uncommon',
    rare: 'text-rarity-rare',
    epic: 'text-rarity-epic',
    legendary: 'text-rarity-legendary',
    mythical: 'text-rarity-mythical',
  };
  return rarityColors[rarity];
}

/**
 * Get Tailwind background color class based on rarity (for active state)
 */
function getRarityBgColor(rarity: Rarity): string {
  const rarityColors: Record<Rarity, string> = {
    common: 'bg-rarity-common/10',
    uncommon: 'bg-rarity-uncommon/10',
    rare: 'bg-rarity-rare/10',
    epic: 'bg-rarity-epic/10',
    legendary: 'bg-rarity-legendary/10',
    mythical: 'bg-rarity-mythical/10',
  };
  return rarityColors[rarity];
}

/**
 * Calculate current CPS for this rabbit based on level and ability
 */
function calculateRabbitCPS(rabbit: Rabbit): number {
  let cps = rabbit.baseCPS;

  // Apply level scaling (+10% per level)
  const levelMultiplier = 1 + (rabbit.level - 1) * 0.1;
  cps *= levelMultiplier;

  // Apply ability bonus if it affects CPS
  if (rabbit.ability && rabbit.ability.target === 'cps') {
    cps *= (1 + rabbit.ability.value / 100);
  }

  return cps;
}

/**
 * RabbitCard Component
 * Displays a single rabbit with its stats, rarity, and ability
 */
export function RabbitCard({
  rabbit,
  isOwned = true,
  isActive = false,
  onClick,
  className = '',
}: RabbitCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const borderColor = getRarityBorderColor(rabbit.rarity);
  const textColor = getRarityTextColor(rabbit.rarity);
  const bgColor = getRarityBgColor(rabbit.rarity);

  const currentCPS = calculateRabbitCPS(rabbit);

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className={`
          relative rounded-lg border-2 p-4 transition-all
          ${borderColor}
          ${isActive ? bgColor : 'bg-white'}
          ${!isOwned ? 'opacity-50 grayscale' : ''}
          ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        `}
        onClick={onClick}
      >
        {/* Active Badge */}
        {isActive && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            ACTIVE
          </div>
        )}

        {/* Rabbit Image */}
        <div className="flex justify-center mb-3">
          {isOwned ? (
            <div className="w-20 h-20 flex items-center justify-center text-6xl">
              {/* Placeholder: Use emoji until images are available */}
              🐰
            </div>
          ) : (
            <div className="w-20 h-20 flex items-center justify-center text-6xl opacity-30">
              ❓
            </div>
          )}
        </div>

        {/* Rabbit Name */}
        <h3 className={`text-lg font-bold text-center mb-1 ${textColor}`}>
          {isOwned ? rabbit.name : '???'}
        </h3>

        {/* Rarity */}
        <div className="text-center mb-2">
          <span className={`text-xs font-semibold uppercase tracking-wide ${textColor}`}>
            {rabbit.rarity}
          </span>
        </div>

        {isOwned && (
          <>
            {/* Level */}
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Level</span>
              <span className="font-semibold">{rabbit.level}</span>
            </div>

            {/* CPS Contribution */}
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">CPS</span>
              <span className="font-semibold text-carrot">
                +{formatNumber(currentCPS)}/s
              </span>
            </div>

            {/* Ability */}
            {rabbit.ability && (
              <div
                className="mt-3 p-2 bg-gray-100 rounded relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-600">
                    ⚡ {rabbit.ability.name}
                  </span>
                </div>

                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    <div className="font-semibold mb-1">{rabbit.ability.name}</div>
                    <div className="text-gray-300">{rabbit.ability.description}</div>
                    <div className="mt-1 text-purple-300">
                      {rabbit.ability.type === 'passive' && '🔄 Passive'}
                      {rabbit.ability.type === 'active' && '⚡ Active'}
                      {rabbit.ability.type === 'conditional' && '✨ Conditional'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Favorite Food (Flavor Text) */}
            <div className="mt-2 text-xs text-gray-500 text-center italic">
              Loves: {rabbit.favoriteFood}
            </div>
          </>
        )}

        {!isOwned && (
          <div className="text-center text-gray-500 text-sm italic mt-2">
            Not yet discovered
          </div>
        )}
      </div>
    </motion.div>
  );
}
