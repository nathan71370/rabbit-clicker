import { CarrotClicker } from '@/components/clicker/CarrotClicker';
import { ShopPanel } from '@/components/shop/ShopPanel';
import { ProductionDisplay } from '@/components/ui';
import { useGameLoop } from '@/hooks';

/**
 * Main App Component
 * Root component with basic layout for the clicker game MVP
 */
function App() {
  // Initialize game loop for idle production
  useGameLoop();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Game Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Rabbit Clicker
        </h1>

        {/* Production Display - Prominent CPS indicator */}
        <div className="max-w-md mx-auto mb-6">
          <ProductionDisplay />
        </div>

        {/* Game Layout - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column: Clicker */}
          <div className="card">
            <CarrotClicker />
          </div>

          {/* Right Column: Shop */}
          <div className="flex flex-col">
            <ShopPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
