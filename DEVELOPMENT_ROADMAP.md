# Rabbit Clicker - Development Roadmap

## Table of Contents
1. [Overview](#overview)
2. [Phase 1: MVP (Minimum Viable Product)](#phase-1-mvp-minimum-viable-product)
3. [Phase 2: Core Features](#phase-2-core-features)
4. [Phase 3: Polish & Content](#phase-3-polish--content)
5. [Phase 4: Advanced Features](#phase-4-advanced-features)
6. [Phase 5: Live Operations](#phase-5-live-operations)
7. [Timeline Estimates](#timeline-estimates)
8. [Testing Milestones](#testing-milestones)

---

## Overview

This roadmap breaks Rabbit Clicker development into five logical phases, each building on the previous. The goal is to get a playable prototype quickly, then iteratively add features based on testing and feedback.

**Development Philosophy:**
- **Playable early**: MVP should be fun enough to test with real users
- **Iterative**: Each phase adds value and can be released
- **Data-driven**: Use analytics to guide feature priority
- **Scope control**: Cut features if timeline slips, don't rush quality

**Success Metrics:**
- Phase 1: Playable for 15+ minutes
- Phase 2: Playable for 2+ hours
- Phase 3: Playable for 10+ hours
- Phase 4: Playable for 50+ hours
- Phase 5: Daily engagement for months

---

## Phase 1: MVP (Minimum Viable Product)

**Goal**: Prove the core loop is fun. Get something playable in 2-3 weeks.

**Scope**: Clicking mechanics, basic upgrades, simple save system.

### 1.1 Project Setup (Days 1-2)

**Tasks:**
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install core dependencies (Zustand, Tailwind, Framer Motion)
- [ ] Configure TypeScript and ESLint
- [ ] Set up folder structure per architecture doc
- [ ] Create basic UI layout (single column for now)
- [ ] Set up Git repository and initial commit

**Deliverable**: Empty project with proper tooling and structure.

---

### 1.2 Core Clicking Mechanic (Days 3-4)

**Tasks:**
- [ ] Create `gameStore.ts` with basic state (carrots, clickPower)
- [ ] Implement click handler that increments carrots
- [ ] Build `CarrotClicker.tsx` component with clickable button
- [ ] Add simple click animation (scale on tap)
- [ ] Display current carrot count prominently
- [ ] Add basic click sound effect
- [ ] Show click power value ("+X per click")

**Deliverable**: Clickable carrot that adds to counter with feedback.

**Test**: Click 100 times. Does it feel satisfying? Is feedback immediate?

---

### 1.3 Basic Upgrade System (Days 5-7)

**Tasks:**
- [ ] Create `upgradeStore.ts` for tracking purchases
- [ ] Define first 5 click power upgrades in `/game/data/upgrades.ts`
- [ ] Build `ShopPanel.tsx` and `UpgradeCard.tsx` components
- [ ] Implement purchase logic (spend carrots, apply upgrade)
- [ ] Show upgrade costs and benefits clearly
- [ ] Disable/grey out unaffordable upgrades
- [ ] Add purchase sound effect
- [ ] Calculate and display next upgrade cost

**Upgrade Data:**
```typescript
const CLICK_UPGRADES = [
  { id: 'click1', name: 'Better Claws', cost: 100, multiplier: 2 },
  { id: 'click2', name: 'Sharp Claws', cost: 500, multiplier: 5 },
  { id: 'click3', name: 'Diamond Claws', cost: 2500, multiplier: 10 },
  { id: 'click4', name: 'Cosmic Claws', cost: 10000, multiplier: 25 },
  { id: 'click5', name: 'Godly Claws', cost: 50000, multiplier: 100 },
];
```

**Deliverable**: Working shop with purchasable upgrades that increase click power.

**Test**: Can you afford first upgrade within 2 minutes? Does power increase feel noticeable?

---

### 1.4 Auto-Clicker & Idle Production (Days 8-10)

**Tasks:**
- [ ] Add `carrotsPerSecond` to game state
- [ ] Implement game loop using `useGameLoop` hook
- [ ] Create auto-clicker upgrades (1 CPS, 5 CPS, 10 CPS)
- [ ] Display "Carrots per Second: X" prominently
- [ ] Add auto-clicker purchases to shop
- [ ] Implement idle production calculation on each tick
- [ ] Show animated number counter for carrots

**Deliverable**: Game generates carrots passively after buying auto-clickers.

**Test**: Buy auto-clicker, wait 1 minute. Are carrots accumulating? Is CPS visible?

---

### 1.5 Save/Load System (Days 11-12)

**Tasks:**
- [ ] Create `saveService.ts` with save/load functions
- [ ] Implement save data serialization
- [ ] Save to localStorage every 30 seconds
- [ ] Save on page unload (beforeunload event)
- [ ] Load save data on game initialization
- [ ] Add "Export Save" and "Import Save" buttons
- [ ] Test save corruption handling

**Deliverable**: Progress persists across sessions.

**Test**: Play for 5 minutes, close tab, reopen. Does progress restore correctly?

---

### 1.6 Basic UI Polish (Days 13-14)

**Tasks:**
- [ ] Design carrot icon/image (or use placeholder)
- [ ] Style shop panel with Tailwind
- [ ] Add particle effects to clicks (simple version)
- [ ] Implement number formatting utility (1K, 1M notation)
- [ ] Create responsive layout (mobile + desktop)
- [ ] Add header with carrot count and CPS
- [ ] Basic settings panel (sound toggle)

**Deliverable**: Visually cohesive MVP that works on mobile and desktop.

**Test**: Show to 5 people. Do they understand what to do? Do they play for 10+ minutes?

---

### Phase 1 Success Criteria

- [x] Can click to earn carrots
- [x] Can purchase upgrades that increase click power
- [x] Can purchase auto-clickers for idle production
- [x] Progress saves and loads correctly
- [x] Works on mobile and desktop
- [x] Playable for 15+ minutes without running out of goals

**Estimated Duration**: 2-3 weeks (solo developer)

**Next Step**: User testing with friends/family. Gather feedback on core loop before continuing.

---

## Phase 2: Core Features

**Goal**: Add the systems that make Rabbit Clicker unique - rabbits, crates, and collection.

**Scope**: Rabbit character system, crate opening, basic collection.

### 2.1 Rabbit Data & Systems (Week 3, Days 1-3)

**Tasks:**
- [ ] Create `Rabbit` type definition
- [ ] Define 15 starter rabbits in `/game/data/rabbits.ts`
  - 8 Common
  - 5 Uncommon
  - 2 Rare
- [ ] Create `rabbitStore.ts` for rabbit management
- [ ] Implement rabbit CPS calculation
- [ ] Build rabbit data with names, rarities, CPS values, abilities

**Example Rabbit:**
```typescript
{
  id: 'cottontail',
  name: 'Cottontail',
  rarity: 'common',
  baseCPS: 5,
  ability: 'None',
  bio: 'A simple rabbit who loves carrots.',
  image: 'cottontail.png'
}
```

**Deliverable**: Rabbit data structure and store ready to use.

---

### 2.2 Rabbit Collection UI (Week 3, Days 4-5)

**Tasks:**
- [ ] Create `RabbitCard.tsx` component
- [ ] Build `RabbitCollection.tsx` grid view
- [ ] Show owned vs unowned rabbits (silhouette for unowned)
- [ ] Display rabbit stats on hover/tap
- [ ] Add rarity-based border colors
- [ ] Implement collection counter (e.g., "8/15 Rabbits")

**Deliverable**: Collection screen showing rabbit cards.

---

### 2.3 Crate System - Logic (Week 4, Days 1-3)

**Tasks:**
- [ ] Create `crateStore.ts`
- [ ] Implement gacha rolling logic in `/game/systems/gacha.ts`
- [ ] Define crate types (Basic, Silver, Gold)
- [ ] Implement rarity probability tables
- [ ] Create `openCrate()` function that returns random rabbit
- [ ] Handle duplicate rabbits (convert to Rabbit XP)
- [ ] Implement basic pity system counters

**Rarity Tables:**
```typescript
const BASIC_CRATE_ODDS = {
  common: 0.60,
  uncommon: 0.30,
  rare: 0.10,
};
```

**Deliverable**: Backend logic for opening crates and rolling rarities.

**Test**: Open 1000 crates in console, verify rarity distribution matches expectations.

---

### 2.4 Crate System - UI (Week 4, Days 4-5)

**Tasks:**
- [ ] Create `CrateShop.tsx` showing available crate types
- [ ] Build `CrateOpening.tsx` modal with animation
- [ ] Implement crate purchase flow
- [ ] Add opening animation (simple version)
- [ ] Show rabbit reveal with rarity border
- [ ] Display "New!" for first-time rabbits
- [ ] Show "Duplicate +500 XP" for repeats
- [ ] Add crate opening sound effects

**Deliverable**: Fully functional crate opening with visual feedback.

**Test**: Buy and open 5 crates. Is it exciting? Is rarity clear?

---

### 2.5 Active Rabbit Team (Week 5, Days 1-2)

**Tasks:**
- [ ] Add team system to rabbit store
- [ ] Implement 3 active team slots (starting size)
- [ ] Create `RabbitTeam.tsx` component showing active rabbits
- [ ] Allow drag-and-drop or click to assign rabbits to team
- [ ] Calculate total CPS from active team only
- [ ] Show team CPS contribution in production display
- [ ] Disable inactive rabbits' CPS contributions

**Deliverable**: Team management system that affects production.

**Test**: Equip different rabbits. Does CPS change? Is team UI clear?

---

### 2.6 Manual Rabbit Purchase (Week 5, Day 3)

**Tasks:**
- [ ] Add Common rabbits to shop for direct purchase
- [ ] Display cost (e.g., 1000 carrots for Cottontail)
- [ ] Implement direct purchase (bypass crate system)
- [ ] Only allow buying each Common rabbit once
- [ ] Show "Owned" status on purchased rabbits

**Deliverable**: Alternative way to get starter rabbits without gacha.

**Test**: Are Common rabbits affordable for new players? Does it reduce early frustration?

---

### 2.7 Buildings System (Week 5, Days 4-5)

**Tasks:**
- [ ] Define 4 building types in `/game/data/buildings.ts`
  - Carrot Garden (10 CPS, 1000 cost)
  - Rabbit Burrow (50 CPS, 10000 cost)
  - Carrot Farm (250 CPS, 100000 cost)
  - Greenhouse (1000 CPS, 1000000 cost)
- [ ] Add buildings to upgrade store
- [ ] Implement stackable building purchases
- [ ] Add 15% cost increase per additional building
- [ ] Create `BuildingCard.tsx` component
- [ ] Add buildings tab to shop
- [ ] Calculate building CPS contribution

**Deliverable**: Building system with stackable purchases.

**Test**: Buy multiple buildings. Does cost increase? Does CPS grow appropriately?

---

### Phase 2 Success Criteria

- [x] 15 collectible rabbits with rarities
- [x] Crate opening system with three crate types
- [x] Active team system affecting production
- [x] Manual purchase for Common rabbits
- [x] Buildings providing additional CPS
- [x] Collection tracking progress
- [x] Playable for 2-3 hours with clear goals

**Estimated Duration**: 3 weeks

**Next Step**: Soft launch to small group for feedback on progression pacing and balance.

---

## Phase 3: Polish & Content

**Goal**: Add depth, balance the economy, and polish the experience.

**Scope**: More content, achievement system, prestige, Golden Carrots.

### 3.1 Expand Content (Week 6-7)

**Tasks:**
- [ ] Add 15 more rabbits (30 total)
  - 4 additional Common
  - 5 additional Uncommon
  - 5 additional Rare
  - 1 Epic
  - 1 Legendary
- [ ] Create Premium Crate type (Golden Carrot cost)
- [ ] Add 3 more building types
- [ ] Design 10 production multiplier upgrades
- [ ] Add special upgrades (Extra Team Slot, etc.)
- [ ] Balance costs and progression curve

**Deliverable**: Doubled content extending playtime significantly.

---

### 3.2 Golden Carrots System (Week 7, Days 1-2)

**Tasks:**
- [ ] Add `goldenCarrots` to game state
- [ ] Display Golden Carrots in header
- [ ] Implement Premium Crate (100 Golden Carrots)
- [ ] Create Golden Carrot purchase UI (monetization)
- [ ] Set up payment processing (Stripe or similar)
- [ ] Add conversion option (1 Golden = 1000 Carrots)

**Deliverable**: Premium currency with purchase flow.

**Note**: Test thoroughly in sandbox mode before real payments.

---

### 3.3 Achievement System (Week 7, Days 3-5)

**Tasks:**
- [ ] Define 30 achievements in `/game/data/achievements.ts`
- [ ] Create `achievementStore.ts`
- [ ] Implement achievement checking on game tick
- [ ] Build `AchievementList.tsx` component
- [ ] Create achievement unlock toast notification
- [ ] Award Golden Carrots for achievement completion
- [ ] Show achievement progress bars
- [ ] Add achievement sound effect

**Achievement Categories:**
- Collection (collect X rabbits)
- Production (reach X CPS)
- Clicking (perform X clicks)
- Spending (spend X carrots)
- Crates (open X crates)

**Deliverable**: Working achievement system with rewards.

**Test**: Earn 5 achievements naturally. Are they satisfying? Too easy/hard?

---

### 3.4 Prestige System (Week 8, Days 1-3)

**Tasks:**
- [ ] Create `prestigeStore.ts`
- [ ] Implement Golden Seeds calculation formula
- [ ] Build prestige UI showing preview of rewards
- [ ] Add confirmation dialog with clear explanation
- [ ] Implement reset logic (keep Legendary rabbits)
- [ ] Apply Golden Seed multipliers to new run
- [ ] Track prestige count and total lifetime carrots
- [ ] Award Golden Carrots for prestige milestones

**Deliverable**: Functional prestige system.

**Test**: Prestige at 1B carrots. Is the power boost noticeable? Does new run feel faster?

---

### 3.5 Offline Earnings (Week 8, Days 4-5)

**Tasks:**
- [ ] Calculate time away on game load
- [ ] Implement 50% efficiency for offline time
- [ ] Cap offline time at 24 hours
- [ ] Create "Welcome Back!" modal showing offline earnings
- [ ] Add option to watch ad for 100% efficiency (optional)
- [ ] Handle edge cases (time travel, negative time)

**Deliverable**: Players earn carrots while away.

**Test**: Close game for 1 hour. Reopen. Are earnings calculated correctly?

---

### 3.6 Advanced UI Polish (Week 9)

**Tasks:**
- [ ] Create polished carrot click animation
- [ ] Add particle system for clicks (carrot bits, sparkles)
- [ ] Design better crate opening animation sequence
- [ ] Add confetti effect for Epic+ rabbits
- [ ] Implement animated number counter with smooth transitions
- [ ] Add milestone celebration animations (1K, 1M, 1B)
- [ ] Create loading screen for game initialization
- [ ] Add subtle background music (toggle option)
- [ ] Polish all button hover/active states
- [ ] Add tooltips explaining all mechanics

**Deliverable**: Visually polished, juicy game feel.

**Test**: Does every interaction feel satisfying? Any dead/boring moments?

---

### 3.7 Balance Pass (Week 9, Days 4-5)

**Tasks:**
- [ ] Playtest full progression 0 to prestige
- [ ] Adjust upgrade costs if pacing feels wrong
- [ ] Balance crate costs vs rabbit power
- [ ] Tune CPS scaling for buildings vs rabbits
- [ ] Adjust Golden Seed formula if needed
- [ ] Balance Golden Carrot earn rates
- [ ] Test prestige at different lifetime carrot amounts
- [ ] Document final balance numbers

**Deliverable**: Well-paced progression from start to prestige.

**Test**: Have 3-5 playtesters play through to prestige. Track time, bottlenecks, feedback.

---

### Phase 3 Success Criteria

- [x] 30 rabbits across all rarities including Epic and Legendary
- [x] Achievement system driving goals
- [x] Prestige system providing meta-progression
- [x] Golden Carrots earnable and purchasable
- [x] Offline earnings functional
- [x] Polished animations and juice
- [x] Balanced progression to first prestige (~5-10 hours)
- [x] Playable for 10+ hours

**Estimated Duration**: 4 weeks

**Next Step**: Public beta test with ~50-100 players. Gather analytics and feedback.

---

## Phase 4: Advanced Features

**Goal**: Add systems that provide long-term engagement and depth.

**Scope**: Leveling, synergies, events, leaderboards.

### 4.1 Rabbit Leveling System (Week 10, Days 1-3)

**Tasks:**
- [ ] Add level, XP, and maxLevel to Rabbit type
- [ ] Implement Rabbit XP resource
- [ ] Create level-up UI in rabbit details modal
- [ ] Scale CPS by 10% per level
- [ ] Scale special abilities by 1% per level
- [ ] Add level display on rabbit cards
- [ ] Create level-up animation and sound

**Deliverable**: Rabbits can be leveled up to increase power.

---

### 4.2 Rabbit Special Abilities (Week 10, Days 4-5)

**Tasks:**
- [ ] Design 20 unique rabbit abilities
- [ ] Implement ability effects on game state
- [ ] Show active abilities on team screen
- [ ] Add ability tooltips explaining effects
- [ ] Test ability stacking and synergies
- [ ] Balance ability power levels

**Example Abilities:**
- "Garden Master: +20% Carrot Garden production"
- "Lucky Paw: +5% all carrot earnings"
- "Speed Hopper: +15% click rate"

**Deliverable**: Rabbits have unique gameplay effects beyond just CPS.

---

### 4.3 Daily Rewards (Week 11, Days 1-2)

**Tasks:**
- [ ] Implement daily login tracking
- [ ] Create daily reward calendar
- [ ] Award increasing Golden Carrots for login streaks
- [ ] Show days until next reward
- [ ] Reset streak after 24 hours missed
- [ ] Add claim reward modal

**Reward Structure:**
- Day 1: 1 Golden Carrot
- Day 2: 2 Golden Carrots
- Day 3: 3 Golden Carrots
- Day 7: 10 Golden Carrots + Bonus Crate

**Deliverable**: Daily login incentive system.

---

### 4.4 Limited-Time Events (Week 11, Days 3-5)

**Tasks:**
- [ ] Create event system framework
- [ ] Design first event: "Carrot Harvest Festival"
- [ ] Add event-specific currency
- [ ] Create 5 event-exclusive rabbits
- [ ] Build event shop with themed items
- [ ] Add event timer to UI
- [ ] Implement event activation/deactivation logic

**Deliverable**: First playable event with exclusive content.

---

### 4.5 Statistics & Analytics (Week 12, Days 1-2)

**Tasks:**
- [ ] Create stats screen showing lifetime stats
- [ ] Track and display:
  - Total clicks performed
  - Total carrots earned
  - Total crates opened
  - Rarest rabbit owned
  - Fastest prestige time
  - Current run statistics
- [ ] Add graphs for carrot earnings over time
- [ ] Integrate analytics (Plausible or similar)
- [ ] Track key events for analysis

**Deliverable**: Stats screen and backend analytics.

---

### 4.6 Leaderboards (Week 12, Days 3-5)

**Tasks:**
- [ ] Set up backend for leaderboard (Firebase/Supabase)
- [ ] Implement leaderboard categories:
  - Highest CPS
  - Most carrots earned
  - Fastest prestige
  - Most rabbits collected
- [ ] Create leaderboard UI
- [ ] Add optional player names/usernames
- [ ] Implement cheat detection (basic validation)
- [ ] Update leaderboards hourly

**Deliverable**: Competitive leaderboards with anti-cheat.

**Note**: Requires backend infrastructure.

---

### 4.7 Cloud Save System (Week 13)

**Tasks:**
- [ ] Set up authentication (email or social login)
- [ ] Implement cloud save to Firebase/Supabase
- [ ] Add "Sync to Cloud" button in settings
- [ ] Handle save conflicts (newest timestamp wins)
- [ ] Allow loading cloud save on new device
- [ ] Add manual cloud save backup/restore
- [ ] Show last sync time

**Deliverable**: Optional cloud saves for cross-device play.

---

### Phase 4 Success Criteria

- [x] Rabbit leveling adds progression depth
- [x] Special abilities create strategic choices
- [x] Daily rewards encourage return visits
- [x] Events provide fresh content
- [x] Statistics track player progress
- [x] Leaderboards add competition
- [x] Cloud saves enable cross-device play
- [x] Playable for 50+ hours

**Estimated Duration**: 4 weeks

**Next Step**: Soft launch to wider audience. Monitor retention and engagement metrics.

---

## Phase 5: Live Operations

**Goal**: Maintain and grow the player base with ongoing content and improvements.

**Scope**: Regular updates, new rabbits, events, community features.

### 5.1 Ongoing Content Updates

**Monthly Content Patches:**
- Add 5-10 new rabbits each month
- Introduce new building tiers
- Create seasonal events (Halloween, Winter, Spring)
- Design community-voted rabbits
- Add quality-of-life improvements

---

### 5.2 Community Features

**Tasks:**
- [ ] Add social sharing for achievements
- [ ] Create community Discord or forum
- [ ] Implement player profiles
- [ ] Add rabbit trading system (optional)
- [ ] Create guild/clan system (optional)
- [ ] Weekly challenges with rewards

---

### 5.3 Monetization Optimization

**Tasks:**
- [ ] A/B test Golden Carrot pricing
- [ ] Add limited-time offers
- [ ] Create monthly subscription pass
- [ ] Design cosmetic warren skins (non-gameplay)
- [ ] Add seasonal bundles
- [ ] Monitor purchase analytics and optimize

---

### 5.4 Advanced Systems (Long-term)

**Potential Future Features:**
- Second prestige layer (Diamond Seeds)
- Rabbit breeding system
- Mini-games (tower defense, puzzles)
- PvP competitions
- Story mode with narrative
- Rabbit expeditions/adventures
- Customizable warren visuals

**Approach**: Add based on player demand and engagement data.

---

### Phase 5 Success Criteria

- [x] Monthly active users growing or stable
- [x] Average session time >10 minutes
- [x] Day 1, 7, 30 retention rates healthy
- [x] Monetization supporting development
- [x] Active community engagement
- [x] Regular content updates

**Estimated Duration**: Ongoing

---

## Timeline Estimates

### Solo Developer

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: MVP | 3 weeks | 3 weeks |
| Phase 2: Core Features | 3 weeks | 6 weeks |
| Phase 3: Polish & Content | 4 weeks | 10 weeks |
| Phase 4: Advanced Features | 4 weeks | 14 weeks |
| Phase 5: Live Ops | Ongoing | - |

**Total to Launch-Ready**: ~3.5 months (solo, full-time)

**Part-Time Development**: Double estimates (~7 months)

---

### Small Team (2-3 people)

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: MVP | 2 weeks | 2 weeks |
| Phase 2: Core Features | 2 weeks | 4 weeks |
| Phase 3: Polish & Content | 3 weeks | 7 weeks |
| Phase 4: Advanced Features | 3 weeks | 10 weeks |

**Total to Launch-Ready**: ~2.5 months

---

## Testing Milestones

### Alpha Testing (Post Phase 1)

**Participants**: 5-10 friends/family
**Goals:**
- Verify core loop is fun
- Identify confusing UI elements
- Test save/load reliability
- Check mobile responsiveness

**Key Questions:**
- Do they understand what to do?
- How long do they play?
- Do they return for a second session?

---

### Beta Testing (Post Phase 3)

**Participants**: 50-100 players (public beta)
**Goals:**
- Balance progression pacing
- Test server load (leaderboards, cloud saves)
- Identify bugs and edge cases
- Gather feature requests

**Metrics to Track:**
- Session length average
- Retention (Day 1, Day 7)
- Progression speed to prestige
- Crate opening frequency
- Purchase conversion rate

---

### Soft Launch (Post Phase 4)

**Participants**: 1,000-10,000 players
**Goals:**
- Validate monetization strategy
- Scale infrastructure
- Build community
- Generate word-of-mouth

**Success Criteria:**
- Day 1 retention >40%
- Day 7 retention >20%
- Average session >8 minutes
- 5-10% purchase rate

---

## Risk Management

### Common Risks & Mitigation

**Risk: Scope Creep**
- Mitigation: Stick to roadmap phases. Defer features to post-launch.

**Risk: Balance Issues**
- Mitigation: Playtesting at end of each phase. Gather quantitative data.

**Risk: Technical Debt**
- Mitigation: Refactor during polish phases. Write tests for core systems.

**Risk: Burnout (Solo Dev)**
- Mitigation: Take breaks between phases. Don't rush. Set realistic hours.

**Risk: Poor Retention**
- Mitigation: Test core loop early (Phase 1 testing). Iterate based on feedback.

**Risk: Monetization Fails**
- Mitigation: Make game fun first, monetization second. Generous free path.

---

## Development Best Practices

### Throughout All Phases

**Code Quality:**
- Write tests for game logic (calculations, gacha, save/load)
- Use TypeScript strictly (no `any` types)
- Document complex functions
- Code review if working with team

**User Feedback:**
- Gather feedback after each phase
- Implement analytics early (Phase 2)
- Monitor player behavior and pain points
- Iterate based on data, not assumptions

**Performance:**
- Profile game loop regularly
- Keep bundles <500KB gzipped
- Test on low-end devices
- Optimize re-renders (use React DevTools Profiler)

**Version Control:**
- Commit frequently with clear messages
- Use branches for features
- Tag releases (v0.1.0, v0.2.0, etc.)
- Maintain changelog

---

## Launch Checklist

### Pre-Launch Requirements

**Technical:**
- [ ] All Phase 3 features complete and tested
- [ ] Save system robust with backups
- [ ] Game balanced (0 to first prestige in 5-10 hours)
- [ ] No game-breaking bugs
- [ ] Performance optimized (60fps on target devices)
- [ ] Analytics integrated and tested
- [ ] Payment processing tested in production

**Content:**
- [ ] 30+ rabbits with art and abilities
- [ ] 30+ achievements
- [ ] 40+ upgrades and buildings
- [ ] 4 crate types functional
- [ ] Help/tutorial for new players

**Marketing:**
- [ ] Landing page or website
- [ ] Social media accounts created
- [ ] Gameplay trailer video
- [ ] Press kit prepared
- [ ] Submission to game directories (Itch.io, Kongregate, etc.)

**Legal:**
- [ ] Privacy policy written
- [ ] Terms of service written
- [ ] Payment provider terms accepted
- [ ] GDPR compliance if targeting EU

---

## Post-Launch Priorities

### Week 1 After Launch

1. Monitor analytics closely (crashes, errors, retention)
2. Respond to community feedback quickly
3. Fix critical bugs immediately
4. Gather feature requests
5. Plan first content update

### Month 1 After Launch

1. Release first content patch (new rabbits, event)
2. Balance adjustments based on data
3. Implement top community requests
4. Begin work on Phase 4 features
5. Build community engagement (Discord, social media)

---

## Summary

This roadmap provides a clear path from empty project to launched game in approximately 3-4 months of full-time development.

**Key Principles:**

1. **Start Small**: MVP in 2-3 weeks to validate fun
2. **Iterate**: Each phase adds value and can ship
3. **Test Often**: User testing after Phases 1, 2, 3
4. **Stay Flexible**: Adjust based on feedback and data
5. **Ship Quality**: Don't rush. Polish is what makes games great.

**The Most Important Milestone**: Phase 1 MVP. If the core clicking and upgrading isn't fun, nothing else matters. Spend extra time here if needed to get it right.

**Second Most Important**: Phase 3 prestige testing. This determines if players will stick around for the long haul.

Follow this roadmap, listen to players, and Rabbit Clicker will be a delightful idle game that players enjoy for months. Good luck!
