import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Crate } from '@/types/crate';
import type { Rabbit } from '@/types/rabbit';
import { formatNumber } from '@/utils';
import { playCrateOpenSound, playCrateRevealSounds, preloadCrateSounds } from '@/utils/crateSounds';

interface CrateOpeningProps {
  crate: Crate;
  rabbit: Rabbit | null;
  isDuplicate: boolean;
  xpAmount?: number;
  onComplete: () => void;
}

type AnimationStage = 'closed' | 'shaking' | 'opening' | 'revealing' | 'complete';

/**
 * CrateOpening Component
 * Animated crate opening experience with suspenseful sequence
 */
export function CrateOpening({ crate, rabbit, isDuplicate, xpAmount, onComplete }: CrateOpeningProps) {
  const [stage, setStage] = useState<AnimationStage>('closed');
  const timeoutsRef = useRef<number[]>([]);

  // Preload crate sounds on mount
  useEffect(() => {
    preloadCrateSounds();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stage === 'complete') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [stage, onComplete]);

  // Auto-start animation on mount
  useEffect(() => {
    if (!rabbit || stage !== 'closed') return;

    // Small delay before starting to ensure component is mounted
    const startTimer = window.setTimeout(() => {
      // Stage 1: Shake animation
      setStage('shaking');

      // Play crate opening sound
      playCrateOpenSound();

      // Stage 2: Opening burst after shake
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setStage('opening');
        }, 800)
      );

      // Stage 3: Reveal rabbit after burst
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setStage('revealing');

          // Play reveal sounds (rare drop + duplicate if applicable)
          playCrateRevealSounds(rabbit.rarity, isDuplicate);
        }, 1800)
      );

      // Stage 4: Complete state
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setStage('complete');
        }, 2500)
      );
    }, 100);

    return () => {
      clearTimeout(startTimer);
    };
  }, [rabbit, stage, isDuplicate]);

  // Memoize particle data to prevent visual inconsistencies on re-renders
  const burstParticles = useMemo(() =>
    Array.from({ length: 16 }).map((_, i) => ({
      angle: (i * Math.PI * 2) / 16,
      distance: 150 + Math.random() * 100,
      rotation: Math.random() * 360,
    })), []
  );

  const confettiParticles = useMemo(() =>
    Array.from({ length: 30 }).map(() => {
      const confettiColors = ['bg-red-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];
      return {
        angle: Math.random() * Math.PI * 2,
        distance: 80 + Math.random() * 150,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 720 - 360,
      };
    }), []
  );

  const sparkleParticles = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      angle: (i * Math.PI * 2) / 8,
      distance: 100,
    })), []
  );

  // Early return if no rabbit (after all hooks to avoid Rules of Hooks violation)
  if (!rabbit) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Crate opening animation"
    >
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {/* Stage 1-2: Closed/Shaking Crate */}
          {(stage === 'closed' || stage === 'shaking') && (
            <motion.div
              key="crate-closed"
              className="text-center relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: stage === 'shaking' ? [1, 1.05, 0.95, 1.05, 0.95, 1] : 1,
                rotate: stage === 'shaking' ? [0, -8, 8, -10, 10, -8, 8, 0] : 0,
                y: stage === 'shaking' ? [0, -10, 0, -15, 0, -10, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{
                scale: {
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                },
                rotate: {
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
                },
                y: {
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
                },
              }}
            >
              {/* Anticipation glow during shake */}
              {stage === 'shaking' && (
                <motion.div
                  className="absolute inset-0 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                >
                  <div className={`absolute inset-0 blur-3xl ${getRarityParticleColor(rabbit.rarity)} opacity-50`} />
                </motion.div>
              )}

              {/* Crate (animation starts automatically) */}
              <div className="text-9xl mb-6 relative">
                {crate.icon}

                {/* Crack lines appear during shake */}
                {stage === 'shaking' && (
                  <>
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center text-6xl opacity-70"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 0.7, 0.7], scale: [0.5, 1, 1] }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                    >
                      ⚡
                    </motion.div>
                  </>
                )}
              </div>

              <p className="text-white text-2xl font-bold animate-pulse">
                {stage === 'closed' ? 'Preparing...' : 'Opening...'}
              </p>
            </motion.div>
          )}

          {/* Stage 3: Opening Burst */}
          {stage === 'opening' && (
            <motion.div
              key="crate-burst"
              className="text-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Enhanced burst particles with physics */}
              <div className="relative">
                {/* Main energy burst particles */}
                {burstParticles.map((particle, i) => {
                  const isEpicPlus = ['epic', 'legendary', 'mythical'].includes(rabbit.rarity);

                  return (
                    <motion.div
                      key={`burst-${i}`}
                      className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${getRarityParticleColor(rabbit.rarity)}`}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.2, 0.8, 0],
                        x: [0, Math.cos(particle.angle) * particle.distance * 0.5, Math.cos(particle.angle) * particle.distance],
                        y: [0, Math.sin(particle.angle) * particle.distance * 0.5 - 30, Math.sin(particle.angle) * particle.distance + 50],
                        opacity: [1, 1, 0.8, 0],
                        rotate: [0, particle.rotation],
                      }}
                      transition={{
                        duration: 1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        times: [0, 0.3, 0.7, 1],
                      }}
                      style={{
                        boxShadow: isEpicPlus ? '0 0 10px currentColor' : 'none',
                      }}
                    />
                  );
                })}

                {/* Confetti for Epic+ rarities */}
                {['epic', 'legendary', 'mythical'].includes(rabbit.rarity) && (
                  <>
                    {confettiParticles.map((particle, i) => (
                      <motion.div
                        key={`confetti-${i}`}
                        className={`absolute top-1/2 left-1/2 w-2 h-3 ${particle.color}`}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1, rotate: 0 }}
                        animate={{
                          scale: [0, 1, 1, 1],
                          x: Math.cos(particle.angle) * particle.distance,
                          y: [0, Math.sin(particle.angle) * particle.distance - 50, Math.sin(particle.angle) * particle.distance + 200],
                          opacity: [1, 1, 1, 0],
                          rotate: [0, particle.rotation],
                        }}
                        transition={{
                          duration: 1.2,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Rainbow shimmer for Legendary */}
                {rabbit.rarity === 'legendary' && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 3, 4],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{ duration: 1 }}
                  >
                    <div className="w-64 h-64 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 blur-2xl" />
                  </motion.div>
                )}

                {/* Sparkle particles */}
                {sparkleParticles.map((particle, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute top-1/2 left-1/2 text-3xl"
                    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      x: Math.cos(particle.angle) * particle.distance,
                      y: Math.sin(particle.angle) * particle.distance,
                      opacity: [0, 1, 0],
                      rotate: [0, 180],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.05,
                      ease: 'easeOut',
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                {/* Central glow effect */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.5, 1], opacity: [0, 1, 0.8] }}
                  transition={{ duration: 0.8 }}
                >
                  <div className={`text-9xl ${getRarityGlowColor(rabbit.rarity)} drop-shadow-2xl`}>
                    ✨
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Stage 4-5: Revealing/Complete */}
          {(stage === 'revealing' || stage === 'complete') && (
            <motion.div
              key="rabbit-reveal"
              className="bg-white rounded-lg p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Rarity border glow */}
              <div
                className={`absolute inset-0 ${getRarityBorderGlow(
                  rabbit.rarity
                )} opacity-20 animate-pulse`}
              />

              <div className="relative z-10">
                {/* Rarity Badge */}
                <motion.div
                  className="mb-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span
                    className={`inline-block text-sm font-bold px-4 py-2 rounded-full ${getRarityColor(
                      rabbit.rarity
                    )}`}
                  >
                    {rabbit.rarity.toUpperCase()}
                  </span>
                </motion.div>

                {/* Rabbit Image */}
                <motion.div
                  className="text-8xl mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  {rabbit.image}
                </motion.div>

                {/* Rabbit Name */}
                <motion.h2
                  className="text-3xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {rabbit.name}
                </motion.h2>

                {/* Description */}
                <motion.p
                  className="text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {rabbit.description}
                </motion.p>

                {/* Stats */}
                <motion.div
                  className="bg-gray-100 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base CPS</span>
                    <span className="text-lg font-bold text-carrot">
                      +{formatNumber(rabbit.baseCPS)}/s
                    </span>
                  </div>
                </motion.div>

                {/* Duplicate/New Message */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {isDuplicate ? (
                    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 font-bold text-center">
                        ⚠️ Duplicate! +{xpAmount ? formatNumber(xpAmount) : '0'} XP
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 mb-4">
                      <p className="text-green-800 font-bold text-center">
                        ✨ Added to collection!
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Close Button */}
                {stage === 'complete' && (
                  <motion.button
                    onClick={onComplete}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Awesome!
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Get rarity color classes
 */
function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-200 text-gray-700';
    case 'uncommon':
      return 'bg-green-200 text-green-700';
    case 'rare':
      return 'bg-blue-200 text-blue-700';
    case 'epic':
      return 'bg-purple-200 text-purple-700';
    case 'legendary':
      return 'bg-yellow-200 text-yellow-700';
    case 'mythical':
      return 'bg-pink-200 text-pink-700';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}

/**
 * Get rarity glow color for burst effect
 */
function getRarityGlowColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-400';
    case 'uncommon':
      return 'text-green-400';
    case 'rare':
      return 'text-blue-400';
    case 'epic':
      return 'text-purple-400';
    case 'legendary':
      return 'text-yellow-400';
    case 'mythical':
      return 'text-pink-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Get rarity border glow classes
 */
function getRarityBorderGlow(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-400';
    case 'uncommon':
      return 'bg-green-400';
    case 'rare':
      return 'bg-blue-400';
    case 'epic':
      return 'bg-purple-400';
    case 'legendary':
      return 'bg-yellow-400';
    case 'mythical':
      return 'bg-pink-400';
    default:
      return 'bg-gray-400';
  }
}

/**
 * Get rarity particle color for burst effect
 */
function getRarityParticleColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-400';
    case 'uncommon':
      return 'bg-green-400';
    case 'rare':
      return 'bg-blue-400';
    case 'epic':
      return 'bg-purple-400';
    case 'legendary':
      return 'bg-yellow-400';
    case 'mythical':
      return 'bg-pink-400';
    default:
      return 'bg-gray-400';
  }
}
