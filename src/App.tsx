import { useState, useEffect } from 'react';
import { CarrotClicker } from '@/components/clicker/CarrotClicker';
import { ShopPanel } from '@/components/shop/ShopPanel';
import {
  ProductionDisplay,
  SavingIndicator,
  LoadingScreen,
} from '@/components/ui';
import { useGameLoop, useAutoSave } from '@/hooks';
import { loadGame } from '@/services';

/**
 * Main App Component
 * Root component with basic layout for the clicker game MVP
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Load saved game on initialization
  useEffect(() => {
    try {
      // Attempt to load saved game
      const loaded = loadGame();

      if (loaded) {
        // Successfully loaded existing save
      } else {
        // First-time player - no save exists, start fresh
      }
    } catch (error) {
      // Handle corrupted save gracefully
      console.error('Failed to load save, starting fresh:', error);
    } finally {
      // Always finish loading, even if errors occurred
      setIsLoading(false);
    }
  }, []);

  // Initialize game loop for idle production
  useGameLoop();

  // Initialize auto-save system
  const { isSaving, triggerSave } = useAutoSave();

  // Show loading screen while restoring save data
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Saving Indicator */}
      <SavingIndicator isSaving={isSaving} />

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
            <ShopPanel onPurchase={triggerSave} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
