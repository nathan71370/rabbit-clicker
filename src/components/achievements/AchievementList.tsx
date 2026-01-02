import { useState, useMemo } from 'react';
import { ACHIEVEMENTS } from '@/game/data/achievements';
import { useAchievementStore } from '@/stores/achievementStore';
import type { AchievementCategory } from '@/types/achievement';
import { AchievementCard } from './AchievementCard';

type SortOption = 'category' | 'completion' | 'tier';
type FilterOption = 'all' | 'completed' | 'in_progress';

interface AchievementListProps {
  onClose?: () => void;
}

/**
 * AchievementList Component
 * Displays all achievements with sorting and filtering options
 */
export function AchievementList({ onClose }: AchievementListProps) {
  const achievementStore = useAchievementStore();
  const [sortBy, setSortBy] = useState<SortOption>('category');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  // Get achievements with current progress
  const achievementsWithProgress = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => {
      return achievementStore.getAchievementWithProgress(achievement.id);
    }).filter((a) => a !== null);
  }, [achievementStore]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievementsWithProgress;

    // Filter by completion status
    if (filterBy === 'completed') {
      filtered = filtered.filter((a) => a.isUnlocked);
    } else if (filterBy === 'in_progress') {
      filtered = filtered.filter((a) => !a.isUnlocked);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    return filtered;
  }, [achievementsWithProgress, filterBy, selectedCategory]);

  // Sort achievements
  const sortedAchievements = useMemo(() => {
    const sorted = [...filteredAchievements];

    switch (sortBy) {
      case 'category':
        sorted.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          return a.sortOrder - b.sortOrder;
        });
        break;

      case 'completion':
        sorted.sort((a, b) => {
          if (a.isUnlocked !== b.isUnlocked) {
            return a.isUnlocked ? 1 : -1; // Incomplete first
          }
          return b.progress.percentage - a.progress.percentage;
        });
        break;

      case 'tier':
        {
          const tierOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3, diamond: 4 };
          sorted.sort((a, b) => {
            const tierDiff = tierOrder[b.tier] - tierOrder[a.tier]; // Highest tier first
            if (tierDiff !== 0) return tierDiff;
            return a.sortOrder - b.sortOrder;
          });
          break;
        }
    }

    return sorted;
  }, [filteredAchievements, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = achievementsWithProgress.length;
    const completed = achievementsWithProgress.filter((a) => a.isUnlocked).length;
    const totalRewards = achievementsWithProgress.reduce(
      (sum, a) => sum + (a.isUnlocked ? a.reward.goldenCarrots : 0),
      0
    );
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, totalRewards, percentage };
  }, [achievementsWithProgress]);

  // Category options
  const categories: Array<{ value: AchievementCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'collection', label: 'Collection' },
    { value: 'production', label: 'Production' },
    { value: 'clicking', label: 'Clicking' },
    { value: 'crates', label: 'Crates' },
    { value: 'special', label: 'Special' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: '#FFF4E6' }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border-4 border-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              Achievements
            </h2>
            <p className="text-yellow-100 text-sm">
              {stats.completed} / {stats.total} completed ({stats.percentage.toFixed(1)}%) •{' '}
              {stats.totalRewards} Golden Carrots earned 🥇
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              aria-label="Close achievements"
            >
              <span className="text-3xl">✕</span>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <div>
              <label className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1 block">
                Category
              </label>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-carrot text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Completion Filter */}
            <div>
              <label className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1 block">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterBy('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterBy === 'all'
                      ? 'bg-carrot text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterBy('completed')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterBy === 'completed'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilterBy('in_progress')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterBy === 'in_progress'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  In Progress
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <option value="category">Category</option>
                <option value="completion">Completion</option>
                <option value="tier">Tier</option>
              </select>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {sortedAchievements.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg font-medium">No achievements found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
