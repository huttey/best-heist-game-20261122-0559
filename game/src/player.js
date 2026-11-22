// The thief: Wren. Walks fast, sneaks slow, throws coins to pull guards away.

import { PLAYER } from './config.js';
import { circleRectResolve } from './vision.js';

export function createPlayer(x, y) {
  return {
    x,
    y,
    r: PLAYER.radius,
    dir: -Math.PI / 2,
    sneaking: false,
    moving: false,
    coins: PLAYER.coins,
    // Coins on the floor, each {x, y, t}: guards walk to the newest one.
    thrown: [],
  };
}

export function updatePlayer(p, input, dt, level) {
  let mx = 0;
  let my = 0;
  if (input.left) mx -= 1;
  if (input.right) mx += 1;
  if (input.up) my -= 1;
  if (input.down) my += 1;
  p.sneaking = input.sneak;
  p.moving = mx !== 0 || my !== 0;
  if (!p.moving) return;

  const len = Math.hypot(mx, my);
  const speed = p.sneaking ? PLAYER.sneakSpeed : PLAYER.walkSpeed;
  const stepX = (mx / len) * speed * dt;
  const stepY = (my / len) * speed * dt;
  p.dir = Math.atan2(my, mx);

  // Move one axis at a time so the thief slides along cases and pillars.
  let nx = p.x + stepX;
  nx = Math.max(level.bounds.x + p.r, Math.min(level.bounds.x + level.bounds.w - p.r, nx));
  for (const b of level.blockers) {
    const hit = circleRectResolve(nx, p.y, p.r, b);
    nx = hit.x;
  }
  p.x = nx;
  let ny = p.y + stepY;
  ny = Math.max(level.bounds.y + p.r, Math.min(level.bounds.y + level.bounds.h - p.r, ny));
  for (const b of level.blockers) {
    const hit = circleRectResolve(p.x, ny, p.r, b);
    ny = hit.y;
  }
  p.y = ny;
}

// Throw a coin toward (tx, ty). It lands at most 220 px away and rings
// for a few seconds; the nearest guard walks over to look. Costs one coin.
export function throwCoin(p, tx, ty) {
  if (p.coins <= 0) return false;
  const dx = tx - p.x;
  const dy = ty - p.y;
  const d = Math.hypot(dx, dy) || 1;
  const land = Math.min(d, 220);
  p.coins -= 1;
  p.thrown.push({ x: p.x + (dx / d) * land, y: p.y + (dy / d) * land, t: 4 });
  return true;
}

export function updateCoins(p, dt) {
  for (const c of p.thrown) c.t -= dt;
  p.thrown = p.thrown.filter((c) => c.t > 0);
}
