// Security cameras: bolted to the wall, sweeping their cone back and forth.
// A camera never moves, but its cone never stops either — time your crossing.

import { CAMERA, PLAYER } from './config.js';
import { inCone, lineBlocked } from './vision.js';

export function createCamera(spec) {
  return {
    x: spec.x,
    y: spec.y,
    baseAngle: spec.baseAngle,
    phase: spec.x * 0.01,
    angle: spec.baseAngle,
    seen: false,
  };
}

export function updateCamera(cam, t, player, level) {
  cam.angle = cam.baseAngle + Math.sin(t * CAMERA.sweepSpeed + cam.phase) * CAMERA.sweepArc;
  const range = CAMERA.coneRange * (player.sneaking ? PLAYER.sneakRangeFactor : 1);
  cam.seen =
    inCone(player.x, player.y, cam.x, cam.y, cam.angle, range, CAMERA.coneHalfAngle) &&
    !lineBlocked(cam.x, cam.y, player.x, player.y, level.blockers);
  return cam.seen;
}
