# Rabbit Clicker - File Structure Guide

## Table of Contents
1. [Overview](#overview)
2. [Project Root](#project-root)
3. [Source Directory Structure](#source-directory-structure)
4. [Detailed Directory Explanations](#detailed-directory-explanations)
5. [File Naming Conventions](#file-naming-conventions)
6. [Import Organization](#import-organization)
7. [Adding New Features](#adding-new-features)

---

## Overview

This document explains the recommended file structure for Rabbit Clicker. The structure is designed to:

- **Separate concerns**: UI, state, logic, and data live in distinct places
- **Scale gracefully**: Easy to find files as the project grows
- **Enable testing**: Pure functions in `/game` can be tested without React
- **Support collaboration**: Clear ownership of different systems

**Philosophy**: Feature-based organization where related files are grouped together, with shared utilities and types at the root level.

---

## Project Root

```
/rabbit-clicker
├── /public                      # Static assets served directly
├── /src                         # All source code
├── /tests                       # Test files
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── README.md                    # Project overview
├── GAME_DESIGN.md              # Game design document
├── TECHNICAL_ARCHITECTURE.md   # Architecture documentation
├── DEVELOPMENT_ROADMAP.md      # Development plan
└── FILE_STRUCTURE.md           # This file
```

---

## Source Directory Structure

```
/src
├── /components                  # React components (UI layer)
│   ├── /clicker                # Clicking-related components
│   ├── /rabbits                # Rabbit collection and team components
│   ├── /shop                   # Shop and upgrade components
│   ├── /crates                 # Crate opening system components
│   ├── /ui                     # Reusable UI components
│   ├── /prestige               # Prestige system components
│   └── /achievements           # Achievement components
│
├── /stores                      # Zustand state stores
│   ├── gameStore.ts            # Main game state (currencies, production)
│   ├── rabbitStore.ts          # Rabbit collection and team
│   ├── upgradeStore.ts         # Upgrades and buildings
│   ├── crateStore.ts           # Crate opening and gacha
│   ├── achievementStore.ts     # Achievement tracking
│   ├── prestigeStore.ts        # Prestige system
│   └── settingsStore.ts        # User settings
│
├── /game                        # Framework-agnostic game logic
│   ├── /mechanics              # Core game mechanics
│   ├── /systems                # Game systems (crates, gacha, etc.)
│   ├── /balancing              # Cost formulas and scaling
│   └── /data                   # Game content definitions
│
├── /utils                       # Utility functions
│   ├── numbers.ts              # Number formatting
│   ├── time.ts                 # Time calculations
│   ├── random.ts               # Random number generation
│   ├── sounds.ts               # Sound management
│   └── analytics.ts            # Event tracking
│
├── /hooks                       # Custom React hooks
│   ├── useGameLoop.ts          # Main game tick
│   ├── useAutoSave.ts          # Auto-save timer
│   ├── useOfflineTime.ts       # Offline earnings calculation
│   ├── useAnimatedNumber.ts    # Number animation hook
│   └── useSound.ts             # Sound effect hook
│
├── /services                    # External services and APIs
│   ├── saveService.ts          # Save/load operations
│   ├── cloudSave.ts            # Cloud save functionality
│   ├── analytics.ts            # Analytics integration
│   └── monetization.ts         # Purchase handling
│
├── /types                       # TypeScript type definitions
│   ├── game.ts                 # Game state types
│   ├── rabbit.ts               # Rabbit-related types
│   ├── upgrade.ts              # Upgrade types
│   ├── achievement.ts          # Achievement types
│   └── index.ts                # Re-exports all types
│
├── /styles                      # Global styles
│   ├── globals.css             # Global CSS and Tailwind imports
│   ├── animations.css          # Animation keyframes
│   └── themes.css              # Color themes and variables
│
├── App.tsx                      # Root React component
├── main.tsx                     # Application entry point
└── vite-env.d.ts               # Vite environment types
```

---

## Detailed Directory Explanations

### /public - Static Assets

```
/public
├── /assets
│   ├── /images
│   │   ├── /rabbits            # Individual rabbit character images
│   │   │   ├── cottontail.png
│   │   │   ├── speedy.png
│   │   │   └── cosmic-carla.png
│   │   ├── /icons              # UI icons and elements
│   │   │   ├── carrot.png
│   │   │   ├── golden-carrot.png
│   │   │   ├── crate-basic.png
│   │   │   └── crate-premium.png
│   │   └── /backgrounds        # Warren backgrounds and themes
│   │       ├── default-warren.png
│   │       └── premium-warren.png
│   ├── /sounds
│   │   ├── click.mp3           # Click sound effect
│   │   ├── purchase.mp3        # Purchase confirmation
│   │   ├── crate-open.mp3      # Crate opening sound
│   │   ├── rare-drop.mp3       # Rare rabbit obtained
│   │   ├── achievement.mp3     # Achievement unlocked
│   │   └── music-background.mp3
│   └── favicon.ico
└── index.html
```

**What Goes Here:**
- Images that don't change (rabbit art, icons)
- Audio files
- Fonts (if self-hosting)
- Favicon and PWA icons

**What Doesn't:**
- Dynamic content
- JavaScript/TypeScript files
- CSS processed by build tools

---

### /src/components - React Components

Components are organized by feature area. Each major component gets its own file.

#### /components/clicker

```
/clicker
├── CarrotClicker.tsx           # Main clickable carrot button
├── ClickParticles.tsx          # Particle effects for clicks
├── ProductionDisplay.tsx       # Shows CPS and breakdown
└── StatsSummary.tsx            # Current session stats
```

**Purpose**: Everything related to the clicking mechanic.

**Example Component Structure:**

```typescript
// CarrotClicker.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useSound } from '@/hooks/useSound';

export function CarrotClicker() {
  const click = useGameStore(state => state.click);
  const clickPower = useGameStore(state => state.clickPower);
  const playSound = useSound();

  const handleClick = () => {
    click();
    playSound('click');
  };

  return (
    <motion.button
      className="carrot-button"
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <img src="/assets/images/icons/carrot.png" alt="Click me!" />
      <span className="click-power">+{clickPower}</span>
    </motion.button>
  );
}
```

---

#### /components/rabbits

```
/rabbits
├── RabbitCard.tsx              # Single rabbit display card
├── RabbitTeam.tsx              # Active team management
├── RabbitCollection.tsx        # Full collection grid view
├── RabbitDetails.tsx           # Detailed modal for a rabbit
└── RabbitLevelUp.tsx           # Level-up interface
```

**Purpose**: All rabbit-related UI components.

---

#### /components/shop

```
/shop
├── ShopPanel.tsx               # Main shop container
├── ShopTabs.tsx                # Tab navigation (Upgrades/Buildings/Crates)
├── UpgradeCard.tsx             # Single upgrade item
├── BuildingCard.tsx            # Single building item
└── PurchaseConfirm.tsx         # Confirmation dialog for big purchases
```

**Purpose**: Shopping and purchasing interfaces.

---

#### /components/crates

```
/crates
├── CrateShop.tsx               # Crate selection screen
├── CrateOpening.tsx            # Opening animation and reveal
├── CrateReward.tsx             # Reward display after opening
└── PityCounter.tsx             # Shows pity system progress
```

**Purpose**: Crate/gacha system UI.

---

#### /components/ui

```
/ui
├── Header.tsx                  # Top bar with currencies
├── Navigation.tsx              # Mobile bottom navigation
├── Modal.tsx                   # Reusable modal component
├── Button.tsx                  # Custom button with variants
├── ProgressBar.tsx             # Progress bar component
├── NumberDisplay.tsx           # Animated number counter
├── Tooltip.tsx                 # Hover/tap tooltip
├── Card.tsx                    # Reusable card container
└── Badge.tsx                   # Badge/tag component
```

**Purpose**: Reusable UI components used throughout the app.

**Design Pattern**: These components should be:
- Generic and reusable
- Accept props for customization
- Style-agnostic (use Tailwind classes via props)
- Documented with prop types

**Example:**

```typescript
// Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  size = 'md'
}: ButtonProps) {
  const baseClasses = 'rounded-lg font-semibold transition-all';
  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

---

#### /components/prestige

```
/prestige
├── PrestigePanel.tsx           # Main prestige interface
├── GoldenSeedCalc.tsx          # Calculator showing rewards preview
└── PrestigeConfirm.tsx         # Confirmation dialog
```

---

#### /components/achievements

```
/achievements
├── AchievementList.tsx         # Grid of all achievements
├── AchievementCard.tsx         # Single achievement display
└── AchievementToast.tsx        # Popup notification on unlock
```

---

### /src/stores - Zustand State Management

Each store manages a specific domain of game state.

**File Structure:**

```typescript
// gameStore.ts - Example structure
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  // State properties
  carrots: number;
  goldenCarrots: number;
  carrotsPerSecond: number;
  clickPower: number;

  // Actions
  addCarrots: (amount: number) => void;
  spendCarrots: (amount: number) => boolean;
  click: () => void;
  tick: (deltaTime: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      carrots: 0,
      goldenCarrots: 0,
      carrotsPerSecond: 0,
      clickPower: 1,

      // Actions
      addCarrots: (amount) =>
        set((state) => ({ carrots: state.carrots + amount })),

      spendCarrots: (amount) => {
        if (get().carrots >= amount) {
          set((state) => ({ carrots: state.carrots - amount }));
          return true;
        }
        return false;
      },

      click: () => {
        const power = get().clickPower;
        get().addCarrots(power);
      },

      tick: (deltaTime) => {
        const cps = get().carrotsPerSecond;
        get().addCarrots(cps * deltaTime);
      },
    }),
    { name: 'rabbit-clicker-game' }
  )
);
```

**Store Responsibilities:**

| Store | Manages |
|-------|---------|
| `gameStore.ts` | Currencies, production, clicks, game flow |
| `rabbitStore.ts` | Owned rabbits, active team, rabbit XP |
| `upgradeStore.ts` | Purchased upgrades, buildings, multipliers |
| `crateStore.ts` | Crate opening, pity counters, drop history |
| `achievementStore.ts` | Achievement progress and unlocks |
| `prestigeStore.ts` | Golden Seeds, prestige count, lifetime stats |
| `settingsStore.ts` | User preferences (sound, graphics, etc.) |

**Design Principles:**
- Each store is independent but can access other stores
- Actions are pure functions when possible
- Complex calculations delegated to `/game` functions
- Use Zustand's `persist` middleware for saves

---

### /src/game - Game Logic

This directory contains **framework-agnostic** game logic. No React, no UI, just pure TypeScript.

**Why?**
- Easy to test (no React needed)
- Can be reused in different contexts (Node.js, React Native, etc.)
- Clear separation of concerns

#### /game/mechanics

```
/mechanics
├── clicking.ts                 # Click power calculations
├── production.ts               # CPS calculations
├── offline.ts                  # Offline earnings logic
└── prestige.ts                 # Prestige calculations
```

**Example:**

```typescript
// production.ts
import { Rabbit } from '@/types';

export function calculateTotalCPS(
  activeRabbits: Rabbit[],
  buildings: Map<string, number>,
  multipliers: number[]
): number {
  let totalCPS = 0;

  // Add rabbit CPS
  for (const rabbit of activeRabbits) {
    const rabbitCPS = rabbit.baseCPS * (1 + rabbit.level * 0.1);
    totalCPS += rabbitCPS;
  }

  // Add building CPS
  for (const [buildingId, count] of buildings) {
    const building = getBuildingById(buildingId);
    totalCPS += building.cps * count;
  }

  // Apply multipliers
  for (const multiplier of multipliers) {
    totalCPS *= multiplier;
  }

  return totalCPS;
}
```

---

#### /game/systems

```
/systems
├── crates.ts                   # Crate opening orchestration
├── gacha.ts                    # Rarity rolling and selection
├── upgrades.ts                 # Upgrade effects and application
├── rabbits.ts                  # Rabbit management utilities
└── achievements.ts             # Achievement checking
```

**Example:**

```typescript
// gacha.ts
import { Rarity, CrateType } from '@/types';
import { random } from '@/utils/random';

const CRATE_ODDS: Record<CrateType, Record<Rarity, number>> = {
  basic: { common: 0.60, uncommon: 0.30, rare: 0.10, epic: 0, legendary: 0, mythical: 0 },
  silver: { common: 0.40, uncommon: 0.35, rare: 0.20, epic: 0.05, legendary: 0, mythical: 0 },
  gold: { common: 0, uncommon: 0.45, rare: 0.35, epic: 0.18, legendary: 0.02, mythical: 0 },
  premium: { common: 0, uncommon: 0, rare: 0.50, epic: 0.35, legendary: 0.14, mythical: 0.01 },
};

export function rollRarity(crateType: CrateType, pityEpic: number, pityLegendary: number): Rarity {
  // Apply pity system
  if (pityEpic >= 50) return 'epic';
  if (pityLegendary >= 200) return 'legendary';

  const odds = CRATE_ODDS[crateType];
  const roll = random();

  let cumulative = 0;
  for (const [rarity, chance] of Object.entries(odds)) {
    cumulative += chance;
    if (roll <= cumulative) {
      return rarity as Rarity;
    }
  }

  return 'common'; // Fallback
}
```

---

#### /game/balancing

```
/balancing
├── costs.ts                    # Cost formulas for upgrades
├── scaling.ts                  # Exponential scaling utilities
└── progression.ts              # Progression curve definitions
```

**Example:**

```typescript
// costs.ts
export function calculateUpgradeCost(baseCost: number, tier: number): number {
  return Math.floor(baseCost * Math.pow(3, tier - 1));
}

export function calculateBuildingCost(baseCost: number, owned: number): number {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}
```

---

#### /game/data

```
/data
├── rabbits.ts                  # All rabbit definitions
├── upgrades.ts                 # All upgrade definitions
├── buildings.ts                # All building definitions
├── achievements.ts             # All achievement definitions
└── constants.ts                # Game constants and config
```

**Purpose**: Single source of truth for game content.

**Example:**

```typescript
// rabbits.ts
import { Rabbit } from '@/types';

export const RABBITS: Rabbit[] = [
  {
    id: 'cottontail',
    name: 'Cottontail',
    rarity: 'common',
    baseCPS: 5,
    maxLevel: 100,
    ability: {
      name: 'None',
      description: 'No special ability',
      effect: () => {},
    },
    favoriteFood: 'Carrots',
    bio: 'A simple, lovable rabbit who enjoys hopping through gardens.',
    image: '/assets/images/rabbits/cottontail.png',
  },
  {
    id: 'speedy',
    name: 'Speedy',
    rarity: 'uncommon',
    baseCPS: 50,
    maxLevel: 100,
    ability: {
      name: 'Quick Hopper',
      description: 'Increases click rate by 15%',
      effect: (state) => state.clickMultiplier *= 1.15,
    },
    favoriteFood: 'Lightning Lettuce',
    bio: 'The fastest rabbit in the warren, always in a hurry.',
    image: '/assets/images/rabbits/speedy.png',
  },
  // ... more rabbits
];
```

---

### /src/utils - Utility Functions

Helper functions used throughout the app.

```typescript
// numbers.ts - Number formatting
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num < 1_000_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  return `${(num / 1_000_000_000_000).toFixed(1)}T`;
}

// time.ts - Time calculations
export function calculateOfflineEarnings(
  lastPlayTime: number,
  currentTime: number,
  cps: number,
  efficiency: number = 0.5
): number {
  const MAX_OFFLINE_HOURS = 24;
  const millisAway = currentTime - lastPlayTime;
  const hoursAway = Math.min(millisAway / 3600000, MAX_OFFLINE_HOURS);
  return cps * hoursAway * 3600 * efficiency;
}

// random.ts - Random utilities
import seedrandom from 'seedrandom';

let rng = seedrandom();

export function random(): number {
  return rng();
}

export function setRandomSeed(seed: string) {
  rng = seedrandom(seed);
}

// sounds.ts - Sound management
const sounds: Record<string, HTMLAudioElement> = {};

export function loadSound(name: string, path: string) {
  sounds[name] = new Audio(path);
}

export function playSound(name: string, volume: number = 1.0) {
  if (sounds[name]) {
    sounds[name].volume = volume;
    sounds[name].play();
  }
}
```

---

### /src/hooks - Custom React Hooks

Reusable React hooks for common patterns.

```typescript
// useGameLoop.ts
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function useGameLoop() {
  const tick = useGameStore(state => state.tick);
  const isPaused = useGameStore(state => state.isPaused);

  useEffect(() => {
    if (isPaused) return;

    let lastTime = Date.now();
    let animationFrameId: number;

    const loop = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);

      tick(deltaTime);

      lastTime = now;
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, tick]);
}

// useAutoSave.ts
import { useEffect } from 'react';
import { saveGame } from '@/services/saveService';

export function useAutoSave(intervalMs: number = 30000) {
  useEffect(() => {
    const interval = setInterval(() => {
      saveGame();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
}
```

---

### /src/services - External Services

Integration with external APIs and services.

```typescript
// saveService.ts
import { useGameStore } from '@/stores/gameStore';
import { useRabbitStore } from '@/stores/rabbitStore';
// ... other stores

export function saveGame() {
  const saveData = {
    version: 1,
    timestamp: Date.now(),
    game: useGameStore.getState(),
    rabbits: useRabbitStore.getState(),
    // ... other state
  };

  localStorage.setItem('rabbit-clicker-save', JSON.stringify(saveData));
}

export function loadGame() {
  const savedData = localStorage.getItem('rabbit-clicker-save');
  if (!savedData) return null;

  try {
    const data = JSON.parse(savedData);
    return migrateSave(data);
  } catch (error) {
    console.error('Failed to load save:', error);
    return null;
  }
}
```

---

### /src/types - TypeScript Definitions

Centralized type definitions.

```typescript
// rabbit.ts
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical';

export interface RabbitAbility {
  name: string;
  description: string;
  effect: (state: any) => void;
}

export interface Rabbit {
  id: string;
  name: string;
  rarity: Rarity;
  baseCPS: number;
  level: number;
  maxLevel: number;
  ability: RabbitAbility;
  favoriteFood: string;
  bio: string;
  image: string;
}

// upgrade.ts
export type UpgradeType = 'click' | 'production' | 'building' | 'special';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: UpgradeType;
  cost: number;
  effect: number;
  maxPurchases?: number; // undefined = infinite (like buildings)
}

// index.ts - Re-export all types
export * from './rabbit';
export * from './upgrade';
export * from './game';
export * from './achievement';
```

---

## File Naming Conventions

### Components
- **PascalCase**: `CarrotClicker.tsx`, `RabbitCard.tsx`
- Matches component name inside file
- Use `.tsx` extension for files with JSX

### Stores
- **camelCase**: `gameStore.ts`, `rabbitStore.ts`
- Always ends with `Store.ts`

### Utilities
- **camelCase**: `numbers.ts`, `time.ts`
- Descriptive of what they contain

### Types
- **camelCase**: `rabbit.ts`, `upgrade.ts`
- Match the main type they define

### Hooks
- **camelCase**: `useGameLoop.ts`, `useSound.ts`
- Always start with `use` prefix

### Constants/Data
- **camelCase**: `rabbits.ts`, `constants.ts`
- Plural if array of items

---

## Import Organization

Use path aliases for cleaner imports.

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/stores/*": ["src/stores/*"],
      "@/game/*": ["src/game/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

**Usage:**
```typescript
// Instead of:
import { useGameStore } from '../../../stores/gameStore';
import { formatNumber } from '../../../utils/numbers';

// Use:
import { useGameStore } from '@/stores/gameStore';
import { formatNumber } from '@/utils/numbers';
```

**Import Order Convention:**

```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Stores
import { useGameStore } from '@/stores/gameStore';
import { useRabbitStore } from '@/stores/rabbitStore';

// 3. Components
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

// 4. Hooks
import { useSound } from '@/hooks/useSound';

// 5. Utils
import { formatNumber } from '@/utils/numbers';

// 6. Types
import type { Rabbit } from '@/types';

// 7. Styles
import './RabbitCard.css';
```

---

## Adding New Features

### Example: Adding a "Daily Challenge" System

**1. Define Types**

Create `/src/types/challenge.ts`:
```typescript
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  requirement: number;
  reward: {
    carrots?: number;
    goldenCarrots?: number;
    crate?: CrateType;
  };
  expiresAt: number;
}
```

**2. Create Game Logic**

Create `/src/game/systems/challenges.ts`:
```typescript
export function generateDailyChallenge(): DailyChallenge {
  // Logic to generate a challenge
}

export function checkChallengeProgress(
  challenge: DailyChallenge,
  currentProgress: number
): boolean {
  return currentProgress >= challenge.requirement;
}
```

**3. Create Store**

Create `/src/stores/challengeStore.ts`:
```typescript
import { create } from 'zustand';
import { DailyChallenge } from '@/types/challenge';

interface ChallengeState {
  currentChallenge: DailyChallenge | null;
  progress: number;

  generateChallenge: () => void;
  updateProgress: (amount: number) => void;
  claimReward: () => void;
}

export const useChallengeStore = create<ChallengeState>(/* ... */);
```

**4. Create UI Components**

Create `/src/components/challenges/`:
```
/challenges
├── ChallengePanel.tsx          # Main challenge display
├── ChallengeProgress.tsx       # Progress bar
└── ChallengeReward.tsx         # Reward claim modal
```

**5. Integrate**

- Add challenge data to save system
- Add challenge panel to main UI
- Hook up challenge completion checks

**6. Test**

Create `/tests/unit/challenges.test.ts`:
```typescript
import { generateDailyChallenge, checkChallengeProgress } from '@/game/systems/challenges';

describe('Daily Challenges', () => {
  test('generates valid challenge', () => {
    const challenge = generateDailyChallenge();
    expect(challenge).toHaveProperty('id');
    expect(challenge).toHaveProperty('requirement');
  });
});
```

---

## Summary

**Key Organizational Principles:**

1. **Separation of UI and Logic**: Components in `/components`, logic in `/game`
2. **Feature-Based Grouping**: Related files together (all rabbit stuff in one place)
3. **Clear Naming**: PascalCase for components, camelCase for everything else
4. **Path Aliases**: Use `@/` imports for clean, refactor-safe code
5. **Single Responsibility**: Each file has one clear purpose

**Benefits of This Structure:**

- Easy to find files ("Where's the crate opening logic?" → `/components/crates/CrateOpening.tsx`)
- Testable game logic (no React dependencies in `/game`)
- Scalable (adding 100 more rabbits doesn't clutter structure)
- Collaborative (clear ownership boundaries)
- Maintainable (refactoring UI doesn't touch game logic)

**When to Deviate:**

This structure is a recommendation, not a rule. Adjust if:
- Your team has different conventions
- A feature is too small to warrant a folder
- You have a better organizational idea

The goal is clarity and maintainability. If the structure serves that goal, it's doing its job.
