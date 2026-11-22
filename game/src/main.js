// The Aurum Job — game loop and states.
// title → playing → caught | won. R restarts, M mutes, click tosses a coin.

import { VIEW } from './config.js';
import { createLevel } from './level.js';
import { createPlayer, updatePlayer, updateCoins, throwCoin } from './player.js';
import { createGuard, updateGuard } from './guard.js';
import { createCamera, updateCamera } from './camera.js';
import { createAlarm, updateAlarm } from './alarm.js';
import { createInput, bindInput, consumeOneShots } from './input.js';
import { createAudio, playCoin, playPickup, playSeen, playCaught, playWin, toggleMute } from './audio.js';
import { render } from './render.js';
import { readShot, stageShot } from './shots.js';

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function createGame() {
  const level = createLevel();
  return {
    level,
    player: createPlayer(level.entry.x, level.entry.y),
    guards: level.guards.map(createGuard),
    cameras: level.cameras.map(createCamera),
    alarm: createAlarm(),
    state: 'title', // title | playing | caught | won
    elapsed: 0,
    peakAlarm: 0,
    timeText: '0:00',
    objective: 'Cross the room. Steal the Aurum Idol. Slip out the skylight.',
    frozen: false,
    seenTick: 0,
  };
}

function resetGame(game) {
  const fresh = createGame();
  Object.assign(game, fresh);
  game.state = 'playing';
}

function update(game, input, dt, audio) {
  const actions = consumeOneShots(input);
  if (actions.mute) toggleMute(audio);
  if (actions.restart && game.state !== 'title') resetGame(game);

  if (game.state === 'title') {
    if (actions.start || input.clicked) {
      game.state = 'playing';
    }
    return;
  }
  if (game.state === 'caught' || game.state === 'won') return;

  game.elapsed += dt;
  game.timeText = formatTime(game.elapsed);

  updatePlayer(game.player, input, dt, game.level);
  updateCoins(game.player, dt);
  if (actions.coin) {
    if (throwCoin(game.player, input.mouseX, input.mouseY)) playCoin(audio);
  }

  let seenByGuard = false;
  let chasing = false;
  for (const g of game.guards) {
    if (updateGuard(g, game.player, dt, game.level)) {
      seenByGuard = true;
      if (g.state === 'chase') chasing = true;
    }
  }
  let seenByCamera = false;
  for (const cam of game.cameras) {
    if (updateCamera(cam, game.elapsed, game.player, game.level)) seenByCamera = true;
  }
  if ((seenByGuard || seenByCamera) && game.seenTick <= 0) {
    playSeen(audio);
    game.seenTick = 0.6;
  }
  game.seenTick -= dt;

  const caught = updateAlarm(game.alarm, dt, seenByGuard, seenByCamera, chasing);
  if (game.alarm.value > game.peakAlarm) game.peakAlarm = game.alarm.value;
  if (caught) {
    game.state = 'caught';
    playCaught(audio);
    return;
  }

  // Take the idol.
  const loot = game.level.loot;
  if (!loot.taken && Math.hypot(game.player.x - loot.x, game.player.y - loot.y) < game.player.r + loot.r + 4) {
    loot.taken = true;
    game.objective = 'Idol taken — get out through the skylight, top-right!';
    playPickup(audio);
  }

  // Slip out the skylight once the idol is taken.
  const exit = game.level.exit;
  if (
    loot.taken &&
    Math.hypot(game.player.x - exit.x, game.player.y - exit.y) < game.player.r + exit.r
  ) {
    game.state = 'won';
    playWin(audio);
  }
}

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW.w;
canvas.height = VIEW.h;

const game = createGame();
const input = createInput();
const audio = createAudio();
bindInput(input, canvas);

const shot = readShot();
if (shot) stageShot(game, shot);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!game.frozen) update(game, input, dt, audio);
  render(ctx, game);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
