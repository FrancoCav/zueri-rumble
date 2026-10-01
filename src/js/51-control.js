
// ---- one simulation frame for a fighter: H = held inputs, Pd = inputs pressed this frame ----
function stepFighter(f, o, H, Pd) {
  if (f.dead > 0) { if (--f.dead === 0 && f.stocks > 0) f.spawn(true); return; }
  if (f.freeze > 0) { f.freeze--; return; }
  f.t++; f.anim++;
  if (f.inv > 0) f.inv--;
  if (f.dropT > 0) f.dropT--;
  for (const k in f.buff) if (--f.buff[k] <= 0) delete f.buff[k];
  f.meter = Math.min(100, f.meter + 0.05);
  if (f.state !== 'shield') f.shield = Math.min(100, f.shield + 0.25);
  const maxV = 1.9 * f.def.st.spd * (f.buff.speed ? 1.4 : 1), dir = (H.right ? 1 : 0) - (H.left ? 1 : 0), onG = !!f.ground;
  const free = f.state === 'idle' || f.state === 'walk' || f.state === 'crouch' || f.state === 'jump';
  if (free) {
    if (dir) f.face = dir;
    if (Pd.special && f.meter >= SP[f.def.special[1]].cost) startSpecial(f);
    else if (Pd.punch) startMove(f, f.weapon && !H.down ? 'weapon' : H.down ? 1 : 0);
    else if (Pd.kick) startMove(f, H.down ? 3 : 2);
    else if (H.block && onG && f.shield > 12) { f.state = 'shield'; f.t = 0; }
    else if (Pd.up && (onG || f.jumps < (f.launched ? 3 : 2))) {            // a launched fighter gets one extra rescue jump
      f.vy = onG ? JUMP_V : JUMP2_V; f.jumps = onG ? 1 : Math.max(f.jumps, 1) + 1; if (!onG && dir) f.vx = dir * maxV * 1.15;
      emit('jump', f.x, f.y); leaveGround(f); f.state = 'jump'; f.t = 0; f.crouch = false;
    }
  }
  switch (f.state) {
    case 'idle': case 'walk': case 'crouch':
      if (!f.ground) { f.state = 'jump'; break; }
      f.crouch = !!H.down;
      if (f.crouch) {
        f.state = 'crouch'; f.vx *= 0.7;
        if (++f.downHold > 14 && !f.ground.solid) { f.dropT = 16; f.y -= 2; leaveGround(f); f.state = 'jump'; f.downHold = 0; f.crouch = false; }   // drop through
      } else {
        f.downHold = 0;
        if (dir) { f.vx = clamp(f.vx + dir * 0.32, -maxV, maxV); f.state = 'walk'; }
        else { f.vx *= 0.7; if (Math.abs(f.vx) < 0.1) f.vx = 0; f.state = 'idle'; }
      }
      break;
    case 'jump':
      if (f.ground) { f.state = 'idle'; break; }
      if (dir) f.vx = clamp(f.vx + dir * 0.21, -maxV * 1.15, maxV * 1.15); else f.vx *= 0.985;
      if (H.down && f.vy < 0) f.vy -= 0.22;                                  // fast fall
      break;
    case 'attack': stepAttack(f, o); break;
    case 'shield':
      f.shield -= 0.45;
      if (f.shield <= 0) { f.shield = 35; f.state = 'stun'; f.t = 0; f.stunT = 110; emit('break', f.x, f.y + 30); }
      else if (!H.block || !f.ground) { f.state = f.ground ? 'idle' : 'jump'; f.t = 0; }
      break;
    case 'hit': if (f.t >= f.hitT) { f.state = f.ground ? 'idle' : 'jump'; f.t = 0; f.tumble = false; } break;
    case 'down': if (!f.ground) f.state = 'jump'; else if (f.t >= 30) { f.state = 'idle'; f.t = 0; f.inv = 24; f.tumble = false; } break;
    case 'out': if (f.t >= f.outT) { f.state = f.ground ? 'idle' : 'jump'; f.t = 0; } break;
    case 'stun': if (f.t >= f.stunT) { f.state = f.ground ? 'idle' : 'jump'; f.t = 0; } break;
    default: break;
  }
  physics(f);
}
