
// ---- stages: fixed camera, 640x360. plats: x = left end, y = height of the walkable top (world, y up), solid = thick ground block,
//      mv = moving platform, hide = the stage paints it itself ----
function hexLerp(a, b, t) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const ch = (s) => Math.round(((A >> s) & 255) + (((B >> s) & 255) - ((A >> s) & 255)) * t); return 'rgb(' + ch(16) + ',' + ch(8) + ',' + ch(0) + ')'; }
function bands(c1, c2, n, h) { const bh = Math.ceil(h / n); for (let i = 0; i < n; i++) R(0, i * bh, VW, bh, hexLerp(c1, c2, i / (n - 1))); }
function windows(x, y, w, h, cols, rows, lit, dark, seed) {
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const on = ((i * 7 + j * 13 + seed) % 5) < 2; R(x + 4 + i * ((w - 6) / cols), y + 5 + j * ((h - 6) / rows), 3, 5, on ? lit : dark); }
}
function placePlats(stage, t) {
  for (const p of stage.plats) {
    let x = p.x;
    if (p.mv) { if (p.mv.lin) x = p.mv.from + (t * p.mv.lin) % (p.mv.to - p.mv.from); else x = p.x + Math.sin(t / p.mv.period * 6.2832) * p.mv.ax; }
    p.dx = p.cx === undefined ? 0 : x - p.cx; if (Math.abs(p.dx) > 20) p.dx = 0;
    p.cx = x; p.cy = p.y;
  }
}
function platBelow(stage, x, y) { let best = null; for (const p of stage.plats) if (x >= p.cx && x <= p.cx + p.w && p.cy <= y + 0.5 && (!best || p.cy > best.cy)) best = p; return best; }
function drawPlats(stage) {
  const top = stage.col[0], body = stage.col[1], edge = stage.col[2];
  for (const p of stage.plats) {
    if (p.hide) continue;
    const X = Math.round(p.cx), Y = GY - p.cy;
    if (p.solid) { R(X, Y, p.w, VH - Y, body); R(X, Y, p.w, 5, top); R(X, Y + 5, p.w, 2, edge); for (let x = X + 14; x < X + p.w - 12; x += 28) R(x, Y + 14 + (x % 3) * 10, 10, 2, edge); }
    else { R(X, Y, p.w, 6, top); R(X + 2, Y + 6, p.w - 4, 2, edge); R(X + 6, Y + 8, 2, 4, edge); R(X + p.w - 8, Y + 8, 2, 4, edge); }
  }
}
const STAGES = [
  { name: 'Grossmünster', sub: 'Limmatquai, zwei Simse und die Turmbrücke', col: ['#b9b2a3', '#7d776b', '#5e594f'],
    plats: [{ x: 90, y: 0, w: 460, solid: true }, { x: 120, y: 64, w: 110 }, { x: 410, y: 64, w: 110 }, { x: 255, y: 128, w: 130 }],
    bg(t) {
      bands('#8fc7ff', '#e9f1ff', 8, 250);
      for (let i = 0; i < 8; i++) { R(i * 96 - 40, 200, 96, 50, '#9fb7c9'); R(i * 96 - 24, 188, 64, 12, '#9fb7c9'); R(i * 96 - 8, 180, 32, 8, '#9fb7c9'); }
      for (let i = 0; i < 7; i++) { const x = i * 100 - 30; if (x > 150 && x < 420) continue; R(x, 176, 84, 74, '#c8b9a2'); R(x, 168, 84, 8, '#8a4b3a'); windows(x, 176, 84, 70, 5, 4, '#f3e2a8', '#5a4a3a', i); }
      const tower = (x) => { R(x, 84, 36, 166, '#d8d2c4'); R(x + 30, 84, 6, 166, '#b8b0a0'); for (let j = 0; j < 6; j++) { R(x + 8, 96 + j * 24, 4, 9, '#4a4034'); R(x + 20, 96 + j * 24, 4, 9, '#4a4034'); } R(x - 2, 78, 40, 6, '#5f8f7a'); R(x + 4, 66, 28, 12, '#5f8f7a'); R(x + 10, 56, 16, 10, '#5f8f7a'); R(x + 15, 42, 6, 14, '#5f8f7a'); R(x + 17, 32, 2, 10, '#c9a227'); };
      R(282, 150, 76, 100, '#c9c3b5'); R(282, 144, 76, 7, '#7a6a55'); R(310, 196, 20, 54, '#4a4034'); tower(248); tower(356);
      R(0, 250, VW, 110, '#3f7fb5'); for (let i = 0; i < 40; i++) R(((i * 53 + t * 0.4) % (VW + 30)) - 15, 256 + (i * 13) % 96, 7, 1, '#7fb4dc');
    } },
  { name: 'Hardbrücke', sub: 'Strasse, Container, Haltestelle und die Brücke obendrüber', col: ['#8a8a99', '#33333d', '#22222a'],
    plats: [{ x: 60, y: 0, w: 520, solid: true }, { x: 150, y: 104, w: 340 }, { x: 70, y: 52, w: 96 }, { x: 474, y: 52, w: 96 }],
    bg(t) {
      bands('#2b1a4e', '#ff8a4c', 9, 300);
      R(0, 300, VW, 60, '#140f24'); R(0, 338, VW, 2, '#3a3350'); R(0, 348, VW, 2, '#3a3350');       // the rail yard far below
      circ(520, 214, 26, '#ffb347');
      for (let i = 0; i < 9; i++) { const x = i * 76 - 20, h = 60 + (i * 37) % 70; R(x, 260 - h, 52, h + 40, '#3a2a55'); windows(x, 260 - h, 52, h, 4, Math.floor(h / 14), '#ffd27a', '#2a1d40', i); }
      R(250, 36, 62, 264, '#2f5d4a'); for (let j = 0; j < 9; j++) R(254 + j * 7, 36, 3, 264, '#3e7a62'); R(250, 36, 62, 7, '#1f3f32'); R(250, 26, 40, 10, '#2f5d4a');
      R(478, 248, 88, 26, '#c62828'); R(478, 274, 88, 26, '#1565c0'); R(478, 248, 88, 2, '#111'); R(478, 274, 88, 2, '#111'); R(520, 250, 2, 50, '#111');
      R(78, 254, 4, 46, '#666'); R(154, 254, 4, 46, '#666'); R(90, 264, 56, 3, '#8a4b3a');
      R(200, 204, 10, 96, '#5a5a66'); R(430, 204, 10, 96, '#5a5a66');
      const tx = ((t * 0.9) % 900) - 140; R(tx, 174, 110, 22, '#1e5bc6'); R(tx, 178, 110, 8, '#dfe8ff'); for (let k = 0; k < 7; k++) R(tx + 6 + k * 15, 179, 9, 6, '#9ec2ff');
    } },
