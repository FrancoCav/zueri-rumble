
// ---- attacks ----
function startMove(f, idx) {
  let mv;
  if (idx === 'weapon') mv = Object.assign({ type: 'weapon', wid: f.weapon.id }, WEAPONS[f.weapon.id]);
  else { const m = f.def.moves[idx]; mv = Object.assign({ name: m[0], type: m[1] }, MV[m[1]]); }
  f.state = 'attack'; f.t = 0; f.move = mv; f.fired = false; f.hitDone = 0; f.nextHit = 0; f.crouch = !!mv.low && !!f.ground;
  if (mv.jump) { f.vx = mv.jump[0] * f.face; f.vy = f.ground ? mv.jump[1] : 2.2; leaveGround(f); mv.air = true; }
  emit('whoosh', f.x, f.y);
}
function startSpecial(f) {
  const sp = f.def.special, S = SP[sp[1]];
  f.meter -= S.cost; f.state = 'attack'; f.t = 0; f.fired = false; f.hitDone = 0; f.nextHit = 0; f.crouch = false; f.grabbed = null;
  f.move = Object.assign({ name: sp[0], type: sp[1], sp: true }, S);
  emit('special', f.x, f.y, sp[0], f.slot);
}
function stepAttack(f, o) {
  const m = f.move;
  if (m.sp) { stepSpecial(f, o); return; }
  if (f.buff.speed) f.t += 0.4;
  const t = f.t, S = m.s, A = m.a;
  if (m.vx && t > S && t <= S + A) f.vx = m.vx * f.face;
  if (t > S && !f.fired) {
    f.fired = true;
    if (m.proj) spawnProj(f, m.proj, m);
    if (m.type === 'weapon') f.weapon.ammo--;
    if (m.recoil) f.vx = -f.face * m.recoil;
    if (m.ray) emit('laser', f.x + f.face * 14, f.y + 31, f.face);
    if (m.wid === 'shotgun') emit('shot', f.x + f.face * 24, f.y + 28);
  }
  if (m.hb && t > S && t <= S + A) tryHit(f, o, m);
  if (t > S + A + (m.air ? 0 : m.r)) endAttack(f);
}
// ---- hits: damage in %, knockback grows with the victim's % ----
function rectOf(f, hb) { const w = hb[2] + (hb[2] < 200 ? f.def.st.reach * 2 : 0); return { x: f.face > 0 ? f.x + hb[0] : f.x - hb[0] - w, y: f.y + hb[1], w, h: hb[3] }; }
function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function canHit(o) { return !(o.inv > 0 || o.dead > 0 || o.state === 'lifted' || o.state === 'win'); }
function tryHit(f, o, m) {
  const r = rectOf(f, m.hb);
  hitCrates(r);
  if (f.hitDone >= (m.hits || 1) || f.t < f.nextHit) return;
  if (!canHit(o) || !overlap(r, o.hurt())) return;
  f.hitDone++; f.nextHit = f.t + 6;
  applyHit(f, o, m.finisher && f.hitDone >= m.hits ? Object.assign({}, m, m.finisher) : m, f.face);
}
// f = attacker (null for self-inflicted blasts), dirX = horizontal launch direction
function applyHit(f, o, m, dirX) {
  const atk = f ? f.def.st.pow * (f.buff.rage ? 1.5 : 1) * (f.buff.atk ? 1.5 : 1) : 1;
  let dmg = m.d * atk * (o.buff.def ? 0.5 : 1) * (o.buff.rage ? 1.15 : 1);
  if (m.wid === 'shotgun' && f) dmg *= clamp(1.25 - Math.abs(o.x - f.x) / 110, 0.4, 1.25);
  const hx = o.x, hy = o.y + 28;
  if (o.state === 'shield' && !m.grab) {
    o.shield -= dmg * 2.6; o.vx = dirX * 1.6; emit('block', hx, hy);
    if (f) f.meter = Math.min(100, f.meter + 2);
    if (o.shield <= 0) { o.shield = 35; o.state = 'stun'; o.t = 0; o.stunT = 110; emit('break', hx, hy); }
    return;
  }
  o.pct = Math.min(999, o.pct + dmg); o.meter = Math.min(100, o.meter + 4);
  if (f) { if (!m.sp) f.meter = Math.min(100, f.meter + 6); if (m.heal) f.pct = Math.max(0, f.pct - m.heal); }
  const kb = (m.bk + m.kg * o.pct / 100) / o.weight * (o.buff.def ? 0.7 : 1) * (f && f.buff.atk ? 1.15 : 1);
  const strong = kb > 6;
  emit('hit', hx, hy, Math.round(dmg), strong ? 1 : 0);
  const armoured = (o.buff.rage && kb < 5) || (o.state === 'attack' && o.move && o.move.armor && kb < 7);
  if (armoured && !m.grab) return;
  const a = m.ang * Math.PI / 180;
  o.vx = Math.cos(a) * kb * dirX; o.vy = Math.sin(a) * kb;
  if (o.ground) { if (kb >= 3 || o.vy < 0) { if (o.vy < 1.2) o.vy = Math.abs(o.vy) * 0.6 + 1.2; leaveGround(o); } else o.vy = 0; }
  if (o.grabbed) { o.grabbed.state = 'jump'; o.grabbed = null; }
  o.state = 'hit'; o.t = 0; o.move = null; o.crouch = false; o.bounced = false; o.tumble = kb > 4.2; o.launched = !o.ground;
  o.hitT = clamp(Math.round(8 + kb * 4.5), 10, 70) + (m.stun || 0);
  const fr = clamp(Math.round(2 + dmg / 3), 2, 9); o.freeze = fr; if (f && !m.remote) f.freeze = fr;      // hit stop gives blows weight
  if (f && m.type === 'kopfnuss' && kb > 9) f.skipOut = true;
  if (strong && o.weapon) dropWeapon(o);
}
function ko(f, by) {
  emit('ko', clamp(f.x, 16, VW - 16), clamp(f.y, -30, 300), f.slot);
  f.stocks--; f.dead = 80; f.weapon = null; f.buff = {}; f.move = null; f.grabbed = null; f.vx = 0; f.vy = 0; f.state = 'idle';
  if (by && !by.dead) { by.kos++; by.meter = Math.min(100, by.meter + 15); }
}
