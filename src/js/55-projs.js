
// ---- projectiles and explosions (world coordinates, y up) ----
const projs = [];
function spawnProj(f, type, m) {
  const p = { type, owner: f, x: f.x + f.face * 16, y: f.y + 30, vx: f.face * 2.6, vy: 0, w: 10, h: 10, t: 0, life: 150,
    m: { d: m.d, bk: m.bk, kg: m.kg, ang: m.ang, sp: m.sp, remote: true }, col: f.def.look.aura || f.def.look.top2 || f.def.look.c2 || '#fff' };
  if (type === 'wave') { p.w = 28; p.h = 44; p.y = f.y + 26; p.vx = f.face * 2.4; p.life = 280; }
  else if (type === 'bomb') { p.x = f.x; p.y = f.y - 2; p.vx = f.face * 0.8; p.grav = 0.2; p.w = 9; p.h = 9; p.life = 300; p.boom = 34; }
  else if (type === 'shuriken') { p.vx = f.face * 6; p.w = 9; p.h = 9; p.life = 110; }
  else if (type === 'grenade') { p.vx = f.face * 3.2 + f.vx * 0.5; p.vy = 4.4; p.grav = 0.22; p.bounce = true; p.life = 85; p.boom = 46; p.w = 8; p.h = 8; }
  else if (type === 'rocket') { p.vx = f.face * 4.4; p.y = f.y + 32; p.w = 14; p.h = 8; p.life = 140; p.boom = 54; }
  projs.push(p);
}
function explode(x, y, rad, m, owner, hurtOwner) {
  emit('boom', x, y, rad);
  for (const f of [match.a, match.b]) {
    if (f === owner && !hurtOwner) continue;
    const dx = f.x - x;
    if (Math.hypot(dx, f.y + 25 - y) > rad + 10 || !canHit(f)) continue;
    const self = f === owner;
    if (self && Math.hypot(dx, f.y + 25 - y) > rad * 0.6) continue;          // your own blast only hurts up close
    applyHit(self ? null : owner, f, Object.assign({}, m, { remote: true, d: self ? m.d * 0.5 : m.d }), dx >= 0 ? 1 : -1);
  }
  cratesNear(x, y, rad + 10);
}
function stepProjs() {
  const M = match;
  for (const p of projs) {
    p.t++; const y0 = p.y; p.x += p.vx; if (p.grav) { p.vy -= p.grav; p.y += p.vy; }
    const o = p.owner === M.a ? M.b : M.a, box = { x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h };
    let blow = false;
    if (p.type !== 'wave') for (const pl of M.stage.plats) {
      if (p.x < pl.cx || p.x > pl.cx + pl.w) continue;
      if (p.grav && p.vy < 0 && y0 >= pl.cy && p.y <= pl.cy) { p.y = pl.cy; if (p.bounce) { p.vy = -p.vy * 0.45; p.vx *= 0.7; } else blow = true; }
      else if (pl.solid && p.y < pl.cy - 2) blow = true;                       // ran into the side of a ground block
    }
    if (canHit(o) && overlap(box, o.hurt())) {
      if (p.boom) blow = true;
      else if (p.type === 'wave') { if (!p.done) { p.done = true; applyHit(p.owner, o, p.m, p.vx >= 0 ? 1 : -1); } }
      else { applyHit(p.owner, o, p.m, p.vx >= 0 ? 1 : -1); p.dead = true; }
    }
    hitCrates(box);
    if (blow || p.t >= p.life) { if (p.boom) explode(p.x, p.y, p.boom, p.m, p.owner, true); p.dead = true; }
    if (p.x < BLAST.l || p.x > BLAST.r || p.y < BLAST.bottom) p.dead = true;
  }
  for (let i = projs.length - 1; i >= 0; i--) if (projs[i].dead) projs.splice(i, 1);
}
