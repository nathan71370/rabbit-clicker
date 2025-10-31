# Rabbit Clicker - Game Design Document

## Table of Contents
1. [Game Vision](#game-vision)
2. [Core Loop](#core-loop)
3. [Currency Systems](#currency-systems)
4. [Clicking & Idle Mechanics](#clicking--idle-mechanics)
5. [Rabbit Character System](#rabbit-character-system)
6. [Crate System](#crate-system)
7. [Upgrade Systems](#upgrade-systems)
8. [Progression & Prestige](#progression--prestige)
9. [Content Specifications](#content-specifications)
10. [Balance & Economy](#balance--economy)

---

## Game Vision

Rabbit Clicker creates a satisfying progression arc that starts with the simple joy of clicking and evolves into a strategic idle game about optimizing rabbit teams and automated systems. Players feel a sense of growing power as their carrot income scales from single digits to astronomical numbers, all while collecting adorable rabbit characters.

**Key Pillars:**
- **Immediate Satisfaction**: Every click feels responsive and rewarding
- **Strategic Depth**: Multiple optimization paths keep engaged players interested
- **Collector Appeal**: Cute rabbit characters with gacha mechanics drive engagement
- **Idle Accessibility**: The game respects player time; progress happens even when away

---

## Core Loop

### Early Game Loop (Minutes 0-15)
1. Player clicks carrot to earn carrots
2. Spend carrots on "Click Power" upgrades to earn more per click
3. Buy first "Auto-Clicker" upgrade for passive income
4. Unlock the Shop to see manual rabbit purchases
5. Buy first helper rabbit (Common Cottontail) for steady passive income

**Player feels**: Active engagement, clear progression, anticipation of automation

### Mid Game Loop (Minutes 15-120)
1. Save up carrots for crates to unlock better rabbits
2. Balance spending between upgrades and crates
3. Optimize rabbit team for maximum carrots-per-second (CPS)
4. Unlock warren upgrades that multiply all production
5. Check back periodically to collect offline earnings and spend resources

**Player feels**: Strategic choices matter, collection progress, excitement from crate openings

### Late Game Loop (Hours 3+)
1. Min-max rabbit synergies and team compositions
2. Push toward prestige milestones
3. Perform prestige to gain Golden Seeds for permanent bonuses
4. Progress through increasingly expensive upgrades with exponential scaling
5. Pursue achievement hunting and completing collections

**Player feels**: Mastery, long-term goals, satisfaction from optimization

---

## Currency Systems

### Primary Currency: Carrots

**Purpose**: The main resource earned through clicking and idle production. Used for everything.

**Earning Methods:**
- Manual clicking (base: 1 carrot per click)
- Idle production from rabbits (carrots per second)
- Offline earnings (calculated when returning to game)
- Achievement rewards
- Daily login bonuses

**Spending:**
- Purchasing upgrades
- Buying crates
- Unlocking warren expansions
- Manual rabbit purchases (Common tier only)

**Visual**: Bright orange carrot icon with the number displayed prominently

---

### Premium Currency: Golden Carrots

**Why Golden Carrots over Rabbit Feet?**
- More thematically consistent (still carrots, just special)
- Positive association (shiny, valuable) vs. potentially dark (feet as trophies)
- Clearer visual distinction from regular carrots
- Natural rarity progression: Carrot → Golden Carrot

**Purpose**: Optional premium currency that provides convenience, not power.

**Earning Methods (Free):**
- Achievement completion (5-50 Golden Carrots each)
- Daily login streaks (1 per day, 10 on day 7)
- Prestige milestones (25-100 per prestige threshold)
- Rare chance from opening crates (1-5, ~5% chance)
- Watching ads (optional, 3 Golden Carrots per ad)

**Spending:**
- Premium crates (better rabbit odds)
- Cosmetic warren skins
- Name changes for your warren
- Skip timers on special events
- Convert to regular carrots (1 Golden = 1000 Carrots) - inefficient but available

**Purchase Options (Real Money):**
- Small Pouch: 50 Golden Carrots - $0.99
- Medium Bag: 125 Golden Carrots - $1.99
- Large Sack: 300 Golden Carrots - $3.99
- Mega Hoard: 800 Golden Carrots - $9.99
- Monthly Pass: 30 Golden Carrots per day for 30 days - $4.99

**Design Philosophy**: Players can earn enough Golden Carrots through gameplay to access premium content slowly. Purchases provide convenience and support development, not exclusive power.

---

## Clicking & Idle Mechanics

### Manual Clicking

**Base Mechanic:**
- Click the big carrot button in the center of the screen
- Each click earns carrots based on "Click Power"
- Visual and audio feedback on every click (particle effects, sound)
- No click limit or fatigue system

**Click Power Scaling:**
- Base: 1 carrot per click
- Click Power upgrades multiply this (×2, ×5, ×10, etc.)
- Active rabbits can provide click bonuses
- Golden Carrot multiplier applies

**Anti-Spam Protection:**
- Clicks capped at 20 per second to prevent auto-clicker abuse
- Extremely fast clicking triggers a "Frenzied Clicking!" bonus (×2 for 5 seconds)

---

### Idle Production (Carrots Per Second)

**Sources of CPS:**
- Rabbit helpers (each provides specific CPS)
- Auto-clicker upgrades (simulates X clicks per second)
- Warren buildings (gardens, farms, greenhouses)
- Multiplier upgrades affecting all CPS

**Display:**
- Always visible: "Carrots per Second: X"
- Shows breakdown on hover: "Rabbits: 50 CPS, Buildings: 30 CPS, Auto-Clickers: 20 CPS"

**Offline Earnings:**
- Game calculates time away (up to 24 hours maximum)
- Applies a reduction factor: 50% efficiency for offline time
- "Welcome Back!" screen shows earnings while away
- Can watch an ad to claim 100% of offline earnings instead of 50%

**Why 50% offline?** Rewards active players while still letting idle players progress. Creates incentive to return regularly without punishing casual players.

---

## Rabbit Character System

Rabbits are the heart of the game. Each rabbit is a character with personality, stats, and bonuses.

### Rarity Tiers

**Common (Gray border) - 60% drop rate**
- Basic rabbits with simple CPS bonuses
- Examples: Cottontail, Thumper, Daisy
- Provide: 5-50 CPS depending on level
- Can be purchased directly in shop

**Uncommon (Green border) - 25% drop rate**
- Themed rabbits with modest special abilities
- Examples: Gardener Rabbit (+20% carrot garden production), Speedy Rabbit (+15% click rate)
- Provide: 50-200 CPS depending on level

**Rare (Blue border) - 10% drop rate**
- Specialized rabbits with strong synergies
- Examples: Warren Master (+30% all rabbit production), Lucky Clover (5% bonus carrots from all sources)
- Provide: 200-800 CPS depending on level

**Epic (Purple border) - 4% drop rate**
- Powerful rabbits with game-changing abilities
- Examples: Diamond Digger (1% of current carrots added as CPS), Time Hopper (offline time calculated at 75% instead of 50%)
- Provide: 800-3000 CPS depending on level

**Legendary (Gold border) - 0.9% drop rate**
- Ultra-rare rabbits with unique mechanics
- Examples: Cosmic Rabbit (multiplies all production by 5×), Carrot King (other rabbits produce +100%)
- Provide: 3000-10000 CPS depending on level

**Mythical (Rainbow border) - 0.1% drop rate**
- Extremely rare, game-defining rabbits
- Examples: Time Weaver (offline time calculated at 100% with no cap), Infinite Rabbit (production doubles every 100 rabbits owned)
- Provide: 10000+ CPS with scaling bonuses

---

### Rabbit Stats & Attributes

Each rabbit has:
- **Name**: Unique identifier with personality
- **Rarity**: Determines base power and crate odds
- **Level**: Starts at 1, max level 100
- **Base CPS**: Carrot production per second
- **Special Ability**: Unique bonus (passive)
- **Favorite Food**: Themed trait (cosmetic, used for future "feeding" feature)
- **Bio**: Short flavor text giving personality

**Leveling System:**
- Duplicate rabbits convert to "Rabbit XP"
- Spend Rabbit XP to level any owned rabbit
- Each level increases CPS by 10% and improves special ability by 1%
- Leveling costs scale exponentially

**Example Rabbit:**

```
Name: Cosmic Carla
Rarity: Legendary
Level: 1
Base CPS: 5,000
Special Ability: "Stellar Harvest" - Multiplies all carrot production by 5×
Favorite Food: Meteor Berries
Bio: "This celestial rabbit hops between dimensions, bringing cosmic abundance wherever she lands."
```

---

### Team System

**Active Team Slots:**
- Start with 3 slots
- Unlock up to 10 slots through warren upgrades
- Only active rabbits contribute their CPS and abilities
- Can swap rabbits freely with no cost

**Collection:**
- Unlimited collection storage for all rabbits obtained
- Duplicate rabbits automatically converted to Rabbit XP
- Collection shows owned vs. total (e.g., "47/120 Rabbits Collected")

**Strategy:**
- Early game: Maximize total CPS
- Mid game: Balance CPS with useful special abilities
- Late game: Complex synergies (e.g., rabbits that boost other rabbits)

---

## Crate System

Crates are the primary way to obtain rabbits beyond basic Common rabbits purchased directly.

### Crate Types

**Basic Crate** - 1,000 Carrots
- Guaranteed: 1 rabbit (Common to Rare)
- Odds: 60% Common, 30% Uncommon, 10% Rare
- Best for: Early game rabbit collection

**Silver Crate** - 5,000 Carrots
- Guaranteed: 1 rabbit (Common to Epic)
- Odds: 40% Common, 35% Uncommon, 20% Rare, 5% Epic
- Best for: Mid game progression

**Gold Crate** - 25,000 Carrots
- Guaranteed: 1 rabbit (Uncommon to Epic)
- Odds: 45% Uncommon, 35% Rare, 18% Epic, 2% Legendary
- Best for: Hunting Epic and Legendary rabbits

**Premium Crate** - 100 Golden Carrots
- Guaranteed: 1 rabbit (Rare to Legendary)
- Odds: 50% Rare, 35% Epic, 14% Legendary, 1% Mythical
- Best for: Premium currency spenders seeking top-tier rabbits

**Event Crate** - Event Currency
- Available during limited-time events
- Themed rabbits with special event bonuses
- Variable odds based on event

---

### Crate Opening Experience

1. Player selects crate type and confirms purchase
2. Animated crate appears in center screen
3. Player taps/clicks to open (satisfying animation)
4. Rarity is revealed first (border color glow effect)
5. Rabbit character artwork slides in with name
6. If duplicate: "Converted to 500 Rabbit XP!" message
7. If new: "Added to Collection!" with slot counter update

**Pity System:**
- Every 50 crates without an Epic guarantees Epic or better on next crate
- Every 200 crates without a Legendary guarantees Legendary on next crate
- Counter persists across crate types and shows progress

---

## Upgrade Systems

### Click Power Upgrades

Increase carrots earned per manual click.

**Tier Examples:**
1. Better Claws - 2× click power - 100 carrots
2. Sharp Claws - 5× click power - 500 carrots
3. Diamond Claws - 10× click power - 2,500 carrots
4. Cosmic Claws - 25× click power - 10,000 carrots
5. Godly Claws - 100× click power - 50,000 carrots

**Scaling**: Each tier multiplies the previous tier's power. Costs scale exponentially.

---

### Auto-Clicker Upgrades

Simulate automatic clicking for idle production.

**Progression:**
1. Clicker Robot - 1 auto-click per second - 500 carrots
2. Upgraded Clicker - 5 auto-clicks per second - 2,000 carrots
3. Quantum Clicker - 20 auto-clicks per second - 10,000 carrots
4. Infinite Clicker - 100 auto-clicks per second - 100,000 carrots

**Note**: These apply your current click power, so they scale with clicking upgrades.

---

### Production Multipliers

Multiply all carrot production (clicking and idle).

**Examples:**
- Carrot Fertilizer - +25% all production - 5,000 carrots
- Growth Hormone - +50% all production - 25,000 carrots
- Genetic Engineering - ×2 all production - 100,000 carrots
- Quantum Growth - ×5 all production - 1,000,000 carrots

**Stack Type**: Multiplicative (each multiplier multiplies the previous total)

---

### Warren Buildings

Permanent structures that provide ongoing CPS.

**Building Types:**
1. **Carrot Garden** - 10 CPS - 1,000 carrots
   - Each upgrade adds another garden (stackable)

2. **Rabbit Burrow** - 50 CPS - 10,000 carrots
   - Provides housing bonus: +5% rabbit CPS per burrow

3. **Carrot Farm** - 250 CPS - 100,000 carrots
   - Scales with number of rabbits: +1% CPS per rabbit owned

4. **Greenhouse** - 1,000 CPS - 1,000,000 carrots
   - Weather protection: eliminates production penalties from events

5. **Processing Plant** - 5,000 CPS - 10,000,000 carrots
   - Efficiency bonus: +10% per plant, stacks multiplicatively

6. **Genetic Lab** - 25,000 CPS - 100,000,000 carrots
   - Research bonus: each lab increases all CPS by 25%

7. **Space Station** - 100,000 CPS - 1,000,000,000 carrots
   - Cosmic power: multiplies all production by 2× per station

**Stackable**: Can purchase multiple of each building type. Costs increase by 15% per purchase.

---

### Special Upgrades

One-time unlocks that change gameplay.

**Examples:**
- **Offline Boost** - Offline earnings calculated at 75% instead of 50% - 50 Golden Carrots
- **Extra Team Slot** - Add 1 active rabbit slot - 25,000 carrots (repeatable up to 10 slots)
- **Crate Luck** - Increase all crate rarities by 10% - 100 Golden Carrots
- **Golden Touch** - 1% of carrots spent returns as CPS - 500,000 carrots
- **Prestige Enhancement** - Gain +10% Golden Seeds per prestige - 1,000,000 carrots

---

## Progression & Prestige

### Milestones

Clear goals that guide player progression.

**Early Milestones:**
- Earn 100 total carrots
- Unlock first Auto-Clicker
- Open first crate
- Collect 5 different rabbits
- Reach 10 CPS

**Mid Milestones:**
- Earn 1 million total carrots
- Collect all Common rabbits
- Reach 1,000 CPS
- Own 10 buildings
- Open 50 crates

**Late Milestones:**
- Earn 1 billion total carrots
- Collect a Legendary rabbit
- Reach 1,000,000 CPS
- Max level a rabbit to 100
- Perform first prestige

---

### Prestige System: "Golden Seeds"

**Unlock Requirement**: Earn 1 billion lifetime carrots

**What Happens:**
- All carrots, rabbits (except Legendaries and Mythicals), upgrades, and buildings are reset
- Based on lifetime carrots earned, receive "Golden Seeds"
- Golden Seeds provide permanent multipliers for the next run
- Keep: All Legendary and Mythical rabbits, Golden Carrots, achievements

**Golden Seed Formula:**
```
Golden Seeds Earned = sqrt(Lifetime Carrots / 1,000,000,000)
```

**Golden Seed Bonuses:**
- Each Golden Seed provides +10% to ALL carrot production (permanent)
- Unlocks special "Ascended" upgrades in the shop
- Required for accessing late-game content

**Example:**
- Prestige with 10 billion lifetime carrots
- Receive 3 Golden Seeds (sqrt(10))
- New run starts with +30% production multiplier
- This multiplier is permanent and stacks with all other bonuses

**Why Prestige?**
- Breaks through progression walls
- Provides long-term meta-progression
- Makes subsequent runs faster and more satisfying
- Creates replayability

---

## Content Specifications

### Launch Content (MVP)

**Rabbits**: 30 total
- 12 Common
- 10 Uncommon
- 5 Rare
- 2 Epic
- 1 Legendary

**Upgrades**: 40 total
- 8 Click Power tiers
- 6 Auto-Clicker tiers
- 10 Production Multipliers
- 7 Building types (with stacking)
- 9 Special Upgrades

**Crates**: 4 types
- Basic, Silver, Gold, Premium

**Achievements**: 30 total
- 10 Early game
- 15 Mid game
- 5 Late game

---

### Post-Launch Content (Phase 2+)

**Additional Rabbits**: Expand to 100+ total
- New rarity-specific rabbits
- Seasonal/event rabbits
- Community-designed rabbits

**New Systems:**
- **Rabbit Breeding**: Combine two rabbits to create offspring with mixed traits
- **Warren Customization**: Visual themes and decorations
- **Events**: Timed challenges with exclusive rewards
- **Leaderboards**: Compete for highest CPS, fastest prestige, etc.
- **Daily Challenges**: Special tasks for Golden Carrot rewards
- **Rabbit Expeditions**: Send rabbits on journeys to find resources

**Expanded Progression:**
- Second prestige layer: "Diamond Seeds" at 1 trillion carrots
- New building tiers
- Synergy system for rabbit team composition bonuses
- Seasonal battle pass with cosmetic rewards

---

## Balance & Economy

### Early Game Balance (0-30 minutes)

**Goal**: Hook players with clear progression and frequent rewards

**Pacing:**
- First upgrade achieved within 30 seconds
- First crate opened within 5 minutes
- First rare rabbit within 15-20 minutes
- Clear sense of growing power

**Scaling:**
- Upgrade costs increase by ~3-5× per tier
- CPS grows exponentially but feels gradual
- Always have 2-3 affordable goals visible

---

### Mid Game Balance (30 min - 3 hours)

**Goal**: Introduce strategic decisions and collection motivation

**Pacing:**
- Crate openings every 10-15 minutes
- Meaningful upgrades every 5-10 minutes
- Building purchases require planning

**Scaling:**
- Costs increase by ~10-15× per tier
- CPS becomes more important than clicking
- Offline earnings become significant

---

### Late Game Balance (3+ hours)

**Goal**: Long-term goals with prestige as ultimate aim

**Pacing:**
- Major upgrades take 30-60 minutes of idle time
- Working toward prestige threshold
- Hunting specific Legendary rabbits
- Achievement completion

**Scaling:**
- Exponential cost curves (1e6, 1e9, 1e12 notation)
- Prestige provides meaningful power boost
- Soft cap prevents infinite scaling before prestige

---

### Monetization Balance

**Free-to-Play Experience:**
- All gameplay content accessible without spending
- Golden Carrots earned at ~20-30 per day through gameplay
- No energy/stamina systems limiting play time
- Premium Crates are desirable but not necessary

**Premium Benefits:**
- Convenience and time-saving
- Cosmetic customization
- Faster access to content, not exclusive content
- Optional, never forced

**Conversion Goals:**
- 5-10% of active players make at least one purchase
- Monthly Pass is best value proposition
- Small purchases ($0.99-$3.99) are impulse-friendly

---

### Numbers Scaling Philosophy

**Notation System:**
- 1-999: Standard numbers
- 1,000-999,999: Thousands (1K-999K)
- 1,000,000-999,999,999: Millions (1M-999M)
- 1,000,000,000+: Billions, Trillions, Quadrillions, etc. (1B, 1T, 1Qa)

**Feel:**
- Numbers should feel impressive without being overwhelming
- Clear visual feedback when crossing major thresholds
- Celebration animations at milestones (1K, 1M, 1B, etc.)

---

## Achievement System

Achievements provide long-term goals and Golden Carrot rewards.

**Categories:**

**Collection Achievements:**
- "Bunny Collector" - Collect 10 different rabbits - 5 Golden Carrots
- "Rare Breeder" - Collect all Rare rabbits - 25 Golden Carrots
- "Legendary Hunter" - Collect your first Legendary - 50 Golden Carrots

**Production Achievements:**
- "Carrot Novice" - Earn 1,000 total carrots - 5 Golden Carrots
- "Carrot Magnate" - Reach 100,000 CPS - 25 Golden Carrots
- "Carrot God" - Earn 1 trillion total carrots - 100 Golden Carrots

**Clicking Achievements:**
- "Click Beginner" - Perform 100 clicks - 5 Golden Carrots
- "Click Veteran" - Perform 10,000 clicks - 25 Golden Carrots
- "Click Master" - Perform 100,000 clicks - 50 Golden Carrots

**Crate Achievements:**
- "Lucky Rabbit" - Open 10 crates - 10 Golden Carrots
- "Crate Addict" - Open 100 crates - 25 Golden Carrots
- "Gacha King" - Open 1,000 crates - 100 Golden Carrots

**Special Achievements:**
- "First Prestige" - Perform your first prestige - 50 Golden Carrots
- "Speed Runner" - Reach 1M carrots within 1 hour - 75 Golden Carrots
- "Idle Master" - Earn 1M carrots while offline - 50 Golden Carrots

---

## UI/UX Design Principles

### Core Screen Layout

**Desktop:**
- Left sidebar: Shop/Upgrades
- Center: Big carrot clicker + current stats
- Right sidebar: Active rabbit team + collection
- Top bar: Currency, settings, achievements

**Mobile:**
- Tabbed interface: Clicker | Shop | Rabbits | Settings
- Collapsible sections for info
- Large tap targets for clicking
- Swipe gestures for navigation

---

### Visual Feedback

**Every Action Should Feel Good:**
- Clicks produce particle effects (carrot bits, sparkles)
- Purchasing upgrades plays satisfying sound + animation
- Crate openings are animated events with anticipation
- Rabbits have idle animations when active
- Milestone crossings trigger celebrations

**Information Density:**
- Hide complex info behind tooltips/hover states
- Always show: current carrots, CPS, active team
- Optional: detailed stat breakdowns, graphs, history

---

### Accessibility

- Color-blind friendly palette
- Keyboard navigation support
- Screen reader compatible text
- Reduced motion option for animations
- Adjustable text size
- High contrast mode

---

## Future Expansion Ideas

**Potential Systems:**
1. **Rabbit Personalities**: Each rabbit has moods affecting performance
2. **Warren Defense**: Tower defense mini-game against carrot thieves
3. **Trading System**: Exchange rabbits with other players
4. **Guilds/Clans**: Cooperative group goals
5. **PvP Competitions**: Timed events to earn most carrots
6. **Story Mode**: Narrative campaign with boss battles
7. **Mini-Games**: Break from idle gameplay with skill challenges
8. **Seasonal Events**: Holiday-themed content and limited rabbits

**These are aspirational** - focus on core loop first, expand based on player feedback and engagement data.

---

## Summary

Rabbit Clicker combines the addictive simplicity of incremental games with the collection appeal of gacha systems, all wrapped in an adorable rabbit theme. The game respects player time through idle mechanics while providing depth for engaged players through team optimization and prestige systems.

**Key Differentiators:**
- Strong theme with personality
- Balanced free-to-play experience
- Strategic depth in team composition
- Satisfying progression curve
- Respectful monetization

This design creates a game players will enjoy for hours, return to daily, and potentially support through optional purchases.
