// The Aurum Job — shared constants for the heist.
// One room, one night, one idol. Everything the other modules need lives here.

export const VIEW = { w: 960, h: 640 };
export const WALL = 16;

export const PLAYER = {
  radius: 11,
  walkSpeed: 165,
  sneakSpeed: 85,
  // Sneaking shrinks how far a cone can spot you (multiplier on cone range).
  sneakRangeFactor: 0.62,
  coins: 3,
};

export const GUARD = {
  radius: 12,
  patrolSpeed: 62,
  chaseSpeed: 128,
  investigateSpeed: 95,
  coneRange: 170,
  coneHalfAngle: 0.52,
  // Alarm per second while the thief stands inside a guard cone.
  spotRate: 34,
  // Alarm per second while a guard chases (thief seen up close).
  chaseSpotRate: 55,
  // How long a guard stares at a thrown coin before giving up.
  investigateTime: 3.2,
};

export const CAMERA = {
  coneRange: 195,
  coneHalfAngle: 0.42,
  // Alarm per second while the thief stands inside a camera cone.
  spotRate: 26,
  sweepSpeed: 0.55,
  sweepArc: 0.85,
};

export const ALARM = {
  decayPerSecond: 7,
  waryAt: 30,
  criticalAt: 70,
  caughtAt: 100,
};

export const COLORS = {
  floorA: '#20242e',
  floorB: '#1b1f28',
  carpet: '#5a1f28',
  carpetEdge: '#8a6d2f',
  wall: '#3a3f4d',
  wallTop: '#4a5060',
  caseGlass: '#7fb2d9',
  caseBase: '#2c3140',
  pillar: '#565d6e',
  pedestal: '#3d3a2e',
  gold: '#f2c14e',
  goldDim: '#b98a2e',
  exit: '#3fae6a',
  thief: '#e8e4d8',
  thiefCloak: '#23232e',
  guard: '#31435e',
  guardAlert: '#a33327',
  coneCalm: 'rgba(242, 193, 78, 0.20)',
  coneAlert: 'rgba(214, 69, 50, 0.30)',
  coneCamera: 'rgba(127, 178, 217, 0.20)',
  hudBg: 'rgba(10, 12, 18, 0.82)',
  text: '#e8e4d8',
  textDim: '#9aa3b2',
};
