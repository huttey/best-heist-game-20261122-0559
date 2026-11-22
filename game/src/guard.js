// Guards: patrol, investigate, chase.
// A guard walks its waypoints and looks where it walks. When it sees the
// thief it chases; when it hears a coin it walks over to look. A guard that
// loses the thief goes back to its patrol.

import { GUARD, PLAYER } from './config.js';
import { inCone, lineBlocked } from './vision.js';

export function createGuard(spec) {
  const start = spec.waypoints[0];
  return {
    name: spec.name,
    waypoints: spec.waypoints,
    wp: 1,
    x: start.x,
    y: start.y,
    r: GUARD.radius,
    dir: 0,
    state: 'patrol', // patrol | investigate | chase
    investigate: null,
    investigateT: 0,
    chaseT: 0,
    seen: false,
  };
}

function moveToward(g, tx, ty, speed, dt) {
  const dx = tx - g.x;
  const dy = ty - g.y;
  const d = Math.hypot(dx, dy);
  if (d < 2) return true;
  const step = Math.min(d, speed * dt);
  g.x += (dx / d) * step;
  g.y += (dy / d) * step;
  g.dir = Math.atan2(dy, dx);
  return d - step < 2;
}

export function updateGuard(g, player, dt, level) {
  g.seen = false;
  if (g.state === 'patrol') {
    const target = g.waypoints[g.wp];
    if (moveToward(g, target.x, target.y, GUARD.patrolSpeed, dt)) {
      g.wp = (g.wp + 1) % g.waypoints.length;
    }
    // A fresh coin on the floor pulls the nearest patrolling guard away.
    if (player.thrown.length > 0) {
      const coin = player.thrown[player.thrown.length - 1];
      if (Math.hypot(coin.x - g.x, coin.y - g.y) < 320) {
        g.state = 'investigate';
        g.investigate = { x: coin.x, y: coin.y };
        g.investigateT = GUARD.investigateTime;
      }
    }
  } else if (g.state === 'investigate') {
    if (moveToward(g, g.investigate.x, g.investigate.y, GUARD.investigateSpeed, dt)) {
      g.investigateT -= dt;
      g.dir += dt * 1.6; // looks around while it stares at the coin
    }
    if (g.investigateT <= 0) {
      g.state = 'patrol';
      g.investigate = null;
    }
  } else if (g.state === 'chase') {
    moveToward(g, player.x, player.y, GUARD.chaseSpeed, dt);
    g.chaseT -= dt;
    if (g.chaseT <= 0) {
      g.state = 'patrol';
    }
  }

  // Seeing: inside the cone, in range (sneaking shrinks it), line of sight clear.
  const range = GUARD.coneRange * (player.sneaking ? PLAYER.sneakRangeFactor : 1);
  if (
    inCone(player.x, player.y, g.x, g.y, g.dir, range, GUARD.coneHalfAngle) &&
    !lineBlocked(g.x, g.y, player.x, player.y, level.blockers)
  ) {
    g.seen = true;
    if (g.state !== 'chase') {
      g.state = 'chase';
      g.chaseT = 2.5;
    } else {
      g.chaseT = 2.5;
    }
  }
  return g.seen;
}
