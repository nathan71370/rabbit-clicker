import { useState, useEffect } from 'react';
import { CarrotClicker } from '@/components/clicker/CarrotClicker';
import { ShopPanel } from '@/components/shop/ShopPanel';
import {
  ProductionDisplay,
  SavingIndicator,
  LoadingScreen,
  Settings,
  TabNavigation,
} from '@/components/ui';
import { useGameLoop, useAutoSave } from '@/hooks';
import { loadGame } from '@/services';

/**
 * Main App Component
 * Root component with basic layout for the clicker game MVP
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('clicker');

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

  // Initialize game loop for idle production (waits for loading to complete)
  useGameLoop(false, isLoading);

  // Initialize auto-save system (waits for loading to complete)
  const { isSaving, triggerSave } = useAutoSave(isLoading);

  // Show loading screen while restoring save data
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Saving Indicator */}
      <SavingIndicator isSaving={isSaving} />

      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Open settings"
        className="fixed top-4 right-4 z-30 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors font-semibold"
      >
        ⚙️ Settings
      </button>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Game Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Rabbit Clicker
        </h1>

        {/* Mobile: Tab-based Layout */}
        <div className="md:hidden">
          {activeTab === 'clicker' && (
            <div className="card">
              <CarrotClicker />
            </div>
          )}
          {activeTab === 'shop' && (
            <div className="flex flex-col">
              <ShopPanel onPurchase={triggerSave} />
            </div>
          )}
          {activeTab === 'stats' && (
            <div className="card">
              <ProductionDisplay />
            </div>
          )}
        </div>

        {/* Tablet: 2-Column Layout (clicker+shop | stats) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column: Clicker and Shop stacked */}
          <div className="flex flex-col gap-6">
            <div className="card">
              <CarrotClicker />
            </div>
            <div className="flex flex-col">
              <ShopPanel onPurchase={triggerSave} />
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="card">
            <ProductionDisplay />
          </div>
        </div>

        {/* Desktop: 3-Column Layout (shop | clicker | stats) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Column: Shop */}
          <div className="flex flex-col">
            <ShopPanel onPurchase={triggerSave} />
          </div>

          {/* Center Column: Clicker */}
          <div className="card">
            <CarrotClicker />
          </div>

          {/* Right Column: Stats */}
          <div className="card">
            <ProductionDisplay />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <TabNavigation
        tabs={[
          { id: 'clicker', label: 'Clicker', icon: '🥕' },
          { id: 'shop', label: 'Shop', icon: '🛒' },
          { id: 'stats', label: 'Stats', icon: '📊' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App;
