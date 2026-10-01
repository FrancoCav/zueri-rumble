const $ = (id) => document.getElementById(id);
const VW = 640, VH = 360, GY = 300;                   // virtual screen; GY = screen y of world height 0
const BLAST = { l: -60, r: VW + 60, top: 330, bottom: -84 };   // leave this box and you lose a stock
const GRAV = 0.26, JUMP_V = 7.2, JUMP2_V = 6.4;
const canvas = $('game'); let ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* no storage */ } },
};

// ---- pixel helpers: used inside a transform whose origin is the fighter's feet, y up, x = facing ----
function px(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
function limb(x0, y0, x1, y1, w, c) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, o = Math.floor(w / 2);
  let err = dx - dy, x = x0, y = y0; ctx.fillStyle = c;
  for (let n = 0; n < 700; n++) {
    ctx.fillRect(x - o, y - o, w, w);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err; if (e2 > -dy) { err -= dy; x += sx; } if (e2 < dx) { err += dx; y += sy; }
  }
}
function circ(cx, cy, r, c) {
  ctx.fillStyle = c; cx = Math.round(cx); cy = Math.round(cy);
  for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y)); ctx.fillRect(cx - w, cy + y, 2 * w + 1, 1); }
}
// ---- screen-space helpers ----
function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function txt(s, x, y, size, c, align) { ctx.font = size + 'px "Press Start 2P", monospace'; ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = c; ctx.fillText(s, Math.round(x), Math.round(y)); }

// ---- input: keyboard for one or two players, touch pad for player 1 ----
const P1K = { KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down', KeyF: 'punch', KeyG: 'kick', KeyH: 'special', KeyR: 'block' };
const P1X = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', KeyJ: 'punch', KeyK: 'kick', KeyL: 'special', KeyI: 'block', Space: 'up' };
const P2K = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', KeyK: 'punch', KeyL: 'kick', Semicolon: 'special', Quote: 'special', KeyO: 'block', Numpad1: 'punch', Numpad2: 'kick', Numpad3: 'special', Numpad0: 'block' };
const held = { p1: {}, p2: {} }, pressed = { p1: {}, p2: {} };
let duel = false;
function keyAction(code) {
  if (P1K[code]) return ['p1', P1K[code]];
  if (duel) { if (P2K[code]) return ['p2', P2K[code]]; } else if (P1X[code]) return ['p1', P1X[code]];
  return null;
}
function setInput(p, a, down) { if (down && !held[p][a]) pressed[p][a] = true; held[p][a] = down; }
document.addEventListener('keydown', (e) => {
  if (e.repeat) return; const r = keyAction(e.code);
  if (r) { setInput(r[0], r[1], true); if (app.screen === 'fight') e.preventDefault(); }
});
document.addEventListener('keyup', (e) => { const r = keyAction(e.code); if (r) setInput(r[0], r[1], false); });
window.addEventListener('blur', () => { held.p1 = {}; held.p2 = {}; });
const pad = $('pad');
for (const b of pad.querySelectorAll('button')) {
  const a = b.dataset.a;
  const on = (e) => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } b.classList.add('on'); setInput('p1', a, true); };
  const off = () => { b.classList.remove('on'); setInput('p1', a, false); };
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('lostpointercapture', off);
  b.addEventListener('contextmenu', (e) => e.preventDefault());
}
