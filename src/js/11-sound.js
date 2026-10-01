
// ---- sound: tiny synth, nothing loads from outside ----
let actx = null, soundOn = store.get('zr-sound', true) !== false;
function tone(type, f0, f1, dur, vol, noise) {
  if (!soundOn) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    actx = actx || new AC(); if (actx.state === 'suspended') actx.resume();
    const t0 = actx.currentTime, g = actx.createGain();
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); g.connect(actx.destination);
    if (noise) {
      const n = Math.floor(actx.sampleRate * dur), buf = actx.createBuffer(1, n, actx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const s = actx.createBufferSource(), fl = actx.createBiquadFilter(); s.buffer = buf; fl.type = 'lowpass';
      fl.frequency.setValueAtTime(f0, t0); fl.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      s.connect(fl); fl.connect(g); s.start(t0);
    } else {
      const o = actx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      o.connect(g); o.start(t0); o.stop(t0 + dur + 0.02);
    }
  } catch (e) { /* no audio */ }
}
const sfx = {
  hit: (strong) => tone(null, strong ? 900 : 1600, 200, strong ? 0.2 : 0.1, 0.5, true),
  block: () => tone('square', 300, 200, 0.08, 0.15),
  whoosh: () => tone(null, 2500, 600, 0.12, 0.14, true),
  special: () => { tone('sawtooth', 200, 800, 0.4, 0.22); setTimeout(() => tone('square', 400, 1200, 0.3, 0.18), 120); },
  ko: () => { tone('sawtooth', 500, 60, 0.7, 0.35); tone(null, 3000, 100, 0.5, 0.4, true); },
  sel: () => tone('square', 700, 900, 0.07, 0.15),
  jump: () => tone('triangle', 300, 600, 0.12, 0.08),
  round: () => tone('square', 500, 1000, 0.25, 0.2),
  boom: () => tone(null, 500, 50, 0.6, 0.6, true),
  item: () => { tone('square', 900, 1400, 0.08, 0.15); setTimeout(() => tone('square', 1400, 1900, 0.1, 0.15), 70); },
  crate: () => tone(null, 1200, 200, 0.18, 0.4, true),
  laser: () => tone('sawtooth', 1800, 300, 0.18, 0.18),
};
