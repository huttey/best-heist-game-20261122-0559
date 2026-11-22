// Keyboard and mouse input. WASD or arrows to move, Shift to sneak,
// R to restart, M to mute. Click (or E) throws a coin toward the mouse.

export function createInput() {
  return {
    up: false,
    down: false,
    left: false,
    right: false,
    sneak: false,
    mouseX: 0,
    mouseY: 0,
    clicked: false,
    // One-shot actions the game loop consumes each frame.
    pressedRestart: false,
    pressedMute: false,
    pressedStart: false,
    pressedCoin: false,
  };
}

const KEYMAP = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'sneak',
  ShiftRight: 'sneak',
};

export function bindInput(input, canvas) {
  window.addEventListener('keydown', (e) => {
    if (KEYMAP[e.code] !== undefined) {
      input[KEYMAP[e.code]] = true;
      e.preventDefault();
    }
    if (e.code === 'KeyR') input.pressedRestart = true;
    if (e.code === 'KeyM') input.pressedMute = true;
    if (e.code === 'Enter' || e.code === 'Space') input.pressedStart = true;
    if (e.code === 'KeyE') input.pressedCoin = true;
  });
  window.addEventListener('keyup', (e) => {
    if (KEYMAP[e.code] !== undefined) input[KEYMAP[e.code]] = false;
  });
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    input.mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
  });
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    input.mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    input.clicked = true;
    input.pressedCoin = true;
  });
  // Keep the page from scrolling when the thief walks with arrow keys.
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  });
}

export function consumeOneShots(input) {
  const out = {
    restart: input.pressedRestart,
    mute: input.pressedMute,
    start: input.pressedStart,
    coin: input.pressedCoin,
  };
  input.pressedRestart = false;
  input.pressedMute = false;
  input.pressedStart = false;
  input.pressedCoin = false;
  input.clicked = false;
  return out;
}
