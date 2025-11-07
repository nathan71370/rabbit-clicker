import type { Rarity, RabbitAbility } from '@/types/rabbit';

/**
 * Base rabbit character data (static definitions)
 * This contains the starter set of collectible rabbits
 */
export interface RabbitData {
  /** Unique rabbit identifier */
  id: string;
  /** Display name */
  name: string;
  /** Rarity tier */
  rarity: Rarity;
  /** Description/bio text */
  description: string;
  /** Base carrots per second at level 1 */
  baseCPS: number;
  /** Special ability (placeholder for now) */
  ability?: RabbitAbility;
  /** Favorite food (flavor text) */
  favoriteFood: string;
  /** Image asset path or identifier */
  image: string;
}

/**
 * COMMON RABBITS (8 total)
 * Rarity: Common | CPS Range: 5-50
 * Easy to obtain, good for early game
 */
const COMMON_RABBITS: RabbitData[] = [
  {
    id: 'thumper',
    name: 'Thumper',
    rarity: 'common',
    description: 'An energetic brown rabbit with powerful hind legs. Always ready to dig for carrots!',
    baseCPS: 10,
    favoriteFood: 'Fresh Garden Carrots',
    image: '/assets/images/rabbits/thumper.png',
    ability: {
      id: 'quick_feet',
      name: 'Quick Feet',
      description: 'Slightly increases carrot gathering speed',
      type: 'passive',
      value: 5,
      target: 'cps',
    },
  },
  {
    id: 'cotton',
    name: 'Cotton',
    rarity: 'common',
    description: 'A fluffy white rabbit with the softest fur. Gentle and hardworking.',
    baseCPS: 15,
    favoriteFood: 'Organic Lettuce',
    image: '/assets/images/rabbits/cotton.png',
    ability: {
      id: 'soft_paws',
      name: 'Soft Paws',
      description: 'Gentle touch yields more carrots',
      type: 'passive',
      value: 3,
      target: 'cps',
    },
  },
  {
    id: 'clover',
    name: 'Clover',
    rarity: 'common',
    description: 'A lucky rabbit with distinctive green-tipped ears. Said to bring good fortune!',
    baseCPS: 20,
    favoriteFood: 'Four-Leaf Clover',
    image: '/assets/images/rabbits/clover.png',
    ability: {
      id: 'lucky_charm',
      name: 'Lucky Charm',
      description: 'Small chance to find extra carrots',
      type: 'conditional',
      value: 10,
      target: 'drop_rate',
    },
  },
  {
    id: 'nibbles',
    name: 'Nibbles',
    rarity: 'common',
    description: 'Always munching on something. Small but mighty when it comes to carrots.',
    baseCPS: 8,
    favoriteFood: 'Baby Carrots',
    image: '/assets/images/rabbits/nibbles.png',
    ability: {
      id: 'constant_munching',
      name: 'Constant Munching',
      description: 'Never stops gathering carrots',
      type: 'passive',
      value: 2,
      target: 'offline_earnings',
    },
  },
  {
    id: 'whiskers',
    name: 'Whiskers',
    rarity: 'common',
    description: 'Distinguished by exceptionally long whiskers. Uses them to find the best carrots.',
    baseCPS: 25,
    favoriteFood: 'Rainbow Carrots',
    image: '/assets/images/rabbits/whiskers.png',
    ability: {
      id: 'carrot_sensor',
      name: 'Carrot Sensor',
      description: 'Whiskers detect premium carrots',
      type: 'passive',
      value: 8,
      target: 'cps',
    },
  },
  {
    id: 'hoppy',
    name: 'Hoppy',
    rarity: 'common',
    description: 'An excellent jumper who can reach carrots others cannot. Full of boundless energy.',
    baseCPS: 12,
    favoriteFood: 'Crispy Celery',
    image: '/assets/images/rabbits/hoppy.png',
    ability: {
      id: 'high_jump',
      name: 'High Jump',
      description: 'Reaches hard-to-get carrots',
      type: 'passive',
      value: 4,
      target: 'cps',
    },
  },
  {
    id: 'velvet',
    name: 'Velvet',
    rarity: 'common',
    description: 'A soft gray rabbit with a calm demeanor. Methodical and efficient.',
    baseCPS: 18,
    favoriteFood: 'Kale Chips',
    image: '/assets/images/rabbits/velvet.png',
    ability: {
      id: 'smooth_operator',
      name: 'Smooth Operator',
      description: 'Works efficiently without wasting energy',
      type: 'passive',
      value: 6,
      target: 'cps',
    },
  },
  {
    id: 'patches',
    name: 'Patches',
    rarity: 'common',
    description: 'A unique rabbit with multi-colored patches. Each patch seems to have its own personality!',
    baseCPS: 22,
    favoriteFood: 'Mixed Veggie Salad',
    image: '/assets/images/rabbits/patches.png',
    ability: {
      id: 'colorful_boost',
      name: 'Colorful Boost',
      description: 'Variety brings strength',
      type: 'passive',
      value: 7,
      target: 'cps',
    },
  },
];

/**
 * UNCOMMON RABBITS (5 total)
 * Rarity: Uncommon | CPS Range: 50-200
 * Moderately rare, great for mid-game progression
 */
const UNCOMMON_RABBITS: RabbitData[] = [
  {
    id: 'snowball',
    name: 'Snowball',
    rarity: 'uncommon',
    description: 'A pure white arctic rabbit with ice-blue eyes. Thrives in cold environments and preserves carrots perfectly.',
    baseCPS: 75,
    favoriteFood: 'Frozen Carrots',
    image: '/assets/images/rabbits/snowball.png',
    ability: {
      id: 'frost_preservation',
      name: 'Frost Preservation',
      description: 'Keeps carrots fresh longer, increasing value',
      type: 'passive',
      value: 15,
      target: 'cps',
    },
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    rarity: 'uncommon',
    description: 'A spicy-tempered rabbit with cinnamon-colored fur. Quick and passionate about carrot hunting.',
    baseCPS: 100,
    favoriteFood: 'Spiced Carrot Cake',
    image: '/assets/images/rabbits/cinnamon.png',
    ability: {
      id: 'spicy_rush',
      name: 'Spicy Rush',
      description: 'Bursts of speed increase gathering rate',
      type: 'conditional',
      value: 20,
      target: 'cps',
    },
  },
  {
    id: 'pepper',
    name: 'Pepper',
    rarity: 'uncommon',
    description: 'Sleek black rabbit with boundless energy. Moves like lightning across the carrot fields.',
    baseCPS: 125,
    favoriteFood: 'Peppery Greens',
    image: '/assets/images/rabbits/pepper.png',
    ability: {
      id: 'lightning_paws',
      name: 'Lightning Paws',
      description: 'Incredible speed multiplies output',
      type: 'passive',
      value: 25,
      target: 'cps',
    },
  },
  {
    id: 'maple',
    name: 'Maple',
    rarity: 'uncommon',
    description: 'Beautiful autumn-colored rabbit with orange and brown fur. Wise beyond her years.',
    baseCPS: 150,
    favoriteFood: 'Maple Glazed Carrots',
    image: '/assets/images/rabbits/maple.png',
    ability: {
      id: 'autumn_wisdom',
      name: 'Autumn Wisdom',
      description: 'Experience brings efficiency',
      type: 'passive',
      value: 30,
      target: 'cps',
    },
  },
  {
    id: 'mocha',
    name: 'Mocha',
    rarity: 'uncommon',
    description: 'Rich coffee-brown rabbit with endless stamina. Never seems to tire, day or night.',
    baseCPS: 175,
    favoriteFood: 'Chocolate-Dipped Carrots',
    image: '/assets/images/rabbits/mocha.png',
    ability: {
      id: 'endless_energy',
      name: 'Endless Energy',
      description: 'Works efficiently around the clock',
      type: 'passive',
      value: 35,
      target: 'offline_earnings',
    },
  },
];

/**
 * RARE RABBITS (2 total)
 * Rarity: Rare | CPS Range: 200-800
 * Very rare, powerful late-game rabbits
 */
const RARE_RABBITS: RabbitData[] = [
  {
    id: 'luna',
    name: 'Luna',
    rarity: 'rare',
    description: 'Mystical silver rabbit that glows under moonlight. Said to harvest carrots from the moon itself.',
    baseCPS: 350,
    favoriteFood: 'Moonlight Carrots',
    image: '/assets/images/rabbits/luna.png',
    ability: {
      id: 'lunar_blessing',
      name: 'Lunar Blessing',
      description: 'Moonlight greatly amplifies carrot production',
      type: 'passive',
      value: 50,
      target: 'all',
    },
  },
  {
    id: 'solaris',
    name: 'Solaris',
    rarity: 'rare',
    description: 'Radiant golden rabbit blessed by the sun. Wherever it hops, carrots grow in abundance.',
    baseCPS: 500,
    favoriteFood: 'Sun-Dried Carrots',
    image: '/assets/images/rabbits/solaris.png',
    ability: {
      id: 'solar_radiance',
      name: 'Solar Radiance',
      description: 'Sunlight powers incredible growth',
      type: 'passive',
      value: 75,
      target: 'all',
    },
  },
];

/**
 * All starter rabbits combined
 * Total: 15 rabbits (8 Common, 5 Uncommon, 2 Rare)
 */
export const RABBITS: RabbitData[] = [
  ...COMMON_RABBITS,
  ...UNCOMMON_RABBITS,
  ...RARE_RABBITS,
];

/**
 * Get rabbit by ID
 * @param rabbitId - Unique rabbit identifier
 * @returns Rabbit data or undefined if not found
 */
export function getRabbitById(rabbitId: string): RabbitData | undefined {
  return RABBITS.find((rabbit) => rabbit.id === rabbitId);
}

/**
 * Get rabbits by rarity
 * @param rarity - Rarity tier to filter by
 * @returns Array of rabbits matching the rarity
 */
export function getRabbitsByRarity(rarity: Rarity): RabbitData[] {
  return RABBITS.filter((rabbit) => rabbit.rarity === rarity);
}

/**
 * Get all common rabbits
 * @returns Array of common rabbits
 */
export function getCommonRabbits(): RabbitData[] {
  return COMMON_RABBITS;
}

/**
 * Get all uncommon rabbits
 * @returns Array of uncommon rabbits
 */
export function getUncommonRabbits(): RabbitData[] {
  return UNCOMMON_RABBITS;
}

/**
 * Get all rare rabbits
 * @returns Array of rare rabbits
 */
export function getRareRabbits(): RabbitData[] {
  return RARE_RABBITS;
}
