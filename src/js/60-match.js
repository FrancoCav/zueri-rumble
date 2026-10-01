
// ---- match flow: three stocks each, three minutes on the clock ----
let match = null;
const app = { screen: 'title', mode: 'arcade', p1: 0, p2: 1, stage: 0, ladder: [], ladderIdx: 0, level: 0, t: 0 };
const NONE = {};
function newMatch(defA, defB, stageIdx, ctrlB) {
  items.length = 0; projs.length = 0; resetFx();
  const stage = STAGES[stageIdx];
  for (const p of stage.plats) p.cx = undefined;
  match = { a: null, b: null, stage, stageIdx, phase: 'intro', pt: 0, timer: 180 * 60, t: 0, winner: null, itemT: 200 };
  placePlats(stage, 0);
  match.a = new Fighter(defA, 'p1', 0); match.b = new Fighter(defB, ctrlB, 1);
  fxq = []; emit('round', 0, 0);
}
function inputFor(f, o) {
  return f.ctrl === 'cpu' ? cpuInput(f, o) : f.ctrl === 'net' ? { held: net.remoteHeld, pressed: net.remotePressed } : { held: held[f.ctrl], pressed: pressed[f.ctrl] };
}
function endMatch(winner, word) { const M = match; M.phase = 'ko'; M.pt = 0; M.winner = winner; emit('banner', 0, 0, word, 110); }
function stepMatch() {
  const M = match, A = M.a, B = M.b; M.t++; M.pt++; fxq = [];
  placePlats(M.stage, M.t);
  if (M.phase === 'intro') {
    stepFighter(A, B, NONE, NONE); stepFighter(B, A, NONE, NONE);
    if (M.pt === 2) emit('banner', 0, 0, 'BEREIT?', 70);
    if (M.pt === 75) emit('banner', 0, 0, 'LOS!', 40);
    if (M.pt >= 85) M.phase = 'fight';
  } else if (M.phase === 'fight') {
    const inA = inputFor(A, B), inB = inputFor(B, A);
    stepFighter(A, B, inA.held, inA.pressed); stepFighter(B, A, inB.held, inB.pressed);
    stepProjs(); stepItems();
    for (const pr of [[A, B], [B, A]]) { const f = pr[0]; if (!f.dead && (f.x < BLAST.l || f.x > BLAST.r || (f.y > BLAST.top && f.state === 'hit') || f.y < BLAST.bottom)) ko(f, pr[1]); }
    if (A.stocks <= 0 || B.stocks <= 0) endMatch(A.stocks > 0 ? A : B, 'GAME!');
    else if (--M.timer <= 0) endMatch(A.stocks !== B.stocks ? (A.stocks > B.stocks ? A : B) : (A.pct <= B.pct ? A : B), 'ZEIT!');
  } else if (M.phase === 'ko') {
    stepFighter(A, B, NONE, NONE); stepFighter(B, A, NONE, NONE); stepProjs();
    const w = M.winner;
    if (M.pt >= 40 && w.state !== 'win' && w.ground && !w.dead && w.state !== 'attack' && w.state !== 'hit') { w.state = 'win'; w.t = 0; w.anim = 0; w.vx = 0; }
    if (M.pt >= 170) { M.phase = 'end'; showResult(); }
  }
  if (!A.dead && !B.dead && A.ground && A.ground === B.ground && Math.abs(A.x - B.x) < 12 && A.state !== 'lifted' && B.state !== 'lifted') { const d = A.x <= B.x ? -0.6 : 0.6; A.x += d; B.x -= d; }
  stepFx();
  pressed.p1 = {}; pressed.p2 = {}; net.remotePressed = {};
}
