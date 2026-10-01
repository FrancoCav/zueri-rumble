
// ---- which pose a fighter shows right now ----
function attackPose(f) {
  const m = f.move, t = f.t;
  if (m.sp) {
    switch (m.type) {
      case 'beam': return t <= m.s ? POSES.charge : POSES.beam;
      case 'wheelie': return POSES.ride;
      case 'speed': return POSES.sniff;
      case 'rage': case 'explode': return POSES.rage;
      case 'kopfnuss': return t <= m.s - 5 ? POSES.charge : POSES.head;
      case 'psycho': return POSES.psy;
      case 'scream': case 'horn': return POSES.scream;
      case 'storm': return t % 12 < 6 ? POSES.kick : POSES.jkick;
      case 'drain': case 'suplex': return POSES.grab;
      case 'tentacle': return t % 12 < 6 ? POSES.poke : POSES.jab;
      case 'quake': return f.ground && f.fired ? POSES.sweep : POSES.jump;
      case 'divebomb': return t <= m.s ? POSES.fly : POSES.dive;
      case 'bombs': return POSES.fly;
    }
  }
  if (t <= Math.ceil(m.s / 2)) return m.low && f.ground ? POSES.crouch : f.ground ? POSES.idle : POSES.jump;
  return POSES[m.pose] || POSES.jab;
}
function poseFor(f) {
  const t = f.anim;
  switch (f.state) {
    case 'idle': return bob(POSES.idle, t % 40 < 20 ? 0 : -1);
    case 'walk': return walkPose(t, false);
    case 'crouch': return POSES.crouch;
    case 'jump': return POSES.jump;
    case 'attack': return attackPose(f);
    case 'shield': return POSES.block;
    case 'hit': case 'lifted': case 'stun': return POSES.hit;
    case 'down': case 'out': return f.ground ? POSES.down : POSES.hit;
    case 'win': return t % 30 < 15 ? POSES.cheer : bob(POSES.cheer, -2);
  }
  return POSES.idle;
}
// weapon sprite at the front hand (local coordinates, y up, x forward)
function heldWeapon(id, hx, hy) {
  switch (id) {
    case 'katana': limb(hx, hy, hx + 16, hy + 14, 2, '#e6edf5'); px(hx + 15, hy + 14, 2, 2, '#fff'); px(hx - 2, hy - 2, 5, 2, '#5a3a22'); break;
    case 'bat': limb(hx, hy, hx + 12, hy + 12, 3, '#b07a3c'); px(hx + 10, hy + 10, 5, 5, '#c9924e'); break;
    case 'shuriken': px(hx + 2, hy, 7, 1, '#cfd6df'); px(hx + 5, hy - 3, 1, 7, '#cfd6df'); px(hx + 4, hy - 1, 3, 3, '#8a929c'); break;
    case 'laser': px(hx - 1, hy - 1, 12, 4, '#2e8b9a'); px(hx + 11, hy, 3, 2, '#ff4040'); px(hx, hy - 4, 3, 3, '#1c5c66'); break;
    case 'shotgun': px(hx - 4, hy - 1, 7, 4, '#6b4a2b'); px(hx + 3, hy, 16, 3, '#2b2b2b'); break;
    case 'grenade': circ(hx + 3, hy + 2, 3, '#3c7a3c'); px(hx + 2, hy + 5, 2, 2, '#ccc'); break;
    case 'bazooka': px(hx - 10, hy + 1, 30, 6, '#5a6b3a'); px(hx + 18, hy, 4, 8, '#3d4a26'); px(hx - 12, hy, 3, 8, '#3d4a26'); break;
  }
}
function drawFighter(f, t) {
  if (f.dead > 0) return;
  const X = Math.round(f.x), Y = Math.round(GY - f.y);
  const gp = f.ground || (match && platBelow(match.stage, f.x, f.y));
  if (gp) { const sw = clamp(20 - (f.y - gp.cy) / 8, 6, 20); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(Math.round(X - sw / 2), GY - gp.cy - 1, Math.round(sw), 2); }
  if (f.inv > 0 && f.state !== 'win' && Math.floor(t / 3) % 2 === 0) ctx.globalAlpha = 0.4;
  const spin = f.state === 'hit' && f.tumble && !f.ground ? Math.floor(f.t / 5) % 4 : 0;
  ctx.setTransform(1, 0, 0, 1, X, Y - 25);
  if (spin) ctx.rotate(spin * Math.PI / 2 * (f.vx >= 0 ? 1 : -1));
  ctx.scale(f.face, -1); ctx.translate(0, -25);
  const P = poseFor(f);
  if (f.def.look.body) drawMonster(f, P, t); else drawHuman(f, P, t);
  if (f.weapon) heldWeapon(f.weapon.id, P.fa[1][0], P.fa[1][1]);
  if (f.buff.atk) for (let k = 0; k < 4; k++) px(-12 + ((t * 3 + k * 11) % 24), 6 + ((t * 5 + k * 17) % 46), 2, 2, '#ff9f1c');
  if (f.buff.def) for (let k = 0; k < 6; k++) px(Math.round(Math.cos(t * 0.1 + k) * 14), 26 + Math.round(Math.sin(t * 0.1 + k) * 26), 2, 2, '#3fb8ff');
  if (f.state === 'stun') for (let k = 0; k < 3; k++) px(-8 + Math.round(Math.cos(t * 0.2 + k * 2.1) * 9), 54 + Math.round(Math.sin(t * 0.2 + k * 2.1) * 2), 2, 2, '#ffe14d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (f.state === 'shield') { ctx.beginPath(); ctx.arc(X, Y - 25, 14 + f.shield * 0.16, 0, 6.2832); ctx.fillStyle = 'rgba(63,184,255,.25)'; ctx.fill(); ctx.strokeStyle = 'rgba(190,230,255,.9)'; ctx.lineWidth = 1; ctx.stroke(); }
}
// ---- offscreen renders for the menus: portraits and stage thumbnails ----
function withCtx(c2, fn) { const old = ctx; ctx = c2; try { fn(); } finally { ctx = old; } }
function portrait(def, size) {
  const c = document.createElement('canvas'); c.width = size; c.height = size;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  const fake = { def, state: 'idle', anim: 0, t: 0, y: 0, face: 1, buff: {}, move: null };
  withCtx(g, () => {
    ctx.fillStyle = def.grp === 'x' ? '#1d2a3a' : def.grp === 'f' ? '#3a1d2e' : '#2a1d3a'; ctx.fillRect(0, 0, size, size);
    ctx.setTransform(1, 0, 0, -1, Math.round(size / 2) - 1, size + 22);
    if (def.look.body) drawMonster(fake, POSES.idle, 0); else drawHuman(fake, POSES.idle, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });
  return c;
}
function stageThumb(stage) {
  const c = document.createElement('canvas'); c.width = VW; c.height = VH;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  withCtx(g, () => { placePlats(stage, 0); stage.bg(0); drawPlats(stage); });
  return c;
}
