function showResult() {
  const M = match, w = M.winner, p1won = w === M.a, btns = $('res-btns'); btns.innerHTML = '';
  const mk = (label, primary, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (primary ? ' primary' : ''); b.textContent = label; b.addEventListener('click', fn); btns.appendChild(b); };
  const score = M.a.kos + ' : ' + M.b.kos + ' K.O.';
  $('res-title').textContent = w.def.name.toUpperCase();
  if (app.mode === 'online') {
    $('res-eyebrow').textContent = 'ONLINE-DUELL · ' + score;
    $('res-text').textContent = (p1won ? 'Der Host' : 'Der Gast') + ' gewinnt mit ' + w.def.name + '.' + (net.role === 'guest' ? ' Warte auf den Host…' : '');
    if (net.role === 'host') {
      mk('REVANCHE', true, () => { newMatch(M.a.def, M.b.def, app.stage, 'net'); netSend({ t: 'start', p1: app.p1, p2: app.p2, s: app.stage }); show('fight'); });
      mk('NEUE KÄMPFER', false, () => { net.hostStage = -1; net.theirPick = -1; net.myPick = -1; netSend({ t: 'again' }); sel.who = 1; renderSelect(); show('select'); });
    }
    mk('VERLASSEN', false, () => { netLeave(); show('title'); });
    show('result'); return;
  }
  if (app.mode === 'arcade') {
    if (p1won && app.ladderIdx >= app.ladder.length - 1) {
      $('res-eyebrow').textContent = 'ARCADE DURCHGESPIELT'; $('res-title').textContent = 'CHAMPION VON ZÜRI';
      $('res-text').textContent = w.def.name + ' hat alle fünf Gegner aus dem Bild gehauen. Die Stadt gehört dir.';
      mk('NOCHMAL VON VORNE', true, () => { sel.who = 1; sel.idx = app.p1; renderSelect(); show('select'); });
    } else if (p1won) {
      $('res-eyebrow').textContent = 'SIEG ' + (app.ladderIdx + 1) + ' VON 5 · ' + score;
      $('res-text').textContent = 'Nächster Gegner: ' + FIGHTERS[app.ladder[app.ladderIdx + 1]].name + ' in der Kulisse ' + STAGES[(app.stage + 1) % STAGES.length].name + '.';
      mk('WEITER', true, nextLadder);
    } else {
      $('res-eyebrow').textContent = 'GAME OVER · ' + score;
      $('res-text').textContent = M.a.def.name + ' hat kein Leben mehr. ' + w.def.name + ' bleibt stehen.';
      mk('REVANCHE', true, () => { newMatch(M.a.def, M.b.def, app.stage, 'cpu'); show('fight'); });
    }
  } else {
    $('res-eyebrow').textContent = 'DUELL ENTSCHIEDEN · ' + score;
    $('res-text').textContent = (p1won ? 'Spieler 1' : 'Spieler 2') + ' gewinnt mit ' + w.def.name + '.';
    mk('REVANCHE', true, () => { newMatch(M.a.def, M.b.def, app.stage, 'p2'); show('fight'); });
  }
  mk('KÄMPFER WECHSELN', false, () => { sel.who = 1; sel.idx = app.p1; renderSelect(); show('select'); });
  mk('MENÜ', false, () => show('title'));
  show('result');
}
$('btn-arcade').addEventListener('click', () => { app.mode = 'arcade'; duel = false; sel.who = 1; sel.idx = app.p1; renderSelect(); show('select'); sfx.sel(); });
$('btn-duel').addEventListener('click', () => { app.mode = 'duel'; duel = true; sel.who = 1; sel.idx = app.p1; renderSelect(); show('select'); sfx.sel(); });
$('hudbtn').addEventListener('click', () => { if (app.mode === 'online') netLeave(); show('title'); });
$('chk-pad').checked = padOn; $('chk-pad').addEventListener('change', (e) => { padOn = e.target.checked; store.set('zr-pad', padOn); });
$('chk-sound').checked = soundOn; $('chk-sound').addEventListener('change', (e) => { soundOn = e.target.checked; store.set('zr-sound', soundOn); });
