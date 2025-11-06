import * as LZString from 'lz-string';
import { useGameStore } from '@/stores/gameStore';
import { useUpgradeStore } from '@/stores/upgradeStore';

/**
 * Current save version for migration compatibility
 * Increment this when making breaking changes to save format
 */
const SAVE_VERSION = 1;

/**
 * Save data structure
 */
interface SaveData {
  version: number;
  timestamp: number;
  game: ReturnType<typeof useGameStore.getState>;
  upgrades: ReturnType<typeof useUpgradeStore.getState>;
}

/**
 * Save the current game state to localStorage
 * Uses LZ-String compression to reduce storage size
 * @returns true if save successful, false otherwise
 */
export function saveGame(): boolean {
  try {
    const gameState = useGameStore.getState();
    const upgradeState = useUpgradeStore.getState();

    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      game: gameState,
      upgrades: upgradeState,
    };

    const serialized = JSON.stringify(saveData);
    const compressed = LZString.compressToUTF16(serialized);

    localStorage.setItem('rabbit-clicker-save', compressed);
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
}

/**
 * Load game state from localStorage
 * Handles decompression and state restoration
 * @returns true if load successful, false otherwise
 */
export function loadGame(): boolean {
  try {
    const compressed = localStorage.getItem('rabbit-clicker-save');
    if (!compressed) {
      return false;
    }

    const decompressed = LZString.decompressFromUTF16(compressed);
    if (!decompressed) {
      throw new Error('Failed to decompress save data');
    }

    const saveData: SaveData = JSON.parse(decompressed);

    // Validate save version
    if (saveData.version > SAVE_VERSION) {
      throw new Error('Save file is from a newer version of the game');
    }

    // Restore game state
    useGameStore.setState(saveData.game);

    // Restore upgrade state (handle Set serialization)
    const upgradeState = {
      ...saveData.upgrades,
      purchasedUpgrades: new Set(
        Array.isArray(saveData.upgrades.purchasedUpgrades)
          ? saveData.upgrades.purchasedUpgrades
          : []
      ),
    };
    useUpgradeStore.setState(upgradeState);

    return true;
  } catch (error) {
    console.error('Failed to load game:', error);
    return false;
  }
}

/**
 * Export current game state as a base64 encoded string
 * Can be shared or backed up externally
 * @returns Compressed and encoded save string
 */
export function exportSave(): string {
  try {
    const gameState = useGameStore.getState();
    const upgradeState = useUpgradeStore.getState();

    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      game: gameState,
      upgrades: upgradeState,
    };

    const serialized = JSON.stringify(saveData);
    const compressed = LZString.compressToBase64(serialized);

    return compressed;
  } catch (error) {
    console.error('Failed to export save:', error);
    return '';
  }
}

/**
 * Import game state from a base64 encoded save string
 * Validates and restores the game state
 * @param encoded - Base64 encoded save string from exportSave()
 * @returns true if import successful, false otherwise
 */
export function importSave(encoded: string): boolean {
  try {
    if (!encoded || typeof encoded !== 'string') {
      throw new Error('Invalid save string');
    }

    const decompressed = LZString.decompressFromBase64(encoded);
    if (!decompressed) {
      throw new Error('Failed to decompress save data');
    }

    const saveData: SaveData = JSON.parse(decompressed);

    // Validate save structure
    if (!saveData.version || !saveData.game || !saveData.upgrades) {
      throw new Error('Invalid save data structure');
    }

    // Validate save version
    if (saveData.version > SAVE_VERSION) {
      throw new Error('Save file is from a newer version of the game');
    }

    // Restore game state
    useGameStore.setState(saveData.game);

    // Restore upgrade state (handle Set serialization)
    const upgradeState = {
      ...saveData.upgrades,
      purchasedUpgrades: new Set(
        Array.isArray(saveData.upgrades.purchasedUpgrades)
          ? saveData.upgrades.purchasedUpgrades
          : []
      ),
    };
    useUpgradeStore.setState(upgradeState);

    // Save to localStorage after successful import
    saveGame();

    return true;
  } catch (error) {
    console.error('Failed to import save:', error);
    return false;
  }
}
