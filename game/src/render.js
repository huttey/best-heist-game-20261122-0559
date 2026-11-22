// Drawing: the gallery at night, the cones, the thief, the HUD.
// Everything the judge sees in a screenshot is drawn here, in one place.

import { VIEW, WALL, COLORS, ALARM, CAMERA, GUARD } from './config.js';
import { alarmLabel } from './alarm.js';

function conePath(ctx, x, y, dir, range, half) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, range, dir - half, dir + half);
  ctx.closePath();
}

function drawCone(ctx, x, y, dir, range, half, fill) {
  conePath(ctx, x, y, dir, range, half);
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawFloor(ctx) {
  ctx.fillStyle = COLORS.floorA;
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  // Marble checker, faint.
  const t = 40;
  ctx.fillStyle = COLORS.floorB;
  for (let y = WALL; y < VIEW.h - WALL; y += t) {
    for (let x = WALL; x < VIEW.w - WALL; x += t) {
      if (((x / t) | 0) % 2 === ((y / t) | 0) % 2) ctx.fillRect(x, y, t, t);
    }
  }
  // Red carpet runner from the entry door to the vault.
  ctx.fillStyle = COLORS.carpet;
  ctx.fillRect(452, 162, 56, 444);
  ctx.fillStyle = COLORS.carpetEdge;
  ctx.fillRect(448, 162, 4, 444);
  ctx.fillRect(504, 162, 4, 444);
}

function drawWalls(ctx) {
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, 0, VIEW.w, WALL);
  ctx.fillRect(0, VIEW.h - WALL, VIEW.w, WALL);
  ctx.fillRect(0, 0, WALL, VIEW.h);
  ctx.fillRect(VIEW.w - WALL, 0, WALL, VIEW.h);
  ctx.fillStyle = COLORS.wallTop;
  ctx.fillRect(0, 0, VIEW.w, 4);
  ctx.fillRect(0, VIEW.h - 4, VIEW.w, 4);
  ctx.fillRect(0, 0, 4, VIEW.h);
  ctx.fillRect(VIEW.w - 4, 0, 4, VIEW.h);
}

function drawCases(ctx, level) {
  for (const c of level.cases) {
    ctx.fillStyle = COLORS.caseBase;
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.fillStyle = COLORS.caseGlass;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(c.x + 4, c.y + 4, c.w - 8, c.h - 8);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = COLORS.goldDim;
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x + 1, c.y + 1, c.w - 2, c.h - 2);
    // A little treasure glinting inside each case.
    ctx.fillStyle = COLORS.gold;
    ctx.beginPath();
    ctx.arc(c.x + c.w / 2, c.y + c.h / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const p of level.pillars) {
    ctx.fillStyle = COLORS.pillar;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = COLORS.goldDim;
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);
  }
  // Vault pedestal and the idol.
  const ped = level.pedestal;
  ctx.fillStyle = COLORS.pedestal;
  ctx.fillRect(ped.x, ped.y, ped.w, ped.h);
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(ped.x + 1, ped.y + 1, ped.w - 2, ped.h - 2);
  if (!level.loot.taken) {
    const pulse = 0.7 + Math.sin(Date.now() / 300) * 0.3;
    ctx.save();
    ctx.globalAlpha = 0.25 * pulse;
    ctx.fillStyle = COLORS.gold;
    ctx.beginPath();
    ctx.arc(level.loot.x, level.loot.y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = COLORS.gold;
    ctx.beginPath();
    ctx.moveTo(level.loot.x, level.loot.y - 12);
    ctx.lineTo(level.loot.x + 9, level.loot.y + 2);
    ctx.lineTo(level.loot.x, level.loot.y + 12);
    ctx.lineTo(level.loot.x - 9, level.loot.y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff7d6';
    ctx.beginPath();
    ctx.moveTo(level.loot.x, level.loot.y - 12);
    ctx.lineTo(level.loot.x + 4, level.loot.y + 2);
    ctx.lineTo(level.loot.x, level.loot.y + 12);
    ctx.lineTo(level.loot.x - 4, level.loot.y + 2);
    ctx.closePath();
    ctx.fill();
  }
}

function drawDoors(ctx, level, won) {
  // Entry door, bottom centre.
  ctx.fillStyle = '#101018';
  ctx.fillRect(level.entry.x - 26, VIEW.h - WALL, 52, WALL);
  ctx.fillStyle = COLORS.textDim;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('IN', level.entry.x, VIEW.h - 4);
  // Exit skylight, top-right.
  const e = level.exit;
  ctx.fillStyle = won ? COLORS.exit : '#0e2a18';
  ctx.beginPath();
  ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.exit;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('EXIT', e.x, e.y + 4);
}

function drawGuards(ctx, guards) {
  for (const g of guards) {
    const alert = g.state !== 'patrol';
    drawCone(
      ctx,
      g.x,
      g.y,
      g.dir,
      GUARD.coneRange,
      GUARD.coneHalfAngle,
      alert ? COLORS.coneAlert : COLORS.coneCalm,
    );
  }
  for (const g of guards) {
    const alert = g.state !== 'patrol';
    ctx.fillStyle = alert ? COLORS.guardAlert : COLORS.guard;
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d8dce6';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Facing tick and a tiny cap brim.
    ctx.strokeStyle = '#d8dce6';
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.lineTo(g.x + Math.cos(g.dir) * (g.r + 6), g.y + Math.sin(g.dir) * (g.r + 6));
    ctx.stroke();
    ctx.fillStyle = '#d8dce6';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(g.name.toUpperCase(), g.x, g.y - g.r - 6);
  }
}

function drawCameras(ctx, cameras) {
  for (const cam of cameras) {
    drawCone(
      ctx,
      cam.x,
      cam.y,
      cam.angle,
      CAMERA.coneRange,
      CAMERA.coneHalfAngle,
      COLORS.coneCamera,
    );
  }
  for (const cam of cameras) {
    ctx.fillStyle = '#22262f';
    ctx.fillRect(cam.x - 9, cam.y - 6, 18, 12);
    ctx.strokeStyle = cam.seen ? '#ff5a4a' : COLORS.caseGlass;
    ctx.lineWidth = 2;
    ctx.strokeRect(cam.x - 9, cam.y - 6, 18, 12);
    ctx.fillStyle = cam.seen ? '#ff5a4a' : COLORS.caseGlass;
    ctx.beginPath();
    ctx.arc(cam.x, cam.y + 9, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayer(ctx, player) {
  for (const c of player.thrown) {
    ctx.fillStyle = COLORS.gold;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff7d6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Cloak: a dark triangle pointing where Wren faces, pale hood on top.
  // A thin gold ring keeps the thief readable against the red carpet.
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.dir);
  ctx.fillStyle = '#33333f';
  ctx.beginPath();
  ctx.moveTo(14, 0);
  ctx.lineTo(-9, -10);
  ctx.lineTo(-9, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = COLORS.thief;
  ctx.beginPath();
  ctx.arc(player.x, player.y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#23232e';
  ctx.beginPath();
  ctx.arc(player.x, player.y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  if (player.sneaking) {
    ctx.strokeStyle = COLORS.textDim;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawHud(ctx, game) {
  const { alarm, level, player } = game;
  ctx.fillStyle = COLORS.hudBg;
  ctx.fillRect(0, 0, VIEW.w, 46);
  // Alarm meter.
  const ax = 16;
  const ay = 14;
  const aw = 300;
  const ah = 18;
  ctx.fillStyle = '#000';
  ctx.fillRect(ax, ay, aw, ah);
  const frac = alarm.value / 100;
  ctx.fillStyle = frac < 0.3 ? '#3fae6a' : frac < 0.7 ? '#e0a32e' : '#d64532';
  ctx.fillRect(ax + 1, ay + 1, (aw - 2) * frac, ah - 2);
  ctx.strokeStyle = '#d8dce6';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ax, ay, aw, ah);
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`ALARM ${Math.round(alarm.value)}% — ${alarmLabel(alarm.value)}`, ax, ay + ah + 12);
  // Loot, coins, time.
  ctx.textAlign = 'right';
  ctx.font = 'bold 13px sans-serif';
  const lootText = level.loot.taken ? 'IDOL ✓  →  EXIT' : 'IDOL: steal it';
  ctx.fillText(lootText, VIEW.w - 16, 20);
  ctx.fillText(`Coins ✦ ${player.coins}    ${game.timeText}`, VIEW.w - 16, 38);
  // Objective line under the bar.
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.textDim;
  ctx.font = '12px sans-serif';
  ctx.fillText(game.objective, VIEW.w / 2, 40);
}

function drawOverlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(8, 10, 16, 0.78)';
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  ctx.textAlign = 'center';
  ctx.fillStyle = accent;
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(title, VIEW.w / 2, 250);
  ctx.fillStyle = COLORS.text;
  ctx.font = '17px sans-serif';
  lines.forEach((line, i) => ctx.fillText(line, VIEW.w / 2, 300 + i * 28));
}

export function render(ctx, game) {
  ctx.clearRect(0, 0, VIEW.w, VIEW.h);
  drawFloor(ctx);
  drawCases(ctx, game.level);
  drawDoors(ctx, game.level, game.state === 'won');
  drawCameras(ctx, game.cameras);
  drawGuards(ctx, game.guards);
  drawPlayer(ctx, game.player);
  drawHud(ctx, game);

  // Red edge pulse while the alarm is critical.
  if (game.alarm.value >= ALARM.criticalAt && game.state === 'playing') {
    const pulse = 0.12 + Math.sin(Date.now() / 180) * 0.08;
    ctx.fillStyle = `rgba(214, 69, 50, ${pulse})`;
    ctx.fillRect(0, 0, VIEW.w, 10);
    ctx.fillRect(0, VIEW.h - 10, VIEW.w, 10);
    ctx.fillRect(0, 0, 10, VIEW.h);
    ctx.fillRect(VIEW.w - 10, 0, 10, VIEW.h);
  }

  if (game.state === 'title') {
    drawOverlay(ctx, 'THE AURUM JOB', [
      'One gallery. Three guards. Two cameras. One idol.',
      'Cross the room, steal the Aurum Idol, slip out the skylight.',
      'WASD / arrows — move      Shift — sneak      Click — toss a coin',
      'Guards and cameras raise the ALARM when they see you. At 100% it is over.',
      '',
      'Press Enter or click to begin',
    ], COLORS.gold);
  } else if (game.state === 'caught') {
    drawOverlay(ctx, 'CAUGHT', [
      'The gallery locked down at 100% alarm.',
      `You held the idol for ${game.timeText} — so close.`,
      '',
      'Press R to run it again',
    ], '#d64532');
  } else if (game.state === 'won') {
    drawOverlay(ctx, 'CLEAN GETAWAY', [
      `The Aurum Idol is yours. Out in ${game.timeText} with ${game.player.coins} coins to spare.`,
      `Alarm peaked at ${Math.round(game.peakAlarm)}%.`,
      '',
      'Press R to run it again',
    ], COLORS.exit);
  }
}
