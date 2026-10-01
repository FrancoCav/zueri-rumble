
// ---- rendering the fight ----
function drawBeam(f, t) {
  const m = f.move, y = GY - f.y - 35, x0 = f.x + f.face * 16;
  if (f.t <= m.s) { circ(x0 - f.face * 10, y + 6, 2 + Math.floor(f.t / 4), t % 4 < 2 ? '#7fd4ff' : '#fff'); return; }
  if (f.t > m.s + m.a) return;
  const x = f.face > 0 ? x0 : 0, w = Math.max(1, f.face > 0 ? VW - x0 : x0);
  R(x, y - 9, w, 18, t % 4 < 2 ? '#7fd4ff' : '#3fb8ff'); R(x, y - 5, w, 10, '#ffffff');
  for (let k = 0; k < 12; k++) R(x + ((k * 53 + t * 7) % w), y - 11 + (k % 2) * 20, 6, 2, '#bfe9ff');
  circ(x0, y, 11, 'rgba(127,212,255,.6)');
}
function powerIcon(id, X, Y) {
  switch (id) {
    case 'heart': R(X - 3, Y - 2, 2, 3, '#fff'); R(X + 1, Y - 2, 2, 3, '#fff'); R(X - 2, Y, 4, 3, '#fff'); R(X - 1, Y + 3, 2, 1, '#fff'); break;
    case 'power': R(X - 1, Y - 4, 2, 6, '#fff'); R(X - 3, Y + 1, 6, 1, '#fff'); R(X - 1, Y + 2, 2, 2, '#fff'); break;
    case 'guard': R(X - 3, Y - 3, 6, 4, '#fff'); R(X - 2, Y + 1, 4, 2, '#fff'); R(X - 1, Y + 3, 2, 1, '#fff'); break;
    case 'turbo': R(X - 3, Y - 2, 3, 1, '#fff'); R(X - 1, Y, 4, 1, '#fff'); R(X - 3, Y + 2, 3, 1, '#fff'); break;
    case 'bolt': R(X, Y - 4, 2, 3, '#111'); R(X - 2, Y - 1, 4, 2, '#111'); R(X - 2, Y + 1, 2, 3, '#111'); break;
  }
}
function drawItems(t) {
  for (const it of items) {
    const X = Math.round(it.x), Y = GY - Math.round(it.y);
    if (it.kind !== 'crate' && it.t > 720 && Math.floor(t / 4) % 2) continue;       // about to vanish: blink
    if (it.kind === 'crate') {
      R(X - 9, Y - 18, 18, 18, '#a5713a'); R(X - 9, Y - 18, 18, 2, '#6b4a2b'); R(X - 9, Y - 2, 18, 2, '#6b4a2b'); R(X - 9, Y - 18, 2, 18, '#6b4a2b'); R(X + 7, Y - 18, 2, 18, '#6b4a2b');
      txt('?', X + 1, Y - 5, 8, '#ffe14d', 'center');
    } else if (it.kind === 'weapon') {
      ctx.setTransform(1, 0, 0, -1, X, Y - 4 - (Math.floor(t / 20) % 2)); heldWeapon(it.id, -6, 0); ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (POWERUPS[it.id]) {
      const b = Y - 12 - Math.round(Math.sin(t * 0.1 + X) * 2);
      if (!it.ground) { R(X - 9, b - 17, 18, 3, '#fff'); R(X - 7, b - 14, 1, 7, '#ddd'); R(X + 6, b - 14, 1, 7, '#ddd'); }
      circ(X, b, 7, '#111'); circ(X, b, 6, POWERUPS[it.id].col); powerIcon(it.id, X, b);
    }
  }
}
function drawProjs(t) {
  for (const p of projs) {
    const X = Math.round(p.x), Y = GY - Math.round(p.y), fwd = p.vx > 0;
    if (p.type === 'orb') { circ(X, Y, 4 + (t % 6 < 3 ? 1 : 0), p.col); circ(X, Y, 2, '#fff'); }
    else if (p.type === 'wave') { for (let k = 0; k < 3; k++) { const r = 8 + k * 6 + (t % 6); R(X + (fwd ? r : -r - 2), Y - r - 6, 2, 2 * r + 12, k % 2 ? '#fff' : '#ffe14d'); } }
    else if (p.type === 'bomb') { circ(X, Y, 4, '#f4f4f4'); circ(X - 1, Y - 1, 2, '#c9cfe6'); }
    else if (p.type === 'shuriken') { R(X - 4, Y, 9, 1, '#e6edf5'); R(X, Y - 4, 1, 9, '#e6edf5'); const s = t % 4 < 2 ? 1 : -1; R(X - 3, Y - 3 * s, 2, 2, '#aab3bd'); R(X + 2, Y + 2 * s, 2, 2, '#aab3bd'); }
    else if (p.type === 'grenade') { circ(X, Y, 3, '#3c7a3c'); R(X - 1, Y - 5, 2, 2, p.t % 6 < 3 ? '#ff4040' : '#ccc'); }
    else if (p.type === 'rocket') { R(X - 7, Y - 3, 12, 6, '#8a929c'); R(fwd ? X + 5 : X - 10, Y - 2, 3, 4, '#c62828'); R(fwd ? X - 12 : X + 7, Y - 2, 5, 4, t % 4 < 2 ? '#ffb300' : '#ff3d00'); }
  }
}
function renderFight(t) {
  const M = match;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (fx.shake > 0) ctx.translate(Math.round(rnd(-fx.shake, fx.shake) / 2), Math.round(rnd(-fx.shake, fx.shake) / 2));
  M.stage.bg(M.t); drawPlats(M.stage); drawItems(t);
  for (const f of [M.a, M.b]) if (!f.dead && f.state === 'attack' && f.move && f.move.type === 'beam') drawBeam(f, t);
  drawFighter(M.a, t); drawFighter(M.b, t);
  drawProjs(t); drawFx(t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawHud(t);
}
const fake = (def, x, face, t, ground) => ({ def, state: 'idle', anim: t, t: 0, x, y: ground.cy, face, buff: {}, move: null, dead: 0, inv: 0, ground });
function renderTitle(t) {
  const k = Math.floor(t / 720), s = STAGES[k % STAGES.length];
  placePlats(s, t); s.bg(t); drawPlats(s);
  const g = s.plats[0], c = g.cx + g.w / 2;
  drawFighter(fake(FIGHTERS[k % 16], c - 50, 1, t, g), t); drawFighter(fake(FIGHTERS[(k * 7 + 3) % 16], c + 50, -1, t, g), t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
