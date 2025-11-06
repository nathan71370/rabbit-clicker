import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportSave, importSave } from '@/services';

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

  /**
   * Show temporary notification
   */
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
   * Reset progress (clear localStorage)
   */
  const handleReset = () => {
    try {
      localStorage.removeItem('rabbit-clicker-save');
      showNotification('Progress reset successfully!', 'success');
      setShowResetConfirm(false);
      // Reload page to start fresh
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Reset failed:', error);
      showNotification('Failed to reset progress', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-md p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={onClose}
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
        </>
      )}
    </AnimatePresence>
  );
}
