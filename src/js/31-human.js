
// ---- human paper doll: drawn in feet-origin coordinates (y up, facing +x) ----
function hairDo(L, hx, hy, t) {
  const C = L.hairC || '#222';
  switch (L.hair) {
    case 'bald': px(hx - 2, hy + 4, 2, 1, '#fff'); break;
    case 'short': px(hx - 5, hy + 4, 10, 3, C); px(hx - 5, hy + 1, 1, 3, C); break;
    case 'spiky': px(hx - 5, hy + 4, 10, 3, C); [[-5, 3], [-2, 5], [1, 4], [4, 3], [6, 2]].forEach(([dx, h]) => px(hx + dx, hy + 7, 2, h, C)); px(hx - 6, hy, 1, 4, C); break;
    case 'mohawk': px(hx - 5, hy + 4, 10, 2, '#2a2a2a'); px(hx - 4, hy + 6, 8, 1, C); px(hx - 3, hy + 7, 6, 3, C); px(hx - 2, hy + 10, 4, 2, C); px(hx - 1, hy + 12, 2, 1, C); break;
    case 'curly': px(hx - 6, hy + 3, 12, 4, C); px(hx - 5, hy + 7, 10, 1, C); [-4, 0, 3].forEach((dx) => px(hx + dx, hy + 8, 2, 1, C)); px(hx - 6, hy - 1, 1, 4, C); break;
    case 'bleached': px(hx - 5, hy + 4, 10, 3, C); px(hx - 3, hy + 7, 2, 1, C); px(hx + 1, hy + 7, 2, 1, C); break;
    case 'braids': px(hx - 5, hy + 4, 10, 3, C); px(hx - 8, hy - 6, 2, 11, C); px(hx - 6, hy - 8, 1, 13, C); px(hx - 8, hy - 6, 2, 1, '#ffd54a'); px(hx - 6, hy - 8, 1, 1, '#ffd54a'); break;
    case 'pigtails': px(hx - 5, hy + 4, 10, 3, C); px(hx - 10, hy + 1, 5, 3, C); px(hx + 5, hy + 1, 5, 3, C); px(hx - 6, hy + 1, 1, 3, '#ff2e88'); px(hx + 5, hy + 1, 1, 3, '#ff2e88'); break;
    case 'bob': px(hx - 6, hy + 4, 12, 3, C); px(hx - 6, hy - 4, 2, 9, C); px(hx + 4, hy - 1, 2, 6, C); px(hx - 5, hy + 3, 3, 1, C); break;
    case 'ponytail': px(hx - 5, hy + 4, 10, 3, C); limb(hx - 6, hy + 3, hx - 11, hy - 5, 2, C); break;
    case 'beanie': px(hx - 6, hy + 2, 12, 5, C); px(hx - 6, hy + 2, 12, 1, '#2e2e2e'); break;
  }
}
function drawHuman(f, P, t) {
  const L = f.def.look, skin = L.skin, longS = /suit|jacket|hoodie|coat|bomber|windbreaker|goth/.test(L.top);
  const sleeve = longS ? L.topC : skin, hand = L.gloves || skin, pc = L.pantsC;
  const [hx, hy] = P.head, [sx, sy] = P.sh, [ix, iy] = P.hip, cx = Math.round((sx + ix) / 2);
  const arm = (A, x0, y0) => { limb(x0, y0, A[0][0], A[0][1], 3, sleeve); limb(A[0][0], A[0][1], A[1][0], A[1][1], 3, longS ? sleeve : skin); px(A[1][0] - 2, A[1][1] - 2, 4, 4, hand); };
  const leg = (J, x0, y0) => {
    const w = L.pantsStyle === 'baggy' ? 5 : 4, low = L.pantsStyle === 'shorts' ? skin : L.pantsStyle === 'fishnet' ? '#2b2b2b' : pc;
    limb(x0, y0, J[0][0], J[0][1], w, pc); limb(J[0][0], J[0][1], J[1][0], J[1][1], L.pantsStyle === 'shorts' ? 3 : w, low);
    if (L.pantsStyle === 'patch') px(J[0][0] - 1, J[0][1], 3, 2, '#ffb300');
    px(J[1][0] - 3, J[1][1] - 1, 8, 3, L.shoes);
  };
  if (L.cape) for (let k = 0; k < 16; k++) px(sx - 4 - k * 0.5 - Math.round(Math.sin(t * 0.2 + k * 0.5) * 1.5), sy - 1 - k, 8 + k * 0.5, 1, L.cape);
  if (f.state === 'attack' && f.move && f.move.type === 'wheelie') {   // the bike, front wheel in the air
    circ(-9, 6, 6, '#222'); circ(-9, 6, 3, '#777'); circ(14, 14, 6, '#222'); circ(14, 14, 3, '#777');
    limb(-9, 6, 4, 18, 3, '#c62828'); limb(4, 18, 14, 14, 3, '#c62828'); limb(-9, 6, -2, 20, 3, '#c62828'); px(-4, 20, 12, 4, '#333'); limb(10, 20, 16, 30, 2, '#888');
  }
  arm(P.ba, sx - 2, sy - 1); leg(P.bl, ix - 2, iy);
  // torso follows the lean between hip and shoulder
  const topC = L.top === 'bare' ? skin : L.topC;
  if (L.top === 'coat') limb(ix, iy - 6, sx, sy - 1, 13, L.topC); else limb(ix, iy + 2, sx, sy - 1, 11, topC);
  if (L.top === 'suit') { px(cx - 6, iy + 1, 12, 2, L.top2); px(cx, iy + 3, 1, sy - iy - 4, '#d9b400'); }
  if (L.top === 'jacket') px(cx - 2, iy + 2, 4, sy - iy - 2, L.top2);
  if (L.top === 'vest') { px(cx - 2, iy + 2, 4, sy - iy - 3, skin); px(cx + 3, sy - 6, 3, 3, L.top2); }
  if (L.top === 'tank') { px(cx - 6, sy - 2, 2, 3, skin); px(cx + 4, sy - 2, 2, 3, skin); }
  if (L.top === 'hoodie') { px(hx - 7, hy - 6, 14, 9, L.topC); px(cx - 4, iy + 3, 8, 3, L.top2); px(cx - 1, sy - 4, 2, 4, '#eee'); }
  if (L.top === 'bare' && L.tattoos) { px(cx - 4, sy - 6, 3, 3, L.tattoos); px(cx + 2, iy + 5, 2, 4, L.tattoos); px(P.ba[0][0] - 1, P.ba[0][1] + 2, 2, 3, L.tattoos); }
  if (L.top === 'coat') { px(cx - 5, sy - 8, 2, 7, L.top2); px(cx + 3, sy - 8, 2, 7, L.top2); }
  if (L.top === 'bomber') { px(cx - 6, iy + 1, 12, 2, L.top2); px(cx - 3, sy - 1, 6, 2, L.top2); }
  if (L.top === 'windbreaker') px(cx - 6, iy + 2, 12, Math.round((sy - iy) / 2), L.top2);
  if (L.top === 'goth') { px(cx - 4, iy + 3, 8, 1, L.top2); px(cx - 4, iy + 7, 8, 1, L.top2); px(cx - 4, iy + 11, 8, 1, L.top2); }
  if (L.chain) { px(cx - 4, sy - 4, 8, 1, '#ffd54a'); px(cx - 1, sy - 6, 2, 2, '#ffd54a'); }
  leg(P.fl, ix + 2, iy);
  // head and face
  px(hx - 5, hy - 5, 10, 11, skin);
  hairDo(L, hx, hy, t);
  const angry = f.state === 'attack' || f.state === 'hit';
  px(hx + 2, hy + 1, 2, 1, '#1a1010');
  if (angry) px(hx + 1, hy + 3, 3, 1, L.hairC && L.hair !== 'bald' ? L.hairC : '#3a2a20');
  if (f.state === 'ko' || f.state === 'out') px(hx + 1, hy + 1, 3, 1, '#1a1010');
  px(hx + 2, hy - 2, 2, 1, L.lips || '#5a3020');
  if (L.beard) px(hx - 3, hy - 5, 8, 3, L.beard);
  if (L.glasses) px(hx - 1, hy + 1, 6, 2, '#111');
  if (L.laurel) { px(hx - 5, hy + 3, 10, 1, L.laurel); px(hx - 6, hy + 2, 2, 2, L.laurel); px(hx + 4, hy + 2, 2, 2, L.laurel); }
  if (L.headband) px(hx - 5, hy + 3, 10, 2, L.headband);
  if (L.joint) { px(hx + 4, hy - 2, 4, 1, '#f5f5dc'); px(hx + 8, hy - 2, 1, 1, '#ff6a00'); for (let k = 0; k < 3; k++) px(hx + 9 + Math.round(Math.sin(t * 0.1 + k) * 2), hy + k * 3 + (t / 4 + k * 4) % 12, 1, 1, 'rgba(220,220,220,.6)'); }
  arm(P.fa, sx + 2, sy - 1);
  // auras
  if (L.aura) for (let k = 0; k < 3; k++) px(hx - 8 + ((t * 3 + k * 17) % 16), hy + 8 + ((t * 2 + k * 9) % 10), 1, 1, L.aura);
  if (f.buff.rage) for (let k = 0; k < 8; k++) px(-12 + ((t * 5 + k * 13) % 24), 4 + ((t * 7 + k * 11) % 44), 2, 2, k % 2 ? '#ff3d00' : '#ffb300');
  if (f.buff.speed) for (let k = 0; k < 4; k++) px(-14 - k * 5 - (t % 4), 12 + k * 9, 8, 1, 'rgba(255,255,255,.8)');
}
