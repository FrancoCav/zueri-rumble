function applyFighter(f, a) {
  if (!Array.isArray(a) || a.length < 21) return;
  const num = (v) => +v || 0;
  f.x = num(a[0]); f.y = num(a[1]); f.face = a[2] < 0 ? -1 : 1; f.state = String(a[3]); f.t = num(a[4]); f.anim = num(a[5]); f.pct = num(a[6]); f.meter = num(a[7]); f.stocks = a[8] | 0; f.crouch = !!a[9];
  f.move = Array.isArray(a[10]) ? { type: String(a[10][0]), pose: String(a[10][1]), sp: !!a[10][2], s: num(a[10][3]), a: num(a[10][4]), low: !!a[10][5] } : null;
  f.buff = {}; if (Array.isArray(a[11])) for (const k of a[11]) f.buff[String(k)] = 1;
  f.weapon = Array.isArray(a[12]) && WEAPONS[a[12][0]] ? { id: String(a[12][0]), ammo: a[12][1] | 0 } : null;
  f.shield = num(a[13]); f.inv = a[14] ? 2 : 0; f.dead = a[15] ? 2 : 0;
  f.ground = match.stage.plats[a[16] | 0] && a[16] >= 0 ? match.stage.plats[a[16] | 0] : null;
  f.tumble = !!a[17]; f.vx = num(a[18]); f.fired = !!a[19]; f.kos = a[20] | 0;
}
function netGuestStep() {
  netSend({ t: 'in', h: toBits(held.p1), p: toBits(pressed.p1), x: Math.round((held.p1.ax || 0) * 100) }); pressed.p1 = {};
  const s = net.lastState, M = match;
  if (s) {
    net.lastState = null;
    M.phase = String(s.ph); M.timer = +s.tm || 0; M.t = +s.mt || 0; M.winner = s.w === 'a' ? M.a : s.w === 'b' ? M.b : null;
    placePlats(M.stage, M.t);
    applyFighter(M.a, s.a); applyFighter(M.b, s.b);
    items.length = 0;
    if (Array.isArray(s.it)) for (const i of s.it.slice(0, 12)) if (Array.isArray(i)) items.push({ kind: String(i[0]), id: String(i[1]), x: +i[2] || 0, y: +i[3] || 0, t: +i[4] || 0, ground: i[5] ? NONE : null });
    projs.length = 0;
    if (Array.isArray(s.pr)) for (const p of s.pr.slice(0, 40)) if (Array.isArray(p)) projs.push({ type: String(p[0]), x: +p[1] || 0, y: +p[2] || 0, vx: +p[3] || 0, col: typeof p[4] === 'string' ? p[4] : '#fff', t: +p[5] || 0 });
  }
  for (const e of net.evIn.splice(0)) if (Array.isArray(e)) playFx(String(e[0]), +e[1] || 0, +e[2] || 0, typeof e[3] === 'string' ? e[3].slice(0, 24) : +e[3] || 0, +e[4] || 0);
  stepFx();
  if (M.phase === 'end' && M.winner && app.screen === 'fight') showResult();
}
$('btn-online').addEventListener('click', () => { sfx.sel(); netReset(); show('online'); netStatus(typeof Peer === 'undefined' ? 'Hier geht der Online-Modus nicht. Öffne das Spiel unter ' + PUBLIC_URL : 'Bereit. Ein Handy eröffnet, das andere tritt bei.'); });
$('btn-host').addEventListener('click', () => { sfx.sel(); netHost(); });
$('join-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const code = $('join-code').value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  if (code.length < 4) { netStatus('Der Code hat vier Zeichen.'); return; }
  sfx.sel(); netJoin(code);
});
$('btn-back3').addEventListener('click', () => { netLeave(); show('title'); });
