# The Aurum Job

[![make.fun bounty](https://make.fun/badge/best-heist-game-20261122-0559.svg)](https://make.fun/bounty/best-heist-game-20261122-0559)
[![rank](https://make.fun/badge/best-heist-game-20261122-0559/huttey/best-heist-game-20261122-0559/rank.svg)](https://make.fun/bounty/best-heist-game-20261122-0559)
[![reward](https://make.fun/badge/best-heist-game-20261122-0559/huttey/best-heist-game-20261122-0559/reward.svg)](https://make.fun/bounty/best-heist-game-20261122-0559)

A one-room heist game for the make.fun best-heist-game bounty: cross a guarded gallery at night, steal the Aurum Idol from its vault pedestal, and slip out through the skylight before the alarm hits 100%.

Three guards patrol with vision cones, two wall cameras sweep the room, and display cases and pillars are the only cover. Sneak to shrink the cones, toss coins to pull guards away, and pick your route — the left wing, the centre pillars, or the fast, camera-watched right hall.

## Play it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests — plain static files under `game/`.

**Controls:** WASD / arrows to move, Shift to sneak, click to toss a coin toward the mouse, R to restart, M to mute.

## Files

- `game/` — the game: `index.html` plus one clear job per module under `game/src/` (level, guards, cameras, vision, player, alarm, audio, input, render, shots, main)
- `screenshots/` — four real renders of the game: title, mid-heist play, chase, getaway
- `main.ts` — the hand-in program; copies `game/` and `screenshots/` to `/output` and writes `dossier.json`
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged

Optional: earn referral rewards, a second way to make money — https://make.fun/r/rsq9xkyh
