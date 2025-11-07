import { useState, useMemo } from 'react';
import { useRabbitStore } from '@/stores/rabbitStore';
import { RABBITS } from '@/game/data/rabbits';
import { RabbitCard } from './RabbitCard';
import type { Rarity, Rabbit } from '@/types/rabbit';

type SortOption = 'rarity' | 'cps' | 'name' | 'level';

/**
 * Rarity order for sorting (least to most rare)
 */
const RARITY_ORDER: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythical: 5,
};

/**
 * RabbitCollection Component
 * Displays a filterable, sortable grid of all rabbits in the game
 */
export function RabbitCollection() {
  const { ownedRabbits, activeTeam } = useRabbitStore();
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rarity');

  // Convert all game rabbits to display format
  const allRabbits = useMemo(() => {
    return RABBITS.map((rabbitData) => {
      const ownedRabbit = ownedRabbits.get(rabbitData.id);

      if (ownedRabbit) {
        // Player owns this rabbit - return the owned instance
        return ownedRabbit;
      } else {
        // Player doesn't own this rabbit - create placeholder
        return {
          ...rabbitData,
          level: 1,
          experience: 0,
          isActive: false,
          obtainedAt: 0,
        } as Rabbit;
      }
    });
  }, [ownedRabbits]);

  // Filter by rarity
  const filteredRabbits = useMemo(() => {
    if (selectedRarity === 'all') {
      return allRabbits;
    }
    return allRabbits.filter((rabbit) => rabbit.rarity === selectedRarity);
  }, [allRabbits, selectedRarity]);

  // Sort rabbits
  const sortedRabbits = useMemo(() => {
    const sorted = [...filteredRabbits];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];

        case 'cps': {
          // Calculate CPS for comparison
          const getCPS = (rabbit: Rabbit) => {
            let cps = rabbit.baseCPS;
            cps *= 1 + (rabbit.level - 1) * 0.1;
            if (rabbit.ability && rabbit.ability.target === 'cps') {
              cps *= 1 + rabbit.ability.value / 100;
            }
            return cps;
          };
          return getCPS(b) - getCPS(a); // Descending
        }

        case 'name':
          return a.name.localeCompare(b.name);

        case 'level':
          return b.level - a.level; // Descending

        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredRabbits, sortBy]);

  // Count owned rabbits
  const ownedCount = ownedRabbits.size;
  const totalCount = RABBITS.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Count */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Rabbit Collection</h2>
            <p className="text-lg text-gray-600 mt-1">
              {ownedCount}/{totalCount} Rabbits Collected
            </p>
          </div>
          <div className="text-6xl">🐰</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-carrot to-carrot-dark h-full transition-all duration-500"
            style={{ width: `${(ownedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Rarity
            </label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value as Rarity | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrot focus:border-transparent"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
              <option value="mythical">Mythical</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrot focus:border-transparent"
            >
              <option value="rarity">Rarity</option>
              <option value="cps">CPS (Highest First)</option>
              <option value="name">Name (A-Z)</option>
              <option value="level">Level (Highest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rabbit Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedRabbits.map((rabbit) => {
          const isOwned = ownedRabbits.has(rabbit.id);
          const isActive = activeTeam.includes(rabbit.id);

          return (
            <RabbitCard
              key={rabbit.id}
              rabbit={rabbit}
              isOwned={isOwned}
              isActive={isActive}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {sortedRabbits.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-600">
            No rabbits found with these filters
          </p>
          <button
            onClick={() => {
              setSelectedRarity('all');
              setSortBy('rarity');
            }}
            className="mt-4 px-6 py-2 bg-carrot text-white rounded-lg hover:bg-carrot-dark transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
