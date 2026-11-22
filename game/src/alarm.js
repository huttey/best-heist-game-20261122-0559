// The alarm meter: 0 to 100. Being seen pushes it up fast; hiding lets it
// bleed back down. At 100 the gallery locks down and the run is over.

import { ALARM, GUARD, CAMERA } from './config.js';

export function createAlarm() {
  return { value: 0 };
}

export function updateAlarm(alarm, dt, seenByGuard, seenByCamera, chasing) {
  let rate = 0;
  if (seenByGuard) rate += chasing ? GUARD.chaseSpotRate : GUARD.spotRate;
  if (seenByCamera) rate += CAMERA.spotRate;
  if (rate > 0) {
    alarm.value += rate * dt;
  } else {
    alarm.value -= ALARM.decayPerSecond * dt;
  }
  if (alarm.value < 0) alarm.value = 0;
  if (alarm.value > ALARM.caughtAt) alarm.value = ALARM.caughtAt;
  return alarm.value >= ALARM.caughtAt;
}

export function alarmLabel(value) {
  if (value >= ALARM.criticalAt) return 'CRITICAL';
  if (value >= ALARM.waryAt) return 'WARY';
  return 'CALM';
}
