// The room: one gallery at night, three ways across it.
// Left wing runs behind tall display cases, the centre threads the pillars,
// the right hall is fast but watched by both cameras. The vault pedestal
// holds the Aurum Idol at the top; the skylight exit waits top-right.

import { VIEW, WALL } from './config.js';

export function createLevel() {
  const cases = [
    // Left wing display cases (tall cover).
    { x: 120, y: 170, w: 92, h: 52 },
    { x: 120, y: 350, w: 92, h: 52 },
    // Right wing display cases.
    { x: 748, y: 170, w: 92, h: 52 },
    { x: 748, y: 350, w: 92, h: 52 },
  ];
  const pillars = [
    { x: 330, y: 288, w: 34, h: 34 },
    { x: 596, y: 288, w: 34, h: 34 },
    { x: 330, y: 470, w: 34, h: 34 },
    { x: 596, y: 470, w: 34, h: 34 },
  ];
  // The vault pedestal is solid: the idol sits on it, the thief walks around it.
  const pedestal = { x: 440, y: 118, w: 80, h: 44 };
  const blockers = [...cases, ...pillars, pedestal];

  return {
    bounds: { x: WALL, y: WALL, w: VIEW.w - WALL * 2, h: VIEW.h - WALL * 2 },
    cases,
    pillars,
    pedestal,
    blockers,
    // Where the thief slips in, bottom centre.
    entry: { x: 480, y: 606 },
    // Where the thief gets out, top-right, once the idol is taken.
    exit: { x: 906, y: 52, r: 26 },
    loot: { x: 480, y: 140, r: 13, taken: false, name: 'Aurum Idol' },
    carpet: { x: 452, y: 162, w: 56, h: 444 },
    guards: [
      {
        name: 'Rook',
        waypoints: [
          { x: 210, y: 300 },
          { x: 750, y: 300 },
        ],
      },
      {
        name: 'Bishop',
        waypoints: [
          { x: 250, y: 130 },
          { x: 250, y: 520 },
        ],
      },
      {
        name: 'Knight',
        waypoints: [
          { x: 710, y: 520 },
          { x: 710, y: 130 },
        ],
      },
    ],
    cameras: [
      { x: 300, y: WALL + 2, baseAngle: Math.PI / 2, mount: 'top' },
      { x: 660, y: WALL + 2, baseAngle: Math.PI / 2, mount: 'top' },
    ],
  };
}
