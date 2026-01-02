import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportSave, importSave } from '@/services';
import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { useRabbitStore } from '@/stores/rabbitStore';
import { useCrateStore } from '@/stores/crateStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { usePrestigeStore } from '@/stores/prestigeStore';
import { useMilestoneStore } from '@/stores/milestoneStore';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Settings Component
 * Modal for save management (export, import, reset)
 */
export function Settings({ isOpen, onClose }: SettingsProps) {
  const [importText, setImportText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const notificationTimerRef = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * Show temporary notification
   */
  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    setNotification({ message, type });
    notificationTimerRef.current = window.setTimeout(() => {
      setNotification(null);
      notificationTimerRef.current = null;
    }, 3000);
  };

  /**
   * Export save and copy to clipboard
   */
  const handleExport = async () => {
    try {
      const saveString = exportSave();
      if (!saveString) {
        showNotification('Failed to export save', 'error');
        return;
      }

      await navigator.clipboard.writeText(saveString);
      showNotification('Save copied to clipboard!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  /**
   * Import save from text input
   */
  const handleImport = () => {
    try {
      if (!importText.trim()) {
        showNotification('Please paste a save string', 'error');
        return;
      }

      const success = importSave(importText.trim());
      if (success) {
        showNotification('Save imported successfully!', 'success');
        setImportText('');
        // Reload page to update UI with new save data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showNotification('Invalid save data', 'error');
      }
    } catch (error) {
      console.error('Import failed:', error);
      showNotification('Failed to import save', 'error');
    }
  };

  /**
   * Reset progress (clear localStorage and reset all stores)
   */
  const handleReset = () => {
    try {
      console.log('Starting reset...');

      // STEP 1: Reset all Zustand stores to their initial state IN MEMORY
      // This prevents them from auto-saving the old data back to localStorage

      // Reset game store
      const gameInitialState = (useGameStore as any).getInitialState?.() || {
        carrots: 0,
        goldenCarrots: 0,
        carrotsPerSecond: 0,
        clickPower: 1,
        lifetimeCarrots: 0,
        totalClicks: 0,
        lastSaveTime: Date.now(),
        lastPlayTime: Date.now(),
        gameSessionStartTime: Date.now(),
      };
      useGameStore.setState(gameInitialState);

      // Reset upgrade store
      useUpgradeStore.setState({
        purchasedUpgrades: new Set(),
        buildings: new Map(),
        clickMultiplier: 1,
        productionMultiplier: 1,
      });

      // Reset rabbit store
      useRabbitStore.setState({
        ownedRabbits: new Map(),
        activeTeam: [],
        maxTeamSize: 3,
        rabbitXP: 0,
      });

      // Reset crate store
      useCrateStore.setState({
        cratesSinceEpic: 0,
        cratesSinceLegendary: 0,
        cratesSinceMythical: 0,
        epicPityThreshold: 10,
        legendaryPityThreshold: 50,
        mythicalPityThreshold: 100,
        recentDrops: [],
      });

      // Reset achievement store
      useAchievementStore.setState({
        unlockedAchievements: new Set(),
        achievementProgress: new Map(),
        unlockTimestamps: new Map(),
        lastCheckTime: Date.now(),
      });

      // Reset prestige store
      usePrestigeStore.setState({
        goldenSeeds: 0,
        prestigeCount: 0,
        totalLifetimeCarrots: 0,
      });

      // Reset milestone store
      useMilestoneStore.setState({
        completedMilestones: new Set(),
        activeCelebration: null,
      });

      console.log('All stores reset in memory');

      // STEP 2: Clear localStorage
      localStorage.clear();
      sessionStorage.clear();
      console.log('localStorage cleared');

      // STEP 3: Reload page immediately
      window.location.href = window.location.origin + window.location.pathname;
    } catch (error) {
      console.error('Reset failed:', error);
      showNotification('Failed to reset progress', 'error');
    }
  };

  // Cleanup notification timer on unmount
  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const previouslyFocused = document.activeElement as HTMLElement;
      modalRef.current.focus();

      return () => previouslyFocused?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: '#FFF4E6' }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            role="dialog"
            aria-labelledby="settings-title"
            aria-modal="true"
            tabIndex={-1}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border-4 border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="settings-title" className="text-2xl font-bold text-gray-800">
                Settings
              </h2>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Notification */}
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-lg text-sm font-semibold ${
                  notification.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {notification.message}
              </motion.div>
            )}

            {/* Export Save */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Export Save</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create a backup of your progress
              </p>
              <button onClick={handleExport} className="btn-primary w-full">
                Export & Copy to Clipboard
              </button>
            </div>

            {/* Import Save */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Import Save</h3>
              <p className="text-sm text-gray-600 mb-3">
                Restore progress from a save string
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your save string here..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 font-mono text-sm resize-none"
                rows={4}
              />
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import Save
              </button>
            </div>

            {/* Reset Progress */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
              {!showResetConfirm ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Permanently delete all progress
                  </p>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    Reset Progress
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-600 mb-3 font-semibold">
                    Are you sure? This cannot be undone!
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
