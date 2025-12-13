# TODO: Add Achievement Unlock Sound (RAB-80)

## What's Needed
Add the actual `achievement-unlock.mp3` file to this directory.

## Where to Get It
Source from free sound libraries:
- **Freesound.org**: <https://freesound.org/search/?q=achievement+unlock>
- **Zapsplat.com**: <https://www.zapsplat.com/sound-effect-category/game-sounds/>
- **Mixkit.co**: <https://mixkit.co/free-sound-effects/game/>

## Requirements
- **Format**: MP3
- **Duration**: ~500-1500ms
- **Tone**: Satisfying, positive, celebratory
- **Volume**: Medium (not too loud or jarring)

## Search Terms
Try searching for:
- "achievement unlock"
- "level up"
- "success chime"
- "victory jingle"
- "game achievement"
- "notification positive"

## What's Already Implemented
✅ Sound utility created (`src/utils/achievementSounds.ts`)
✅ Integration with AchievementToast component
✅ Volume and throttling configured
✅ Will play automatically when achievements unlock

## Once You Add the File
1. Download your chosen sound as MP3
2. Save it to this directory as `achievement-unlock.mp3`
3. Delete this TODO file
4. Test in-game by unlocking an achievement
5. The sound should play automatically!

## Testing
The sound system will fail gracefully if the file is missing, so the game will still work without it (just without sound).
