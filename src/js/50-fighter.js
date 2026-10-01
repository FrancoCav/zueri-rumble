
// ---- fighters: state and platform physics ----
class Fighter {
  constructor(def, ctrl, slot) { this.def = def; this.ctrl = ctrl; this.slot = slot; this.stocks = 3; this.meter = 0; this.kos = 0; this.weight = def.st.hp / 110; this.spawn(false); }
  spawn(again) {
    this.x = VW / 2 + (this.slot ? 1 : -1) * (again ? 40 : 110); this.y = again ? 250 : 70; this.vx = 0; this.vy = 0; this.face = this.slot ? -1 : 1;
    this.pct = 0; this.state = 'jump'; this.t = 0; this.anim = 0; this.move = null; this.fired = false; this.hitDone = 0; this.nextHit = 0; this.buff = {};
    this.crouch = false; this.inv = again ? 150 : 0; this.ground = null; this.jumps = 1; this.dropT = 0; this.downHold = 0; this.shield = 100; this.freeze = 0;
    this.weapon = null; this.grabbed = null; this.liftY = 0; this.skipOut = false; this.tumble = false; this.bounced = false; this.launched = false;
    this.hitT = 0; this.stunT = 0; this.outT = 0; this.dead = 0; this.ai = null;
  }
  hurt() {
    const low = (this.state === 'down' || this.state === 'out') && this.ground;
    return { x: this.x - 9, y: this.y, w: 18, h: low ? 12 : this.crouch ? 30 : 50 };
  }
}
function leaveGround(f) { f.ground = null; }
function endAttack(f) {
  f.state = f.ground ? 'idle' : 'jump'; f.t = 0; f.move = null; f.crouch = false;
  if (f.weapon && f.weapon.ammo <= 0) f.weapon = null;
}
function land(f, p, vy) {
  f.ground = p; f.y = p.cy; f.vy = 0; f.jumps = 0; f.launched = false;
  if (vy < -3) emit('dust', f.x, f.y);
  if (f.state === 'jump') { f.state = 'idle'; f.t = 0; }
  else if (f.state === 'attack' && f.move && !f.move.sp) endAttack(f);
  else if (f.state === 'hit' && f.tumble) {
    if (vy < -5 && !f.bounced) { f.bounced = true; f.vy = -vy * 0.5; f.ground = null; }      // hard landings bounce once
    else { f.state = 'down'; f.t = 0; f.vx *= 0.4; }
  }
}
function physics(f) {
  if (f.state === 'lifted') return;
  const plats = match.stage.plats;
  if (f.ground) {
    const p = f.ground;
    f.x += f.vx + p.dx; f.y = p.cy;
    if (f.state !== 'walk' && f.state !== 'idle' && f.state !== 'crouch' && !(f.state === 'attack' && f.move && f.move.vx)) f.vx *= 0.84;
    if (f.x < p.cx - 3 || f.x > p.cx + p.w + 3) leaveGround(f);
  } else {
    const floating = f.state === 'attack' && f.move && f.move.float;
    if (!floating) f.vy = Math.max(f.vy - GRAV, -7.5);
    if (f.state === 'hit') f.vx *= 0.985;
    const y0 = f.y; f.x += f.vx; f.y += f.vy;
    if (f.vy <= 0) for (const p of plats) {
      if (f.x >= p.cx - 3 && f.x <= p.cx + p.w + 3 && y0 >= p.cy - 0.01 && f.y <= p.cy && !(f.dropT > 0 && !p.solid)) { land(f, p, f.vy); break; }
    }
    if (!f.ground) for (const p of plats) if (p.solid && f.y < p.cy - 1 && f.x > p.cx && f.x < p.cx + p.w) {
      if (f.y > p.cy - 20 && f.state !== 'hit') { land(f, p, f.vy); break; }                 // almost made it: pull up onto the ledge
      f.x = f.x - p.cx < p.cx + p.w - f.x ? p.cx : p.cx + p.w;
    }
  }
}
