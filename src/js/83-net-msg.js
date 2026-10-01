function netAttach(c) {
  net.conn = c;
  c.on('open', () => { netStatus('Verbunden!'); sfx.round(); app.mode = 'online'; duel = false; sel.who = 1; sel.idx = Math.max(0, net.myPick); renderSelect(); show('select'); });
  c.on('data', netMessage);
  c.on('close', () => netDrop('Verbindung getrennt.'));
  c.on('error', () => netDrop('Verbindungsfehler.'));
}
function netDrop(msg) { if (!net.role) return; netReset(); app.mode = 'arcade'; show('online'); netStatus(msg); }
function netMessage(m) {
  if (!m || typeof m !== 'object') return;
  switch (m.t) {
    case 'in': if (net.role === 'host') { net.remoteHeld = fromBits(m.h | 0); Object.assign(net.remotePressed, fromBits(m.p | 0)); } break;
    case 'pick': net.theirPick = clamp(m.f | 0, 0, FIGHTERS.length - 1); if (net.role === 'host') netMaybeStart(); break;
    case 'start':
      if (net.role === 'guest') {
        app.p1 = clamp(m.p1 | 0, 0, FIGHTERS.length - 1); app.p2 = clamp(m.p2 | 0, 0, FIGHTERS.length - 1); app.stage = clamp(m.s | 0, 0, STAGES.length - 1);
        net.evIn = []; net.lastState = null; newMatch(FIGHTERS[app.p1], FIGHTERS[app.p2], app.stage, 'net'); show('fight');
      }
      break;
    case 'st':
      if (net.role === 'guest') { net.lastState = m; if (Array.isArray(m.ev) && net.evIn.length < 300) for (const e of m.ev) net.evIn.push(e); }
      break;
    case 'again': if (net.role === 'guest') { sel.who = 1; sel.idx = Math.max(0, net.myPick); renderSelect(); show('select'); } break;
    case 'bye': netDrop('Der Gegner hat das Match verlassen.'); break;
    default: break;
  }
}
function netMaybeStart() {
  if (net.role !== 'host' || net.hostStage < 0 || net.theirPick < 0 || net.myPick < 0) return;
  app.p1 = net.myPick; app.p2 = net.theirPick; app.stage = net.hostStage; net.evq = [];
  netSend({ t: 'start', p1: app.p1, p2: app.p2, s: app.stage });
  newMatch(FIGHTERS[app.p1], FIGHTERS[app.p2], app.stage, 'net'); show('fight');
}
// the host sends compact arrays; the guest only draws them
function snapFighter(f) {
  const r1 = (v) => Math.round(v * 10) / 10, m = f.move;
  return [r1(f.x), r1(f.y), f.face, f.state, Math.round(f.t), f.anim, r1(f.pct), Math.round(f.meter), f.stocks, f.crouch ? 1 : 0,
    m ? [m.type, m.pose || '', m.sp ? 1 : 0, m.s, m.a, m.low ? 1 : 0] : 0, Object.keys(f.buff), f.weapon ? [f.weapon.id, f.weapon.ammo] : 0,
    Math.round(f.shield), f.inv > 0 ? 1 : 0, f.dead > 0 ? 1 : 0, f.ground ? match.stage.plats.indexOf(f.ground) : -1, f.tumble ? 1 : 0, r1(f.vx), f.fired ? 1 : 0, f.kos];
}
function netSnapshot() {
  const M = match;
  return { t: 'st', ph: M.phase, tm: M.timer, mt: M.t, w: M.winner === M.a ? 'a' : M.winner === M.b ? 'b' : 0, a: snapFighter(M.a), b: snapFighter(M.b),
    it: items.map((i) => [i.kind, i.id, Math.round(i.x), Math.round(i.y), i.t, i.ground ? 1 : 0]),
    pr: projs.map((p) => [p.type, Math.round(p.x), Math.round(p.y), p.vx, p.col, p.t]), ev: net.evq };
}
