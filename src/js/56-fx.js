
// ---- effects. emit() plays an effect locally and queues it for an online guest ----
const fx = { sparks: [], texts: [], rays: [], booms: [], shake: 0, bubble: null, banner: null, flashT: 0 };
let fxq = [];
function emit(kind, x, y, a, b) { fxq.push([kind, Math.round(x), Math.round(y), a === undefined ? 0 : a, b === undefined ? 0 : b]); playFx(kind, x, y, a, b); }
function spark(x, y, kind, n) { for (let k = 0; k < n; k++) fx.sparks.push({ x, y, vx: rnd(-2.5, 2.5), vy: rnd(-1, 3.5), t: 0, life: kind === 'dust' ? 18 : 26, kind }); }
function playFx(kind, x, y, a, b) {
  switch (kind) {
    case 'hit': spark(x, y, 'hit', 8); fx.texts.push({ x, y: y + 28, s: a + '%', t: 0, col: '#fff' }); fx.shake = Math.max(fx.shake, b ? 7 : 3); sfx.hit(!!b); break;
    case 'block': spark(x, y, 'block', 6); sfx.block(); break;
    case 'break': spark(x, y, 'flash', 16); fx.bubble = { x, y: y + 40, text: 'SCHILD WEG!', t: 50 }; sfx.boom(); break;
    case 'dust': spark(x, y + 2, 'dust', 5); break;
    case 'jump': spark(x, y + 2, 'dust', 3); sfx.jump(); break;
    case 'whoosh': sfx.whoosh(); break;
    case 'special': fx.banner = { text: String(a), t: 70, side: b | 0 }; sfx.special(); break;
    case 'fire': spark(x, y, 'fire', 14); break;
    case 'flash': spark(x, y, 'flash', 12); break;
    case 'psy': spark(x, y, 'psy', 2); break;
    case 'bubble': fx.bubble = { x, y, text: String(a), t: 60 }; break;
    case 'boom': fx.booms.push({ x, y, r: +a || 40, t: 0 }); spark(x, y, 'fire', 22); fx.shake = Math.max(fx.shake, 9); fx.flashT = 3; sfx.boom(); break;
    case 'laser': fx.rays.push({ x, y, dir: a < 0 ? -1 : 1, t: 0 }); sfx.laser(); break;
    case 'shot': spark(x, y, 'flash', 10); sfx.boom(); break;
    case 'crate': spark(x, y, 'dust', 10); sfx.crate(); break;
    case 'pickup': fx.texts.push({ x, y, s: String(a), t: 0, col: '#46e08a' }); sfx.item(); break;
    case 'ko': fx.booms.push({ x, y, r: 90, t: 0, ko: 1 }); fx.shake = 12; fx.flashT = 5; sfx.ko(); break;
    case 'banner': fx.banner = { text: String(a), t: b || 80, side: 2 }; break;
    case 'round': sfx.round(); break;
  }
}
function resetFx() { fx.sparks.length = 0; fx.texts.length = 0; fx.rays.length = 0; fx.booms.length = 0; fx.shake = 0; fx.bubble = null; fx.banner = null; fx.flashT = 0; }
function stepFx() {
  for (const s of fx.sparks) { s.t++; s.x += s.vx; s.vy -= 0.15; s.y += s.vy; }
  fx.sparks = fx.sparks.filter((s) => s.t < s.life);
  for (const d of fx.texts) { d.t++; d.y += 0.5; }
  fx.texts = fx.texts.filter((d) => d.t < 46);
  for (const r of fx.rays) r.t++;
  fx.rays = fx.rays.filter((r) => r.t < 7);
  for (const b of fx.booms) b.t++;
  fx.booms = fx.booms.filter((b) => b.t < 16);
  if (fx.shake > 0) fx.shake -= 0.5;
  if (fx.flashT > 0) fx.flashT--;
  if (fx.bubble && --fx.bubble.t <= 0) fx.bubble = null;
  if (fx.banner && --fx.banner.t <= 0) fx.banner = null;
}
const SPARK_COL = { hit: ['#fff', '#ffe14d', '#ff9f1c'], block: ['#9ec2ff', '#fff'], dust: ['#d9d2c2', '#a39c8c'], fire: ['#ff3d00', '#ffb300', '#fff'], flash: ['#fff', '#ffe14d'], psy: ['#b56cff', '#fff'] };
function drawFx(t) {
  for (const b of fx.booms) {
    const p = b.t / 16, r = Math.round(b.r * (0.35 + p * 0.65));
    if (b.ko) { for (let k = 0; k < 10; k++) { const a = k * 0.6283; for (let d = r * 0.3; d < r; d += 6) R(b.x + Math.cos(a) * d - 2, GY - b.y - Math.sin(a) * d - 2, 4, 4, k % 2 ? '#ffe14d' : '#fff'); } }
    else circ(b.x, GY - b.y, r, p < 0.3 ? '#fff' : p < 0.6 ? '#ffb300' : 'rgba(255,61,0,.45)');
  }
  for (const r of fx.rays) { const x = r.dir > 0 ? r.x : 0, w = r.dir > 0 ? VW - r.x : r.x; R(x, GY - r.y - 2, w, 4, r.t % 2 ? '#ff4040' : '#ffb3b3'); R(x, GY - r.y - 1, w, 2, '#fff'); }
  for (const s of fx.sparks) { const c = SPARK_COL[s.kind] || SPARK_COL.hit, z = s.kind === 'fire' ? 3 : 2; R(s.x, GY - s.y, z, z, c[s.t % c.length]); }
  for (const d of fx.texts) { txt(d.s, d.x + 1, GY - d.y + 1, 8, '#000', 'center'); txt(d.s, d.x, GY - d.y, 8, d.t % 4 < 2 ? d.col : '#ffe14d', 'center'); }
  if (fx.bubble) { const X = Math.round(fx.bubble.x), Y = GY - fx.bubble.y, w = fx.bubble.text.length * 8 + 12; R(X - w / 2, Y - 14, w, 18, '#fff'); R(X - w / 2 + 2, Y - 12, w - 4, 14, '#111'); R(X - 3, Y + 4, 6, 4, '#fff'); txt(fx.bubble.text, X, Y - 1, 8, '#ffe14d', 'center'); }
  if (fx.flashT > 0) { ctx.fillStyle = 'rgba(255,255,255,' + (fx.flashT / 8) + ')'; ctx.fillRect(0, 0, VW, VH); }
}
