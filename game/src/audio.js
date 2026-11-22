// Sound, synthesized live with WebAudio — no audio files, no network.
// A soft tick while seen, a chime for the idol, a low sting for the catch.

export function createAudio() {
  return { ctx: null, muted: false };
}

function ensureCtx(a) {
  if (!a.ctx) {
    try {
      a.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      a.ctx = null;
    }
  }
  if (a.ctx && a.ctx.state === 'suspended') a.ctx.resume();
  return a.ctx;
}

function tone(a, freq, dur, type, vol, when = 0) {
  if (a.muted) return;
  const ctx = ensureCtx(a);
  if (!ctx) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}

export function playCoin(a) {
  tone(a, 1320, 0.09, 'sine', 0.12);
  tone(a, 1760, 0.12, 'sine', 0.1, 0.07);
}

export function playPickup(a) {
  tone(a, 660, 0.12, 'triangle', 0.16);
  tone(a, 990, 0.16, 'triangle', 0.16, 0.1);
  tone(a, 1320, 0.22, 'triangle', 0.14, 0.2);
}

export function playSeen(a) {
  tone(a, 220, 0.14, 'square', 0.07);
}

export function playCaught(a) {
  tone(a, 196, 0.4, 'sawtooth', 0.14);
  tone(a, 147, 0.55, 'sawtooth', 0.14, 0.18);
}

export function playWin(a) {
  tone(a, 523, 0.16, 'triangle', 0.16);
  tone(a, 659, 0.16, 'triangle', 0.16, 0.14);
  tone(a, 784, 0.16, 'triangle', 0.16, 0.28);
  tone(a, 1046, 0.34, 'triangle', 0.16, 0.42);
}

export function toggleMute(a) {
  a.muted = !a.muted;
  return a.muted;
}
