
// ---- HUD: percent, stocks, special bar with the cost mark, weapon and buffs ----
function drawHud(t) {
  const M = match;
  const panel = (f, cx) => {
    const x = cx - 74, y = 316, mine = f.slot ? '#3fb8ff' : '#ff9f1c';
    R(x, y, 148, 40, 'rgba(8,8,20,.72)'); R(x, y, 148, 2, mine);
    txt(f.def.name.toUpperCase().slice(0, 14), x + 6, y + 13, 6, '#fff');
    txt(f.ctrl === 'cpu' ? 'CPU' : f.slot ? 'P2' : 'P1', x + 142, y + 13, 6, mine, 'right');
    const p = Math.round(f.pct), col = p < 50 ? '#ffffff' : p < 100 ? '#ffe14d' : p < 150 ? '#ff9f1c' : '#ff4040';
    txt(p + '%', x + 7, y + 35, 16, '#000'); txt(p + '%', x + 6, y + 34, 16, f.dead ? '#666' : col);
    for (let k = 0; k < 3; k++) circ(x + 92 + k * 11, y + 22, 3, k < f.stocks ? mine : '#333');
    const cost = SP[f.def.special[1]].cost, ready = f.meter >= cost;
    R(x + 84, y + 29, 58, 6, '#111'); R(x + 85, y + 30, Math.round(56 * f.meter / 100), 4, ready ? (t % 12 < 6 ? '#fff' : '#ffe14d') : '#7a6a2a');
    R(x + 85 + Math.round(56 * cost / 100), y + 28, 1, 8, '#fff');
    let line = f.weapon ? WEAPONS[f.weapon.id].name.toUpperCase() + ' x' + f.weapon.ammo : '';
    for (const b of [['atk', 'ANGRIFF+'], ['def', 'ABWEHR+'], ['speed', 'TURBO'], ['rage', 'WUT']]) if (f.buff[b[0]]) line += (line ? ' ' : '') + b[1];
    if (line) { txt(line, cx + 1, y - 3, 6, '#000', 'center'); txt(line, cx, y - 4, 6, '#ffe14d', 'center'); }
  };
  panel(M.a, 190); panel(M.b, 450);
  const sec = Math.max(0, Math.ceil(M.timer / 60)), ss = String(sec % 60).padStart(2, '0');
  R(VW / 2 - 26, 6, 52, 18, 'rgba(8,8,20,.72)'); txt(Math.floor(sec / 60) + ':' + ss, VW / 2, 20, 10, sec <= 15 ? '#ff4040' : '#fff', 'center');
  for (const f of [M.a, M.b]) if (!f.dead && f.y > 296) { const X = clamp(f.x, 12, VW - 12), c = f.slot ? '#3fb8ff' : '#ff9f1c'; R(X - 5, 8, 10, 3, c); R(X - 3, 5, 6, 3, c); R(X - 1, 2, 2, 3, c); }
  if (fx.banner) {
    const b = fx.banner, centre = b.side === 2, size = centre ? 24 : 10;
    const x = centre ? VW / 2 : b.side === 0 ? 190 : 450, y = centre ? 150 : 298;
    txt(b.text, x + 2, y + 2, size, '#000', 'center'); txt(b.text, x, y, size, b.t % 8 < 4 ? '#ffe14d' : '#fff', 'center');
  }
}
