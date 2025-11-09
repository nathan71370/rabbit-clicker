import { useState, useEffect } from 'react';
import { CarrotClicker } from '@/components/clicker/CarrotClicker';
import { ShopPanel } from '@/components/shop/ShopPanel';
import { RabbitTeam } from '@/components/rabbits';
import { CrateShop } from '@/components/crates';
import {
  ProductionDisplay,
  SavingIndicator,
  LoadingScreen,
  Settings,
  TabNavigation,
  Header,
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

      {/* Header */}
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-20 md:pb-8">

        {/* Mobile: Tab-based Layout */}
        <div className="md:hidden">
          {activeTab === 'clicker' && (
            <div className="card">
              <CarrotClicker />
            </div>
          )}
          {activeTab === 'shop' && (
            <div className="flex flex-col max-h-[calc(100vh-13rem)] overflow-y-auto">
              <ShopPanel onPurchase={triggerSave} />
            </div>
          )}
          {activeTab === 'crates' && (
            <div className="flex flex-col max-h-[calc(100vh-13rem)] overflow-y-auto">
              <CrateShop />
            </div>
          )}
          {activeTab === 'rabbits' && (
            <div className="flex flex-col max-h-[calc(100vh-13rem)] overflow-y-auto">
              <RabbitTeam />
            </div>
          )}
          {activeTab === 'stats' && (
            <div className="card">
              <ProductionDisplay />
            </div>
          )}
        </div>

        {/* Tablet: 2-Column Layout (clicker+shop+crates | rabbits+stats) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column: Clicker, Shop, and Crates stacked */}
          <div className="flex flex-col gap-6">
            <div className="card">
              <CarrotClicker />
            </div>
            <div className="flex flex-col">
              <ShopPanel onPurchase={triggerSave} />
            </div>
            <div className="flex flex-col">
              <CrateShop />
            </div>
          </div>

          {/* Right Column: Rabbits and Stats stacked */}
          <div className="flex flex-col gap-6">
            <RabbitTeam />
            <div className="card">
              <ProductionDisplay />
            </div>
          </div>
        </div>

        {/* Desktop: 4-Column Layout (shop+crates | clicker | rabbits | stats) */}
        <div className="hidden lg:grid grid-cols-4 gap-6 max-w-[1600px] mx-auto">
          {/* Column 1: Shop and Crates */}
          <div className="flex flex-col gap-6">
            <ShopPanel onPurchase={triggerSave} />
            <CrateShop />
          </div>

          {/* Column 2: Clicker */}
          <div className="card">
            <CarrotClicker />
          </div>

          {/* Column 3: Rabbits */}
          <div className="flex flex-col">
            <RabbitTeam />
          </div>

          {/* Column 4: Stats */}
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
          { id: 'crates', label: 'Crates', icon: '🎁' },
          { id: 'rabbits', label: 'Rabbits', icon: '🐰' },
          { id: 'stats', label: 'Stats', icon: '📊' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App;
