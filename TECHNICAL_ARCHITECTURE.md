# Rabbit Clicker - Technical Architecture

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [State Management](#state-management)
4. [Save System](#save-system)
5. [Component Structure](#component-structure)
6. [Performance Considerations](#performance-considerations)
7. [Mobile & Responsive Design](#mobile--responsive-design)
8. [Build & Deployment](#build--deployment)

---

## Technology Stack

### Recommended Stack: React + TypeScript + Zustand

**Core Framework: React 18+**

Why React?
- Component-based architecture perfect for modular game UI
- Massive ecosystem of libraries and tools
- Excellent developer experience with hot reload
- Virtual DOM optimizes frequent UI updates (critical for idle games)
- Mature mobile support through React Native potential future path
- Strong TypeScript integration

Alternatives considered:
- **Vue**: Great option, but smaller ecosystem for game-specific needs
- **Vanilla JS**: Too much boilerplate for complex state management
- **Svelte**: Excellent performance, but less mature tooling and smaller community

**Language: TypeScript**

Why TypeScript?
- Type safety prevents bugs in complex game state (currencies, rabbits, saves)
- Excellent autocomplete and IDE support speeds development
- Self-documenting code through interfaces and types
- Easier refactoring as project grows
- Industry standard for serious projects

The trade-off of initial setup time pays dividends in maintainability.

**State Management: Zustand**

Why Zustand over Redux/Context/MobX?
- **vs Redux**: Far less boilerplate, simpler learning curve, sufficient for game state
- **vs Context**: Better performance for frequent updates, built-in selector optimization
- **vs MobX**: More predictable, smaller bundle size, simpler mental model

Zustand advantages for idle games:
- Minimal re-renders with selector pattern
- Easy to persist state to localStorage
- Simple async action handling for save/load
- Small bundle size (~1KB)
- Perfect for managing game state like currencies, rabbits, upgrades

**Build Tool: Vite**

Why Vite over Create React App or Webpack?
- Lightning-fast hot module replacement (HMR)
- Optimized production builds with Rollup
- Native ESM support for faster dev server
- Modern, actively maintained
- Excellent TypeScript support out of the box

**Styling: Tailwind CSS + CSS Modules**

Why this combination?
- **Tailwind**: Rapid UI development with utility classes, consistent design system
- **CSS Modules**: Scoped styles for complex animations and game-specific effects
- Works great with responsive design requirements

Alternatives:
- Styled Components: More runtime overhead
- Pure CSS: Harder to maintain consistency
- Material-UI: Too opinionated for game UI

---

### Additional Libraries

**Animation: Framer Motion**
- Declarative animations for UI elements
- Spring physics for natural feel
- Great for crate opening animations, number counters, transitions
- ~35KB gzipped - worth it for polish

**Number Formatting: Custom utility + Intl**
- Handle large numbers (millions, billions, scientific notation)
- Format with suffixes (1K, 1M, 1B, etc.)
- Localization support through Intl.NumberFormat

**Random Generation: seedrandom**
- Deterministic random for testing
- Reproducible crate openings for debugging
- Tiny library (~1KB)

**Date/Time: date-fns**
- Lightweight alternative to Moment.js
- Calculate offline time, daily resets, events
- Tree-shakeable (only import what you use)

**Testing:**
- **Vitest**: Fast, Vite-native test runner
- **React Testing Library**: Component testing
- **Playwright**: E2E testing for critical paths

---

## Architecture Overview

### High-Level Structure

```
┌─────────────────────────────────────────┐
│           User Interface Layer          │
│  (React Components, Animations, UI)     │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│         State Management Layer          │
│    (Zustand Stores, Game Logic)         │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│         Business Logic Layer            │
│  (Game Mechanics, Calculations, Rules)  │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│        Data Persistence Layer           │
│    (LocalStorage, IndexedDB, Cloud)     │
└─────────────────────────────────────────┘
```

**Key Principle**: Separation of concerns. Game logic exists independent of UI, making testing and changes easier.

---

### Project File Structure

```
/rabbit-clicker
├── /public
│   ├── /assets
│   │   ├── /images
│   │   │   ├── /rabbits          # Rabbit character art
│   │   │   ├── /icons             # UI icons, crates, etc.
│   │   │   └── /backgrounds       # Warren themes, backgrounds
│   │   ├── /sounds
│   │   │   ├── click.mp3          # Click sound effect
│   │   │   ├── purchase.mp3       # Upgrade purchase sound
│   │   │   ├── crate-open.mp3     # Crate opening sound
│   │   │   └── rare-drop.mp3      # Rare rabbit obtained
│   │   └── favicon.ico
│   └── index.html
│
├── /src
│   ├── /components                # React components
│   │   ├── /clicker
│   │   │   ├── CarrotClicker.tsx         # Main clicker button
│   │   │   ├── ClickParticles.tsx        # Click visual effects
│   │   │   └── ProductionDisplay.tsx     # CPS counter
│   │   │
│   │   ├── /rabbits
│   │   │   ├── RabbitCard.tsx            # Individual rabbit display
│   │   │   ├── RabbitTeam.tsx            # Active team display
│   │   │   ├── RabbitCollection.tsx      # Collection view
│   │   │   └── RabbitDetails.tsx         # Detail modal
│   │   │
│   │   ├── /shop
│   │   │   ├── ShopPanel.tsx             # Main shop container
│   │   │   ├── UpgradeCard.tsx           # Upgrade item card
│   │   │   ├── BuildingCard.tsx          # Building purchase card
│   │   │   └── ShopTabs.tsx              # Shop category tabs
│   │   │
│   │   ├── /crates
│   │   │   ├── CrateShop.tsx             # Crate selection screen
│   │   │   ├── CrateOpening.tsx          # Opening animation
│   │   │   ├── CrateReward.tsx           # Reward reveal
│   │   │   └── PityCounter.tsx           # Pity system display
│   │   │
│   │   ├── /ui
│   │   │   ├── Header.tsx                # Top bar (currency, settings)
│   │   │   ├── Navigation.tsx            # Mobile bottom nav
│   │   │   ├── Modal.tsx                 # Reusable modal
│   │   │   ├── Button.tsx                # Custom button component
│   │   │   ├── ProgressBar.tsx           # Progress bars
│   │   │   ├── NumberDisplay.tsx         # Animated number counter
│   │   │   └── Tooltip.tsx               # Hover tooltips
│   │   │
│   │   ├── /prestige
│   │   │   ├── PrestigePanel.tsx         # Prestige UI
│   │   │   ├── GoldenSeedCalc.tsx        # Calculator preview
│   │   │   └── PrestigeConfirm.tsx       # Confirmation dialog
│   │   │
│   │   └── /achievements
│   │       ├── AchievementList.tsx       # All achievements
│   │       ├── AchievementCard.tsx       # Single achievement
│   │       └── AchievementToast.tsx      # Unlock notification
│   │
│   ├── /stores                    # Zustand state stores
│   │   ├── gameStore.ts                  # Main game state
│   │   ├── rabbitStore.ts                # Rabbit collection
│   │   ├── upgradeStore.ts               # Upgrades & buildings
│   │   ├── crateStore.ts                 # Crate system
│   │   ├── achievementStore.ts           # Achievements
│   │   ├── prestigeStore.ts              # Prestige system
│   │   └── settingsStore.ts              # User settings
│   │
│   ├── /game                      # Game logic (framework-agnostic)
│   │   ├── /mechanics
│   │   │   ├── clicking.ts               # Click mechanics
│   │   │   ├── production.ts             # CPS calculations
│   │   │   ├── offline.ts                # Offline earnings
│   │   │   └── prestige.ts               # Prestige calculations
│   │   │
│   │   ├── /systems
│   │   │   ├── crates.ts                 # Crate opening logic
│   │   │   ├── gacha.ts                  # Rarity rolling
│   │   │   ├── upgrades.ts               # Upgrade system
│   │   │   ├── rabbits.ts                # Rabbit management
│   │   │   └── achievements.ts           # Achievement checking
│   │   │
│   │   ├── /balancing
│   │   │   ├── costs.ts                  # Cost formulas
│   │   │   ├── scaling.ts                # Exponential scaling
│   │   │   └── progression.ts            # Progression curves
│   │   │
│   │   └── /data
│   │       ├── rabbits.ts                # Rabbit definitions
│   │       ├── upgrades.ts               # Upgrade definitions
│   │       ├── buildings.ts              # Building definitions
│   │       ├── achievements.ts           # Achievement definitions
│   │       └── constants.ts              # Game constants
│   │
│   ├── /utils                     # Utility functions
│   │   ├── numbers.ts                    # Number formatting
│   │   ├── time.ts                       # Time calculations
│   │   ├── random.ts                     # RNG utilities
│   │   ├── sounds.ts                     # Sound manager
│   │   └── analytics.ts                  # Event tracking
│   │
│   ├── /hooks                     # Custom React hooks
│   │   ├── useGameLoop.ts                # Main game tick
│   │   ├── useAutoSave.ts                # Auto-save timer
│   │   ├── useOfflineTime.ts             # Offline calculation
│   │   ├── useAnimatedNumber.ts          # Number animations
│   │   └── useSound.ts                   # Sound effects
│   │
│   ├── /services                  # External services
│   │   ├── saveService.ts                # Save/load operations
│   │   ├── cloudSave.ts                  # Optional cloud saves
│   │   ├── analytics.ts                  # Analytics integration
│   │   └── monetization.ts               # Purchase handling
│   │
│   ├── /types                     # TypeScript definitions
│   │   ├── game.ts                       # Game state types
│   │   ├── rabbit.ts                     # Rabbit types
│   │   ├── upgrade.ts                    # Upgrade types
│   │   ├── achievement.ts                # Achievement types
│   │   └── index.ts                      # Exports
│   │
│   ├── /styles                    # Global styles
│   │   ├── globals.css                   # Global CSS
│   │   ├── animations.css                # Animation definitions
│   │   └── themes.css                    # Color themes
│   │
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts             # Vite types
│
├── /tests                         # Test files
│   ├── /unit
│   ├── /integration
│   └── /e2e
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## State Management

### Zustand Store Structure

**Why Multiple Stores?**
- Separation of concerns
- Better performance (components subscribe only to needed state)
- Easier testing and debugging
- Clearer organization

---

### gameStore.ts - Main Game State

```typescript
interface GameState {
  // Currencies
  carrots: number;
  goldenCarrots: number;
  lifetimeCarrots: number;

  // Production
  carrotsPerSecond: number;
  clickPower: number;

  // Stats
  totalClicks: number;
  cratesOpened: number;
  lastSaveTime: number;
  lastPlayTime: number;

  // Game status
  isPaused: boolean;
  isFirstTime: boolean;

  // Actions
  addCarrots: (amount: number) => void;
  spendCarrots: (amount: number) => boolean;
  addGoldenCarrots: (amount: number) => void;
  click: () => void;
  tick: (deltaTime: number) => void;
  calculateCPS: () => void;
}
```

**Key Patterns:**
- Immutable updates using Immer (built into Zustand)
- Computed values recalculated on state change
- Actions encapsulate business logic

---

### rabbitStore.ts - Rabbit Management

```typescript
interface RabbitState {
  // Collections
  ownedRabbits: Map<string, Rabbit>;  // rabbitId -> Rabbit
  activeTeam: string[];                // Array of rabbitIds
  maxTeamSize: number;

  // Resources
  rabbitXP: number;

  // Actions
  addRabbit: (rabbit: Rabbit) => void;
  removeRabbit: (rabbitId: string) => void;
  levelUpRabbit: (rabbitId: string) => boolean;
  setActiveTeam: (rabbitIds: string[]) => void;
  getTotalCPS: () => number;
  getActiveRabbits: () => Rabbit[];
}
```

---

### upgradeStore.ts - Upgrades & Buildings

```typescript
interface UpgradeState {
  // Purchases
  purchasedUpgrades: Set<string>;      // upgradeIds
  buildings: Map<string, number>;      // buildingId -> count

  // Multipliers (cached for performance)
  clickMultiplier: number;
  productionMultiplier: number;

  // Actions
  purchaseUpgrade: (upgradeId: string) => boolean;
  purchaseBuilding: (buildingId: string) => boolean;
  recalculateMultipliers: () => void;
  canAfford: (cost: number) => boolean;
}
```

---

### crateStore.ts - Crate System

```typescript
interface CrateState {
  // Pity system
  cratesSinceEpic: number;
  cratesSinceLegendary: number;

  // History
  recentDrops: Rabbit[];

  // Actions
  openCrate: (crateType: CrateType) => Promise<Rabbit>;
  rollRarity: (crateType: CrateType) => Rarity;
  selectRabbit: (rarity: Rarity, crateType: CrateType) => Rabbit;
  updatePity: (rarity: Rarity) => void;
}
```

---

## Save System

### Save Data Structure

The game must persist across sessions. We'll use a versioned save format.

```typescript
interface SaveData {
  version: number;  // For migration handling
  timestamp: number;

  game: {
    carrots: number;
    goldenCarrots: number;
    lifetimeCarrots: number;
    totalClicks: number;
    cratesOpened: number;
    lastPlayTime: number;
  };

  rabbits: {
    owned: SerializedRabbit[];
    activeTeamIds: string[];
    maxTeamSize: number;
    rabbitXP: number;
  };

  upgrades: {
    purchased: string[];
    buildings: Record<string, number>;
  };

  prestige: {
    goldenSeeds: number;
    prestigeCount: number;
    totalLifetimeCarrots: number;
  };

  achievements: {
    unlocked: string[];
  };

  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    reducedMotion: boolean;
  };
}
```

---

### Save/Load Implementation

**Local Storage (Primary)**

Pros:
- Simple API
- Synchronous access
- Universal browser support
- No permissions needed

Cons:
- 5-10MB limit (sufficient for this game)
- Per-origin storage
- Can be cleared by user

**Implementation Strategy:**

```typescript
// services/saveService.ts

const SAVE_KEY = 'rabbit-clicker-save';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function saveGame() {
  const saveData = generateSaveData();
  const compressed = compress(saveData);
  localStorage.setItem(SAVE_KEY, compressed);
}

export function loadGame(): SaveData | null {
  const compressed = localStorage.getItem(SAVE_KEY);
  if (!compressed) return null;

  const saveData = decompress(compressed);
  return migrateSave(saveData); // Handle version updates
}

export function exportSave(): string {
  const saveData = generateSaveData();
  return btoa(JSON.stringify(saveData)); // Base64 encoded
}

export function importSave(encodedSave: string): boolean {
  try {
    const saveData = JSON.parse(atob(encodedSave));
    applySaveData(saveData);
    return true;
  } catch {
    return false;
  }
}
```

**Compression:**
Use LZ-String library to compress save JSON before storing. Typical saves compress 60-80%.

---

### Cloud Save (Future Enhancement)

For players who want cross-device sync:
- Firebase Firestore or Supabase for backend
- Authenticated saves tied to account
- Conflict resolution (newest timestamp wins)
- Optional feature requiring opt-in

---

### Auto-Save Strategy

**When to Save:**
1. Every 30 seconds (timer-based)
2. After significant actions (prestige, crate opening)
3. Before page unload (beforeunload event)
4. After expensive purchases

**Save Validation:**
- Verify save data structure before saving
- Keep backup of previous save (rollback if corrupted)
- Log save failures to analytics

---

## Component Structure

### Component Hierarchy

```
App
├── Header
│   ├── CurrencyDisplay
│   ├── SettingsButton
│   └── AchievementButton
│
├── MainLayout (Desktop) / TabLayout (Mobile)
│   ├── Clicker Panel
│   │   ├── CarrotClicker
│   │   ├── ClickParticles
│   │   ├── ProductionDisplay
│   │   └── StatsSummary
│   │
│   ├── Shop Panel
│   │   ├── ShopTabs
│   │   ├── UpgradeList
│   │   │   └── UpgradeCard (×N)
│   │   ├── BuildingList
│   │   │   └── BuildingCard (×N)
│   │   └── CrateList
│   │       └── CrateOption (×N)
│   │
│   └── Rabbit Panel
│       ├── ActiveTeam
│       │   └── RabbitCard (×10)
│       └── Collection
│           └── RabbitCard (×120)
│
└── Modals (Portal)
    ├── CrateOpening
    ├── RabbitDetails
    ├── PrestigeConfirm
    ├── Settings
    └── Achievements
```

---

### Key Components

**CarrotClicker.tsx**

The heart of the game. Must feel responsive and satisfying.

```typescript
function CarrotClicker() {
  const click = useGameStore(state => state.click);
  const clickPower = useGameStore(state => state.clickPower);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    // Update game state
    click();

    // Visual feedback
    spawnParticles(e.clientX, e.clientY);
    playSound('click');

    // Haptic feedback (mobile)
    if (navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div className="clicker-container">
      <motion.button
        className="carrot-button"
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <img src="/assets/images/carrot.png" alt="Click the carrot!" />
      </motion.button>

      <ClickParticles particles={particles} />

      <div className="click-power">
        +{formatNumber(clickPower)} per click
      </div>
    </div>
  );
}
```

**Key Features:**
- Smooth animations with Framer Motion
- Particle system for visual flair
- No debouncing on clicks (feels laggy)
- Display current click power

---

**CrateOpening.tsx**

The most exciting moment in the game. Needs dramatic build-up.

```typescript
function CrateOpening({ crateType, onComplete }: Props) {
  const [stage, setStage] = useState<'closed' | 'opening' | 'revealing'>('closed');
  const [rabbit, setRabbit] = useState<Rabbit | null>(null);

  const openCrate = useCrateStore(state => state.openCrate);

  const handleOpen = async () => {
    setStage('opening');
    playSound('crate-open');

    // Artificial delay for suspense
    await delay(1000);

    // Roll the rabbit
    const result = await openCrate(crateType);
    setRabbit(result);

    // Reveal with rarity-specific animation
    setStage('revealing');
    playSound(getRaritySound(result.rarity));
  };

  return (
    <Modal>
      <AnimatePresence mode="wait">
        {stage === 'closed' && (
          <ClosedCrate onClick={handleOpen} crateType={crateType} />
        )}

        {stage === 'opening' && (
          <OpeningAnimation crateType={crateType} />
        )}

        {stage === 'revealing' && rabbit && (
          <RabbitReveal rabbit={rabbit} onClose={onComplete} />
        )}
      </AnimatePresence>
    </Modal>
  );
}
```

**Animation Flow:**
1. Closed crate pulses gently
2. Click triggers shake and crack animations
3. Crate explodes with particle effects
4. Rarity border glows (color depends on tier)
5. Rabbit slides in with name and stats
6. Confetti for Epic+ rabbits

---

## Performance Considerations

### Game Loop Optimization

Idle games run continuously. Poor optimization causes battery drain and lag.

**Main Game Tick:**

```typescript
// hooks/useGameLoop.ts

function useGameLoop() {
  const tick = useGameStore(state => state.tick);
  const isPaused = useGameStore(state => state.isPaused);

  useEffect(() => {
    if (isPaused) return;

    let lastTime = Date.now();
    let animationFrame: number;

    const loop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000; // Convert to seconds

      // Cap delta time to prevent spiral of death
      const cappedDelta = Math.min(deltaTime, 0.1);

      tick(cappedDelta);

      lastTime = now;
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, tick]);
}
```

**Performance Tips:**
- Use `requestAnimationFrame` for smooth updates
- Calculate CPS once per tick, not per component render
- Memoize expensive calculations
- Use Zustand selectors to prevent unnecessary re-renders

---

### Render Optimization

**Problem**: With 120 rabbits in collection, rendering all cards every frame kills performance.

**Solutions:**

1. **Virtual Scrolling**: Only render visible cards
   - Use `react-virtual` or `react-window`
   - Renders ~10-15 cards at a time instead of 120

2. **Memoization**: Prevent unnecessary re-renders
   ```typescript
   const RabbitCard = memo(({ rabbit }: Props) => {
     // Only re-renders if rabbit data changes
   });
   ```

3. **Lazy Loading**: Code-split large components
   ```typescript
   const CrateOpening = lazy(() => import('./components/crates/CrateOpening'));
   ```

4. **Debounce Animations**: Don't animate every carrot increment
   ```typescript
   const debouncedCarrots = useDebounce(carrots, 100);
   ```

---

### Bundle Size Optimization

Target: < 500KB initial bundle (gzipped)

**Strategies:**
- Tree-shaking with ES modules
- Code-splitting by route/feature
- Lazy-load non-critical components
- Optimize images (WebP format, lazy loading)
- Use production builds with minification
- Analyze bundle with `rollup-plugin-visualizer`

---

## Mobile & Responsive Design

### Responsive Breakpoints

```css
/* Tailwind config */
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape, small tablets
      'md': '768px',   // Tablets
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
    }
  }
}
```

### Layout Strategies

**Desktop (lg+):**
- Three-column layout
- All panels visible simultaneously
- Hover states and tooltips
- Keyboard shortcuts

**Tablet (md):**
- Two-column layout (Clicker + Sidebar)
- Sidebar switches between Shop/Rabbits via tabs
- Touch-optimized buttons

**Mobile (< md):**
- Single-column tabbed interface
- Bottom navigation bar
- Full-screen crate openings
- Larger tap targets (minimum 44×44px)
- Swipe gestures for navigation

---

### Touch Interactions

**Tap vs Click:**
- Use `onClick` for both (React handles touch events)
- Add visual feedback with `:active` pseudo-class
- Prevent double-tap zoom on clickable elements

**Gestures:**
- Swipe between tabs on mobile
- Pull-to-refresh for offline earnings modal
- Long-press for rabbit details

**Mobile-Specific Features:**
- Haptic feedback via Vibration API
- Install as PWA (Progressive Web App)
- Offline mode capability

---

### PWA Configuration

Make Rabbit Clicker installable on mobile home screens.

**manifest.json:**
```json
{
  "name": "Rabbit Clicker",
  "short_name": "RabbitClicker",
  "description": "A delightful idle clicker game",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff6b35",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker:**
- Cache game assets for offline play
- Background sync for cloud saves
- Push notifications for events (optional)

---

## Build & Deployment

### Development Environment

**Setup:**
```bash
npm create vite@latest rabbit-clicker -- --template react-ts
cd rabbit-clicker
npm install zustand framer-motion date-fns seedrandom
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest @testing-library/react
npx tailwindcss init -p
```

**Development Server:**
```bash
npm run dev  # Starts Vite dev server on localhost:5173
```

**Hot Reload:**
- Instant updates without page refresh
- State preserved across reloads (use Zustand persist)

---

### Production Build

**Build Command:**
```bash
npm run build  # Creates optimized production build in /dist
```

**Optimizations Applied:**
- Minification (JS, CSS, HTML)
- Tree-shaking (removes unused code)
- Code-splitting (lazy-loaded routes)
- Asset compression (gzip/brotli)
- Cache-busting hashes on filenames

**Build Output:**
```
/dist
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle (~200KB gzipped)
│   ├── vendor-[hash].js     # Dependencies (~150KB gzipped)
│   └── index-[hash].css     # Styles (~20KB gzipped)
└── images/...
```

---

### Deployment Options

**Recommended: Vercel or Netlify**

Why?
- Free tier sufficient for this project
- Automatic deployments from Git
- Global CDN for fast loading
- HTTPS by default
- Easy custom domain setup

**Vercel Deployment:**
```bash
npm install -g vercel
vercel  # Follow prompts
```

**Alternative: GitHub Pages**
- Free for public repos
- Requires `gh-pages` package
- Manual deployment process

**Alternative: Traditional Hosting**
- Upload `/dist` folder to any web server
- Nginx or Apache configuration
- Requires manual SSL setup

---

### Environment Variables

Use `.env` files for configuration:

```bash
# .env.local (not committed to Git)
VITE_API_URL=https://api.rabbitclicker.com
VITE_ANALYTICS_ID=your-analytics-id
VITE_ENABLE_CLOUD_SAVES=true
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

### Monitoring & Analytics

**Recommended: Plausible or Simple Analytics**

Why?
- Privacy-friendly (no cookies, GDPR-compliant)
- Lightweight (~1KB script)
- Simple dashboard

**What to Track:**
- Page views and session duration
- Click events (clicks per session)
- Crate openings by type
- Prestige completions
- Purchase events (monetization)
- Error events (for debugging)

**Implementation:**
```typescript
// utils/analytics.ts

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (window.plausible) {
    window.plausible(name, { props: properties });
  }
}

// Usage
trackEvent('crate_opened', { type: 'gold', rarity: 'epic' });
```

---

## Testing Strategy

### Unit Tests

Test game logic in isolation:

```typescript
// game/mechanics/production.test.ts

import { calculateCPS } from './production';

describe('Production Calculations', () => {
  test('calculates base CPS from rabbits', () => {
    const rabbits = [
      { baseCPS: 10, level: 1 },
      { baseCPS: 50, level: 2 }
    ];
    expect(calculateCPS(rabbits)).toBe(115); // 10 + (50 * 1.1)
  });

  test('applies production multipliers', () => {
    const cps = 100;
    const multipliers = [2, 1.5];
    expect(applyMultipliers(cps, multipliers)).toBe(300);
  });
});
```

**Focus Areas:**
- Currency calculations
- Upgrade cost formulas
- Gacha probability
- Save/load serialization

---

### Integration Tests

Test component interactions:

```typescript
// components/clicker/CarrotClicker.test.tsx

import { render, fireEvent } from '@testing-library/react';
import { CarrotClicker } from './CarrotClicker';

test('clicking adds carrots', () => {
  const { getByRole } = render(<CarrotClicker />);
  const button = getByRole('button');

  const initialCarrots = useGameStore.getState().carrots;
  fireEvent.click(button);

  expect(useGameStore.getState().carrots).toBeGreaterThan(initialCarrots);
});
```

---

### E2E Tests

Test critical user flows:

```typescript
// tests/e2e/first-time-flow.spec.ts

import { test, expect } from '@playwright/test';

test('new player can click and buy first upgrade', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Click the carrot 10 times
  const carrot = page.locator('.carrot-button');
  for (let i = 0; i < 10; i++) {
    await carrot.click();
  }

  // Should have 10 carrots
  await expect(page.locator('.carrot-count')).toHaveText('10');

  // Buy first upgrade (costs 100)
  // ... continue flow
});
```

---

## Security Considerations

### Client-Side Game = Cheating Possible

**Reality Check:** Any client-side game can be hacked via browser console.

**Mitigation Strategies:**

1. **Obfuscation**: Makes casual cheating harder
   - Minify production code
   - Encode save data
   - Use non-obvious variable names

2. **Validation**: Detect impossible values
   ```typescript
   function validateSave(save: SaveData): boolean {
     // Check for negative currencies
     if (save.game.carrots < 0) return false;

     // Check for impossible CPS
     const maxPossibleCPS = calculateTheoreticalMax();
     if (save.game.carrotsPerSecond > maxPossibleCPS * 2) return false;

     return true;
   }
   ```

3. **Server Verification**: For monetization features
   - Golden Carrot purchases must be verified server-side
   - Leaderboards require server validation
   - Cloud saves can detect anomalies

4. **Accept Reality**: Single-player game, cheating only hurts cheater's experience

---

## Summary

**Technology Choices Rationale:**

| Choice | Reason |
|--------|--------|
| React | Component model perfect for UI-heavy game |
| TypeScript | Type safety prevents bugs in complex state |
| Zustand | Minimal boilerplate, great performance |
| Vite | Fast dev experience, optimized builds |
| Tailwind | Rapid responsive design |
| Framer Motion | Polished animations with minimal code |

**Architecture Principles:**

1. **Separation of concerns**: UI, state, logic, data layers
2. **Performance first**: Optimize render loops and calculations
3. **Mobile-first**: Responsive from the start
4. **Persistence**: Robust save system with backups
5. **Testability**: Pure functions for game logic

**Development Workflow:**

1. Setup Vite + React + TypeScript project
2. Create Zustand stores for state management
3. Build core game loop and mechanics
4. Design component hierarchy
5. Implement responsive layouts
6. Add animations and polish
7. Test across devices
8. Deploy to Vercel/Netlify

This architecture provides a solid foundation for building Rabbit Clicker efficiently while maintaining code quality and performance.
