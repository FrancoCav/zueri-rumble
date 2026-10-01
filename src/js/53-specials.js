
// ---- specials: one behaviour per type, all usable on the ground and in the air ----
function stepSpecial(f, o) {
  const m = f.move, t = f.t, S = m.s, A = m.a, active = t > S && t <= S + A;
  const near = (rad) => Math.hypot(o.x - f.x, o.y - f.y) <= rad && canHit(o);
  m.float = false;
  switch (m.type) {
    case 'beam':
      if (!f.ground && t <= S + A) { m.float = true; f.vy = 0; f.vx *= 0.8; }
      if (active) { tryHit(f, o, m); if (t % 3 === 0) fx.shake = Math.max(fx.shake, 2); }
      break;
    case 'wheelie': if (active) { f.vx = m.vx * f.face; tryHit(f, o, m); if (t % 4 === 0 && f.ground) emit('dust', f.x - f.face * 12, f.y); } break;
    case 'speed': case 'rage': if (t >= S && !f.fired) { f.fired = true; f.buff[m.buff] = m.dur; emit(m.type === 'rage' ? 'fire' : 'flash', f.x, f.y + 40); } break;
    case 'kopfnuss': case 'drain': case 'suplex':
      if (t > S - 5 && t <= S + A) f.vx = m.lunge * f.face;
      if (active) tryHit(f, o, m);
      if (m.type === 'kopfnuss' && t > S + A + m.r) {
        f.state = 'out'; f.t = 0; f.outT = m.out; f.move = null; if (f.weapon && f.weapon.ammo <= 0) f.weapon = null;
        return;
      }
      break;
    case 'psycho':
      if (t >= S && !f.fired) {
        f.fired = true; f.grabbed = near(m.range) ? o : null;
        if (f.grabbed) { o.state = 'lifted'; o.t = 0; o.move = null; o.vx = 0; o.vy = 0; leaveGround(o); f.liftY = o.y; }
      }
      if (f.grabbed && t < S + A) { o.y = f.liftY + Math.round(Math.sin((t - S) / A * 1.5708) * 56); if (t % 3 === 0) emit('psy', o.x + rnd(-10, 10), o.y + rnd(0, 40)); }
      if (f.grabbed && t >= S + A) { const g = f.grabbed; f.grabbed = null; g.state = 'jump'; applyHit(f, g, m, f.face); fx.shake = 8; }
      break;
    case 'scream':
      if (t >= S && !f.fired) {
        f.fired = true; emit('bubble', f.x, f.y + 64, 'MAAAAN!'); emit('boom', f.x, f.y + 30, 34);
        if (near(m.radius)) applyHit(f, o, m, o.x >= f.x ? 1 : -1);
        cratesNear(f.x, f.y + 25, m.radius);
      }
      break;
    case 'storm':
      if (active) { f.vx = m.vx * f.face; if (!f.ground) { m.float = true; f.vy = 0.6; } tryHit(f, o, m); }
      break;
    case 'horn': if (t > S && !f.fired) { f.fired = true; spawnProj(f, 'wave', m); fx.shake = 3; } break;
    case 'tentacle': if (active) tryHit(f, o, m); break;
    case 'explode':
      if (t >= S && !f.fired) { f.fired = true; explode(f.x, f.y + 24, m.radius, m, f, false); f.pct = Math.min(999, f.pct + m.self); }
      break;
    case 'quake':
      if (t <= 2 && f.ground) { f.vy = 5.4; leaveGround(f); }                 // hop, then slam
      if (!f.ground && t > 12) f.vy -= 0.5;
      if (f.ground && t > 12 && !f.fired) {
        f.fired = true; f.t = S; emit('boom', f.x, f.y + 4, 44);
        if (o.ground && Math.abs(o.x - f.x) <= m.range && Math.abs(o.y - f.y) < 30 && canHit(o)) applyHit(f, o, m, o.x >= f.x ? 1 : -1);
        cratesNear(f.x, f.y, m.range);
      }
      if (!f.fired) { if (t > 160) endAttack(f); return; }                    // still falling
      break;
    case 'divebomb':
      if (t <= S) { m.float = true; f.vy = 4.2; f.vx = 0; leaveGround(f); }
      else if (!f.fired) {
        f.vx = 4.6 * f.face; f.vy = -5; tryHit(f, o, m);
        if (f.ground) { f.fired = true; f.t = S + A; f.vx = 0; emit('dust', f.x, f.y); } else if (t > S + A) f.fired = true;
      }
      break;
    case 'bombs':
      if (t <= S) { m.float = true; f.vy = 4.6; f.vx = 0; leaveGround(f); }
      else if (t <= S + A) { m.float = true; f.vy = 0; f.vx = 1.6 * f.face; if ((t - S) % 16 === 1 && t - S < 48) spawnProj(f, 'bomb', m); }
      break;
  }
  if (t > S + A + m.r) endAttack(f);
}
