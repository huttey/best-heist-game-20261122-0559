// Screenshot staging: ?shot=title|play|chase|win freezes one honest moment
// of the game so the screenshots are real renders, not mock-ups.
// title — the title screen. play — mid-heist, thief crossing the room with
// guards, cameras, loot and the alarm meter all in one frame. chase — a guard
// on Wren's heels, alarm critical. win — idol taken, thief at the exit.

export function readShot() {
  const q = new URLSearchParams(window.location.search);
  return q.get('shot');
}

export function stageShot(game, shot) {
  if (shot === 'play') {
    game.state = 'playing';
    game.player.x = 480;
    game.player.y = 430;
    game.player.dir = -Math.PI / 2;
    game.alarm.value = 34;
    game.elapsed = 42;
    game.timeText = '0:42';
    // Guards mid-patrol, cones sweeping across the room.
    game.guards[0].x = 420;
    game.guards[0].y = 300;
    game.guards[0].dir = Math.PI;
    game.guards[1].x = 250;
    game.guards[1].y = 300;
    game.guards[1].dir = Math.PI / 2;
    game.guards[2].x = 710;
    game.guards[2].y = 330;
    game.guards[2].dir = -Math.PI / 2;
    game.cameras[0].angle = Math.PI / 2 + 0.5;
    game.cameras[1].angle = Math.PI / 2 - 0.5;
    game.frozen = true;
  } else if (shot === 'chase') {
    game.state = 'playing';
    game.player.x = 430;
    game.player.y = 380;
    game.player.dir = Math.PI;
    game.player.sneaking = true;
    game.alarm.value = 82;
    game.elapsed = 75;
    game.timeText = '1:15';
    game.guards[0].x = 500;
    game.guards[0].y = 360;
    game.guards[0].dir = Math.atan2(380 - 360, 430 - 500);
    game.guards[0].state = 'chase';
    game.guards[1].x = 250;
    game.guards[1].y = 200;
    game.guards[1].dir = Math.PI / 2;
    game.guards[2].x = 710;
    game.guards[2].y = 480;
    game.guards[2].dir = -Math.PI / 2;
    game.cameras[0].angle = Math.PI / 2 + 0.7;
    game.cameras[1].angle = Math.PI / 2 - 0.6;
    game.frozen = true;
  } else if (shot === 'win') {
    game.state = 'won';
    game.level.loot.taken = true;
    game.player.x = 906;
    game.player.y = 52;
    game.alarm.value = 41;
    game.peakAlarm = 58;
    game.elapsed = 96.4;
    game.timeText = '1:36';
    game.objective = 'Idol taken — get out through the skylight, top-right!';
    game.guards[0].x = 300;
    game.guards[0].y = 300;
    game.guards[0].dir = 0;
    game.guards[1].x = 250;
    game.guards[1].y = 480;
    game.guards[1].dir = -Math.PI / 2;
    game.guards[2].x = 710;
    game.guards[2].y = 200;
    game.guards[2].dir = Math.PI / 2;
    game.frozen = true;
  } else {
    // title (and anything unknown): leave the title screen as it is.
    game.frozen = true;
  }
}
