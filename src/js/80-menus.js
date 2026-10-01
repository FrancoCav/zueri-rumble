
// ---- menus ----
const screens = { title: $('scr-title'), select: $('scr-select'), stage: $('scr-stage'), result: $('scr-result'), online: $('scr-online') };
let padOn = store.get('zr-pad', null);
if (padOn === null) padOn = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
function show(name) {
  app.screen = name;
  for (const k in screens) screens[k].hidden = k !== name;
  $('hudbtn').hidden = name !== 'fight'; $('fsbtn').hidden = name !== 'fight'; pad.hidden = !(name === 'fight' && padOn); joyZone.hidden = pad.hidden; joyEnd();
  held.p1 = {}; held.p2 = {}; pressed.p1 = {}; pressed.p2 = {};
}
const sel = { who: 1, idx: 0 };
const grid = $('grid'), detail = $('detail');
const SHORT = { kraken: 'Kraken', boogg: 'Böögg', yeti: 'Yeti', gargoyle: 'Gargoyle', taube: 'Taube' };
const tiles = FIGHTERS.map((def, i) => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'tile'; b.appendChild(portrait(def, 32));
  const s = document.createElement('span'); s.textContent = SHORT[def.id] || def.name.split(' ')[0]; b.appendChild(s);
  b.addEventListener('click', () => { sel.idx = i; sfx.sel(); renderSelect(); }); grid.appendChild(b); return b;
});
function renderSelect() {
  tiles.forEach((b, i) => { b.classList.toggle('sel', i === sel.idx && sel.who === 1); b.classList.toggle('sel2', i === sel.idx && sel.who === 2); });
  const def = FIGHTERS[sel.idx], st = def.st, S = SP[def.special[1]];
  $('sel-title').textContent = (app.mode === 'duel' ? 'SPIELER ' + sel.who + ': ' : '') + 'WÄHLE DEINEN KÄMPFER';
  const bar = (v) => '<div class="bar"><i style="width:' + Math.round(clamp(v, 0.1, 1) * 100) + '%"></i></div>';
  detail.innerHTML = ''; detail.appendChild(portrait(def, 48));
  const info = document.createElement('div');
  info.innerHTML = '<h3>' + def.name + '</h3><p class="style">' + def.style + '</p>' +
    '<div class="stats"><span>Kraft</span>' + bar(st.pow / 1.4) + '<span>Tempo</span>' + bar(st.spd / 1.3) + '<span>Gewicht</span>' + bar(st.hp / 140) + '<span>Reichweite</span>' + bar(0.4 + st.reach / 10) + '</div>' +
    '<ul class="moves">' + def.moves.map((m, i) => '<li><span>' + m[0] + '</span><span class="key">' + INPUTS[i] + '</span></li>').join('') + '</ul>' +
    '<div class="special"><b>SPECIAL: ' + def.special[0] + '</b><p>' + S.desc + ' Kostet ' + S.cost + ' % der Special-Leiste.</p></div>';
  detail.appendChild(info);
}
$('btn-confirm').addEventListener('click', () => {
  sfx.sel();
  if (app.mode === 'online') { net.myPick = sel.idx; netSend({ t: 'pick', f: sel.idx }); if (net.role === 'host') show('stage'); else { show('online'); netStatus('Warte auf den Host…'); } return; }
  if (app.mode === 'duel' && sel.who === 1) { app.p1 = sel.idx; sel.who = 2; sel.idx = (sel.idx + 1) % FIGHTERS.length; renderSelect(); return; }
  if (app.mode === 'duel') app.p2 = sel.idx; else app.p1 = sel.idx;
  show('stage');
});
$('btn-back1').addEventListener('click', () => {
  if (app.mode === 'online') { netLeave(); show('title'); return; }
  if (app.mode === 'duel' && sel.who === 2) { sel.who = 1; sel.idx = app.p1; renderSelect(); } else show('title');
});
const sg = $('stagegrid');
STAGES.forEach((s, i) => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'stagetile'; b.appendChild(stageThumb(s));
  const n = document.createElement('span'); n.textContent = s.name; b.appendChild(n);
  const sub = document.createElement('span'); sub.textContent = s.sub; sub.style.cssText = 'color:var(--dim);font-size:14px;text-align:center'; b.appendChild(sub);
  b.addEventListener('click', () => startFight(i)); sg.appendChild(b);
});
$('btn-random').addEventListener('click', () => startFight(Math.floor(Math.random() * STAGES.length)));
$('btn-back2').addEventListener('click', () => show('select'));
function startFight(stageIdx) {
  sfx.sel(); app.stage = stageIdx;
  if (app.mode === 'online') { net.hostStage = stageIdx; show('online'); netStatus(net.theirPick >= 0 ? 'Los geht es…' : 'Warte auf die Wahl des Gegners…'); netMaybeStart(); return; }
  if (app.mode === 'arcade') {
    app.ladder = FIGHTERS.map((_, i) => i).filter((i) => i !== app.p1).sort(() => Math.random() - 0.5).slice(0, 5); app.ladderIdx = 0; app.level = 0;
    newMatch(FIGHTERS[app.p1], FIGHTERS[app.ladder[0]], stageIdx, 'cpu');
  } else newMatch(FIGHTERS[app.p1], FIGHTERS[app.p2], stageIdx, 'p2');
  show('fight');
}
function nextLadder() {
  app.ladderIdx++; app.level = app.ladderIdx; app.stage = (app.stage + 1) % STAGES.length;
  newMatch(FIGHTERS[app.p1], FIGHTERS[app.ladder[app.ladderIdx]], app.stage, 'cpu'); show('fight');
}
