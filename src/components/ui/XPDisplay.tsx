import { useRabbitStore } from '@/stores/rabbitStore';
import { formatNumber } from '@/utils';

/**
 * XPDisplay Component
 * Displays total Rabbit XP accumulated from duplicate rabbits
 */
export function XPDisplay() {
  const { rabbitXP } = useRabbitStore();

  return (
    <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg">
      <span className="text-2xl" title="Rabbit XP">
        ✨
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
          Rabbit XP
        </span>
        <span className="text-lg font-bold text-purple-700">
          {formatNumber(rabbitXP)}
        </span>
      </div>
    </div>
  );
}
