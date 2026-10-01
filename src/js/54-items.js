
// ---- items: powerups float down, crates drop and release a weapon when anything hits them ----
const items = [];
function spawnItem() {
  const ps = match.stage.plats.filter((p) => !p.mv || !p.mv.lin), p = pick(ps), crate = Math.random() < 0.5;
  items.push({ kind: crate ? 'crate' : 'power', id: pick(Object.keys(crate ? WEAPONS : POWERUPS)), x: clamp(p.cx + rnd(14, p.w - 14), 24, VW - 24), y: 340, vy: 0, t: 0, ground: null, ammo: 0 });
}
function takePower(f, id) {
  const P = POWERUPS[id];
  if (id === 'heart') f.pct = Math.max(0, f.pct - 40); else if (id === 'bolt') f.meter = 100; else f.buff[P.buff] = P.dur;
  emit('pickup', f.x, f.y + 58, P.name);
}
function breakCrate(it) { it.kind = 'weapon'; it.ammo = WEAPONS[it.id].ammo; it.t = 0; emit('crate', it.x, it.y + 8); }
function hitCrates(r) { for (const it of items) if (it.kind === 'crate' && overlap(r, { x: it.x - 11, y: it.y, w: 22, h: 44 })) breakCrate(it); }
function cratesNear(x, y, rad) { for (const it of items) if (it.kind === 'crate' && Math.hypot(it.x - x, it.y + 9 - y) <= rad) breakCrate(it); }
function dropWeapon(f) { items.push({ kind: 'weapon', id: f.weapon.id, ammo: f.weapon.ammo, x: f.x, y: f.y + 24, vy: 3, t: 0, ground: null }); f.weapon = null; }
function stepItems() {
  const M = match;
  if (--M.itemT <= 0) { M.itemT = 330 + Math.floor(rnd(0, 300)); if (items.length < 4) spawnItem(); }
  for (const it of items) {
    it.t++;
    if (!it.ground) {
      const slow = it.kind === 'power';
      it.vy = Math.max(it.vy - (slow ? 0.03 : 0.2), slow ? -1.1 : -6);
      const y0 = it.y; it.y += it.vy;
      for (const p of M.stage.plats) if (it.x >= p.cx && it.x <= p.cx + p.w && y0 >= p.cy && it.y <= p.cy) { it.ground = p; it.y = p.cy; it.vy = 0; if (!slow) emit('dust', it.x, it.y); break; }
      if (it.y < BLAST.bottom) it.dead = true;
    } else {
      const p = it.ground; it.x += p.dx; it.y = p.cy;
      if (it.x < p.cx || it.x > p.cx + p.w) it.ground = null;
    }
    if (it.kind !== 'crate' && it.t > 900) it.dead = true;
    if (it.kind === 'crate' || it.dead) continue;
    for (const f of [M.a, M.b]) {
      if (f.dead > 0 || f.state === 'lifted' || f.state === 'out' || f.state === 'down' || Math.abs(f.x - it.x) > 16 || f.y - it.y > 14 || f.y - it.y < -46) continue;
      if (it.kind === 'power') { takePower(f, it.id); it.dead = true; break; }
      if (!f.weapon && f.state !== 'hit' && it.t > 20) { f.weapon = { id: it.id, ammo: it.ammo }; it.dead = true; emit('pickup', f.x, f.y + 58, WEAPONS[it.id].name); break; }
    }
  }
  for (let i = items.length - 1; i >= 0; i--) if (items[i].dead) items.splice(i, 1);
}
