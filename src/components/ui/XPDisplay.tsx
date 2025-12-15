import { useRabbitStore } from '@/stores/rabbitStore';
import { formatNumber } from '@/utils';

/**
 * XPDisplay Component
 * Displays total Rabbit XP accumulated from duplicate rabbits
 */
export function XPDisplay() {
  const { rabbitXP } = useRabbitStore();

  return (
    <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl">
      <span className="text-xl" title="Rabbit XP">
        ✨
      </span>
      <span className="font-bold text-gray-900 text-sm">
        {formatNumber(rabbitXP)}
      </span>
    </div>
  );
}
