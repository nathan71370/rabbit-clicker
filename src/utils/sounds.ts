/**
 * Sound Manager Utility
 * Handles audio loading, playing, and volume control for the game
 */

// Sound cache to avoid reloading audio files
const soundCache = new Map<string, HTMLAudioElement>();

// Sound throttling: track last play time for each sound path
const soundThrottleMap = new Map<string, number>();
const DEFAULT_THROTTLE_MS = 50; // Minimum time between plays of the same sound

// Global volume settings (0.0 to 1.0)
let masterVolume = 0.5;
let soundEnabled = true;

/**
 * Load a sound file and cache it
 * @param soundPath - Path to the sound file relative to public directory
 * @returns Promise that resolves to the loaded audio element
 */
export async function loadSound(soundPath: string): Promise<HTMLAudioElement> {
  // Check if sound is already cached
  if (soundCache.has(soundPath)) {
    return soundCache.get(soundPath)!;
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio(soundPath);

    audio.addEventListener('canplaythrough', () => {
      soundCache.set(soundPath, audio);
      resolve(audio);
    }, { once: true });

    audio.addEventListener('error', (e) => {
      console.error(`Failed to load sound: ${soundPath}`, e);
      reject(e);
    }, { once: true });

    // Start loading
    audio.load();
  });
}

/**
 * Play a sound effect
 * @param soundPath - Path to the sound file relative to public directory
 * @param options - Playback options
 */
export async function playSound(
  soundPath: string,
  options: {
    volume?: number;
    loop?: boolean;
    playbackRate?: number;
    throttle?: number; // Custom throttle time in ms (default: 50ms)
  } = {}
): Promise<void> {
  // Skip if sound is disabled
  if (!soundEnabled) {
    return;
  }

  // Check throttle - prevent playing the same sound too frequently
  const throttleMs = options.throttle ?? DEFAULT_THROTTLE_MS;
  const now = Date.now();
  const lastPlayTime = soundThrottleMap.get(soundPath) || 0;

  if (now - lastPlayTime < throttleMs) {
    return; // Skip this play - too soon since last play
  }

  // Update last play time
  soundThrottleMap.set(soundPath, now);

  try {
    // Load sound if not cached
    let audio = soundCache.get(soundPath);
    if (!audio) {
      audio = await loadSound(soundPath);
    }

    // Clone audio for overlapping plays
    const audioClone = audio.cloneNode(true) as HTMLAudioElement;

    // Apply options
    audioClone.volume = (options.volume ?? 1.0) * masterVolume;
    audioClone.loop = options.loop ?? false;
    audioClone.playbackRate = options.playbackRate ?? 1.0;

    // Play the sound
    const playPromise = audioClone.play();

    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Auto-play prevented or other error
        console.warn(`Sound play failed: ${soundPath}`, error);
      });
    }

    // Clean up after playing (if not looping)
    if (!audioClone.loop) {
      audioClone.addEventListener('ended', () => {
        audioClone.remove();
      }, { once: true });
    }
  } catch (error) {
    console.error(`Error playing sound: ${soundPath}`, error);
  }
}

/**
 * Set master volume for all sounds
 * @param volume - Volume level (0.0 to 1.0)
 */
export function setMasterVolume(volume: number): void {
  masterVolume = Math.max(0, Math.min(1, volume));
}

/**
 * Get current master volume
 * @returns Current volume level (0.0 to 1.0)
 */
export function getMasterVolume(): number {
  return masterVolume;
}

/**
 * Enable or disable all sounds
 * @param enabled - Whether sounds should be enabled
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

/**
 * Check if sounds are enabled
 * @returns Whether sounds are currently enabled
 */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Preload multiple sounds for instant playback
 * @param soundPaths - Array of sound file paths to preload
 */
export async function preloadSounds(soundPaths: string[]): Promise<void> {
  const loadPromises = soundPaths.map((path) => loadSound(path));
  await Promise.allSettled(loadPromises);
}

/**
 * Clear the sound cache
 */
export function clearSoundCache(): void {
  soundCache.clear();
}
