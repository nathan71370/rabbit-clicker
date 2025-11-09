# Game Sound Assets

This directory contains sound effects for the Rabbit Clicker game.

## Required Sound Files

### Click Sound (`click.mp3`)
**Status:** 🔴 Required - Not yet added

A short, satisfying click sound that plays when the player clicks the carrot button.

**Requirements:**
- Format: MP3 (for broad browser compatibility)
- Duration: ~50-200ms (short and snappy)
- Volume: Medium (will be controlled by sound manager)
- Tone: Positive, satisfying (not harsh or annoying)

**Suggestions:**
- Simple pop or tap sound
- Light percussion hit
- UI confirmation sound
- Can be sourced from free sound libraries like:
  - Freesound.org
  - Zapsplat.com
  - Mixkit.co

### Purchase Sound (`purchase.mp3`)
**Status:** 🟡 Planned for RAB-39

A satisfying sound for purchasing upgrades (different from click sound).

### Crate Opening Sound (`crate-open.mp3`)
**Status:** 🔴 Required - Placeholder added (RAB-56)

Sound that plays when a crate is opened.

**Requirements:**
- Format: MP3
- Duration: ~500-1000ms
- Volume: Medium
- Tone: Exciting, anticipation building

**Suggestions:**
- Box opening sound
- Chest unlocking sound
- Gift unwrapping sound

### Rare Drop Sound (`rare-drop.mp3`)
**Status:** 🔴 Required - Placeholder added (RAB-56)

Celebratory fanfare for high-rarity rabbits (Rare, Epic, Legendary, Mythical).

**Requirements:**
- Format: MP3
- Duration: ~1000-2000ms
- Volume: Medium-High
- Tone: Celebratory, exciting

**Suggestions:**
- Victory fanfare
- Achievement unlock sound
- Sparkle/magical sound

### Duplicate Sound (`duplicate.mp3`)
**Status:** 🔴 Required - Placeholder added (RAB-56)

Sound notification for duplicate rabbits.

**Requirements:**
- Format: MP3
- Duration: ~300-500ms
- Volume: Medium
- Tone: Neutral notification, not negative

**Suggestions:**
- Notification beep
- Gentle chime
- "Already have" sound

## Temporary Workaround

Until actual sound files are added, the sound system will:
- Fail gracefully (no errors)
- Log warnings in console
- Continue gameplay without audio

## Adding Sounds

1. Place sound file in this directory: `public/assets/sounds/click.mp3`
2. Sound will be automatically loaded by the sound manager
3. No code changes needed (path is already configured)

## Sound Manager

The game uses a centralized sound manager (`src/utils/sounds.ts`) that provides:
- Sound caching for performance
- Volume control
- Enable/disable toggle
- Cross-browser compatibility
- Non-blocking playback
