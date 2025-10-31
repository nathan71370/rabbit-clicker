import { useGameStore } from '@/stores/gameStore';

/**
 * CarrotClicker Component
 * Main clicker button that increments carrot count when clicked
 */
export function CarrotClicker() {
  const { carrots, clickPower, click } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Carrot Count Display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-carrot">
          {Math.floor(carrots).toLocaleString()}
        </div>
        <div className="text-xl text-gray-600 mt-2">Carrots</div>
      </div>

      {/* Click Button */}
      <button
        onClick={click}
        className="relative group"
        aria-label="Click to earn carrots"
      >
        {/* Placeholder carrot button - will be replaced with actual image in MVP-023 */}
        <div className="w-48 h-48 bg-gradient-to-br from-carrot-light to-carrot-dark rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center">
          <span className="text-6xl">🥕</span>
        </div>
      </button>

      {/* Click Power Display */}
      <div className="text-center">
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          Per Click
        </div>
        <div className="text-2xl font-semibold text-carrot">
          +{clickPower.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
