
// ---- the computer opponent: decides every few frames, gets sharper with app.level ----
function specialUseful(f, o, type, S) {
  const adx = Math.abs(o.x - f.x), ady = Math.abs(o.y - f.y), dist = Math.hypot(o.x - f.x, o.y - f.y);
  switch (type) {
    case 'beam': case 'horn': return ady < 26 && adx < 420;
    case 'speed': case 'rage': return !f.buff[S.buff];
    case 'psycho': return dist < S.range;
    case 'scream': case 'explode': return dist < S.radius - 14;
    case 'quake': return !!o.ground && adx < S.range && ady < 26;
    case 'divebomb': case 'bombs': return adx < 190 && o.y <= f.y + 30;
    case 'tentacle': return adx < 66 && ady < 26;
    default: return adx < 80 && ady < 28;                 // lunges, grabs, wheelie, kick storm
  }
}
function cpuInput(f, o) {
  const ai = f.ai || (f.ai = { held: {}, pressed: {}, hold: 0 });
  ai.pressed = {};
  if (ai.hold-- > 0) return ai;
  const lvl = app.level; ai.hold = 7 + Math.floor(rnd(0, 6)) - Math.min(4, lvl);
  const H = {}, P = {}; ai.held = H; ai.pressed = P;
  const r = Math.random(), st = match.stage, plats = st.plats, mid = VW / 2;
  // 1. off stage with nothing below: head for the nearest platform
  if (!f.ground && !platBelow(st, f.x, f.y)) {
    let bx = mid, bd = 1e9;
    for (const p of plats) { if (p.mv && p.mv.lin) continue; const cx = clamp(f.x, p.cx + 12, p.cx + p.w - 12), d = Math.abs(cx - f.x) + Math.max(0, p.cy - f.y); if (d < bd) { bd = d; bx = cx; } }
    H[f.x < bx ? 'right' : 'left'] = true;
    if (f.vy < 1 && f.jumps < (f.launched ? 3 : 2)) P.up = true;
    ai.hold = 0; return ai;
  }
  // 2. target: the opponent, or an item worth grabbing
  let tx = o.dead ? mid : o.x, ty = o.dead ? 0 : o.y, item = null;
  for (const it of items) {
    if (it.kind === 'weapon' && f.weapon) continue;
    const d = Math.abs(it.x - f.x) + Math.abs(it.y - f.y);
    if (d < 170 && (!item || d < item.d)) item = { it, d };
  }
  const goItem = !!item && (o.dead > 0 || r < 0.45);
  if (goItem) { tx = item.it.x; ty = item.it.y; }
  const dx = tx - f.x, dy = ty - f.y, adx = Math.abs(dx), toward = dx > 0 ? 'right' : 'left', away = dx > 0 ? 'left' : 'right';
  // 3. change height
  if (dy > 34 && (f.ground || (f.jumps < 2 && f.vy < 0.5)) && r < 0.75) P.up = true;
  if (dy < -34 && f.ground && !f.ground.solid) H.down = true;
  // 4. fight
  if (!goItem && !o.dead) {
    const W = f.weapon ? WEAPONS[f.weapon.id] : null, ranged = !!W && (!!W.proj || !!W.ray || f.weapon.id === 'shotgun');
    const level = Math.abs(o.y - f.y) < 26, facing = (o.x - f.x) * f.face > 0, type = f.def.special[1], S = SP[type];
    if (f.meter >= S.cost && r < 0.2 + lvl * 0.08 && specialUseful(f, o, type, S)) { if (!facing) H[toward] = true; else P.special = true; return ai; }
    if (o.state === 'attack' && adx < 64 && level && f.ground && r < 0.12 + lvl * 0.12) { H.block = true; ai.hold = 14; return ai; }
    if (ranged && level && adx > 44 && adx < 420) { if (!facing) H[toward] = true; else P.punch = true; return ai; }
    if (adx < (W && !ranged ? 50 : 38) + f.def.st.reach * 2 && Math.abs(dy) < 34) {
      if (!facing) { H[toward] = true; return ai; }
      if (r < 0.36) P.punch = true; else if (r < 0.62) P.kick = true; else if (r < 0.75) { H.down = true; P.punch = true; } else if (r < 0.88) { H.down = true; P.kick = true; } else H[away] = true;
      return ai;
    }
  } else if (item && item.it.kind === 'crate' && adx < 30 && Math.abs(dy) < 30) {
    if ((item.it.x - f.x) * f.face > 0) P.punch = true; else H[toward] = true;
    return ai;
  }
  if (adx > 12) H[toward] = true;
  // 5. at an edge: jump a gap if there is more stage beyond it, otherwise stop
  if (f.ground && (H.left || H.right)) {
    const p = f.ground, nx = f.x + (H.right ? 16 : -16);
    if ((nx < p.cx || nx > p.cx + p.w) && !platBelow(st, nx, f.y - 1)) {
      const beyond = plats.some((q) => !(q.mv && q.mv.lin) && (H.right ? q.cx >= p.cx + p.w - 1 : q.cx + q.w <= p.cx + 1));
      if (beyond) P.up = true; else { H.left = false; H.right = false; }
    }
  }
  return ai;
}
